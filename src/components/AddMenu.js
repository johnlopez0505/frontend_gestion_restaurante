import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import API from '../components/axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import { useAuth } from '../context/AuthProvider';

const AddMenu = () => {
    
    const [menuData, setMenuData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '', 
    });

    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const { state ,menus, setMenus} = useAuth();
    const [error, setError] = useState('');
    const userId = state.user?.id;
    const [base64, setBase64] = useState(null);
    const [img,setImg] = useState(null);

    const handleChange = (name, value) => {
        setMenuData({ ...menuData, [name]: value });
    };

    const handleChooseImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Se necesitan permisos para acceder a la galería de imágenes.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            const uri =  result.assets[0].uri
            setImg(uri);
            setMenuData(prevData => ({
                ...prevData,
                imagen: uri // Actualiza la propiedad de la imagen con la nueva URI
            }));
            if(Platform.OS !== 'web'){
                // Leer el archivo de imagen y convertir a Base64
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setImg(uri);
                //source={{ uri: 'data:image/jpeg;base64,' + asset.base64 }}
                setBase64(base64);
                setMenuData({...menuData,imagen:'data:image/jpeg;base64,'+ base64});
            }

        }
    
    };

    const handleTakePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Se necesitan permisos para acceder a la cámara.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImg(uri);
            setMenuData(prevData => ({
                ...prevData,
                imagen: uri
            }));
            if (Platform.OS !== 'web') {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                setBase64(base64);
                setMenuData(prevData => ({
                    ...prevData,
                    imagen: 'data:image/jpeg;base64,' + base64
                }));
            }
        }
    };

    useEffect(() => {
        // console.log(menuData); // Verificar la URL de la imagen después de actualizar el estado
    }, [menuData.imagen]);


    const handleCancel = () => {
        navigation.navigate('Home'); // Asegúrate de que 'Home' es el nombre de la ruta de tu página principal
    };

    const handleSubmit = async () => {
        if (!menuData.nombre && !menuData.descripcion && !menuData.precio && !menuData.imagen) {
            setError('Por favor, ingrese todos los campos');
            return;
          }
        if (!menuData.nombre) {
            setError('Por favor, ingrese el nombre del menú');
            return;
        }
        if (!menuData.descripcion ) {
            setError('Por favor, ingrese la descripción del menú');
            return;
        }
        if (!menuData.precio) {
            setError('Por favor, ingrese el precio del menú');
            return;
        }
        if (!menuData.imagen) {
            setError('Por favor, ingrese la imagen del menú');
            return;
        }
        try {
            await API.post('/menus/add', { ...menuData }, { 
                headers: {
                    'id': userId
                } 
            }); 
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error al añadir el menú", error);
        }
    };

    useEffect(() => {
        setError(null); 
      }, [menuData.nombre, menuData.descripcion, menuData.precio, menuData.imagen]);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Añadir un nuevo Menú</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    value={menuData.nombre}
                    onChangeText={(text) => handleChange('nombre', text)}
                    placeholder="Nombre"
                    required
                />
                <TextInput
                    style={styles.input}
                    value={menuData.descripcion}
                    onChangeText={(text) => handleChange('descripcion', text)}
                    placeholder="Descripcion"
                    required
                />
                <TextInput
                    style={styles.input}
                    value={menuData.precio}
                    onChangeText={(text) => handleChange('precio', text)}
                    placeholder="Precio"
                    required
                />
                 {error ? <Text style={styles.error}>{error}</Text> : null}
                <View style={styles.buttonContainer}>
                    {Platform.OS !== 'web'?(
                    <>
                        <TouchableOpacity style={styles.buttonSelect} onPress={handleChooseImage}>
                            <Text style={styles.buttonText}>Seleccionar imagen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonFoto} onPress={handleTakePhoto}>
                            <Text style={styles.buttonText}>Tomar foto</Text>
                        </TouchableOpacity>

                    </>
                       
                    ):(  
                        <TouchableOpacity style={styles.buttonSelect} onPress={handleChooseImage}>
                            <Text style={styles.buttonText}>Seleccionar imagen</Text>
                        </TouchableOpacity>
                    )}
                   
                </View>
                <View >
                    {menuData.imagen ? (
                        <Image source={{ uri: img }} style={styles.imagen} />
                    ) : (
                        <View style={{ margin:'auto', marginBottom:10 }}><Text>No image selected</Text></View>
                    )}
                </View >
              
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Añadir Menú</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButtonCancelar} onPress={handleCancel}>
                        <Text style={styles.submitButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       marginTop:30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        width: Platform.OS !== 'web' ? '100%' : '40%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    descriptionInput: {
        height: 100,
    },

    imagen:{
        width: 200,
        height: 200,
        margin:'auto',
       borderRadius: 5,
       marginTop:10,
       marginBottom:10,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent:Platform.OS !=='web'? 'space-between':'space-around',
        alignItems: 'center',
        marginBottom: 10,
        marginTop:10,
        width:'85%',
        alignSelf:'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        width:150,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },

    buttonSelect: {
        backgroundColor: '#007BFF',
        width:'55%',
        padding: 10,
        borderRadius: 8,
    },

    buttonFoto:{
        backgroundColor: '#007BFF',
        width:'40%',
        padding: 10,
        borderRadius: 8,
    },

    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        width:'45%',
        alignSelf:'center',
    },

    submitButtonCancelar: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
        width:'45%',
        alignSelf:'center',
    },

    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        margin:'auto',
    },
});

export default AddMenu;

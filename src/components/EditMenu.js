import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import API from '../components/axios';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; 
import { useAuth } from '../context/AuthProvider';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Loading from './Loading';

const EditMenu = () => {

    const route = useRoute();
    const { menu } = route.params;    
    const [menuData, setMenuData] = useState({
        nombre: menu.nombre,
        descripcion: menu.descripcion,
        precio: menu.precio,
        imagen: "", 
    });

    const navigation = useNavigation(); 
    const { state ,menus, setMenus,setLoading,loading} = useAuth();
    const userId = state.user?.id;
    const [error, setError] = useState('');
    const [base64, setBase64] = useState(null);
    const [img,setImg] = useState(null);

    useEffect (() => {
        setImg(menu.imagen);
    },[menu.imagen])

    useEffect (() => {
        setMenuData({
            nombre: menu.nombre,
            descripcion: menu.descripcion,
            precio: menu.precio,
            imagen:"",
        })
    },[menu])

    
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
        //console.log(menuData); // Verificar la URL de la imagen después de actualizar el estado
    }, [menuData.imagen]);

    const handleCancel = () => {
        navigation.navigate('Carta'); // Asegúrate de que 'Home' es el nombre de la ruta de tu página principal
    };


    const handleSubmit = async () => {
        if (!menuData.nombre && !menuData.descripcion && !menuData.precio 
           && !menuData.imagen) {
            setError('Por favor, ingrese todos los campos');
            return;
          }
        if (!menuData.nombre) {
            setError('Por favor, ingrese el nombre del menú');
            return;
        }
        if (!menuData.descripcion ) {
            setError('Por favor, ingrese la descripción');
            return;
        }
        if (!menuData.precio) {
            setError('Por favor, ingrese el precio');
            return;
        }
       

        try {
            setLoading(true);
            const putResponse = await API.put(`/menus/edit/${menu.id}`, { ...menuData }, { 
            });
            if(putResponse.data.result === 'ok'){
                 // Después de editar, obtén la lista actualizada de menus desde la base de datos
                const response = await API.get('/menus');
                if(response.data.result === 'ok'){
                    // Ordenar los menus por id de menor a mayor
                    const sortedMenus = response.data.menus.sort((a, b) => a.id - b.id);
                    // Actualizar el estado con la lista de menus ordenada
                    setMenus(sortedMenus);
                    navigation.navigate('Carta');
                }else{
                    console.error(response.data.message);
                }
               
            }else{
                setError(putResponse.data.message);
            } 
               
        } catch (error) {
            setError(error.putResponse?.data?.message || error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(null); 
      }, [menuData.nombre, 
            menuData.descripcion, 
            menuData.precio,
            menuData.imagen
        ]
    );


    

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Editar Menú</Text>
            {loading ? ( <Loading />
            ) : 
            (<View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <FontAwesome5 name="utensils" color="#777" style={styles.icon} /> 
                    <TextInput
                        style={styles.input}
                        value={menuData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                        placeholder="Nombre"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome5 name="file-alt" color="#777" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={menuData.descripcion}
                        onChangeText={(text) => handleChange('descripcion', text)}
                        placeholder="Descripción"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FontAwesome5 name="dollar-sign" color="#777" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={String(menuData.precio)}
                        onChangeText={(text) => handleChange('precio', text)}
                        placeholder="Precio"
                        keyboardType= {Platform.select({
                            ios:'numbers-and-punctuation',
                            android:'number-pad'
                        })}
                    />
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <FontAwesome6 name="edit" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.submitButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButtonCancelar} onPress={handleCancel}>
                            <FontAwesome5 name="times" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.submitButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonSelect} onPress={handleChooseImage}>
                            <FontAwesome5 name="image" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Imagen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonFoto} onPress={handleTakePhoto}>
                            <FontAwesome5 name="camera" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Foto</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.containerImagen}>
                        {img ?  (
                            <Image source={{ uri: img }} style={styles.imagen} contentFit="cover" />
                        ) : (
                            <View style={{ marginVertical: 10 }}><Text>No image selected</Text></View>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#eef5f9', // Cambio de color de fondo del formulario
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center', // Alineación del texto central
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    buttonSelect: {
        backgroundColor: '#49beb7', // Verde azulado suave
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft:33,
        borderRadius: 8,
        width: '48%', // Cambia el ancho para que quepan dos botones en una fila
    },
    buttonFoto: {
        backgroundColor: '#f47a60', // Naranja brillante
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft:42,
        borderRadius: 8,
        width: '48%', // Cambia el ancho para que quepan dos botones en una fila
    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#27ae60', // Verde oscuro
        padding: 15,
        paddingLeft:25,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row', // Alinea el icono con el texto
        width: '48%', // Cambia el ancho para que quepan dos botones en una fila
    },
    submitButtonCancelar: {
        backgroundColor: '#e74c3c', // Rojo oscuro
        padding: 15,
        paddingLeft:22,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row', 
        width: '48%', 
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5, 
    },
    error: {
        textAlign:'center',
        color: 'red',
        marginBottom: 10,
    },
    containerImagen: {
        alignItems: 'center',
    },
    imagen: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding:'auto'
    },
    icon: {
        marginRight: 5,
        backgroundColor:'white',
        fontSize:20,
        paddingHorizontal:5,
        borderRadius:5,
        paddingVertical:5
    },
    input: {
        flex:1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        
        
    },
});
   
export default EditMenu;
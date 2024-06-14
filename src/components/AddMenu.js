import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import API from '../components/axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import { useAuth } from '../context/AuthProvider';
import Loading from './Loading';
import { FontAwesome5 } from '@expo/vector-icons';

const AddMenu = ({route}) => {
    
    const [menuData, setMenuData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '', 
    });

    const { restaurante } = route.params;
    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const { state ,menus, setMenus} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const userId = state.user?.id;
    const [base64, setBase64] = useState(null);
    const [img,setImg] = useState(null);

    const handleChange = (name, value) => {
        if (name === 'precio') {
            value = value.replace(',', '.');  // Reemplaza cualquier coma por un punto
        }
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
        navigation.navigate('Detalles del restaurante',{restaurante:restaurante});
        limpiarFormulario();
        setError(null); 
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

        // Verificar y corregir el precio
        const precioCorregido = menuData.precio.replace(',', '.');
        const menuDataCorregido = { ...menuData, precio: precioCorregido };

        
        try {
            setLoading(true);
            const response = await API.post('/menus/add', { ...menuData }, { 
                headers: {
                    'id': restaurante.id
                } 
            }); 
            if (response.data.result === 'ok') {
                setMenus([...menus, response.data.menus]);
                limpiarFormulario();
                navigation.navigate('Carta Restaurante',{restaurante:restaurante});
            }else{
                setError(response.data.message || 'Error al añadir el menú');
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Error al añadir el menú", error);
            setError(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(null); 
      }, [menuData.nombre, menuData.descripcion, menuData.precio, menuData.imagen]);

      const limpiarFormulario = () => {
        // Limpiar el formulario después de enviar los datos exitosamente
        setMenuData({
            nombre: '',
            descripcion: '',
            precio: '',
            imagen: '', 
        });
        setImg(null);
        setBase64(null);
    } 

    return (

        <View style={styles.container}>
            <Text style={styles.heading}>Añadir un nuevo Menú</Text>
            {loading ? (<Loading/>
                ) : (
                 <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={menuData.nombre}
                            onChangeText={(text) => handleChange('nombre', text)}
                            placeholder="Nombre"
                        />
                    </View>
                
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={menuData.descripcion}
                            onChangeText={(text) => handleChange('descripcion', text)}
                            placeholder="Descripcion"
                        />
                    </View>
                
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={menuData.precio}
                            onChangeText={(text) => handleChange('precio', text)}
                            placeholder="Precio"
                            keyboardType="numeric"  // Asegura que el teclado numérico aparezca
                            />
                    </View>
                 
                  {error ? <Text style={styles.error}>{error}</Text> : null}
                  <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <FontAwesome5 name="plus" size={20} color="white" style={{ marginRight: 8 }} /> 
                            <Text style={styles.submitButtonText}>Añadir</Text>
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
                        {menuData.imagen !== "" ?  (
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

export default AddMenu;

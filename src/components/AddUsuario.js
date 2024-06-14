import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import API from '../components/axios';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import { useAuth } from '../context/AuthProvider';
import { validarTelefono } from '../validation/validation';
import { FontAwesome5 } from '@expo/vector-icons';
import Loading from './Loading';

const AddUsuario = () => {
    
    const [usuarioData, setUsuarioData] = useState({
        fullName: '',
        username: '',
        telefono: '',
        password: '',
        imagen: '', 
    });

    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const { state ,usuarios, setUsuarios, role } = useAuth();
    const [loading, setLoading] = useState(false);
    const userId = state.user?.id;
    const [error, setError] = useState('');
    const [base64, setBase64] = useState(null);
    const [img,setImg] = useState(null);

    
    const handleChange = (name, value) => {
        setUsuarioData({ ...usuarioData, [name]: value });
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
            setUsuarioData(prevData => ({
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
                setUsuarioData({...usuarioData,imagen:'data:image/jpeg;base64,'+ base64});
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
            setUsuarioData(prevData => ({
                ...prevData,
                imagen: uri
            }));
            if (Platform.OS !== 'web') {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setBase64(base64);
                setUsuarioData(prevData => ({
                    ...prevData,
                    imagen: 'data:image/jpeg;base64,' + base64
                }));
            }
        }
    };

    useEffect(() => {
        console.log(usuarioData);
    }, [usuarioData.imagen]);

    const handleCancel = () => {
        navigation.navigate('Usuarios'); 
        limpiarFormulario();
        
    };


    const handleSubmit = async () => {
        if (!usuarioData.fullName && !usuarioData.username && !usuarioData.password 
            && !usuarioData.telefono && !usuarioData.imagen) {
            setError('Por favor, ingrese todos los campos');
            return;
          }
        if (!usuarioData.fullName) {
            setError('Por favor, ingrese el nombre del usuario');
            return;
        }
        if (!usuarioData.username ) {
            setError('Por favor, ingrese el email');
            return;
        }
        if (!usuarioData.password) {
            setError('Por favor, ingrese la contraseña');
            return;
        }
        if (!usuarioData.telefono ) {
            setError('Por favor, ingrese el telefono del restaurante');
            return;
        }
        if (!validarTelefono(usuarioData.telefono.trim())) {
            setError('El número de teléfono no es válido.');
            return;
        }

        if (!usuarioData.imagen) {
            setError('Por favor, ingrese la imagen');
            return;
        }
       

        try {
            let endPoint = "";
           switch(role){
            case 'admin':
                endPoint = '/auth/register/admin';
                break;
            case 'usuario':
                endPoint = '/auth/register';
                break;
            case 'empresario':
                endPoint = '/auth/register/empresario';
                break;
            default:
                break;
           }
            setLoading(true); // Activa el estado de carga al pulsar el botón "Añadir"
            const response = await API.post(endPoint, { ...usuarioData }, { 
                headers: {
                    'id': userId
                } 
            }); 
            if(response.data.result === 'ok'){
                setUsuarios([...usuarios, response.data.usuarios]);
                navigation.navigate('Usuarios');
                limpiarFormulario();
            }else{
                setError(response.data.message || 'Error al añadir el usuario');
                console.log(response.data.message);
            } 
        } catch (error) {
            console.error("Error al añadir el usuario", error);
            setError(error.response?.data?.message);
        }finally{
            setLoading(false); // Desactiva el estado de carga al finalizar la operación
        }
    };

    useEffect(() => {
        setError(null); 
      }, [usuarioData.fullName, 
        usuarioData.username, 
        usuarioData.password,
        usuarioData.telefono, 
        usuarioData.imagen
        ]);

    const limpiarFormulario = () => {
        // Limpiar el formulario después de enviar los datos exitosamente
        setUsuarioData({
            fullName: '',
            username: '',
            password: '',
            telefono: '',
            imagen: '', 
        });
        setImg(null);
        setBase64(null);
    } 

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Nuevo Usuario</Text>
            {loading ? (
                <Loading />
            ) : (
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="user"  color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={usuarioData.fullName}
                            onChangeText={(text) => handleChange('fullName', text)}
                            placeholder="Nombre"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="envelope"  color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={usuarioData.username}
                            onChangeText={(text) => handleChange('username', text)}
                            placeholder="Email"
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="phone"  color="#777" style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            value={usuarioData.telefono}
                            onChangeText={(text) => handleChange('telefono', text)}
                            placeholder="Teléfono"
                            keyboardType= {Platform.select({
                                ios:'numbers-and-punctuation',
                                android:'number-pad'
                            })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="lock"  color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={usuarioData.password}
                            onChangeText={(text) => handleChange('password', text)}
                            placeholder="Password"
                            secureTextEntry={true}
                            keyboardType= {Platform.select({
                                ios:'numbers-and-punctuation',
                                android:'number-pad'
                            })}
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
                        {usuarioData.imagen !== "" ? (
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
        marginRight: 10,
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

export default AddUsuario;



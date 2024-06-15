import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, Switch } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import API from './axios';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; 
import { validarTelefono } from '../validation/validation';
import { useAuth } from '../context/AuthProvider';
import { useRoute } from '@react-navigation/native';
import Loading from './Loading';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';


const EditUsuario = () => {

    const route = useRoute();
    const { usuario } = route.params;    
    const [usuarioData, setUsuarioData] = useState({
        fullName: usuario.fullName,
        username: usuario.username,
        provincia: usuario.provincia,
        enabled: usuario.enabled,
        telefono: usuario.telefono,
        imagen: "", 
    });

    const navigation = useNavigation(); 
    const { state ,usuarios, setUsuarios} = useAuth();
    const userId = state.user?.id;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [base64, setBase64] = useState(null);
    const [img,setImg] = useState(null);
    const [isEnabled, setIsEnabled] = useState(usuarioData.enabled);


    useEffect(() => {
        setIsEnabled(usuarioData.enabled);
    }, [usuarioData]);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        handleChange('enabled', !usuarioData.enabled);
    };

    useEffect (() => {
        setImg(usuario.imagen);
    },[usuario.imagen])

    useEffect (() => {
        setUsuarioData({
            fullName: usuario.fullName,
            username: usuario.username,
            provincia: usuario.provincia,
            enabled: usuario.enabled,
            telefono: usuario.telefono,
            imagen: "", 
        })
    },[usuario])
    
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
        //console.log(usuarioData); 
    }, [usuarioData.imagen]);

    const handleCancel = () => {
        navigation.navigate('Usuarios'); 
    };


    const handleSubmit = async () => {
        if (!usuarioData.fullName && !usuarioData.username && !usuarioData.enabled 
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
    
        if (!usuarioData.telefono ) {
            setError('Por favor, ingrese el telefono del usuario');
            return;
        }
        if (!validarTelefono(usuarioData.telefono.trim())) {
            setError('El número de teléfono no es válido.');
            return;
        }

        try {
            setLoading(true);
        
            // Enviar la solicitud PUT para editar el usuario
            const putResponse = await API.put(`/usuarios/edit/${usuario.id}`, { ...usuarioData }, { 
                headers: {
                    'id': usuario.id 
                } 
            });
        
        
            if (putResponse.data.result === "ok") {
                // Obtener la lista actualizada de usuarios
                const getResponse = await API.get(`/usuarios`);
                
                if (getResponse.data.result === 'ok') {
                    // Ordenar los usuarios por id de menor a mayor
                    const sortedUsuarios = getResponse.data.usuarios.sort((a, b) => a.id - b.id);
                    // Actualizar el estado con la lista de usuarios ordenada
                    setUsuarios(sortedUsuarios);
                    // Navegar a la pantalla de Usuarios
                    navigation.navigate('Usuarios');
                } else {
                    // Manejar el error de la solicitud GET
                    setError(getResponse.data.message);
                }
            } else {
                // Manejar el error de la solicitud PUT
                setError(putResponse.data.message);
                console.error(putResponse.data.message);
            }
        } catch (error) {
            // Manejar cualquier error durante las solicitudes
            console.error("Error al editar el usuario", error);
            setError("Error al editar el usuario");
        } finally {
            setLoading(false);
        }
    }

    
    useEffect(() => {
        setError(null); 
      }, [usuarioData.fullName, 
            usuarioData.username, 
            usuarioData.enabled,
            usuarioData.telefono, 
            usuarioData.imagen
        ]
    );


    

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Editar usuario</Text>
            {loading ? (
                <Loading />
            ) : (
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="user" color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={usuarioData.fullName}
                            onChangeText={(text) => handleChange('fullName', text)}
                            placeholder="Nombre"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="envelope" color="#777" style={styles.icon} />
                        <TextInput
                            style={[styles.input, styles.nonEditableInput]}
                            value={usuarioData.username}
                            placeholder="Email"
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="phone" color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={usuarioData.telefono}
                            onChangeText={(text) => handleChange('telefono', text)}
                            placeholder="Teléfono"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name={isEnabled ? "toggle-on" : "toggle-off"} color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={usuarioData.enabled ? 'true' : 'false'}
                            onChangeText={(text) => handleChange('enabled', text)}
                            placeholder="Enabled"
                        />
                        <Switch
                            trackColor={{ false: "#A4A4A4", true: "#D8D8D8" }}
                            thumbColor={usuarioData.enabled ? "#A9F5BC" : "#F5A9A9"}

                            onValueChange={toggleSwitch}
                            value={usuarioData.enabled}
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
                        {img ? (
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
        backgroundColor: '#eef5f9',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
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
        backgroundColor: '#49beb7',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft: 33,
        borderRadius: 8,
        width: '48%',
    },
    buttonFoto: {
        backgroundColor: '#f47a60',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft: 42,
        borderRadius: 8,
        width: '48%',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#27ae60',
        padding: 15,
        paddingLeft: 25,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        width: '48%',
    },
    submitButtonCancelar: {
        backgroundColor: '#e74c3c',
        padding: 15,
        paddingLeft: 22,
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
        textAlign: 'center',
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
        padding: 'auto',
    },
    icon: {
        marginRight: 10,
        backgroundColor: 'white',
        fontSize: 20,
        paddingHorizontal: 5,
        borderRadius: 5,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    nonEditableInput: {
        backgroundColor: '#f0f0f0', // Color de fondo para campos no editables
        color: '#a0a0a0', // Color de texto para campos no editables
    },
});

export default EditUsuario;
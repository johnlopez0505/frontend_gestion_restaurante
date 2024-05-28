import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet,Image, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API from '../components/axios';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import { useAuth } from '../context/AuthProvider';
import { formatearTelefono, validarTelefono } from '../validation/validation';
import Loading from './Loading';

const AddRestaurante = () => {
    
    const [restauranteData, setRestauranteData] = useState({
        nombre: '',
        ciudad: '',
        provincia: '',
        telefono: '',
        imagen: '', 
    });

    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const { state ,restaurantes, setRestaurantes, loading, setLoading} = useAuth();
    const userId = state.user?.id;
    const [error, setError] = useState('');
    const [base64, setBase64] = useState(null);
    const [img,setImg] = useState(null);

    
    const handleChange = (name, value) => {
        setRestauranteData({ ...restauranteData, [name]: value });
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
            setRestauranteData(prevData => ({
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
                setRestauranteData({...restauranteData,imagen:'data:image/jpeg;base64,'+ base64});
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
            setRestauranteData(prevData => ({
                ...prevData,
                imagen: uri
            }));
            if (Platform.OS !== 'web') {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setBase64(base64);
                setRestauranteData(prevData => ({
                    ...prevData,
                    imagen: 'data:image/jpeg;base64,' + base64
                }));
            }
        }
    };

    useEffect(() => {
        console.log(restauranteData); // Verificar la URL de la imagen después de actualizar el estado
    }, [restauranteData.imagen]);

    const handleCancel = () => {
        navigation.navigate('Restaurantes'); // Asegúrate de que 'Home' es el nombre de la ruta de tu página principal
    };


    const handleSubmit = async () => {
        if (!restauranteData.nombre && !restauranteData.ciudad && !restauranteData.provincia 
            && !restauranteData.telefono && !restauranteData.imagen) {
            setError('Por favor, ingrese todos los campos');
            return;
          }
        if (!restauranteData.nombre) {
            setError('Por favor, ingrese el nombre del restaurante');
            return;
        }
        if (!restauranteData.ciudad ) {
            setError('Por favor, ingrese la ciudad');
            return;
        }
        if (!restauranteData.provincia) {
            setError('Por favor, ingrese la provincia');
            return;
        }
        if (!restauranteData.telefono ) {
            setError('Por favor, ingrese el telefono del restaurante');
            return;
        }
        if (!validarTelefono(restauranteData.telefono.trim())) {
            setError('El número de teléfono no es válido. Debe tener 9 dígitos y comenzar por 6, 7 u 9');
            return;
        }
        const telefonoFormateado = formatearTelefono(restauranteData.telefono);
        setRestauranteData({ ...restauranteData, telefono: telefonoFormateado });

        if (!restauranteData.imagen) {
            setError('Por favor, ingrese la imagen del restaurante');
            return;
        }
       

        try {
            setLoading(true); // Activa el estado de carga al pulsar el botón "Añadir"
            await API.post('/restaurantes/add', { ...restauranteData }, { 
                headers: {
                    'id': userId
                } 
            }); 
            setLoading(false); // Desactiva el estado de carga al finalizar la operación
            setRestaurantes([...restaurantes, restauranteData]);
            navigation.navigate('Restaurantes');
        } catch (error) {
            console.error("Error al añadir el restaurante", error);
            setLoading(false); // Desactiva el estado de carga al finalizar la operación
        }
    };

    useEffect(() => {
        setError(null); 
      }, [restauranteData.nombre, 
            restauranteData.ciudad, 
            restauranteData.provincia,
            restauranteData.telefono, 
            restauranteData.imagen
        ]);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Añadir un nuevo restaurante</Text>
            {loading ? ( // Si isLoading es true, muestra el indicador de carga
                <Loading />
                ) : 
                ( 
                    <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        value={restauranteData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                        placeholder="Nombre"
                        required
                    />
                    <TextInput
                        style={styles.input}
                        value={restauranteData.ciudad}
                        onChangeText={(text) => handleChange('ciudad', text)}
                        placeholder="Ciudad"
                        required
                    />
                    <TextInput
                        style={styles.input}
                        value={restauranteData.provincia}
                        onChangeText={(text) => handleChange('provincia', text)}
                        placeholder="Provincia"
                        required
                    />
                    <TextInput
                        style={styles.input}
                        value={restauranteData.telefono}
                        onChangeText={(text) => handleChange('telefono', text)}
                        placeholder="Teléfono"
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
                        {restauranteData.imagen ? (
                            <Image source={{ uri: img }} style={styles.imagen} />
                        ) : (
                            <View style={{ margin:'auto', marginBottom:10 }}><Text>No image selected</Text></View>
                        )}
                    </View >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Añadir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButtonCancelar} onPress={handleCancel}>
                            <Text style={styles.submitButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}
           
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
        width:200,
        height: Platform.OS !== 'android' ? 200 : 150,
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

    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
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

export default AddRestaurante;

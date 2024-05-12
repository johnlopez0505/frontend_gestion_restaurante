import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import API from '../components/axios';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import { useAuth } from '../context/AuthProvider';

const AddRestaurante = () => {
    
    const [restauranteData, setRestauranteData] = useState({
        nombre: '',
        ciudad: '',
        provincia: "",
        telefono: "",
        imagen: null, 
    });

    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const { state ,restaurantes, setRestaurantes} = useAuth();
    const userId = state.user?.id;

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

        console.log(result);

        if (!result.canceled) {
            setRestauranteData({ ...restauranteData, imagen: result.uri });
        }
    
    };

    const handleSubmit = async () => {
        try {
            await API.post('/restaurantes/add', { ...restauranteData }, { 
                headers: {
                    'id': userId
                } 
            }); 
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error al añadir el restaurante", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Añadir un nuevo restaurante</Text>
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
                {/* <TextInput
                    style={styles.input}
                    value={restauranteData.imagen}
                    onChangeText={(text) => handleChange('imagen', text)}
                    placeholder="Url de la Imagen"
                    required
                /> */}
                 <Button title="Seleccionar imagen" onPress={handleChooseImage} />
                {restauranteData.imagen && <Image source={{ uri: restauranteData.imagen }} style={{ width: 200, height: 200 }} />}
               
                <Button title="Añadir restaurante" onPress={handleSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
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
});

export default AddRestaurante;

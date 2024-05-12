import React, { useState } from 'react';
import { View, Text, TextInput, Picker, Button, StyleSheet } from 'react-native';
import API from '../components/axios';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import { useAuth } from '../context/AuthProvider';

const AddMenu = () => {
    
    const [menuData, setMenuData] = useState({
        nombre: '',
        descripcion: '',
        precio: "",
        imagen: '', 
    });

    const navigation = useNavigation(); // Obtiene el objeto de navegación
    const { state ,menus, setMenus} = useAuth();
    const userId = state.user?.id;

    const handleChange = (name, value) => {
        setMenuData({ ...menuData, [name]: value });
    };

    const handleSubmit = async () => {
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
               
                <TextInput
                    style={styles.input}
                    value={menuData.imagen}
                    onChangeText={(text) => handleChange('imagen', text)}
                    placeholder="Url de la Imagen"
                    required
                />
               
                <Button title="Añadir Menú" onPress={handleSubmit} />
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

export default AddMenu;

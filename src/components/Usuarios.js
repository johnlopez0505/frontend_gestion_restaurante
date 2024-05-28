import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Usuarios = ({ usuario }) => {

    const handlerDelete = () => {
        console.log("oprimimos delete usuarioID: " + usuario.id);
    }

    const handlerEdit = () => {
        console.log("oprimimos edit usuarioID: " + usuario.id);
    }

    return (
        <Card style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: usuario.imagen }} style={styles.image} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.text}>ID: {usuario.id}</Text>
                <Text style={styles.text}>Nombre Completo: {usuario.fullName}</Text>
                <Text style={styles.text}>Nombre de Usuario: {usuario.username}</Text>
                <Text style={styles.text}>Habilitado: {usuario.enable ? 'Sí' : 'No'}</Text>
                <Text style={styles.text}>Rol: {usuario.rol}</Text>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name='delete' style={styles.icon} onPress={handlerDelete} />
                    <MaterialCommunityIcons name='pencil' style={styles.icon} onPress={handlerEdit} />
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    infoContainer: {
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    icon: {
        fontSize: 24,
    },
});

export default Usuarios;

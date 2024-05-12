import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';


const Restaurant = ({restaurant}) => {
    return (
        <View style={styles.containerCard}>
            <View style={styles.imgContainer} key={restaurant.id}>
                <Image source={{ uri: restaurant.imagen }} style={styles.imagen} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{restaurant.nombre}</Text>
                <Text style={styles.text}>{restaurant.ciudad}</Text>
                <Text style={styles.text}>{restaurant.provincia}</Text>
                <Text style={styles.text}>{restaurant.telefono}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
  containerCard: {
    width:Platform.OS !== 'web'? '80%':'30%',
    marginBottom: 20,
    padding: 10,
    margin:10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 9,
    elevation: 5,
    shadowOpacity: 0.8,
    flexDirection: 'row', // Alinea la imagen y el texto en una fila
  },
  imgContainer: {
    width: '40%', // Ajusta el ancho de la imagen
    marginRight: '5%', // Espacio entre la imagen y el texto
  },
  imagen: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  textContainer: {
    width: '55%', // Ajusta el ancho del contenedor de texto
  },
  text: {
    textAlign: 'center',
    marginBottom: 5,
  },
});

  

export default Restaurant;

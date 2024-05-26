import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';


const Menu = ({menu}) => {
    return (
        <View style={styles.containerCard}>
            <View style={styles.imgContainer} key={menu.id}>
                <Image source={{ uri: menu.imagen }} style={styles.imagen} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{menu.nombre}</Text>
                <Text style={styles.text}>{menu.descripcion}</Text>
                <Text style={styles.text}>{menu.precio}</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
  containerCard: {
    width:Platform.OS !== 'web'? '85%':'30%',
    marginBottom: 20,
    padding: 0,
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
    overflow: Platform.OS === 'android' ? 'hidden' : "",
  },

  imgContainer: {
    width: '45%', // Ajusta el ancho de la imagen
    height: '100%',
    margin: 'auto',
  },

  imagen: {
    width: '100%',
    height: 150,
    borderTopStartRadius: Platform.OS !== 'android' ? 18 : 0,
    borderBottomStartRadius:  Platform.OS !== 'android' ? 18 : 0,
   
  
  },

  textContainer: {
    width: '55%', // Ajusta el ancho del contenedor de texto
    height: '100%',
    margin: Platform.OS === 'ios' ? 'auto' : 0,
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
  },

  text: {
    textAlign: 'center',
    marginBottom: 5,
  },
});
  

export default Menu;
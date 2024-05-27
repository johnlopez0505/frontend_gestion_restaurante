import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {  Dialog, Portal } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import API from './axios';

const Restaurant = ({restaurant}) => {

  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const {setRestaurantes, restaurantes,state} = useAuth();
  const userId = state.user?.id;
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handlerDelete = async () => {
    try {
      const response = await API.delete(`/restaurantes/delete/${restaurant.id}`,{ 
          headers: {
              'id': userId
          } 
      }); 
      if(response.data.result ==="ok"){
        console.log(response.data.message);
        const updatedRestaurante = restaurantes.filter(restaurante => restaurante.id !== restaurant.id);
        setRestaurantes(updatedRestaurante);
        navigation.navigate('Restaurantes');
      }else{
        console.log(response.data.message);
      }
      
  } catch (error) {
      console.error("Error al eliminar el restaurante", error);
  }
    hideDialog();
  }
  const handlerEdit = () => {
    navigation.navigate('Edit restaurante', { restaurante: restaurant });
  }
    return (
        <View style={styles.containerCard} key={restaurant.id}>
            <View style={styles.imgContainer} >
                <Image source={{ uri: restaurant.imagen }} style={styles.imagen} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{restaurant.nombre}</Text>
                <Text style={styles.text}>{restaurant.ciudad}</Text>
                <Text style={styles.text}>{restaurant.provincia}</Text>
                <Text style={styles.text}>{restaurant.telefono}</Text>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name='delete' style={styles.delete} onPress={showDialog}/>
                  <MaterialCommunityIcons name='pencil' style={styles.edit} onPress={handlerEdit}/>
                </View>
            </View>
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog} dismissable={false} style={styles.dialog}>
                <Dialog.Title style={styles.dialogTitle}>Confirmación</Dialog.Title>
                <Dialog.Content style={styles.dialogContent}>
                  <Text style={styles.dialogText}>¿Estás seguro de que quieres eliminar este restaurante?</Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.dialogActions}>
                    <TouchableOpacity style={styles.submitButton} onPress={handlerDelete}>
                        <Text style={styles.submitButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButtonCancelar} onPress={hideDialog}>
                        <Text style={styles.submitButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </Dialog.Actions>
              </Dialog>
            </Portal>
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
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },

  delete: {
    fontSize:30,
    color:'black',
  },

  edit:{
    fontSize:30,
    color:'black',
  },

  dialog: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  dialogTitle: {
    textAlign: 'center',
    color: '#333',
  },
  dialogContent: {
    alignItems: 'center',
  },
  dialogText: {
    fontSize: 16,
    color: '#555',
  },
  dialogActions: {
    justifyContent: 'space-between',
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

});

  

export default Restaurant;

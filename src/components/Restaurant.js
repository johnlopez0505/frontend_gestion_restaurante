import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal } from 'react-native';
import { Image } from 'expo-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import API from './axios';
import Toast from 'react-native-toast-message';

const Restaurant = ({restaurant}) => {

  const navigation = useNavigation();
  const {setRestaurantes, restaurantes,state,setLoading,setFavoritos,favoritos } = useAuth();
  const userId = state.user?.id;
  const isFavorite = favoritos.some((fav) => fav.id === restaurant.id); 
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


  const handlerDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmed = async() => {
    setLoading(true);
    try {
        const response = await API.delete(`/restaurantes/delete/${restaurant.id}`,{ 
            headers: {
                'id': userId
            } 
        });
        if(response.data.result ==="ok"){
          const updatedRestaurante = restaurantes.filter(restaurante => restaurante.id !== restaurant.id);
          setRestaurantes(updatedRestaurante);
          navigation.navigate('Restaurantes');
        }else{
          setError(response.data.message);
          console.log(response.data.message);
        }
    } catch (error) {
        console.error("Error al eliminar el restaurante", error);
        setError("Error al eliminar el restaurante", error);
    }finally {
      setLoading(false);
    }
    setShowDeleteConfirmation(false);
  };


  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };


  const handlerEdit = () => {
    navigation.navigate('Edit restaurante', { restaurante: restaurant });
  }

  const showMap = async() => {
    console.log("entre a showMap");
    navigation.navigate('Map',{restaurante: restaurant})
  };

  const handlerFavoritos = () => {
    if (!isFavorite) {
      setFavoritos([...favoritos, restaurant]);
      Toast.show({
        type: 'success',
        text1: 'Favoritos',
        text2: `${restaurant.nombre} ha sido agregado a favoritos.`,
        position: 'center'
      });
    } else {
      const updatedFavoritos = favoritos.filter(fav => fav.id !== restaurant.id);
      setFavoritos(updatedFavoritos);
      Toast.show({
        type: 'info',
        text1: 'Favoritos',
        text2: `${restaurant.nombre} ha sido eliminado de favoritos.`,
        position: 'center'
      });
    }
  };

  const handleCall = async () => {
    // Verificamos si el dispositivo tiene la capacidad de realizar llamadas
    const canMakePhoneCall = await Linking.canOpenURL('tel:');
    if (!canMakePhoneCall) {
      console.warn('El dispositivo no puede realizar llamadas telefónicas.');
      return;
    }

    // Verificamos que el número de teléfono esté disponible
    if (!restaurant.telefono) {
      console.warn('No se proporcionó un número de teléfono.');
      return;
    }
    // Creamos el número de teléfono con el prefijo 'tel:'
    const phoneNumber = `tel:${restaurant.telefono}`;
    // Abre la aplicación de teléfono con el número de teléfono
    Linking.openURL(phoneNumber)
      .then(() => console.log('Se abrió la aplicación de teléfono'))
      .catch(error => console.error('Error al abrir la aplicación de teléfono', error));
  };

  

  return (
    <>
      <View style={styles.containerCard} key={restaurant.id}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('Detalles del restaurante',  { restaurante: restaurant })}>
            <Image source={{uri: restaurant.imagen}} style={styles.imagen} />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{restaurant.nombre}</Text>
          <Text style={styles.text}>{restaurant.ciudad}</Text>
          <Text style={styles.text}>{restaurant.provincia}</Text>
          <Text style={styles.text}>{restaurant.telefono}</Text>
          <Text style={styles.text}>{restaurant.direccion}</Text>
  
          <View style={styles.iconContainer}>
            {state.user?.rol === 'admin' || state.user?.rol === 'empresario' ? (
              <>
                <MaterialCommunityIcons name='delete' style={styles.icon} onPress={handlerDelete}/>
                <MaterialCommunityIcons name='phone' style={styles.icon} onPress={handleCall}/>
                <MaterialCommunityIcons name="google-maps" style={styles.icon} onPress={showMap} />
                <MaterialCommunityIcons name='pencil' style={styles.icon} onPress={handlerEdit}/>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="google-maps" style={styles.icon} onPress={showMap} />
                <AntDesign name={isFavorite ? "heart" : "hearto"} style={styles.favorito} onPress={handlerFavoritos}/>
                <MaterialCommunityIcons name='phone' style={styles.icon} onPress={handleCall}/>
              </>
            )}
          </View>
        </View>
        <Modal visible={showDeleteConfirmation} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¿Estás seguro de eliminar este restaurante?</Text>
              <Text>Nombre: {restaurant.nombre}</Text>
              <Text>Ciudad: {restaurant.ciudad}</Text>
              <Text>Provincia: {restaurant.provincia}</Text>
              <Text>Teléfono: {restaurant.telefono}</Text>
              <Text>Dirección: {restaurant.direccion}</Text>
  
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity onPress={handleDeleteConfirmed} style={[styles.modalButton, styles.deleteButton]}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelDelete} style={[styles.modalButton, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  containerCard: {
    width:Platform.OS !== 'web'? '90%':'45%',
    height:Platform.select({
      android: 170,
      ios: 170,
      web: 250,
    }),
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
    flexDirection: 'row',
    overflow:  'hidden',
  },

  textContainer: {
    width: '55%',
    height: '100%',
    justifyContent: 'center',
  },

  text: {
    textAlign: 'center',
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Platform.select({
      android: 5,
      ios: 10,
      web: 30,
    }),
  },

  icon: {
    fontSize:30,
    color:'black',
  },

  favorito:{
    fontSize:30,
    color:'red',
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

  imageWrapper: {
    width: '45%', // Ajusta el ancho de la imagen
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web:{
        borderRadius: 0,
        height: 200,
      }
    }),
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'red',
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

  

export default Restaurant;

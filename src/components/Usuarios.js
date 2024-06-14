import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal } from 'react-native';
import { Image } from 'expo-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import API from './axios';

const Usuarios = ({ usuario }) => {

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const {state, setLoading, usuarios, setUsuarios } = useAuth();
    const userId = state.user?.id;
    const [error, setError] = useState(null);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false); 
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


    const handlerDelete = () => {
      setShowDeleteConfirmation(true);
    };
  
    const handleDeleteConfirmed = async() => {
      setLoading(true);
      try {
          const response = await API.delete(`/usuarios/delete/${usuario.id}`,{ 
              headers: {
                  'id': userId
              } 
          });
          if(response.data.result ==="ok"){
            console.log(response.data.message);
            const updatedUsuario = usuarios.filter(user => user.id !== usuario.id);
            setUsuarios(updatedUsuario);
            navigation.navigate('Usuarios');
          }else{
            setError(response.data.message);
          }
      } catch (error) {
          setError("Error al eliminar el restaurante", error);
      }finally {
        hideDialog();
        setLoading(false);
      }
      setShowDeleteConfirmation(false);
    };
  
    const handleCancelDelete = () => {
      setShowDeleteConfirmation(false);
    };


    const handlerEdit = () => {
      navigation.navigate('Edit usuario', { usuario: usuario });
    }

    return (
      <>
       <View style={styles.containerCard} key={usuario.id}>
          <View style={styles.imageWrapper} >
              <Image source={{uri: usuario.imagen} } style={styles.imagen}/>
          </View>
          <View style={styles.textContainer}>
              <Text style={styles.text}>ID: {usuario.id}</Text>
              <Text style={styles.text}>Nombre: {usuario.fullName}</Text>
              <Text style={styles.text}>Username: {usuario.username}</Text>
              <Text style={styles.text}>Habilitado: {usuario.enabled ? 'Sí' : 'No'}</Text>
              <Text style={styles.text}>Rol: {usuario.rol}</Text>
              <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name='delete' style={styles.icon} onPress={handlerDelete} />
                  <MaterialCommunityIcons name='pencil' style={styles.icon} onPress={handlerEdit} />
              </View>
          </View>
        
          <Modal visible={showDeleteConfirmation} transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>¿Estás seguro de eliminar este usuario?</Text>
                <Text>{`Nombre:  ${usuario.fullName}`}</Text>
                <Text>{`Username:  ${usuario.username}`}</Text>
                <Text>{`Habilitado:  ${usuario.enabled? 'Sí' : 'No'}`}</Text>
                <Text>{`Rol:  ${usuario.rol}`}</Text>

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
}

const styles = StyleSheet.create({
  containerCard: {
    width:Platform.OS !== 'web'? '90%':'45%',
    height:Platform.select({
      android: 160,
      ios: 150,
      web: 200,
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
    backgroundColor:'white',
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

export default Usuarios;

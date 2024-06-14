import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const { state, updateUser } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = React.useState(state.user.name);
  const [email, setEmail] = React.useState(state.user.email);
  const [imagen, setImagen] = React.useState(state.user?.imagen);

  const handleSubmit = () => {
    updateUser({ name, email });
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.navigate('Profile');
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
            //setBase64(base64);
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
              //setBase64(base64);
              setRestauranteData(prevData => ({
                  ...prevData,
                  imagen: 'data:image/jpeg;base64,' + base64
              }));
          }
      }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
      />

      <View style={styles.containerImagen}>
          {imagen ? (
              <Image source={{ imagen }} style={styles.imagen} />
          ) : (
              <View style={{ margin:'auto', marginBottom:10 }}><Text>No image selected</Text></View>
          )}
      </View >

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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5359D1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

  containerImagen:{
    alignItems:'center',
  },

  imagen:{
      width:200,
      height: Platform.select({
          android: 150,
          ios: 150,
          web: 200,
      }), 
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
      backgroundColor: '#5359D1',
      width:'55%',
      padding: 10,
      borderRadius: 8,
  },

  buttonFoto:{
      backgroundColor: '#5359D1',
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

});

export default EditProfile;

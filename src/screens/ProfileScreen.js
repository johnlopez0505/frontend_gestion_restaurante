import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '../context/AuthProvider'; // Ajusta la ruta según tu estructura de carpetas
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { state, logout } = useAuth();
  const navigation = useNavigation();
  const user = state.user;

  const handleEditProfile = () => {
    navigation.navigate('EditProfile'); // Asumiendo que tienes una pantalla EditProfile
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // Asumiendo que tienes una pantalla ChangePassword
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {user?.imagen !== "" ? ( <Image
          source={user?.imagen}
          style={styles.profileImage}/>
        ):(
        <Image source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/images-70046.appspot.com/o/2d099352-334c-4acb-9604-2ba039fa06da.png?alt=media"}}
          style={styles.profileImage}/>
        )}
        <Text style={styles.profileName}>{user?.fullName}</Text>
        <Text style={styles.profileEmail}>{user?.username}</Text>
        <Text style={styles.profileEmail}>{user?.telefono}</Text>
        <Text >Rol_{user?.rol}</Text>
      </View>
    
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 18,
    color: '#666',
  },
  button: {
    backgroundColor: '#5359D1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;

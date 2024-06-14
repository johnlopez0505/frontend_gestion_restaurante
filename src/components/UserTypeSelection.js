import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';

const UserTypeSelection = () => {

  const {setRole} = useAuth();
  const navigation = useNavigation();

  
  const handleUserTypeSelection = (userType) => {
     setRole(userType)
     navigation.navigate('Add usuario');
     console.log(userType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Selecciona el tipo de usuario a crear</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleUserTypeSelection('usuario')}
      >
        <Text style={styles.optionText}>Usuario Normal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleUserTypeSelection('empresario')}
      >
        <Text style={styles.optionText}>Empresario</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleUserTypeSelection('admin')}
      >
        <Text style={styles.optionText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eef5f9',
  },
  heading: {
    marginTop:50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 100,
    color: '#333',
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#49beb7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserTypeSelection;

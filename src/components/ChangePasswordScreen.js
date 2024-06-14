import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const { state, changePassword } = useAuth();
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      changePassword({ oldPassword, newPassword });
      navigation.goBack();
    } else {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder="Contraseña actual"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nueva contraseña"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirmar nueva contraseña"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
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
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChangePasswordScreen;

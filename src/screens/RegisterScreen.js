import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { validateEmail } from '../validation/validation';

function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { register, state } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!username || !password || !fullName) {
      setError('Por favor, complete todos los campos');
      return;
    }

    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!validateEmail(username)) {
      setError('El email no es válido');
      return;
    }

    register(username, password, fullName);
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      navigation.navigate('/');
    }
    if (state.loginError) {
      setError(state.loginError);
    }
  }, [state, navigation]);

  useEffect(() => {
    setError('');
  }, [username, password, password2, fullName]);

  return (
    <View style={styles.registerFormContainer}>
      <View style={styles.registerForm}>
        <Text style={styles.title}>Crear cuenta</Text>
        <View style={styles.formControl}>
          <Text>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View style={styles.formControl}>
          <Text>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            keyboardType="username-address"
          />
        </View>
        <View style={styles.formControl}>
          <Text>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.formControl}>
          <Text>Repetir Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  registerFormContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  registerForm: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    width: '100%',
    maxWidth: 400,
    borderRadius: 30,
    shadowRadius: 7,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  formControl: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});

export default RegisterScreen;

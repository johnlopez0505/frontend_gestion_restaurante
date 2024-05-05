import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { validateEmail } from '../validation/validation';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, state: { isAuthenticated, loginError } } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('ListRestaurant');
    }
    if (loginError) {
      setError(loginError);
    }
  }, [isAuthenticated, loginError, navigation]);

  useEffect(() => {
    setError('');
  }, [username, password]);

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Por favor, ingrese el usuario y la contraseña');
      return;
    }

    if (!validateEmail(username)) {
      setError('El username no es válido');
      return;
    }

    login(username, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginForm}>
        <Text style={styles.title}>Iniciar Sesión</Text>
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
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginForm: {
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

export default LoginScreen;

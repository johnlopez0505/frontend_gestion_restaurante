import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { validateEmail } from '../validation/validation';
import Loading from '../components/Loading';
import API from '../components/axios';

const  RegisterScreen = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async() => {
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

    try {
      setLoading(true); 
      let endpoint = '';
      if(role === 'usuario'){
          endpoint = '/auth/register'
      }
      if(role === 'empresario'){
        endpoint = '/auth/register/empresario'
      }
      console.log("entramos en guardar usuario")
      const response = await API.post(endpoint, { username, password, fullName });
      console.log(response.data.result);
      if(response.data.result === 'ok'){
        console.log(response.data.message);
        navigation.navigate('Login');
      }else{
        setError(response.data.message || 'Error al registrarse' );
        console.log(response.data.message);
      }
     
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrarse' );
    }finally{
      setLoading(false); 
    }
  };

  useEffect(() => {
    setError('');
  }, [username, password, password2, fullName]);

  return (
    <KeyboardAvoidingView
     behavior={Platform.OS === 'ios' ? 'padding' : null}
     style={styles.registerFormContainer}>
        {loading ? (
       <Loading />
        ) : 
        (
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
            keyboardType='default'
           
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
    )}
    </KeyboardAvoidingView>
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
    borderColor:'gray',
    borderWidth:Platform.OS === 'android' ? 1 : borderWidth=2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 9,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.8)', // Usando boxShadow para la web
      },
    }),
    width: '90%',
    maxWidth: Platform.OS !== 'web' ? '90%':'25%',
    borderRadius: 30,
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

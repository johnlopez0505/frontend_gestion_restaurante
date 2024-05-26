
import React, { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import { styles } from '../styles/styles'; // Cambié la importación a los estilos
import { createStackNavigator } from '@react-navigation/stack';
import ListRestaurantScreen from './RestaurantScreen';
import { useAuth } from '../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {

  const Stack = createStackNavigator(); // Define el StackNavigator aquí
  const navigation = useNavigation();

  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault(); // Evita que Link redireccione, lo hará la protección de ruta.
    logout();
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Gestión de reservas</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => navigation.navigate('Restaurantes')} style={styles.sidebarLink}>
            <Text>Restaurantes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Menús')} style={styles.sidebarLink}>
            <Text>Menús</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Add restaurante')} style={styles.sidebarLink}>
            <Text>Add Restaurant</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Add menu')} style={styles.sidebarLink}>
            <Text>Add Menú</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={ handleLogout } style={styles.sidebarLink}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          {/* <Text style={styles.tex}>Hola como vamos</Text>  */}
          <Stack.Navigator>
            <Stack.Screen name="Restaurantes" component={ ListRestaurantScreen } />
          </Stack.Navigator>
        
        </View>
      </View>
    </SafeAreaView>
  );

}


export default HomeScreen;

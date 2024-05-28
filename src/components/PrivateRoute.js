import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthProvider'; 
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AddRestaurante from './AddRestaurante';
import Loading from './Loading';
import AddMenu from './AddMenu';
import ListMenu from './ListMenus';
import { Platform } from 'react-native';
import RestaurantScreen from '../screens/RestaurantScreen';
import EditRestaurante from './EditRestaurante';
import UsuarioScreen from '../screens/UsuarioScreen';

const Stack = createStackNavigator();

function PrivateRoute() {
  const { state } = useAuth();

  const { loading } = useAuth();

  // if (loading) {
  //   return <Loading/>;
  // }

  const headerHeight = Platform.select({
    ios: 85,
    android: 60,
    web: 40,
  });

  return (
      <Stack.Navigator
          screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff', // Color de fondo del encabezado
          height:headerHeight,
      
        },
        headerTintColor: '#000000', // Color del texto del encabezado
        headerTitleStyle: {
          fontWeight: 'bold', // Estilo del título del encabezado
        },
      }}>
        {state.isAuthenticated ? 
          <Stack.Screen name="Home" component={HomeScreen} />
          
         : 
          <Stack.Screen name="Login" component={LoginScreen} />
        }
         <Stack.Screen name="Register" component={RegisterScreen}/>
         <Stack.Screen name='Add restaurante' component={AddRestaurante} />
         <Stack.Screen name='Edit restaurante' component={EditRestaurante} />
         <Stack.Screen name='Add menu' component={AddMenu} />
         <Stack.Screen name='Restaurantes' component={RestaurantScreen} />
         <Stack.Screen name='Menús' component={ListMenu} />
         <Stack.Screen name='Reservas' component={ListMenu} />
         <Stack.Screen name='Usuarios' component={UsuarioScreen} />
      </Stack.Navigator>
  );
}

export default PrivateRoute;



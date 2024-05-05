import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthProvider'; 
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ListRestaurant from './ListRestaurant';

const Stack = createStackNavigator();

function PrivateRoute() {
  const { state } = useAuth();

  return (
      <Stack.Navigator>
        {state.isAuthenticated ? 
          <Stack.Screen name="Home" component={HomeScreen} />
          // <Stack.Screen name="ListRestaurant" component={ListRestaurant} />
         : 
          <Stack.Screen name="Login" component={LoginScreen} />
        }
         <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
  );
}

export default PrivateRoute;



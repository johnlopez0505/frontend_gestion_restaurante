// utils.js

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Componente para la navegación de retorno en los detalles del restaurante
export const Restaurante = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Restaurantes')}>
      <Ionicons name="arrow-back" size={30} color="white" marginLeft={20} />
    </TouchableOpacity>
  );
};

// Componente para acciones que no requieren autenticación
export const NoAuthentication = () => {
  return (
    <>
      <Text></Text>
    </>
  );
};

export const RestauranteDetails = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detalles del restaurante')}>
      <Ionicons name="arrow-back" size={30} color="white" marginLeft={20} />
    </TouchableOpacity>
  );
};

export const Carta = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Carta')}>
      <Ionicons name="arrow-back" size={30} color="white" marginLeft={20} />
    </TouchableOpacity>
  );
};

export const Usuarios = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Usuarios')}>
      <Ionicons name="arrow-back" size={30} color="white" marginLeft={20} />
    </TouchableOpacity>
  );
};

export const DestalleRestaurante = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detalles del restaurante')}>
      <Ionicons name="arrow-back" size={30} color="white" marginLeft={20} />
    </TouchableOpacity>
  );
};

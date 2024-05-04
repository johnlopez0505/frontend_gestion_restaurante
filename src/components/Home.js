
import React from 'react';
import { View, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import { styles } from '../styles/styles'; // Cambié la importación a los estilos

const Home = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Gestión de reservas</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={() => navigation.navigate('Nuevo')} style={styles.sidebarLink}>
            <Text>Añadir Carrito</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Carritos')} style={styles.sidebarLink}>
            <Text>Ver Carritos</Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.sidebarLink}>
            <Text>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          <Text style={styles.tex}>Hola como vamos</Text> 
        </View>
      </View>
    </SafeAreaView>
  );
}


export default Home;

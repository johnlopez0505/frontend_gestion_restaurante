
import React from 'react';
import { View, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import { styles } from '../styles/styles'; // Cambié la importación a los estilos
import ListRestaurant from '../components/ListRestaurant';
import { useAuth } from '../context/AuthProvider';

const HomeScreen = () => {

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
          <TouchableOpacity onPress={() => navigation.navigate('ListRestaurat')} style={styles.sidebarLink}>
            <Text>Listar restaurantes</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('Menus')} style={styles.sidebarLink}>
            <Text>Ver Menús</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={ handleLogout } style={styles.sidebarLink}>
            <Text>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          <Text style={styles.tex}>Hola como vamos</Text> 
          <ListRestaurant />
        </View>
      </View>
    </SafeAreaView>
  );

}


export default HomeScreen;

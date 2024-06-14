import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthProvider';

const { width } = Dimensions.get('window');

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurante } = route.params;
  const navigation = useNavigation();
  const { state } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);


  const buttons = [
    state.user?.rol !== 'empresario' && 
    {
      label: 'Reservar',
      icon: 'event-seat',
      businessOnly: false,
      index: 0,
    },
     
    {
      label: 'Carta',
      icon: 'restaurant-menu',
      businessOnly: true,
      index: 1,
    },
    {
      label: 'Ubicación',
      icon: 'map',
      businessOnly: true,
      index: 2,
    },
    state.user?.rol !== 'usuario' && 
    {
      label: 'Añadir menu',
      icon: 'map',
      businessOnly: false,
      index: 3,
    },
  ].filter(item => item);

  const handleShowMap = () => {
    console.log("vamos al mapa");
    navigation.navigate('Map',{restaurante: restaurante})
  };

  const handleReservation = () => {
    navigation.navigate('Add Reserva', { restaurante: restaurante });
  };

  const handleShowMenu = () => {
    navigation.navigate('Carta Restaurante', { restaurante: restaurante });
  };

  const handleAddMenu = () => {
    navigation.navigate('Add menu', { restaurante: restaurante });
  }

  const handleNext = () => {
    if (currentIndex < buttons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleButtonPress = () => {
    const button = buttons[currentIndex];
    switch (button.index) {
      case 0:
        handleReservation()
        break;
      case 1:
        handleShowMenu();
        break;
      case 2:
        handleShowMap();
        break;
      case 3:
        handleAddMenu();
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurante.nombre}</Text>
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: restaurante.imagen }} style={styles.image} imageStyle={styles.imageStyle}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Restaurantes')}>
            <Ionicons name="chevron-back-circle" size={36} color="#fff" />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.text}><MaterialIcons name="location-city" size={20} color="#333" /> Ciudad: {restaurante.ciudad}</Text>
        <Text style={styles.text}><MaterialIcons name="map" size={20} color="#333" /> Provincia: {restaurante.provincia}</Text>
        <Text style={styles.text}><MaterialIcons name="phone" size={20} color="#333" /> Teléfono: {restaurante.telefono}</Text>
        <Text style={styles.text}><MaterialCommunityIcons name="google-maps" size={24} color="black" /> Dirección: {restaurante.direccion}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentIndex === 0}>
          <MaterialIcons name="chevron-left" size={40} color={currentIndex === 0 ? "#ccc" : "#000"} />
        </TouchableOpacity>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <MaterialIcons name={buttons[currentIndex].icon} size={24} color="#fff" />
            <Text style={styles.buttonText}>{buttons[currentIndex].label}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleNext} disabled={currentIndex === buttons.length - 1}>
          <MaterialIcons name="chevron-right" size={40} color={currentIndex === buttons.length - 1 ? "#ccc" : "#000"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  imageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    padding: 5,
  },
  detailsContainer: {
    width: '90%',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: width * 0.7, // Ancho fijo del botón para asegurar que todos tengan el mismo tamaño
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
    width: '80%', // Asegura que el botón ocupe todo el ancho del contenedor
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default RestaurantDetailsScreen;

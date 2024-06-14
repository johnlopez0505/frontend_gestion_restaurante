
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';

const HomeScreen = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenidos a TastyGo</Text>
          <Text style={styles.subtitle}>Descubre los mejores restaurantes cerca de ti</Text>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Populares</Text>
          <View style={styles.popularRestaurants}>
            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Restaurante Pizzeria Da Ernestor </Text>
              <Text style={styles.restaurantDetails}>★★★★☆ 4.5</Text>
            </View>
            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Restaurante Casa Pepe</Text>
              <Text style={styles.restaurantDetails}>★★★★☆ 4.2</Text>
            </View>
          </View>
             {/* Sección de ofertas especiales */}
             <Text style={styles.sectionTitle}>Ofertas Especiales</Text>
          <View style={styles.specialOffers}>
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>¡Hoy! 50% de descuento en pizzas grandes</Text>
            </View>
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>Menú especial por tiempo limitado</Text>
            </View>
          </View>
        </ScrollView>
      
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'left',
  },
  
  popularRestaurants: {
    marginTop: 20,
  },
  restaurantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#555',
  },
  specialOffers: {
    marginBottom: 20,
  },
  offerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;

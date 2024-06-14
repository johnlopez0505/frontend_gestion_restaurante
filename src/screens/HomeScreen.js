
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const HomeScreen = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9' }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenidos a GastroGuide</Text>
          <Text style={styles.subtitle}>Descubre los mejores restaurantes cerca de ti</Text>
          <TextInput 
            style={styles.searchBar}
            placeholder="Buscar restaurantes..."
            placeholderTextColor="#aaa"
          />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categories}>
            <TouchableOpacity style={styles.category}>
              <FontAwesome name="cutlery" size={24} color="#fff" />
              <Text style={styles.categoryText}>Italianos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.category}>
              <FontAwesome name="cutlery" size={24} color="#fff" />
              <Text style={styles.categoryText}>Chinos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.category}>
              <FontAwesome name="cutlery" size={24} color="#fff" />
              <Text style={styles.categoryText}>Vegetarianos</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Populares</Text>
          <View style={styles.popularRestaurants}>
            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Restaurante A</Text>
              <Text style={styles.restaurantDetails}>★★★★☆ 4.5</Text>
            </View>
            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>Restaurante B</Text>
              <Text style={styles.restaurantDetails}>★★★★☆ 4.2</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons name="restaurant-menu" size={24} color="#fff" />
            <Text style={styles.buttonText}>Ver Restaurantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <MaterialIcons name="favorite" size={24} color="#fff" />
            <Text style={styles.buttonText}>Favoritos</Text>
          </TouchableOpacity>
        </View>
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
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  category: {
    alignItems: 'center',
    backgroundColor: '#ff6f61',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
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
  buttonContainer: {
    position: 'absolute',
    bottom:0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6f61',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
});

export default HomeScreen;

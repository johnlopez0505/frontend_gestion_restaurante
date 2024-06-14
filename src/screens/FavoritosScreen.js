import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { Image } from 'expo-image';

const FavoritosScreen = () => {
  const { favoritos } = useAuth();

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Restaurantes Favoritos</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.imagen }} style={styles.image} />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.restaurantName}>{item.nombre}</Text>
              <Text style={styles.text}>Ciudad: {item.ciudad}</Text>
              <Text style={styles.text}>Provincia: {item.provincia}</Text>
              <Text style={styles.text}>Teléfono: {item.telefono}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
  },
  imageWrapper: {
    width: '40%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textWrapper: {
    width: '60%',
    padding: 10,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});


export default FavoritosScreen;

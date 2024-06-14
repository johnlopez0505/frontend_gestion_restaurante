import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import ListRestaurant from '../components/ListarRestaurantes';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthProvider';
import { Pressable } from 'react-native';
import { Searchbar } from 'react-native-paper'; // Añade Text desde react-native-paper

const RestaurantScreen = () => {
  const navigation = useNavigation();
  const { state, setSearchQuery, searchQuery } = useAuth();
  const [pressed, setPressed] = useState(false);

  const handlerAdd = () => {
    navigation.navigate('Add restaurante');
  }

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.search}>
          <Searchbar
            placeholder="Buscar restaurantes..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>
        <ScrollView style={styles.scrollView}>
          <ListRestaurant />
        </ScrollView>
      </View>
      {state.user?.rol === 'admin' || state.user?.rol === 'empresario' ? (
        <Pressable
          style={[
            styles.floatingButton,
            pressed && styles.floatingButtonPressed
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          underlayColor="#808000"
          onPress={handlerAdd}
        >
          <MaterialCommunityIcons name='plus' style={styles.icon} />
        </Pressable>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 40,
    color: 'black',
    backgroundColor: '#FFD700',
    borderRadius: 35,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  floatingButtonPressed: {
    backgroundColor: 'orange',
  },
  icon: {
    fontSize: 40,
    color: 'black',
  },
  errorText: { // Agrega este estilo para el texto de error
    color: 'red',
  },
  search: {
    backgroundColor:'white',
    marginTop:Platform.select({
      ios:5,
      android:5,
      web:20,
    }),
    marginBottom:Platform.select({
      ios:5,
      android:5,
      web:30,
    }),
    width:'78%',
    marginLeft:10,
  },
  searchbar: {
    marginTop: 3,
  },
});

export default RestaurantScreen;

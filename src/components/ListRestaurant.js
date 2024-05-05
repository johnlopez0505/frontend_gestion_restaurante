import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import API from '../components/axios';
import Restaurant from './Restaurant';

const ListRestaurant = () => {

  const [restaurantes, setRestaurantes] = useState([]);


  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        console.log("entro en listar restaurantes");
        const response = await API.get('/restaurantes');
        console.log(response.data.restaurantes);
        setRestaurantes(response.data.restaurantes);
      } catch (error) {
        console.error("Error al obtener los restaurantes", error);
      }
    };
    fetchRestaurantes();
  }, []);

  

  return (
    <ScrollView contentContainerStyle={styles.containerGame}>
      {
        restaurantes.map(restaurants => (
          <Restaurant key={restaurants.id} restaurant={restaurants} />
        ))
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerGame: {
    flexGrow: 2,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default ListRestaurant;
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import API from '../components/axios';
import Restaurant from '../components/Restaurant';
import { useAuth } from '../context/AuthProvider';

const ListRestaurant = () => {

  const {restaurantes, setRestaurantes,setLoading} = useAuth();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        console.log("entro en listar restaurantes");
        const response = await API.get('/restaurantes');
        console.log(response.data.restaurantes);
        setRestaurantes(response.data.restaurantes); 
      } catch (error) {
        if (error.response && error.response.data.status === "FORBIDDEN") {
          console.error('Error: el token ha expirado');
        } else {
          console.error("Error al obtener los restaurantes", error);
        }
      }
    };
    fetchRestaurantes();
  }, []);
 

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
       <View style={styles.containerRestaurante}>
          {
            restaurantes === undefined? <Text>No hay restaurantes</Text>:
            restaurantes.map(restaurants => (
              <Restaurant key={restaurants.id} restaurant={restaurants} />
            ))
          }
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerRestaurante: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 20,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'row',
    backgroundColor:'yellow',
    minWidth: '100%',
  },
});

export default ListRestaurant;
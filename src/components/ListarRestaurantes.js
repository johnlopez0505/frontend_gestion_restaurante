import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import API from '../components/axios';
import Restaurant from '../components/Restaurant';
import { useAuth } from '../context/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';

const ListRestaurant = () => {

  const {restaurantes, setRestaurantes,setLoading} = useAuth();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        setLoading(true);
        console.log("entro en listar restaurantes");
        const response = await API.get('/restaurantes');
        console.log(response.data.restaurantes);
        setRestaurantes(response.data.restaurantes); 
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data.status === "FORBIDDEN") {
          console.error('Error: el token ha expirado');
          setLoading(false);
        } else {
          console.error("Error al obtener los restaurantes", error);
          setLoading(false);
        }
      }
    };
    fetchRestaurantes();
  }, []);
 

  return (
   
        <ScrollView style={styles.scrollView}>
        <PaperProvider>
            <View style={styles.containerRestaurante}>
                {
                    restaurantes === undefined? <Text>No hay restaurantes</Text>:
                    restaurantes.map(restaurants => (
                    <Restaurant key={restaurants.id} restaurant={restaurants} />
                    ))
                }
            </View>
        </PaperProvider>
        </ScrollView>
   
  );
};

const styles = StyleSheet.create({

  containerRestaurante: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 20,
    paddingHorizontal: 0,
    alignItems: 'row',
    backgroundColor:'white',
    minWidth: '100%',
  },
});

export default ListRestaurant;
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import API from './axios';
import { useAuth } from '../context/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import Loading from './Loading';
import Reservas from "./Reservas";

const ListReservasUsuario = () => {
  const { setLoading, loading, setCombinedData, combinedData, setReservas,reservas} = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      console.log("entro en lista de reservas usuarios");
      try {
        setLoading(true);
        setError(null);
        
        const [responseReservas, responseRestaurantes] = await Promise.all([
          API.get('/reservas/usuario'),
          API.get('/restaurantes'),
        ]);

        if (responseReservas.data.result === 'ok' && responseRestaurantes.data.result === 'ok') {
          const reservasFiltradas = responseReservas.data.reservas || [];
          const restaurantes = responseRestaurantes.data.restaurantes || [];

          console.log("Reservas filtradas:", reservasFiltradas);
          console.log("Restaurantes obtenidos:", restaurantes);

          const datosCombinadosReserva = reservasFiltradas
          .filter(reserva => typeof reserva.id !== 'undefined' && reserva.id !== null)
          .map(reserva => {
            const restaurante = restaurantes.find(restaurante => restaurante.id === reserva.restauranteId);
            return {
              ...reserva,
              nombreRestaurante: restaurante ? restaurante.nombre : '',
              telefonoRestaurante: restaurante ? restaurante.telefono : '',
              direccionRestaurante: restaurante ? restaurante.direccion : '',
            };
          });
          setCombinedData(datosCombinadosReserva );
        } else {
          setError(response?.data?.message || 'Error al obtener las reservas o restaurantes');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  },[setReservas]);

  useEffect(() => {
    setError(null); 
  }, [combinedData]);

  
    return (
      
        <PaperProvider>
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Loading />
            </View>
          ) : (
            <ScrollView style={styles.scrollView} >
              <View style={styles.containerRestaurante}>
              {error ? (
              <View style={styles.errorcontainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
              ) : combinedData && combinedData.length == 0 ? (
                  <View style={styles.noMenusContainer}>
                    <Text style={styles.noMenusText}>No hay reservas</Text>
                  </View>
                ) : (
                  combinedData.map(reserva => {
                    return <Reservas key={reserva.id} reserva={reserva} />;
                  })
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </PaperProvider>
    );
  };
  
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'yellow',
        // minHeight: Dimensions.get('window').height,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height,
    },
    scrollView: {
        flex: 1,
    },
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
   
    errorcontainer:{
      width:'90%',
      alignItems: 'center',

    },
    errorText: {
      fontSize: 19,
      textAlign:'center',
      color:'red',
      fontWeight: 'bold',
    },

});
  

export default ListReservasUsuario;
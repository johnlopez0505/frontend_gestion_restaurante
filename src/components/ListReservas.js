import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import API from '../components/axios';
import { useAuth } from '../context/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import Loading from './Loading';
import Reservas from "./Reservas";

const ListReservas = () => {

    const {reservas, setReservas,setLoading, loading, setsetCombinedData} = useAuth();
    const [error, setError] = useState(null);
  
  
    useEffect(() => {
      const fetchReservas = async () => {
        try {
          setLoading(true);
          setError(null); 
          console.log("entro en listar reservas");
          const response = await API.get('/reservas');
          if(response.data.result === "ok"){
            // Ordenar los restaurantes por id de menor a mayor
            const sortedReservas = response.data.reservas.sort((a, b) => a.id - b.id);
            setReservas(sortedReservas); 
          }else {
            setError(response.data.message);
          }
        } catch (error) {
          console.error("Error al obtener las reservas", error);
          setError(error.response?.data?.message);
        }finally {
          setLoading(false);
        }
      };
      fetchReservas();
    }, [setReservas, setsetCombinedData]);
  
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
              ) : reservas && reservas.length == 0 ? (
                  <View style={styles.noMenusContainer}>
                    <Text style={styles.noMenusText}>No hay reservas</Text>
                  </View>
                ) : (
                  reservas.map(reserva => (
                    <Reservas key={reserva.id} reserva={reserva} />
                  ))
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
  

export default ListReservas;
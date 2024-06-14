import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import API from '../components/axios';
import Restaurant from '../components/Restaurant';
import { useAuth } from '../context/AuthProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import Loading from './Loading';

const ListRestaurant = () => {

  
  const { restaurantes, setRestaurantes, setLoading, loading, searchQuery, state } = useAuth();
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurantes = async () => {
    try {
      setLoading(true);
      console.log("entro en listar restaurantes");
      let endpoint = '/restaurantes'; // Endpoint por defecto para usuarios normales
      if (state?.user?.rol === 'empresario') {
        endpoint = '/restaurantes/usuario'; // Endpoint para empresarios
      }
      const response = await API.get(endpoint);
      if (response.data.result === "ok") {
        const sortedRestaurantes = response.data.restaurantes.sort((a, b) => a.id - b.id);
        setRestaurantes(sortedRestaurantes);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setLoading(false);
       setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRestaurantes();
  }, [filteredRestaurantes, refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurantes();
  };

  useEffect(() => {
    setError(null); 
  }, [restaurantes]);

  const filteredRestaurantes = restaurantes.filter(
    restaurant =>
      restaurant.nombre.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) ||
      restaurant.ciudad.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) ||
      restaurant.provincia.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Loading />
          </View>
        ) : (
          <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.containerRestaurante}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : filteredRestaurantes.length === 0 ? (
              <View style={styles.noMenusContainer}>
                <Text style={styles.noMenusText}>No hay restaurantes</Text>
              </View>
            ) : (
              filteredRestaurantes.map(restaurant => (
                <Restaurant key={restaurant.id} restaurant={restaurant} />
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
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: 'row',
    backgroundColor: 'white',
    minWidth: '100%',
  },
  errorContainer: {
    width:'80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  errorText: {
    fontSize: 18,
    textAlign:'center',
    fontWeight: 'bold',
    color: 'red',
    textAlignVertical:'center',
  },
  noMenusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noMenusText: {
    textAlign:'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListRestaurant;

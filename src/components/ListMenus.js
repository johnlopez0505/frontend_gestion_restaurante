import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import API from './axios';
import Menu from './Menu';
import { useAuth } from '../context/AuthProvider';
import { PaperProvider } from 'react-native-paper';
import Loading from './Loading';

const ListMenus = () => {

  const { menus, setMenus, loading,setLoading, state } = useAuth();
  const [ menusFiltrados, setMenusFiltrados ] = useState([])
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("entro en listar menus");
        let endpoint = '/menus'; // Endpoint por defecto para usuarios normales
        if (state.user?.rol === 'empresario') {
          endpoint = '/menus/usuario'; // Endpoint para empresarios
        }
        console.log(state.user.rol);
        const response = await API.get(endpoint);
        if(response.data.result === 'ok'){
          const sortedMenus = response.data.menus.sort((a, b) => a.id - b.id);
          setMenus(sortedMenus);
          setMenusFiltrados(sortedMenus);
        }else{
          setError(response?.data?.message);
        }
      } catch (error) {
        setError(error.response?.data?.message)
      }finally{
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);
 

  return (
    <PaperProvider>
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
        <View style={styles.containerMenu}>
        {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
          ) : (
            menus && menus.length === 0 ? <Text style={styles.noMenusText}>No hay menús</Text>:
            menus.map(menu => (
              <Menu key={menu.id} menu={menu} />))
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
  containerMenu: {
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
  noMenusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noMenusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    width:'85%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    textAlign:'center',
    fontSize: 18,
    color: 'red',
  },
});

export default ListMenus;
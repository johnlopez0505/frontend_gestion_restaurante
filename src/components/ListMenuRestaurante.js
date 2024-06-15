import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import API from './axios';
import Menu from './Menu';
import { useAuth } from '../context/AuthProvider';
import { PaperProvider } from 'react-native-paper';
import Loading from './Loading';

const ListMenuRestaurante = () => {

  const {menus, setMenus, loading,setLoading, menusRestaurante, setMenusRestaurante} = useAuth();
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("entro en listar menus");
        const response = await API.get('/menus/usuario');
        if(response.data.result === 'ok'){
          //const menusFiltrados = response.data.menus.filter(menu => menu.restauranteId === restaurante.id);
          //setMenus(menusFiltados);
          setMenusRestaurante(response.data.menus);
        }
        else{
          setError(response.data.message);
        }
      } catch (error) {
        setError(error.response?.data?.message);
      }finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [menus]);

  useEffect(()=>{
    setError(null);
  },[setMenusRestaurante,menus])
 

  return (
    <PaperProvider>
    <View style={styles.container}>
      <Text style={styles.title}>Tus Menús </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView}>
            <View style={styles.containerMenu}>
              {
              menusRestaurante && menusRestaurante.length === 0 ? (
                <View style={styles.noMenusContainer}>
                  <Text style={styles.noMenusText}>No hay menús</Text>
                </View>
              ):(
                menusRestaurante.map(menu => (
                  <Menu key={menu.id} menu={menu} />
                ))
              )}
            </View>
          </ScrollView>
        </>
      )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    padding:5,
    color: '#333',
    textAlign: 'center',
  },
  noMenusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noMenusText: {
    fontSize: 18,
    color: '#777',
  },

  floatingButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize:40,
    color:'black',
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
    backgroundColor: 'orange', // Cambia el color al presionar
  },
  floatingButtonIOS: {
    overflow: 'hidden',
  },
  icon: {
    fontSize: 40,
    color: 'black',
  },
  errorContainer: {
    width:'85%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft:20,
  },
  errorText: {
    textAlign:'center',
    fontSize: 18,
    
  },
});

export default ListMenuRestaurante;
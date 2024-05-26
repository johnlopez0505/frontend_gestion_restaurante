import React, { Fragment } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ListRestaurant from '../components/ListarRestaurantes';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const RestaurantScreen = () => {

  const navigation = useNavigation();


  const handlerAdd = () => {
    navigation.navigate('Add restaurante');
  }

  return (
    <Fragment>
       <View style={styles.mainContainer}>
         <ScrollView style={styles.scrollView}>
            <ListRestaurant />
          </ScrollView>
       </View>
       <MaterialCommunityIcons name='plus' style={styles.floatingButton} onPress={handlerAdd}/>
    </Fragment>
    
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100vh', // Ajusta la altura del contenedor principal
    overflow: 'hidden', // Evita que los elementos desborden la pantalla
  },

  scrollView: {
    flex: 1,
  },
  
  floatingButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize:40,
    color:'black',
    backgroundColor: 'yellow',
    borderRadius: 35,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
});

export default RestaurantScreen;
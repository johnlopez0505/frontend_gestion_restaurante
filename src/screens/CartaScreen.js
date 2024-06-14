import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from "../context/AuthProvider";
import ListMenus from "../components/ListMenus";
import ListMenuRestaurante from '../components/ListMenuRestaurante';



const CartaScreen = () => {


    const {state} = useAuth();
   
  
    return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollView}>
          {state.user?.rol === 'empresario' ? (
             <ListMenuRestaurante />
          ): (
            <ListMenus />
          )}
          
         </ScrollView>
      </View>
    </>
    );
  };
  
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor:"white",
      flex: 1,
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
  });
  
  export default CartaScreen;
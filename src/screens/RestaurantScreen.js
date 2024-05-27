import React, { Fragment, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ListRestaurant from '../components/ListarRestaurantes';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableHighlight } from 'react-native';


const RestaurantScreen = () => {

  const navigation = useNavigation();
  const [pressed, setPressed] = useState(false);


  const handlerAdd = () => {
    navigation.navigate('Add restaurante');
  }

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  return (
    <Fragment>
       <View style={styles.mainContainer}>
         <ScrollView style={styles.scrollView}>
            <ListRestaurant />
          </ScrollView>
       </View>
       <TouchableHighlight
        style={[
          styles.floatingButton,
          pressed && styles.floatingButtonPressed,
          Platform.OS === 'ios' && styles.floatingButtonIOS,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        underlayColor="#808000"
        onPress={handlerAdd}
      >
       <MaterialCommunityIcons name='plus' style={styles.icon}/>
      </TouchableHighlight>
    </Fragment>
    
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // height: '100vh', // Ajusta la altura del contenedor principal
    // overflow: 'hidden', // Evita que los elementos desborden la pantalla
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

    floatingButtonPressed: {
      backgroundColor: 'orange', // Cambia el color al presionar
    },
    floatingButtonIOS: {
      overflow: 'hidden',
    },

    //  // Estilo específico para iOS
    //  ...Platform.select({
    //   ios: {
    //     overflow: 'hidden',
    //     borderRadius: 30,
    //     backgroundColor: 'violet',
    //   },
    // }),
  },
  icon: {
    fontSize: 40,
    color: 'black',
  },
});

export default RestaurantScreen;
import React, { Fragment, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import ListUsuarios from '../components/ListUsuarios';


const UsuarioScreen = () => {

    const navigation = useNavigation();
    const {state} = useAuth();
    const [pressed, setPressed] = useState(false);
  
  
    const handlerAdd = () => {
      navigation.navigate('Crear usuario');
    }
  
    const handlePressIn = () => {
      setPressed(true);
    };
  
    const handlePressOut = () => {
      setPressed(false);
    };
  
    return (
      <>
         <View style={styles.mainContainer}>
           <ScrollView style={styles.scrollView}>
              <ListUsuarios />
            </ScrollView>
         </View>
         {state.user?.rol === 'admin' || state.user?.rol === 'empresario' ? (
          <Pressable
            style={[
              styles.floatingButton,
              pressed && styles.floatingButtonPressed
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            underlayColor="#808000"
            onPress={handlerAdd}
          >
          <MaterialCommunityIcons name='plus' style={styles.icon}/>
          </Pressable>
        ) : ""}
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

export default UsuarioScreen;
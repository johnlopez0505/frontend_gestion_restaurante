import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import API from './axios';
import Menu from './Menu';
import { useAuth } from '../context/AuthProvider';

const ListMenus = () => {

  const {menus, setMenus} = useAuth();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        console.log("entro en listar menus");
        const response = await API.get('/menus');
        console.log(response.data.menus);
        setMenus(response.data.menus); 
      } catch (error) {
        if (error.response && error.response.data.status === "FORBIDDEN") {
          console.error('Error: el token ha expirado');
        } else {
          console.error("Error al obtener los menús", error);
        }
      }
    };
    fetchMenus();
  }, []);
 

  return (
    <ScrollView contentContainerStyle={styles.containerMenu}>
      {
        menus === undefined? <Text>No hay menús</Text>:
        menus.map(menu => (
          <Menu key={menu.id} menu={menu} />
        ))
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 20,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'row',
    backgroundColor:'yellow'
  },
});

export default ListMenus;
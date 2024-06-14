import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import ListReservas from '../components/ListReservas';
import ListReservasUsuario from '../components/ListReservasUsuario';
import ListReservasEmpresario from '../components/ListReservasEmpresario';


const ReservaScreen = () => {

  const {state} = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000 milisegundos = 1 minuto

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.currentDate}>
              {currentTime.toLocaleDateString()}
            </Text>
            <Text style={styles.currentTime}>
              {formatTime(currentTime)}
            </Text>
          </View>
          <Text style={styles.title}>Lista de Reservas</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {state.user?.rol === 'admin' ? (
            <ListReservas />
          ) : state.user?.rol === 'usuario' ? (
            <ListReservasUsuario />
          ) : (
            <ListReservasEmpresario />
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerHeader: {
    backgroundColor: 'white',
    height: 60,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row', // Para alinear la fecha y hora a la izquierda y el título al centro
  },
  dateTimeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  currentDate: {
    fontSize: 16,
    color: '#000',
  },
  currentTime: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft:30,
    flex: 1, // Para centrar el título
  },
  scrollView: {
    flex: 1,
    marginTop: 60,
  },
  floatingButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 40,
    color: 'black',
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
  icon: {
    fontSize: 40,
    color: 'black',
  },
});


export default ReservaScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import API from './axios';

const formatFecha = (fechaString) => {
    const [fechaPart, horaPart] = fechaString.split(' ');
    const [dia, mes, año] = fechaPart.split('/');
    const [hora, minutos] = horaPart.split(':');
    return new Date(`${año}-${mes}-${dia}T${hora}:${minutos}`);
};

const formatoHora = (fechaString) => {
    const [fechaPart, horaPart] = fechaString.split(' ');
    const [hora, minutos] = horaPart.split(':');
    return  `${hora}:${minutos}`;
};

const Reservas = ({ reserva }) => {

    const navigation = useNavigation();
    const { setReservas, reservas, state, setLoading, setCombinedData } = useAuth();
    const userId = state.user?.id;
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showReservaDetails, setShowReservaDetails] = useState(false);
    const fechaYHora = formatFecha(reserva.fechaYHora);
    const hora = formatoHora(reserva.fechaYHora);

    const handlerDelete = () => {
        setShowDeleteConfirmation(true);
    };

    const handleReserva = () => {
        setShowReservaDetails(true);
    };

    const handleDeleteConfirmed = async () => {
        setLoading(true);
        try {
            const response = await API.delete(`/reservas/delete/${reserva.id}`, {
                headers: {
                    'id': userId
                }
            });
            if (response.data.result === "ok") {
                const updatedReservas = reservas.filter(r => r.id !== reserva.id);
                setReservas(updatedReservas);
                setCombinedData(updatedReservas);
                navigation.navigate('Reservas');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error al eliminar la reserva", error);
        } finally {
            setLoading(false);
        }
        setShowDeleteConfirmation(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleCancelReservaDetails = () => {
        setShowReservaDetails(false);
    };

    const handlerEdit = () => {
        navigation.navigate('Edit Reserva', { reserva : reserva });
    };

    return (
        <>
        <View style={styles.containerCard} key={reserva.id}>
            <View style={styles.row}>
                <View style={styles.infoNumeroPersonas}>
                    <Text style={styles.text}>{reserva.numeroPersonas}</Text>
                </View>
                <View style={styles.infoHora}>
                    <Text style={styles.textHora}>{hora}</Text>
                </View>
                {state.user?.rol === 'usuario' ? (
                        <View style={styles.infoNombreRestaurante}> 
                            <TouchableOpacity onPress={handleReserva}>
                                <Text style={styles.textNombre}>{reserva.nombreRestaurante}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoNombre}>
                            <TouchableOpacity onPress={handleReserva}>
                                <Text style={styles.textNombre}>{reserva.nombreCliente}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                  
                        <View style={styles.infoIconoDelete}>
                            <TouchableOpacity onPress={handlerDelete}>
                                <MaterialCommunityIcons name='delete' style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoIconoEdit}>
                            <TouchableOpacity onPress={handlerEdit}>
                                <MaterialCommunityIcons name='pencil' style={styles.icon} />
                            </TouchableOpacity>
                        </View>    
                </View>
        </View>

        <Modal visible={showDeleteConfirmation} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>¿Estás seguro de eliminar esta reserva?</Text>
                    {state.user?.rol === 'usuario' && (
                        <>
                            <Text style={styles.modalText}>
                                Restaurante: {reserva.nombreRestaurante}
                            </Text>
                            <Text style={styles.modalText}> 
                                Teléfono Restaurante: {reserva.telefonoRestaurante}
                            </Text>
                            <Text style={styles.modalText}>
                                Dirección Restaurante: {reserva.direccionRestaurante}
                            </Text>
                        </>
                    )}
                    <Text style={styles.modalText}>Nombre: {reserva.nombreCliente}</Text>
                    <Text style={styles.modalText}>Email: {reserva.emailCliente}</Text>
                    <Text style={styles.modalText}>Teléfono: {reserva.telefonoCliente}</Text>
                    <Text style={styles.modalText}>Número de Personas: {reserva.numeroPersonas}</Text>
                    <Text style={styles.modalText}>Notas: {reserva.notas}</Text>
                    <Text style={styles.modalText}>Fecha y Hora: {reserva.fechaYHora.toLocaleString()}</Text>
                    
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity onPress={handleDeleteConfirmed} style={[styles.modalButton, styles.deleteButton]}>
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelDelete} style={[styles.modalButton, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        <Modal visible={showReservaDetails} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Detalles de la Reserva</Text>
                    {state.user?.rol === 'usuario' && (
                        <>
                            <Text style={{textAlign:'center', fontSize:20, marginBottom:10}}>Datos del Restaurante</Text>
                            <Text style={styles.modalText}>
                                {reserva.nombreRestaurante}
                            </Text>
                            <Text style={styles.modalText}>
                                 Teléfono: {reserva.telefonoRestaurante}
                            </Text>
                            <Text style={styles.modalText}>

                                Dirección: {reserva.direccionRestaurante}
                            </Text>
                        </>
                    )}
                    <Text style={{textAlign:'center', fontSize:20, marginTop:10, marginBottom:10}}>Datos del usuario</Text>
                    <Text style={styles.modalText}>Nombre: {reserva.nombreCliente}</Text>
                    <Text style={styles.modalText}>Email: {reserva.emailCliente}</Text>
                    <Text style={styles.modalText}>Teléfono: {reserva.telefonoCliente}</Text>
                    <Text style={styles.modalText}>Número de Personas: {reserva.numeroPersonas}</Text>
                    <Text style={styles.modalText}>Notas: {reserva.notas}</Text>
                    <Text style={styles.modalText}>Fecha y Hora: {reserva.fechaYHora.toLocaleString()}</Text>
                  
                    <View style={styles.modalButtonsContainerDetails}>
                        <TouchableOpacity onPress={handleCancelReservaDetails} style={[styles.modalButton, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>
    );
};

const styles = StyleSheet.create({
    containerCard: {
        width: '90%',
        height:60,
        marginBottom: 20,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5,
        shadowOpacity: 0.3,
        elevation: 5,
        flexDirection: 'column',
        overflow: 'hidden',

    },

    row: {
        backgroundColor:'white',
        flexDirection: 'row',
        alignItems:'center',
        height:'100%',
    },

    infoContainer: {
        width: 40, // Ancho del 20%
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon: {
        fontSize: 20,
        marginRight: 4,
    },
   
    infoNumeroPersonas: {
        backgroundColor:'#FF8000',
        width:30,
        height:'100%',
    },
    infoHora: {
        width:50,
        height:'80%',
        //backgroundColor:'red',
        borderRightWidth: 1,
        borderRightColor: '#424242',
    },

    infoNombre: {
        width:Platform.select({
            ios:'53%',
            android:'55%',
        }),
        height:'100%',
        //backgroundColor:'red',
    },

    infoIconoDelete:{
        width:40,
        backgroundColor:'#424242',
        height:'100%',
    },

    infoIconoEdit:{
        width:40,
        backgroundColor:'#FF8000',
        height:'100%',
    },


    text:{
        textAlign:'center',
        paddingVertical:12,
        fontSize:25,
        color:'white',
    },

    textHora:{
        textAlign:'center',
        fontSize:15,
        paddingVertical:13,

    },
    textNombre:{
        textAlign:'left',
        paddingVertical:18,
        paddingLeft:5,
        fontSize:16,
        fontStyle:'italic',
    },
    infoNombreRestaurante:{
        width:Platform.select({
            ios:'53%',
            android:'55%',
        }),
        height:'100%',
        //backgroundColor:'red',
    },
    icon:{
        textAlign:'center',
        paddingVertical:14,
        fontSize:30,
        color:'white',
    },
    
   
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#e74c3c',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    cancelButton: {
        backgroundColor: '#95a5a6',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    modalButtonsContainerDetails: {
        marginTop:30,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
   
});

export default Reservas;

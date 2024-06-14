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

const Reservas = ({ reserva }) => {

    const navigation = useNavigation();
    const { setReservas, reservas, state, setLoading } = useAuth();
    const userId = state.user?.id;
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const fechaYHora = formatFecha(reserva.fechaYHora);

    const handlerDelete = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = async () => {
        setLoading(true);
        try {
            const response = await API.delete(`/reserva/delete/${reserva.id}`, {
                headers: {
                    'id': userId
                }
            });
            if (response.data.result === "ok") {
                const updatedReservas = reservas.filter(r => r.id !== reserva.id);
                setReservas(updatedReservas);
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

    const handlerEdit = () => {
        navigation.navigate('Edit reserva', { reserva });
    };

    return (
        <>
            <View style={styles.containerCard} key={reserva.id}>
                <View style={styles.textContainer}>
                      {state.user?.rol === 'usuario' && (
                        <>
                            <View style={styles.row}>
                                <MaterialCommunityIcons name="store" style={styles.icon} />
                                <Text style={styles.text}>{reserva.nombreRestaurante}</Text>
                            </View>
                            <View style={styles.row}>
                                <MaterialCommunityIcons name="phone" style={styles.icon} />
                                <Text style={styles.text}>{reserva.telefonoRestaurante}</Text>
                            </View>
                            <View style={styles.row}>
                                <MaterialCommunityIcons name="map-marker" style={styles.icon} />
                                <Text style={styles.text}>{reserva.direccionRestaurante}</Text>
                            </View>
                        </>
                    )}

                    <View>
                        <Text style={styles.text}>{reserva.numeroPersonas}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>{reserva.fechaYHora.toLocaleString()}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>{reserva.nombreCliente}</Text>
                    </View>
                    <View>

                    </View>
                    <View>
                        
                    </View>
                    
                   
                   
                  
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={handlerDelete}>
                            <MaterialCommunityIcons name='delete' style={styles.icon} />
                        </TouchableOpacity>
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
                        <Text style={styles.modalText}>Nombre: {reserva.nombreCliente}</Text>
                        <Text style={styles.modalText}>Email: {reserva.emailCliente}</Text>
                        <Text style={styles.modalText}>Teléfono: {reserva.telefonoCliente}</Text>
                        <Text style={styles.modalText}>Número de Personas: {reserva.numeroPersonas}</Text>
                        <Text style={styles.modalText}>Notas: {reserva.notas}</Text>
                        <Text style={styles.modalText}>Fecha y Hora: {reserva.fechaYHora.toLocaleString()}</Text>
                        {state.user?.rol === 'usuario' && (
                            <>
                                <Text style={styles.modalText}>
                                    <MaterialCommunityIcons name="store" style={styles.icon} />
                                    Nombre Restaurante: {reserva.nombreRestaurante}
                                </Text>
                                <Text style={styles.modalText}>
                                    <MaterialCommunityIcons name="phone" style={styles.icon} />
                                    Teléfono Restaurante: {reserva.telefonoRestaurante}
                                </Text>
                                <Text style={styles.modalText}>
                                    <MaterialCommunityIcons name="map-marker" style={styles.icon} />
                                    Dirección Restaurante: {reserva.direccionRestaurante}
                                </Text>
                            </>
                        )}
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
        </>
    );
};

const styles = StyleSheet.create({
    containerCard: {
        width: '90%',
        height:250,
        marginBottom: 20,
        padding: 15,
        margin: 10,
        backgroundColor: '#ffffff',
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
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: '#555',
        flex: 2,
        textAlign: 'right',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    icon: {
        fontSize: 28,
        color: '#333',
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
});

export default Reservas;

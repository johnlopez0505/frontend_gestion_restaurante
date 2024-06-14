import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import API from '../components/axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { FontAwesome5 } from '@expo/vector-icons';
import Loading from './Loading';

const AddReserva = ({route}) => {

    const { restaurante } = route.params;
    const navigation = useNavigation();
    const { state, reservas, setReservas, setCombinedData, combinedData } = useAuth();
    const [loading, setLoading] = useState(false);
    const user = state.user;
    const [error, setError] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [reservaData, setReservaData] = useState({
        nombreCliente: state.user?.fullName,
        telefonoCliente: state.user?.telefono,
        emailCliente: state.user?.username,
        numeroPersonas: '',
        notas: '',
        fechaYHora: '',
    });

    const handleChange = (name, value) => {
        setReservaData({ ...reservaData, [name]: value });
    };

    const handleConfirmDate = (date) => {
        const formattedDate = moment(date).format('DD/MM/YYYY');
        handleChange('fechaYHora', formattedDate + (reservaData.fechaYHora ? reservaData.fechaYHora.slice(10) : ''));
        setDatePickerVisibility(false);
    };

    const handleConfirmTime = (time) => {
        const formattedTime = moment(time).format('HH:mm');
        handleChange('fechaYHora', (reservaData.fechaYHora ? reservaData.fechaYHora.slice(0, 10) : '') + ' ' + formattedTime);
        setTimePickerVisibility(false);
    };

    const handleCancel = () => {
        navigation.navigate('Detalles del restaurante',{restaurante:restaurante});
        limpiarFormulario();
    };

    const handleSubmit = async () => {
        if(!reservaData.numeroPersonas || !reservaData.fechaYHora) {
            setError('Por favor, ingrese todos los campos');
            return;
        }

        try {
            setLoading(true);
            const response = await API.post('/reservas/add', { ...reservaData }, {
                headers: {
                    'id': restaurante.id,
                },
            });
            if (response.data.result === 'ok') {
                if(user.rol === 'usuario'){
                    const combinedReserva = {
                        ...response.data.reservas,
                        nombreRestaurante: restaurante.nombre,
                        telefonoRestaurante: restaurante.telefono,
                        direccionRestaurante: restaurante.direccion,
                    };
                    setCombinedData([...combinedData, combinedReserva]);
                    setReservas([...reservas, response.data.reservas]);
                    limpiarFormulario();
                    navigation.navigate('Reservas');
                }else{
                    const combinedReserva = {
                        ...response.data.reservas
                    };
                    setCombinedData([...combinedData, combinedReserva]);
                    setReservas([...reservas, response.data.reservas]);
                    limpiarFormulario();
                    navigation.navigate('Reservas');
                }
               
            } else {
                setError(response.data.message || 'Error al añadir la reserva');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error al añadir la reserva');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(null);
    }, [
        reservaData.nombreCliente,
        reservaData.telefonoCliente,
        reservaData.emailCliente,
        reservaData.numeroPersonas,
        reservaData.notas,
        reservaData.fechaYHora,
    ]);

    const limpiarFormulario = () => {
        setReservaData({
            nombreCliente: '',
            telefonoCliente: '',
            emailCliente: '',
            numeroPersonas: '',
            notas: '',
            fechaYHora: '',
        });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Nueva Reserva</Text>
            {loading ? (
                <Loading />
            ) : (
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="user" color="#777" style={styles.icon} />
                        <TextInput
                            style={[styles.input, styles.nonEditableInput]}
                            value={state.user?.fullName}
                            onChangeText={(text) => handleChange('nombreCliente', text)}
                            placeholder="Nombre"
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="envelope" color="#777" style={styles.icon} />
                        <TextInput
                            style={[styles.input, styles.nonEditableInput]}
                            value={state.user?.username}
                            onChangeText={(text) => handleChange('emailCliente', text)}
                            placeholder="Email"
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="phone" color="#777" style={styles.icon} />
                        <TextInput
                            style={[styles.input, styles.nonEditableInput]}
                            value={state.user?.telefono}
                            onChangeText={(text) => handleChange('telefonoCliente', text)}
                            placeholder="Teléfono"
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="users" color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={reservaData.numeroPersonas}
                            onChangeText={(text) => handleChange('numeroPersonas', text)}
                            placeholder="Número de Personas"
                            keyboardType= {Platform.select({
                                ios:'numbers-and-punctuation',
                                android:'number-pad'
                            })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="sticky-note" color="#777" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={reservaData.notas}
                            onChangeText={(text) => handleChange('notas', text)}
                            placeholder="Notas"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="calendar-alt" color="#777" style={styles.icon} />
                        <TextInput
                            style={[styles.inputFecha, styles.nonEditableInput]}
                            value={reservaData.fechaYHora}
                            onChangeText={(text) => handleChange('fechaYHora', text)}
                            placeholder="Fecha y Hora (DD/MM/YYYY HH:mm)"
                            editable={false}
                        />
                        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                            <FontAwesome5 name="calendar-alt" size={34} marginRight={10} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
                            <FontAwesome5 name="clock" size={34} color="black" />
                        </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmTime}
                        onCancel={() => setTimePickerVisibility(false)}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <FontAwesome5 name="plus" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.submitButtonText}>Añadir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButtonCancelar} onPress={handleCancel}>
                            <FontAwesome5 name="times" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.submitButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#eef5f9',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 'auto',
    },
    icon: {
        marginRight: 10,
        fontSize: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },

    inputFecha: {
        height: 40,
        width:'55%',
        marginRight:15,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#27ae60',
        padding: 15,
        paddingLeft: 25,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        width: '48%',
    },
    submitButtonCancelar: {
        backgroundColor: '#e74c3c',
        padding: 15,
        paddingLeft: 22,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        width: '48%',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    error: {
        textAlign: 'center',
        color: 'red',
        marginBottom: 10,
    },
    nonEditableInput: {
        backgroundColor: '#f0f0f0', // Color de fondo para campos no editables
        color: '#a0a0a0', // Color de texto para campos no editables
    },
});

export default AddReserva;

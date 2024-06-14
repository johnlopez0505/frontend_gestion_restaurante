import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import API from '../components/axios';
import { useNavigation } from '@react-navigation/native'; 
import { useAuth } from '../context/AuthProvider';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Loading from './Loading';
import { Platform } from 'react-native';


const EditReserva = () => {


    const route = useRoute();
    const { reserva } = route.params;    
    const navigation = useNavigation(); 
    const { state, setReservas, reservas, setLoading,loading, setCombinedData, combinedData  } = useAuth();
    const user = state?.user;
    const [error, setError] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const [reservaData, setReservaData] = useState({
        nombreCliente:reserva.nombreCliente ,
        telefonoCliente: reserva.telefonoCliente ,
        emailCliente: reserva.emailCliente ,
        numeroPersonas: reserva.numeroPersonas ,
        notas: reserva.notas,
        fechaYHora : reserva.fechaYHora, 
    });

  
    useEffect (() => {
        setReservaData({
            nombreCliente:reserva.nombreCliente ,
            telefonoCliente: reserva.telefonoCliente ,
            emailCliente: reserva.emailCliente ,
            numeroPersonas: reserva.numeroPersonas ,
            notas: reserva.notas,
            fechaYHora : reserva.fechaYHora, 
        })
    },[reserva])

    
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
        setReservaData({
            nombreCliente:reserva.nombreCliente ,
            telefonoCliente: reserva.telefonoCliente ,
            emailCliente: reserva.emailCliente ,
            numeroPersonas: reserva.numeroPersonas ,
            notas: reserva.notas,
            fechaYHora : reserva.fechaYHora, 
        })
        navigation.navigate('Reservas'); 
    };


    const handleSubmit = async () => {
        if ( !reservaData.numeroPersonas && !reservaData.notas && !reservaData.fechaYHora) {
            setError('Por favor, ingrese todos los campos');
            return;
          }
        
        if (!reservaData.numeroPersonas ) {
            setError('Por favor, ingrese la cantidad de personas');
            return;
        }

        if (!reservaData.fechaYHora) {
            setError('Por favor, ingrese la fecha');
            return;
        }
       

        try {
            setLoading(true);
            const putResponse = await API.put(`/reservas/edit/${reserva.id}`, { ...reservaData });
            if (putResponse.data.result === 'ok') {
                // Actualizar directamente los datos combinados
                const updatedReserva = {
                    ...reserva,
                    ...reservaData
                };

                const updatedCombinedData = combinedData.map(item => 
                    item.id === updatedReserva.id ? updatedReserva : item
                );

                const updatedReservas = reservas.map(item =>
                    item.id === updatedReserva.id ? updatedReserva : item
                );

                setCombinedData(updatedCombinedData);
                setReservas(updatedReservas);

                navigation.navigate('Reservas');
            } else {
                setError(putResponse.data.message);
                console.error(putResponse.data.message);
            }
               
        } catch (error) {
            setError(error.putResponse?.data?.message || error.response?.data?.message);
            console.error("Error al editar la reserva", error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(null); 
      }, [
           reservaData.nombreCliente, 
           reservaData.emailCliente, 
           reservaData.telefonoCliente,
           reservaData.numeroPersonas, 
           reservaData.notas,
           reservaData.fechaYHora
        ]
    );


    

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Editar Reserva</Text>
            {loading ? ( <Loading />
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
                        value={String(reservaData.numeroPersonas)}
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
                            <FontAwesome6 name="edit" size={20} color="white" style={{ marginRight: 8 }} /> 
                            <Text style={styles.submitButtonText}>Editar</Text>
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
        backgroundColor: '#eef5f9', // Cambio de color de fondo del formulario
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center', // Alineación del texto central
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    buttonSelect: {
        backgroundColor: '#49beb7', // Verde azulado suave
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft:33,
        borderRadius: 8,
        width: '48%', // Cambia el ancho para que quepan dos botones en una fila
    },
    buttonFoto: {
        backgroundColor: '#f47a60', // Naranja brillante
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingLeft:42,
        borderRadius: 8,
        width: '48%', // Cambia el ancho para que quepan dos botones en una fila
    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#27ae60', // Verde oscuro
        padding: 15,
        paddingLeft:25,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row', // Alinea el icono con el texto
        width: '48%', // Cambia el ancho para que quepan dos botones en una fila
    },
    submitButtonCancelar: {
        backgroundColor: '#e74c3c', // Rojo oscuro
        padding: 15,
        paddingLeft:22,
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
        textAlign:'center',
        color: 'red',
        marginBottom: 10,
    },
    containerImagen: {
        alignItems: 'center',
    },
    imagen: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding:'auto'
    },
    icon: {
        marginRight: 5,
        backgroundColor:'white',
        fontSize:20,
        paddingHorizontal:5,
        borderRadius:5,
        paddingVertical:5
    },
    input: {
        flex:1,
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
    nonEditableInput: {
        backgroundColor: '#f0f0f0', // Color de fondo para campos no editables
        color: '#a0a0a0', // Color de texto para campos no editables
    },
});

export default EditReserva;
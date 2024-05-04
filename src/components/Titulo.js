import React from 'react';
import { View, Text} from 'react-native';
import { styles } from '../styles/styles'; 

const Titulo = () => {

    return (
            <View style={styles.header}>
                <Text style={styles.title}>Administración de carritos de portátiles</Text>
            </View>        
    )
}

export default Titulo;
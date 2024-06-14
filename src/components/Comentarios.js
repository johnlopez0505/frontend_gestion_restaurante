import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Comentarios = () => {
  const [puntuacion, setPuntuacion] = useState('');
  const [comentario, setComentario] = useState('');

  const handleEnviar = () => {
    // Aquí puedes implementar la lógica para enviar la calificación y el comentario
    console.log('Puntuación:', puntuacion);
    console.log('Comentario:', comentario);
    // También puedes limpiar los campos después de enviar
    setPuntuacion('');
    setComentario('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deja tu comentario</Text>
      <View style={styles.inputContainer}>
        <Text>Puntuación:</Text>
        <TextInput
          style={styles.input}
          value={puntuacion}
          onChangeText={text => setPuntuacion(text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Comentario:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={comentario}
          onChangeText={text => setComentario(text)}
          multiline
          numberOfLines={4}
        />
      </View>
      <Button title="Enviar" onPress={handleEnviar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  textArea: {
    height: 100,
  },
});

export default Comentarios;

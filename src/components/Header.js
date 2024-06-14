import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { state } = useAuth();

  return (
    <View style={styles.header}>
      <Image source={{ uri: state.user?.imagen || 'defaultProfileImageUrl' }} style={styles.profileImage} />
      <Text style={styles.title}>hola como vas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default Header;

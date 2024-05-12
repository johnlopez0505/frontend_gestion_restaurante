import React from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Easing } from 'react-native';

const Loading = () => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    )
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: spin }] }]} />
      <ActivityIndicator size="large" color="#09f" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingSpinner: {
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderLeftColor: '#09f',
  },
});

export default Loading;

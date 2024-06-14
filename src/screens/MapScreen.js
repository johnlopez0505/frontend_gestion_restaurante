import React, { useState, useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Map, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const extractLocationFromImage = async (address) => {
  try {
    const API_KEY = "xvoZQDTCaoxZdpQWmV3eT6XV2nNhD5i2j9yH82ntMrw";
    const urlBase = "https://geocode.search.hereapi.com/v1/geocode?q";
    const response = await fetch(`${urlBase}=${address}&limit=1&apiKey=${API_KEY}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      console.log(data.items[0]);
      return data.items[0];
    } else {
      console.log('No se encontraron datos de ubicación');
      return null;
    }
  } catch (error) {
    console.error('Error extrayendo la ubicación de la imagen:', error);
    return null;
  }
};

const MapScreen = ({ route }) => {
  const { restaurante } = route.params;
  const [item, setItem] = useState(null);
  const address = `${restaurante.direccion},${restaurante.ciudad},${restaurante.provincia}`;
  
  const [mapRegion, setMapRegion] = useState(null);
  const [mapType, setMapType] = useState(Platform.select({ ios: "standard", android: "satellite" }));
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const locationData = await extractLocationFromImage(address);
      setItem(locationData);

      if (locationData) {
        const initialRegion = {
          latitude: (locationData.mapView.north + locationData.mapView.south) / 2,
          longitude: (locationData.mapView.east + locationData.mapView.west) / 2,
          latitudeDelta: locationData.mapView.north - locationData.mapView.south,
          longitudeDelta: locationData.mapView.east - locationData.mapView.west,
        };

        setMapRegion(initialRegion);
      }
    };

    fetchData();
  }, [address]);

  if (!mapRegion) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Map
        style={{ flex: 1 }}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
        mapType={mapType}
      >
        {item && item.position && (
          <Marker
            coordinate={{ latitude: item.position.lat, longitude: item.position.lng }}
            title={restaurante.nombre}
            description={address}
          />
        )}
      </Map>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Restaurantes')}
      >
        <Ionicons name="arrow-back-outline" size={30} color="black" />
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setMapRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta * 0.5,
            longitudeDelta: prevRegion.longitudeDelta * 0.5,
          }))}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setMapRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta * 2,
            longitudeDelta: prevRegion.longitudeDelta * 2,
          }))}
        >
          <Text style={styles.controlButtonText}>- </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setMapType(mapType === 'standard' ? 'hybrid' : 'standard')}
        >
          <Text style={styles.controlButtonText}>Map Type</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    bottom: 45,
    left: 30,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  controlButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginVertical: 5,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default MapScreen;


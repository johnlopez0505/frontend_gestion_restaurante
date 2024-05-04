import React from 'react';
import { View, Text, Image} from 'react-native';


const ListRestaurant = ({restaurant}) => {
    return (
        <View style={styles.container}>
          <View style={styles.img} key={restaurant.id}>
            <Image source={{ uri: restaurant.image }} style={styles.image} />
            <Text>{restaurant.nombre}</Text>
            <Text>{restaurant.ciudad}</Text>
            <Text>{restaurant.provincia}</Text>
            <Text>{restaurant.telefono}</Text>
          </View>
        </View>
      );
}

export default ListRestaurant;
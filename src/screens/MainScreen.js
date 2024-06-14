import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { Entypo, Ionicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import RestaurantScreen from './RestaurantScreen';
import AddRestaurante from '../components/AddRestaurante';
import EditRestaurante from '../components/EditRestaurante';
import AddMenu from '../components/AddMenu';
import FavoritosScreen from './FavoritosScreen';
import ProfileScreen from './ProfileScreen';
import EditProfile from '../components/EditProfile';
import RestaurantDetailsScreen from './RestaurantDetailsScreen ';
import CartaScreen from './CartaScreen';
import { Carta, NoAuthentication, Restaurante } from '../components/utils';
import EditMenu from '../components/EditMenu';
import HomeScreen from './HomeScreen';
import UsuarioScreen from './UsuarioScreen';
import MapScreen from './MapScreen';
import AddUsuario from '../components/AddUsuario';
import EditUsuario from '../components/EditUsuario';
import ListMenuRestaurante from '../components/ListMenuRestaurante';
import ReservaScreen from './ReservaScreen';
import ListReservasUsuario from '../components/ListReservasUsuario';
import AddReserva from '../components/AddReserva';
import EditReserva from '../components/EditReserva';
import UserTypeSelection from '../components/UserTypeSelection';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const CustomDrawerContent = (props) => {

  const { state, logout } = useAuth();
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("Home");
  
  const handleLogout = () => {
    logout();
    props.navigation.closeDrawer(); 
    setCurrentTab('Home');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  // Define los elementos del Drawer Navigator
  const drawerItems = [
    { name: 'Home', icon: <AntDesign name="home" style={currentTab === 'Home' ? styles.iconActive : styles.icon}/>, route: 'Home' },
    { name: 'Restaurantes', icon: <Ionicons name="restaurant-outline" style={currentTab === 'Restaurantes' ? styles.iconActive : styles.icon}/>, route: 'Restaurantes' },
    state.user && state.user.rol !== 'usuario' && { name: 'Menús', icon: <Entypo name="open-book" style={currentTab === 'Menús' ? styles.iconActive : styles.icon} />, route: 'Menús' },
    { name: 'Reservas', icon: <Ionicons name="calendar-outline" style={currentTab === 'Reservas' ? styles.iconActive : styles.icon} />, route: 'Reservas' },
    state.user && state.user.rol === 'admin' && { name: 'Usuarios', icon: <Feather name="users" style={currentTab === 'Usuarios' ? styles.iconActive : styles.icon} />, route: 'Usuarios' },
    state.user && state.user.rol === 'usuario' && { name: 'Favoritos', icon:<AntDesign name="heart" style={currentTab === 'Favoritos' ? styles.iconActive : styles.icon} />, route: 'Favoritos' }
  ].filter(item => item); // Filtramos los elementos que no son nulos
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles. profileSection}>
        {state.user?.imagen !== "" ? ( 
          <Image source={state.user?.imagen} style={styles.profileImage}/>
          ):
            (<Image source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/images-70046.appspot.com/o/2d099352-334c-4acb-9604-2ba039fa06da.png?alt=media"}} style={styles.profileImage}  />)
          }
          <Text style={styles.profileName}>{state.user?.fullName}</Text>
          <Text style={styles.profileUsername}>{state.user?.username}</Text>

          <TouchableOpacity onPress={handleProfile} style={styles.viewProfileButton}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
      </View>

        <View style={styles.drawerItemsContainer}>
          {/* Generamos dinámicamente los botones del Drawer Navigator */}
          {drawerItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => {
                props.navigation.navigate(item.route);
                setCurrentTab(item.route);
              }}
              style={currentTab === item.route ? styles.sidebarLink : styles.sidebarLinkNoActive}>
              {item.icon}
              <Text style={currentTab === item.route ? styles.textActive : styles.text}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <TouchableOpacity onPress={handleLogout}   style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="white" />
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};


const MainScreen = () => {

  const {state} = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} >
      <Drawer.Navigator  screenOptions={{
        headerStyle: {
          backgroundColor: '#78909C',
          height: Platform.select({
            android:50,
            ios:50,
          }), 
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          width:'100%'
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />} drawerActiveTintColor="#5359D1" >
        {state.isAuthenticated ? (
          <>
            <Drawer.Screen name="Home" component={HomeScreen}  />
            <Drawer.Screen name="Restaurantes" component={RestaurantScreen} />
            <Drawer.Screen name="Menús" component={CartaScreen} />
            <Drawer.Screen name="Reservas" component={ReservaScreen} />
            <Drawer.Screen name="Usuarios" component={UsuarioScreen} />
            <Drawer.Screen name="Favoritos" component={FavoritosScreen} />
            <Stack.Screen name="Add restaurante" component={AddRestaurante} options={{
              headerLeft: () => <Restaurante />}} />
            <Stack.Screen name="Add menu" component={AddMenu}  options={{
              headerLeft: () => <Carta />,}}/>
            <Stack.Screen name="Add usuario" component={AddUsuario} />
            <Stack.Screen name='Crear usuario' component={UserTypeSelection} />
            <Stack.Screen name="Add Reserva" component={AddReserva}/>
            <Stack.Screen name="Edit restaurante" component={EditRestaurante} options={{
              headerLeft: () => <Restaurante />}} />
            <Stack.Screen name="Editar Menú" component={EditMenu} options={{
              headerLeft: () => <Carta />,}}/>
            <Stack.Screen name="Edit usuario" component={EditUsuario} />
            <Stack.Screen name="Edit Reserva" component={EditReserva} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Carta" component={CartaScreen} />
            <Stack.Screen name='Carta Restaurante' component={ListMenuRestaurante}  options={{
              headerLeft: () => <Restaurante />,}}/>
            <Stack.Screen name='Lista Reservas' component={ListReservasUsuario}  options={{
              headerLeft: () => <Restaurante />,}}/>
            <Stack.Screen name="Map" component={MapScreen} options={{
              headerLeft: () => <Restaurante />,}}/>
            <Stack.Screen name="Detalles del restaurante" component={RestaurantDetailsScreen}   options={{
              headerLeft: () => <Restaurante />,}}/>
          </>
  
        ) : (
          <>
            <Drawer.Screen name="Login" component={LoginScreen} options={{
               headerLeft: () => <NoAuthentication />
              }}/>
            <Drawer.Screen name="Register" component={RegisterScreen} options={{
               headerLeft: () => <NoAuthentication />
              }}/>
          </>
        )}
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#78909C',
  },
  safeArea:{
    flex: 1, 
    marginTop: Platform.select({android:50}),
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#566573',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    marginBottom: 10,
},
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center',
    color: 'white',
    marginTop: 20,
    
  },

  viewProfileButton: {
    backgroundColor: '#212F3D',
    paddingVertical: 10,
    marginTop:15,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  viewProfileText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight:'bold',
  },

  profileUsername: {
    fontSize: 16,
    textAlign:'center',
    color: 'white',
    marginTop:5,
  },

  drawerItemsContainer: {
    flexGrow: 1,
    marginTop: 20,
    margin:'auto',
  },

  sidebarLink: {
    backgroundColor:'white',
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 15,
    paddingRight: 55,
    borderRadius: 8,
    marginTop: 15,
    fontSize:20,
  },
  sidebarLinkNoActive: {
    flexDirection: "row",
    alignItems: 'center',
    alignContent:'center',
    paddingLeft: 15,
    paddingRight: 55,
    borderRadius: 8,
    marginTop: 15,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15,
    color: "white"
  },
  textActive:{
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15,
    color: "#78909C"
  },

  icon: {
    color: "white",
    fontSize: 25,
  },

  iconActive:{
    color: "#78909C",
    fontSize: 25,
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
    margin:'auto',
    borderRadius: 8,
    marginVertical: 5,
    marginBottom: 30,
    width:'80%',
    backgroundColor: '#212F3D',
  }
});

export default MainScreen;

import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Usuarios from "./Usuarios";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { Provider as PaperProvider } from 'react-native-paper';
import API from "./axios";


const  ListUsuarios = () => {
   
    const {usuarios, setUsuarios,setLoading,loading} = useAuth();
    const [error, setError ] = useState(null);

    useEffect(() => {

      const fetchUsuarios = async () => {
        
        try {
            setLoading(true);
            setError(null); 
            console.log("entro en listar usuarios");
            const response = await API.get('/usuarios');
            console.log(response.data.message);
            if(response.data.result ==='ok'){
              // Ordenar los usuarios por id de menor a mayor
               const sortedUsuarios = response.data.usuarios.sort((a, b) => a.id - b.id);
              setUsuarios(sortedUsuarios);
            }else{
              setError(response.data.message);
            }
        } catch (error) {
           setError(error.response?.data?.message || "Error al obtener los usuarios")
        }finally{
          setLoading(false);
        }
      };
      fetchUsuarios();
    }, []);

    return(

    <PaperProvider>
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
           {error && <Text style={{ color: 'red' }}>{error}</Text>}
          <View style={styles.containerRestaurante}>
            {usuarios === undefined ? (
                <Text>No hay usuarios</Text>
            ) : (
              usuarios.map(usuario => (
                <Usuarios key={usuario.id} usuario={usuario} />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      minHeight: Dimensions.get('window').height,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      minHeight: Dimensions.get('window').height,
    },
    scrollView: {
      flex: 1,
    },
    containerRestaurante: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 20,
      paddingVertical: 20,
      paddingHorizontal: 0,
      alignItems: 'row',
      backgroundColor:'white',
      minWidth: '100%',
    },

    error: {
      color: 'red',
      marginBottom: 10,
    },
  });

export default ListUsuarios;
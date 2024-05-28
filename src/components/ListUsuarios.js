import { Text, View } from "react-native";
import Usuarios from "./Usuarios";
import { useAuth } from "../context/AuthProvider";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import Loading from "./Loading";
import API from "./axios";


const  ListUsuarios = () => {
   
    const {usuarios, setUsuarios,setLoading} = useAuth();

    useEffect(() => {

      const fetchUsuarios = async () => {
        try {
            console.log("entro en listar usuarios");
            const response = await API.get('/usuarios');
            console.log(response.data.usuarios);
            setUsuarios(response.data.Usuarios); 
           
        } catch (error) {
        
            if (error.response && error.response.data.status === "FORBIDDEN") {
                console.error('Error: el token ha expirado');
            } else {
                console.error("Error al obtener los usuarios", error);
            }
        }
      };
      fetchUsuarios();
    }, []);

    return(
       
        <View >
        {
            usuarios === undefined? <Text>No hay usuarios</Text>:
            usuarios.map(usuario => (
            <Usuarios key={usuario.id} usuario={usuario} />
            ))
        }
          </View>
    );
}

export default ListUsuarios;
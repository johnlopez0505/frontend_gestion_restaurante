import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import axios from 'axios';
// import { AsyncStorage } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage desde 'react-native'

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, isAuthenticated: true, user: action.payload.user, 
                token: action.payload.token, refreshToken: action.payload.refreshToken, loginError: null };
        case 'LOGIN_FAILED':
            return { ...state, isAuthenticated: false, user: null, token: null, 
                refreshToken: null, loginError: action.payload };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, user: null, token: null, refreshToken: null, loginError: null };
        case 'REGISTER_SUCCESS':
            return { ...state, isAuthenticated: true, user: action.payload.user, loginError: null };
        case 'REGISTER_FAILED':
            return { ...state, isAuthenticated: false, user: null,  loginError: action.payload };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const AuthProvider = ({ children }) => {
    const initialState = {
        isAuthenticated: false,
        user:{
            "id":"",
            "username": "",
            "fullName": "",
            "rol":"",
        },
        token: null,
        refreshToken: null,
        loginError: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(false);
    const [restaurantes, setRestaurantes] = useState([]);
    const [menus, setMenus] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [urlSolicitud, setUrlSolicitud] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Obtener el token desde AsyncStorage
                const refreshToken = AsyncStorage.getItem('refreshToken');
                if (token && refreshToken) {
                    const user = JSON.parse(await AsyncStorage.getItem('user')); // Obtener el usuario desde AsyncStorage
                    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken} });
                }
            } catch (error) {
                console.error("Error al cargar el usuario", error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post('https://backend-fbwq.onrender.com/api/auth/login', { username, password });
            const { token, refreshToken, fullName, id, rol } = response.data;
            await AsyncStorage.setItem('token', token); // Guardar el token en AsyncStorage
            await AsyncStorage.setItem('refreshToken', refreshToken); // Guardar el refreshToken en el AsyncStorage
            // Guardar el usuario en AsyncStorage
            const user = { id, fullName, rol, username };
            await AsyncStorage.setItem('user', JSON.stringify(user));
    
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error durante el inicio de sesión", error);
            dispatch({ type: 'LOGIN_FAILED', payload: error.response.data || 'Error al iniciar sesión' })
        }
    };

    const register = async (username, password, fullName) => {
        try {
            const response = await axios.post('https://backend-fbwq.onrender.com/api/auth/register', { username, password, fullName });
            const { accessToken, user } = response.data;
            await AsyncStorage.setItem('token', accessToken);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'REGISTER_SUCCESS', payload: { user, accessToken } });
        } catch (error) {
            dispatch({ type: 'REGISTER_FAILED', payload: error.response.data || 'Error en el registro' });
        }
    };


    // useEffect(() => {
    //     const fetchMenus = async () => {
    //         try {
    //             const response = await API.get('/menus');
    //             setMenus(response.data);
    //         } catch (error) {
    //             console.error("Error al obtener los menús", error);
    //         }
    //     }
    //     fetchMenus();
        
    // },[])

    // useEffect(() => {
    //     const fetchUsuarios = async () => {
    //         try {
    //             const response = await API.get('/usuarios');
    //             setUsuarios(response.data);
    //         } catch (error) {
    //             console.error("Error al obtener las usuarios", error);
    //         }
    //     }
    //     fetchUsuarios();
        
    // },[])

    // useEffect(() => {
    //     const fetchReservas = async () => {
    //         try {
    //             const response = await API.get('/reservas');
    //             setRestaurantes(response.data);
    //         } catch (error) {
    //             console.error("Error al obtener las reservas", error);
    //         }
    //     }
    //     fetchReservas();
        
    // },[])



    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Eliminar el token de AsyncStorage
            await AsyncStorage.removeItem('refreshToken') //Eliminar el token de AsyncStorage
            await AsyncStorage.removeItem('user'); // Eliminar el usuario de AsyncStorage
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    const getToken = () => {
        return state.token;
    };

    return (
        <AuthContext.Provider value={{ login, register, logout, getToken, state, loading, setLoading,
        setRestaurantes,restaurantes,setMenus,menus, setReservas,
        reservas,setUsuarios,usuarios, urlSolicitud, setUrlSolicitud}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

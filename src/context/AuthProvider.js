import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

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
            "telefono": "",
            "imagen":"",
            "rol":"",
        },
        token: null,
        refreshToken: null,
        loginError: null,
    };
    

    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(false);
    const [restaurantes, setRestaurantes] = useState([]);
    const [menus, setMenus] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [urlSolicitud, setUrlSolicitud] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [combinedData, setCombinedData] = useState([]);
    const [menusRestaurante, setMenusRestaurante] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    const [role, setRole] = useState(''); // Estado para el rol

    const [error, setError] = useState(null);

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
        try {
            setLoading(true);
            const response = await axios.post('https://backend-fbwq.onrender.com/api/auth/login', { username, password });
            if (response.data.result === "ok") {    
                const { id, fullName, telefono, rol, imagen ,token, refreshToken } = response.data.usuarios;
                // Guardar tokens y usuario en AsyncStorage
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('refreshToken', refreshToken);
                const user = { id, username, fullName, telefono, rol, imagen };
                await AsyncStorage.setItem('user', JSON.stringify(user));
                dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
            } else {
                dispatch({ type: 'LOGIN_FAILED', payload: response.data.message || 'Error al iniciar sesión' });
                setError(response.data.message);
            }
        } catch (error) {
            console.log(error.response?.data?.message);
            dispatch({ type: 'LOGIN_FAILED', payload: error.response?.data?.message || 'Error al iniciar sesión' });
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Eliminar el token de AsyncStorage
            await AsyncStorage.removeItem('refreshToken'); //Eliminar el token de AsyncStorage
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
        <AuthContext.Provider value={{ login, logout, getToken, state, loading, setLoading, role,
        setRestaurantes,restaurantes,setMenus,menus, setReservas, favoritos, setFavoritos, setRole,
        reservas,setUsuarios,usuarios, urlSolicitud, setUrlSolicitud, searchQuery , setSearchQuery,
        combinedData, setCombinedData, menusRestaurante, setMenusRestaurante, actualizar, setActualizar }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

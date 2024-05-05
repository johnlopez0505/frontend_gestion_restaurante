import axios from 'axios';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage desde 'react-native'

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (token && refreshToken) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.RefreshToken = refreshToken;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

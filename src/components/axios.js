import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const API = axios.create({
  // baseURL: 'http://192.168.1.33:8080/api'
  baseURL: 'https://backend-fbwq.onrender.com/api'
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

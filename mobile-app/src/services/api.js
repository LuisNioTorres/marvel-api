import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base del backend — cambia aquí si es necesario
const API_BASE_URL = 'http://localhost:3000/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor de request: agregar Authorization header con el token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token de AsyncStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejar 401 eliminando token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('authUser');
      } catch (err) {
        console.error('Error al eliminar token:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

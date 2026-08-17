import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useState({
    isLoading: true,
    isSignedIn: false,
    user: null,
    token: null,
  });

  // Cargar token al montar la app
  useEffect(() => {
    bootstrapAsync();
  }, []);

  async function bootstrapAsync() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('authUser');
      const user = userStr ? JSON.parse(userStr) : null;

      dispatch({
        isLoading: false,
        isSignedIn: !!token,
        user,
        token,
      });
    } catch (e) {
      console.error('Error al restaurar sesión:', e);
      dispatch({
        isLoading: false,
        isSignedIn: false,
        user: null,
        token: null,
      });
    }
  }

  async function authContext_login(token, user) {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('authUser', JSON.stringify(user));
      dispatch({
        isLoading: false,
        isSignedIn: true,
        user,
        token,
      });
    } catch (e) {
      console.error('Error al guardar sesión:', e);
    }
  }

  async function authContext_logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authUser');
      dispatch({
        isLoading: false,
        isSignedIn: false,
        user: null,
        token: null,
      });
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  }

  const authContext = {
    state,
    login: authContext_login,
    logout: authContext_logout,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

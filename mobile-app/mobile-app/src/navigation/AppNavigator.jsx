import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HeroesScreen from '../screens/HeroesScreen';
import HeroDetailScreen from '../screens/HeroDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MissionsScreen from '../screens/MissionsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(Boolean(token));
    }

    checkSession();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#fff' }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
          <Stack.Screen name="Heroes" component={HeroesScreen} options={{ title: 'Superhéroes' }} />
          <Stack.Screen name="HeroDetail" component={HeroDetailScreen} options={{ title: 'Detalle del héroe' }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
          <Stack.Screen name="Missions" component={MissionsScreen} options={{ title: 'Misiones' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

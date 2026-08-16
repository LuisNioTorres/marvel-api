import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HeroesScreen from '../screens/HeroesScreen';
import HeroDetailScreen from '../screens/HeroDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MisionesScreen from '../screens/MisionesScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Heroes" component={HeroesScreen} />
      <Stack.Screen name="HeroDetail" component={HeroDetailScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Misiones" component={MisionesScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  // Token handling will be implemented in Fase 3; for now default to showing Login
  const [token] = useState(null);

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

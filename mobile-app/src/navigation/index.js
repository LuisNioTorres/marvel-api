import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HeroesScreen from '../screens/HeroesScreen';
import HeroDetailScreen from '../screens/HeroDetailScreen';
import HeroFormScreen from '../screens/HeroFormScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MisionesScreen from '../screens/MisionesScreen';
import MisionFormScreen from '../screens/MisionFormScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { logout } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1f3a' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff', fontWeight: '600' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Heroes" component={HeroesScreen} />
      <Stack.Screen name="HeroDetail" component={HeroDetailScreen} />
      <Stack.Screen name="HeroForm" component={HeroFormScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Misiones" component={MisionesScreen} />
      <Stack.Screen name="MisionForm" component={MisionFormScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const { state } = useContext(AuthContext);
  const { isLoading, isSignedIn } = state;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0e27' }}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

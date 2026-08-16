import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Navigation from './src/navigation';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <StatusBar style="auto" />
    </View>
  );
}

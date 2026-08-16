import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HeroesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Héroes</Text>
      <Text>Placeholder screen — implemented in Fase 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});

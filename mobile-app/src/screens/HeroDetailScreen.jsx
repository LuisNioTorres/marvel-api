import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HeroDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle Héroe</Text>
      <Text>Placeholder screen — implemented in Fase 6</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});

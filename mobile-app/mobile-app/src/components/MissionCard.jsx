import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MissionCard({ mission }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{mission.titulo}</Text>
      <Text style={styles.text}>{mission.descripcion}</Text>
      <Text style={styles.text}>Ubicación: {mission.ubicacion}</Text>
      <Text style={styles.text}>Fecha: {mission.fecha}</Text>
      <Text style={styles.text}>Nivel de peligro: {mission.nivel_peligro}</Text>
      <Text style={styles.text}>Estado: {mission.estado}</Text>
      <Text style={styles.text}>Héroe: {mission.superheroe_nombre || 'No asignado'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  text: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
});

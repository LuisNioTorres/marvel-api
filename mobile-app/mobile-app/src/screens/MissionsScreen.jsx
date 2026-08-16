import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../services/api';
import MissionCard from '../components/MissionCard';

export default function MissionsScreen() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMissions();
  }, []);

  async function loadMissions() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/misiones');
      setMissions(response.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al cargar las misiones');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d90429" />
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!missions.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No hay misiones disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MissionCard mission={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  list: {
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
  },
});

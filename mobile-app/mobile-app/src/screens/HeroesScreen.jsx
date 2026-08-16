import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../services/api';
import HeroCard from '../components/HeroCard';

export default function HeroesScreen({ navigation }) {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHeroes();
  }, []);

  async function loadHeroes() {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/heroes');
      setHeroes(response.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al cargar los héroes');
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

  if (!heroes.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No hay héroes disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={heroes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <HeroCard hero={item} onPress={() => navigation.navigate('HeroDetail', { heroId: item.id })} />
        )}
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

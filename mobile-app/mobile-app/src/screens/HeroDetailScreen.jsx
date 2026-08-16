import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function HeroDetailScreen({ route }) {
  const { heroId } = route.params;
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadHero();
    checkFavorite();
  }, [heroId]);

  async function loadHero() {
    try {
      const response = await api.get(`/heroes/${heroId}`);
      setHero(response.data.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Superhéroe no encontrado');
    } finally {
      setLoading(false);
    }
  }

  async function checkFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');
    const parsed = favorites ? JSON.parse(favorites) : [];
    setIsFavorite(parsed.some((item) => item.id === Number(heroId)));
  }

  async function toggleFavorite() {
    const favorites = await AsyncStorage.getItem('favorites');
    const parsed = favorites ? JSON.parse(favorites) : [];

    if (isFavorite) {
      const updated = parsed.filter((item) => item.id !== Number(heroId));
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
      return;
    }

    const updated = [...parsed, hero];
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorite(true);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d90429" />
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  if (error || !hero) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Superhéroe no encontrado'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: hero.imagen_url || 'https://via.placeholder.com/500' }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{hero.nombre}</Text>
        <Text style={styles.label}>Nombre real: <Text style={styles.value}>{hero.nombre_real}</Text></Text>
        <Text style={styles.label}>Poder principal: <Text style={styles.value}>{hero.poder_principal}</Text></Text>
        <Text style={styles.label}>Nivel de poder: <Text style={styles.value}>{hero.nivel_poder}</Text></Text>
        <Text style={styles.label}>Estado: <Text style={styles.value}>{hero.estado}</Text></Text>

        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteText}>{isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#ddd',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
  },
  favoriteButton: {
    marginTop: 22,
    backgroundColor: '#d90429',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  favoriteText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
    color: '#b91c1c',
    fontSize: 16,
    textAlign: 'center',
  },
});

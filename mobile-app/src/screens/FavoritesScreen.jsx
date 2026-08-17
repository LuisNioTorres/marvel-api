import React, { useEffect, useState, useFocusEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api';

export default function FavoritesScreen({ navigation }) {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  async function fetchFavorites() {
    setLoading(true);
    setError('');
    try {
      // Obtener IDs de favoritos
      const favoritesStr = await AsyncStorage.getItem('favoriteHeroes');
      const favoriteIds = favoritesStr ? JSON.parse(favoritesStr) : [];

      if (favoriteIds.length === 0) {
        setHeroes([]);
        setLoading(false);
        return;
      }

      // Obtener todos los héroes
      const response = await apiClient.get('/heroes');
      const allHeroes = response.data.data || [];

      // Filtrar solo los favoritos
      const favoriteHeroes = allHeroes.filter((hero) =>
        favoriteIds.includes(hero.id)
      );

      setHeroes(favoriteHeroes);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sesión expirada. Inicia sesión nuevamente.');
      } else {
        setError('Error al cargar favoritos. Intenta nuevamente.');
      }
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleHeroPress(heroId) {
    navigation.navigate('HeroDetail', { id: heroId });
  }

  function renderHeroCard({ item }) {
    return (
      <TouchableOpacity
        style={styles.heroCard}
        onPress={() => handleHeroPress(item.id)}
      >
        {item.imagen_url && (
          <Image
            source={{ uri: item.imagen_url }}
            style={styles.heroImage}
          />
        )}
        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>{item.nombre}</Text>
          <Text style={styles.heroPower}>{item.poder_principal}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroLevel}>Nivel: {item.nivel_poder}</Text>
            <Text style={[styles.heroStatus, item.estado === 'ACTIVO' ? styles.statusActive : styles.statusInactive]}>
              {item.estado}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFavorites}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (heroes.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>No hay héroes en favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={heroes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHeroCard}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
  },
  heroCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 120,
  },
  heroImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  heroInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  heroName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  heroPower: {
    fontSize: 13,
    color: '#aaa',
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLevel: {
    fontSize: 12,
    color: '#888',
  },
  heroStatus: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#27ae60',
    color: '#fff',
  },
  statusInactive: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
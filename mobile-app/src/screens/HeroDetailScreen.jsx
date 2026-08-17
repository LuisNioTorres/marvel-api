import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api';

export default function HeroDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchHeroDetail();
    checkIfFavorite();
  }, [id]);

  async function checkIfFavorite() {
    try {
      const favoritesStr = await AsyncStorage.getItem('favoriteHeroes');
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      setIsFavorite(favorites.includes(id));
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  }

  async function toggleFavorite() {
    try {
      const favoritesStr = await AsyncStorage.getItem('favoriteHeroes');
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      
      if (isFavorite) {
        // Quitar de favoritos
        const updated = favorites.filter((fav) => fav !== id);
        await AsyncStorage.setItem('favoriteHeroes', JSON.stringify(updated));
      } else {
        // Agregar a favoritos
        if (!favorites.includes(id)) {
          favorites.push(id);
        }
        await AsyncStorage.setItem('favoriteHeroes', JSON.stringify(favorites));
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }

  async function fetchHeroDetail() {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/heroes/${id}`);
      setHero(response.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Superhéroe no encontrado');
      } else if (err.response?.status === 401) {
        setError('Sesión expirada. Inicia sesión nuevamente.');
      } else {
        setError('Error al cargar el detalle del héroe.');
      }
      console.error('Error fetching hero detail:', err);
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchHeroDetail}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hero) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Superhéroe no disponible</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {hero.imagen_url && (
          <Image source={{ uri: hero.imagen_url }} style={styles.heroImage} />
        )}

        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{hero.nombre}</Text>
            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={toggleFavorite}
            >
              <Text style={styles.favoriteButtonText}>{isFavorite ? '★' : '☆'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre Real:</Text>
            <Text style={styles.value}>{hero.nombre_real}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Poder Principal:</Text>
            <Text style={styles.value}>{hero.poder_principal}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nivel de Poder:</Text>
            <Text style={styles.value}>{hero.nivel_poder}/100</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text
              style={[
                styles.value,
                hero.estado === 'ACTIVO' ? styles.statusActiveText : styles.statusInactiveText,
              ]}
            >
              {hero.estado}
            </Text>
          </View>

          {hero.created_at && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Creado:</Text>
              <Text style={styles.dateValue}>
                {new Date(hero.created_at).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#e74c3c',
  },
  favoriteButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: '#aaa',
  },
  statusActiveText: {
    color: '#27ae60',
    fontWeight: '700',
  },
  statusInactiveText: {
    color: '#e74c3c',
    fontWeight: '700',
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
});

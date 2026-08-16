import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeroCard from '../components/HeroCard';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    loadFavorites();
    return unsubscribe;
  }, [navigation]);

  async function loadFavorites() {
    const data = await AsyncStorage.getItem('favorites');
    const parsed = data ? JSON.parse(data) : [];
    setFavorites(parsed);
  }

  if (!favorites.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No tienes héroes favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
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
  empty: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

export default function HeroCard({ hero, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: hero.imagen_url || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name}>{hero.nombre}</Text>
        <Text style={styles.text}>Poder: {hero.poder_principal}</Text>
        <Text style={styles.text}>Nivel: {hero.nivel_poder}</Text>
        <Text style={styles.text}>Estado: {hero.estado}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: '#f3f3f3',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
});

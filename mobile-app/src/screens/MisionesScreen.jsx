import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import apiClient from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function MisionesScreen({ navigation }) {
  const { state } = useContext(AuthContext);
  const isAdmin = state.user?.rol === 'ADMIN';

  const [misiones, setMisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Botón "+ Crear misión" en el header, solo para ADMIN
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isAdmin ? (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('MisionForm', { mode: 'create' })}
          >
            <Text style={styles.headerButtonText}>+ Crear</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, isAdmin]);

  // Recargar al montar y cada vez que la pantalla recibe foco (tras crear/editar/eliminar)
  useEffect(() => {
    fetchMisiones();
    const unsubscribe = navigation.addListener('focus', fetchMisiones);
    return unsubscribe;
  }, [navigation]);

  function handleDelete(mision) {
    Alert.alert(
      'Eliminar misión',
      `¿Seguro que deseas eliminar "${mision.titulo}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => confirmDelete(mision.id) },
      ]
    );
  }

  async function confirmDelete(id) {
    setDeletingId(id);
    try {
      await apiClient.delete(`/misiones/${id}`);
      fetchMisiones();
    } catch (err) {
      let msg = 'Error al eliminar la misión. Intenta nuevamente.';
      if (err.response?.status === 403) {
        msg = 'No tienes permisos para realizar esta acción.';
      } else if (err.response?.status === 401) {
        msg = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      }
      Alert.alert('No se pudo eliminar', msg);
      console.error('Error deleting mission:', err);
    } finally {
      setDeletingId(null);
    }
  }

  async function fetchMisiones() {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/misiones');
      setMisiones(response.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sesión expirada. Inicia sesión nuevamente.');
      } else {
        setError('Error al cargar misiones. Intenta nuevamente.');
      }
      console.error('Error fetching misiones:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function getDangerColor(nivel) {
    switch (nivel) {
      case 'BAJO':
        return '#27ae60';
      case 'MEDIO':
        return '#f39c12';
      case 'ALTO':
        return '#e74c3c';
      default:
        return '#888';
    }
  }

  function getStatusColor(estado) {
    switch (estado) {
      case 'PENDIENTE':
        return '#95a5a6';
      case 'EN_PROGRESO':
        return '#3498db';
      case 'COMPLETADA':
        return '#27ae60';
      default:
        return '#888';
    }
  }

  function renderMisionCard({ item }) {
    return (
      <View style={styles.misionCard}>
        <View style={styles.header}>
          <Text style={styles.titulo}>{item.titulo}</Text>
        </View>

        <Text style={styles.descripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Ubicación:</Text>
            <Text style={styles.metaValue}>{item.ubicacion}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Fecha:</Text>
            <Text style={styles.metaValue}>{formatDate(item.fecha)}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Peligro:</Text>
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: getDangerColor(item.nivel_peligro) },
              ]}
            >
              {item.nivel_peligro}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Estado:</Text>
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.estado) },
              ]}
            >
              {item.estado}
            </Text>
          </View>
        </View>

        {item.superheroe_nombre && (
          <View style={styles.heroInfo}>
            <Text style={styles.heroLabel}>Asignado a:</Text>
            <Text style={styles.heroName}>{item.superheroe_nombre}</Text>
          </View>
        )}

        {isAdmin && (
          <View style={styles.adminActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => navigation.navigate('MisionForm', { mode: 'edit', mision: item })}
              disabled={deletingId === item.id}
            >
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.deleteButton,
                deletingId === item.id && styles.buttonDisabled,
              ]}
              onPress={() => handleDelete(item)}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>Eliminar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchMisiones}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (misiones.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>No hay misiones disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={misiones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMisionCard}
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
  misionCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  header: {
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  descripcion: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 12,
    lineHeight: 18,
  },
  meta: {
    marginBottom: 12,
  },
  metaItem: {
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    color: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusItem: {
    flex: 1,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroInfo: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
  },
  heroLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroName: {
    fontSize: 13,
    color: '#e74c3c',
    fontWeight: '600',
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
  headerButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#3498db',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
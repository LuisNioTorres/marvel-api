import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiClient from '../services/api';

const ESTADOS = ['ACTIVO', 'INACTIVO'];

export default function HeroFormScreen({ route, navigation }) {
  const mode = route.params?.mode === 'edit' ? 'edit' : 'create';
  const heroParam = route.params?.hero || null;

  const [nombre, setNombre] = useState(heroParam?.nombre || '');
  const [nombreReal, setNombreReal] = useState(heroParam?.nombre_real || '');
  const [poderPrincipal, setPoderPrincipal] = useState(heroParam?.poder_principal || '');
  const [nivelPoder, setNivelPoder] = useState(
    heroParam?.nivel_poder != null ? String(heroParam.nivel_poder) : ''
  );
  const [imagenUrl, setImagenUrl] = useState(heroParam?.imagen_url || '');
  const [estado, setEstado] = useState(heroParam?.estado || 'ACTIVO');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: mode === 'edit' ? 'Editar héroe' : 'Crear héroe' });
  }, [navigation, mode]);

  function validate() {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (!nombreReal.trim()) return 'El nombre real es obligatorio';
    if (!poderPrincipal.trim()) return 'El poder principal es obligatorio';
    const nivel = Number(nivelPoder);
    if (!nivelPoder.trim() || isNaN(nivel) || nivel < 1 || nivel > 100) {
      return 'El nivel de poder debe estar entre 1 y 100';
    }
    if (!ESTADOS.includes(estado)) return 'Estado inválido';
    return '';
  }

  async function handleSave() {
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      nombre_real: nombreReal.trim(),
      poder_principal: poderPrincipal.trim(),
      nivel_poder: Number(nivelPoder),
      imagen_url: imagenUrl.trim() || null,
      estado,
    };

    setSaving(true);
    try {
      if (mode === 'edit') {
        await apiClient.put(`/heroes/${heroParam.id}`, payload);
      } else {
        await apiClient.post('/heroes', payload);
      }
      navigation.goBack();
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sesión expirada. Inicia sesión nuevamente.');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para realizar esta acción.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al guardar el héroe. Intenta nuevamente.');
      }
      console.error('Error saving hero:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Ironman"
        placeholderTextColor="#666"
        editable={!saving}
      />

      <Text style={styles.label}>Nombre real *</Text>
      <TextInput
        style={styles.input}
        value={nombreReal}
        onChangeText={setNombreReal}
        placeholder="Ej: Tony Stark"
        placeholderTextColor="#666"
        editable={!saving}
      />

      <Text style={styles.label}>Poder principal *</Text>
      <TextInput
        style={styles.input}
        value={poderPrincipal}
        onChangeText={setPoderPrincipal}
        placeholder="Ej: Tecnología avanzada"
        placeholderTextColor="#666"
        editable={!saving}
      />

      <Text style={styles.label}>Nivel de poder (1-100) *</Text>
      <TextInput
        style={styles.input}
        value={nivelPoder}
        onChangeText={setNivelPoder}
        placeholder="Ej: 90"
        placeholderTextColor="#666"
        keyboardType="numeric"
        editable={!saving}
      />

      <Text style={styles.label}>Imagen URL</Text>
      <TextInput
        style={styles.input}
        value={imagenUrl}
        onChangeText={setImagenUrl}
        placeholder="https://..."
        placeholderTextColor="#666"
        autoCapitalize="none"
        editable={!saving}
      />

      <Text style={styles.label}>Estado *</Text>
      <View style={styles.optionsRow}>
        {ESTADOS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionChip, estado === opt && styles.optionChipActive]}
            onPress={() => setEstado(opt)}
            disabled={saving}
          >
            <Text style={[styles.optionText, estado === opt && styles.optionTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {mode === 'edit' ? 'Guardar cambios' : 'Crear héroe'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={saving}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionChip: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginTop: 4,
  },
  optionChipActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  optionText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#fff',
  },
  error: {
    color: '#ff6b6b',
    fontSize: 13,
    marginTop: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
});

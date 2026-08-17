import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../services/api';

const NIVELES_PELIGRO = ['BAJO', 'MEDIO', 'ALTO'];
const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];

// Normaliza la fecha del backend (ISO/DATE) a YYYY-MM-DD para el input
function toDateInput(value) {
  if (!value) return '';
  const str = String(value);
  return str.length >= 10 ? str.slice(0, 10) : str;
}

export default function MisionFormScreen({ route, navigation }) {
  const mode = route.params?.mode === 'edit' ? 'edit' : 'create';
  const misionParam = route.params?.mision || null;

  const [titulo, setTitulo] = useState(misionParam?.titulo || '');
  const [descripcion, setDescripcion] = useState(misionParam?.descripcion || '');
  const [ubicacion, setUbicacion] = useState(misionParam?.ubicacion || '');
  const [fecha, setFecha] = useState(toDateInput(misionParam?.fecha));
  const [nivelPeligro, setNivelPeligro] = useState(misionParam?.nivel_peligro || 'BAJO');
  const [estado, setEstado] = useState(misionParam?.estado || 'PENDIENTE');
  const [superheroeId, setSuperheroeId] = useState(
    misionParam?.superheroe_id != null ? misionParam.superheroe_id : null
  );

  const [heroes, setHeroes] = useState([]);
  const [heroesLoading, setHeroesLoading] = useState(true);
  const [heroesError, setHeroesError] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ title: mode === 'edit' ? 'Editar misión' : 'Crear misión' });
  }, [navigation, mode]);

  useEffect(() => {
    fetchHeroes();
  }, []);

  async function fetchHeroes() {
    setHeroesLoading(true);
    setHeroesError('');
    try {
      const response = await apiClient.get('/heroes');
      setHeroes(response.data.data || []);
    } catch (err) {
      setHeroesError('No se pudieron cargar los héroes.');
      console.error('Error fetching heroes for mission form:', err);
    } finally {
      setHeroesLoading(false);
    }
  }

  function validate() {
    if (!titulo.trim()) return 'El título es obligatorio';
    if (!descripcion.trim()) return 'La descripción es obligatoria';
    if (!ubicacion.trim()) return 'La ubicación es obligatoria';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha.trim())) return 'La fecha debe tener formato YYYY-MM-DD';
    if (!NIVELES_PELIGRO.includes(nivelPeligro)) return 'Nivel de peligro inválido';
    if (!ESTADOS.includes(estado)) return 'Estado inválido';
    if (!superheroeId) return 'Debes seleccionar un superhéroe';
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
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      fecha: fecha.trim(),
      nivel_peligro: nivelPeligro,
      estado,
      superheroe_id: superheroeId,
    };

    setSaving(true);
    try {
      if (mode === 'edit') {
        await apiClient.put(`/misiones/${misionParam.id}`, payload);
      } else {
        await apiClient.post('/misiones', payload);
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
        setError('Error al guardar la misión. Intenta nuevamente.');
      }
      console.error('Error saving mission:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ej: Salvar la ciudad"
        placeholderTextColor="#666"
        editable={!saving}
      />

      <Text style={styles.label}>Descripción *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Describe la misión"
        placeholderTextColor="#666"
        multiline
        editable={!saving}
      />

      <Text style={styles.label}>Ubicación *</Text>
      <TextInput
        style={styles.input}
        value={ubicacion}
        onChangeText={setUbicacion}
        placeholder="Ej: Nueva York"
        placeholderTextColor="#666"
        editable={!saving}
      />

      <Text style={styles.label}>Fecha (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
        placeholder="2026-09-01"
        placeholderTextColor="#666"
        autoCapitalize="none"
        editable={!saving}
      />

      <Text style={styles.label}>Nivel de peligro *</Text>
      <View style={styles.optionsRow}>
        {NIVELES_PELIGRO.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.optionChip, nivelPeligro === opt && styles.optionChipActive]}
            onPress={() => setNivelPeligro(opt)}
            disabled={saving}
          >
            <Text style={[styles.optionText, nivelPeligro === opt && styles.optionTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      <Text style={styles.label}>Superhéroe asignado *</Text>
      {heroesLoading ? (
        <ActivityIndicator color="#e74c3c" style={{ marginTop: 8 }} />
      ) : heroesError ? (
        <View>
          <Text style={styles.error}>{heroesError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHeroes}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : heroes.length === 0 ? (
        <Text style={styles.emptyText}>No hay héroes disponibles</Text>
      ) : (
        <View style={styles.optionsRow}>
          {heroes.map((hero) => (
            <TouchableOpacity
              key={hero.id}
              style={[styles.optionChip, superheroeId === hero.id && styles.optionChipActive]}
              onPress={() => setSuperheroeId(hero.id)}
              disabled={saving}
            >
              <Text
                style={[styles.optionText, superheroeId === hero.id && styles.optionTextActive]}
              >
                {hero.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
            {mode === 'edit' ? 'Guardar cambios' : 'Crear misión'}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    marginBottom: 4,
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
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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

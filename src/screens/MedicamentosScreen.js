import React, { useState } from 'react';
import { useMedicamentos } from '../screens/MedicamentosContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useThemePreference } from '../contexts/ThemeContext';

const MedicamentosScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const state = typeof navigation.getState === 'function' ? navigation.getState() : undefined;
    const routeNames = state && Array.isArray(state.routeNames) ? state.routeNames : [];
    
    // If we're in MedicamentosTab, go back to Main (which contains the tab navigator)
    if (routeNames.includes('Main')) {
      navigation.navigate('Main');
      return;
    }
    if (routeNames.includes('CuidadoHome')) {
      navigation.navigate('CuidadoHome');
      return;
    }
    if (routeNames.includes('SelectUserType')) {
      navigation.navigate('SelectUserType');
      return;
    }
  };

  // Dados simulados de medicamentos
  // const medicamentos = [ ...simulado... ]
const { medicamentos } = useMedicamentos();

  const filteredMedicamentos = medicamentos.filter(med =>
    med.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicamento = ({ item }) => (
    <View style={[
      styles.medicamentoCard,
      { backgroundColor: isDark ? '#1e1e1e' : '#fff' }
    ]}>
      <View style={styles.medicamentoHeader}>
        <Text style={[styles.medicamentoNome, { color: isDark ? '#ddd' : '#333' }]}>{item.nome}</Text>
        <Text style={[styles.medicamentoTipo, { color: isDark ? '#bbb' : '#666' }]}>{item.tipo}</Text>
      </View>

      <View style={styles.medicamentoDetails}>
        <Text style={[styles.detailText, { color: isDark ? '#bbb' : '#555' }]}>📦 Estoque: {item.estoque} unidades</Text>
        <Text style={[styles.detailText, { color: isDark ? '#bbb' : '#555' }]}>📅 Próxima dose: {item.proximaData}</Text>
        <Text style={[styles.detailText, { color: isDark ? '#bbb' : '#555' }]}>
          ⏰ Horários: {item.horarios.join(', ')}
        </Text>
      </View>

      <View style={styles.medicamentoActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditMedicamento', { medicamento: item })}
        >
          <Text style={styles.editButtonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => console.log('Excluir medicamento:', item.nome)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Medicamentos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMedicamento')}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5', color: isDark ? '#ddd' : '#000' }]}
          placeholder="Buscar medicamento..."
          placeholderTextColor={isDark ? '#888' : undefined}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredMedicamentos}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMedicamento}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  list: {
    padding: 15,
  },
  medicamentoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  medicamentoHeader: {
    marginBottom: 10,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicamentoTipo: {
    fontSize: 14,
    color: '#666',
  },
  medicamentoDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  medicamentoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MedicamentosScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';

const PacientesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const pacientes = [
    {
      id: 1,
      nome: 'Maria Silva',
      idade: 72,
      medicamentos: 4,
      ultimaConsulta: '2025-09-15',
      status: 'ativo',
    },
    {
      id: 2,
      nome: 'João Santos',
      idade: 68,
      medicamentos: 3,
      ultimaConsulta: '2025-09-10',
      status: 'ativo',
    },
    {
      id: 3,
      nome: 'Ana Costa',
      idade: 75,
      medicamentos: 5,
      ultimaConsulta: '2025-09-08',
      status: 'inativo',
    },
  ];

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPaciente = ({ item }) => (
    <TouchableOpacity
      style={styles.pacienteCard}
      onPress={() => console.log('Ver detalhes do paciente:', item.nome)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.nome.charAt(0)}</Text>
        </View>
        <View style={[
          styles.statusIndicator,
          item.status === 'ativo' ? styles.statusAtivo : styles.statusInativo
        ]} />
      </View>

      <View style={styles.pacienteInfo}>
        <Text style={styles.pacienteNome}>{item.nome}</Text>
        <Text style={styles.pacienteIdade}>{item.idade} anos</Text>
        <Text style={styles.medicamentosCount}>
          💊 {item.medicamentos} medicamentos
        </Text>
        <Text style={styles.ultimaConsulta}>
          📅 Última consulta: {item.ultimaConsulta}
        </Text>
      </View>

      <View style={styles.actionButton}>
        <Text style={styles.actionText}>👁️</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pacientes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Adicionar paciente')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pacientes.filter(p => p.status === 'ativo').length}</Text>
          <Text style={styles.statLabel}>Pacientes Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pacientes.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <FlatList
        data={filteredPacientes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPaciente}
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
    backgroundColor: '#2196F3',
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
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 15,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusAtivo: {
    backgroundColor: '#4CAF50',
  },
  statusInativo: {
    backgroundColor: '#F44336',
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  pacienteIdade: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  medicamentosCount: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  ultimaConsulta: {
    fontSize: 12,
    color: '#777',
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
  },
});

export default PacientesScreen;

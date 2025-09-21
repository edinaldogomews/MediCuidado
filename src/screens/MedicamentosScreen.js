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

const MedicamentosScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dados simulados de medicamentos
  const medicamentos = [
    {
      id: 1,
      nome: 'Losartana 50mg',
      tipo: 'Anti-hipertensivo',
      estoque: 30,
      proximaData: '2025-09-22',
      horarios: ['08:00', '20:00'],
    },
    {
      id: 2,
      nome: 'Metformina 850mg',
      tipo: 'Antidiabético',
      estoque: 45,
      proximaData: '2025-09-21',
      horarios: ['08:00', '12:00', '20:00'],
    },
    {
      id: 3,
      nome: 'Sinvastatina 20mg',
      tipo: 'Estatina',
      estoque: 20,
      proximaData: '2025-09-25',
      horarios: ['20:00'],
    },
    {
      id: 4,
      nome: 'Omeprazol 20mg',
      tipo: 'Protetor gástrico',
      estoque: 15,
      proximaData: '2025-09-23',
      horarios: ['08:00'],
    },
  ];

  const filteredMedicamentos = medicamentos.filter(med =>
    med.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicamento = ({ item }) => (
    <View style={styles.medicamentoCard}>
      <View style={styles.medicamentoHeader}>
        <Text style={styles.medicamentoNome}>{item.nome}</Text>
        <Text style={styles.medicamentoTipo}>{item.tipo}</Text>
      </View>

      <View style={styles.medicamentoDetails}>
        <Text style={styles.detailText}>📦 Estoque: {item.estoque} unidades</Text>
        <Text style={styles.detailText}>📅 Próxima dose: {item.proximaData}</Text>
        <Text style={styles.detailText}>
          ⏰ Horários: {item.horarios.join(', ')}
        </Text>
      </View>

      <View style={styles.medicamentoActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => console.log('Editar medicamento:', item.nome)}
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar medicamento..."
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

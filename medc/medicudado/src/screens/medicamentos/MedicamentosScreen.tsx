import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicamentosScreen = () => {
  const medicamentos = [
    { id: '1', nome: 'Exemplo de Medicamento', horario: '08:00', dosagem: '1 comprimido' }
  ];

  const renderItem = ({ item }) => (
    <View style={styles.medicamentoCard}>
      <Text style={styles.medicamentoNome}>{item.nome}</Text>
      <Text style={styles.medicamentoInfo}>Horário: {item.horario}</Text>
      <Text style={styles.medicamentoInfo}>Dosagem: {item.dosagem}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Medicamentos</Text>
      </View>

      <FlatList
        data={medicamentos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.lista}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum medicamento cadastrado</Text>
        }
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Adicionar Medicamento</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  lista: {
    flex: 1,
    padding: 16,
  },
  medicamentoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  medicamentoInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default MedicamentosScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';

const EstoqueScreen = ({ navigation }) => {
  const estoque = [
    {
      id: 1,
      medicamento: 'Losartana 50mg',
      quantidade: 30,
      minimo: 10,
      vencimento: '2025-12-15',
      status: 'normal',
    },
    {
      id: 2,
      medicamento: 'Metformina 850mg',
      quantidade: 5,
      minimo: 15,
      vencimento: '2025-11-20',
      status: 'baixo',
    },
    {
      id: 3,
      medicamento: 'Sinvastatina 20mg',
      quantidade: 20,
      minimo: 10,
      vencimento: '2025-10-05',
      status: 'vencendo',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'baixo': return '#F44336';
      case 'vencendo': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'baixo': return 'Estoque Baixo';
      case 'vencendo': return 'Vencendo';
      default: return 'Normal';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.medicamentoNome}>{item.medicamento}</Text>
        <Text style={styles.quantidade}>📦 {item.quantidade} unidades</Text>
        <Text style={styles.vencimento}>📅 Vence em: {item.vencimento}</Text>
        <Text style={styles.minimo}>⚠️ Mínimo: {item.minimo} unidades</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
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
        <Text style={styles.title}>Controle de Estoque</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Adicionar ao estoque')}
        >
          <Text style={styles.addButtonText}>+ Entrada</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alertsContainer}>
        <View style={styles.alertCard}>
          <Text style={styles.alertNumber}>{estoque.filter(item => item.status === 'baixo').length}</Text>
          <Text style={styles.alertLabel}>Estoque Baixo</Text>
        </View>
        <View style={styles.alertCard}>
          <Text style={styles.alertNumber}>{estoque.filter(item => item.status === 'vencendo').length}</Text>
          <Text style={styles.alertLabel}>Vencendo</Text>
        </View>
      </View>

      <FlatList
        data={estoque}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
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
    backgroundColor: '#9C27B0',
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
  alertsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 15,
  },
  alertCard: {
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
  alertNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 5,
  },
  alertLabel: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 15,
  },
  itemCard: {
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
  itemInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  quantidade: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  vencimento: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  minimo: {
    fontSize: 14,
    color: '#777',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default EstoqueScreen;

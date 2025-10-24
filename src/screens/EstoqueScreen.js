import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useThemePreference } from '../contexts/ThemeContext';
import { StorageService } from '../services/StorageService';

const EstoqueScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
  const [estoque, setEstoque] = useState([
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
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [quantidadeEntrada, setQuantidadeEntrada] = useState('');

  // Carregar dados do storage ao iniciar
  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    try {
      const estoqueArmazenado = await StorageService.getEstoque();
      if (estoqueArmazenado && estoqueArmazenado.length > 0) {
        setEstoque(estoqueArmazenado);
      }
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    }
  };
  const handleBack = () => {
    if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const state = typeof navigation.getState === 'function' ? navigation.getState() : undefined;
    const routeNames = state && Array.isArray(state.routeNames) ? state.routeNames : [];
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

  const atualizarStatusEstoque = (medicamento) => {
    const { quantidade, minimo } = medicamento;
    if (quantidade <= minimo) {
      return 'baixo';
    }
    return 'normal';
  };

  const handleAdicionarEntrada = async () => {
    if (!selectedMedicamento) {
      Alert.alert('Erro', 'Selecione um medicamento');
      return;
    }
    if (!quantidadeEntrada || isNaN(quantidadeEntrada) || parseInt(quantidadeEntrada) <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida');
      return;
    }

    try {
      const novaQuantidade = selectedMedicamento.quantidade + parseInt(quantidadeEntrada);
      const novoStatus = atualizarStatusEstoque({
        ...selectedMedicamento,
        quantidade: novaQuantidade,
      });

      const estoqueAtualizado = estoque.map(item =>
        item.id === selectedMedicamento.id
          ? { ...item, quantidade: novaQuantidade, status: novoStatus }
          : item
      );

      // Persistir no storage
      await StorageService.updateEstoque(estoqueAtualizado);

      setEstoque(estoqueAtualizado);
      Alert.alert('Sucesso', `${quantidadeEntrada} unidades adicionadas a ${selectedMedicamento.medicamento}`);
      setModalVisible(false);
      setSelectedMedicamento(null);
      setQuantidadeEntrada('');
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a entrada. Tente novamente.');
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Controle de Estoque</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Entrada</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alertsContainer}>
        <View style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.alertNumber}>{estoque.filter(item => item.status === 'baixo').length}</Text>
          <Text style={[styles.alertLabel, { color: isDark ? '#bbb' : '#666' }]}>Estoque Baixo</Text>
        </View>
        <View style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.alertNumber}>{estoque.filter(item => item.status === 'vencendo').length}</Text>
          <Text style={[styles.alertLabel, { color: isDark ? '#bbb' : '#666' }]}>Vencendo</Text>
        </View>
      </View>

      <FlatList
        data={estoque}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>Adicionar Entrada</Text>

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333' }]}>Selecione o medicamento:</Text>
            <View style={styles.medicamentoList}>
              {estoque.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.medicamentoOption,
                    selectedMedicamento?.id === item.id && styles.medicamentoOptionSelected,
                    { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }
                  ]}
                  onPress={() => setSelectedMedicamento(item)}
                >
                  <Text style={[styles.medicamentoOptionText, { color: isDark ? '#fff' : '#333' }]}>
                    {item.medicamento}
                  </Text>
                  <Text style={[styles.medicamentoOptionSubtext, { color: isDark ? '#aaa' : '#666' }]}>
                    Atual: {item.quantidade} un.
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333' }]}>Quantidade a adicionar:</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#fff' : '#333', borderColor: isDark ? '#444' : '#ddd' }]}
              placeholder="Digite a quantidade"
              placeholderTextColor={isDark ? '#666' : '#999'}
              keyboardType="numeric"
              value={quantidadeEntrada}
              onChangeText={setQuantidadeEntrada}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedMedicamento(null);
                  setQuantidadeEntrada('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleAdicionarEntrada}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  medicamentoList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  medicamentoOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  medicamentoOptionSelected: {
    borderColor: '#9C27B0',
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
  },
  medicamentoOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  medicamentoOptionSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EstoqueScreen;

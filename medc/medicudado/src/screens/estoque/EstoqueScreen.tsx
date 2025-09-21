import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/StorageService';
import { Medicamento } from '../../types';

const EstoqueScreen = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novaQuantidade, setNovaQuantidade] = useState('');

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const carregarMedicamentos = async () => {
    const data = await StorageService.getMedicamentos();
    setMedicamentos(data);
  };

  const atualizarEstoque = async (medicamento: Medicamento) => {
    try {
      const quantidade = Number(novaQuantidade);
      if (isNaN(quantidade) || quantidade < 0) {
        Alert.alert('Erro', 'Por favor, insira uma quantidade válida');
        return;
      }

      const medicamentosAtualizados = medicamentos.map(m => {
        if (m.id === medicamento.id) {
          return {
            ...m,
            estoque: {
              ...m.estoque,
              quantidade
            }
          };
        }
        return m;
      });

      await StorageService.atualizarMedicamentos(medicamentosAtualizados);
      setMedicamentos(medicamentosAtualizados);
      setEditandoId(null);
      setNovaQuantidade('');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar o estoque');
    }
  };

  const verificarEstoqueBaixo = (medicamento: Medicamento) => {
    const { quantidade, alertaQuandoAbaixoDe } = medicamento.estoque;
    return alertaQuandoAbaixoDe !== undefined && quantidade <= alertaQuandoAbaixoDe;
  };

  const renderItem = ({ item }: { item: Medicamento }) => (
    <View style={[
      styles.estoqueCard,
      verificarEstoqueBaixo(item) && styles.estoqueBaixo
    ]}>
      <View style={styles.medicamentoInfo}>
        <Text style={styles.medicamentoNome}>{item.nome}</Text>
        <Text style={styles.dosagem}>{item.dosagem}</Text>
        <View style={styles.estoqueInfo}>
          <Text style={styles.estoqueTexto}>
            Estoque: {item.estoque.quantidade} {item.estoque.unidade}
          </Text>
          {verificarEstoqueBaixo(item) && (
            <Text style={styles.alertaEstoque}>Estoque Baixo!</Text>
          )}
        </View>
      </View>

      {editandoId === item.id ? (
        <View style={styles.editarContainer}>
          <TextInput
            style={styles.input}
            value={novaQuantidade}
            onChangeText={setNovaQuantidade}
            keyboardType="numeric"
            placeholder="Nova quantidade"
          />
          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={() => atualizarEstoque(item)}
          >
            <Text style={styles.botaoTexto}>Salvar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.botaoAtualizar}
          onPress={() => {
            setEditandoId(item.id);
            setNovaQuantidade(item.estoque.quantidade.toString());
          }}
        >
          <Text style={styles.botaoTexto}>Atualizar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estoque de Medicamentos</Text>
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
  estoqueCard: {
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
  estoqueBaixo: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  medicamentoInfo: {
    flex: 1,
    marginBottom: 10,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dosagem: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  estoqueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  estoqueTexto: {
    fontSize: 16,
    color: '#333',
  },
  alertaEstoque: {
    marginLeft: 10,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  editarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  botaoAtualizar: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default EstoqueScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/StorageService';
import { Medicamento } from '../../types';
import { medicamentosPopulares } from '../../data/medicamentosPopulares';

const AddMedicamentoScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('');
  const [alertaEstoque, setAlertaEstoque] = useState('');
  const [sugestoes, setSugestoes] = useState<typeof medicamentosPopulares>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const filtrarMedicamentos = (texto: string) => {
    setNome(texto);
    if (texto.length > 2) {
      const filtrados = medicamentosPopulares.filter(med =>
        med.nome.toLowerCase().includes(texto.toLowerCase())
      );
      setSugestoes(filtrados);
      setMostrarSugestoes(true);
    } else {
      setSugestoes([]);
      setMostrarSugestoes(false);
    }
  };

  const selecionarMedicamento = (medicamento: typeof medicamentosPopulares[0]) => {
    setNome(medicamento.nome);
    if (medicamento.formas.length > 0) {
      setDosagem(medicamento.formas[0]);
    }
    setMostrarSugestoes(false);
  };

  const handleSalvar = async () => {
    if (!nome || !dosagem || !horario || !quantidade || !unidade) {
      Alert.alert('Erro', 'Por favor preencha todos os campos obrigatórios');
      return;
    }

    const novoMedicamento: Medicamento = {
      id: Date.now().toString(),
      nome,
      dosagem,
      horarios: [horario],
      instrucoes,
      duracao: {
        inicio: new Date().toISOString(),
      },
      frequencia: {
        tipo: 'diaria',
      },
      estoque: {
        quantidade: Number(quantidade),
        unidade,
        alertaQuandoAbaixoDe: alertaEstoque ? Number(alertaEstoque) : undefined,
      }
    };

    try {
      await StorageService.saveMedicamento(novoMedicamento);
      Alert.alert('Sucesso', 'Medicamento cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar medicamento');
    }
  };

  const renderSugestao = ({ item }) => (
    <TouchableOpacity
      style={styles.sugestaoItem}
      onPress={() => selecionarMedicamento(item)}
    >
      <Text style={styles.sugestaoNome}>{item.nome}</Text>
      <Text style={styles.sugestaoFormas}>{item.formas.join(', ')}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Novo Medicamento</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Medicamento *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={filtrarMedicamentos}
            placeholder="Digite ou selecione o medicamento"
          />
          {mostrarSugestoes && sugestoes.length > 0 && (
            <View style={styles.sugestoesContainer}>
              <FlatList
                data={sugestoes}
                renderItem={renderSugestao}
                keyExtractor={item => item.nome}
                nestedScrollEnabled
                style={styles.sugestoesList}
              />
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosagem *</Text>
          <TextInput
            style={styles.input}
            value={dosagem}
            onChangeText={setDosagem}
            placeholder="Ex: 1 comprimido"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Horário *</Text>
          <TextInput
            style={styles.input}
            value={horario}
            onChangeText={setHorario}
            placeholder="Ex: 08:00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantidade em Estoque *</Text>
          <TextInput
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            placeholder="Ex: 30"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Unidade *</Text>
          <TextInput
            style={styles.input}
            value={unidade}
            onChangeText={setUnidade}
            placeholder="Ex: comprimidos"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alerta quando estoque abaixo de</Text>
          <TextInput
            style={styles.input}
            value={alertaEstoque}
            onChangeText={setAlertaEstoque}
            placeholder="Ex: 5"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instruções</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={instrucoes}
            onChangeText={setInstrucoes}
            placeholder="Ex: Tomar após as refeições"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Medicamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sugestoesContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    zIndex: 1000,
    maxHeight: 200,
  },
  sugestoesList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  sugestaoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sugestaoNome: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  sugestaoFormas: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default AddMedicamentoScreen;

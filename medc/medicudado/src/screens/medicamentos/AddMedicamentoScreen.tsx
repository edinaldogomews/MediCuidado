import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/StorageService';
import { Medicamento } from '../../types';

const AddMedicamentoScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [instrucoes, setInstrucoes] = useState('');

  const handleSalvar = async () => {
    if (!nome || !dosagem || !horario) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Novo Medicamento</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Medicamento *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome do medicamento"
          />
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
});

export default AddMedicamentoScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

const AddMedicamentoScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: '',
    dosagem: '',
    tipo: '',
    estoque: '',
    horarios: [''],
    observacoes: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHorario = () => {
    setFormData(prev => ({
      ...prev,
      horarios: [...prev.horarios, '']
    }));
  };

  const updateHorario = (index, value) => {
    const newHorarios = [...formData.horarios];
    newHorarios[index] = value;
    setFormData(prev => ({
      ...prev,
      horarios: newHorarios
    }));
  };

  const removeHorario = (index) => {
    if (formData.horarios.length > 1) {
      const newHorarios = formData.horarios.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        horarios: newHorarios
      }));
    }
  };

  const salvarMedicamento = () => {
    if (!formData.nome.trim() || !formData.dosagem.trim()) {
      Alert.alert('Erro', 'Nome e dosagem são obrigatórios!');
      return;
    }

    // Aqui você salvaria o medicamento no banco de dados
    console.log('Salvando medicamento:', formData);

    Alert.alert(
      'Sucesso',
      'Medicamento adicionado com sucesso!',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Novo Medicamento</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarMedicamento}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Medicamento *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Losartana"
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosagem *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50mg"
              value={formData.dosagem}
              onChangeText={(value) => updateField('dosagem', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo/Categoria</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Anti-hipertensivo"
              value={formData.tipo}
              onChangeText={(value) => updateField('tipo', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantidade em Estoque</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 30"
              value={formData.estoque}
              onChangeText={(value) => updateField('estoque', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários de Administração</Text>

          {formData.horarios.map((horario, index) => (
            <View key={index} style={styles.horarioRow}>
              <TextInput
                style={[styles.input, styles.horarioInput]}
                placeholder="Ex: 08:00"
                value={horario}
                onChangeText={(value) => updateHorario(index, value)}
              />
              {formData.horarios.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeHorario(index)}
                >
                  <Text style={styles.removeButtonText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addHorarioButton} onPress={addHorario}>
            <Text style={styles.addHorarioText}>+ Adicionar Horário</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observações especiais sobre o medicamento..."
            value={formData.observacoes}
            onChangeText={(value) => updateField('observacoes', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
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
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  horarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  horarioInput: {
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    width: 40,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addHorarioButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addHorarioText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddMedicamentoScreen;

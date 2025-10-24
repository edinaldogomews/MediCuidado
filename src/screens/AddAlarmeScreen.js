import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useThemePreference } from '../contexts/ThemeContext';
import { StorageService } from '../services/StorageService';

const AddAlarmeScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
  const [medicamentos, setMedicamentos] = useState([]);
  const [showMedicamentoDropdown, setShowMedicamentoDropdown] = useState(false);
  const [formData, setFormData] = useState({
    medicamentoId: '',
    horario: '',
    dias: {
      segunda: false,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false,
    },
  });

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

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const carregarMedicamentos = async () => {
    try {
      const medicamentosData = await StorageService.getMedicamentos();
      setMedicamentos(medicamentosData || []);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      setMedicamentos([]); // Ensure medicamentos is always an array
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias: {
        ...prev.dias,
        [dia]: !prev.dias[dia]
      }
    }));
  };

  const getSelectedMedicamentoName = () => {
    const medicamento = medicamentos.find(m => m.id === formData.medicamentoId);
    return medicamento ? medicamento.nome : 'Selecione um medicamento';
  };

  const selectMedicamento = (medicamentoId) => {
    updateField('medicamentoId', medicamentoId);
    setShowMedicamentoDropdown(false);
  };

  const salvarAlarme = async () => {
    // Validation
    if (!medicamentos || medicamentos.length === 0) {
      Alert.alert('Erro', 'Nenhum medicamento cadastrado. Cadastre um medicamento primeiro.');
      return;
    }

    if (!formData.medicamentoId) {
      Alert.alert('Erro', 'Por favor selecione um medicamento');
      return;
    }

    if (!formData.horario) {
      Alert.alert('Erro', 'Por favor informe o horário');
      return;
    }

    // Check if at least one day is selected
    const diasSelecionados = Object.values(formData.dias).some(dia => dia);
    if (!diasSelecionados) {
      Alert.alert('Erro', 'Por favor selecione pelo menos um dia da semana');
      return;
    }

    try {
      const novoAlarme = {
        id: Date.now().toString(),
        medicamentoId: formData.medicamentoId,
        horario: formData.horario,
        status: 'pendente',
        dias: formData.dias,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };

      await StorageService.saveAlarme(novoAlarme);
      Alert.alert('Sucesso', 'Alarme criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao salvar alarme:', error);
      Alert.alert('Erro', 'Erro ao salvar alarme');
    }
  };

  const diasSemana = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Novo Alarme</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.formCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
            Informações do Alarme
          </Text>

          {/* Medicamento Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#666' }]}>
              Medicamento *
            </Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                { 
                  backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8',
                  borderColor: isDark ? '#444' : '#ddd'
                }
              ]}
              onPress={() => setShowMedicamentoDropdown(true)}
            >
              <Text style={[
                styles.dropdownButtonText,
                { color: formData.medicamentoId ? (isDark ? '#fff' : '#333') : (isDark ? '#888' : '#999') }
              ]}>
                {getSelectedMedicamentoName()}
              </Text>
              <Text style={[styles.dropdownArrow, { color: isDark ? '#888' : '#999' }]}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Horário */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#666' }]}>
              Horário *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8',
                  color: isDark ? '#fff' : '#333',
                  borderColor: isDark ? '#444' : '#ddd'
                }
              ]}
              placeholder="Ex: 08:00"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={formData.horario}
              onChangeText={(value) => updateField('horario', value)}
            />
          </View>

          {/* Dias da Semana */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#666' }]}>
              Dias da Semana *
            </Text>
            <View style={styles.diasContainer}>
              {diasSemana.map((dia) => (
                <TouchableOpacity
                  key={dia.key}
                  style={[
                    styles.diaButton,
                    {
                      backgroundColor: formData.dias[dia.key] 
                        ? '#FF9800' 
                        : (isDark ? '#2a2a2a' : '#f8f8f8'),
                      borderColor: isDark ? '#444' : '#ddd'
                    }
                  ]}
                  onPress={() => toggleDia(dia.key)}
                >
                  <Text
                    style={[
                      styles.diaButtonText,
                      {
                        color: formData.dias[dia.key] 
                          ? '#fff' 
                          : (isDark ? '#fff' : '#333')
                      }
                    ]}
                  >
                    {dia.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={salvarAlarme}
          >
            <Text style={styles.saveButtonText}>Salvar Alarme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Medicamento Selection Modal */}
      <Modal
        visible={showMedicamentoDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMedicamentoDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>
              Selecionar Medicamento
            </Text>
            
            {medicamentos && medicamentos.length > 0 ? (
              <ScrollView style={styles.modalScrollView}>
                {medicamentos.map((medicamento) => (
                  <TouchableOpacity
                    key={medicamento?.id || Math.random()}
                    style={[
                      styles.modalItem,
                      { 
                        backgroundColor: formData.medicamentoId === medicamento?.id 
                          ? '#FF9800' 
                          : (isDark ? '#2a2a2a' : '#f8f8f8')
                      }
                    ]}
                    onPress={() => selectMedicamento(medicamento?.id)}
                  >
                    <Text style={[
                      styles.modalItemText,
                      { 
                        color: formData.medicamentoId === medicamento?.id 
                          ? '#fff' 
                          : (isDark ? '#fff' : '#333')
                      }
                    ]}>
                      {medicamento?.nome || 'Medicamento sem nome'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={[styles.modalEmptyText, { color: isDark ? '#888' : '#666' }]}>
                Nenhum medicamento cadastrado
              </Text>
            )}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowMedicamentoDropdown(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
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
    backgroundColor: '#FF9800',
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
  placeholder: {
    width: 60, // Same width as back button to center title
  },
  content: {
    flex: 1,
    padding: 15,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  dropdownButtonText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 10,
  },
  diasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  diaButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  diaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalEmptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  modalCloseButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddAlarmeScreen;

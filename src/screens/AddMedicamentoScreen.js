import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const AddMedicamentoScreen = ({ navigation }) => {
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
  const [isSaving, setIsSaving] = useState(false);

  console.log('🎯 AddMedicamentoScreen renderizado - versão com intervalo de horas');
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
  const [formData, setFormData] = useState({
    nome: '',
    dosagem: '',
    tipo: '',
    quantidade: '', // Quantidade atual
    estoqueMinimo: '10', // Valor padrão
    horarios: [],
    observacoes: '', // Campo de observações
  });

  // Estado para intervalo de horas
  const [intervaloHoras, setIntervaloHoras] = useState(''); // 4, 6, 8, 12, 24

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para calcular horários automaticamente baseado no intervalo
  const calcularHorariosPorIntervalo = (intervalo) => {
    if (!intervalo) {
      return [];
    }

    const horarios = [];
    const intervaloNum = parseInt(intervalo);
    const quantidadeHorarios = 24 / intervaloNum;

    // Começa sempre às 00:00
    for (let i = 0; i < quantidadeHorarios; i++) {
      const hora = (intervaloNum * i) % 24;
      const horarioFormatado = `${String(hora).padStart(2, '0')}:00`;
      horarios.push(horarioFormatado);
    }

    return horarios;
  };

  const salvarMedicamento = async () => {
    if (!formData.nome.trim() || !formData.dosagem.trim()) {
      Alert.alert('Erro', 'Nome e dosagem são obrigatórios!');
      return;
    }

    if (isSaving) return; // Evita múltiplos cliques

    try {
      setIsSaving(true);

      // Verifica se o medicamento já existe
      const jaExiste = await databaseService.medicamentoExiste(
        formData.nome.trim(),
        formData.dosagem.trim()
      );

      if (jaExiste) {
        Alert.alert(
          'Medicamento Duplicado',
          `O medicamento "${formData.nome.trim()} ${formData.dosagem.trim()}" já está cadastrado!\n\nPor favor, edite o medicamento existente ou use um nome/dosagem diferente.`,
          [{ text: 'OK' }]
        );
        setIsSaving(false);
        return;
      }

      // 1. Salva o medicamento no banco
      console.log('💊 Salvando medicamento:', formData);

      const medicamentoId = await databaseService.addMedicamento({
        nome: (formData.nome || '').trim(),
        descricao: (formData.observacoes || '').trim(),
        dosagem: (formData.dosagem || '').trim(),
        fabricante: '',
        preco: 0,
        categoria: (formData.tipo || '').trim() || 'Medicamento',
      });

      console.log('✅ Medicamento salvo com ID:', medicamentoId);

      // 2. Adiciona o estoque inicial
      const quantidadeNum = parseInt(formData.quantidade) || 0;
      const minimoNum = parseInt(formData.estoqueMinimo) || 10;

      console.log('📦 Adicionando estoque - Quantidade:', quantidadeNum, 'Mínimo:', minimoNum);

      await databaseService.addEstoque({
        medicamento_id: medicamentoId,
        quantidade: quantidadeNum,
        minimo: minimoNum,
        maximo: 0, // Não usamos mais estoque máximo
        vencimento: '',
        status: 'normal',
        lote: '',
        data_entrada: new Date().toISOString().split('T')[0],
      });

      console.log('✅ Estoque adicionado');

      // 3. Adiciona os alarmes/horários se informados
      const horariosValidos = (formData.horarios || []).filter(h => h && h.trim() !== '');
      if (horariosValidos.length > 0) {
        for (const horario of horariosValidos) {
          const alarmeData = {
            medicamento_id: medicamentoId,
            horario: horario.trim(),
            dias_semana: {
              segunda: true,
              terca: true,
              quarta: true,
              quinta: true,
              sexta: true,
              sabado: true,
              domingo: true
            },
            ativo: 1,
            observacoes: (formData.observacoes || '').trim(),
          };

          console.log('📝 Adicionando alarme:', alarmeData);
          await databaseService.addAlarme(alarmeData);
        }
      }

      Alert.alert(
        'Sucesso',
        'Medicamento adicionado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Volta para a tela de medicamentos
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar o medicamento. Tente novamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Novo Medicamento</Text>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={salvarMedicamento}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>Informações Básicas</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Nome do Medicamento *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2a2a2a' : '#fff', color: isDark ? '#ddd' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
              placeholder="Ex: Losartana"
              placeholderTextColor={isDark ? '#888' : undefined}
              value={formData.nome}
              onChangeText={(value) => updateField('nome', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Dosagem *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2a2a2a' : '#fff', color: isDark ? '#ddd' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
              placeholder="Ex: 50mg"
              placeholderTextColor={isDark ? '#888' : undefined}
              value={formData.dosagem}
              onChangeText={(value) => updateField('dosagem', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Tipo/Categoria</Text>
            <View style={styles.categoriaContainer}>
              {['Analgésico', 'Antibiótico', 'Anti-inflamatório', 'Cardiovascular', 'Diabetes', 'Vitamina', 'Outro'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaButton,
                    formData.tipo === cat && styles.categoriaButtonActive,
                    { backgroundColor: formData.tipo === cat ? '#2196F3' : (isDark ? '#2a2a2a' : '#f0f0f0') }
                  ]}
                  onPress={() => updateField('tipo', cat)}
                >
                  <Text style={[
                    styles.categoriaButtonText,
                    { color: formData.tipo === cat ? '#fff' : (isDark ? '#ddd' : '#333') }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Quantidade Atual</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2a2a2a' : '#fff', color: isDark ? '#ddd' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
              placeholder="Ex: 30"
              placeholderTextColor={isDark ? '#888' : undefined}
              value={formData.quantidade}
              onChangeText={(value) => updateField('quantidade', value)}
              keyboardType="numeric"
            />
            <Text style={[styles.helpText, { color: isDark ? '#888' : '#999' }]}>
              💡 Quantidade de comprimidos/doses disponíveis
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Estoque Mínimo (para alertas)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? '#2a2a2a' : '#fff', color: isDark ? '#ddd' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
              placeholder="Ex: 10"
              placeholderTextColor={isDark ? '#888' : undefined}
              value={formData.estoqueMinimo}
              onChangeText={(value) => updateField('estoqueMinimo', value)}
              keyboardType="numeric"
            />
            <Text style={[styles.helpText, { color: isDark ? '#888' : '#999' }]}>
              💡 Você receberá um alerta quando o estoque atingir este valor
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Observações (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#2a2a2a' : '#fff', color: isDark ? '#ddd' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
              placeholder="Ex: Tomar em jejum, evitar laticínios..."
              placeholderTextColor={isDark ? '#888' : undefined}
              value={formData.observacoes}
              onChangeText={(value) => updateField('observacoes', value)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>Horários de Administração</Text>

          <Text style={[styles.label, { color: isDark ? '#bbb' : '#555', marginBottom: 10 }]}>
            💡 Escolha o intervalo de uso do medicamento
          </Text>

          {/* Seleção de Intervalo */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>Intervalo de uso</Text>
            <View style={styles.intervaloContainer}>
              {['4', '6', '8', '12', '24'].map((intervalo) => (
                <TouchableOpacity
                  key={intervalo}
                  style={[
                    styles.intervaloButton,
                    intervaloHoras === intervalo && styles.intervaloButtonActive,
                    { backgroundColor: intervaloHoras === intervalo ? '#4CAF50' : (isDark ? '#2a2a2a' : '#f0f0f0') }
                  ]}
                  onPress={() => {
                    console.log('🕐 Intervalo selecionado:', intervalo);
                    setIntervaloHoras(intervalo);
                    const horarios = calcularHorariosPorIntervalo(intervalo);
                    console.log('⏰ Horários calculados:', horarios);
                    setFormData(prev => ({
                      ...prev,
                      horarios: horarios
                    }));
                  }}
                >
                  <Text style={[
                    styles.intervaloButtonText,
                    { color: intervaloHoras === intervalo ? '#fff' : (isDark ? '#ddd' : '#333') }
                  ]}>
                    {intervalo}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Horários Calculados */}
          {intervaloHoras && formData.horarios && formData.horarios.length > 0 && (
            <View style={styles.horariosCalculadosContainer}>
              <Text style={[styles.label, { color: isDark ? '#bbb' : '#555', marginBottom: 10 }]}>
                Horários programados ({formData.horarios.length}x ao dia):
              </Text>
              <View style={styles.horariosGrid}>
                {formData.horarios.map((horario, index) => (
                  <View key={index} style={[styles.horarioChip, { backgroundColor: isDark ? '#2a2a2a' : '#e8f5e9' }]}>
                    <Text style={[styles.horarioChipText, { color: isDark ? '#4CAF50' : '#2e7d32' }]}>
                      ⏰ {horario}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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
  helpText: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  // Estilos para categoria
  categoriaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoriaButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  categoriaButtonActive: {
    backgroundColor: '#2196F3',
  },
  categoriaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // Estilos para intervalo
  intervaloContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intervaloButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  intervaloButtonActive: {
    backgroundColor: '#4CAF50',
  },
  intervaloButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  horariosCalculadosContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horarioChip: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  horarioChipText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddMedicamentoScreen;

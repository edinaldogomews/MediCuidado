import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const EditMedicamentoScreen = ({ route, navigation }) => {
  const { medicamento } = route.params;
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dados do medicamento
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [categoria, setCategoria] = useState('');

  // Dados do estoque
  const [quantidade, setQuantidade] = useState('');
  const [minimo, setMinimo] = useState('');

  // Intervalo de horas
  const [intervaloHoras, setIntervaloHoras] = useState('');
  const [alarmes, setAlarmes] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // Carrega dados básicos do medicamento
      const medicamentoData = await databaseService.getMedicamentoById(medicamento.id);

      if (medicamentoData) {
        setNome(medicamentoData.nome || '');
        setDosagem(medicamentoData.dosagem || '');
        setCategoria(medicamentoData.categoria || '');
      }

      // Carrega dados do estoque separadamente
      const estoqueData = await databaseService.getEstoqueByMedicamentoId(medicamento.id);

      if (estoqueData) {
        setQuantidade(String(estoqueData.quantidade || 0));
        setMinimo(String(estoqueData.minimo || 10));
      } else {
        // Se não tem estoque, usa valores padrão
        setQuantidade('0');
        setMinimo('10');
      }

      // Carrega alarmes para detectar intervalo
      const alarmesData = await databaseService.getAlarmesByMedicamentoId(medicamento.id);
      setAlarmes(alarmesData || []);

      // Detecta intervalo baseado nos horários dos alarmes
      if (alarmesData && alarmesData.length > 0) {
        detectarIntervalo(alarmesData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para detectar o intervalo baseado nos alarmes existentes
  const detectarIntervalo = (alarmesData) => {
    if (alarmesData.length >= 2) {
      // Pega os dois primeiros horários e calcula a diferença
      const horario1 = alarmesData[0].horario.split(':');
      const horario2 = alarmesData[1].horario.split(':');

      const hora1 = parseInt(horario1[0]);
      const hora2 = parseInt(horario2[0]);

      const diferenca = Math.abs(hora2 - hora1);

      // Define o intervalo baseado na diferença
      if ([4, 6, 8, 12, 24].includes(diferenca)) {
        setIntervaloHoras(String(diferenca));
      }
    } else if (alarmesData.length === 1) {
      // Se tem apenas 1 alarme, assume 24h
      setIntervaloHoras('24');
    }
  };

  // Função para calcular horários baseado no intervalo
  const calcularHorariosPorIntervalo = (intervalo) => {
    if (!intervalo) {
      return [];
    }

    const horarios = [];
    const intervaloNum = parseInt(intervalo);
    const quantidadeHorarios = 24 / intervaloNum;

    for (let i = 0; i < quantidadeHorarios; i++) {
      const hora = (intervaloNum * i) % 24;
      const horarioFormatado = `${String(hora).padStart(2, '0')}:00`;
      horarios.push(horarioFormatado);
    }

    return horarios;
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !dosagem.trim()) {
      Alert.alert('Erro', 'Nome e dosagem são obrigatórios!');
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);

      // 1. Atualiza o medicamento
      await databaseService.updateMedicamento(medicamento.id, {
        nome: nome.trim(),
        dosagem: dosagem.trim(),
        categoria: categoria.trim() || 'Medicamento',
      });

      // 2. Atualiza o estoque
      const quantidadeNum = parseInt(quantidade) || 0;
      const minimoNum = parseInt(minimo) || 10;

      await databaseService.updateEstoqueByMedicamentoId(medicamento.id, {
        quantidade: quantidadeNum,
        minimo: minimoNum,
        maximo: 0, // Não usamos mais estoque máximo
      });

      // 3. Atualiza alarmes se o intervalo foi alterado
      if (intervaloHoras) {
        console.log('🔄 Atualizando alarmes com intervalo:', intervaloHoras);

        // Remove alarmes antigos
        for (const alarme of alarmes) {
          await databaseService.deleteAlarme(alarme.id);
        }

        // Cria novos alarmes baseados no intervalo
        const novosHorarios = calcularHorariosPorIntervalo(intervaloHoras);
        for (const horario of novosHorarios) {
          await databaseService.addAlarme({
            medicamento_id: medicamento.id,
            horario: horario,
            dias_semana: { todos: true },
            ativo: 1,
            observacoes: '',
          });
        }

        console.log('✅ Alarmes atualizados:', novosHorarios);
      }

      Alert.alert(
        'Sucesso',
        'Medicamento atualizado com sucesso!',
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
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={[styles.loadingText, { color: isDark ? '#ddd' : '#666' }]}>
            Carregando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Medicamento</Text>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSalvar}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Informações Básicas */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>
            Informações Básicas
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>
              Nome do Medicamento *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  color: isDark ? '#ddd' : '#000',
                  borderColor: isDark ? '#444' : '#ddd',
                }
              ]}
              placeholder="Ex: Losartana"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>
              Dosagem *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  color: isDark ? '#ddd' : '#000',
                  borderColor: isDark ? '#444' : '#ddd',
                }
              ]}
              placeholder="Ex: 50mg"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={dosagem}
              onChangeText={setDosagem}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>
              Categoria
            </Text>
            <View style={styles.categoriaContainer}>
              {['Analgésico', 'Antibiótico', 'Anti-inflamatório', 'Cardiovascular', 'Diabetes', 'Vitamina', 'Outro'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaButton,
                    categoria === cat && styles.categoriaButtonActive,
                    { backgroundColor: categoria === cat ? '#2196F3' : (isDark ? '#2a2a2a' : '#f0f0f0') }
                  ]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[
                    styles.categoriaButtonText,
                    { color: categoria === cat ? '#fff' : (isDark ? '#ddd' : '#333') }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Estoque */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>
            Estoque
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>
              Quantidade Atual
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  color: isDark ? '#ddd' : '#000',
                  borderColor: isDark ? '#444' : '#ddd',
                }
              ]}
              placeholder="0"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>
              Estoque Mínimo (para alertas)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  color: isDark ? '#ddd' : '#000',
                  borderColor: isDark ? '#444' : '#ddd',
                }
              ]}
              placeholder="10"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={minimo}
              onChangeText={setMinimo}
              keyboardType="numeric"
            />
            <Text style={[styles.helpText, { color: isDark ? '#888' : '#999' }]}>
              💡 Você receberá um alerta quando o estoque atingir este valor
            </Text>
          </View>
        </View>

        {/* Horários de Administração */}
        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>
            Horários de Administração
          </Text>

          <Text style={[styles.label, { color: isDark ? '#bbb' : '#555', marginBottom: 10 }]}>
            💡 Escolha o intervalo de uso do medicamento
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#bbb' : '#555' }]}>
              Intervalo de uso
            </Text>
            <View style={styles.intervaloContainer}>
              {['4', '6', '8', '12', '24'].map((intervalo) => (
                <TouchableOpacity
                  key={intervalo}
                  style={[
                    styles.intervaloButton,
                    intervaloHoras === intervalo && styles.intervaloButtonActive,
                    {
                      backgroundColor: intervaloHoras === intervalo
                        ? '#4CAF50'
                        : isDark
                        ? '#2a2a2a'
                        : '#f0f0f0',
                    },
                  ]}
                  onPress={() => {
                    console.log('🕐 Intervalo selecionado:', intervalo);
                    setIntervaloHoras(intervalo);
                  }}
                >
                  <Text
                    style={[
                      styles.intervaloButtonText,
                      {
                        color: intervaloHoras === intervalo
                          ? '#fff'
                          : isDark
                          ? '#ddd'
                          : '#333',
                      },
                    ]}
                  >
                    {intervalo}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Horários Calculados */}
          {intervaloHoras && (
            <View style={styles.horariosCalculadosContainer}>
              <Text style={[styles.label, { color: isDark ? '#bbb' : '#555', marginBottom: 10 }]}>
                Horários programados ({calcularHorariosPorIntervalo(intervaloHoras).length}x ao dia):
              </Text>
              <View style={styles.horariosGrid}>
                {calcularHorariosPorIntervalo(intervaloHoras).map((horario, index) => (
                  <View
                    key={index}
                    style={[
                      styles.horarioChip,
                      { backgroundColor: isDark ? '#2a2a2a' : '#e8f5e9' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.horarioChipText,
                        { color: isDark ? '#4CAF50' : '#2e7d32' },
                      ]}
                    >
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
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

export default EditMedicamentoScreen;
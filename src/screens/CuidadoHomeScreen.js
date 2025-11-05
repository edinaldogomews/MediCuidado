import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import databaseService from '../database/DatabaseService';

const CuidadoHomeScreen = ({ navigation }) => {
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
  const { logout } = useAuth();

  const [medicamentosHoje, setMedicamentosHoje] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alarmesTomados, setAlarmesTomados] = useState([]);

  // Carregar alarmes do banco de dados
  const carregarAlarmes = async () => {
    try {
      setIsLoading(true);
      const alarmes = await databaseService.getAllAlarmes();

      // Filtrar alarmes de hoje
      const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'short' });
      const diasMap = {
        'seg.': 'Seg',
        'ter.': 'Ter',
        'qua.': 'Qua',
        'qui.': 'Qui',
        'sex.': 'Sex',
        'sáb.': 'Sáb',
        'dom.': 'Dom'
      };
      const diaHoje = diasMap[hoje] || hoje;

      const alarmesHoje = [];

      for (const alarme of alarmes) {
        if (!alarme.ativo) continue;

        // Converte dias_semana para array (aceita objeto ou array)
        let diasArray = [];

        if (Array.isArray(alarme.dias_semana)) {
          // Já é array: ["Seg", "Ter", ...]
          diasArray = alarme.dias_semana;
        } else if (typeof alarme.dias_semana === 'object' && alarme.dias_semana !== null) {
          // É objeto: {segunda: true, terca: false, ...}
          // Converte para array
          const diasMap = {
            'segunda': 'Seg',
            'terca': 'Ter',
            'quarta': 'Qua',
            'quinta': 'Qui',
            'sexta': 'Sex',
            'sabado': 'Sáb',
            'domingo': 'Dom'
          };

          diasArray = Object.keys(alarme.dias_semana)
            .filter(dia => alarme.dias_semana[dia] === true)
            .map(dia => diasMap[dia])
            .filter(dia => dia !== undefined);
        }

        // Verifica se hoje está nos dias
        if (!diasArray.includes(diaHoje)) continue;

        // Buscar medicamento
        const medicamento = await databaseService.getMedicamentoById(alarme.medicamento_id);
        if (!medicamento) continue;

        alarmesHoje.push({
          id: alarme.id,
          nome: `${medicamento.nome} ${medicamento.dosagem}`,
          horario: alarme.horario,
          medicamento_id: alarme.medicamento_id,
        });
      }

      // Ordenar por horário
      alarmesHoje.sort((a, b) => a.horario.localeCompare(b.horario));

      setMedicamentosHoje(alarmesHoje);
    } catch (error) {
      console.error('Erro ao carregar alarmes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os medicamentos');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarAlarmes();
    }, [])
  );

  // Verificar se alarme foi tomado
  const foiTomado = (alarmeId) => {
    return alarmesTomados.includes(alarmeId);
  };

  // Marcar como tomado
  const marcarComoTomado = async (alarme) => {
    try {
      // Adicionar à lista de tomados
      setAlarmesTomados([...alarmesTomados, alarme.id]);

      // Registrar saída no estoque
      await databaseService.removerQuantidade(alarme.medicamento_id, 1);

      // Registrar movimentação
      await databaseService.addMovimentacao({
        medicamento_id: alarme.medicamento_id,
        tipo: 'saida',
        quantidade: 1,
        data: new Date().toISOString().split('T')[0],
        usuario: 'Idoso',
        motivo: 'Medicamento tomado'
      });

      Alert.alert('Sucesso', 'Medicamento marcado como tomado!');

      // Recarregar alarmes
      carregarAlarmes();
    } catch (error) {
      console.error('Erro ao marcar como tomado:', error);
      Alert.alert('Erro', 'Não foi possível marcar como tomado');
    }
  };

  // Próximo medicamento pendente
  const proximoMedicamento = medicamentosHoje.find(med => !foiTomado(med.id));

  // Ligar para emergência
  const ligarEmergencia = () => {
    Alert.alert(
      'Ligar para Emergência?',
      'Deseja ligar para 192 (SAMU)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => Linking.openURL('tel:192')
        }
      ]
    );
  };

  // Loading
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Medicamentos</Text>
          <Text style={styles.subtitle}>Interface Simplificada</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={[styles.loadingText, { color: isDark ? '#ddd' : '#666' }]}>
            Carregando medicamentos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Medicamentos</Text>
        <Text style={styles.subtitle}>Interface Simplificada</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Próximo Medicamento */}
        {proximoMedicamento && (
          <View style={styles.proximoCard}>
            <Text style={styles.proximoTitle}>🔔 Próximo Medicamento</Text>
            <Text style={styles.proximoMedicamento}>{proximoMedicamento.nome}</Text>
            <Text style={styles.proximoHorario}>Horário: {proximoMedicamento.horario}</Text>
            <TouchableOpacity
              style={styles.tomarButton}
              onPress={() => marcarComoTomado(proximoMedicamento)}
            >
              <Text style={styles.tomarText}>✓ Marcar como Tomado</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Medicamentos de Hoje */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>
          Medicamentos de Hoje
        </Text>

        {medicamentosHoje.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={[styles.emptyText, { color: isDark ? '#ddd' : '#666' }]}>
              Nenhum medicamento para hoje
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#bbb' : '#999' }]}>
              Configure alarmes na tela de Alarmes
            </Text>
          </View>
        ) : (
          medicamentosHoje.map((med) => {
            const tomado = foiTomado(med.id);
            return (
              <View
                key={med.id}
                style={[
                  styles.medicamentoCard,
                  { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
                  tomado && styles.medicamentoTomado
                ]}
              >
                <View style={styles.medicamentoInfo}>
                  <Text style={[
                    styles.medicamentoNome,
                    { color: isDark ? '#ddd' : '#333' },
                    tomado && styles.medicamentoNomeTomado
                  ]}>
                    {med.nome}
                  </Text>
                  <Text style={[styles.medicamentoHorario, { color: isDark ? '#bbb' : '#666' }]}>
                    📅 {med.horario}
                  </Text>
                </View>

                {tomado ? (
                  <View style={[styles.statusBadge, styles.statusTomado]}>
                    <Text style={styles.statusText}>✓ Tomado</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.statusBadge, styles.statusPendente]}
                    onPress={() => marcarComoTomado(med)}
                  >
                    <Text style={styles.statusText}>⏰ Tomar</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={ligarEmergencia}
          >
            <Text style={styles.emergencyText}>🚨 Ligar Emergência (192)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Text style={styles.helpText}>👤 Ver Meu Perfil</Text>
          </TouchableOpacity>
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
    color: '#666',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  logoutButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  proximoCard: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  proximoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  proximoMedicamento: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  proximoHorario: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  tomarButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  tomarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  medicamentoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  medicamentoTomado: {
    opacity: 0.6,
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicamentoNomeTomado: {
    textDecorationLine: 'line-through',
  },
  medicamentoHorario: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    padding: 8,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  statusTomado: {
    backgroundColor: '#4CAF50',
  },
  statusPendente: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    marginTop: 30,
    gap: 15,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#9C27B0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  helpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CuidadoHomeScreen;

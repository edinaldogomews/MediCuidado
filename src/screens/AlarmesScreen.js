import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const AlarmesScreen = ({ navigation }) => {
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
  const handleBack = () => {
    if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const state = typeof navigation.getState === 'function' ? navigation.getState() : undefined;
    const routeNames = state && Array.isArray(state.routeNames) ? state.routeNames : [];
    
    // If we're in AlarmesTab, go back to Main (which contains the tab navigator)
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
  const [alarmes, setAlarmes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos'); // Todos, Ativos, Inativos, Tomados
  const [alarmesTomados, setAlarmesTomados] = useState([]); // Lista de IDs de alarmes marcados como tomados hoje

  // Load alarms from database
  const carregarAlarmes = async () => {
    setIsLoading(true);
    try {
      const alarmesData = await databaseService.getAllAlarmes();

      // Formata os alarmes para exibição
      const alarmesFormatados = alarmesData.map(alarme => {
        // dias_semana já vem como array do DatabaseService: ["Seg", "Ter", ...]
        let diasAtivos = [];

        if (Array.isArray(alarme.dias_semana)) {
          // Já é array, usa direto
          diasAtivos = alarme.dias_semana;
        } else if (typeof alarme.dias_semana === 'object' && alarme.dias_semana !== null) {
          // Formato antigo (objeto), converte para array
          const diasMap = {
            segunda: 'Seg',
            terca: 'Ter',
            quarta: 'Qua',
            quinta: 'Qui',
            sexta: 'Sex',
            sabado: 'Sáb',
            domingo: 'Dom'
          };

          diasAtivos = Object.keys(alarme.dias_semana)
            .filter(dia => alarme.dias_semana[dia])
            .map(dia => diasMap[dia])
            .filter(dia => dia !== undefined);
        }

        return {
          id: alarme.id,
          medicamento: `${alarme.medicamento_nome} ${alarme.medicamento_dosagem}`,
          horario: alarme.horario,
          ativo: alarme.ativo === 1,
          dias: diasAtivos,
          observacoes: alarme.observacoes,
          medicamento_id: alarme.medicamento_id
        };
      });

      // Ordena por horário
      alarmesFormatados.sort((a, b) => {
        const [hA, mA] = a.horario.split(':').map(Number);
        const [hB, mB] = b.horario.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
      });

      setAlarmes(alarmesFormatados);
    } catch (error) {
      console.error('Erro ao carregar alarmes:', error);
      setAlarmes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarAlarmes();
  }, []);

  // Reload alarms when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      carregarAlarmes();
    }, [])
  );

  const toggleAlarme = async (id) => {
    try {
      await databaseService.toggleAlarme(id);
      await carregarAlarmes(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao atualizar alarme:', error);
    }
  };

  const handleExcluirAlarme = (alarme) => {
    Alert.alert(
      'Excluir Alarme',
      `Deseja realmente excluir o alarme de ${alarme.medicamento} às ${alarme.horario}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteAlarme(alarme.id);
              await carregarAlarmes();
            } catch (error) {
              console.error('Erro ao excluir alarme:', error);
              Alert.alert('Erro', 'Não foi possível excluir o alarme');
            }
          }
        }
      ]
    );
  };

  const marcarComoTomado = async (alarme) => {
    Alert.alert(
      'Marcar como Tomado',
      `Confirma que tomou ${alarme.medicamento}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              // Adiciona à lista de tomados
              setAlarmesTomados(prev => [...prev, alarme.id]);

              Alert.alert('✅ Sucesso', 'Medicamento marcado como tomado!');
            } catch (error) {
              console.error('Erro ao marcar como tomado:', error);
              Alert.alert('Erro', 'Não foi possível marcar como tomado');
            }
          }
        }
      ]
    );
  };

  // Verifica se alarme é de hoje
  const isHoje = (dias) => {
    const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const hoje = new Date().getDay();
    const diaHoje = diasSemana[hoje];

    // Verifica se o dia de hoje está nos dias ativos
    const diasMap = {
      'Seg': 'segunda',
      'Ter': 'terca',
      'Qua': 'quarta',
      'Qui': 'quinta',
      'Sex': 'sexta',
      'Sáb': 'sabado',
      'Dom': 'domingo'
    };

    return dias.some(dia => diasMap[dia] === diaHoje);
  };

  // Agrupa alarmes por medicamento
  const alarmesAgrupados = React.useMemo(() => {
    const grupos = {};

    alarmes.forEach(alarme => {
      const key = alarme.medicamento_id;
      if (!grupos[key]) {
        grupos[key] = {
          medicamento_id: alarme.medicamento_id,
          medicamento: alarme.medicamento,
          alarmes: []
        };
      }
      grupos[key].alarmes.push(alarme);
    });

    return Object.values(grupos);
  }, [alarmes]);

  // Filtra alarmes
  const filteredAlarmes = React.useMemo(() => {
    return alarmes.filter(alarme => {
      // Filtro por busca
      const matchBusca = alarme.medicamento.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por status
      let matchStatus = true;
      if (filtroStatus === 'Ativos') {
        matchStatus = alarme.ativo === true && !alarmesTomados.includes(alarme.id);
      } else if (filtroStatus === 'Inativos') {
        matchStatus = alarme.ativo === false;
      } else if (filtroStatus === 'Tomados') {
        matchStatus = alarmesTomados.includes(alarme.id);
      } else if (filtroStatus === 'Todos') {
        matchStatus = !alarmesTomados.includes(alarme.id); // Não mostra tomados em "Todos"
      }

      return matchBusca && matchStatus;
    });
  }, [alarmes, searchQuery, filtroStatus, alarmesTomados]);

  // Calcula estatísticas
  const stats = React.useMemo(() => {
    const ativos = alarmes.filter(a => a.ativo).length;
    const hoje = alarmes.filter(a => a.ativo && isHoje(a.dias)).length;

    // Próximo alarme
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();

    const alarmesHoje = alarmes
      .filter(a => a.ativo && isHoje(a.dias))
      .map(a => {
        const [h, m] = a.horario.split(':').map(Number);
        const minutos = h * 60 + m;
        return { ...a, minutos };
      })
      .filter(a => a.minutos > horaAtual)
      .sort((a, b) => a.minutos - b.minutos);

    const proximo = alarmesHoje.length > 0 ? alarmesHoje[0] : null;

    return { ativos, hoje, total: alarmes.length, proximo };
  }, [alarmes]);

  const renderAlarme = ({ item }) => {
    const eHoje = isHoje(item.dias);
    const foiTomado = alarmesTomados.includes(item.id);

    return (
    <View style={[
      styles.alarmeCard,
      { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
      !item.ativo && styles.alarmeCardInativo,
      eHoje && item.ativo && !foiTomado && styles.alarmeCardHoje,
      foiTomado && styles.alarmeCardTomado
    ]}>
      <View style={styles.alarmeInfo}>
        <View style={styles.medicamentoHeader}>
          <Text style={[
            styles.medicamentoNome,
            { color: isDark ? '#ddd' : '#333' },
            !item.ativo && styles.textoInativo,
            foiTomado && styles.textoTomado
          ]}>
            {item.medicamento}
          </Text>
          {foiTomado && (
            <View style={styles.badgeTomado}>
              <Text style={styles.badgeTomadoText}>✓ TOMADO</Text>
            </View>
          )}
          {eHoje && item.ativo && !foiTomado && (
            <View style={styles.badgeHoje}>
              <Text style={styles.badgeHojeText}>HOJE</Text>
            </View>
          )}
        </View>

        <Text style={[
          styles.horario,
          { color: isDark ? '#bbb' : '#666' },
          !item.ativo && styles.textoInativo
        ]}>
          ⏰ {item.horario}
        </Text>

        <View style={styles.diasContainer}>
          {item.dias.map((dia, index) => {
            // Mapeia dias completos para abreviações de 1 letra
            const diasAbrev = {
              'Seg': 'S', 'Ter': 'T', 'Qua': 'Q',
              'Qui': 'Q', 'Sex': 'S', 'Sáb': 'S', 'Dom': 'D'
            };
            const diasMap = {
              'Seg': 'segunda', 'Ter': 'terca', 'Qua': 'quarta',
              'Qui': 'quinta', 'Sex': 'sexta', 'Sáb': 'sabado', 'Dom': 'domingo'
            };
            const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
            const hoje = new Date().getDay();
            const isDiaHoje = diasMap[dia] === diasSemana[hoje];

            return (
              <Text
                key={index}
                style={[
                  styles.dia,
                  { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0', color: isDark ? '#bbb' : '#555' },
                  isDiaHoje && styles.diaHoje,
                  !item.ativo && styles.textoInativo
                ]}
              >
                {diasAbrev[dia] || dia}
              </Text>
            );
          })}
        </View>
      </View>

      <View style={styles.alarmeControls}>
        <Switch
          value={item.ativo}
          onValueChange={() => toggleAlarme(item.id)}
          trackColor={{ false: '#ccc', true: '#4CAF50' }}
          thumbColor={item.ativo ? '#fff' : '#f4f3f4'}
          disabled={foiTomado}
        />

        {eHoje && item.ativo && !foiTomado && (
          <TouchableOpacity
            style={styles.tomarButton}
            onPress={() => marcarComoTomado(item)}
          >
            <Text style={styles.tomarButtonText}>✅</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditAlarme', { alarmeId: item.id })}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirAlarme(item)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Alarmes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAlarme')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Próximo alarme */}
      {stats.proximo && (
        <View style={[styles.proximoAlarmeContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.proximoAlarmeLabel, { color: isDark ? '#888' : '#666' }]}>
            🔔 Próximo alarme
          </Text>
          <Text style={[styles.proximoAlarmeMed, { color: isDark ? '#ddd' : '#333' }]}>
            {stats.proximo.medicamento}
          </Text>
          <Text style={styles.proximoAlarmeHora}>
            {stats.proximo.horario}
          </Text>
        </View>
      )}

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.statNumber}>{stats.ativos}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Ativos</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.hoje}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Hoje</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Total</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5', color: isDark ? '#ddd' : '#000' }]}
          placeholder="Buscar medicamento..."
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro de status */}
      <View style={[styles.filtroContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroScroll}
        >
          {['Todos', 'Ativos', 'Tomados', 'Inativos'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filtroButton,
                { backgroundColor: filtroStatus === status ? '#FF9800' : (isDark ? '#2a2a2a' : '#f0f0f0') }
              ]}
              onPress={() => setFiltroStatus(status)}
            >
              <Text style={[
                styles.filtroButtonText,
                { color: filtroStatus === status ? '#fff' : (isDark ? '#ddd' : '#333') }
              ]}>
                {status}
                {status === 'Tomados' && alarmesTomados.length > 0 && ` (${alarmesTomados.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de alarmes */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={[styles.loadingText, { color: isDark ? '#888' : '#666' }]}>
            Carregando alarmes...
          </Text>
        </View>
      ) : filteredAlarmes.length === 0 ? (
        <View style={styles.emptyContainer}>
          {alarmes.length === 0 ? (
            <>
              <Text style={styles.emptyIcon}>⏰</Text>
              <Text style={[styles.emptyTitle, { color: isDark ? '#ddd' : '#333' }]}>
                Nenhum alarme cadastrado
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? '#888' : '#666' }]}>
                Clique em "+ Novo" para criar{'\n'}seu primeiro alarme
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: isDark ? '#ddd' : '#333' }]}>
                Nenhum alarme encontrado
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? '#888' : '#666' }]}>
                Tente buscar por outro nome ou{'\n'}altere o filtro
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAlarmes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderAlarme}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  proximoAlarmeContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  proximoAlarmeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  proximoAlarmeMed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  proximoAlarmeHora: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  filtroContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroScroll: {
    paddingHorizontal: 15,
  },
  filtroButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filtroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    padding: 15,
  },
  alarmeCard: {
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
  alarmeCardInativo: {
    opacity: 0.5,
  },
  alarmeCardHoje: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  alarmeCardTomado: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    opacity: 0.7,
  },
  alarmeInfo: {
    flex: 1,
  },
  medicamentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  medicamentoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badgeHoje: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeHojeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTomado: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeTomadoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textoInativo: {
    opacity: 0.6,
  },
  textoTomado: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  horario: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  diasContainer: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  dia: {
    fontSize: 11,
    color: '#555',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  diaHoje: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: 'bold',
  },
  alarmeControls: {
    alignItems: 'center',
    gap: 8,
  },
  tomarButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    width: 35,
    alignItems: 'center',
  },
  tomarButtonText: {
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    width: 35,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    width: 35,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default AlarmesScreen;

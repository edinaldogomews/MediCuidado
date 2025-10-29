import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const NotificacoesScreen = ({ navigation }) => {
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
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
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarNotificacoes();
    }, [])
  );

  const carregarNotificacoes = async () => {
    try {
      // Primeiro verifica e cria alertas automáticos
      await databaseService.verificarECriarAlertas();

      // Depois carrega todos os alertas
      const alertas = await databaseService.getAllAlertas();

      // Formata os alertas para notificações
      const notificacoesFormatadas = await Promise.all(alertas.map(async (alerta) => {
        let medicamentoNome = 'Sistema';
        if (alerta.medicamento_id) {
          const medicamento = await databaseService.getMedicamentoById(alerta.medicamento_id);
          medicamentoNome = medicamento ? `${medicamento.nome} ${medicamento.dosagem}` : 'Medicamento';
        }

        // Define título baseado no tipo
        let titulo = 'Notificação';
        let prioridade = 'media';

        if (alerta.tipo === 'estoque_baixo') {
          titulo = '📦 Estoque Baixo';
          prioridade = 'alta';
        } else if (alerta.tipo === 'vencimento_proximo') {
          titulo = '⚠️ Vencimento Próximo';
          prioridade = 'media';
        } else if (alerta.tipo === 'alarme') {
          titulo = '💊 Hora do Medicamento';
          prioridade = 'alta';
        }

        return {
          id: alerta.id,
          tipo: alerta.tipo,
          titulo: titulo,
          mensagem: alerta.mensagem,
          data: alerta.data,
          horario: alerta.created_at ? new Date(alerta.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
          lida: alerta.lido === 1,
          prioridade: prioridade,
          medicamento_id: alerta.medicamento_id
        };
      }));

      setNotificacoes(notificacoesFormatadas);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      await databaseService.marcarAlertaComoLido(id);
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      await databaseService.marcarTodosAlertasComoLidos();
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'alarme': return '💊';
      case 'estoque_baixo': return '📦';
      case 'vencimento_proximo': return '⚠️';
      default: return '🔔';
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'alta': return '#F44336';
      case 'media': return '#FF9800';
      case 'baixa': return '#4CAF50';
      default: return '#666';
    }
  };

  const renderNotificacao = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificacaoCard,
        { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
        !item.lida && styles.notificacaoNaoLida
      ]}
      onPress={() => marcarComoLida(item.id)}
    >
      <View style={styles.notificacaoIcon}>
        <Text style={styles.iconText}>{getTipoIcon(item.tipo)}</Text>
        {!item.lida && <View style={styles.pontoNaoLida} />}
      </View>

      <View style={styles.notificacaoInfo}>
        <Text style={[
          styles.notificacaoTitulo,
          { color: isDark ? '#ddd' : '#333' },
          !item.lida && styles.textoNaoLido
        ]}>
          {item.titulo}
        </Text>
        <Text style={[styles.notificacaoMensagem, { color: isDark ? '#bbb' : '#555' }]}>{item.mensagem}</Text>
        <Text style={[styles.notificacaoData, { color: isDark ? '#999' : '#777' }]}>
          📅 {item.data} às {item.horario}
        </Text>
      </View>

      <View style={[
        styles.prioridadeBadge,
        { backgroundColor: getPrioridadeColor(item.prioridade) }
      ]}>
        <Text style={styles.prioridadeText}>
          {item.prioridade.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const notificacaoNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={marcarTodasComoLidas}
        >
          <Text style={styles.markAllButtonText}>✓ Marcar todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.statNumber}>{notificacaoNaoLidas}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Não Lidas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.statNumber}>{notificacoes.length}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Total</Text>
        </View>
      </View>

      {notificacoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={[styles.emptyTitle, { color: isDark ? '#ddd' : '#333' }]}>Nenhuma notificação</Text>
          <Text style={[styles.emptyText, { color: isDark ? '#bbb' : '#666' }]}>
            Você não tem notificações no momento
          </Text>
        </View>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNotificacao}
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
    backgroundColor: '#E91E63',
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
  markAllButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  markAllButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 15,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 15,
  },
  notificacaoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  notificacaoNaoLida: {
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  notificacaoIcon: {
    position: 'relative',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  pontoNaoLida: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E91E63',
    position: 'absolute',
    top: -2,
    right: -2,
  },
  notificacaoInfo: {
    flex: 1,
  },
  notificacaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  textoNaoLido: {
    color: '#E91E63',
  },
  notificacaoMensagem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  notificacaoData: {
    fontSize: 12,
    color: '#777',
  },
  prioridadeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  prioridadeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default NotificacoesScreen;

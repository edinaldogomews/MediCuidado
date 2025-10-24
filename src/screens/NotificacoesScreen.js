import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useThemePreference } from '../contexts/ThemeContext';

const NotificacoesScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
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
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      tipo: 'medicamento',
      titulo: 'Hora do medicamento!',
      mensagem: 'Losartana 50mg - 08:00',
      data: '2025-09-21',
      horario: '08:00',
      lida: false,
      prioridade: 'alta',
    },
    {
      id: 2,
      tipo: 'estoque',
      titulo: 'Estoque baixo',
      mensagem: 'Metformina 850mg está acabando (5 unidades restantes)',
      data: '2025-09-21',
      horario: '07:30',
      lida: true,
      prioridade: 'media',
    },
    {
      id: 3,
      tipo: 'vencimento',
      titulo: 'Medicamento vencendo',
      mensagem: 'Sinvastatina 20mg vence em 2 semanas',
      data: '2025-09-20',
      horario: '09:00',
      lida: false,
      prioridade: 'media',
    },
    {
      id: 4,
      tipo: 'perdido',
      titulo: 'Dose perdida',
      mensagem: 'Metformina 850mg não foi tomada às 12:00',
      data: '2025-09-20',
      horario: '12:30',
      lida: true,
      prioridade: 'alta',
    },
  ]);

  const marcarComoLida = (id) => {
    setNotificacoes(prev => prev.map(notif =>
      notif.id === id ? { ...notif, lida: true } : notif
    ));
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'medicamento': return '💊';
      case 'estoque': return '📦';
      case 'vencimento': return '⚠️';
      case 'perdido': return '❌';
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

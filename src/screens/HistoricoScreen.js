// ========================================
// TELA: HISTÓRICO DE MOVIMENTAÇÕES
// ========================================
//
// DESCRIÇÃO:
// Tela que exibe o histórico completo de movimentações de estoque.
// Mostra todas as entradas e saídas de medicamentos com filtros.
//
// FUNCIONALIDADES:
// - 📋 Lista todas as movimentações (entradas e saídas)
// - 🔍 Filtro por tipo (todos, entrada, saída)
// - 📅 Filtro por período (hoje, semana, mês, todos)
// - 📊 Exibe informações detalhadas:
//   - Nome do medicamento e dosagem
//   - Tipo de movimentação (entrada/saída)
//   - Quantidade movimentada
//   - Data e horário
//   - Usuário responsável
//   - Motivo da movimentação
// - 🔄 Atualização automática ao focar na tela
// - 🌓 Suporte a tema claro/escuro
// - 📱 Lista com scroll infinito
//
// NAVEGAÇÃO:
// - Vem de: HomeScreen (menu principal)
// - Não navega para outras telas
//
// PERMISSÕES:
// - Cuidadores e idosos podem visualizar
// - Apenas visualização (sem edição/exclusão)
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const HistoricoScreen = ({ navigation }) => {
  // ========================================
  // ESTADOS E CONTEXTOS
  // ========================================

  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;

  /**
   * Função de navegação para voltar
   * Tenta várias rotas possíveis para garantir navegação correta
   */
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

  const [filtroAtivo, setFiltroAtivo] = useState('todos');        // Filtro: todos, entrada, saida
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');    // Filtro: hoje, semana, mes, todos
  const [historico, setHistorico] = useState([]);                 // Lista de movimentações
  const [isLoading, setIsLoading] = useState(true);               // Indicador de carregamento

  // ========================================
  // EFEITOS E CARREGAMENTO
  // ========================================

  /**
   * Carrega histórico ao montar o componente
   */
  useEffect(() => {
    carregarHistorico();
  }, []);

  /**
   * Recarrega histórico sempre que a tela recebe foco
   */
  useFocusEffect(
    React.useCallback(() => {
      carregarHistorico();
    }, [])
  );

  /**
   * Carrega histórico de movimentações do banco de dados
   *
   * PROCESSO:
   * 1. Busca todas as movimentações do banco
   * 2. Para cada movimentação, busca informações do medicamento
   * 3. Formata dados para exibição
   * 4. Ordena por data mais recente primeiro
   * 5. Atualiza estado com lista formatada
   */
  const carregarHistorico = async () => {
    try {
      setIsLoading(true);

      // Busca todas as movimentações do banco
      const movimentacoes = await databaseService.getAllMovimentacoes();

      // Formata as movimentações para exibição
      const historicoFormatado = await Promise.all(movimentacoes.map(async (mov) => {
        // Busca informações do medicamento
        const medicamento = await databaseService.getMedicamentoById(mov.medicamento_id);

        return {
          id: mov.id,
          medicamento: medicamento ? `${medicamento.nome} ${medicamento.dosagem}` : 'Medicamento não encontrado',
          acao: mov.tipo,                    // 'entrada' ou 'saida'
          data: mov.data,                    // Data da movimentação
          dataObj: new Date(mov.data),       // Objeto Date para filtros
          horario: mov.created_at ? new Date(mov.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
          quantidade: mov.quantidade,        // Quantidade movimentada
          usuario: mov.usuario || 'Usuário', // Usuário responsável
          motivo: mov.motivo || ''           // Motivo da movimentação
        };
      }));

      // Ordena por data mais recente primeiro
      historicoFormatado.sort((a, b) => b.dataObj - a.dataObj);

      setHistorico(historicoFormatado);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtros = [
    { key: 'todos', label: 'Todos', color: '#666' },
    { key: 'entrada', label: 'Entradas', color: '#4CAF50' },
    { key: 'saida', label: 'Saídas', color: '#F44336' },
  ];

  const filtrosPeriodo = [
    { key: 'todos', label: 'Todos' },
    { key: 'hoje', label: 'Hoje' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mês' },
  ];

  // Filtra por tipo (entrada/saída)
  let historicoFiltrado = filtroAtivo === 'todos'
    ? historico
    : historico.filter(item => item.acao === filtroAtivo);

  // Filtra por período
  if (filtroPeriodo !== 'todos') {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (filtroPeriodo === 'hoje') {
      historicoFiltrado = historicoFiltrado.filter(item => {
        const itemData = new Date(item.data);
        itemData.setHours(0, 0, 0, 0);
        return itemData.getTime() === hoje.getTime();
      });
    } else if (filtroPeriodo === 'semana') {
      const semanaAtras = new Date(hoje);
      semanaAtras.setDate(hoje.getDate() - 7);
      historicoFiltrado = historicoFiltrado.filter(item => {
        const itemData = new Date(item.data);
        return itemData >= semanaAtras;
      });
    } else if (filtroPeriodo === 'mes') {
      const mesAtras = new Date(hoje);
      mesAtras.setMonth(hoje.getMonth() - 1);
      historicoFiltrado = historicoFiltrado.filter(item => {
        const itemData = new Date(item.data);
        return itemData >= mesAtras;
      });
    }
  }

  // Estatísticas
  const stats = React.useMemo(() => {
    const entradas = historicoFiltrado.filter(item => item.acao === 'entrada').length;
    const saidas = historicoFiltrado.filter(item => item.acao === 'saida').length;
    const total = historicoFiltrado.length;

    return { entradas, saidas, total };
  }, [historicoFiltrado]);

  const getAcaoColor = (acao) => {
    switch (acao) {
      case 'entrada': return '#4CAF50';
      case 'saida': return '#F44336';
      default: return '#666';
    }
  };

  const getAcaoIcon = (acao) => {
    switch (acao) {
      case 'entrada': return '📥';
      case 'saida': return '📤';
      default: return '📋';
    }
  };

  const getAcaoText = (acao) => {
    switch (acao) {
      case 'entrada': return 'Entrada';
      case 'saida': return 'Saída';
      default: return 'Movimentação';
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.itemCard,
      { backgroundColor: isDark ? '#1e1e1e' : '#fff' }
    ]}>
      <View style={styles.acaoIcon}>
        <Text style={styles.iconText}>{getAcaoIcon(item.acao)}</Text>
      </View>

      <View style={styles.itemInfo}>
        <Text style={[
          styles.medicamentoNome,
          { color: isDark ? '#ddd' : '#333' }
        ]}>
          {item.medicamento}
        </Text>
        <Text style={[
          styles.paciente,
          { color: isDark ? '#bbb' : '#555' }
        ]}>
          👤 {item.usuario}
        </Text>
        <Text style={[
          styles.quantidade,
          { color: isDark ? '#bbb' : '#555' }
        ]}>
          📦 Quantidade: {item.quantidade}
        </Text>
        {item.motivo ? (
          <Text style={[
            styles.motivo,
            { color: isDark ? '#999' : '#666' }
          ]}>
            💬 {item.motivo}
          </Text>
        ) : null}
        <Text style={[
          styles.dataHorario,
          { color: isDark ? '#888' : '#777' }
        ]}>
          📅 {item.data} {item.horario ? `às ${item.horario}` : ''}
        </Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getAcaoColor(item.acao) }]}>
        <Text style={styles.statusText}>{getAcaoText(item.acao)}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Histórico</Text>
          <View style={styles.exportButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#795548" />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#333' }]}>
            Carregando histórico...
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
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Histórico</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => Alert.alert('Relatório', 'Funcionalidade em desenvolvimento')}
        >
          <Text style={styles.exportButtonText}>📊 Relatório</Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsCardsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.entradas}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Entradas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.saidas}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Saídas</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.statNumber, { color: '#795548' }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Total</Text>
        </View>
      </View>

      {/* Filtro por Tipo */}
      <View style={[styles.filtrosContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.filtroLabel, { color: isDark ? '#bbb' : '#666' }]}>Tipo:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosScroll}
        >
          {filtros.map(filtro => (
            <TouchableOpacity
              key={filtro.key}
              style={[
                styles.filtroButton,
                { backgroundColor: filtroAtivo === filtro.key ? filtro.color : (isDark ? '#2a2a2a' : '#f0f0f0') }
              ]}
              onPress={() => setFiltroAtivo(filtro.key)}
            >
              <Text style={[
                styles.filtroText,
                { color: filtroAtivo === filtro.key ? '#fff' : (isDark ? '#bbb' : '#666') }
              ]}>
                {filtro.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtro por Período */}
      <View style={[styles.filtrosContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.filtroLabel, { color: isDark ? '#bbb' : '#666' }]}>Período:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosScroll}
        >
          {filtrosPeriodo.map(filtro => (
            <TouchableOpacity
              key={filtro.key}
              style={[
                styles.filtroButton,
                { backgroundColor: filtroPeriodo === filtro.key ? '#795548' : (isDark ? '#2a2a2a' : '#f0f0f0') }
              ]}
              onPress={() => setFiltroPeriodo(filtro.key)}
            >
              <Text style={[
                styles.filtroText,
                { color: filtroPeriodo === filtro.key ? '#fff' : (isDark ? '#bbb' : '#666') }
              ]}>
                {filtro.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={historicoFiltrado}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
              Nenhum registro encontrado
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
              As movimentações de estoque aparecerão aqui
            </Text>
          </View>
        }
      />
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
    backgroundColor: '#795548',
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
  exportButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  statsCardsContainer: {
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  filtrosContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  filtrosScroll: {
    gap: 8,
  },
  filtroButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filtroText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  list: {
    padding: 15,
  },
  itemCard: {
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
  acaoIcon: {
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  paciente: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  quantidade: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  motivo: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  dataHorario: {
    fontSize: 12,
    color: '#777',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HistoricoScreen;

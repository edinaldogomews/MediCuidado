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

const HistoricoScreen = ({ navigation }) => {
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
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarHistorico();
    }, [])
  );

  const carregarHistorico = async () => {
    try {
      const movimentacoes = await databaseService.getAllMovimentacoes();

      // Formata as movimentações para exibição
      const historicoFormatado = await Promise.all(movimentacoes.map(async (mov) => {
        const medicamento = await databaseService.getMedicamentoById(mov.medicamento_id);
        return {
          id: mov.id,
          medicamento: medicamento ? `${medicamento.nome} ${medicamento.dosagem}` : 'Medicamento não encontrado',
          acao: mov.tipo, // 'entrada' ou 'saida'
          data: mov.data,
          horario: mov.created_at ? new Date(mov.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
          quantidade: mov.quantidade,
          usuario: mov.usuario || 'Usuário',
          motivo: mov.motivo || ''
        };
      }));

      setHistorico(historicoFormatado);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const filtros = [
    { key: 'todos', label: 'Todos', color: '#666' },
    { key: 'entrada', label: 'Entradas', color: '#4CAF50' },
    { key: 'saida', label: 'Saídas', color: '#F44336' },
  ];

  const historicoFiltrado = filtroAtivo === 'todos'
    ? historico
    : historico.filter(item => item.acao === filtroAtivo);

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
    <View style={styles.itemCard}>
      <View style={styles.acaoIcon}>
        <Text style={styles.iconText}>{getAcaoIcon(item.acao)}</Text>
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.medicamentoNome}>{item.medicamento}</Text>
        <Text style={styles.paciente}>👤 {item.usuario}</Text>
        <Text style={styles.quantidade}>📦 Quantidade: {item.quantidade}</Text>
        {item.motivo ? <Text style={styles.motivo}>💬 {item.motivo}</Text> : null}
        <Text style={styles.dataHorario}>📅 {item.data} {item.horario ? `às ${item.horario}` : ''}</Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getAcaoColor(item.acao) }]}>
        <Text style={styles.statusText}>{getAcaoText(item.acao)}</Text>
      </View>
    </View>
  );

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
          onPress={() => console.log('Exportar histórico')}
        >
          <Text style={styles.exportButtonText}>📊 Relatório</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtrosContainer}>
        {filtros.map(filtro => (
          <TouchableOpacity
            key={filtro.key}
            style={[
              styles.filtroButton,
              { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
              filtroAtivo === filtro.key && { backgroundColor: filtro.color }
            ]}
            onPress={() => setFiltroAtivo(filtro.key)}
          >
            <Text style={[
              styles.filtroText,
              { color: isDark ? '#bbb' : '#666' },
              filtroAtivo === filtro.key && { color: '#fff' }
            ]}>
              {filtro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: isDark ? '#bbb' : '#666' }]}>
          {historicoFiltrado.length} registros encontrados
        </Text>
      </View>

      <FlatList
        data={historicoFiltrado}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  filtrosContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  filtroButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 1,
  },
  filtroText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  statsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
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

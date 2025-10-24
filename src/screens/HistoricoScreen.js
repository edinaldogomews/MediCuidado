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

const HistoricoScreen = ({ navigation }) => {
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
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  const historico = [
    {
      id: 1,
      medicamento: 'Losartana 50mg',
      acao: 'tomado',
      data: '2025-09-21',
      horario: '08:00',
      paciente: 'Maria Silva',
    },
    {
      id: 2,
      medicamento: 'Metformina 850mg',
      acao: 'perdido',
      data: '2025-09-21',
      horario: '12:00',
      paciente: 'João Santos',
    },
    {
      id: 3,
      medicamento: 'Sinvastatina 20mg',
      acao: 'tomado',
      data: '2025-09-20',
      horario: '20:00',
      paciente: 'Maria Silva',
    },
    {
      id: 4,
      medicamento: 'Omeprazol 20mg',
      acao: 'atrasado',
      data: '2025-09-20',
      horario: '08:30',
      paciente: 'Ana Costa',
    },
  ];

  const filtros = [
    { key: 'todos', label: 'Todos', color: '#666' },
    { key: 'tomado', label: 'Tomados', color: '#4CAF50' },
    { key: 'perdido', label: 'Perdidos', color: '#F44336' },
    { key: 'atrasado', label: 'Atrasados', color: '#FF9800' },
  ];

  const historicoFiltrado = filtroAtivo === 'todos'
    ? historico
    : historico.filter(item => item.acao === filtroAtivo);

  const getAcaoColor = (acao) => {
    switch (acao) {
      case 'tomado': return '#4CAF50';
      case 'perdido': return '#F44336';
      case 'atrasado': return '#FF9800';
      default: return '#666';
    }
  };

  const getAcaoIcon = (acao) => {
    switch (acao) {
      case 'tomado': return '✅';
      case 'perdido': return '❌';
      case 'atrasado': return '⏰';
      default: return '📋';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.acaoIcon}>
        <Text style={styles.iconText}>{getAcaoIcon(item.acao)}</Text>
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.medicamentoNome}>{item.medicamento}</Text>
        <Text style={styles.paciente}>👤 {item.paciente}</Text>
        <Text style={styles.dataHorario}>📅 {item.data} às {item.horario}</Text>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: getAcaoColor(item.acao) }]}>
        <Text style={styles.statusText}>{item.acao.toUpperCase()}</Text>
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

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { StorageService } from '../../services/StorageService';
import { Alarme, Medicamento } from '../../types';

const HistoricoScreen = () => {
  const [historico, setHistorico] = useState<(Alarme & { medicamento?: Medicamento })[]>([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    const alarmes = await StorageService.getAlarmes();
    const medicamentos = await StorageService.getMedicamentos();

    const historicoAlarmes = alarmes
      .filter(alarme => alarme.status === 'tomado')
      .map(alarme => ({
        ...alarme,
        medicamento: medicamentos.find(m => m.id === alarme.medicamentoId)
      }))
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    setHistorico(historicoAlarmes);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderItem = ({ item }: { item: Alarme & { medicamento?: Medicamento } }) => (
    <View style={styles.historicoCard}>
      <View style={styles.dataContainer}>
        <Text style={styles.data}>{formatarData(item.data)}</Text>
      </View>
      <View style={styles.medicamentoInfo}>
        <Text style={styles.medicamentoNome}>
          {item.medicamento?.nome || 'Medicamento não encontrado'}
        </Text>
        <Text style={styles.dosagem}>{item.medicamento?.dosagem}</Text>
        <Text style={styles.horario}>Horário: {item.horario}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Medicamentos</Text>
      </View>

      <FlatList
        data={historico}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}_${item.data}`}
        style={styles.lista}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum medicamento registrado no histórico</Text>
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
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  lista: {
    flex: 1,
    padding: 16,
  },
  historicoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dataContainer: {
    marginBottom: 8,
  },
  data: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dosagem: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  horario: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default HistoricoScreen;

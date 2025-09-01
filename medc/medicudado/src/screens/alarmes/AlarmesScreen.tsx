import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationService from '../../services/NotificationService';
import { StorageService } from '../../services/StorageService';
import { Alarme, Medicamento } from '../../types';

const AlarmesScreen = () => {
  const [alarmes, setAlarmes] = useState<(Alarme & { medicamento?: Medicamento })[]>([]);

  useEffect(() => {
    carregarAlarmes();
    const interval = setInterval(carregarAlarmes, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const carregarAlarmes = async () => {
    const alarmesData = await StorageService.getAlarmes();
    const medicamentos = await StorageService.getMedicamentos();

    const alarmesComMedicamentos = alarmesData.map(alarme => ({
      ...alarme,
      medicamento: medicamentos.find(m => m.id === alarme.medicamentoId)
    }));

    setAlarmes(alarmesComMedicamentos);
  };

  const marcarComoTomado = async (alarmeId: string) => {
    await NotificationService.marcarAlarmeTomado(alarmeId);
    carregarAlarmes();
  };

  const renderAlarme = ({ item }: { item: Alarme & { medicamento?: Medicamento } }) => (
    <View style={[
      styles.alarmeCard,
      item.status === 'tomado' && styles.alarmeTomado
    ]}>
      <View style={styles.alarmeInfo}>
        <Text style={styles.horario}>{item.horario}</Text>
        <Text style={styles.medicamentoNome}>
          {item.medicamento?.nome || 'Medicamento não encontrado'}
        </Text>
        <Text style={styles.dosagem}>
          {item.medicamento?.dosagem || ''}
        </Text>
      </View>

      {item.status === 'pendente' && (
        <TouchableOpacity
          style={styles.botaoTomado}
          onPress={() => marcarComoTomado(item.id)}
        >
          <Text style={styles.botaoTomadoTexto}>Marcar como tomado</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alarmes de Medicamentos</Text>
      </View>

      <FlatList
        data={alarmes}
        renderItem={renderAlarme}
        keyExtractor={item => item.id}
        style={styles.lista}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum alarme configurado</Text>
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
  alarmeCard: {
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
  alarmeTomado: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
  },
  alarmeInfo: {
    marginBottom: 10,
  },
  horario: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  medicamentoNome: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  dosagem: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  botaoTomado: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoTomadoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AlarmesScreen;

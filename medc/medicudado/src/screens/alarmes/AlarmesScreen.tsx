import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationService from '../../services/NotificationService';
import { StorageService } from '../../services/StorageService';
import { useSecurity } from '../../contexts/SecurityContext';
import { Alarme, Medicamento } from '../../types';

const AlarmesScreen = () => {
  const [alarmes, setAlarmes] = useState<(Alarme & { medicamento?: Medicamento })[]>([]);
  const { requirePin } = useSecurity();

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

  const handleEditarHorario = async (alarmeId: string) => {
    const canProceed = await requirePin('modificar horário do alarme');
    if (canProceed) {
      navigation.navigate('EditarHorarioAlarme', { alarmeId });
    }
  };

  const marcarComoTomado = async (alarmeId: string) => {
    // Não precisa de PIN para marcar como tomado
    try {
      await NotificationService.marcarAlarmeTomado(alarmeId);
      carregarAlarmes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o alarme');
    }
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

      <View style={styles.botoesContainer}>
        {item.status === 'pendente' && (
          <>
            <TouchableOpacity
              style={styles.botaoTomado}
              onPress={() => marcarComoTomado(item.id)}
            >
              <Text style={styles.botaoTomadoTexto}>Marcar como tomado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() => handleEditarHorario(item.id)}
            >
              <Text style={styles.botaoEditarTexto}>Editar Horário</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoTomado: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  botaoTomadoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoEditar: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
  },
  botaoEditarTexto: {
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

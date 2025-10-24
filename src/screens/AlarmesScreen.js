import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import { StorageService } from '../services/StorageService';

const AlarmesScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
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

  // Load alarms from storage
  const carregarAlarmes = async () => {
    try {
      let alarmesData = await StorageService.getAlarmes();
      let medicamentos = await StorageService.getMedicamentos();

      // If no alarms exist, create some sample data
      if (alarmesData.length === 0) {
        const sampleAlarmes = [
          {
            id: '1',
            medicamentoId: '1',
            horario: '08:00',
            status: 'pendente',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
          },
          {
            id: '2',
            medicamentoId: '2',
            horario: '12:00',
            status: 'pendente',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
          },
          {
            id: '3',
            medicamentoId: '3',
            horario: '20:00',
            status: 'inativo',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
          }
        ];

        const sampleMedicamentos = [
          {
            id: '1',
            nome: 'Losartana 50mg',
            dosagem: '50mg',
            horario: '08:00',
            status: 'ativo',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
          },
          {
            id: '2',
            nome: 'Metformina 850mg',
            dosagem: '850mg',
            horario: '12:00',
            status: 'ativo',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
          },
          {
            id: '3',
            nome: 'Sinvastatina 20mg',
            dosagem: '20mg',
            horario: '20:00',
            status: 'ativo',
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
          }
        ];

        // Save sample data
        await StorageService.saveAlarme(sampleAlarmes[0]);
        await StorageService.saveAlarme(sampleAlarmes[1]);
        await StorageService.saveAlarme(sampleAlarmes[2]);
        await StorageService.saveMedicamento(sampleMedicamentos[0]);
        await StorageService.saveMedicamento(sampleMedicamentos[1]);
        await StorageService.saveMedicamento(sampleMedicamentos[2]);

        alarmesData = sampleAlarmes;
        medicamentos = sampleMedicamentos;
      }

      // Map alarms with medication data and convert to the expected format
      const alarmesComMedicamentos = alarmesData.map(alarme => {
        const medicamento = medicamentos.find(m => m.id === alarme.medicamentoId);
        
        // Convert days object to array of day names for display
        let diasArray = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']; // Default days
        if (alarme.dias && typeof alarme.dias === 'object') {
          const diasMap = {
            segunda: 'Seg',
            terca: 'Ter', 
            quarta: 'Qua',
            quinta: 'Qui',
            sexta: 'Sex',
            sabado: 'Sab',
            domingo: 'Dom'
          };
          diasArray = Object.keys(alarme.dias)
            .filter(dia => alarme.dias[dia])
            .map(dia => diasMap[dia] || dia);
        }
        
        return {
          id: alarme.id,
          medicamento: medicamento?.nome || 'Medicamento não encontrado',
          horario: alarme.horario,
          ativo: alarme.status === 'pendente', // Convert status to ativo boolean
          dias: diasArray,
          status: alarme.status,
          medicamentoId: alarme.medicamentoId
        };
      });

      setAlarmes(alarmesComMedicamentos);
    } catch (error) {
      console.error('Erro ao carregar alarmes:', error);
      // Fallback to empty array if there's an error
      setAlarmes([]);
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
      // Find the alarm to toggle
      const alarme = alarmes.find(a => a.id === id);
      if (!alarme) return;

      // Determine new status based on current ativo state
      const newStatus = alarme.ativo ? 'inativo' : 'pendente';
      
      // Update in storage
      await StorageService.updateAlarmeStatus(id, newStatus);
      
      // Update local state
      setAlarmes(prev => prev.map(alarme =>
        alarme.id === id ? { ...alarme, ativo: !alarme.ativo, status: newStatus } : alarme
      ));
    } catch (error) {
      console.error('Erro ao atualizar alarme:', error);
    }
  };

  const renderAlarme = ({ item }) => (
    <View style={styles.alarmeCard}>
      <View style={styles.alarmeInfo}>
        <Text style={styles.medicamentoNome}>{item.medicamento}</Text>
        <Text style={styles.horario}>⏰ {item.horario}</Text>
        <View style={styles.diasContainer}>
          {item.dias.map((dia, index) => (
            <Text key={index} style={styles.dia}>{dia}</Text>
          ))}
        </View>
      </View>

      <View style={styles.alarmeControls}>
        <Switch
          value={item.ativo}
          onValueChange={() => toggleAlarme(item.id)}
          trackColor={{ false: '#ccc', true: '#4CAF50' }}
          thumbColor={item.ativo ? '#fff' : '#f4f3f4'}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditAlarme', { alarmeId: item.id })}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
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
        <Text style={styles.title}>Alarmes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAlarme')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.statNumber}>{alarmes.filter(a => a.ativo).length}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Alarmes Ativos</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={styles.statNumber}>{alarmes.length}</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Total</Text>
        </View>
      </View>

      <FlatList
        data={alarmes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderAlarme}
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
    color: '#FF9800',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
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
  alarmeInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  horario: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  diasContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  dia: {
    fontSize: 12,
    color: '#555',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alarmeControls: {
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    width: 35,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AlarmesScreen;

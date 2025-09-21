import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Switch,
} from 'react-native';

const AlarmesScreen = ({ navigation }) => {
  const [alarmes, setAlarmes] = useState([
    {
      id: 1,
      medicamento: 'Losartana 50mg',
      horario: '08:00',
      ativo: true,
      dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    },
    {
      id: 2,
      medicamento: 'Metformina 850mg',
      horario: '12:00',
      ativo: true,
      dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    },
    {
      id: 3,
      medicamento: 'Sinvastatina 20mg',
      horario: '20:00',
      ativo: false,
      dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    },
  ]);

  const toggleAlarme = (id) => {
    setAlarmes(prev => prev.map(alarme =>
      alarme.id === id ? { ...alarme, ativo: !alarme.ativo } : alarme
    ));
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
          onPress={() => console.log('Editar alarme:', item.id)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Alarmes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Adicionar alarme')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{alarmes.filter(a => a.ativo).length}</Text>
          <Text style={styles.statLabel}>Alarmes Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{alarmes.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
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

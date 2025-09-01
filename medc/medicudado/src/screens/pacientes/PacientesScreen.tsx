import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tipo para paciente
type Patient = {
  id: number;
  name: string;
  age: number;
  bedNumber: string;
  department: string;
  status: 'internado' | 'ambulatorial' | 'urgência';
};

// Dados fictícios de pacientes
const mockPatients: Patient[] = [
  { id: 1, name: 'João Silva', age: 65, bedNumber: '101', department: 'Cardiologia', status: 'internado' },
  { id: 2, name: 'Maria Oliveira', age: 42, bedNumber: '203', department: 'Pneumologia', status: 'internado' },
  { id: 3, name: 'Pedro Santos', age: 28, bedNumber: '305', department: 'Ortopedia', status: 'internado' },
  { id: 4, name: 'Ana Costa', age: 55, bedNumber: 'A12', department: 'Endocrinologia', status: 'ambulatorial' },
  { id: 5, name: 'Lucas Ferreira', age: 33, bedNumber: 'UR5', department: 'Neurologia', status: 'urgência' },
  { id: 6, name: 'Carla Martins', age: 47, bedNumber: '110', department: 'Oncologia', status: 'internado' },
];

const PacientesScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);

  // Filtrar pacientes com base na consulta de pesquisa
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredPatients(mockPatients);
    } else {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(text.toLowerCase()) ||
        patient.bedNumber.toLowerCase().includes(text.toLowerCase()) ||
        patient.department.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  // Renderizar item de paciente
  const renderPatientItem = ({ item }: { item: Patient }) => {
    return (
      <TouchableOpacity
        style={styles.patientCard}
        onPress={() => navigation.navigate('DetalhePaciente', { id: item.id })}
      >
        <View style={styles.patientAvatarContainer}>
          <View style={styles.patientAvatar} />
          <View style={[styles.statusIndicator,
            item.status === 'internado' ? styles.statusInternado :
            item.status === 'urgência' ? styles.statusUrgencia :
            styles.statusAmbulatorial
          ]} />
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientDetails}>
            {item.age} anos • Leito {item.bedNumber} • {item.department}
          </Text>
          <Text style={styles.patientStatus}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente por nome, leito ou especialidade"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.resultCount}>{filteredPatients.length} pacientes encontrados</Text>

        <FlatList
          data={filteredPatients}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPatientItem}
          contentContainerStyle={styles.patientsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  resultCount: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  patientsList: {
    paddingBottom: 20,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientAvatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    backgroundColor: '#E6E6E6',
    borderRadius: 25,
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusInternado: {
    backgroundColor: '#4CAF50', // Verde
  },
  statusAmbulatorial: {
    backgroundColor: '#2196F3', // Azul
  },
  statusUrgencia: {
    backgroundColor: '#F44336', // Vermelho
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  patientStatus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555555',
  },
});

export default PacientesScreen;

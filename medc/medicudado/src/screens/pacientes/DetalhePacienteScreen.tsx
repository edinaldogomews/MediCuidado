import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dados fictícios detalhados de um paciente
const mockPatientDetail = {
  id: 1,
  name: 'João Silva',
  age: 65,
  gender: 'Masculino',
  dateOfBirth: '15/04/1960',
  bedNumber: '101',
  department: 'Cardiologia',
  status: 'Internado',
  admissionDate: '28/08/2025',
  healthInsurance: 'Plano de Saúde ABC',
  medicalRecord: '12345678',
  primaryDoctor: 'Dra. Claudia Ferreira',
  allergies: ['Penicilina', 'Dipirona'],
  diagnoses: [
    { code: 'I21.0', description: 'Infarto agudo do miocárdio' },
    { code: 'I10', description: 'Hipertensão essencial (primária)' },
    { code: 'E11', description: 'Diabetes mellitus tipo 2' }
  ],
  vitalSigns: {
    bloodPressure: '130/85 mmHg',
    heartRate: '78 bpm',
    temperature: '36.7 °C',
    oxygenSaturation: '96%',
    respiratoryRate: '16 rpm',
    lastUpdated: '31/08/2025 10:25'
  }
};

const DetalhePacienteScreen = ({ route, navigation }: any) => {
  const patientId = route.params?.id || 1;
  // Em um app real, buscaríamos os dados do paciente com base no ID
  const patient = mockPatientDetail;

  const navigateToPrescription = () => {
    navigation.navigate('Prescricao', { patientId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Cabeçalho com informações básicas do paciente */}
        <View style={styles.header}>
          <View style={styles.patientAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientBasicInfo}>
              {patient.age} anos • {patient.gender} • {patient.dateOfBirth}
            </Text>
            <Text style={styles.patientStatus}>
              {patient.status} • Leito {patient.bedNumber} • {patient.department}
            </Text>
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToPrescription}
          >
            <Text style={styles.actionText}>Prescrição</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Evolução</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Exames</Text>
          </TouchableOpacity>
        </View>

        {/* Informações administrativas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Administrativas</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prontuário:</Text>
              <Text style={styles.infoValue}>{patient.medicalRecord}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data de Admissão:</Text>
              <Text style={styles.infoValue}>{patient.admissionDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Convênio:</Text>
              <Text style={styles.infoValue}>{patient.healthInsurance}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Médico Responsável:</Text>
              <Text style={styles.infoValue}>{patient.primaryDoctor}</Text>
            </View>
          </View>
        </View>

        {/* Sinais vitais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinais Vitais</Text>
          <View style={styles.infoCard}>
            <Text style={styles.vitalSignsDate}>
              Última atualização: {patient.vitalSigns.lastUpdated}
            </Text>
            <View style={styles.vitalSignsContainer}>
              <View style={styles.vitalSignItem}>
                <Text style={styles.vitalSignValue}>{patient.vitalSigns.bloodPressure}</Text>
                <Text style={styles.vitalSignLabel}>Pressão Arterial</Text>
              </View>
              <View style={styles.vitalSignItem}>
                <Text style={styles.vitalSignValue}>{patient.vitalSigns.heartRate}</Text>
                <Text style={styles.vitalSignLabel}>Freq. Cardíaca</Text>
              </View>
              <View style={styles.vitalSignItem}>
                <Text style={styles.vitalSignValue}>{patient.vitalSigns.temperature}</Text>
                <Text style={styles.vitalSignLabel}>Temperatura</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Diagnósticos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnósticos</Text>
          <View style={styles.infoCard}>
            {patient.diagnoses.map((diagnosis, index) => (
              <View key={index} style={styles.diagnosisItem}>
                <Text style={styles.diagnosisCode}>{diagnosis.code}</Text>
                <Text style={styles.diagnosisDescription}>{diagnosis.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  patientAvatar: {
    width: 70,
    height: 70,
    backgroundColor: '#E6E6E6',
    borderRadius: 35,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  patientBasicInfo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  patientStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066CC',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  section: {
    marginBottom: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: '40%',
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  vitalSignsDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  vitalSignsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalSignItem: {
    width: '30%',
    marginBottom: 15,
  },
  vitalSignValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 3,
  },
  vitalSignLabel: {
    fontSize: 12,
    color: '#666666',
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  diagnosisCode: {
    backgroundColor: '#E6E6E6',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555555',
    marginRight: 10,
  },
  diagnosisDescription: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
});

export default DetalhePacienteScreen;

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const navigateToPacientes = () => {
    navigation.navigate('Pacientes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name || 'Usuário'}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Pacientes Hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Prescrições Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Notificações</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ações Rápidas</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToPacientes}
          >
            <View style={styles.actionIcon} />
            <Text style={styles.actionText}>Lista de Pacientes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon} />
            <Text style={styles.actionText}>Nova Prescrição</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon} />
            <Text style={styles.actionText}>Documentos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon} />
            <Text style={styles.actionText}>Notificações</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Últimos Pacientes</Text>

        <View style={styles.patientsContainer}>
          {[1, 2, 3].map(index => (
            <TouchableOpacity
              key={index}
              style={styles.patientCard}
              onPress={() => navigation.navigate('DetalhePaciente', { id: index })}
            >
              <View style={styles.patientAvatar} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>Paciente Exemplo {index}</Text>
                <Text style={styles.patientDetails}>45 anos • Leito 102 • Cardiologia</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={navigateToPacientes}
          >
            <Text style={styles.viewAllText}>Ver todos os pacientes</Text>
          </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  patientsContainer: {
    marginBottom: 20,
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
  patientAvatar: {
    width: 50,
    height: 50,
    backgroundColor: '#E6E6E6',
    borderRadius: 25,
    marginRight: 15,
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
  },
  viewAllButton: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 10,
    marginTop: 10,
  },
  viewAllText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;

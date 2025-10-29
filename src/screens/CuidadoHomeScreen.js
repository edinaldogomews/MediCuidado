import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemePreference } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const CuidadoHomeScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
  const { logout } = useAuth();

  // Dados simulados de medicamentos para o idoso
  const medicamentosHoje = [
    { nome: 'Losartana 50mg', horario: '08:00', status: 'pendente' },
    { nome: 'Metformina 850mg', horario: '12:00', status: 'tomado' },
    { nome: 'Sinvastatina 20mg', horario: '20:00', status: 'pendente' },
    { nome: 'Omeprazol 20mg', horario: '08:00', status: 'tomado' },
  ];

  const proximoMedicamento = medicamentosHoje.find(med => med.status === 'pendente');

  const marcarComoTomado = (medicamento) => {
    console.log(`Medicamento ${medicamento.nome} marcado como tomado`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Medicamentos</Text>
        <Text style={styles.subtitle}>Interface Simplificada</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {proximoMedicamento && (
          <View style={styles.proximoCard}>
            <Text style={styles.proximoTitle}>🔔 Próximo Medicamento</Text>
            <Text style={styles.proximoMedicamento}>{proximoMedicamento.nome}</Text>
            <Text style={styles.proximoHorario}>Horário: {proximoMedicamento.horario}</Text>
            <TouchableOpacity
              style={styles.tomarButton}
              onPress={() => marcarComoTomado(proximoMedicamento)}
            >
              <Text style={styles.tomarText}>✓ Marcar como Tomado</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Medicamentos de Hoje</Text>

        {medicamentosHoje.map((med, index) => (
          <View key={index} style={[styles.medicamentoCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <View style={styles.medicamentoInfo}>
              <Text style={[styles.medicamentoNome, { color: isDark ? '#ddd' : '#333' }]}>{med.nome}</Text>
              <Text style={[styles.medicamentoHorario, { color: isDark ? '#bbb' : '#666' }]}>📅 {med.horario}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              med.status === 'tomado' ? styles.statusTomado : styles.statusPendente
            ]}>
              <Text style={styles.statusText}>
                {med.status === 'tomado' ? '✓ Tomado' : '⏰ Pendente'}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate('Ajuda')}
          >
            <Text style={styles.emergencyText}>🚨 Emergência</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => navigation.navigate('Ajuda')}
          >
            <Text style={styles.helpText}>❓ Preciso de Ajuda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  logoutButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  proximoCard: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  proximoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  proximoMedicamento: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  proximoHorario: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  tomarButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  tomarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  medicamentoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicamentoHorario: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    padding: 8,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  statusTomado: {
    backgroundColor: '#4CAF50',
  },
  statusPendente: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    marginTop: 30,
    gap: 15,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    backgroundColor: '#9C27B0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  helpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CuidadoHomeScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemePreference } from '../contexts/ThemeContext';

const PacientesScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();

  const pacientes = [
    {
      id: 1,
      nome: 'Maria Silva',
      idade: 75,
      medicamentos: 3,
      ultimaConsulta: '15/10/2024',
    },
    {
      id: 2,
      nome: 'João Santos',
      idade: 68,
      medicamentos: 5,
      ultimaConsulta: '20/10/2024',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          👥 Pacientes
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? '#aaa' : '#666' }]}>
          Gerencie seus pacientes
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Lista de Pacientes */}
        <View style={styles.section}>
          {pacientes.map((paciente) => (
            <TouchableOpacity
              key={paciente.id}
              style={[
                styles.pacienteCard,
                { backgroundColor: isDark ? '#1e1e1e' : '#fff' }
              ]}
              onPress={() => {
                // Navegar para detalhes do paciente (implementar futuramente)
              }}
            >
              <View style={styles.pacienteHeader}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {paciente.nome.charAt(0)}
                  </Text>
                </View>
                <View style={styles.pacienteInfo}>
                  <Text style={[styles.pacienteNome, { color: isDark ? '#fff' : '#000' }]}>
                    {paciente.nome}
                  </Text>
                  <Text style={[styles.pacienteIdade, { color: isDark ? '#aaa' : '#666' }]}>
                    {paciente.idade} anos
                  </Text>
                </View>
              </View>

              <View style={styles.pacienteStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
                    {paciente.medicamentos}
                  </Text>
                  <Text style={[styles.statLabel, { color: isDark ? '#aaa' : '#666' }]}>
                    Medicamentos
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: isDark ? '#2196F3' : '#1976D2' }]}>
                    {paciente.ultimaConsulta}
                  </Text>
                  <Text style={[styles.statLabel, { color: isDark ? '#aaa' : '#666' }]}>
                    Última Consulta
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão Adicionar Paciente */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
          onPress={() => {
            // Implementar adição de paciente futuramente
          }}
        >
          <Text style={styles.addButtonIcon}>➕</Text>
          <Text style={[styles.addButtonText, { color: isDark ? '#4CAF50' : '#2E7D32' }]}>
            Adicionar Novo Paciente
          </Text>
        </TouchableOpacity>

        {/* Informação */}
        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: isDark ? '#aaa' : '#666' }]}>
            💡 Esta funcionalidade está em desenvolvimento
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  pacienteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pacienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pacienteInfo: {
    flex: 1,
  },
  pacienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pacienteIdade: {
    fontSize: 14,
  },
  pacienteStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PacientesScreen;


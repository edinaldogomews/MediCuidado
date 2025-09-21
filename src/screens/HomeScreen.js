import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userType, logout } = useAuth();

  const menuItems = [
    {
      title: 'Medicamentos',
      icon: '💊',
      description: 'Gerenciar medicamentos',
      onPress: () => navigation.navigate('MedicamentosTab')
    },
    {
      title: 'Alarmes',
      icon: '⏰',
      description: 'Configurar lembretes',
      onPress: () => navigation.navigate('AlarmesTab')
    },
    {
      title: 'Pacientes',
      icon: '👥',
      description: 'Lista de pacientes',
      onPress: () => navigation.navigate('PacientesTab')
    },
    {
      title: 'Estoque',
      icon: '📦',
      description: 'Controle de estoque',
      onPress: () => navigation.navigate('Estoque')
    },
    {
      title: 'Histórico',
      icon: '📋',
      description: 'Histórico de doses',
      onPress: () => navigation.navigate('Historico')
    },
    {
      title: 'Notificações',
      icon: '🔔',
      description: 'Ver notificações',
      onPress: () => navigation.navigate('Notificacoes')
    },
    {
      title: 'Perfil',
      icon: '👤',
      description: 'Meu perfil',
      onPress: () => navigation.navigate('Perfil')
    },
    {
      title: 'Configurações',
      icon: '⚙️',
      description: 'Configurações do app',
      onPress: () => navigation.navigate('Configuracoes')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MediCuidado</Text>
        <Text style={styles.subtitle}>Painel do Cuidador</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#4CAF50',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
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
  menuIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MediCudado</Text>
        <Text style={styles.subtitle}>Controle de Medicamentos</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Medicamentos')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.menuTitle}>Medicamentos</Text>
            <Text style={styles.menuDescription}>Gerenciar medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Alarmes')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.menuTitle}>Alarmes</Text>
            <Text style={styles.menuDescription}>Controlar lembretes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Historico')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#9C27B0' }]} />
            <Text style={styles.menuTitle}>Histórico</Text>
            <Text style={styles.menuDescription}>Medicamentos tomados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Estoque')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.menuTitle}>Estoque</Text>
            <Text style={styles.menuDescription}>Controle de estoque</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <Text style={styles.settingsButtonText}>Configurações</Text>
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
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  menuItem: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    marginTop: 16,
  },
  settingsButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default HomeScreen;

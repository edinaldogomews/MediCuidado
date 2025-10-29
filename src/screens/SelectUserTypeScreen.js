import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const SelectUserTypeScreen = ({ navigation }) => {
  const { setUserType } = useAuth();

  const handleUserTypeSelection = async (type) => {
    try {
      await setUserType(type);
    } catch (error) {
      console.error('Erro ao selecionar tipo de usuário:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao MediCuidado</Text>
        <Text style={styles.subtitle}>Como você vai usar o aplicativo?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, styles.cuidadorOption]}
            onPress={() => handleUserTypeSelection('cuidador')}
          >
            <Text style={styles.optionIcon}>👨‍⚕️</Text>
            <Text style={styles.optionTitle}>Sou Cuidador</Text>
            <Text style={styles.optionDescription}>
              Gerenciar medicamentos e cuidar de alguém
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.idosoOption]}
            onPress={() => handleUserTypeSelection('idoso')}
          >
            <Text style={styles.optionIcon}>👴</Text>
            <Text style={styles.optionTitle}>Sou Idoso</Text>
            <Text style={styles.optionDescription}>
              Visualizar meus medicamentos de forma simples
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  option: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
  },
  cuidadorOption: {
    borderColor: '#4CAF50',
  },
  idosoOption: {
    borderColor: '#2196F3',
  },
  optionIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SelectUserTypeScreen;

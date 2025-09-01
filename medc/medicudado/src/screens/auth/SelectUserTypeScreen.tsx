import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/StorageService';

const SelectUserTypeScreen = ({ navigation }) => {
  const handleUserTypeSelection = async (type: 'idoso' | 'cuidador') => {
    try {
      // Salva a preferência do usuário
      await StorageService.setUserType(type);

      if (type === 'cuidador') {
        navigation.replace('PerfilCadastro');
      } else {
        navigation.replace('CuidadoHome');
      }
    } catch (error) {
      console.error('Erro ao selecionar tipo de usuário:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao MediCudado</Text>
        <Text style={styles.subtitle}>Como você vai usar o aplicativo?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleUserTypeSelection('cuidador')}
          >
            <View style={styles.iconContainer}>
              {/* Aqui você pode adicionar um ícone para cuidador */}
            </View>
            <Text style={styles.optionTitle}>Sou Cuidador</Text>
            <Text style={styles.optionDescription}>
              Gerenciar medicamentos e cuidar de alguém
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleUserTypeSelection('idoso')}
          >
            <View style={styles.iconContainer}>
              {/* Aqui você pode adicionar um ícone para pessoa cuidada */}
            </View>
            <Text style={styles.optionTitle}>Sou a Pessoa Cuidada</Text>
            <Text style={styles.optionDescription}>
              Visualizar meus medicamentos e alarmes
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 20,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    marginBottom: 15,
    alignSelf: 'center',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SelectUserTypeScreen;

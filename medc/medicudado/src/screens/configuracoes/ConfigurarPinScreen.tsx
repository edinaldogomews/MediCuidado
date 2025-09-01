import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecurity } from '../../contexts/SecurityContext';

const ConfigurarPinScreen = ({ navigation, route }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { setUpPin } = useSecurity();
  const { onSuccess } = route.params || {};

  const handleSalvarPin = async () => {
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert('Erro', 'O PIN deve ter entre 4 e 6 dígitos');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Erro', 'Os PINs não coincidem');
      return;
    }

    try {
      await setUpPin(pin);
      Alert.alert('Sucesso', 'PIN configurado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            if (onSuccess) onSuccess();
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível configurar o PIN');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Configurar PIN</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Configure um PIN de 4 a 6 dígitos para proteger ações importantes no aplicativo
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Digite o PIN</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            placeholder="Digite um PIN de 4 a 6 dígitos"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirme o PIN</Text>
          <TextInput
            style={styles.input}
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            placeholder="Digite o PIN novamente"
          />
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Dicas importantes:</Text>
          <Text style={styles.tipText}>• Use um PIN fácil de lembrar, mas seguro</Text>
          <Text style={styles.tipText}>• Não use sequências óbvias como 1234</Text>
          <Text style={styles.tipText}>• Guarde o PIN em um local seguro</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSalvarPin}
        >
          <Text style={styles.buttonText}>Salvar PIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#1976d2',
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ConfigurarPinScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/StorageService';

const SecuritySettingsScreen = ({ navigation }) => {
  const [pinProtectionEnabled, setPinProtectionEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  useEffect(() => {
    checkPinProtection();
  }, []);

  const checkPinProtection = async () => {
    const hasPin = await StorageService.hasPinProtection();
    setPinProtectionEnabled(hasPin);
    setShowPinInput(hasPin);
  };

  const handleTogglePinProtection = (value: boolean) => {
    if (value) {
      setShowPinInput(true);
    } else {
      Alert.alert(
        'Desativar Proteção',
        'Tem certeza que deseja remover a proteção por PIN?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setPinProtectionEnabled(true),
          },
          {
            text: 'Confirmar',
            style: 'destructive',
            onPress: handleRemovePin,
          },
        ]
      );
    }
    setPinProtectionEnabled(value);
  };

  const handleRemovePin = async () => {
    try {
      await StorageService.setPinProtection(null);
      setPinProtectionEnabled(false);
      setShowPinInput(false);
      setPin('');
      setConfirmPin('');
      Alert.alert('Sucesso', 'Proteção por PIN removida com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a proteção por PIN');
      setPinProtectionEnabled(true);
    }
  };

  const validatePin = (value: string) => {
    return /^\d{4,6}$/.test(value);
  };

  const handleSavePin = async () => {
    if (!validatePin(pin)) {
      Alert.alert('Erro', 'O PIN deve ter entre 4 e 6 dígitos');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Erro', 'Os PINs não coincidem');
      return;
    }

    try {
      await StorageService.setPinProtection(pin);
      Alert.alert('Sucesso', 'PIN configurado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o PIN');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações de Segurança</Text>

        <View style={styles.section}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Proteção por PIN</Text>
            <Switch
              value={pinProtectionEnabled}
              onValueChange={handleTogglePinProtection}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={pinProtectionEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {showPinInput && (
            <View style={styles.pinSection}>
              <Text style={styles.pinLabel}>Digite um PIN de 4 a 6 dígitos</Text>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                placeholder="Digite o PIN"
              />
              <TextInput
                style={styles.pinInput}
                value={confirmPin}
                onChangeText={setConfirmPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                placeholder="Confirme o PIN"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSavePin}
              >
                <Text style={styles.buttonText}>Salvar PIN</Text>
              </TouchableOpacity>
            </View>
          )}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  pinSection: {
    marginTop: 20,
  },
  pinLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pinInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecuritySettingsScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSecurity } from '../../contexts/SecurityContext';
import { StorageService } from '../../services/StorageService';

const ConfiguracoesScreen = ({ navigation }) => {
  const { hasPin, removePin } = useSecurity();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [notificacoesEnabled, setNotificacoesEnabled] = useState(true);
  const [estoqueEnabled, setEstoqueEnabled] = useState(true);

  useEffect(() => {
    setPinEnabled(hasPin);
  }, [hasPin]);

  const handleTogglePin = async (value: boolean) => {
    if (value) {
      navigation.navigate('ConfigurarPin', {
        onSuccess: () => setPinEnabled(true)
      });
    } else {
      Alert.alert(
        'Remover PIN',
        'Tem certeza que deseja remover a proteção por PIN?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                await removePin();
                setPinEnabled(false);
                Alert.alert('Sucesso', 'PIN removido com sucesso!');
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível remover o PIN');
                setPinEnabled(true);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Proteção por PIN</Text>
              <Text style={styles.settingDescription}>
                Solicitar PIN para ações importantes
              </Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={handleTogglePin}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={pinEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {pinEnabled && (
            <TouchableOpacity
              style={styles.alterarPinButton}
              onPress={() => navigation.navigate('ConfigurarPin')}
            >
              <Text style={styles.alterarPinText}>Alterar PIN</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Lembretes</Text>
              <Text style={styles.settingDescription}>
                Notificações de medicamentos
              </Text>
            </View>
            <Switch
              value={notificacoesEnabled}
              onValueChange={setNotificacoesEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificacoesEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estoque</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Alertas de Estoque</Text>
              <Text style={styles.settingDescription}>
                Avisos de estoque baixo
              </Text>
            </View>
            <Switch
              value={estoqueEnabled}
              onValueChange={setEstoqueEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={estoqueEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate('Ajuda')}
        >
          <Text style={styles.helpButtonText}>Ajuda e Suporte</Text>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  helpButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alterarPinButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  alterarPinText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ConfiguracoesScreen;

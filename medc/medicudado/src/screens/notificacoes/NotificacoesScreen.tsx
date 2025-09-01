import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationService, NotificationSettings } from '../../services/NotificationService';

const NotificacoesScreen = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    medicationReminders: true,
    lowStockAlerts: true,
    silentHours: {
      enabled: false,
      start: "22:00",
      end: "07:00"
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const currentSettings = NotificationService.getSettings();
    setSettings(currentSettings);
  };

  const handleSaveSettings = async () => {
    try {
      await NotificationService.saveSettings(settings);
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar configurações');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Configurações de Notificações</Text>

        <View style={styles.section}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Lembretes de Medicamentos</Text>
            <Switch
              value={settings.medicationReminders}
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, medicationReminders: value }))
              }
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.medicationReminders ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alertas de Estoque Baixo</Text>
            <Switch
              value={settings.lowStockAlerts}
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, lowStockAlerts: value }))
              }
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.lowStockAlerts ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horário Silencioso</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Ativar</Text>
            <Switch
              value={settings.silentHours.enabled}
              onValueChange={(value) => 
                setSettings(prev => ({
                  ...prev,
                  silentHours: { ...prev.silentHours, enabled: value }
                }))
              }
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.silentHours.enabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {settings.silentHours.enabled && (
            <View style={styles.timeContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Início</Text>
                <TextInput
                  style={styles.input}
                  value={settings.silentHours.start}
                  onChangeText={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      silentHours: { ...prev.silentHours, start: value }
                    }))
                  }
                  placeholder="22:00"
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Fim</Text>
                <TextInput
                  style={styles.input}
                  value={settings.silentHours.end}
                  onChangeText={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      silentHours: { ...prev.silentHours, end: value }
                    }))
                  }
                  placeholder="07:00"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
          <Text style={styles.buttonText}>Salvar Configurações</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificacoesScreen;

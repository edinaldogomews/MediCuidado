import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Alarme, Medicamento } from '../types';

const NOTIFICATION_SETTINGS_KEY = '@medicudado:notificationSettings';

export interface NotificationSettings {
  medicationReminders: boolean;
  lowStockAlerts: boolean;
  silentHours: {
    enabled: boolean;
    start: string; // formato "HH:mm"
    end: string; // formato "HH:mm"
  };
}

class NotificationManager {
  private static instance: NotificationManager;
  private settings: NotificationSettings = {
    medicationReminders: true,
    lowStockAlerts: true,
    silentHours: {
      enabled: false,
      start: "22:00",
      end: "07:00"
    }
  };

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async loadSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificação:', error);
    }
  }

  public async saveSettings(settings: NotificationSettings) {
    try {
      this.settings = settings;
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de notificação:', error);
      throw error;
    }
  }

  public getSettings(): NotificationSettings {
    return this.settings;
  }

  public async scheduleReminder(medicamento: Medicamento) {
    if (!this.settings.medicationReminders) return;

    try {
      // Aqui será implementada a lógica de agendamento de notificações
      // quando tivermos a biblioteca expo-notifications instalada
      console.log('Agendando lembrete para:', medicamento.nome);
    } catch (error) {
      console.error('Erro ao agendar lembrete:', error);
      throw error;
    }
  }

  public async checkLowStock(medicamento: Medicamento) {
    if (!this.settings.lowStockAlerts) return;

    const { quantidade, alertaQuandoAbaixoDe } = medicamento.estoque;
    if (alertaQuandoAbaixoDe && quantidade <= alertaQuandoAbaixoDe) {
      try {
        // Aqui será implementada a notificação de estoque baixo
        // quando tivermos a biblioteca expo-notifications instalada
        console.log('Estoque baixo para:', medicamento.nome);
      } catch (error) {
        console.error('Erro ao notificar estoque baixo:', error);
        throw error;
      }
    }
  }

  public async cancelReminders(medicamentoId: string) {
    try {
      // Aqui será implementado o cancelamento de notificações
      // quando tivermos a biblioteca expo-notifications instalada
      console.log('Cancelando lembretes para medicamento:', medicamentoId);
    } catch (error) {
      console.error('Erro ao cancelar lembretes:', error);
      throw error;
    }
  }

  public isWithinSilentHours(time: string): boolean {
    if (!this.settings.silentHours.enabled) return false;

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const currentTime = now.setHours(hours, minutes, 0, 0);

    const [startHours, startMinutes] = this.settings.silentHours.start.split(':').map(Number);
    const [endHours, endMinutes] = this.settings.silentHours.end.split(':').map(Number);

    const startTime = new Date().setHours(startHours, startMinutes, 0, 0);
    const endTime = new Date().setHours(endHours, endMinutes, 0, 0);

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }
}

export const NotificationService = NotificationManager.getInstance();

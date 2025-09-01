import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicamento, Alarme } from '../types';

const MEDICAMENTOS_KEY = '@medicudado:medicamentos';
const ALARMES_KEY = '@medicudado:alarmes';

export const StorageService = {
  async saveMedicamento(medicamento: Medicamento): Promise<void> {
    try {
      const medicamentos = await this.getMedicamentos();
      medicamentos.push(medicamento);
      await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentos));
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
      throw error;
    }
  },

  async getMedicamentos(): Promise<Medicamento[]> {
    try {
      const data = await AsyncStorage.getItem(MEDICAMENTOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      return [];
    }
  },

  async saveAlarme(alarme: Alarme): Promise<void> {
    try {
      const alarmes = await this.getAlarmes();
      alarmes.push(alarme);
      await AsyncStorage.setItem(ALARMES_KEY, JSON.stringify(alarmes));
    } catch (error) {
      console.error('Erro ao salvar alarme:', error);
      throw error;
    }
  },

  async getAlarmes(): Promise<Alarme[]> {
    try {
      const data = await AsyncStorage.getItem(ALARMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar alarmes:', error);
      return [];
    }
  },

  async updateMedicamentoStatus(medicamentoId: string, status: string): Promise<void> {
    try {
      const medicamentos = await this.getMedicamentos();
      const index = medicamentos.findIndex(m => m.id === medicamentoId);
      if (index !== -1) {
        medicamentos[index] = { ...medicamentos[index], status };
        await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentos));
      }
    } catch (error) {
      console.error('Erro ao atualizar status do medicamento:', error);
      throw error;
    }
  },

  async atualizarMedicamentos(medicamentos: Medicamento[]): Promise<void> {
    try {
      await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentos));
    } catch (error) {
      console.error('Erro ao atualizar medicamentos:', error);
      throw error;
    }
  },

  async atualizarEstoque(medicamentoId: string, novaQuantidade: number): Promise<void> {
    try {
      const medicamentos = await this.getMedicamentos();
      const index = medicamentos.findIndex(m => m.id === medicamentoId);

      if (index !== -1) {
        medicamentos[index].estoque.quantidade = novaQuantidade;
        await this.atualizarMedicamentos(medicamentos);
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }
};

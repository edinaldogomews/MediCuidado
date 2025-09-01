import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medicamento, Alarme, Perfil, PerfilIdoso, PerfilCuidador } from '../types';

const MEDICAMENTOS_KEY = '@medicudado:medicamentos';
const ALARMES_KEY = '@medicudado:alarmes';
const PERFIS_KEY = '@medicudado:perfis';
const PERFIL_ATIVO_KEY = '@medicudado:perfilAtivo';
const USER_TYPE_KEY = '@medicudado:userType';
const PIN_PROTECTION_KEY = '@medicudado:pinProtection';

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
  },

  async salvarPerfil(perfil: Perfil): Promise<void> {
    try {
      const perfis = await this.getPerfis();
      const index = perfis.findIndex(p => p.id === perfil.id);

      if (index !== -1) {
        perfis[index] = perfil;
      } else {
        perfis.push(perfil);
      }

      await AsyncStorage.setItem(PERFIS_KEY, JSON.stringify(perfis));
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw error;
    }
  },

  async getPerfis(): Promise<Perfil[]> {
    try {
      const data = await AsyncStorage.getItem(PERFIS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar perfis:', error);
      return [];
    }
  },

  async getPerfilAtivo(): Promise<Perfil | null> {
    try {
      const perfilId = await AsyncStorage.getItem(PERFIL_ATIVO_KEY);
      if (!perfilId) return null;

      const perfis = await this.getPerfis();
      return perfis.find(p => p.id === perfilId) || null;
    } catch (error) {
      console.error('Erro ao buscar perfil ativo:', error);
      return null;
    }
  },

  async setPerfilAtivo(perfilId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(PERFIL_ATIVO_KEY, perfilId);
    } catch (error) {
      console.error('Erro ao definir perfil ativo:', error);
      throw error;
    }
  },

  async getUserType(): Promise<'idoso' | 'cuidador' | null> {
    try {
      const type = await AsyncStorage.getItem(USER_TYPE_KEY);
      return type as 'idoso' | 'cuidador' | null;
    } catch (error) {
      console.error('Erro ao buscar tipo de usuário:', error);
      return null;
    }
  },

  async setUserType(type: 'idoso' | 'cuidador'): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_TYPE_KEY, type);
    } catch (error) {
      console.error('Erro ao salvar tipo de usuário:', error);
      throw error;
    }
  },

  async clearUserType(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_TYPE_KEY);
    } catch (error) {
      console.error('Erro ao limpar tipo de usuário:', error);
      throw error;
    }
  },

  async setPinProtection(pin: string | null): Promise<void> {
    try {
      if (pin) {
        await AsyncStorage.setItem(PIN_PROTECTION_KEY, pin);
      } else {
        await AsyncStorage.removeItem(PIN_PROTECTION_KEY);
      }
    } catch (error) {
      console.error('Erro ao configurar proteção por PIN:', error);
      throw error;
    }
  },

  async getPin(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PIN_PROTECTION_KEY);
    } catch (error) {
      console.error('Erro ao buscar PIN:', error);
      return null;
    }
  },

  async hasPinProtection(): Promise<boolean> {
    const pin = await this.getPin();
    return pin !== null;
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMES_KEY = '@medicudado:alarmes';
const MEDICAMENTOS_KEY = '@medicudado:medicamentos';

export const StorageService = {
  // Alarm methods
  async getAlarmes() {
    try {
      const data = await AsyncStorage.getItem(ALARMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar alarmes:', error);
      return [];
    }
  },

  async saveAlarme(alarme) {
    try {
      const alarmes = await this.getAlarmes();
      alarmes.push(alarme);
      await AsyncStorage.setItem(ALARMES_KEY, JSON.stringify(alarmes));
    } catch (error) {
      console.error('Erro ao salvar alarme:', error);
      throw error;
    }
  },

  async updateAlarmeStatus(alarmeId, status) {
    try {
      const alarmes = await this.getAlarmes();
      const index = alarmes.findIndex(a => a.id === alarmeId);
      if (index !== -1) {
        alarmes[index] = { ...alarmes[index], status };
        await AsyncStorage.setItem(ALARMES_KEY, JSON.stringify(alarmes));
      }
    } catch (error) {
      console.error('Erro ao atualizar status do alarme:', error);
      throw error;
    }
  },

  async deleteAlarme(alarmeId) {
    try {
      const alarmes = await this.getAlarmes();
      const alarmesFiltrados = alarmes.filter(a => a.id !== alarmeId);
      await AsyncStorage.setItem(ALARMES_KEY, JSON.stringify(alarmesFiltrados));
    } catch (error) {
      console.error('Erro ao deletar alarme:', error);
      throw error;
    }
  },

  // Medication methods
  async getMedicamentos() {
    try {
      const data = await AsyncStorage.getItem(MEDICAMENTOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      return [];
    }
  },

  async saveMedicamento(medicamento) {
    try {
      const medicamentos = await this.getMedicamentos();
      medicamentos.push(medicamento);
      await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentos));
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
      throw error;
    }
  },

  async updateMedicamento(medicamentoId, updates) {
    try {
      const medicamentos = await this.getMedicamentos();
      const index = medicamentos.findIndex(m => m.id === medicamentoId);
      if (index !== -1) {
        medicamentos[index] = { ...medicamentos[index], ...updates };
        await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentos));
      }
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
      throw error;
    }
  },

  async deleteMedicamento(medicamentoId) {
    try {
      const medicamentos = await this.getMedicamentos();
      const medicamentosFiltrados = medicamentos.filter(m => m.id !== medicamentoId);
      await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentosFiltrados));
    } catch (error) {
      console.error('Erro ao deletar medicamento:', error);
      throw error;
    }
  },

  // Estoque methods
  async getEstoque() {
    try {
      const data = await AsyncStorage.getItem(MEDICAMENTOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      return [];
    }
  },

  async updateEstoque(estoqueAtualizado) {
    try {
      await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(estoqueAtualizado));
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  },

  async adicionarEntradaEstoque(medicamentoId, quantidade) {
    try {
      const medicamentos = await this.getMedicamentos();
      const index = medicamentos.findIndex(m => m.id === medicamentoId);
      if (index !== -1) {
        medicamentos[index].quantidade = (medicamentos[index].quantidade || 0) + quantidade;
        await AsyncStorage.setItem(MEDICAMENTOS_KEY, JSON.stringify(medicamentos));
        return medicamentos[index];
      }
      throw new Error('Medicamento não encontrado');
    } catch (error) {
      console.error('Erro ao adicionar entrada ao estoque:', error);
      throw error;
    }
  }
};

// 📦 SERVIÇO DE ESTOQUE - EstoqueService.js
// Integra o banco de dados fake com a aplicação

import fakeDatabase from '../database/FakeDatabase';

export class EstoqueService {
  // ========== OBTER DADOS ==========

  /**
   * Obter todo o estoque
   * @returns {Array} Array com todos os itens de estoque
   */
  static async getEstoque() {
    try {
      return fakeDatabase.getAllEstoque();
    } catch (error) {
      console.error('Erro ao obter estoque:', error);
      throw error;
    }
  }

  /**
   * Obter estoque de um medicamento específico
   * @param {number} medicamentoId - ID do medicamento
   * @returns {Object} Objeto com dados do estoque
   */
  static async getEstoqueByMedicamentoId(medicamentoId) {
    try {
      return fakeDatabase.getEstoqueByMedicamentoId(medicamentoId);
    } catch (error) {
      console.error('Erro ao obter estoque do medicamento:', error);
      throw error;
    }
  }

  // ========== ADICIONAR/ATUALIZAR ==========

  /**
   * Adicionar entrada de medicamento ao estoque
   * @param {number} medicamentoId - ID do medicamento
   * @param {number} quantidade - Quantidade a adicionar
   * @param {string} motivo - Motivo da entrada
   * @returns {Object} Estoque atualizado
   */
  static async adicionarEntrada(medicamentoId, quantidade, motivo = 'Entrada') {
    try {
      // Atualizar estoque
      const estoque = fakeDatabase.adicionarQuantidade(medicamentoId, quantidade);

      if (!estoque) {
        throw new Error('Medicamento não encontrado no estoque');
      }

      // Registrar movimentação
      fakeDatabase.addMovimentacao({
        medicamentoId,
        tipo: 'entrada',
        quantidade,
        data: new Date().toISOString().split('T')[0],
        usuario: 'Sistema',
        motivo,
      });

      return estoque;
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      throw error;
    }
  }

  /**
   * Remover saída de medicamento do estoque
   * @param {number} medicamentoId - ID do medicamento
   * @param {number} quantidade - Quantidade a remover
   * @param {string} motivo - Motivo da saída
   * @returns {Object} Estoque atualizado
   */
  static async adicionarSaida(medicamentoId, quantidade, motivo = 'Saída') {
    try {
      const estoque = fakeDatabase.removerQuantidade(medicamentoId, quantidade);

      if (!estoque) {
        throw new Error('Quantidade insuficiente ou medicamento não encontrado');
      }

      // Registrar movimentação
      fakeDatabase.addMovimentacao({
        medicamentoId,
        tipo: 'saida',
        quantidade,
        data: new Date().toISOString().split('T')[0],
        usuario: 'Sistema',
        motivo,
      });

      return estoque;
    } catch (error) {
      console.error('Erro ao adicionar saída:', error);
      throw error;
    }
  }

  /**
   * Atualizar estoque completo
   * @param {Array} estoqueAtualizado - Array com dados atualizados
   * @returns {Array} Estoque atualizado
   */
  static async updateEstoque(estoqueAtualizado) {
    try {
      // Atualizar cada item
      estoqueAtualizado.forEach(item => {
        fakeDatabase.updateEstoque(item.id, item);
      });
      return estoqueAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }

  // ========== VALIDAÇÕES ==========

  /**
   * Verificar se estoque está baixo
   * @param {number} medicamentoId - ID do medicamento
   * @returns {boolean} True se estoque está baixo
   */
  static async isEstoqueBaixo(medicamentoId) {
    try {
      const estoque = fakeDatabase.getEstoqueByMedicamentoId(medicamentoId);
      if (!estoque) return false;
      return estoque.quantidade <= estoque.minimo;
    } catch (error) {
      console.error('Erro ao verificar estoque baixo:', error);
      return false;
    }
  }

  /**
   * Verificar se medicamento está vencendo
   * @param {number} medicamentoId - ID do medicamento
   * @returns {boolean} True se está vencendo
   */
  static async isVencendo(medicamentoId) {
    try {
      const estoque = fakeDatabase.getEstoqueByMedicamentoId(medicamentoId);
      if (!estoque) return false;

      const dataVencimento = new Date(estoque.vencimento);
      const hoje = new Date();
      const diasRestantes = Math.floor((dataVencimento - hoje) / (1000 * 60 * 60 * 24));

      return diasRestantes <= 30; // Vencendo em 30 dias
    } catch (error) {
      console.error('Erro ao verificar vencimento:', error);
      return false;
    }
  }

  /**
   * Obter status do estoque
   * @param {number} medicamentoId - ID do medicamento
   * @returns {string} Status: 'normal', 'baixo' ou 'vencendo'
   */
  static async getStatus(medicamentoId) {
    try {
      const estoque = fakeDatabase.getEstoqueByMedicamentoId(medicamentoId);
      if (!estoque) return 'desconhecido';

      const isBaixo = estoque.quantidade <= estoque.minimo;
      const isVencendo = await this.isVencendo(medicamentoId);

      if (isVencendo) return 'vencendo';
      if (isBaixo) return 'baixo';
      return 'normal';
    } catch (error) {
      console.error('Erro ao obter status:', error);
      return 'desconhecido';
    }
  }

  // ========== RELATÓRIOS ==========

  /**
   * Obter resumo do estoque
   * @returns {Object} Resumo com totais
   */
  static async getResumo() {
    try {
      const estoque = fakeDatabase.getAllEstoque();
      const baixo = estoque.filter(e => e.quantidade <= e.minimo).length;
      const vencendo = estoque.filter(e => {
        const dataVencimento = new Date(e.vencimento);
        const hoje = new Date();
        const diasRestantes = Math.floor((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 30;
      }).length;

      return {
        total: estoque.length,
        estoqueBaixo: baixo,
        vencendo: vencendo,
        normal: estoque.length - baixo - vencendo,
      };
    } catch (error) {
      console.error('Erro ao obter resumo:', error);
      throw error;
    }
  }

  /**
   * Obter movimentações de um medicamento
   * @param {number} medicamentoId - ID do medicamento
   * @returns {Array} Array com movimentações
   */
  static async getMovimentacoes(medicamentoId) {
    try {
      const movimentacoes = fakeDatabase.getAllMovimentacoes();
      return movimentacoes.filter(m => m.medicamentoId === medicamentoId);
    } catch (error) {
      console.error('Erro ao obter movimentações:', error);
      throw error;
    }
  }

  // ========== ALERTAS ==========

  /**
   * Obter alertas não lidos
   * @returns {Array} Array com alertas
   */
  static async getAlertasNaoLidos() {
    try {
      return fakeDatabase.getAlertasNaoLidos();
    } catch (error) {
      console.error('Erro ao obter alertas:', error);
      throw error;
    }
  }

  /**
   * Marcar alerta como lido
   * @param {number} alertaId - ID do alerta
   * @returns {Object} Alerta atualizado
   */
  static async marcarAlertaComoLido(alertaId) {
    try {
      return fakeDatabase.marcarAlertaComoLido(alertaId);
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);
      throw error;
    }
  }
}

export default EstoqueService;


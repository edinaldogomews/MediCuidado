// 💊 SERVIÇO DE MEDICAMENTOS - MedicamentoService.js
// Gerencia operações com medicamentos

import fakeDatabase from '../database/FakeDatabase';

export class MedicamentoService {
  // ========== OBTER DADOS ==========

  /**
   * Obter todos os medicamentos
   * @returns {Array} Array com todos os medicamentos
   */
  static async getAllMedicamentos() {
    try {
      return fakeDatabase.getAllMedicamentos();
    } catch (error) {
      console.error('Erro ao obter medicamentos:', error);
      throw error;
    }
  }

  /**
   * Obter medicamento por ID
   * @param {number} id - ID do medicamento
   * @returns {Object} Objeto com dados do medicamento
   */
  static async getMedicamentoById(id) {
    try {
      return fakeDatabase.getMedicamentoById(id);
    } catch (error) {
      console.error('Erro ao obter medicamento:', error);
      throw error;
    }
  }

  /**
   * Obter medicamentos por categoria
   * @param {string} categoria - Categoria do medicamento
   * @returns {Array} Array com medicamentos da categoria
   */
  static async getMedicamentosByCategoria(categoria) {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      return medicamentos.filter(m => m.categoria === categoria);
    } catch (error) {
      console.error('Erro ao obter medicamentos por categoria:', error);
      throw error;
    }
  }

  /**
   * Obter medicamentos ativos
   * @returns {Array} Array com medicamentos ativos
   */
  static async getMedicamentosAtivos() {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      return medicamentos.filter(m => m.ativo);
    } catch (error) {
      console.error('Erro ao obter medicamentos ativos:', error);
      throw error;
    }
  }

  // ========== CRIAR/ATUALIZAR ==========

  /**
   * Adicionar novo medicamento
   * @param {Object} medicamento - Dados do medicamento
   * @returns {Object} Medicamento criado
   */
  static async addMedicamento(medicamento) {
    try {
      // Validar dados obrigatórios
      if (!medicamento.nome || !medicamento.dosagem) {
        throw new Error('Nome e dosagem são obrigatórios');
      }

      const novoMedicamento = fakeDatabase.addMedicamento({
        nome: medicamento.nome,
        descricao: medicamento.descricao || '',
        dosagem: medicamento.dosagem,
        fabricante: medicamento.fabricante || 'Genérico',
        preco: medicamento.preco || 0,
        categoria: medicamento.categoria || 'Geral',
        ativo: true,
      });

      return novoMedicamento;
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
      throw error;
    }
  }

  /**
   * Atualizar medicamento
   * @param {number} id - ID do medicamento
   * @param {Object} dados - Dados a atualizar
   * @returns {Object} Medicamento atualizado
   */
  static async updateMedicamento(id, dados) {
    try {
      const medicamento = fakeDatabase.updateMedicamento(id, dados);
      if (!medicamento) {
        throw new Error('Medicamento não encontrado');
      }
      return medicamento;
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
      throw error;
    }
  }

  /**
   * Deletar medicamento
   * @param {number} id - ID do medicamento
   * @returns {boolean} True se deletado com sucesso
   */
  static async deleteMedicamento(id) {
    try {
      return fakeDatabase.deleteMedicamento(id);
    } catch (error) {
      console.error('Erro ao deletar medicamento:', error);
      throw error;
    }
  }

  // ========== BUSCA E FILTRO ==========

  /**
   * Buscar medicamentos por nome
   * @param {string} nome - Nome ou parte do nome
   * @returns {Array} Array com medicamentos encontrados
   */
  static async buscarPorNome(nome) {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      return medicamentos.filter(m =>
        m.nome.toLowerCase().includes(nome.toLowerCase())
      );
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      throw error;
    }
  }

  /**
   * Obter categorias disponíveis
   * @returns {Array} Array com categorias únicas
   */
  static async getCategorias() {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      const categorias = [...new Set(medicamentos.map(m => m.categoria))];
      return categorias;
    } catch (error) {
      console.error('Erro ao obter categorias:', error);
      throw error;
    }
  }

  /**
   * Obter fabricantes disponíveis
   * @returns {Array} Array com fabricantes únicos
   */
  static async getFabricantes() {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      const fabricantes = [...new Set(medicamentos.map(m => m.fabricante))];
      return fabricantes;
    } catch (error) {
      console.error('Erro ao obter fabricantes:', error);
      throw error;
    }
  }

  // ========== RELATÓRIOS ==========

  /**
   * Obter resumo de medicamentos
   * @returns {Object} Resumo com totais
   */
  static async getResumo() {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      const ativos = medicamentos.filter(m => m.ativo).length;
      const inativos = medicamentos.length - ativos;

      return {
        total: medicamentos.length,
        ativos,
        inativos,
        categorias: await this.getCategorias(),
      };
    } catch (error) {
      console.error('Erro ao obter resumo:', error);
      throw error;
    }
  }

  /**
   * Obter medicamentos com preço
   * @returns {Array} Array com medicamentos e preços
   */
  static async getMedicamentosComPreco() {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      return medicamentos.map(m => ({
        ...m,
        precoFormatado: `R$ ${m.preco.toFixed(2)}`,
      }));
    } catch (error) {
      console.error('Erro ao obter medicamentos com preço:', error);
      throw error;
    }
  }

  /**
   * Calcular valor total do estoque
   * @returns {number} Valor total
   */
  static async getValorTotalEstoque() {
    try {
      const medicamentos = fakeDatabase.getAllMedicamentos();
      const estoque = fakeDatabase.getAllEstoque();

      let total = 0;
      estoque.forEach(item => {
        const medicamento = medicamentos.find(m => m.id === item.medicamentoId);
        if (medicamento) {
          total += medicamento.preco * item.quantidade;
        }
      });

      return total;
    } catch (error) {
      console.error('Erro ao calcular valor total:', error);
      throw error;
    }
  }

  // ========== VALIDAÇÕES ==========

  /**
   * Validar dados do medicamento
   * @param {Object} medicamento - Dados do medicamento
   * @returns {Object} Objeto com validação
   */
  static validarMedicamento(medicamento) {
    const erros = [];

    if (!medicamento.nome || medicamento.nome.trim() === '') {
      erros.push('Nome é obrigatório');
    }

    if (!medicamento.dosagem || medicamento.dosagem.trim() === '') {
      erros.push('Dosagem é obrigatória');
    }

    if (medicamento.preco && medicamento.preco < 0) {
      erros.push('Preço não pode ser negativo');
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  }
}

export default MedicamentoService;


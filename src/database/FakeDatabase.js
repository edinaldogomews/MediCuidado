// 🗄️ BANCO DE DADOS FAKE - FakeDatabase.js
// Este arquivo simula um banco de dados real com dados persistentes

class FakeDatabase {
  constructor() {
    // Dados de medicamentos
    this.medicamentos = [
      {
        id: 1,
        nome: 'Losartana 50mg',
        descricao: 'Medicamento para pressão alta',
        dosagem: '50mg',
        fabricante: 'Genérico',
        preco: 15.50,
        categoria: 'Cardiovascular',
        ativo: true,
      },
      {
        id: 2,
        nome: 'Metformina 850mg',
        descricao: 'Medicamento para diabetes',
        dosagem: '850mg',
        fabricante: 'Genérico',
        preco: 12.00,
        categoria: 'Endocrinologia',
        ativo: true,
      },
      {
        id: 3,
        nome: 'Sinvastatina 20mg',
        descricao: 'Medicamento para colesterol',
        dosagem: '20mg',
        fabricante: 'Genérico',
        preco: 18.75,
        categoria: 'Cardiovascular',
        ativo: true,
      },
      {
        id: 4,
        nome: 'Omeprazol 20mg',
        descricao: 'Medicamento para ácido gástrico',
        dosagem: '20mg',
        fabricante: 'Genérico',
        preco: 10.50,
        categoria: 'Gastrointestinal',
        ativo: true,
      },
      {
        id: 5,
        nome: 'Dipirona 500mg',
        descricao: 'Analgésico e antitérmico',
        dosagem: '500mg',
        fabricante: 'Genérico',
        preco: 5.00,
        categoria: 'Analgésico',
        ativo: true,
      },
    ];

    // Dados de estoque
    this.estoque = [
      {
        id: 1,
        medicamentoId: 1,
        medicamento: 'Losartana 50mg',
        quantidade: 30,
        minimo: 10,
        maximo: 100,
        vencimento: '2025-12-15',
        status: 'normal',
        lote: 'LOTE001',
        dataEntrada: '2024-10-22',
      },
      {
        id: 2,
        medicamentoId: 2,
        medicamento: 'Metformina 850mg',
        quantidade: 5,
        minimo: 15,
        maximo: 80,
        vencimento: '2025-11-20',
        status: 'baixo',
        lote: 'LOTE002',
        dataEntrada: '2024-10-22',
      },
      {
        id: 3,
        medicamentoId: 3,
        medicamento: 'Sinvastatina 20mg',
        quantidade: 20,
        minimo: 10,
        maximo: 90,
        vencimento: '2025-10-05',
        status: 'vencendo',
        lote: 'LOTE003',
        dataEntrada: '2024-10-22',
      },
      {
        id: 4,
        medicamentoId: 4,
        medicamento: 'Omeprazol 20mg',
        quantidade: 45,
        minimo: 20,
        maximo: 120,
        vencimento: '2025-11-30',
        status: 'normal',
        lote: 'LOTE004',
        dataEntrada: '2024-10-22',
      },
      {
        id: 5,
        medicamentoId: 5,
        medicamento: 'Dipirona 500mg',
        quantidade: 60,
        minimo: 30,
        maximo: 150,
        vencimento: '2025-12-10',
        status: 'normal',
        lote: 'LOTE005',
        dataEntrada: '2024-10-22',
      },
    ];

    // Histórico de movimentações
    this.movimentacoes = [
      {
        id: 1,
        medicamentoId: 1,
        tipo: 'entrada',
        quantidade: 30,
        data: '2024-10-22',
        usuario: 'Admin',
        motivo: 'Compra inicial',
      },
      {
        id: 2,
        medicamentoId: 2,
        tipo: 'saida',
        quantidade: 10,
        data: '2024-10-21',
        usuario: 'Farmacêutico',
        motivo: 'Dispensação',
      },
    ];

    // Alertas
    this.alertas = [
      {
        id: 1,
        medicamentoId: 2,
        tipo: 'estoque_baixo',
        mensagem: 'Metformina com estoque baixo',
        data: '2024-10-22',
        lido: false,
      },
      {
        id: 2,
        medicamentoId: 3,
        tipo: 'vencimento_proximo',
        mensagem: 'Sinvastatina vencendo em breve',
        data: '2024-10-22',
        lido: false,
      },
    ];
  }

  // ========== MEDICAMENTOS ==========

  // Obter todos os medicamentos
  getAllMedicamentos() {
    return this.medicamentos;
  }

  // Obter medicamento por ID
  getMedicamentoById(id) {
    return this.medicamentos.find(m => m.id === id);
  }

  // Adicionar novo medicamento
  addMedicamento(medicamento) {
    const novoId = Math.max(...this.medicamentos.map(m => m.id), 0) + 1;
    const novoMedicamento = { id: novoId, ...medicamento };
    this.medicamentos.push(novoMedicamento);
    return novoMedicamento;
  }

  // Atualizar medicamento
  updateMedicamento(id, dados) {
    const index = this.medicamentos.findIndex(m => m.id === id);
    if (index !== -1) {
      this.medicamentos[index] = { ...this.medicamentos[index], ...dados };
      return this.medicamentos[index];
    }
    return null;
  }

  // Deletar medicamento
  deleteMedicamento(id) {
    this.medicamentos = this.medicamentos.filter(m => m.id !== id);
    return true;
  }

  // ========== ESTOQUE ==========

  // Obter todo o estoque
  getAllEstoque() {
    return this.estoque;
  }

  // Obter item de estoque por ID
  getEstoqueById(id) {
    return this.estoque.find(e => e.id === id);
  }

  // Obter estoque por medicamento ID
  getEstoqueByMedicamentoId(medicamentoId) {
    return this.estoque.find(e => e.medicamentoId === medicamentoId);
  }

  // Adicionar entrada de estoque
  addEstoque(estoque) {
    const novoId = Math.max(...this.estoque.map(e => e.id), 0) + 1;
    const novoEstoque = { id: novoId, ...estoque };
    this.estoque.push(novoEstoque);
    return novoEstoque;
  }

  // Atualizar estoque
  updateEstoque(id, dados) {
    const index = this.estoque.findIndex(e => e.id === id);
    if (index !== -1) {
      this.estoque[index] = { ...this.estoque[index], ...dados };
      return this.estoque[index];
    }
    return null;
  }

  // Adicionar quantidade ao estoque
  adicionarQuantidade(medicamentoId, quantidade) {
    const estoque = this.getEstoqueByMedicamentoId(medicamentoId);
    if (estoque) {
      estoque.quantidade += quantidade;
      return estoque;
    }
    return null;
  }

  // Remover quantidade do estoque
  removerQuantidade(medicamentoId, quantidade) {
    const estoque = this.getEstoqueByMedicamentoId(medicamentoId);
    if (estoque && estoque.quantidade >= quantidade) {
      estoque.quantidade -= quantidade;
      return estoque;
    }
    return null;
  }

  // ========== MOVIMENTAÇÕES ==========

  // Obter todas as movimentações
  getAllMovimentacoes() {
    return this.movimentacoes;
  }

  // Adicionar movimentação
  addMovimentacao(movimentacao) {
    const novoId = Math.max(...this.movimentacoes.map(m => m.id), 0) + 1;
    const novaMovimentacao = { id: novoId, ...movimentacao };
    this.movimentacoes.push(novaMovimentacao);
    return novaMovimentacao;
  }

  // ========== ALERTAS ==========

  // Obter todos os alertas
  getAllAlertas() {
    return this.alertas;
  }

  // Obter alertas não lidos
  getAlertasNaoLidos() {
    return this.alertas.filter(a => !a.lido);
  }

  // Marcar alerta como lido
  marcarAlertaComoLido(id) {
    const alerta = this.alertas.find(a => a.id === id);
    if (alerta) {
      alerta.lido = true;
      return alerta;
    }
    return null;
  }

  // Adicionar alerta
  addAlerta(alerta) {
    const novoId = Math.max(...this.alertas.map(a => a.id), 0) + 1;
    const novoAlerta = { id: novoId, ...alerta };
    this.alertas.push(novoAlerta);
    return novoAlerta;
  }

  // ========== UTILITÁRIOS ==========

  // Limpar todos os dados
  clearAll() {
    this.medicamentos = [];
    this.estoque = [];
    this.movimentacoes = [];
    this.alertas = [];
  }

  // Resetar para dados iniciais
  reset() {
    this.clearAll();
    // Reinicializar com dados padrão
    this.constructor.call(this);
  }

  // Exportar dados
  exportarDados() {
    return {
      medicamentos: this.medicamentos,
      estoque: this.estoque,
      movimentacoes: this.movimentacoes,
      alertas: this.alertas,
    };
  }

  // Importar dados
  importarDados(dados) {
    if (dados.medicamentos) this.medicamentos = dados.medicamentos;
    if (dados.estoque) this.estoque = dados.estoque;
    if (dados.movimentacoes) this.movimentacoes = dados.movimentacoes;
    if (dados.alertas) this.alertas = dados.alertas;
  }
}

// Criar instância única (Singleton)
const fakeDatabase = new FakeDatabase();

export default fakeDatabase;


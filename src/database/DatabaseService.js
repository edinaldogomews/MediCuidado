// 🗄️ BANCO DE DADOS SQLite - DatabaseService.js
// Serviço de banco de dados usando Expo SQLite

import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Inicializa o banco de dados e cria as tabelas
   */
  async init() {
    // Se já está inicializado, retorna
    if (this.isInitialized && this.db) {
      return;
    }

    // Se já está inicializando, aguarda a promise existente
    if (this.initPromise) {
      return this.initPromise;
    }

    // Cria uma nova promise de inicialização
    this.initPromise = (async () => {
      try {
        console.log('🔄 Inicializando banco de dados...');

        // Abre ou cria o banco de dados
        this.db = await SQLite.openDatabaseAsync('medicuidado.db');

        // Cria as tabelas
        await this.createTables();

        // Insere dados iniciais se necessário
        await this.insertInitialData();

        // Migra dados antigos de alarmes (objeto → array)
        await this.migrarDiasSemanAlarmes();

        this.isInitialized = true;
        console.log('✅ Banco de dados inicializado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
        this.isInitialized = false;
        this.db = null;
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Garante que o banco está inicializado
   */
  async ensureInitialized() {
    if (!this.db || !this.isInitialized) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Banco de dados não inicializado');
    }
  }

  /**
   * Cria as tabelas do banco de dados
   */
  async createTables() {
    try {
      // Cria todas as tabelas em um único execAsync
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS medicamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          descricao TEXT,
          dosagem TEXT NOT NULL,
          fabricante TEXT,
          preco REAL DEFAULT 0,
          categoria TEXT,
          ativo INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS estoque (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          medicamento_id INTEGER NOT NULL,
          quantidade INTEGER NOT NULL DEFAULT 0,
          minimo INTEGER DEFAULT 10,
          maximo INTEGER DEFAULT 100,
          vencimento DATE,
          status TEXT DEFAULT 'normal',
          lote TEXT,
          data_entrada DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS movimentacoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          medicamento_id INTEGER NOT NULL,
          tipo TEXT NOT NULL,
          quantidade INTEGER NOT NULL,
          data DATE NOT NULL,
          usuario TEXT,
          motivo TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS alertas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          medicamento_id INTEGER,
          tipo TEXT NOT NULL,
          mensagem TEXT NOT NULL,
          data DATE NOT NULL,
          lido INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS alarmes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          medicamento_id INTEGER NOT NULL,
          horario TEXT NOT NULL,
          dias_semana TEXT NOT NULL,
          ativo INTEGER DEFAULT 1,
          observacoes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );
      `);

      // Log removido para evitar duplicação
    } catch (error) {
      console.error('❌ Erro ao criar tabelas:', error);
      throw error;
    }
  }

  /**
   * Insere dados iniciais no banco de dados
   */
  async insertInitialData() {
    try {
      // Verifica se já existem medicamentos
      const result = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM medicamentos');

      if (result && result.count > 0) {
        // Dados já existem, não precisa inserir novamente
        return;
      }

      // Insere medicamentos iniciais
      const medicamentos = [
        { nome: 'Losartana 50mg', descricao: 'Medicamento para pressão alta', dosagem: '50mg', fabricante: 'Genérico', preco: 15.50, categoria: 'Cardiovascular' },
        { nome: 'Metformina 850mg', descricao: 'Medicamento para diabetes', dosagem: '850mg', fabricante: 'Genérico', preco: 12.00, categoria: 'Endocrinologia' },
        { nome: 'Sinvastatina 20mg', descricao: 'Medicamento para colesterol', dosagem: '20mg', fabricante: 'Genérico', preco: 18.75, categoria: 'Cardiovascular' },
        { nome: 'Omeprazol 20mg', descricao: 'Medicamento para gastrite', dosagem: '20mg', fabricante: 'Genérico', preco: 10.00, categoria: 'Gastroenterologia' },
        { nome: 'Dipirona 500mg', descricao: 'Analgésico e antitérmico', dosagem: '500mg', fabricante: 'Genérico', preco: 8.50, categoria: 'Analgésicos' },
      ];

      for (const med of medicamentos) {
        await this.db.runAsync(
          'INSERT INTO medicamentos (nome, descricao, dosagem, fabricante, preco, categoria) VALUES (?, ?, ?, ?, ?, ?)',
          [med.nome, med.descricao, med.dosagem, med.fabricante, med.preco, med.categoria]
        );
      }

      // Insere estoque inicial
      const estoqueInicial = [
        { medicamento_id: 1, quantidade: 30, minimo: 10, maximo: 100, vencimento: '2025-12-15', status: 'normal', lote: 'LOTE001', data_entrada: '2024-10-22' },
        { medicamento_id: 2, quantidade: 5, minimo: 15, maximo: 80, vencimento: '2025-11-20', status: 'baixo', lote: 'LOTE002', data_entrada: '2024-10-22' },
        { medicamento_id: 3, quantidade: 20, minimo: 10, maximo: 90, vencimento: '2025-10-05', status: 'vencendo', lote: 'LOTE003', data_entrada: '2024-10-22' },
        { medicamento_id: 4, quantidade: 45, minimo: 20, maximo: 120, vencimento: '2025-11-30', status: 'normal', lote: 'LOTE004', data_entrada: '2024-10-22' },
        { medicamento_id: 5, quantidade: 60, minimo: 30, maximo: 150, vencimento: '2025-12-10', status: 'normal', lote: 'LOTE005', data_entrada: '2024-10-22' },
      ];

      for (const est of estoqueInicial) {
        await this.db.runAsync(
          'INSERT INTO estoque (medicamento_id, quantidade, minimo, maximo, vencimento, status, lote, data_entrada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [est.medicamento_id, est.quantidade, est.minimo, est.maximo, est.vencimento, est.status, est.lote, est.data_entrada]
        );
      }

      // Insere movimentações iniciais
      await this.db.runAsync(
        'INSERT INTO movimentacoes (medicamento_id, tipo, quantidade, data, usuario, motivo) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 'entrada', 30, '2024-10-22', 'Admin', 'Compra inicial']
      );

      await this.db.runAsync(
        'INSERT INTO movimentacoes (medicamento_id, tipo, quantidade, data, usuario, motivo) VALUES (?, ?, ?, ?, ?, ?)',
        [2, 'saida', 10, '2024-10-21', 'Farmacêutico', 'Dispensação']
      );

      // Insere alertas iniciais
      await this.db.runAsync(
        'INSERT INTO alertas (medicamento_id, tipo, mensagem, data, lido) VALUES (?, ?, ?, ?, ?)',
        [2, 'estoque_baixo', 'Metformina com estoque baixo', '2024-10-22', 0]
      );

      await this.db.runAsync(
        'INSERT INTO alertas (medicamento_id, tipo, mensagem, data, lido) VALUES (?, ?, ?, ?, ?)',
        [3, 'vencimento_proximo', 'Sinvastatina vencendo em breve', '2024-10-22', 0]
      );

      // Insere alarmes iniciais
      await this.db.runAsync(
        'INSERT INTO alarmes (medicamento_id, horario, dias_semana, ativo, observacoes) VALUES (?, ?, ?, ?, ?)',
        [1, '08:00', JSON.stringify({segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false}), 1, 'Tomar em jejum']
      );

      await this.db.runAsync(
        'INSERT INTO alarmes (medicamento_id, horario, dias_semana, ativo, observacoes) VALUES (?, ?, ?, ?, ?)',
        [2, '12:00', JSON.stringify({segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true}), 1, 'Tomar após o almoço']
      );

      await this.db.runAsync(
        'INSERT INTO alarmes (medicamento_id, horario, dias_semana, ativo, observacoes) VALUES (?, ?, ?, ?, ?)',
        [4, '20:00', JSON.stringify({segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true}), 1, 'Tomar antes de dormir']
      );

      // Log removido para evitar duplicação
    } catch (error) {
      console.error('❌ Erro ao inserir dados iniciais:', error);
      throw error;
    }
  }

  /**
   * Migra dados antigos de alarmes (objeto → array)
   */
  async migrarDiasSemanAlarmes() {
    try {
      // Busca todos os alarmes
      const alarmes = await this.db.getAllAsync('SELECT id, dias_semana FROM alarmes');

      let migrados = 0;

      for (const alarme of alarmes) {
        try {
          let diasSemana = alarme.dias_semana;

          // Se é string, faz parse
          if (typeof diasSemana === 'string') {
            diasSemana = JSON.parse(diasSemana);
          }

          // Se é objeto (formato antigo), converte para array
          if (typeof diasSemana === 'object' && !Array.isArray(diasSemana) && diasSemana !== null) {
            const diasMap = {
              'segunda': 'Seg',
              'terca': 'Ter',
              'quarta': 'Qua',
              'quinta': 'Qui',
              'sexta': 'Sex',
              'sabado': 'Sáb',
              'domingo': 'Dom'
            };

            const diasArray = Object.keys(diasSemana)
              .filter(dia => diasSemana[dia] === true)
              .map(dia => diasMap[dia])
              .filter(dia => dia !== undefined);

            // Atualiza no banco
            await this.db.runAsync(
              'UPDATE alarmes SET dias_semana = ? WHERE id = ?',
              [JSON.stringify(diasArray), alarme.id]
            );

            migrados++;
          }
        } catch (parseError) {
          console.warn(`⚠️ Erro ao migrar alarme ${alarme.id}:`, parseError);
        }
      }

      if (migrados > 0) {
        console.log(`✅ Migrados ${migrados} alarmes de objeto para array`);
      }
    } catch (error) {
      console.error('❌ Erro ao migrar dias_semana:', error);
      // Não lança erro para não impedir a inicialização
    }
  }

  // ========== MEDICAMENTOS ==========

  async getAllMedicamentos() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM medicamentos WHERE ativo = 1 ORDER BY nome');
  }

  async medicamentoExiste(nome, dosagem) {
    await this.ensureInitialized();
    const result = await this.db.getFirstAsync(
      'SELECT id FROM medicamentos WHERE LOWER(nome) = LOWER(?) AND LOWER(dosagem) = LOWER(?) AND ativo = 1',
      [nome, dosagem]
    );
    return result !== null;
  }

  async getMedicamentoById(id) {
    await this.init();
    return await this.db.getFirstAsync('SELECT * FROM medicamentos WHERE id = ?', [id]);
  }

  async addMedicamento(medicamento) {
    await this.ensureInitialized();

    const params = [
      medicamento.nome,
      medicamento.descricao || '',
      medicamento.dosagem,
      medicamento.fabricante || '',
      medicamento.preco || 0,
      medicamento.categoria || 'Medicamento'
    ];

    console.log('🔍 addMedicamento params:', params);
    console.log('🔍 addMedicamento types:', params.map(p => typeof p));

    const result = await this.db.runAsync(
      'INSERT INTO medicamentos (nome, descricao, dosagem, fabricante, preco, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      params
    );

    console.log('✅ Medicamento inserido com ID:', result.lastInsertRowId);

    // Retorna apenas o ID, não busca o medicamento completo
    return result.lastInsertRowId;
  }

  async updateMedicamento(id, dados) {
    await this.init();
    const fields = [];
    const values = [];

    Object.keys(dados).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(dados[key]);
    });

    values.push(id);

    await this.db.runAsync(
      `UPDATE medicamentos SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return await this.getMedicamentoById(id);
  }

  async deleteMedicamento(id) {
    await this.init();
    await this.db.runAsync('UPDATE medicamentos SET ativo = 0 WHERE id = ?', [id]);
    return true;
  }

  // ========== ESTOQUE ==========

  async getAllEstoque() {
    await this.init();
    return await this.db.getAllAsync(`
      SELECT e.*, m.nome as medicamento 
      FROM estoque e 
      INNER JOIN medicamentos m ON e.medicamento_id = m.id 
      WHERE m.ativo = 1
      ORDER BY e.id
    `);
  }

  async getEstoqueById(id) {
    await this.init();
    return await this.db.getFirstAsync('SELECT * FROM estoque WHERE id = ?', [id]);
  }

  async getEstoqueByMedicamentoId(medicamentoId) {
    await this.init();
    return await this.db.getFirstAsync('SELECT * FROM estoque WHERE medicamento_id = ?', [medicamentoId]);
  }

  async addEstoque(estoque) {
    await this.ensureInitialized();

    const params = [
      estoque.medicamento_id,
      estoque.quantidade,
      estoque.minimo,
      estoque.maximo,
      estoque.vencimento || '',
      estoque.status || 'normal',
      estoque.lote || '',
      estoque.data_entrada
    ];

    console.log('🔍 addEstoque params:', params);
    console.log('🔍 addEstoque types:', params.map(p => typeof p));

    const result = await this.db.runAsync(
      'INSERT INTO estoque (medicamento_id, quantidade, minimo, maximo, vencimento, status, lote, data_entrada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      params
    );

    console.log('✅ Estoque inserido com ID:', result.lastInsertRowId);

    // Retorna apenas o ID, não busca o estoque completo
    return result.lastInsertRowId;
  }

  async updateEstoque(id, dados) {
    await this.init();
    const fields = [];
    const values = [];

    Object.keys(dados).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(dados[key]);
    });

    values.push(id);

    await this.db.runAsync(
      `UPDATE estoque SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return await this.getEstoqueById(id);
  }

  async updateEstoqueByMedicamentoId(medicamentoId, dados) {
    await this.init();
    const estoque = await this.getEstoqueByMedicamentoId(medicamentoId);

    if (!estoque) {
      // Se não existe estoque, cria um novo
      return await this.addEstoque({
        medicamento_id: medicamentoId,
        quantidade: dados.quantidade || 0,
        minimo: dados.minimo || 10,
        maximo: dados.maximo || 100,
        vencimento: dados.vencimento || null,
        status: dados.status || 'normal',
        lote: dados.lote || null,
        data_entrada: dados.data_entrada || new Date().toISOString().split('T')[0],
      });
    }

    // Se existe, atualiza
    return await this.updateEstoque(estoque.id, dados);
  }

  async adicionarQuantidade(medicamentoId, quantidade) {
    await this.init();
    const estoque = await this.getEstoqueByMedicamentoId(medicamentoId);

    if (!estoque) {
      return null;
    }

    const novaQuantidade = estoque.quantidade + quantidade;
    await this.db.runAsync(
      'UPDATE estoque SET quantidade = ?, updated_at = CURRENT_TIMESTAMP WHERE medicamento_id = ?',
      [novaQuantidade, medicamentoId]
    );

    return await this.getEstoqueByMedicamentoId(medicamentoId);
  }

  async removerQuantidade(medicamentoId, quantidade) {
    await this.init();
    const estoque = await this.getEstoqueByMedicamentoId(medicamentoId);

    if (!estoque || estoque.quantidade < quantidade) {
      return null;
    }

    const novaQuantidade = estoque.quantidade - quantidade;
    await this.db.runAsync(
      'UPDATE estoque SET quantidade = ?, updated_at = CURRENT_TIMESTAMP WHERE medicamento_id = ?',
      [novaQuantidade, medicamentoId]
    );

    return await this.getEstoqueByMedicamentoId(medicamentoId);
  }

  // ========== MOVIMENTAÇÕES ==========

  async getAllMovimentacoes() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM movimentacoes ORDER BY data DESC, id DESC');
  }

  async addMovimentacao(movimentacao) {
    await this.init();
    await this.db.runAsync(
      'INSERT INTO movimentacoes (medicamento_id, tipo, quantidade, data, usuario, motivo) VALUES (?, ?, ?, ?, ?, ?)',
      [movimentacao.medicamento_id, movimentacao.tipo, movimentacao.quantidade, movimentacao.data, movimentacao.usuario, movimentacao.motivo]
    );
  }

  // ========== ALERTAS ==========

  async getAllAlertas() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM alertas ORDER BY data DESC, id DESC');
  }

  async getAlertasNaoLidos() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM alertas WHERE lido = 0 ORDER BY data DESC');
  }

  async marcarAlertaComoLido(id) {
    await this.init();
    await this.db.runAsync('UPDATE alertas SET lido = 1 WHERE id = ?', [id]);
    return await this.db.getFirstAsync('SELECT * FROM alertas WHERE id = ?', [id]);
  }

  async marcarTodosAlertasComoLidos() {
    await this.init();
    await this.db.runAsync('UPDATE alertas SET lido = 1');
  }

  async addAlerta(alerta) {
    await this.init();
    await this.db.runAsync(
      'INSERT INTO alertas (medicamento_id, tipo, mensagem, data, lido) VALUES (?, ?, ?, ?, ?)',
      [alerta.medicamento_id, alerta.tipo, alerta.mensagem, alerta.data, alerta.lido || 0]
    );
  }

  // ========== ALARMES ==========

  // Função auxiliar para fazer parse seguro de dias_semana
  _parseDiasSemana(diasSemana) {
    try {
      let parsed = diasSemana;

      // Se é string, faz parse
      if (typeof diasSemana === 'string') {
        parsed = JSON.parse(diasSemana);
      }

      // Se já é array, retorna direto
      if (Array.isArray(parsed)) {
        return parsed;
      }

      // Se é objeto (formato antigo), converte para array
      if (typeof parsed === 'object' && parsed !== null) {
        const diasMap = {
          'segunda': 'Seg',
          'terca': 'Ter',
          'quarta': 'Qua',
          'quinta': 'Qui',
          'sexta': 'Sex',
          'sabado': 'Sáb',
          'domingo': 'Dom'
        };

        const diasArray = Object.keys(parsed)
          .filter(dia => parsed[dia] === true)
          .map(dia => diasMap[dia])
          .filter(dia => dia !== undefined);

        return diasArray;
      }

      return [];
    } catch (error) {
      console.error('Erro ao fazer parse de dias_semana:', error);
      console.log('Valor problemático:', diasSemana);
      return [];
    }
  }

  async getAllAlarmes() {
    await this.init();
    const alarmes = await this.db.getAllAsync(`
      SELECT a.*, m.nome as medicamento_nome, m.dosagem as medicamento_dosagem
      FROM alarmes a
      LEFT JOIN medicamentos m ON a.medicamento_id = m.id
      ORDER BY a.horario
    `);

    // Parse dias_semana JSON com tratamento de erro
    return alarmes.map(alarme => ({
      ...alarme,
      dias_semana: this._parseDiasSemana(alarme.dias_semana)
    }));
  }

  async getAlarmesAtivos() {
    await this.init();
    const alarmes = await this.db.getAllAsync(`
      SELECT a.*, m.nome as medicamento_nome, m.dosagem as medicamento_dosagem
      FROM alarmes a
      LEFT JOIN medicamentos m ON a.medicamento_id = m.id
      WHERE a.ativo = 1
      ORDER BY a.horario
    `);

    return alarmes.map(alarme => ({
      ...alarme,
      dias_semana: this._parseDiasSemana(alarme.dias_semana)
    }));
  }

  async getAlarmesByMedicamentoId(medicamentoId) {
    await this.init();
    const alarmes = await this.db.getAllAsync(`
      SELECT * FROM alarmes
      WHERE medicamento_id = ?
      ORDER BY horario
    `, [medicamentoId]);

    return alarmes.map(alarme => ({
      ...alarme,
      dias_semana: this._parseDiasSemana(alarme.dias_semana)
    }));
  }

  async getAlarmeById(id) {
    await this.init();
    const alarme = await this.db.getFirstAsync(`
      SELECT a.*, m.nome as medicamento_nome, m.dosagem as medicamento_dosagem
      FROM alarmes a
      LEFT JOIN medicamentos m ON a.medicamento_id = m.id
      WHERE a.id = ?
    `, [id]);

    if (alarme) {
      alarme.dias_semana = this._parseDiasSemana(alarme.dias_semana);
    }
    return alarme;
  }

  async addAlarme(alarme) {
    await this.ensureInitialized();

    console.log('🔍 addAlarme recebeu:', alarme);

    // Converte dias_semana para JSON se for objeto
    let diasSemanaJson;
    if (typeof alarme.dias_semana === 'string') {
      diasSemanaJson = alarme.dias_semana;
    } else if (typeof alarme.dias_semana === 'object' && alarme.dias_semana !== null) {
      diasSemanaJson = JSON.stringify(alarme.dias_semana);
    } else {
      diasSemanaJson = '{}';
    }

    const params = [
      alarme.medicamento_id,
      alarme.horario,
      diasSemanaJson,
      alarme.ativo !== undefined ? alarme.ativo : 1,
      alarme.observacoes || ''
    ];

    console.log('🔍 Parâmetros para INSERT:', params);
    console.log('🔍 Tipos:', params.map(p => typeof p));

    const result = await this.db.runAsync(
      'INSERT INTO alarmes (medicamento_id, horario, dias_semana, ativo, observacoes) VALUES (?, ?, ?, ?, ?)',
      params
    );

    console.log('✅ Alarme inserido com ID:', result.lastInsertRowId);

    // Retorna apenas o ID, não busca o alarme completo
    return result.lastInsertRowId;
  }

  async updateAlarme(id, dados) {
    await this.init();
    const fields = [];
    const values = [];

    Object.keys(dados).forEach(key => {
      if (key === 'dias_semana') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(dados[key]));
      } else {
        fields.push(`${key} = ?`);
        values.push(dados[key]);
      }
    });

    values.push(id);

    await this.db.runAsync(
      `UPDATE alarmes SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return await this.getAlarmeById(id);
  }

  async toggleAlarme(id) {
    await this.init();
    const alarme = await this.getAlarmeById(id);
    const novoStatus = alarme.ativo === 1 ? 0 : 1;
    await this.db.runAsync('UPDATE alarmes SET ativo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [novoStatus, id]);
    return await this.getAlarmeById(id);
  }

  async deleteAlarme(id) {
    await this.init();
    await this.db.runAsync('DELETE FROM alarmes WHERE id = ?', [id]);
    return true;
  }

  // ========== MÉTODOS AUXILIARES ==========

  /**
   * Busca medicamentos com estoque e alarmes
   */
  async getMedicamentosCompletos() {
    await this.ensureInitialized();
    const medicamentos = await this.getAllMedicamentos();

    for (const med of medicamentos) {
      // Busca estoque
      const estoque = await this.db.getFirstAsync(
        'SELECT * FROM estoque WHERE medicamento_id = ?',
        [med.id]
      );
      med.estoque = estoque || null;

      // Busca alarmes ativos
      const alarmes = await this.db.getAllAsync(
        'SELECT * FROM alarmes WHERE medicamento_id = ? AND ativo = 1',
        [med.id]
      );
      med.alarmes = alarmes.map(a => ({
        ...a,
        dias_semana: JSON.parse(a.dias_semana)
      }));
    }

    return medicamentos;
  }

  /**
   * Verifica e cria alertas automáticos para estoque baixo e vencimento
   */
  async verificarECriarAlertas() {
    await this.init();
    const hoje = new Date().toISOString().split('T')[0];

    // Verifica estoque baixo
    const estoqueBaixo = await this.db.getAllAsync(`
      SELECT e.*, m.nome as medicamento_nome
      FROM estoque e
      JOIN medicamentos m ON e.medicamento_id = m.id
      WHERE e.quantidade <= e.minimo AND m.ativo = 1
    `);

    for (const item of estoqueBaixo) {
      // Verifica se já existe alerta não lido para este medicamento
      const alertaExistente = await this.db.getFirstAsync(
        'SELECT * FROM alertas WHERE medicamento_id = ? AND tipo = ? AND lido = 0',
        [item.medicamento_id, 'estoque_baixo']
      );

      if (!alertaExistente) {
        await this.addAlerta({
          medicamento_id: item.medicamento_id,
          tipo: 'estoque_baixo',
          mensagem: `${item.medicamento_nome} está com estoque baixo (${item.quantidade} unidades)`,
          data: hoje,
          lido: 0
        });
      }
    }

    // Verifica vencimento próximo (30 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 30);
    const dataLimiteStr = dataLimite.toISOString().split('T')[0];

    const vencimentoProximo = await this.db.getAllAsync(`
      SELECT e.*, m.nome as medicamento_nome
      FROM estoque e
      JOIN medicamentos m ON e.medicamento_id = m.id
      WHERE e.vencimento <= ? AND e.vencimento >= ? AND m.ativo = 1
    `, [dataLimiteStr, hoje]);

    for (const item of vencimentoProximo) {
      const alertaExistente = await this.db.getFirstAsync(
        'SELECT * FROM alertas WHERE medicamento_id = ? AND tipo = ? AND lido = 0',
        [item.medicamento_id, 'vencimento_proximo']
      );

      if (!alertaExistente) {
        await this.addAlerta({
          medicamento_id: item.medicamento_id,
          tipo: 'vencimento_proximo',
          mensagem: `${item.medicamento_nome} vence em ${item.vencimento}`,
          data: hoje,
          lido: 0
        });
      }
    }
  }
}

// Criar instância única (Singleton)
const databaseService = new DatabaseService();

export default databaseService;


// 🗄️ BANCO DE DADOS SQLite - DatabaseService.js
// ============================================
// DESCRIÇÃO: Serviço principal de banco de dados usando Expo SQLite
// RESPONSABILIDADES:
//   - Gerenciar conexão com banco SQLite
//   - Criar e manter estrutura de tabelas
//   - Fornecer métodos CRUD para todas as entidades
//   - Garantir integridade dos dados
//   - Migrar dados antigos quando necessário
//
// TABELAS:
//   - medicamentos: Cadastro de medicamentos
//   - estoque: Controle de quantidade e validade
//   - movimentacoes: Histórico de entradas/saídas
//   - alertas: Notificações do sistema
//   - alarmes: Lembretes de horários
//
// PADRÃO: Singleton (uma única instância compartilhada)
// ============================================

import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;                    // Instância do banco de dados
    this.isInitialized = false;        // Flag de inicialização
    this.initPromise = null;           // Promise de inicialização (evita múltiplas inicializações)
  }

  // ============================================
  // INICIALIZAÇÃO DO BANCO
  // ============================================

  /**
   * Inicializa o banco de dados e cria as tabelas
   *
   * IMPORTANTE: Usa padrão Singleton para evitar múltiplas inicializações
   * - Se já inicializado: retorna imediatamente
   * - Se inicializando: aguarda a promise existente
   * - Se não inicializado: cria nova promise de inicialização
   *
   * FLUXO:
   * 1. Abre/cria banco 'medicuidado.db'
   * 2. Cria estrutura de tabelas
   * 3. Insere dados iniciais (se banco vazio)
   * 4. Migra dados antigos (se necessário)
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
   * Garante que o banco está inicializado antes de executar operações
   *
   * USO: Chamar antes de qualquer operação de banco
   * LANÇA ERRO: Se não conseguir inicializar
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
   *
   * TABELAS CRIADAS:
   *
   * 1. MEDICAMENTOS:
   *    - Armazena informações básicas dos medicamentos
   *    - Campos: id, nome, descricao, dosagem, fabricante, preco, categoria, ativo
   *
   * 2. ESTOQUE:
   *    - Controla quantidade e validade dos medicamentos
   *    - Campos: id, medicamento_id, quantidade, minimo, maximo, vencimento, status, lote
   *    - Relacionamento: medicamento_id → medicamentos(id) com CASCADE
   *
   * 3. MOVIMENTACOES:
   *    - Registra histórico de entradas e saídas
   *    - Campos: id, medicamento_id, tipo, quantidade, data, usuario, motivo
   *    - Tipos: 'entrada' ou 'saida'
   *
   * 4. ALERTAS:
   *    - Notificações do sistema (estoque baixo, vencimento, etc.)
   *    - Campos: id, medicamento_id, tipo, mensagem, data, lido
   *
   * 5. ALARMES:
   *    - Lembretes de horários para tomar medicamentos
   *    - Campos: id, medicamento_id, horario, dias_semana, ativo, observacoes
   *    - dias_semana: JSON array ["Seg", "Ter", "Qua", ...]
   *
   * IMPORTANTE:
   * - Usa CREATE TABLE IF NOT EXISTS (não recria se já existe)
   * - Foreign keys com ON DELETE CASCADE (deleta registros relacionados)
   * - Timestamps automáticos (created_at, updated_at)
   */
  async createTables() {
    try {
      // Cria todas as tabelas em um único execAsync para melhor performance
      await this.db.execAsync(`
        -- ========================================
        -- TABELA: MEDICAMENTOS
        -- Armazena informações básicas dos medicamentos
        -- ========================================
        CREATE TABLE IF NOT EXISTS medicamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,    -- ID único do medicamento
          nome TEXT NOT NULL,                      -- Nome do medicamento (ex: "Losartana 50mg")
          descricao TEXT,                          -- Descrição/indicação (ex: "Para pressão alta")
          dosagem TEXT NOT NULL,                   -- Dosagem (ex: "50mg", "10ml")
          fabricante TEXT,                         -- Nome do fabricante
          preco REAL DEFAULT 0,                    -- Preço unitário
          categoria TEXT,                          -- Categoria (ex: "Cardiovascular")
          ativo INTEGER DEFAULT 1,                 -- 1 = ativo, 0 = inativo
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- Data de atualização
        );

        -- ========================================
        -- TABELA: ESTOQUE
        -- Controla quantidade e validade dos medicamentos
        -- ========================================
        CREATE TABLE IF NOT EXISTS estoque (
          id INTEGER PRIMARY KEY AUTOINCREMENT,    -- ID único do registro de estoque
          medicamento_id INTEGER NOT NULL,         -- ID do medicamento (FK)
          quantidade INTEGER NOT NULL DEFAULT 0,   -- Quantidade atual em estoque
          minimo INTEGER DEFAULT 10,               -- Quantidade mínima (alerta se abaixo)
          maximo INTEGER DEFAULT 100,              -- Quantidade máxima recomendada
          vencimento DATE,                         -- Data de vencimento
          status TEXT DEFAULT 'normal',            -- Status: 'normal', 'baixo', 'vencendo', 'vencido'
          lote TEXT,                               -- Número do lote
          data_entrada DATE,                       -- Data de entrada no estoque
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de atualização
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );

        -- ========================================
        -- TABELA: MOVIMENTACOES
        -- Registra histórico de entradas e saídas
        -- ========================================
        CREATE TABLE IF NOT EXISTS movimentacoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,    -- ID único da movimentação
          medicamento_id INTEGER NOT NULL,         -- ID do medicamento (FK)
          tipo TEXT NOT NULL,                      -- Tipo: 'entrada' ou 'saida'
          quantidade INTEGER NOT NULL,             -- Quantidade movimentada
          data DATE NOT NULL,                      -- Data da movimentação
          usuario TEXT,                            -- Usuário que fez a movimentação
          motivo TEXT,                             -- Motivo da movimentação
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );

        -- ========================================
        -- TABELA: ALERTAS
        -- Notificações do sistema
        -- ========================================
        CREATE TABLE IF NOT EXISTS alertas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,    -- ID único do alerta
          medicamento_id INTEGER,                  -- ID do medicamento (FK, pode ser NULL)
          tipo TEXT NOT NULL,                      -- Tipo: 'estoque_baixo', 'vencimento_proximo', etc.
          mensagem TEXT NOT NULL,                  -- Mensagem do alerta
          data DATE NOT NULL,                      -- Data do alerta
          lido INTEGER DEFAULT 0,                  -- 0 = não lido, 1 = lido
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
        );

        -- ========================================
        -- TABELA: ALARMES
        -- Lembretes de horários para tomar medicamentos
        -- ========================================
        CREATE TABLE IF NOT EXISTS alarmes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,    -- ID único do alarme
          medicamento_id INTEGER NOT NULL,         -- ID do medicamento (FK)
          horario TEXT NOT NULL,                   -- Horário do alarme (ex: "08:00")
          dias_semana TEXT NOT NULL,               -- Dias da semana (JSON array: ["Seg", "Ter", ...])
          ativo INTEGER DEFAULT 1,                 -- 1 = ativo, 0 = inativo
          observacoes TEXT,                        -- Observações (ex: "Tomar em jejum")
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de criação
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Data de atualização
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
   *
   * DADOS INSERIDOS:
   * - 5 medicamentos de exemplo
   * - Estoque inicial para cada medicamento
   * - Algumas movimentações de exemplo
   * - Alertas de teste
   * - Alarmes de exemplo
   *
   * IMPORTANTE:
   * - Só insere se o banco estiver vazio (count = 0)
   * - Útil para demonstração e testes
   * - Em produção, pode ser removido ou adaptado
   */
  async insertInitialData() {
    try {
      // Verifica se já existem medicamentos no banco
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
   *
   * PROBLEMA:
   * - Versões antigas salvavam dias_semana como objeto:
   *   {segunda: true, terca: false, ...}
   *
   * - Versão atual usa array:
   *   ["Seg", "Ter", "Qua"]
   *
   * SOLUÇÃO:
   * - Busca todos os alarmes
   * - Verifica se dias_semana é objeto (formato antigo)
   * - Converte para array (formato novo)
   * - Atualiza no banco
   *
   * EXEMPLO DE CONVERSÃO:
   * {segunda: true, terca: true, quarta: false}
   * → ["Seg", "Ter"]
   */
  async migrarDiasSemanAlarmes() {
    try {
      // Busca todos os alarmes do banco
      const alarmes = await this.db.getAllAsync('SELECT id, dias_semana FROM alarmes');

      let migrados = 0; // Contador de alarmes migrados

      // Processa cada alarme
      for (const alarme of alarmes) {
        try {
          let diasSemana = alarme.dias_semana;

          // Se é string JSON, faz parse para objeto/array
          if (typeof diasSemana === 'string') {
            diasSemana = JSON.parse(diasSemana);
          }

          // Verifica se é objeto (formato antigo) e não é array
          if (typeof diasSemana === 'object' && !Array.isArray(diasSemana) && diasSemana !== null) {
            // Mapeamento de nomes de dias (português completo → abreviado)
            const diasMap = {
              'segunda': 'Seg',
              'terca': 'Ter',
              'quarta': 'Qua',
              'quinta': 'Qui',
              'sexta': 'Sex',
              'sabado': 'Sáb',
              'domingo': 'Dom'
            };

            // Converte objeto para array
            // Exemplo: {segunda: true, terca: true, quarta: false}
            // 1. Object.keys() → ['segunda', 'terca', 'quarta']
            // 2. filter(true) → ['segunda', 'terca']
            // 3. map(diasMap) → ['Seg', 'Ter']
            const diasArray = Object.keys(diasSemana)
              .filter(dia => diasSemana[dia] === true)  // Pega apenas dias marcados como true
              .map(dia => diasMap[dia])                 // Converte para abreviação
              .filter(dia => dia !== undefined);        // Remove valores inválidos

            // Atualiza o alarme no banco com o novo formato
            await this.db.runAsync(
              'UPDATE alarmes SET dias_semana = ? WHERE id = ?',
              [JSON.stringify(diasArray), alarme.id]
            );

            migrados++; // Incrementa contador
          }
        } catch (parseError) {
          // Se der erro em um alarme específico, continua com os outros
          console.warn(`⚠️ Erro ao migrar alarme ${alarme.id}:`, parseError);
        }
      }

      // Exibe mensagem de sucesso se migrou algum alarme
      if (migrados > 0) {
        console.log(`✅ Migrados ${migrados} alarmes de objeto para array`);
      }
    } catch (error) {
      console.error('❌ Erro ao migrar dias_semana:', error);
      // Não lança erro para não impedir a inicialização do app
    }
  }

  // ========================================
  // OPERAÇÕES COM MEDICAMENTOS
  // ========================================

  /**
   * Busca todos os medicamentos ativos
   *
   * @returns {Promise<Array>} Array com todos os medicamentos ativos
   *
   * EXEMPLO DE RETORNO:
   * [
   *   { id: 1, nome: 'Losartana 50mg', dosagem: '50mg', ... },
   *   { id: 2, nome: 'Metformina 850mg', dosagem: '850mg', ... }
   * ]
   */
  async getAllMedicamentos() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM medicamentos WHERE ativo = 1 ORDER BY nome');
  }

  /**
   * Verifica se um medicamento já existe no banco
   *
   * @param {string} nome - Nome do medicamento
   * @param {string} dosagem - Dosagem do medicamento
   * @returns {Promise<boolean>} true se existe, false se não existe
   *
   * IMPORTANTE:
   * - Comparação case-insensitive (LOWER)
   * - Verifica apenas medicamentos ativos
   * - Usado para evitar duplicatas
   */
  async medicamentoExiste(nome, dosagem) {
    await this.ensureInitialized();
    const result = await this.db.getFirstAsync(
      'SELECT id FROM medicamentos WHERE LOWER(nome) = LOWER(?) AND LOWER(dosagem) = LOWER(?) AND ativo = 1',
      [nome, dosagem]
    );
    return result !== null;
  }

  /**
   * Busca um medicamento específico por ID
   *
   * @param {number} id - ID do medicamento
   * @returns {Promise<Object|null>} Objeto do medicamento ou null se não encontrado
   */
  async getMedicamentoById(id) {
    await this.init();
    return await this.db.getFirstAsync('SELECT * FROM medicamentos WHERE id = ?', [id]);
  }

  /**
   * Adiciona um novo medicamento ao banco
   *
   * @param {Object} medicamento - Dados do medicamento
   * @param {string} medicamento.nome - Nome do medicamento (obrigatório)
   * @param {string} medicamento.dosagem - Dosagem (obrigatório)
   * @param {string} medicamento.descricao - Descrição (opcional)
   * @param {string} medicamento.fabricante - Fabricante (opcional)
   * @param {number} medicamento.preco - Preço (opcional, padrão: 0)
   * @param {string} medicamento.categoria - Categoria (opcional, padrão: 'Medicamento')
   * @returns {Promise<number>} ID do medicamento inserido
   *
   * EXEMPLO DE USO:
   * const id = await addMedicamento({
   *   nome: 'Losartana 50mg',
   *   dosagem: '50mg',
   *   descricao: 'Para pressão alta',
   *   fabricante: 'Genérico',
   *   preco: 15.50,
   *   categoria: 'Cardiovascular'
   * });
   */
  async addMedicamento(medicamento) {
    await this.ensureInitialized();

    // Prepara os parâmetros com valores padrão
    const params = [
      medicamento.nome,                           // Nome (obrigatório)
      medicamento.descricao || '',                // Descrição (padrão: vazio)
      medicamento.dosagem,                        // Dosagem (obrigatório)
      medicamento.fabricante || '',               // Fabricante (padrão: vazio)
      medicamento.preco || 0,                     // Preço (padrão: 0)
      medicamento.categoria || 'Medicamento'      // Categoria (padrão: 'Medicamento')
    ];

    // Logs para debug (útil durante desenvolvimento)
    console.log('🔍 addMedicamento params:', params);
    console.log('🔍 addMedicamento types:', params.map(p => typeof p));

    // Insere o medicamento no banco
    const result = await this.db.runAsync(
      'INSERT INTO medicamentos (nome, descricao, dosagem, fabricante, preco, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      params
    );

    console.log('✅ Medicamento inserido com ID:', result.lastInsertRowId);

    // Retorna apenas o ID do medicamento inserido
    return result.lastInsertRowId;
  }

  /**
   * Atualiza um medicamento existente
   *
   * @param {number} id - ID do medicamento a atualizar
   * @param {Object} dados - Campos a atualizar (apenas os campos fornecidos serão atualizados)
   * @returns {Promise<Object>} Medicamento atualizado
   *
   * EXEMPLO DE USO:
   * await updateMedicamento(1, {
   *   nome: 'Losartana 100mg',
   *   preco: 20.00
   * });
   *
   * IMPORTANTE:
   * - Atualiza apenas os campos fornecidos
   * - Atualiza automaticamente o campo updated_at
   */
  async updateMedicamento(id, dados) {
    await this.init();
    const fields = [];  // Array para armazenar "campo = ?"
    const values = [];  // Array para armazenar os valores

    // Constrói a query dinamicamente baseado nos campos fornecidos
    Object.keys(dados).forEach(key => {
      fields.push(`${key} = ?`);  // Adiciona "campo = ?"
      values.push(dados[key]);     // Adiciona o valor
    });

    values.push(id);  // Adiciona o ID no final (para o WHERE)

    // Executa o UPDATE
    await this.db.runAsync(
      `UPDATE medicamentos SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    // Retorna o medicamento atualizado
    return await this.getMedicamentoById(id);
  }

  /**
   * Deleta um medicamento (soft delete)
   *
   * @param {number} id - ID do medicamento a deletar
   * @returns {Promise<boolean>} true se deletado com sucesso
   *
   * IMPORTANTE:
   * - Não deleta fisicamente do banco (soft delete)
   * - Apenas marca como inativo (ativo = 0)
   * - Permite recuperação futura se necessário
   */
  async deleteMedicamento(id) {
    await this.init();
    await this.db.runAsync('UPDATE medicamentos SET ativo = 0 WHERE id = ?', [id]);
    return true;
  }

  // ========================================
  // OPERAÇÕES COM ESTOQUE
  // ========================================

  /**
   * Busca todo o estoque com informações dos medicamentos
   *
   * @returns {Promise<Array>} Array com estoque e nome dos medicamentos
   *
   * EXEMPLO DE RETORNO:
   * [
   *   { id: 1, medicamento_id: 1, quantidade: 30, medicamento: 'Losartana 50mg', ... },
   *   { id: 2, medicamento_id: 2, quantidade: 5, medicamento: 'Metformina 850mg', ... }
   * ]
   *
   * IMPORTANTE:
   * - Usa INNER JOIN para pegar o nome do medicamento
   * - Retorna apenas medicamentos ativos
   */
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

  /**
   * Busca estoque por ID
   *
   * @param {number} id - ID do registro de estoque
   * @returns {Promise<Object|null>} Registro de estoque ou null
   */
  async getEstoqueById(id) {
    await this.init();
    return await this.db.getFirstAsync('SELECT * FROM estoque WHERE id = ?', [id]);
  }

  /**
   * Busca estoque por ID do medicamento
   *
   * @param {number} medicamentoId - ID do medicamento
   * @returns {Promise<Object|null>} Registro de estoque ou null
   *
   * IMPORTANTE:
   * - Cada medicamento tem apenas um registro de estoque
   * - Usado para verificar quantidade disponível
   */
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

  /**
   * Adiciona quantidade ao estoque de um medicamento
   *
   * @param {number} medicamentoId - ID do medicamento
   * @param {number} quantidade - Quantidade a adicionar
   * @returns {Promise<Object|null>} Estoque atualizado ou null se não encontrado
   *
   * EXEMPLO DE USO:
   * await adicionarQuantidade(1, 10); // Adiciona 10 unidades
   */
  async adicionarQuantidade(medicamentoId, quantidade) {
    await this.init();
    const estoque = await this.getEstoqueByMedicamentoId(medicamentoId);

    if (!estoque) {
      return null;  // Estoque não encontrado
    }

    const novaQuantidade = estoque.quantidade + quantidade;
    await this.db.runAsync(
      'UPDATE estoque SET quantidade = ?, updated_at = CURRENT_TIMESTAMP WHERE medicamento_id = ?',
      [novaQuantidade, medicamentoId]
    );

    return await this.getEstoqueByMedicamentoId(medicamentoId);
  }

  /**
   * Remove quantidade do estoque de um medicamento
   *
   * @param {number} medicamentoId - ID do medicamento
   * @param {number} quantidade - Quantidade a remover
   * @returns {Promise<Object|null>} Estoque atualizado ou null se não encontrado/quantidade insuficiente
   *
   * IMPORTANTE:
   * - Verifica se há quantidade suficiente antes de remover
   * - Retorna null se quantidade insuficiente
   */
  async removerQuantidade(medicamentoId, quantidade) {
    await this.init();
    const estoque = await this.getEstoqueByMedicamentoId(medicamentoId);

    if (!estoque || estoque.quantidade < quantidade) {
      return null;  // Estoque não encontrado ou quantidade insuficiente
    }

    const novaQuantidade = estoque.quantidade - quantidade;
    await this.db.runAsync(
      'UPDATE estoque SET quantidade = ?, updated_at = CURRENT_TIMESTAMP WHERE medicamento_id = ?',
      [novaQuantidade, medicamentoId]
    );

    return await this.getEstoqueByMedicamentoId(medicamentoId);
  }

  // ========================================
  // OPERAÇÕES COM MOVIMENTAÇÕES
  // ========================================

  /**
   * Busca todas as movimentações (histórico)
   *
   * @returns {Promise<Array>} Array com todas as movimentações ordenadas por data (mais recente primeiro)
   */
  async getAllMovimentacoes() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM movimentacoes ORDER BY data DESC, id DESC');
  }

  /**
   * Adiciona uma movimentação (entrada ou saída)
   *
   * @param {Object} movimentacao - Dados da movimentação
   * @param {number} movimentacao.medicamento_id - ID do medicamento
   * @param {string} movimentacao.tipo - Tipo: 'entrada' ou 'saida'
   * @param {number} movimentacao.quantidade - Quantidade movimentada
   * @param {string} movimentacao.data - Data da movimentação (formato: 'YYYY-MM-DD')
   * @param {string} movimentacao.usuario - Usuário que fez a movimentação
   * @param {string} movimentacao.motivo - Motivo da movimentação
   */
  async addMovimentacao(movimentacao) {
    await this.init();
    await this.db.runAsync(
      'INSERT INTO movimentacoes (medicamento_id, tipo, quantidade, data, usuario, motivo) VALUES (?, ?, ?, ?, ?, ?)',
      [movimentacao.medicamento_id, movimentacao.tipo, movimentacao.quantidade, movimentacao.data, movimentacao.usuario, movimentacao.motivo]
    );
  }

  // ========================================
  // OPERAÇÕES COM ALERTAS
  // ========================================

  /**
   * Busca todos os alertas
   *
   * @returns {Promise<Array>} Array com todos os alertas ordenados por data (mais recente primeiro)
   */
  async getAllAlertas() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM alertas ORDER BY data DESC, id DESC');
  }

  /**
   * Busca apenas alertas não lidos
   *
   * @returns {Promise<Array>} Array com alertas não lidos
   */
  async getAlertasNaoLidos() {
    await this.init();
    return await this.db.getAllAsync('SELECT * FROM alertas WHERE lido = 0 ORDER BY data DESC');
  }

  /**
   * Marca um alerta como lido
   *
   * @param {number} id - ID do alerta
   * @returns {Promise<Object>} Alerta atualizado
   */
  async marcarAlertaComoLido(id) {
    await this.init();
    await this.db.runAsync('UPDATE alertas SET lido = 1 WHERE id = ?', [id]);
    return await this.db.getFirstAsync('SELECT * FROM alertas WHERE id = ?', [id]);
  }

  /**
   * Marca todos os alertas como lidos
   */
  async marcarTodosAlertasComoLidos() {
    await this.init();
    await this.db.runAsync('UPDATE alertas SET lido = 1');
  }

  /**
   * Adiciona um novo alerta
   *
   * @param {Object} alerta - Dados do alerta
   * @param {number} alerta.medicamento_id - ID do medicamento (pode ser null)
   * @param {string} alerta.tipo - Tipo do alerta (ex: 'estoque_baixo', 'vencimento_proximo')
   * @param {string} alerta.mensagem - Mensagem do alerta
   * @param {string} alerta.data - Data do alerta
   * @param {number} alerta.lido - 0 = não lido, 1 = lido (padrão: 0)
   */
  async addAlerta(alerta) {
    await this.init();
    await this.db.runAsync(
      'INSERT INTO alertas (medicamento_id, tipo, mensagem, data, lido) VALUES (?, ?, ?, ?, ?)',
      [alerta.medicamento_id, alerta.tipo, alerta.mensagem, alerta.data, alerta.lido || 0]
    );
  }

  // ========================================
  // OPERAÇÕES COM ALARMES
  // ========================================

  /**
   * Função auxiliar para fazer parse seguro de dias_semana
   *
   * FORMATOS ACEITOS:
   * - Array: ["Seg", "Ter", "Qua"]
   * - String JSON: '["Seg", "Ter", "Qua"]'
   * - Objeto (antigo): {segunda: true, terca: true}
   *
   * @param {string|Array|Object} diasSemana - Dias da semana em qualquer formato
   * @returns {Array} Array com dias da semana ["Seg", "Ter", ...]
   *
   * IMPORTANTE:
   * - Converte automaticamente formato antigo para novo
   * - Retorna array vazio em caso de erro
   */
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


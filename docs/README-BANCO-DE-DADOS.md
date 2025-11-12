# 🗄️ BANCO DE DADOS - MEDICUIDADO

## 📊 ESTRUTURA DO BANCO

### **Arquivo:** `medicuidado.db`
### **Tecnologia:** SQLite (Expo SQLite)
### **Localização:** Dispositivo do usuário

---

## 📋 TABELAS

### **1. medicamentos**

Armazena informações sobre medicamentos cadastrados.

```sql
CREATE TABLE medicamentos (
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
```

**Campos:**
- `id` - Identificador único (auto-incremento)
- `nome` - Nome do medicamento (obrigatório)
- `descricao` - Descrição (opcional, REMOVIDO da UI)
- `dosagem` - Dosagem (ex: "500mg", "10ml")
- `fabricante` - Fabricante (opcional)
- `preco` - Preço (opcional)
- `categoria` - Categoria (ex: "Analgésico", "Antibiótico")
- `ativo` - Status (1 = ativo, 0 = inativo)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

**Exemplo:**
```javascript
{
  id: 1,
  nome: "Dipirona",
  dosagem: "500mg",
  categoria: "Analgésico",
  ativo: 1
}
```

---

### **2. estoque**

Controla quantidade e vencimento de medicamentos.

```sql
CREATE TABLE estoque (
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
```

**Campos:**
- `id` - Identificador único
- `medicamento_id` - Referência ao medicamento
- `quantidade` - Quantidade atual em estoque
- `minimo` - Quantidade mínima (alerta)
- `maximo` - Quantidade máxima
- `vencimento` - Data de vencimento
- `status` - Status calculado (zerado/baixo/normal)
- `lote` - Número do lote
- `data_entrada` - Data de entrada
- `created_at` - Data de criação
- `updated_at` - Data de atualização

**Status Calculados:**
- `zerado` - quantidade = 0
- `baixo` - quantidade ≤ minimo
- `normal` - quantidade > minimo

**Exemplo:**
```javascript
{
  id: 1,
  medicamento_id: 1,
  quantidade: 50,
  minimo: 10,
  maximo: 100,
  vencimento: "2024-12-31",
  status: "normal"
}
```

---

### **3. movimentacoes**

Registra entradas e saídas de estoque.

```sql
CREATE TABLE movimentacoes (
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
```

**Campos:**
- `id` - Identificador único
- `medicamento_id` - Referência ao medicamento
- `tipo` - Tipo de movimentação ("entrada" ou "saida")
- `quantidade` - Quantidade movimentada
- `data` - Data da movimentação
- `usuario` - Usuário responsável
- `motivo` - Motivo da movimentação
- `created_at` - Data/hora de criação

**Tipos:**
- `entrada` - Adição ao estoque
- `saida` - Remoção do estoque

**Exemplo:**
```javascript
{
  id: 1,
  medicamento_id: 1,
  tipo: "entrada",
  quantidade: 50,
  data: "2024-01-15",
  usuario: "Usuário",
  motivo: "Entrada manual"
}
```

---

### **4. alarmes**

Gerencia alarmes de medicamentos.

```sql
CREATE TABLE alarmes (
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
```

**Campos:**
- `id` - Identificador único
- `medicamento_id` - Referência ao medicamento
- `horario` - Horário do alarme (ex: "14:00")
- `dias_semana` - Dias da semana (JSON: `["Seg","Ter","Qua"]`)
- `ativo` - Status (1 = ativo, 0 = inativo)
- `observacoes` - Observações (opcional)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

**Dias da Semana:**
```javascript
// Armazenado como JSON string
dias_semana: '["Seg","Ter","Qua","Qui","Sex"]'

// Parseado como array
JSON.parse(dias_semana) // ["Seg","Ter","Qua","Qui","Sex"]
```

**Exemplo:**
```javascript
{
  id: 1,
  medicamento_id: 1,
  horario: "14:00",
  dias_semana: '["Seg","Ter","Qua","Qui","Sex"]',
  ativo: 1
}
```

---

### **5. alertas**

Armazena notificações e alertas do sistema.

```sql
CREATE TABLE alertas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  data DATE NOT NULL,
  lido INTEGER DEFAULT 0,
  medicamento_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
);
```

**Campos:**
- `id` - Identificador único
- `tipo` - Tipo de alerta
- `mensagem` - Mensagem do alerta
- `data` - Data do alerta
- `lido` - Status de leitura (0 = não lido, 1 = lido)
- `medicamento_id` - Referência ao medicamento (opcional)
- `created_at` - Data/hora de criação

**Tipos de Alerta:**
- `estoque_baixo` - Estoque abaixo do mínimo
- `vencimento_proximo` - Medicamento vencendo em breve
- `alarme` - Hora de tomar medicamento

**Exemplo:**
```javascript
{
  id: 1,
  tipo: "estoque_baixo",
  mensagem: "Dipirona 500mg está com estoque baixo (5 unidades)",
  data: "2024-01-15",
  lido: 0,
  medicamento_id: 1
}
```

---

## 🔗 RELACIONAMENTOS

### **Diagrama ER**

```
medicamentos (1) ──────── (N) estoque
     │
     │ (1) ──────── (N) movimentacoes
     │
     │ (1) ──────── (N) alarmes
     │
     │ (1) ──────── (N) alertas
```

### **Cascade Delete**

Quando um medicamento é deletado:
- ✅ Todos os registros de estoque são deletados
- ✅ Todas as movimentações são deletadas
- ✅ Todos os alarmes são deletados
- ✅ Todos os alertas são deletados

```sql
FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id) ON DELETE CASCADE
```

---

## 📝 OPERAÇÕES CRUD

### **CREATE (Inserir)**

```javascript
// Medicamento
await databaseService.addMedicamento({
  nome: "Dipirona",
  dosagem: "500mg",
  categoria: "Analgésico"
});

// Estoque
await databaseService.addEstoque({
  medicamento_id: 1,
  quantidade: 50,
  minimo: 10,
  vencimento: "2024-12-31"
});

// Alarme
await databaseService.addAlarme({
  medicamento_id: 1,
  horario: "14:00",
  dias_semana: '["Seg","Ter","Qua"]'
});
```

### **READ (Buscar)**

```javascript
// Todos os medicamentos
const medicamentos = await databaseService.getAllMedicamentos();

// Medicamento por ID
const medicamento = await databaseService.getMedicamentoById(1);

// Medicamento por nome e dosagem
const medicamento = await databaseService.getMedicamentoByNomeEDosagem("Dipirona", "500mg");

// Todo o estoque
const estoque = await databaseService.getAllEstoque();

// Todas as movimentações
const movimentacoes = await databaseService.getAllMovimentacoes();

// Todos os alarmes
const alarmes = await databaseService.getAllAlarmes();

// Todos os alertas
const alertas = await databaseService.getAllAlertas();
```

### **UPDATE (Atualizar)**

```javascript
// Medicamento
await databaseService.updateMedicamento(1, {
  nome: "Dipirona Sódica",
  dosagem: "500mg"
});

// Estoque (adicionar quantidade)
await databaseService.adicionarQuantidade(1, 20);

// Estoque (remover quantidade)
await databaseService.removerQuantidade(1, 10);

// Alarme
await databaseService.updateAlarme(1, {
  horario: "15:00",
  ativo: 1
});

// Alerta (marcar como lido)
await databaseService.marcarAlertaComoLido(1);
```

### **DELETE (Deletar)**

```javascript
// Medicamento (deleta tudo relacionado)
await databaseService.deleteMedicamento(1);

// Alarme
await databaseService.deleteAlarme(1);

// Alerta
await databaseService.deleteAlerta(1);
```

---

## 🔍 CONSULTAS ESPECIAIS

### **Verificar e Criar Alertas**

```javascript
await databaseService.verificarECriarAlertas();
```

Verifica:
1. Estoque baixo (quantidade ≤ mínimo)
2. Vencimento próximo (≤ 30 dias)

Cria alertas automaticamente.

### **Buscar Alarmes de Hoje**

```javascript
const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'short' });
const alarmes = await databaseService.getAllAlarmes();
const alarmesHoje = alarmes.filter(alarme => {
  const dias = JSON.parse(alarme.dias_semana);
  return dias.includes(hoje);
});
```

---

## 📊 ÍNDICES E PERFORMANCE

### **Índices Automáticos**

SQLite cria índices automaticamente para:
- PRIMARY KEY (id)
- FOREIGN KEY (medicamento_id)

### **Otimizações**

1. **Singleton Pattern** - Uma única conexão com o banco
2. **Prepared Statements** - Uso de `runAsync` com parâmetros
3. **Transações** - Operações em lote (futuro)

---

## 🔐 SEGURANÇA

### **Validações**

1. **NOT NULL** - Campos obrigatórios
2. **DEFAULT** - Valores padrão
3. **FOREIGN KEY** - Integridade referencial
4. **CASCADE DELETE** - Limpeza automática

### **Sanitização**

```javascript
// ✅ CORRETO - Usa parâmetros
await this.db.runAsync(
  'INSERT INTO medicamentos (nome, dosagem) VALUES (?, ?)',
  [nome, dosagem]
);

// ❌ ERRADO - SQL Injection
await this.db.runAsync(
  `INSERT INTO medicamentos (nome, dosagem) VALUES ('${nome}', '${dosagem}')`
);
```

---

## 📈 ESTATÍSTICAS

### **Tamanho Estimado**

- Medicamentos: ~1KB por registro
- Estoque: ~500 bytes por registro
- Movimentações: ~300 bytes por registro
- Alarmes: ~400 bytes por registro
- Alertas: ~300 bytes por registro

### **Capacidade**

SQLite suporta:
- Até 2^63 registros por tabela
- Até 2TB de dados
- Mais que suficiente para o app

---

## 🔄 MIGRAÇÃO (Futuro)

### **Versionamento**

```javascript
const DB_VERSION = 1;

async createTables() {
  // Versão 1
  await this.db.execAsync(`
    CREATE TABLE IF NOT EXISTS medicamentos ...
  `);
  
  // Versão 2 (futuro)
  // ALTER TABLE medicamentos ADD COLUMN ...
}
```

### **Backup**

```javascript
// Exportar dados
const medicamentos = await databaseService.getAllMedicamentos();
const json = JSON.stringify(medicamentos);
await FileSystem.writeAsStringAsync('backup.json', json);

// Importar dados
const json = await FileSystem.readAsStringAsync('backup.json');
const medicamentos = JSON.parse(json);
for (const med of medicamentos) {
  await databaseService.addMedicamento(med);
}
```


# 📚 DOCUMENTAÇÃO COMPLETA DO CÓDIGO - MediCuidado

> **Guia completo com comentários detalhados de cada arquivo do projeto**
> 
> **Objetivo:** Facilitar manutenção e futuras atualizações
> 
> **Última atualização:** 2025-11-05

---

## 📁 ESTRUTURA DO PROJETO

```
MediCuidado/
├── src/
│   ├── contexts/          # Contextos React (estado global)
│   ├── database/          # Serviços de banco de dados
│   ├── navigation/        # Configuração de navegação
│   ├── screens/           # Telas do aplicativo
│   └── services/          # Serviços auxiliares
├── assets/                # Imagens e recursos
├── docs/                  # Documentação
├── App.js                 # Ponto de entrada
└── package.json           # Dependências
```

---

## 🗄️ DATABASE (src/database/)

### **DatabaseService.js** - Serviço Principal de Banco de Dados

**Responsabilidades:**
- Gerenciar conexão SQLite
- Criar e manter estrutura de tabelas
- Fornecer métodos CRUD para todas as entidades
- Garantir integridade dos dados
- Migrar dados antigos

**Tabelas:**
1. **medicamentos** - Cadastro de medicamentos
2. **estoque** - Controle de quantidade e validade
3. **movimentacoes** - Histórico de entradas/saídas
4. **alertas** - Notificações do sistema
5. **alarmes** - Lembretes de horários

**Métodos Principais:**

```javascript
// INICIALIZAÇÃO
init()                          // Inicializa banco (Singleton)
ensureInitialized()             // Garante que banco está pronto
createTables()                  // Cria estrutura de tabelas
insertInitialData()             // Insere dados de exemplo
migrarDiasSemanAlarmes()        // Migra formato antigo → novo

// MEDICAMENTOS
getAllMedicamentos()            // Lista todos medicamentos ativos
getMedicamentoById(id)          // Busca por ID
medicamentoExiste(nome, dosagem) // Verifica duplicata
addMedicamento(medicamento)     // Adiciona novo
updateMedicamento(id, dados)    // Atualiza existente
deleteMedicamento(id)           // Remove (soft delete)

// ESTOQUE
getEstoqueByMedicamentoId(id)   // Busca estoque de medicamento
addEstoque(estoque)             // Adiciona entrada
updateEstoque(id, dados)        // Atualiza estoque
adicionarQuantidade(id, qtd)    // Adiciona quantidade
removerQuantidade(id, qtd)      // Remove quantidade

// MOVIMENTAÇÕES (HISTÓRICO)
getAllMovimentacoes()           // Lista todas movimentações
addMovimentacao(mov)            // Registra entrada/saída

// ALARMES
getAllAlarmes()                 // Lista todos alarmes
getAlarmesAtivos()              // Lista apenas ativos
addAlarme(alarme)               // Adiciona novo alarme
updateAlarme(id, dados)         // Atualiza alarme
deleteAlarme(id)                // Remove alarme
toggleAlarme(id)                // Ativa/desativa

// ALERTAS
getAllAlertas()                 // Lista todos alertas
marcarAlertaComoLido(id)        // Marca como lido
```

**Formato de Dados:**

```javascript
// MEDICAMENTO
{
  id: 1,
  nome: "Losartana",
  dosagem: "50mg",
  categoria: "Cardiovascular",
  fabricante: "Genérico",
  preco: 15.50,
  ativo: 1
}

// ESTOQUE
{
  id: 1,
  medicamento_id: 1,
  quantidade: 30,
  minimo: 10,
  maximo: 100,
  vencimento: "2025-12-15",
  lote: "LOTE001"
}

// ALARME
{
  id: 1,
  medicamento_id: 1,
  horario: "08:00",
  dias_semana: ["Seg", "Ter", "Qua", "Qui", "Sex"], // ARRAY!
  ativo: 1,
  observacoes: "Tomar em jejum"
}

// MOVIMENTAÇÃO
{
  id: 1,
  medicamento_id: 1,
  tipo: "entrada",  // ou "saida"
  quantidade: 30,
  data: "2024-10-22",
  usuario: "Admin",
  motivo: "Compra inicial"
}
```

**IMPORTANTE - dias_semana:**
- ✅ **FORMATO CORRETO:** Array `["Seg", "Ter", "Qua"]`
- ❌ **FORMATO ANTIGO:** Objeto `{segunda: true, terca: true}`
- 🔄 **MIGRAÇÃO:** Automática na inicialização

---

## 🎨 CONTEXTS (src/contexts/)

### **AuthContext.js** - Autenticação e Tipo de Usuário

**Responsabilidades:**
- Gerenciar tipo de usuário (cuidador/idoso)
- Persistir escolha no AsyncStorage
- Fornecer função de logout

**Estados:**
```javascript
{
  userType: 'cuidador' | 'idoso' | null,
  isLoading: boolean
}
```

**Métodos:**
```javascript
setUserType(type)  // Define tipo de usuário
logout()           // Faz logout (limpa tipo)
```

**Uso:**
```javascript
const { userType, setUserType, logout } = useAuth();
```

---

### **ThemeContext.js** - Tema Claro/Escuro

**Responsabilidades:**
- Gerenciar tema (light/dark)
- Persistir preferência no AsyncStorage
- Fornecer cores do tema

**Estados:**
```javascript
{
  isDark: boolean,
  theme: 'light' | 'dark'
}
```

**Métodos:**
```javascript
toggleTheme()      // Alterna entre claro/escuro
setTheme(theme)    // Define tema específico
```

**Uso:**
```javascript
const { isDark, toggleTheme } = useThemePreference();
```

---

## 🧭 NAVIGATION (src/navigation/)

### **RootNavigator.js** - Navegação Principal

**Responsabilidades:**
- Configurar Stack Navigator
- Definir rotas por tipo de usuário
- Gerenciar navegação entre telas

**Estrutura:**

```
SelectUserTypeScreen (Escolha: Cuidador/Idoso)
    ↓
┌─────────────────────────────────────────────────────┐
│ CUIDADOR (Acesso Completo)                          │
├─────────────────────────────────────────────────────┤
│ Main (Tab Navigator)                                │
│   ├── Home                                          │
│   ├── Medicamentos                                  │
│   ├── Alarmes                                       │
│   └── Pacientes                                     │
│                                                     │
│ Telas Adicionais:                                   │
│   ├── AddMedicamento / EditMedicamento              │
│   ├── AddAlarme / EditAlarme                        │
│   ├── Estoque                                       │
│   ├── Historico                                     │
│   ├── Notificacoes                                  │
│   ├── Perfil                                        │
│   ├── Configuracoes                                 │
│   └── Ajuda                                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ IDOSO (Interface Simplificada)                      │
├─────────────────────────────────────────────────────┤
│   ├── CuidadoHome (Medicamentos de hoje)           │
│   ├── Perfil                                        │
│   └── Ajuda                                         │
└─────────────────────────────────────────────────────┘
```

**Navegação:**
```javascript
navigation.navigate('NomeDaTela')
navigation.goBack()
navigation.navigate('Main')  // Volta para home do cuidador
```

---

## 📱 SCREENS (src/screens/)

### **TELAS DO CUIDADOR**

#### **HomeScreen.js** - Dashboard do Cuidador

**Funcionalidades:**
- Resumo de medicamentos
- Estatísticas de estoque
- Alertas importantes
- Atalhos rápidos

**Dados Exibidos:**
- Total de medicamentos
- Medicamentos com estoque baixo
- Medicamentos vencendo
- Próximos alarmes

---

#### **MedicamentosScreen.js** - Lista de Medicamentos

**Funcionalidades:**
- Listar todos medicamentos
- Buscar por nome
- Filtrar por categoria
- Ordenar (A-Z, Estoque, Vencimento)
- Adicionar novo
- Editar existente
- Ver detalhes

**Estados:**
```javascript
medicamentos       // Lista de medicamentos
searchQuery        // Texto de busca
categoriaFiltro    // Categoria selecionada
ordenacao          // Tipo de ordenação
isLoading          // Carregando
```

**Filtros:**
- Categoria: Todos, Cardiovascular, Analgésicos, etc.
- Ordenação: A-Z, Estoque Baixo, Vencimento Próximo

---

#### **AddMedicamentoScreen.js** - Adicionar Medicamento

**Campos do Formulário:**
```javascript
{
  nome: string,           // Nome do medicamento
  dosagem: string,        // Ex: "50mg"
  categoria: string,      // Seletor de botões
  fabricante: string,
  preco: number,
  quantidade: number,     // Estoque inicial
  minimo: number,         // Estoque mínimo
  maximo: number,         // Estoque máximo
  vencimento: date,
  lote: string
}
```

**Validações:**
- Nome obrigatório
- Dosagem obrigatória
- Verifica duplicata (nome + dosagem)
- Quantidade >= 0

**Categorias Disponíveis:**
- Cardiovascular
- Analgésicos
- Antibióticos
- Vitaminas
- Outros

---

#### **AlarmesScreen.js** - Lista de Alarmes

**Funcionalidades:**
- Listar alarmes por medicamento
- Filtrar por tipo (Ativos/Tomados/Todos)
- Marcar como tomado
- Ativar/desativar alarme
- Adicionar novo
- Editar existente
- Excluir

**Exibição:**
```
┌─────────────────────────────────────┐
│ 💊 Losartana 50mg                   │
│ ⏰ 08:00                            │
│ 📅 S T Q Q S S D                    │
│    ✓ ✓ ✓ ✓ ✓                       │
│ ✅ Ativo                            │
└─────────────────────────────────────┘
```

**Dias da Semana:**
- S = Seg (Segunda)
- T = Ter (Terça)
- Q = Qua (Quarta)
- Q = Qui (Quinta)
- S = Sex (Sexta)
- S = Sáb (Sábado)
- D = Dom (Domingo)

---

#### **AddAlarmeScreen.js** - Adicionar Alarme

**Campos:**
```javascript
{
  medicamento_id: number,
  horario: string,        // "HH:MM"
  dias_semana: array,     // ["Seg", "Ter", ...]
  observacoes: string
}
```

**Validações:**
- Medicamento obrigatório
- Horário obrigatório (formato HH:MM)
- Pelo menos 1 dia selecionado

**Conversão de Dias:**
```javascript
// Formulário (objeto) → Banco (array)
{segunda: true, quarta: true} → ["Seg", "Qua"]
```

---

#### **EstoqueScreen.js** - Controle de Estoque

**Funcionalidades:**
- Listar estoque de todos medicamentos
- Buscar por nome
- Filtrar por status (Baixo/Normal/Todos)
- Ordenar (A-Z, Estoque, Vencimento)
- Adicionar entrada
- Registrar saída
- Ver histórico

**Indicadores Visuais:**
- 🔴 Estoque zerado (quantidade = 0)
- 🟡 Estoque baixo (quantidade < mínimo)
- 🟢 Estoque normal
- ⚠️ Vencimento próximo (< 30 dias)

**Estatísticas:**
- Total de medicamentos
- Estoque baixo
- Vencendo em breve

---

#### **HistoricoScreen.js** - Histórico de Movimentações

**Funcionalidades:**
- Listar todas movimentações
- Filtrar por tipo (Entrada/Saída/Todos)
- Filtrar por período (Hoje/Semana/Mês/Todos)
- Ver estatísticas
- Gerar relatório

**Tipos de Movimentação:**
- 📥 Entrada (compra, doação)
- 📤 Saída (consumo, venda)

**Estatísticas:**
- Total de entradas
- Total de saídas
- Saldo

---

### **TELAS DO IDOSO**

#### **CuidadoHomeScreen.js** - Tela Principal do Idoso

**Funcionalidades:**
- Mostrar medicamentos de hoje
- Marcar como tomado
- Ligar emergência (192)
- Ver perfil

**Características:**
- Interface simplificada
- Botões grandes
- Texto legível
- Cores contrastantes

**Fluxo ao Marcar como Tomado:**
1. Usuário clica em "⏰ Tomar"
2. Confirma ação
3. Remove 1 unidade do estoque
4. Registra no histórico
5. Marca visualmente como tomado
6. Mostra feedback de sucesso

**Botões:**
- 🚨 Ligar Emergência (192) → Abre discador
- 👤 Ver Meu Perfil → Navega para Perfil
- ⏰ Tomar → Marca medicamento como tomado

---

### **TELAS COMPARTILHADAS**

#### **PerfilScreen.js** - Perfil do Usuário

**Dados Salvos (AsyncStorage):**
```javascript
{
  nome: string,
  idade: string,
  telefone: string,
  endereco: string,
  contatoEmergencia: string
}
```

**Funcionalidades:**
- Ver dados pessoais
- Editar informações
- Salvar alterações

---

#### **ConfiguracoesScreen.js** - Configurações

**Opções:**
- Tema (Claro/Escuro)
- Notificações (Ativar/Desativar)
- Som de alarmes
- Idioma
- Sobre o app

---

## 🔄 FLUXOS PRINCIPAIS

### **Fluxo 1: Adicionar Medicamento**

```
1. Cuidador clica em "+" na tela Medicamentos
   ↓
2. Preenche formulário (AddMedicamentoScreen)
   ↓
3. Valida dados (nome, dosagem, duplicata)
   ↓
4. Salva no banco:
   - INSERT em medicamentos
   - INSERT em estoque
   - INSERT em movimentacoes (entrada inicial)
   ↓
5. Volta para lista de medicamentos
   ↓
6. Lista atualizada automaticamente (useFocusEffect)
```

### **Fluxo 2: Criar Alarme**

```
1. Cuidador clica em "+" na tela Alarmes
   ↓
2. Seleciona medicamento
   ↓
3. Define horário (HH:MM)
   ↓
4. Seleciona dias da semana
   ↓
5. Converte objeto → array
   {segunda: true, quarta: true} → ["Seg", "Qua"]
   ↓
6. Salva no banco (INSERT em alarmes)
   ↓
7. Volta para lista de alarmes
```

### **Fluxo 3: Idoso Toma Medicamento**

```
1. Idoso abre app (CuidadoHomeScreen)
   ↓
2. Sistema carrega alarmes de hoje:
   - Busca todos alarmes ativos
   - Filtra por dia da semana atual
   - Ordena por horário
   ↓
3. Exibe lista de medicamentos
   ↓
4. Idoso clica em "⏰ Tomar"
   ↓
5. Confirma ação
   ↓
6. Sistema executa:
   - Remove 1 do estoque (UPDATE estoque)
   - Registra no histórico (INSERT movimentacoes)
   - Marca visualmente como tomado
   ↓
7. Mostra feedback "✅ Medicamento marcado como tomado!"
```

---

## 🔧 FUNÇÕES AUXILIARES IMPORTANTES

### **Parse Seguro de dias_semana**

```javascript
// DatabaseService._parseDiasSemana()
// Converte qualquer formato para array

Input: {segunda: true, quarta: true}
Output: ["Seg", "Qua"]

Input: '["Seg", "Qua"]'
Output: ["Seg", "Qua"]

Input: ["Seg", "Qua"]
Output: ["Seg", "Qua"]
```

### **Conversão de Dias**

```javascript
// Objeto → Array (ao salvar)
const diasMap = {
  'segunda': 'Seg',
  'terca': 'Ter',
  'quarta': 'Qua',
  'quinta': 'Qui',
  'sexta': 'Sex',
  'sabado': 'Sáb',
  'domingo': 'Dom'
};

// Array → Objeto (ao carregar para edição)
const diasMapReverse = {
  'Seg': 'segunda',
  'Ter': 'terca',
  'Qua': 'quarta',
  'Qui': 'quinta',
  'Sex': 'sexta',
  'Sáb': 'sabado',
  'Dom': 'domingo'
};
```

---

## 📊 HOOKS REACT USADOS

### **useState**
```javascript
const [valor, setValor] = useState(valorInicial);
```
Gerencia estado local do componente.

### **useEffect**
```javascript
useEffect(() => {
  // Executa ao montar componente
  carregarDados();
}, []); // [] = executa apenas uma vez
```

### **useFocusEffect**
```javascript
useFocusEffect(
  React.useCallback(() => {
    // Executa toda vez que tela ganha foco
    carregarDados();
  }, [])
);
```
Útil para recarregar dados ao voltar para tela.

### **useMemo**
```javascript
const dadosFiltrados = React.useMemo(() => {
  return dados.filter(/* ... */);
}, [dados, filtro]);
```
Otimiza performance evitando recálculos desnecessários.

---

## 🎨 PADRÕES DE ESTILO

### **Dark Mode**
```javascript
const { isDark } = useThemePreference();

<View style={[
  styles.container,
  { backgroundColor: isDark ? '#121212' : '#f5f5f5' }
]}>
```

### **Cores Padrão**
```javascript
// Light Mode
background: '#f5f5f5'
card: '#fff'
text: '#333'
border: '#e0e0e0'

// Dark Mode
background: '#121212'
card: '#1e1e1e'
text: '#fff'
border: '#333'
```

---

## ⚠️ PONTOS DE ATENÇÃO

### **1. dias_semana SEMPRE como Array**
```javascript
// ✅ CORRETO
dias_semana: ["Seg", "Ter", "Qua"]

// ❌ ERRADO
dias_semana: {segunda: true, terca: true}
```

### **2. Sempre usar ensureInitialized()**
```javascript
// ✅ CORRETO
async addMedicamento(med) {
  await this.ensureInitialized();
  // ... resto do código
}

// ❌ ERRADO
async addMedicamento(med) {
  // Pode dar erro se banco não inicializado
}
```

### **3. useFocusEffect para Recarregar**
```javascript
// ✅ CORRETO - Recarrega ao voltar
useFocusEffect(
  React.useCallback(() => {
    carregarDados();
  }, [])
);

// ❌ ERRADO - Não recarrega
useEffect(() => {
  carregarDados();
}, []);
```

### **4. Validar Dados Antes de Salvar**
```javascript
// ✅ CORRETO
if (!nome || !dosagem) {
  Alert.alert('Erro', 'Preencha todos os campos');
  return;
}

// Verifica duplicata
const existe = await databaseService.medicamentoExiste(nome, dosagem);
if (existe) {
  Alert.alert('Erro', 'Medicamento já cadastrado');
  return;
}
```

---

## 🚀 PRÓXIMAS MELHORIAS SUGERIDAS

1. **Notificações Push**
   - Instalar expo-notifications
   - Agendar notificações reais
   - Notificar quando alarme disparar

2. **Backup de Dados**
   - Exportar para JSON
   - Importar de JSON
   - Sincronizar com nuvem

3. **Relatórios**
   - Gerar PDF
   - Enviar por email
   - Estatísticas avançadas

4. **Segurança**
   - PIN para acesso
   - Biometria
   - Criptografia de dados

---

**Documentação criada em:** 2025-11-05
**Versão do App:** 1.0.0
**Autor:** Equipe MediCuidado


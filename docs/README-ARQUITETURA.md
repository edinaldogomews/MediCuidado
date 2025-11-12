# 🏗️ ARQUITETURA DO MEDICUIDADO

## 📁 ESTRUTURA DE PASTAS

```
MediCuidado/
├── src/
│   ├── contexts/           # Contextos React
│   │   ├── AuthContext.js
│   │   ├── MedicamentosContext.js
│   │   └── ThemeContext.js
│   │
│   ├── database/           # Banco de Dados
│   │   └── DatabaseService.js
│   │
│   ├── navigation/         # Navegação
│   │   └── RootNavigator.js
│   │
│   ├── screens/            # Telas
│   │   ├── AddAlarmeScreen.js
│   │   ├── AddMedicamentoScreen.js
│   │   ├── AjudaScreen.js
│   │   ├── AlarmesScreen.js
│   │   ├── ConfiguracoesScreen.js
│   │   ├── CuidadoHomeScreen.js
│   │   ├── EditAlarmeScreen.js
│   │   ├── EditMedicamentoScreen.js
│   │   ├── EstoqueScreen.js
│   │   ├── HistoricoScreen.js
│   │   ├── HomeScreen.js
│   │   ├── LoadingScreen.js
│   │   ├── MedicamentosScreen.js
│   │   ├── NotificacoesScreen.js
│   │   ├── PacientesScreen.js
│   │   ├── PerfilScreen.js
│   │   └── SelectUserTypeScreen.js
│   │
│   └── utils/              # Utilitários (futuro)
│
├── docs/                   # Documentação
│   ├── README-ANALISE-COMPLETA.md
│   ├── README-ARQUITETURA.md
│   ├── README-BANCO-DE-DADOS.md
│   ├── README-COMPONENTES.md
│   └── README-GUIA-ESTUDO.md
│
├── App.js                  # Entrada do app
├── app.json                # Configuração Expo
├── package.json            # Dependências
└── README.md               # README principal
```

---

## 🎯 PADRÕES DE ARQUITETURA

### **1. Service Layer Pattern**

Toda a lógica de banco de dados está centralizada em `DatabaseService.js`:

```javascript
// ❌ ERRADO - Acessar SQLite diretamente na tela
const db = await SQLite.openDatabaseAsync('medicuidado.db');
const result = await db.getAllAsync('SELECT * FROM medicamentos');

// ✅ CORRETO - Usar DatabaseService
import databaseService from '../database/DatabaseService';
const medicamentos = await databaseService.getAllMedicamentos();
```

**Vantagens:**
- ✅ Código reutilizável
- ✅ Fácil manutenção
- ✅ Testes mais simples
- ✅ Mudança de banco sem afetar telas

---

### **2. Context API Pattern**

Gerenciamento de estado global usando React Context:

#### **AuthContext** - Autenticação
```javascript
const { userType, login, logout } = useAuth();
```

#### **ThemeContext** - Tema
```javascript
const { isDark, themePreference, setThemePreference } = useThemePreference();
```

#### **MedicamentosContext** - Medicamentos (legado)
```javascript
// ⚠️ DEPRECADO - Usar DatabaseService ao invés
```

---

### **3. Singleton Pattern**

DatabaseService usa Singleton para garantir uma única instância:

```javascript
class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.initPromise = null;
  }
  
  async init() {
    if (this.isInitialized && this.db) {
      return; // Já inicializado
    }
    // ...
  }
}

const databaseService = new DatabaseService();
export default databaseService; // Exporta instância única
```

---

### **4. Async/Await Pattern**

Todas as operações de banco são assíncronas:

```javascript
// ✅ CORRETO
const carregarMedicamentos = async () => {
  try {
    const medicamentos = await databaseService.getAllMedicamentos();
    setMedicamentos(medicamentos);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// ❌ ERRADO - Sem async/await
const carregarMedicamentos = () => {
  const medicamentos = databaseService.getAllMedicamentos(); // Promise não resolvida!
  setMedicamentos(medicamentos); // undefined
};
```

---

## 🔄 FLUXO DE DADOS

### **Inicialização do App**

```
1. App.js inicia
   ↓
2. Inicializa DatabaseService
   ↓
3. Cria tabelas se não existirem
   ↓
4. Insere dados iniciais (se necessário)
   ↓
5. Renderiza navegação
   ↓
6. Usuário navega para telas
```

### **Fluxo de uma Tela**

```
1. Tela monta (useEffect)
   ↓
2. Chama função de carregamento
   ↓
3. DatabaseService busca dados
   ↓
4. Atualiza estado (setState)
   ↓
5. Renderiza UI
   ↓
6. Usuário interage
   ↓
7. Chama função de atualização
   ↓
8. DatabaseService atualiza banco
   ↓
9. Recarrega dados
   ↓
10. Atualiza UI
```

---

## 🗄️ CAMADAS DA APLICAÇÃO

### **Camada 1: UI (Screens)**
- Responsabilidade: Renderizar interface
- Tecnologia: React Native
- Exemplos: `MedicamentosScreen.js`, `AlarmesScreen.js`

### **Camada 2: Lógica de Negócio (Contexts)**
- Responsabilidade: Gerenciar estado global
- Tecnologia: React Context API
- Exemplos: `AuthContext.js`, `ThemeContext.js`

### **Camada 3: Serviços (DatabaseService)**
- Responsabilidade: Acesso a dados
- Tecnologia: Expo SQLite
- Exemplo: `DatabaseService.js`

### **Camada 4: Persistência (SQLite)**
- Responsabilidade: Armazenar dados
- Tecnologia: SQLite
- Arquivo: `medicuidado.db`

---

## 🔌 INTEGRAÇÕES

### **React Navigation**

```javascript
// Stack Navigator
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="MedicamentosTab" component={MedicamentosScreen} />
  <Stack.Screen name="AddMedicamento" component={AddMedicamentoScreen} />
  <Stack.Screen name="EditMedicamento" component={EditMedicamentoScreen} />
</Stack.Navigator>
```

### **Expo SQLite**

```javascript
import * as SQLite from 'expo-sqlite';

// Abrir banco
this.db = await SQLite.openDatabaseAsync('medicuidado.db');

// Executar SQL
await this.db.execAsync(`CREATE TABLE ...`);

// Buscar dados
const result = await this.db.getAllAsync('SELECT * FROM medicamentos');

// Inserir dados
await this.db.runAsync('INSERT INTO medicamentos ...', [params]);
```

### **AsyncStorage**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvar
await AsyncStorage.setItem('@medicuidado:perfil', JSON.stringify(perfil));

// Carregar
const perfil = await AsyncStorage.getItem('@medicuidado:perfil');
const perfilObj = JSON.parse(perfil);
```

---

## 🎨 PADRÕES DE UI

### **Dark Mode**

Todas as telas suportam dark mode:

```javascript
const { isDark } = useThemePreference();

<View style={[
  styles.container,
  { backgroundColor: isDark ? '#121212' : '#f5f5f5' }
]}>
  <Text style={{ color: isDark ? '#fff' : '#333' }}>
    Texto
  </Text>
</View>
```

### **Loading States**

```javascript
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#9C27B0" />
      <Text>Carregando...</Text>
    </View>
  );
}
```

### **Empty States**

```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyText}>Nenhum item encontrado</Text>
    </View>
  }
/>
```

---

## 🔐 SEGURANÇA

### **Validação de Dados**

```javascript
// Validar antes de salvar
if (!nome || !dosagem) {
  Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
  return;
}

// Validar duplicatas
const existente = await databaseService.getMedicamentoByNomeEDosagem(nome, dosagem);
if (existente) {
  Alert.alert('Erro', 'Medicamento já cadastrado');
  return;
}
```

### **Tratamento de Erros**

```javascript
try {
  await databaseService.addMedicamento(medicamento);
  Alert.alert('Sucesso', 'Medicamento adicionado!');
} catch (error) {
  console.error('Erro ao adicionar medicamento:', error);
  Alert.alert('Erro', 'Não foi possível adicionar o medicamento');
}
```

---

## 📱 NAVEGAÇÃO

### **Estrutura de Navegação**

```
RootNavigator
├── SelectUserType (Seleção de tipo de usuário)
├── Main (Tab Navigator)
│   ├── Home
│   ├── Medicamentos
│   ├── Alarmes
│   ├── Estoque
│   └── Histórico
├── AddMedicamento
├── EditMedicamento
├── AddAlarme
├── EditAlarme
├── Notificacoes
├── Perfil
├── Configuracoes
└── Ajuda
```

### **Navegação entre Telas**

```javascript
// Navegar para tela
navigation.navigate('AddMedicamento');

// Navegar com parâmetros
navigation.navigate('EditMedicamento', { medicamentoId: 1 });

// Voltar
navigation.goBack();

// Receber parâmetros
const { medicamentoId } = route.params;
```

---

## 🧪 BOAS PRÁTICAS

### **1. Sempre usar DatabaseService**
```javascript
// ✅ CORRETO
import databaseService from '../database/DatabaseService';
const medicamentos = await databaseService.getAllMedicamentos();

// ❌ ERRADO
import * as SQLite from 'expo-sqlite';
const db = await SQLite.openDatabaseAsync('medicuidado.db');
```

### **2. Sempre usar useFocusEffect**
```javascript
// ✅ CORRETO - Recarrega ao voltar para tela
useFocusEffect(
  React.useCallback(() => {
    carregarDados();
  }, [])
);

// ❌ ERRADO - Só carrega uma vez
useEffect(() => {
  carregarDados();
}, []);
```

### **3. Sempre tratar erros**
```javascript
// ✅ CORRETO
try {
  await databaseService.addMedicamento(medicamento);
} catch (error) {
  console.error('Erro:', error);
  Alert.alert('Erro', 'Operação falhou');
}

// ❌ ERRADO
await databaseService.addMedicamento(medicamento); // Sem try/catch
```

### **4. Sempre validar dados**
```javascript
// ✅ CORRETO
if (!nome || !dosagem) {
  Alert.alert('Erro', 'Preencha todos os campos');
  return;
}

// ❌ ERRADO
await databaseService.addMedicamento({ nome, dosagem }); // Sem validação
```

---

## 📊 PERFORMANCE

### **Otimizações Implementadas**

1. **Singleton Pattern** - Uma única instância do banco
2. **useMemo** - Cache de cálculos pesados
3. **useCallback** - Cache de funções
4. **FlatList** - Renderização eficiente de listas
5. **Lazy Loading** - Carregamento sob demanda

### **Exemplo de useMemo**

```javascript
const estoqueProcessado = React.useMemo(() => {
  let resultado = [...estoque];
  
  // Filtros e ordenação
  if (searchQuery) {
    resultado = resultado.filter(item => 
      item.medicamento.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return resultado;
}, [estoque, searchQuery]);
```

---

## 🔄 CICLO DE VIDA

### **Inicialização**
1. App.js monta
2. DatabaseService.init()
3. Cria tabelas
4. Renderiza navegação

### **Navegação para Tela**
1. Tela monta (useEffect)
2. Carrega dados (DatabaseService)
3. Atualiza estado (setState)
4. Renderiza UI

### **Interação do Usuário**
1. Usuário clica em botão
2. Função é chamada
3. Valida dados
4. Atualiza banco (DatabaseService)
5. Recarrega dados
6. Atualiza UI

### **Saída da Tela**
1. Tela desmonta
2. Cleanup (se necessário)
3. Libera recursos


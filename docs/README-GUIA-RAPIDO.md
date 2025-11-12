# ⚡ GUIA RÁPIDO - MediCuidado

> **Referência rápida para desenvolvedores**
> 
> **Use este guia quando precisar:**
> - Adicionar nova funcionalidade
> - Corrigir bug
> - Entender fluxo de dados
> - Modificar tela existente

---

## 🎯 ONDE ESTÁ CADA COISA?

### **Preciso adicionar um novo campo no medicamento**
📁 `src/database/DatabaseService.js`
1. Adicionar coluna na tabela `medicamentos` (método `createTables`)
2. Atualizar métodos `addMedicamento` e `updateMedicamento`

📁 `src/screens/AddMedicamentoScreen.js`
3. Adicionar campo no formulário
4. Adicionar no estado `formData`
5. Adicionar validação

📁 `src/screens/EditMedicamentoScreen.js`
6. Adicionar campo no formulário
7. Carregar valor ao abrir tela

📁 `src/screens/MedicamentosScreen.js`
8. Exibir novo campo na lista (se necessário)

---

### **Preciso adicionar uma nova tela**

1. **Criar arquivo da tela:**
   ```
   src/screens/MinhaNovaScreen.js
   ```

2. **Registrar no navegador:**
   📁 `src/navigation/RootNavigator.js`
   ```javascript
   import MinhaNovaScreen from '../screens/MinhaNovaScreen';
   
   // Adicionar na lista de screens
   <Stack.Screen name="MinhaNova" component={MinhaNovaScreen} />
   ```

3. **Navegar para tela:**
   ```javascript
   navigation.navigate('MinhaNova');
   ```

---

### **Preciso modificar o banco de dados**

📁 `src/database/DatabaseService.js`

**Adicionar nova tabela:**
```javascript
async createTables() {
  await this.db.execAsync(`
    CREATE TABLE IF NOT EXISTS minha_tabela (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campo1 TEXT,
      campo2 INTEGER
    );
  `);
}
```

**Adicionar nova coluna (CUIDADO!):**
```javascript
// Opção 1: Recriar banco (perde dados)
// Deletar app e reinstalar

// Opção 2: Migração (recomendado)
async migrarNovaColuna() {
  try {
    await this.db.execAsync(`
      ALTER TABLE medicamentos 
      ADD COLUMN nova_coluna TEXT DEFAULT '';
    `);
  } catch (error) {
    // Coluna já existe, ignora
  }
}
```

---

### **Preciso adicionar validação**

📁 Tela de formulário (Add/Edit)

```javascript
const salvar = async () => {
  // Validação de campo obrigatório
  if (!formData.nome) {
    Alert.alert('Erro', 'Nome é obrigatório');
    return;
  }

  // Validação de formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    Alert.alert('Erro', 'Email inválido');
    return;
  }

  // Validação de duplicata
  const existe = await databaseService.verificarDuplicata(formData.nome);
  if (existe) {
    Alert.alert('Erro', 'Já existe um registro com este nome');
    return;
  }

  // Salvar
  await databaseService.salvar(formData);
};
```

---

### **Preciso adicionar filtro/busca**

📁 Tela de listagem

```javascript
// Estado
const [searchQuery, setSearchQuery] = useState('');
const [filtro, setFiltro] = useState('todos');

// Filtrar dados
const dadosFiltrados = React.useMemo(() => {
  let resultado = dados;

  // Busca por texto
  if (searchQuery) {
    resultado = resultado.filter(item =>
      item.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filtro por categoria
  if (filtro !== 'todos') {
    resultado = resultado.filter(item => item.categoria === filtro);
  }

  return resultado;
}, [dados, searchQuery, filtro]);

// UI
<TextInput
  placeholder="Buscar..."
  value={searchQuery}
  onChangeText={setSearchQuery}
/>
```

---

### **Preciso adicionar ordenação**

```javascript
// Estado
const [ordenacao, setOrdenacao] = useState('nome');

// Ordenar dados
const dadosOrdenados = React.useMemo(() => {
  const copia = [...dados];

  switch (ordenacao) {
    case 'nome':
      return copia.sort((a, b) => a.nome.localeCompare(b.nome));
    
    case 'data':
      return copia.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    case 'quantidade':
      return copia.sort((a, b) => a.quantidade - b.quantidade);
    
    default:
      return copia;
  }
}, [dados, ordenacao]);
```

---

## 🔧 TAREFAS COMUNS

### **Adicionar novo método no DatabaseService**

```javascript
// src/database/DatabaseService.js

async meuNovoMetodo(parametro) {
  // 1. Garantir que banco está inicializado
  await this.ensureInitialized();

  // 2. Executar query
  const resultado = await this.db.getAllAsync(
    'SELECT * FROM tabela WHERE campo = ?',
    [parametro]
  );

  // 3. Retornar resultado
  return resultado;
}
```

**Tipos de queries:**
```javascript
// SELECT múltiplos
const lista = await this.db.getAllAsync('SELECT * FROM tabela');

// SELECT único
const item = await this.db.getFirstAsync('SELECT * FROM tabela WHERE id = ?', [id]);

// INSERT
const result = await this.db.runAsync(
  'INSERT INTO tabela (campo1, campo2) VALUES (?, ?)',
  [valor1, valor2]
);
const novoId = result.lastInsertRowId;

// UPDATE
await this.db.runAsync(
  'UPDATE tabela SET campo = ? WHERE id = ?',
  [novoValor, id]
);

// DELETE
await this.db.runAsync('DELETE FROM tabela WHERE id = ?', [id]);
```

---

### **Adicionar loading indicator**

```javascript
// Estado
const [isLoading, setIsLoading] = useState(false);

// Função assíncrona
const carregarDados = async () => {
  setIsLoading(true);
  try {
    const dados = await databaseService.getDados();
    setDados(dados);
  } catch (error) {
    console.error('Erro:', error);
    Alert.alert('Erro', 'Não foi possível carregar dados');
  } finally {
    setIsLoading(false);
  }
};

// UI
if (isLoading) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text>Carregando...</Text>
    </View>
  );
}
```

---

### **Adicionar empty state**

```javascript
// Verificar se lista está vazia
{dados.length === 0 ? (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>📋</Text>
    <Text style={styles.emptyTitle}>Nenhum item encontrado</Text>
    <Text style={styles.emptyText}>
      Adicione um novo item clicando no botão +
    </Text>
  </View>
) : (
  <FlatList
    data={dados}
    renderItem={renderItem}
    keyExtractor={item => item.id.toString()}
  />
)}
```

---

### **Adicionar confirmação antes de deletar**

```javascript
const handleExcluir = (item) => {
  Alert.alert(
    'Confirmar Exclusão',
    `Deseja realmente excluir ${item.nome}?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await databaseService.delete(item.id);
            await carregarDados(); // Recarrega lista
            Alert.alert('Sucesso', 'Item excluído com sucesso');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir');
          }
        }
      }
    ]
  );
};
```

---

### **Adicionar dark mode em componente**

```javascript
import { useThemePreference } from '../contexts/ThemeContext';

const MeuComponente = () => {
  const { isDark } = useThemePreference();

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#121212' : '#f5f5f5' }
    ]}>
      <Text style={{ color: isDark ? '#fff' : '#333' }}>
        Meu texto
      </Text>
    </View>
  );
};
```

---

### **Salvar dados no AsyncStorage**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Salvar
const salvar = async (chave, valor) => {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (error) {
    console.error('Erro ao salvar:', error);
  }
};

// Carregar
const carregar = async (chave) => {
  try {
    const valor = await AsyncStorage.getItem(chave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    console.error('Erro ao carregar:', error);
    return null;
  }
};

// Remover
const remover = async (chave) => {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (error) {
    console.error('Erro ao remover:', error);
  }
};
```

---

## 🐛 DEBUGGING

### **Ver dados do banco**

```javascript
// Adicionar temporariamente em qualquer tela
useEffect(() => {
  const debug = async () => {
    const dados = await databaseService.getAllMedicamentos();
    console.log('📊 Medicamentos:', dados);
  };
  debug();
}, []);
```

### **Ver estado do componente**

```javascript
useEffect(() => {
  console.log('📊 Estado atual:', {
    medicamentos,
    searchQuery,
    filtro,
    isLoading
  });
}, [medicamentos, searchQuery, filtro, isLoading]);
```

### **Ver props recebidas**

```javascript
const MeuComponente = (props) => {
  console.log('📊 Props recebidas:', props);
  // ...
};
```

---

## ⚠️ ERROS COMUNS E SOLUÇÕES

### **Erro: "Cannot read property 'X' of undefined"**

**Causa:** Tentando acessar propriedade de objeto nulo/undefined

**Solução:**
```javascript
// ❌ ERRADO
const nome = medicamento.nome;

// ✅ CORRETO
const nome = medicamento?.nome || 'Sem nome';
```

---

### **Erro: "JSON Parse error"**

**Causa:** Tentando fazer parse de JSON inválido

**Solução:**
```javascript
// ❌ ERRADO
const dados = JSON.parse(valor);

// ✅ CORRETO
let dados = [];
try {
  dados = JSON.parse(valor);
} catch (error) {
  console.error('Erro ao fazer parse:', error);
  dados = [];
}
```

---

### **Erro: "Database not initialized"**

**Causa:** Tentando usar banco antes de inicializar

**Solução:**
```javascript
// ✅ SEMPRE usar ensureInitialized()
async meuMetodo() {
  await this.ensureInitialized();
  // ... resto do código
}
```

---

### **Erro: "Navigation not found"**

**Causa:** Tela não registrada no navegador

**Solução:**
1. Verificar se tela está importada em `RootNavigator.js`
2. Verificar se `<Stack.Screen>` foi adicionado
3. Verificar nome da tela (case-sensitive)

---

### **Lista não atualiza após adicionar/editar**

**Causa:** Não está recarregando dados

**Solução:**
```javascript
// Usar useFocusEffect ao invés de useEffect
useFocusEffect(
  React.useCallback(() => {
    carregarDados();
  }, [])
);
```

---

## 📝 CHECKLIST PARA NOVA FUNCIONALIDADE

- [ ] Criar/modificar tabela no banco (se necessário)
- [ ] Adicionar métodos no DatabaseService
- [ ] Criar tela (se necessário)
- [ ] Registrar tela no RootNavigator
- [ ] Adicionar validações
- [ ] Adicionar loading indicator
- [ ] Adicionar empty state
- [ ] Adicionar tratamento de erros
- [ ] Testar dark mode
- [ ] Testar em ambos perfis (cuidador/idoso)
- [ ] Adicionar comentários no código
- [ ] Atualizar documentação

---

## 🚀 COMANDOS ÚTEIS

```bash
# Iniciar app
npx expo start

# Limpar cache
npx expo start --clear

# Ver logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Instalar dependência
npm install nome-do-pacote

# Atualizar dependências
npm update

# Ver versão do Expo
npx expo --version
```

---

## 📚 RECURSOS ÚTEIS

- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Expo Docs:** https://docs.expo.dev/
- **React Navigation:** https://reactnavigation.org/docs/getting-started
- **Expo SQLite:** https://docs.expo.dev/versions/latest/sdk/sqlite/

---

**Última atualização:** 2025-11-05


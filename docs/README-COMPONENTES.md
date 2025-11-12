# 🧩 COMPONENTES E TELAS - MEDICUIDADO

## 📱 TELAS PRINCIPAIS

### **1. MedicamentosScreen** 💊

**Arquivo:** `src/screens/MedicamentosScreen.js`

**Funcionalidades:**
- ✅ Lista todos os medicamentos
- ✅ Busca por nome
- ✅ Filtro por categoria
- ✅ Alerta de estoque baixo
- ✅ Adicionar medicamento
- ✅ Editar medicamento
- ✅ Excluir medicamento
- ✅ Dark mode
- ✅ Loading indicator
- ✅ Mensagem de lista vazia

**Componentes Usados:**
- `FlatList` - Lista de medicamentos
- `TextInput` - Campo de busca
- `TouchableOpacity` - Botões
- `ActivityIndicator` - Loading
- `ScrollView` - Filtros horizontais

**Estados:**
```javascript
const [medicamentos, setMedicamentos] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
```

**Funções Principais:**
```javascript
carregarMedicamentos()  // Carrega do banco
handleDelete(id)        // Deleta medicamento
handleEdit(id)          // Navega para edição
handleAdd()             // Navega para adicionar
```

---

### **2. AlarmesScreen** ⏰

**Arquivo:** `src/screens/AlarmesScreen.js`

**Funcionalidades:**
- ✅ Lista todos os alarmes
- ✅ Busca por medicamento
- ✅ Filtro por status (Todos/Ativos/Tomados/Inativos)
- ✅ Marcar como tomado
- ✅ Ativar/desativar alarme
- ✅ Adicionar alarme
- ✅ Editar alarme
- ✅ Excluir alarme
- ✅ Estatísticas (Ativos/Hoje/Total)
- ✅ Próximo alarme
- ✅ Badge "HOJE"
- ✅ Dias da semana abreviados

**Estados:**
```javascript
const [alarmes, setAlarmes] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [filtroStatus, setFiltroStatus] = useState('Todos');
const [alarmesTomados, setAlarmesTomados] = useState([]);
```

**Funções Principais:**
```javascript
carregarAlarmes()           // Carrega do banco
marcarComoTomado(id)        // Marca alarme como tomado
toggleAlarme(id, ativo)     // Ativa/desativa
handleDelete(id)            // Deleta alarme
```

**Cálculos:**
```javascript
// Verifica se é hoje
const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'short' });
const eHoje = diasArray.includes(hoje);

// Próximo alarme
const proximoAlarme = alarmesHoje
  .filter(a => a.ativo && a.horario > horaAtual)
  .sort((a, b) => a.horario.localeCompare(b.horario))[0];
```

---

### **3. EstoqueScreen** 📦

**Arquivo:** `src/screens/EstoqueScreen.js`

**Funcionalidades:**
- ✅ Lista todo o estoque
- ✅ Busca por medicamento
- ✅ Filtro por status (Todos/Baixo/Normal)
- ✅ Ordenação (A-Z/Estoque/Vencimento)
- ✅ Adicionar entrada
- ✅ Adicionar saída
- ✅ Cálculo de dias até vencimento
- ✅ Alerta de estoque zerado
- ✅ Estatísticas (Zerado/Baixo/Vencendo/Total)

**Estados:**
```javascript
const [estoque, setEstoque] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState('');
const [filtroStatus, setFiltroStatus] = useState('Todos');
const [ordenacao, setOrdenacao] = useState('alfabetica');
const [modalVisible, setModalVisible] = useState(false);
const [modalSaidaVisible, setModalSaidaVisible] = useState(false);
```

**Funções Principais:**
```javascript
carregarEstoque()           // Carrega do banco
handleAdicionarEntrada()    // Adiciona quantidade
handleAdicionarSaida()      // Remove quantidade
```

**Cálculos:**
```javascript
// Dias até vencimento
const hoje = new Date();
const dataVenc = new Date(item.vencimento);
const diffTime = dataVenc - hoje;
const diasVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// Status
if (diasVencimento <= 0) statusVencimento = 'vencido';
else if (diasVencimento <= 30) statusVencimento = 'vencendo';
```

---

### **4. HistoricoScreen** 📋

**Arquivo:** `src/screens/HistoricoScreen.js`

**Funcionalidades:**
- ✅ Lista todas as movimentações
- ✅ Filtro por tipo (Todos/Entradas/Saídas)
- ✅ Filtro por período (Todos/Hoje/Semana/Mês)
- ✅ Ordenação por data (mais recente primeiro)
- ✅ Estatísticas (Entradas/Saídas/Total)
- ✅ Botão de relatório

**Estados:**
```javascript
const [historico, setHistorico] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [filtroAtivo, setFiltroAtivo] = useState('todos');
const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
```

**Funções Principais:**
```javascript
carregarHistorico()  // Carrega do banco
```

**Filtros:**
```javascript
// Filtro por período
if (filtroPeriodo === 'hoje') {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  historicoFiltrado = historicoFiltrado.filter(item => {
    const itemData = new Date(item.data);
    itemData.setHours(0, 0, 0, 0);
    return itemData.getTime() === hoje.getTime();
  });
}
```

---

### **5. NotificacoesScreen** 🔔

**Arquivo:** `src/screens/NotificacoesScreen.js`

**Funcionalidades:**
- ✅ Lista todas as notificações
- ✅ Filtro por tipo
- ✅ Marcar como lida
- ✅ Excluir notificação
- ⚠️ Falta loading indicator
- ⚠️ Falta mensagem de lista vazia

**Estados:**
```javascript
const [notificacoes, setNotificacoes] = useState([]);
```

**Funções Principais:**
```javascript
carregarNotificacoes()   // Carrega alertas do banco
marcarComoLida(id)       // Marca alerta como lido
excluirNotificacao(id)   // Deleta alerta
```

**Tipos de Notificação:**
- `estoque_baixo` - Estoque abaixo do mínimo
- `vencimento_proximo` - Medicamento vencendo
- `alarme` - Hora do medicamento

---

### **6. PerfilScreen** 👤

**Arquivo:** `src/screens/PerfilScreen.js`

**Funcionalidades:**
- ✅ Exibir perfil do usuário
- ✅ Editar perfil
- ✅ Salvar perfil (AsyncStorage)
- ✅ Logout
- ✅ Dark mode
- ✅ Loading indicator

**Estados:**
```javascript
const [editando, setEditando] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [perfil, setPerfil] = useState({
  nome: '',
  idade: '',
  telefone: '',
  email: '',
  endereco: '',
  contatoEmergencia: ''
});
```

**Funções Principais:**
```javascript
carregarPerfil()  // Carrega do AsyncStorage
salvarPerfil()    // Salva no AsyncStorage
confirmarLogout() // Logout
```

**Armazenamento:**
```javascript
// Salvar
await AsyncStorage.setItem('@medicuidado:perfil', JSON.stringify(perfil));

// Carregar
const perfilSalvo = await AsyncStorage.getItem('@medicuidado:perfil');
const perfil = JSON.parse(perfilSalvo);
```

---

### **7. ConfiguracoesScreen** ⚙️

**Arquivo:** `src/screens/ConfiguracoesScreen.js`

**Funcionalidades:**
- ✅ Toggle de notificações
- ✅ Toggle de som
- ✅ Toggle de modo escuro
- ⚠️ Segurança (não implementado)
- ⚠️ Backup (não implementado)
- ⚠️ Sobre (não implementado)

**Estados:**
```javascript
const [notificacoes, setNotificacoes] = useState(true);
const [somAlarme, setSomAlarme] = useState(true);
const { themePreference, setThemePreference } = useThemePreference();
```

**Opções:**
```javascript
const opcoes = [
  { titulo: 'Notificações', tipo: 'switch', valor: notificacoes },
  { titulo: 'Som do Alarme', tipo: 'switch', valor: somAlarme },
  { titulo: 'Modo Escuro', tipo: 'switch', valor: modoEscuro },
  { titulo: 'Segurança', tipo: 'navegacao' },
  { titulo: 'Backup', tipo: 'navegacao' },
  { titulo: 'Sobre o App', tipo: 'navegacao' }
];
```

---

## 🎨 PADRÕES DE COMPONENTES

### **Header Padrão**

```javascript
<View style={styles.header}>
  <TouchableOpacity style={styles.backButton} onPress={handleBack}>
    <Text style={styles.backButtonText}>← Voltar</Text>
  </TouchableOpacity>
  <Text style={styles.title}>Título</Text>
  <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
    <Text style={styles.actionButtonText}>Ação</Text>
  </TouchableOpacity>
</View>
```

### **Loading State**

```javascript
if (isLoading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>...</View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    </SafeAreaView>
  );
}
```

### **Empty State**

```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyText}>Nenhum item encontrado</Text>
      <Text style={styles.emptySubtext}>Adicione itens para começar</Text>
    </View>
  }
/>
```

### **Card Padrão**

```javascript
<View style={[
  styles.card,
  { backgroundColor: isDark ? '#1e1e1e' : '#fff' }
]}>
  <View style={styles.cardHeader}>
    <Text style={[styles.cardTitle, { color: isDark ? '#ddd' : '#333' }]}>
      Título
    </Text>
  </View>
  <View style={styles.cardBody}>
    <Text style={[styles.cardText, { color: isDark ? '#bbb' : '#555' }]}>
      Conteúdo
    </Text>
  </View>
</View>
```

### **Filtros Horizontais**

```javascript
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.filtrosScroll}
>
  {filtros.map(filtro => (
    <TouchableOpacity
      key={filtro.key}
      style={[
        styles.filtroButton,
        { backgroundColor: filtroAtivo === filtro.key ? '#9C27B0' : '#f0f0f0' }
      ]}
      onPress={() => setFiltroAtivo(filtro.key)}
    >
      <Text style={styles.filtroText}>{filtro.label}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

### **Modal Padrão**

```javascript
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
      <Text style={styles.modalTitle}>Título</Text>
      
      {/* Conteúdo */}
      
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
```

---

## 🎨 ESTILOS PADRÃO

### **Container**

```javascript
container: {
  flex: 1,
  backgroundColor: '#f5f5f5',
}
```

### **Header**

```javascript
header: {
  backgroundColor: '#9C27B0',
  padding: 20,
  paddingTop: 40,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}
```

### **Card**

```javascript
card: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 15,
  marginBottom: 15,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
}
```

### **Button**

```javascript
button: {
  backgroundColor: '#9C27B0',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
}
```

---

## 🔄 HOOKS USADOS

### **useState**
```javascript
const [data, setData] = useState([]);
```

### **useEffect**
```javascript
useEffect(() => {
  carregarDados();
}, []);
```

### **useFocusEffect**
```javascript
useFocusEffect(
  React.useCallback(() => {
    carregarDados();
  }, [])
);
```

### **useMemo**
```javascript
const dadosProcessados = React.useMemo(() => {
  return data.filter(item => item.ativo);
}, [data]);
```

### **useCallback**
```javascript
const handleDelete = React.useCallback((id) => {
  // ...
}, []);
```

### **Custom Hooks**
```javascript
const { isDark } = useThemePreference();
const { userType, logout } = useAuth();
```

---

## 📊 NAVEGAÇÃO

### **Navegar para Tela**
```javascript
navigation.navigate('AddMedicamento');
```

### **Navegar com Parâmetros**
```javascript
navigation.navigate('EditMedicamento', { medicamentoId: 1 });
```

### **Receber Parâmetros**
```javascript
const { medicamentoId } = route.params;
```

### **Voltar**
```javascript
navigation.goBack();
```

---

## 🎯 BOAS PRÁTICAS

1. **Sempre usar SafeAreaView**
2. **Sempre tratar dark mode**
3. **Sempre mostrar loading**
4. **Sempre mostrar empty state**
5. **Sempre usar useFocusEffect para recarregar**
6. **Sempre validar dados antes de salvar**
7. **Sempre tratar erros com try/catch**
8. **Sempre usar ActivityIndicator para loading**
9. **Sempre usar FlatList para listas grandes**
10. **Sempre usar useMemo para cálculos pesados**


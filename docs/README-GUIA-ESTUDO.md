# 📚 GUIA DE ESTUDO - MEDICUIDADO

## 🎯 OBJETIVO

Este guia vai te ajudar a entender completamente o projeto MediCuidado, desde os conceitos básicos até os avançados.

---

## 📖 ÍNDICE

1. [Conceitos Básicos](#1-conceitos-básicos)
2. [React Native Fundamentals](#2-react-native-fundamentals)
3. [Banco de Dados SQLite](#3-banco-de-dados-sqlite)
4. [Arquitetura do Projeto](#4-arquitetura-do-projeto)
5. [Fluxo de Dados](#5-fluxo-de-dados)
6. [Exercícios Práticos](#6-exercícios-práticos)
7. [Debugging e Troubleshooting](#7-debugging-e-troubleshooting)
8. [Próximos Passos](#8-próximos-passos)

---

## 1. CONCEITOS BÁSICOS

### **1.1 O que é React Native?**

React Native é um framework para criar apps mobile usando JavaScript e React.

**Vantagens:**
- ✅ Código compartilhado entre iOS e Android
- ✅ Hot reload (atualização instantânea)
- ✅ Grande comunidade
- ✅ Performance nativa

**Exemplo:**
```javascript
// React Native
import { View, Text } from 'react-native';

function App() {
  return (
    <View>
      <Text>Hello World!</Text>
    </View>
  );
}
```

### **1.2 O que é Expo?**

Expo é uma plataforma que facilita o desenvolvimento React Native.

**Vantagens:**
- ✅ Não precisa configurar Android Studio/Xcode
- ✅ Testa no celular com Expo Go
- ✅ Bibliotecas prontas (SQLite, Camera, etc)
- ✅ Build na nuvem

**Comandos:**
```bash
# Iniciar projeto
npx expo start

# Rodar no Android
npx expo start --android

# Rodar no iOS
npx expo start --ios
```

### **1.3 O que é SQLite?**

SQLite é um banco de dados leve que roda no dispositivo.

**Vantagens:**
- ✅ Não precisa de servidor
- ✅ Rápido
- ✅ Confiável
- ✅ Funciona offline

**Exemplo:**
```javascript
// Criar tabela
CREATE TABLE medicamentos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);

// Inserir
INSERT INTO medicamentos (nome) VALUES ('Dipirona');

// Buscar
SELECT * FROM medicamentos;
```

---

## 2. REACT NATIVE FUNDAMENTALS

### **2.1 Componentes Básicos**

#### **View** - Container
```javascript
<View style={{ flex: 1, backgroundColor: '#fff' }}>
  {/* Conteúdo */}
</View>
```

#### **Text** - Texto
```javascript
<Text style={{ fontSize: 16, color: '#333' }}>
  Olá Mundo!
</Text>
```

#### **TouchableOpacity** - Botão
```javascript
<TouchableOpacity onPress={() => alert('Clicou!')}>
  <Text>Clique Aqui</Text>
</TouchableOpacity>
```

#### **TextInput** - Campo de texto
```javascript
<TextInput
  value={nome}
  onChangeText={setNome}
  placeholder="Digite seu nome"
/>
```

#### **FlatList** - Lista
```javascript
<FlatList
  data={items}
  keyExtractor={item => item.id.toString()}
  renderItem={({ item }) => <Text>{item.nome}</Text>}
/>
```

### **2.2 Hooks**

#### **useState** - Estado
```javascript
const [nome, setNome] = useState('');

// Atualizar
setNome('João');
```

#### **useEffect** - Efeito colateral
```javascript
useEffect(() => {
  // Executa quando componente monta
  carregarDados();
}, []); // [] = só uma vez
```

#### **useFocusEffect** - Quando tela ganha foco
```javascript
useFocusEffect(
  React.useCallback(() => {
    // Executa toda vez que volta para tela
    carregarDados();
  }, [])
);
```

### **2.3 Navegação**

```javascript
// Navegar
navigation.navigate('Detalhes');

// Navegar com parâmetros
navigation.navigate('Detalhes', { id: 1 });

// Receber parâmetros
const { id } = route.params;

// Voltar
navigation.goBack();
```

---

## 3. BANCO DE DADOS SQLITE

### **3.1 Estrutura**

```
medicuidado.db
├── medicamentos
├── estoque
├── movimentacoes
├── alarmes
└── alertas
```

### **3.2 Operações CRUD**

#### **CREATE - Inserir**
```javascript
await databaseService.addMedicamento({
  nome: 'Dipirona',
  dosagem: '500mg'
});
```

#### **READ - Buscar**
```javascript
// Todos
const medicamentos = await databaseService.getAllMedicamentos();

// Por ID
const medicamento = await databaseService.getMedicamentoById(1);
```

#### **UPDATE - Atualizar**
```javascript
await databaseService.updateMedicamento(1, {
  nome: 'Dipirona Sódica'
});
```

#### **DELETE - Deletar**
```javascript
await databaseService.deleteMedicamento(1);
```

### **3.3 Relacionamentos**

```
medicamentos (1) ──── (N) estoque
     │
     ├──── (N) movimentacoes
     │
     ├──── (N) alarmes
     │
     └──── (N) alertas
```

**Cascade Delete:**
Quando deleta medicamento, deleta tudo relacionado.

---

## 4. ARQUITETURA DO PROJETO

### **4.1 Camadas**

```
UI (Screens)
    ↓
Lógica (Contexts)
    ↓
Serviços (DatabaseService)
    ↓
Persistência (SQLite)
```

### **4.2 Fluxo de uma Tela**

```
1. Tela monta (useEffect)
   ↓
2. Carrega dados (DatabaseService)
   ↓
3. Atualiza estado (setState)
   ↓
4. Renderiza UI
   ↓
5. Usuário interage
   ↓
6. Atualiza banco
   ↓
7. Recarrega dados
   ↓
8. Atualiza UI
```

### **4.3 Padrões Usados**

- **Service Layer** - DatabaseService
- **Singleton** - Uma instância do banco
- **Context API** - Estado global
- **Async/Await** - Operações assíncronas

---

## 5. FLUXO DE DADOS

### **5.1 Adicionar Medicamento**

```
1. Usuário preenche formulário
   ↓
2. Clica em "Salvar"
   ↓
3. Valida dados
   ↓
4. Chama databaseService.addMedicamento()
   ↓
5. Insere no banco
   ↓
6. Cria registro de estoque
   ↓
7. Registra movimentação
   ↓
8. Verifica alertas
   ↓
9. Volta para lista
   ↓
10. Recarrega medicamentos
```

### **5.2 Adicionar Alarme**

```
1. Usuário seleciona medicamento
   ↓
2. Define horário e dias
   ↓
3. Clica em "Salvar"
   ↓
4. Valida dados
   ↓
5. Chama databaseService.addAlarme()
   ↓
6. Insere no banco
   ↓
7. Agenda notificação (futuro)
   ↓
8. Volta para lista
   ↓
9. Recarrega alarmes
```

### **5.3 Entrada/Saída de Estoque**

```
1. Usuário clica em "Entrada" ou "Saída"
   ↓
2. Seleciona medicamento
   ↓
3. Define quantidade
   ↓
4. Clica em "Confirmar"
   ↓
5. Valida quantidade
   ↓
6. Atualiza estoque
   ↓
7. Registra movimentação
   ↓
8. Verifica alertas
   ↓
9. Fecha modal
   ↓
10. Recarrega estoque
```

---

## 6. EXERCÍCIOS PRÁTICOS

### **Nível 1: Básico**

#### **Exercício 1: Adicionar Campo**
Adicione um campo "Observações" na tela de medicamentos.

**Passos:**
1. Adicionar campo no formulário
2. Adicionar no estado
3. Salvar no banco
4. Exibir na lista

#### **Exercício 2: Filtro Simples**
Adicione um filtro "Ativos/Inativos" na tela de medicamentos.

**Passos:**
1. Adicionar botões de filtro
2. Adicionar estado do filtro
3. Filtrar array de medicamentos
4. Renderizar lista filtrada

### **Nível 2: Intermediário**

#### **Exercício 3: Estatísticas**
Adicione estatísticas na tela de alarmes.

**Passos:**
1. Calcular total de alarmes
2. Calcular alarmes ativos
3. Calcular alarmes de hoje
4. Exibir em cards

#### **Exercício 4: Ordenação**
Adicione ordenação na tela de histórico.

**Passos:**
1. Adicionar botões de ordenação
2. Adicionar estado de ordenação
3. Ordenar array
4. Renderizar lista ordenada

### **Nível 3: Avançado**

#### **Exercício 5: Backup**
Implemente backup de dados.

**Passos:**
1. Exportar dados para JSON
2. Salvar arquivo
3. Importar dados de JSON
4. Inserir no banco

#### **Exercício 6: Notificações Push**
Implemente notificações reais.

**Passos:**
1. Instalar expo-notifications
2. Pedir permissão
3. Agendar notificação
4. Cancelar notificação

---

## 7. DEBUGGING E TROUBLESHOOTING

### **7.1 Erros Comuns**

#### **Erro: "Cannot read property 'X' of undefined"**
```javascript
// ❌ ERRADO
const nome = medicamento.nome; // medicamento pode ser undefined

// ✅ CORRETO
const nome = medicamento?.nome || 'Sem nome';
```

#### **Erro: "Promise não resolvida"**
```javascript
// ❌ ERRADO
const medicamentos = databaseService.getAllMedicamentos();

// ✅ CORRETO
const medicamentos = await databaseService.getAllMedicamentos();
```

#### **Erro: "setState em componente desmontado"**
```javascript
// ✅ CORRETO
useEffect(() => {
  let isMounted = true;
  
  async function load() {
    const data = await loadData();
    if (isMounted) {
      setData(data);
    }
  }
  
  load();
  
  return () => {
    isMounted = false;
  };
}, []);
```

### **7.2 Ferramentas de Debug**

#### **Console.log**
```javascript
console.log('Medicamentos:', medicamentos);
console.log('Quantidade:', medicamentos.length);
```

#### **React DevTools**
```bash
npx react-devtools
```

#### **Expo DevTools**
```bash
npx expo start
# Pressione 'd' para abrir DevTools
```

---

## 8. PRÓXIMOS PASSOS

### **8.1 Melhorias Sugeridas**

1. **Notificações Push Reais**
   - Usar expo-notifications
   - Agendar alarmes
   - Notificar usuário

2. **Backup na Nuvem**
   - Firebase/Supabase
   - Sincronização automática
   - Restauração de dados

3. **Gráficos e Relatórios**
   - react-native-chart-kit
   - Gráfico de consumo
   - Relatório mensal

4. **Autenticação**
   - Login com email/senha
   - Biometria
   - PIN de segurança

5. **Compartilhamento**
   - Compartilhar com cuidador
   - Múltiplos usuários
   - Sincronização

### **8.2 Recursos de Estudo**

#### **Documentação Oficial**
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [SQLite](https://www.sqlite.org/docs.html)

#### **Cursos Recomendados**
- React Native - The Practical Guide (Udemy)
- React Native Fundamentals (Rocketseat)
- Expo Documentation (Expo.dev)

#### **Comunidades**
- [React Native Brasil (Discord)](https://discord.gg/reactnative)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Reddit r/reactnative](https://reddit.com/r/reactnative)

### **8.3 Checklist de Aprendizado**

#### **Básico**
- [ ] Entender componentes React Native
- [ ] Usar useState e useEffect
- [ ] Navegar entre telas
- [ ] Estilizar componentes
- [ ] Usar FlatList

#### **Intermediário**
- [ ] Usar Context API
- [ ] Trabalhar com SQLite
- [ ] Async/Await
- [ ] Tratamento de erros
- [ ] Dark mode

#### **Avançado**
- [ ] Otimização de performance
- [ ] Notificações push
- [ ] Backup e sincronização
- [ ] Testes automatizados
- [ ] Deploy na loja

---

## 🎯 CONCLUSÃO

Parabéns por chegar até aqui! 🎉

Você agora tem:
- ✅ Entendimento completo do projeto
- ✅ Conhecimento de React Native
- ✅ Domínio de SQLite
- ✅ Arquitetura bem definida
- ✅ Exercícios práticos
- ✅ Recursos para continuar aprendendo

**Próximos passos:**
1. Pratique os exercícios
2. Implemente as melhorias sugeridas
3. Estude a documentação oficial
4. Participe de comunidades
5. Construa seus próprios projetos

**Boa sorte! 🚀**


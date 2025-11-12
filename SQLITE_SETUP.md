# 🗄️ Configuração do SQLite no MediCuidado

## ✅ O que foi feito

Substituímos o **FakeDatabase** (banco de dados fake em memória) por um **banco de dados SQLite real** usando o **Expo SQLite**.

### Arquivos criados/modificados:

1. **`src/database/DatabaseService.js`** - Novo serviço de banco de dados SQLite
2. **`src/services/MedicamentoService.js`** - Atualizado para usar DatabaseService
3. **`src/services/EstoqueService.js`** - Atualizado para usar DatabaseService

## 📦 Instalação

### Passo 1: Habilitar execução de scripts no PowerShell

Abra o **PowerShell como Administrador** e execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Passo 2: Instalar o pacote expo-sqlite

No terminal normal (dentro da pasta do projeto), execute:

```bash
npm install expo-sqlite
```

**OU** se preferir usar o Expo CLI:

```bash
npx expo install expo-sqlite
```

## 🚀 Como funciona

### Banco de dados SQLite

O banco de dados é criado automaticamente na primeira vez que o app é executado. Ele cria as seguintes tabelas:

- **medicamentos** - Armazena informações dos medicamentos
- **estoque** - Controla o estoque de cada medicamento
- **movimentacoes** - Registra entradas e saídas
- **alertas** - Gerencia alertas de estoque baixo e vencimento

### Dados iniciais

Na primeira execução, o banco é populado com dados de exemplo:
- 5 medicamentos
- Estoque inicial para cada medicamento
- Algumas movimentações de exemplo
- Alertas de estoque baixo e vencimento

### Persistência

Diferente do FakeDatabase que perdia todos os dados ao fechar o app, o **SQLite persiste os dados** no dispositivo. Os dados ficam salvos mesmo após fechar e reabrir o aplicativo.

## 🔧 Uso nos serviços

### MedicamentoService

```javascript
import MedicamentoService from './src/services/MedicamentoService';

// Obter todos os medicamentos
const medicamentos = await MedicamentoService.getAllMedicamentos();

// Adicionar novo medicamento
const novoMed = await MedicamentoService.addMedicamento({
  nome: 'Paracetamol 500mg',
  descricao: 'Analgésico',
  dosagem: '500mg',
  fabricante: 'Genérico',
  preco: 5.50,
  categoria: 'Analgésicos'
});

// Atualizar medicamento
await MedicamentoService.updateMedicamento(1, { preco: 16.00 });

// Deletar medicamento (soft delete - marca como inativo)
await MedicamentoService.deleteMedicamento(1);
```

### EstoqueService

```javascript
import EstoqueService from './src/services/EstoqueService';

// Obter estoque
const estoque = await EstoqueService.getEstoque();

// Adicionar entrada
await EstoqueService.adicionarEntrada(1, 50, 'Compra');

// Adicionar saída
await EstoqueService.adicionarSaida(1, 10, 'Dispensação');

// Verificar alertas
const alertas = await EstoqueService.getAlertasNaoLidos();
```

## 🎯 Próximos passos

1. **Instalar o pacote** conforme instruções acima
2. **Testar o aplicativo** - Execute `npm start` e teste as funcionalidades
3. **Verificar persistência** - Adicione dados, feche o app e reabra para confirmar que os dados foram salvos

## 📝 Observações importantes

- O arquivo do banco de dados SQLite é criado em: `medicuidado.db`
- Os dados são persistidos localmente no dispositivo
- O FakeDatabase ainda existe no projeto mas não é mais usado
- Todas as operações agora são assíncronas (usam `await`)

## 🐛 Troubleshooting

### Erro: "expo-sqlite não encontrado"
**Solução:** Execute `npm install expo-sqlite`

### Erro: "Cannot run scripts"
**Solução:** Execute o PowerShell como Administrador e rode:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Banco de dados não está salvando
**Solução:** Verifique se o `await` está sendo usado em todas as chamadas assíncronas

### Quero resetar o banco de dados
**Solução:** Desinstale e reinstale o app, ou delete o arquivo `medicuidado.db` do dispositivo

## 📚 Documentação

- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

---

**Desenvolvido para o projeto MediCuidado** 🏥💊


# 💊 MediCuidado

> Aplicativo de gerenciamento de medicamentos para idosos e cuidadores

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.18-000020.svg)](https://expo.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-16.0.8-003B57.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📋 Sobre o Projeto

**MediCuidado** é um aplicativo mobile desenvolvido em React Native/Expo que ajuda idosos e cuidadores a gerenciar medicamentos de forma simples e eficiente.

### ✨ Funcionalidades Principais

- 💊 **Gerenciamento de Medicamentos** - Cadastro completo com nome, dosagem e categoria
- ⏰ **Alarmes Inteligentes** - Lembretes automáticos para tomar medicamentos
- 📦 **Controle de Estoque** - Monitore quantidade e validade
- 📋 **Histórico Completo** - Registro de todas as movimentações
- 🔔 **Notificações** - Alertas de estoque baixo e vencimento
- 🌙 **Dark Mode** - Tema escuro para conforto visual
- 👤 **Perfil Personalizável** - Dados do usuário e contato de emergência

---

## 🚀 Tecnologias

- **React Native** 0.81.5 - Framework mobile
- **Expo** ~54.0.18 - Plataforma de desenvolvimento
- **Expo SQLite** ~16.0.8 - Banco de dados local
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento de preferências
- **Context API** - Gerenciamento de estado global

---

## 📁 Estrutura do Projeto

```
MediCuidado/
├── src/
│   ├── contexts/           # Contextos React (Auth, Theme)
│   ├── database/           # DatabaseService (SQLite)
│   ├── navigation/         # Navegação
│   └── screens/            # Telas do app
│       ├── MedicamentosScreen.js
│       ├── AlarmesScreen.js
│       ├── EstoqueScreen.js
│       ├── HistoricoScreen.js
│       ├── NotificacoesScreen.js
│       ├── PerfilScreen.js
│       └── ConfiguracoesScreen.js
├── docs/                   # Documentação completa
│   ├── README-ANALISE-COMPLETA.md
│   ├── README-ARQUITETURA.md
│   ├── README-BANCO-DE-DADOS.md
│   ├── README-COMPONENTES.md
│   └── README-GUIA-ESTUDO.md
├── App.js
├── package.json
└── README.md
```

---

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Expo Go no celular (Android/iOS)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/edinaldogomews/MediCuidado/tree/main
cd medicuidado
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Inicie o projeto**
```bash
npx expo start
```

4. **Teste no celular**
- Abra o Expo Go no celular
- Escaneie o QR Code
- Aguarde o carregamento

---

## 📱 Como Usar

### 1. Selecione o Tipo de Usuário
- **Idoso** - Interface simplificada
- **Cuidador** - Recursos completos

### 2. Adicione Medicamentos
- Vá em "Medicamentos"
- Clique em "+"
- Preencha nome, dosagem e categoria
- Defina estoque inicial

### 3. Configure Alarmes
- Vá em "Alarmes"
- Clique em "+"
- Selecione medicamento
- Defina horário e dias da semana

### 4. Controle o Estoque
- Vá em "Estoque"
- Use "📥 Entrada" para adicionar
- Use "📤 Saída" para remover
- Monitore vencimentos

### 5. Acompanhe o Histórico
- Vá em "Histórico"
- Veja todas as movimentações
- Use filtros para buscar

---

## 📚 Documentação

Documentação completa disponível em `/docs`:

- **[README-ANALISE-COMPLETA.md](docs/README-ANALISE-COMPLETA.md)** - Análise de conexões e integrações
- **[README-ARQUITETURA.md](docs/README-ARQUITETURA.md)** - Arquitetura e padrões do projeto
- **[README-BANCO-DE-DADOS.md](docs/README-BANCO-DE-DADOS.md)** - Estrutura do banco SQLite
- **[README-COMPONENTES.md](docs/README-COMPONENTES.md)** - Componentes e telas
- **[README-GUIA-ESTUDO.md](docs/README-GUIA-ESTUDO.md)** - Guia completo de estudo

---

## 🔄 Solução de Problemas

### Error: Unable to start server
```bash
npx expo start -c
```

### Reinstalar dependências
```bash
rm -rf node_modules
npm install
```

### Limpar cache do Metro
```bash
npx expo start --clear
```

### Problemas com Expo Go
1. Verifique se está na mesma rede Wi-Fi
2. Desative temporariamente o firewall
3. Use o modo "Tunnel" no Expo DevTools

---

## 🎯 Próximas Melhorias

- [ ] Notificações push reais
- [ ] Backup na nuvem
- [ ] Gráficos e relatórios
- [ ] Autenticação com PIN
- [ ] Compartilhamento entre usuários

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**⭐ Se este projeto te ajudou, deixe uma estrela!**

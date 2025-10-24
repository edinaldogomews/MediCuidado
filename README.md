# MediCuidado - Aplicação de Gerenciamento de Medicamentos

## 📱 Visão Geral

O **MediCuidado** é uma aplicação mobile desenvolvida em React Native e totalmente adaptada para o **Expo**, focada no gerenciamento inteligente de medicamentos para idosos e seus cuidadores. A aplicação oferece duas interfaces distintas otimizadas para diferentes perfis de usuários.

## 🎯 Objetivo Principal

Facilitar o controle e acompanhamento de medicamentos, reduzindo erros de medicação e melhorando a adesão ao tratamento através de uma interface intuitiva e recursos de monitoramento em tempo real.

## 👥 Perfis de Usuário

### 🧑‍⚕️ Cuidador (Interface Completa)
- Dashboard completo com navegação por abas
- Gerenciamento total de medicamentos, alarmes e pacientes
- Controle de estoque com alertas automáticos
- Relatórios detalhados e histórico completo
- Configurações avançadas de segurança e notificações

### 👴 Idoso (Interface Simplificada)
- Visualização clara dos medicamentos do dia
- Próximo medicamento destacado com horário
- Botões grandes para marcar como tomado
- Acesso direto à ajuda e emergência
- Interface com ícones e textos grandes

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local de dados
- **Context API** - Gerenciamento de estado global

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/client) (no seu dispositivo móvel)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd MediCuidado
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm start
# ou
expo start
```

### 4. Execute no dispositivo
- Escaneie o QR Code com o app **Expo Go** (Android/iOS)
- Ou pressione `a` para Android Emulator
- Ou pressione `i` para iOS Simulator

## 🏗️ Estrutura do Projeto

```
MediCuidado/
├── App.js                  # Componente raiz da aplicação
├── app.json               # Configuração do Expo
├── index.js               # Ponto de entrada
├── package.json           # Dependências e scripts
├── assets/                # Recursos visuais (ícones, splash)
└── src/                   # Código fonte principal
    ├── contexts/          # Contextos React (AuthContext)
    ├── navigation/        # Sistema de navegação
    ├── screens/           # Todas as telas da aplicação
    └── services/          # Serviços e utilitários
```

## 📱 Funcionalidades Principais

### Para Cuidadores:
- ✅ **Dashboard completo** com navegação por abas
- ✅ **Gerenciamento de medicamentos** (adicionar, editar, excluir)
- ✅ **Sistema de alarmes** configurável
- ✅ **Controle de estoque** com alertas
- ✅ **Histórico detalhado** com filtros
- ✅ **Gestão de pacientes**
- ✅ **Central de notificações**
- ✅ **Configurações avançadas**

### Para Idosos:
- ✅ **Interface simplificada**
- ✅ **Próximo medicamento** em destaque
- ✅ **Botões grandes** e claros
- ✅ **Acesso direto** à ajuda

## 🎨 Telas Implementadas

1. **SelectUserTypeScreen** - Seleção do tipo de usuário
2. **HomeScreen** - Dashboard principal do cuidador
3. **CuidadoHomeScreen** - Interface simplificada para idosos
4. **MedicamentosScreen** - Lista e gerenciamento de medicamentos
5. **AddMedicamentoScreen** - Formulário para adicionar medicamentos
6. **AlarmesScreen** - Configuração de alarmes
7. **PacientesScreen** - Gestão de pacientes
8. **EstoqueScreen** - Controle de estoque
9. **HistoricoScreen** - Histórico de medicações
10. **NotificacoesScreen** - Central de notificações
11. **ConfiguracoesScreen** - Configurações do aplicativo
12. **PerfilScreen** - Perfil do usuário
13. **AjudaScreen** - Central de ajuda e suporte

## 🔧 Configuração para Desenvolvimento

### Estrutura de Navegação
A aplicação utiliza uma navegação customizada adaptada para o Expo:
- **Stack Navigator** principal
- **Barra de navegação customizada** (evitando problemas com bottom tabs)
- **Navegação condicional** baseada no tipo de usuário

### Context API
O projeto utiliza React Context para gerenciamento de estado:
- **AuthContext** - Gerencia autenticação e tipo de usuário
- **userType** - Define qual interface mostrar (cuidador/idoso)

## 📊 Scripts Disponíveis

```bash
# Iniciar o projeto
npm start

# Executar no Android
npm run android

# Executar no iOS  
npm run ios

# Executar no Web
npm run web

# Build para produção
expo build:android
expo build:ios
```

## 🎯 Adaptações para Expo

- ✅ **Navegação customizada** sem dependências problemáticas
- ✅ **Componentes nativos** 100% compatíveis
- ✅ **Hot reload** completo
- ✅ **Build otimizado** para múltiplas plataformas
- ✅ **Testagem instantânea** via Expo Go

## 🔮 Funcionalidades Futuras

- 🔔 **Notificações push** nativas
- 📱 **Modo offline** completo
- 🔒 **Autenticação biométrica**
- ☁️ **Sincronização na nuvem**
- 📊 **Relatórios avançados** com gráficos
- 🌙 **Modo escuro** automático

## 📞 Suporte

Para dúvidas ou suporte:
- **Email**: suporte@medicuidado.com
- **Documentação**: README_COMPLETO.md
- **Issues**: [Abrir issue no repositório]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido para

**Projeto Acadêmico** - Universidade [Nome da Universidade]  
**Curso**: [Nome do Curso]  
**Disciplina**: [Nome da Disciplina]  
**Ano**: 2025

---

**MediCuidado** - Desenvolvido com ❤️ para cuidar de quem você ama.

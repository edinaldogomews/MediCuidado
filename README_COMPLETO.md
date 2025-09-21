# MediCuidado - Aplicação de Gerenciamento de Medicamentos

## 📱 Visão Geral da Aplicação

O **MediCuidado** é uma aplicação mobile desenvolvida em React Native e totalmente adaptada para o **Expo**, focada no gerenciamento inteligente de medicamentos para idosos e seus cuidadores. A aplicação oferece duas interfaces distintas otimizadas para diferentes perfis de usuários.

## 🎯 Objetivo Principal

Facilitar o controle e acompanhamento de medicamentos, reduzindo erros de medicação e melhorando a adesão ao tratamento através de uma interface intuitiva e recursos de monitoramento em tempo real.

## 👥 Perfis de Usuário

### 🧑‍⚕️ Cuidador (Interface Completa)
- **Dashboard completo** com navegação por abas
- **Gerenciamento total** de medicamentos, alarmes e pacientes
- **Controle de estoque** com alertas automáticos
- **Relatórios detalhados** e histórico completo
- **Configurações avançadas** de segurança e notificações

### 👴 Idoso (Interface Simplificada)
- **Visualização clara** dos medicamentos do dia
- **Próximo medicamento** destacado com horário
- **Botões grandes** para marcar como tomado
- **Acesso direto** a ajuda e emergência
- **Interface com ícones** e textos grandes

## 🏗️ Arquitetura da Aplicação

### **Estrutura de Pastas Principal**
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

### **Sistema de Navegação Customizado**
A aplicação utiliza uma **navegação híbrida** adaptada especificamente para o Expo:

- **Stack Navigator** principal do React Navigation
- **Barra de navegação customizada** (substituindo bottom tabs problemáticos)
- **Navegação condicional** baseada no tipo de usuário
- **Transições suaves** entre telas

## 🚀 Adaptações Específicas para Expo

### **1. Configuração do Expo (app.json)**
```json
{
  "expo": {
    "name": "MediCuidado",
    "slug": "medicuidado",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#ffffff"
    },
    "platforms": ["ios", "android", "web"]
  }
}
```

### **2. Dependências Compatíveis com Expo**
- `@react-navigation/native`: Navegação principal
- `@react-navigation/stack`: Navegação em pilha
- `react-native-safe-area-context`: Áreas seguras
- `react-native-screens`: Otimização de telas
- `expo-status-bar`: Barra de status do Expo

### **3. Navegação Customizada sem Bottom Tabs**
Para evitar incompatibilidades do `@react-navigation/bottom-tabs` no Expo, foi desenvolvida uma **barra de navegação customizada**:

```javascript
const CustomTabBar = ({ activeTab, onTabPress }) => {
  // Implementação usando componentes nativos do React Native
  // Totalmente compatível com Expo
};
```

### **4. Estrutura de Componentes Otimizada**
- **Componentes funcionais** com hooks
- **Context API** para gerenciamento de estado global
- **Componentes reutilizáveis** para consistência visual
- **Estilos inline** para melhor performance no Expo

## 🔧 Funcionalidades Implementadas

### **📊 Dashboard Principal (Cuidador)**
- **8 módulos principais** em cards organizados:
  - 💊 Medicamentos
  - ⏰ Alarmes  
  - 👥 Pacientes
  - 📦 Estoque
  - 📋 Histórico
  - 🔔 Notificações
  - 👤 Perfil
  - ⚙️ Configurações

### **💊 Gerenciamento de Medicamentos**
- **Lista completa** com busca e filtros
- **Formulário de cadastro** com múltiplos horários
- **Informações detalhadas**: dosagem, tipo, estoque
- **Status visual** de cada medicamento

### **⏰ Sistema de Alarmes**
- **Configuração individual** por medicamento
- **Ativação/desativação** com switch
- **Horários múltiplos** para o mesmo medicamento
- **Indicadores visuais** de status

### **📦 Controle de Estoque**
- **Alertas automáticos** para estoque baixo
- **Controle de validade** com avisos
- **Entrada e saída** de medicamentos
- **Relatórios de inventário**

### **📋 Histórico Detalhado**
- **Filtros por ação**: tomado, perdido, atrasado
- **Timeline** de todas as medicações
- **Estatísticas** de adesão ao tratamento
- **Exportação de relatórios**

### **👥 Gestão de Pacientes**
- **Cadastro completo** de pacientes
- **Status visual** (ativo/inativo)
- **Histórico individual** por paciente
- **Informações de contato** e emergência

### **🔔 Sistema de Notificações**
- **Prioridades diferenciadas**: alta, média, baixa
- **Tipos variados**: medicamento, estoque, vencimento
- **Marcação de lidas/não lidas**
- **Central de notificações** organizada

### **❓ Central de Ajuda**
- **FAQ completo** com perguntas frequentes
- **Guia de uso** passo a passo
- **Contatos de emergência** (192 - SAMU)
- **Suporte técnico** integrado

## 🎨 Design e Experiência do Usuário

### **Paleta de Cores Temática**
- **Verde (#4CAF50)**: Funcionalidades principais
- **Azul (#2196F3)**: Interface do idoso
- **Laranja (#FF9800)**: Alarmes e alertas
- **Roxo (#9C27B0)**: Estoque e inventário
- **Vermelho (#F44336)**: Emergências e exclusões

### **Componentes Visuais**
- **Cards elevados** com sombras suaves
- **Ícones emoji** para facilitar identificação
- **Badges coloridos** para status e prioridades
- **Botões grandes** para acessibilidade
- **Tipografia clara** e hierarquizada

### **Responsividade**
- **Layout adaptativo** para diferentes tamanhos de tela
- **Componentes flexíveis** que se ajustam automaticamente
- **Testes em dispositivos** iOS e Android via Expo Go

## 🔒 Segurança e Privacidade

### **Contexto de Autenticação**
- **Gerenciamento de sessão** com React Context
- **Tipos de usuário** persistidos localmente
- **Logout seguro** com limpeza de dados

### **Armazenamento Local**
- **AsyncStorage** para dados não sensíveis
- **Criptografia** para informações críticas (futuro)
- **Backup automático** na nuvem (planejado)

## 📱 Compatibilidade Expo

### **Testagem**
- **Expo Go**: Testagem instantânea em dispositivos reais
- **Expo Dev Tools**: Debug e desenvolvimento
- **Hot Reload**: Atualizações em tempo real

### **Deployment**
- **Expo Build**: Compilação para stores
- **OTA Updates**: Atualizações over-the-air
- **Multiple Platforms**: iOS, Android e Web

### **Performance**
- **Bundle otimizado** para Expo
- **Lazy loading** de telas
- **Componentes leves** sem dependências pesadas

## 🚦 Fluxo de Navegação

### **Fluxo Principal**
1. **Splash Screen** → Carregamento inicial
2. **Seleção de Usuário** → Escolha do perfil
3. **Interface Específica** → Dashboard personalizado
4. **Navegação Livre** → Entre todas as funcionalidades

### **Navegação por Abas (Cuidador)**
- **🏠 Início**: Dashboard principal
- **💊 Medicamentos**: Lista e gerenciamento
- **⏰ Alarmes**: Configuração de horários
- **👥 Pacientes**: Gestão de pacientes

### **Navegação Stack**
- **Telas secundárias** acessíveis via stack navigation
- **Botões "Voltar"** em todas as telas
- **Deep linking** para funcionalidades específicas

## 🔮 Funcionalidades Futuras

### **Integrações Planejadas**
- **Notificações push** do Expo
- **Câmera** para leitura de códigos de barras
- **Localização** para farmácias próximas
- **Calendário** nativo do dispositivo

### **Melhorias de UX**
- **Modo escuro** automático
- **Acessibilidade** aprimorada
- **Múltiplos idiomas**
- **Sincronização em nuvem**

## 📈 Vantagens da Adaptação Expo

### **Desenvolvimento**
- ✅ **Setup rápido** sem configuração nativa
- ✅ **Hot reload** para desenvolvimento ágil
- ✅ **Testagem instantânea** em dispositivos reais
- ✅ **Debug facilitado** com ferramentas integradas

### **Deploy e Distribuição**
- ✅ **Build unificado** para múltiplas plataformas
- ✅ **Atualizações OTA** sem passar pelas stores
- ✅ **Distribuição simplificada** via Expo
- ✅ **Gestão de versões** automatizada

### **Manutenção**
- ✅ **Dependências gerenciadas** pelo Expo
- ✅ **Compatibilidade garantida** entre bibliotecas
- ✅ **Atualizações seguras** do SDK
- ✅ **Suporte técnico** da comunidade Expo

---

O **MediCuidado** representa uma solução completa e moderna para o gerenciamento de medicamentos, aproveitando ao máximo as capacidades do Expo para entregar uma experiência nativa de alta qualidade com a simplicidade do desenvolvimento em React Native.

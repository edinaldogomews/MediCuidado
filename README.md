# MediCudado - Aplicativo de Gerenciamento de Medicamentos

## Descrição
O MediCudado é um aplicativo móvel desenvolvido em React Native + Expo para auxiliar no gerenciamento de medicamentos, oferecendo recursos como controle de horários, estoque e histórico de medicações.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/client) (no seu dispositivo móvel)

## Configuração do Ambiente

1. Instale o Expo CLI globalmente:
```bash
npm install -g expo-cli
```

2. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd medc/medicudado
```

3. Instale as dependências do projeto:
```bash
npm install
```

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
expo start
```

2. Você terá algumas opções para executar o aplicativo:

- Escaneie o QR Code com o aplicativo Expo Go (Android) ou Câmera (iOS)
- Pressione 'a' no terminal para abrir no emulador Android
- Pressione 'i' no terminal para abrir no simulador iOS
- Pressione 'w' para abrir na versão web

## Estrutura do Projeto

```
medicudado/
├── src/
│   ├── screens/         # Telas do aplicativo
│   ├── navigation/      # Configurações de navegação
│   ├── services/        # Serviços e APIs
│   ├── components/      # Componentes reutilizáveis
│   ├── contexts/        # Contextos React
│   ├── theme/          # Configurações de tema
│   └── types/          # Definições de tipos TypeScript
```

## Funcionalidades Principais

- 📱 Gerenciamento de medicamentos
- ⏰ Sistema de alarmes e notificações
- 📊 Controle de estoque
- 📋 Histórico de medicações
- 👤 Perfil do usuário
- 🔒 Sistema de segurança com PIN

## Solução de Problemas

### Error: Unable to start server
Se você encontrar problemas ao iniciar o servidor, tente:
1. Limpar o cache:
```bash
expo start -c
```

2. Reinstalar as dependências:
```bash
rm -rf node_modules
npm install
```

### Erro de Metro Bundler
Se o Metro Bundler não iniciar corretamente:
1. Pare o servidor (Ctrl+C)
2. Execute:
```bash
npm start --reset-cache
```

### Problemas com o Expo Go
Se o aplicativo não conectar com o Expo Go:
1. Verifique se seu celular está na mesma rede Wi-Fi que o computador
2. Desative temporariamente o firewall
3. Use o modo "Tunnel" no Expo DevTools

## Testando no Emulador

### Android
1. Instale o Android Studio
2. Configure um dispositivo virtual (AVD)
3. Execute:
```bash
npm run android
```

### iOS (apenas macOS)
1. Instale o Xcode
2. Execute:
```bash
npm run ios
```

## Desenvolvimento

Para desenvolver novas funcionalidades:

1. Crie uma nova branch:
```bash
git checkout -b feature/nova-funcionalidade
```

2. Faça suas alterações seguindo os padrões do projeto

3. Teste localmente:
```bash
npm test
```

4. Faça o commit seguindo o padrão convencional:
```bash
git commit -m "feat: adiciona nova funcionalidade"
```

## Versionamento

O projeto segue o [Semantic Versioning](https://semver.org/). Para ver as versões disponíveis, acesse as [tags neste repositório](URL_DO_REPOSITORIO/tags).

## Suporte

Em caso de dúvidas ou problemas:
1. Consulte a documentação
2. Abra uma issue no repositório
3. Entre em contato com a equipe de desenvolvimento

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

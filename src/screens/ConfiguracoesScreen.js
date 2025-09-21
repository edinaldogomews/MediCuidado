import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';

const ConfiguracoesScreen = ({ navigation }) => {
  const [notificacoes, setNotificacoes] = React.useState(true);
  const [somAlarme, setSomAlarme] = React.useState(true);
  const [modoEscuro, setModoEscuro] = React.useState(false);

  const opcoes = [
    {
      titulo: 'Notificações',
      descricao: 'Receber notificações de medicamentos',
      tipo: 'switch',
      valor: notificacoes,
      onChange: setNotificacoes,
      icon: '🔔',
    },
    {
      titulo: 'Som do Alarme',
      descricao: 'Tocar som quando for hora do medicamento',
      tipo: 'switch',
      valor: somAlarme,
      onChange: setSomAlarme,
      icon: '🔊',
    },
    {
      titulo: 'Modo Escuro',
      descricao: 'Usar tema escuro no aplicativo',
      tipo: 'switch',
      valor: modoEscuro,
      onChange: setModoEscuro,
      icon: '🌙',
    },
    {
      titulo: 'Segurança',
      descricao: 'Configurar PIN de acesso',
      tipo: 'navegacao',
      onPress: () => console.log('Abrir configurações de segurança'),
      icon: '🔒',
    },
    {
      titulo: 'Backup',
      descricao: 'Fazer backup dos dados',
      tipo: 'navegacao',
      onPress: () => console.log('Fazer backup'),
      icon: '☁️',
    },
    {
      titulo: 'Sobre o App',
      descricao: 'Informações e versão do aplicativo',
      tipo: 'navegacao',
      onPress: () => console.log('Sobre o app'),
      icon: 'ℹ️',
    },
  ];

  const renderOpcao = (opcao, index) => (
    <View key={index} style={styles.opcaoCard}>
      <View style={styles.opcaoInfo}>
        <Text style={styles.opcaoIcon}>{opcao.icon}</Text>
        <View style={styles.opcaoTextos}>
          <Text style={styles.opcaoTitulo}>{opcao.titulo}</Text>
          <Text style={styles.opcaoDescricao}>{opcao.descricao}</Text>
        </View>
      </View>

      {opcao.tipo === 'switch' ? (
        <Switch
          value={opcao.valor}
          onValueChange={opcao.onChange}
          trackColor={{ false: '#ccc', true: '#4CAF50' }}
          thumbColor={opcao.valor ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <TouchableOpacity onPress={opcao.onPress}>
          <Text style={styles.navegacaoIcon}>▶</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          {opcoes.map((opcao, index) => renderOpcao(opcao, index))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>🗑️ Limpar Todos os Dados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>MediCuidado v1.0.0</Text>
          <Text style={styles.versionSubtext}>Desenvolvido com ❤️ para cuidar de você</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#607D8B',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 70,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  opcaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  opcaoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  opcaoIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  opcaoTextos: {
    flex: 1,
  },
  opcaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  opcaoDescricao: {
    fontSize: 14,
    color: '#666',
  },
  navegacaoIcon: {
    fontSize: 16,
    color: '#ccc',
  },
  dangerButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionInfo: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  versionSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default ConfiguracoesScreen;

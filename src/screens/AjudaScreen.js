import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useThemePreference } from '../contexts/ThemeContext';

const AjudaScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
  const faqItems = [
    {
      pergunta: 'Como adicionar um novo medicamento?',
      resposta: 'Vá para a aba Medicamentos e toque no botão "+ Adicionar". Preencha as informações do medicamento e configure os horários.',
    },
    {
      pergunta: 'Como configurar alarmes?',
      resposta: 'Na aba Alarmes, você pode ativar/desativar notificações para cada medicamento e definir os horários específicos.',
    },
    {
      pergunta: 'O que fazer se esquecer de tomar um medicamento?',
      resposta: 'Marque como "perdido" no histórico e tome assim que lembrar, respeitando o intervalo mínimo entre doses.',
    },
    {
      pergunta: 'Como exportar relatórios?',
      resposta: 'No Histórico, toque em "📊 Relatório" para gerar um relatório completo das medicações.',
    },
  ];

  const contatoEmergencia = () => {
    Linking.openURL('tel:192');
  };

  const contatoSuporte = () => {
    Linking.openURL('mailto:suporte@medicuidado.com');
  };

  const handleBack = () => {
    if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const state = typeof navigation.getState === 'function' ? navigation.getState() : undefined;
    const routeNames = state && Array.isArray(state.routeNames) ? state.routeNames : [];
    if (routeNames.includes('Main')) {
      navigation.navigate('Main');
      return;
    }
    if (routeNames.includes('CuidadoHome')) {
      navigation.navigate('CuidadoHome');
      return;
    }
    if (routeNames.includes('SelectUserType')) {
      navigation.navigate('SelectUserType');
      return;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ajuda</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>🚨 Em caso de emergência</Text>
          <TouchableOpacity style={[styles.emergencyButton, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]} onPress={contatoEmergencia}>
            <Text style={styles.emergencyButtonText}>📞 LIGAR PARA 192 - SAMU</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>❓ Perguntas Frequentes</Text>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={[styles.faqPergunta, { color: isDark ? '#ddd' : '#333' }]}>{item.pergunta}</Text>
              <Text style={[styles.faqResposta, { color: isDark ? '#bbb' : '#666' }]}>{item.resposta}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>📖 Guia Rápido</Text>

          <View style={styles.guiaItem}>
            <Text style={styles.guiaIcon}>💊</Text>
            <View style={styles.guiaTexto}>
              <Text style={[styles.guiaTitulo, { color: isDark ? '#ddd' : '#333' }]}>Medicamentos</Text>
              <Text style={[styles.guiaDescricao, { color: isDark ? '#bbb' : '#666' }]}>Adicione, edite e gerencie todos os medicamentos</Text>
            </View>
          </View>

          <View style={styles.guiaItem}>
            <Text style={styles.guiaIcon}>⏰</Text>
            <View style={styles.guiaTexto}>
              <Text style={[styles.guiaTitulo, { color: isDark ? '#ddd' : '#333' }]}>Alarmes</Text>
              <Text style={[styles.guiaDescricao, { color: isDark ? '#bbb' : '#666' }]}>Configure lembretes para não esquecer das doses</Text>
            </View>
          </View>

          <View style={styles.guiaItem}>
            <Text style={styles.guiaIcon}>📋</Text>
            <View style={styles.guiaTexto}>
              <Text style={[styles.guiaTitulo, { color: isDark ? '#ddd' : '#333' }]}>Histórico</Text>
              <Text style={[styles.guiaDescricao, { color: isDark ? '#bbb' : '#666' }]}>Acompanhe o que foi tomado, perdido ou atrasado</Text>
            </View>
          </View>

          <View style={styles.guiaItem}>
            <Text style={styles.guiaIcon}>📦</Text>
            <View style={styles.guiaTexto}>
              <Text style={[styles.guiaTitulo, { color: isDark ? '#ddd' : '#333' }]}>Estoque</Text>
              <Text style={[styles.guiaDescricao, { color: isDark ? '#bbb' : '#666' }]}>Controle a quantidade e validade dos medicamentos</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>📞 Suporte</Text>
          <TouchableOpacity style={styles.suporteButton} onPress={contatoSuporte}>
            <Text style={styles.suporteButtonText}>✉️ Entrar em Contato</Text>
          </TouchableOpacity>

          <View style={styles.infoContato}>
            <Text style={[styles.infoText, { color: isDark ? '#bbb' : '#666' }]}>📧 suporte@medicuidado.com</Text>
            <Text style={[styles.infoText, { color: isDark ? '#bbb' : '#666' }]}>🕒 Atendimento: 8h às 18h</Text>
          </View>
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
    backgroundColor: '#3F51B5',
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
  emergencySection: {
    margin: 15,
    backgroundColor: '#F44336',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  emergencyButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
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
  faqItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqPergunta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  faqResposta: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  guiaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  guiaIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  guiaTexto: {
    flex: 1,
  },
  guiaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  guiaDescricao: {
    fontSize: 14,
    color: '#666',
  },
  suporteButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  suporteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContato: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default AjudaScreen;

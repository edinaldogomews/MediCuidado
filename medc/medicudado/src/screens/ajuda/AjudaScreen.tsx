import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { manualContent } from '../../data/manualContent';

const AjudaScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  const content = manualContent[selectedLanguage];

  const languages = [
    { code: 'pt-BR', name: 'Português' },
    { code: 'en-US', name: 'English' },
    { code: 'zh-CN', name: '中文' },
    { code: 'es-ES', name: 'Español' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{content.title}</Text>

        {/* Seletor de Idioma */}
        <View style={styles.languageSelector}>
          {languages.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                selectedLanguage === lang.code && styles.languageButtonSelected
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={[
                styles.languageButtonText,
                selectedLanguage === lang.code && styles.languageButtonTextSelected
              ]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Aviso de Responsabilidade */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>{content.disclaimer.title}</Text>
          <Text style={styles.disclaimerText}>{content.disclaimer.content}</Text>
        </View>

        {/* Seções do Manual */}
        {content.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Contato e Suporte */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Suporte</Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => Linking.openURL('mailto:suporte@medicudado.com')}
          >
            <Text style={styles.supportButtonText}>Contatar Suporte</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do App */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Versão: 1.0.0</Text>
          <Text style={styles.infoText}>© 2025 MediCudado</Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  languageButtonText: {
    color: '#666',
    fontSize: 14,
  },
  languageButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disclaimerSection: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 8,
  },
  disclaimerText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  supportSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  supportButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default AjudaScreen;

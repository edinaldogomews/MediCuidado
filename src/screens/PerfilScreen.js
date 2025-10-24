import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useThemePreference } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { StorageService } from '../services/StorageService';

const PerfilScreen = ({ navigation }) => {
  const { isDark } = useThemePreference();
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
  const { userType, logout } = useAuth();

  const [editando, setEditando] = useState(false);
  const [perfil, setPerfil] = useState({
    nome: 'Maria Silva',
    idade: '72',
    telefone: '(11) 99999-9999',
    email: 'maria.silva@email.com',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    contatoEmergencia: 'João Silva - (11) 88888-8888',
  });
  const [perfilOriginal, setPerfilOriginal] = useState(null);

  // Load profile data when component mounts
  useEffect(() => {
    loadPerfil();
  }, []);

  const loadPerfil = async () => {
    try {
      const perfilData = await StorageService.getPerfil();
      setPerfil(perfilData);
      setPerfilOriginal(perfilData);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const iniciarEdicao = () => {
    setPerfilOriginal({ ...perfil });
    setEditando(true);
  };

  const cancelarEdicao = () => {
    if (perfilOriginal) {
      setPerfil(perfilOriginal);
    }
    setEditando(false);
  };

  const salvarPerfil = async () => {
    try {
      await StorageService.savePerfil(perfil);
      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        [{ text: 'OK', onPress: () => setEditando(false) }]
      );
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar o perfil. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const confirmarLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const renderCampo = (label, campo, placeholder = '') => (
    <View style={styles.campoContainer}>
      <Text style={styles.campoLabel}>{label}</Text>
      {editando ? (
        <TextInput
          style={styles.campoInput}
          value={perfil[campo]}
          onChangeText={(value) => setPerfil(prev => ({ ...prev, [campo]: value }))}
          placeholder={placeholder}
        />
      ) : (
        <Text style={styles.campoTexto}>{perfil[campo] || 'Não informado'}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meu Perfil</Text>
        {editando ? (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity
              style={[styles.editButton, styles.cancelButton]}
              onPress={cancelarEdicao}
            >
              <Text style={styles.editButtonText}>❌ Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, styles.saveButton]}
              onPress={salvarPerfil}
            >
              <Text style={styles.editButtonText}>💾 Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={iniciarEdicao}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{perfil.nome.charAt(0)}</Text>
          </View>
          <Text style={[styles.nomeUsuario, { color: isDark ? '#ddd' : '#333' }]}>{perfil.nome}</Text>
          <Text style={[styles.tipoUsuario, { color: isDark ? '#bbb' : '#666' }]}>
            {userType === 'cuidador' ? '👨‍⚕️ Cuidador' : '👴 Usuário'}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>📋 Informações Pessoais</Text>
          {renderCampo('Nome completo', 'nome', 'Digite seu nome')}
          {renderCampo('Idade', 'idade', 'Digite sua idade')}
          {renderCampo('Telefone', 'telefone', '(00) 00000-0000')}
          {renderCampo('E-mail', 'email', 'seu@email.com')}
          {renderCampo('Endereço', 'endereco', 'Rua, número - Cidade/UF')}
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>🚨 Contato de Emergência</Text>
          {renderCampo('Contato de emergência', 'contatoEmergencia', 'Nome - Telefone')}
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>📊 Estatísticas</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Medicamentos</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Doses Hoje</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Adesão</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#bbb' : '#666' }]}>Dias de Uso</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ddd' : '#333' }]}>⚙️ Ações</Text>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <Text style={[styles.actionButtonText, { color: isDark ? '#ddd' : '#333' }]}>🔧 Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? '#2a2a2a' : '#f8f8f8' }]}
            onPress={() => navigation.navigate('Ajuda')}
          >
            <Text style={[styles.actionButtonText, { color: isDark ? '#ddd' : '#333' }]}>❓ Ajuda e Suporte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={confirmarLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              🚪 Sair do Aplicativo
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#673AB7',
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
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  saveButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#673AB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nomeUsuario: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipoUsuario: {
    fontSize: 16,
    color: '#666',
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
  campoContainer: {
    marginBottom: 15,
  },
  campoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  campoTexto: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  campoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F44336',
  },
  logoutButtonText: {
    color: '#fff',
  },
});

export default PerfilScreen;

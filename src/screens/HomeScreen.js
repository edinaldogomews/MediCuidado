/**
 * ========================================
 * HOME SCREEN - TELA INICIAL DO CUIDADOR
 * ========================================
 *
 * Esta é a tela principal do cuidador após fazer login.
 * Exibe um menu em grade com todas as funcionalidades disponíveis.
 *
 * FUNCIONALIDADES DISPONÍVEIS:
 * - 💊 Medicamentos: Gerenciar lista de medicamentos
 * - ⏰ Alarmes: Configurar lembretes de medicação
 * - 📦 Estoque: Controlar quantidade de medicamentos
 * - 📋 Histórico: Ver histórico de doses tomadas
 * - 🔔 Notificações: Ver notificações do sistema
 * - 👤 Perfil: Gerenciar perfil do usuário
 * - ⚙️ Configurações: Ajustar configurações do app
 *
 * NAVEGAÇÃO:
 * - Cada card do menu navega para uma tela específica
 * - Botão "Sair" faz logout e volta para seleção de usuário
 *
 * TEMA:
 * - Suporta modo claro e escuro
 * - Cores adaptam automaticamente ao tema selecionado
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Para respeitar áreas seguras
import { useThemePreference } from '../contexts/ThemeContext'; // Hook para tema
import { useAuth } from '../contexts/AuthContext'; // Hook para autenticação

/**
 * COMPONENTE PRINCIPAL - HomeScreen
 *
 * Tela inicial do cuidador com menu de navegação.
 *
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.navigation - Objeto de navegação do React Navigation
 */
const HomeScreen = ({ navigation }) => {
  // Obtém o contexto de tema (pode ser null se não estiver envolvido pelo ThemeProvider)
  const themeContext = useThemePreference();

  // Verifica se está no modo escuro (usa optional chaining e nullish coalescing)
  const isDark = themeContext?.isDark ?? false;

  // Obtém informações de autenticação
  const { userType, logout } = useAuth();

  /**
   * CONFIGURAÇÃO DO MENU
   *
   * Array com todos os itens do menu principal.
   * Cada item tem:
   * - title: Título exibido no card
   * - icon: Emoji exibido no card
   * - description: Descrição da funcionalidade
   * - onPress: Função chamada ao clicar (navega para tela específica)
   */
  const menuItems = [
    {
      title: 'Medicamentos',
      icon: '💊',
      description: 'Gerenciar medicamentos',
      onPress: () => navigation.navigate('MedicamentosTab') // Navega para aba de medicamentos
    },
    {
      title: 'Alarmes',
      icon: '⏰',
      description: 'Configurar lembretes',
      onPress: () => navigation.navigate('AlarmesTab') // Navega para aba de alarmes
    },
    {
      title: 'Estoque',
      icon: '📦',
      description: 'Controle de estoque',
      onPress: () => navigation.navigate('Estoque') // Navega para tela de estoque
    },
    {
      title: 'Histórico',
      icon: '📋',
      description: 'Histórico de doses',
      onPress: () => navigation.navigate('Historico') // Navega para tela de histórico
    },
    {
      title: 'Notificações',
      icon: '🔔',
      description: 'Ver notificações',
      onPress: () => navigation.navigate('Notificacoes') // Navega para tela de notificações
    },
    {
      title: 'Perfil',
      icon: '👤',
      description: 'Meu perfil',
      onPress: () => navigation.navigate('Perfil') // Navega para tela de perfil
    },
    {
      title: 'Configurações',
      icon: '⚙️',
      description: 'Configurações do app',
      onPress: () => navigation.navigate('Configuracoes') // Navega para tela de configurações
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        {/* Título do app */}
        <Text style={styles.title}>MediCuidado</Text>

        {/* Subtítulo indicando o tipo de usuário */}
        <Text style={styles.subtitle}>Painel do Cuidador</Text>

        {/* Botão de logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView style={styles.content}>
        {/* Grade de itens do menu */}
        <View style={styles.grid}>
          {/* Mapeia e renderiza cada item do menu */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                // Cor de fundo baseada no tema
                { backgroundColor: isDark ? '#1e1e1e' : '#fff' }
              ]}
              onPress={item.onPress} // Navega ao clicar
            >
              {/* Ícone do item (emoji) */}
              <Text style={styles.menuIcon}>{item.icon}</Text>

              {/* Título do item */}
              <Text style={[styles.menuTitle, { color: isDark ? '#ddd' : '#333' }]}>
                {item.title}
              </Text>

              {/* Descrição do item */}
              <Text style={[styles.menuDescription, { color: isDark ? '#bbb' : '#666' }]}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  logoutButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;

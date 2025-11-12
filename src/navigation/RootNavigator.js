/**
 * ========================================
 * ROOT NAVIGATOR - NAVEGAÇÃO PRINCIPAL
 * ========================================
 *
 * Este arquivo gerencia toda a navegação do aplicativo.
 *
 * ESTRUTURA DE NAVEGAÇÃO:
 * 1. LoadingScreen - Tela de carregamento inicial
 * 2. SelectUserTypeScreen - Seleção de tipo de usuário (Cuidador ou Idoso)
 * 3. Stack Navigator - Navegação entre telas baseada no tipo de usuário
 *
 * TIPOS DE USUÁRIO:
 * - Cuidador: Acesso completo (adicionar, editar, excluir)
 * - Idoso: Acesso limitado (visualizar e marcar como tomado)
 *
 * FUNCIONALIDADES:
 * - Navegação por pilha (Stack Navigator)
 * - Barra de abas customizada (CustomTabBar)
 * - Suporte a tema claro/escuro
 * - Safe Area para diferentes dispositivos
 */

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity, View, StyleSheet, useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemePreference } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import SelectUserTypeScreen from '../screens/SelectUserTypeScreen';

// ========================================
// IMPORTAÇÃO DAS TELAS PRINCIPAIS
// ========================================
import HomeScreen from '../screens/HomeScreen'; // Tela inicial do cuidador
import CuidadoHomeScreen from '../screens/CuidadoHomeScreen'; // Tela inicial do idoso

// ========================================
// IMPORTAÇÃO DAS TELAS ESPECÍFICAS
// ========================================
import MedicamentosScreen from '../screens/MedicamentosScreen'; // Lista de medicamentos
import AddMedicamentoScreen from '../screens/AddMedicamentoScreen'; // Adicionar medicamento
import EditMedicamentoScreen from '../screens/EditMedicamentoScreen'; // Editar medicamento
import AlarmesScreen from '../screens/AlarmesScreen'; // Lista de alarmes
import AddAlarmeScreen from '../screens/AddAlarmeScreen'; // Adicionar alarme
import EditAlarmeScreen from '../screens/EditAlarmeScreen'; // Editar alarme
import EstoqueScreen from '../screens/EstoqueScreen'; // Controle de estoque
import HistoricoScreen from '../screens/HistoricoScreen'; // Histórico de medicamentos tomados
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen'; // Configurações do app
import AjudaScreen from '../screens/AjudaScreen'; // Tela de ajuda
import NotificacoesScreen from '../screens/NotificacoesScreen'; // Notificações
import PerfilScreen from '../screens/PerfilScreen'; // Perfil do usuário
import PacientesScreen from '../screens/PacientesScreen'; // Lista de pacientes

// Cria o navegador de pilha (Stack Navigator)
const Stack = createStackNavigator();

/**
 * ========================================
 * CUSTOM TAB BAR - BARRA DE ABAS CUSTOMIZADA
 * ========================================
 *
 * Componente de navegação por abas na parte inferior da tela.
 * Usado na tela inicial do cuidador para navegar entre seções.
 *
 * ABAS DISPONÍVEIS:
 * - Início: Tela principal com resumo
 * - Medicamentos: Lista de medicamentos
 * - Alarmes: Lista de alarmes
 * - Pacientes: Lista de pacientes
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.activeTab - Aba atualmente ativa
 * @param {Function} props.onTabPress - Função chamada ao pressionar uma aba
 */
const CustomTabBar = ({ activeTab, onTabPress }) => {
  // Obtém o tema atual (claro ou escuro)
  const { isDark } = useThemePreference();

  // Obtém as margens de segurança do dispositivo (notch, barra de navegação, etc.)
  const insets = useSafeAreaInsets();

  /**
   * Configuração das abas
   * Cada aba tem:
   * - key: Identificador único
   * - label: Texto exibido
   * - icon: Emoji exibido
   */
  const tabs = [
    { key: 'home', label: 'Início', icon: '🏠' },
    { key: 'medicamentos', label: 'Medicamentos', icon: '💊' },
    { key: 'alarmes', label: 'Alarmes', icon: '⏰' },
    { key: 'pacientes', label: 'Pacientes', icon: '👥' },
  ];

  return (
    <View style={[
      styles.tabBar,
      {
        // Cor de fundo baseada no tema
        backgroundColor: isDark ? '#121212' : '#fff',
        // Cor da borda superior baseada no tema
        borderTopColor: isDark ? '#222' : '#e0e0e0',
        // Padding inferior para Android (respeita a barra de navegação)
        paddingBottom: Platform.OS === 'android' ? insets.bottom : 8,
      }
    ]}>
      {/* Mapeia e renderiza cada aba */}
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            // Aplica estilo diferente para a aba ativa
            activeTab === tab.key && (isDark ? styles.tabItemActiveDark : styles.tabItemActive)
          ]}
          onPress={() => onTabPress(tab.key)} // Chama a função ao pressionar
        >
          {/* Ícone da aba (emoji) */}
          <Text style={[
            styles.tabIcon,
            activeTab === tab.key && styles.tabIconActive
          ]}>
            {tab.icon}
          </Text>

          {/* Label da aba (texto) */}
          <Text style={[
            styles.tabLabel,
            { color: isDark ? '#ccc' : '#666' },
            activeTab === tab.key && (isDark ? styles.tabLabelActiveDark : styles.tabLabelActive)
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Screen wrapper com barra de navegação customizada
const CuidadorTabNavigator = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState('home');

  // Reset to home tab when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setActiveTab('home');
    });

    return unsubscribe;
  }, [navigation]);

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
    switch (tabKey) {
      case 'home':
        // Já estamos na home
        break;
      case 'medicamentos':
        navigation.navigate('MedicamentosTab');
        break;
      case 'alarmes':
        navigation.navigate('AlarmesTab');
        break;
      case 'pacientes':
        navigation.navigate('PacientesTab');
        break;
    }
  };

  const getCurrentScreen = () => {
    switch (activeTab) {
      case 'medicamentos':
        return <MedicamentosScreen navigation={navigation} />;
      case 'alarmes':
        return <AlarmesScreen navigation={navigation} />;
      case 'pacientes':
        return <PacientesScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {getCurrentScreen()}
      </View>
      <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const RootNavigator = () => {
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
  const navTheme = isDark ? DarkTheme : DefaultTheme;
  const { userType, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userType ? (
          <Stack.Screen
            name="SelectUserType"
            component={SelectUserTypeScreen}
          />
        ) : userType === 'cuidador' ? (
          // Navegação completa para cuidadores
          <>
            <Stack.Screen name="Main" component={CuidadorTabNavigator} />
            <Stack.Screen name="MedicamentosTab" component={MedicamentosScreen} />
            <Stack.Screen name="AlarmesTab" component={AlarmesScreen} />
            <Stack.Screen name="PacientesTab" component={PacientesScreen} />
            <Stack.Screen name="AddMedicamento" component={AddMedicamentoScreen} />
            <Stack.Screen name="EditMedicamento" component={EditMedicamentoScreen} />
            <Stack.Screen name="AddAlarme" component={AddAlarmeScreen} />
            <Stack.Screen name="EditAlarme" component={EditAlarmeScreen} />
            <Stack.Screen name="Estoque" component={EstoqueScreen} />
            <Stack.Screen name="Historico" component={HistoricoScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="Ajuda" component={AjudaScreen} />
            <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
          </>
        ) : (
          // Interface simplificada para idosos
          <>
            <Stack.Screen name="CuidadoHome" component={CuidadoHomeScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
            <Stack.Screen name="Ajuda" component={AjudaScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 0 : 8,
    minHeight: 70,
    // Garante que a barra fica acima da navegação do Android
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tabItemActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabItemActiveDark: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconActive: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tabLabelActiveDark: {
    color: '#81C784',
    fontWeight: 'bold',
  },
});

export default RootNavigator;

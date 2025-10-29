import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity, View, StyleSheet, useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemePreference } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import SelectUserTypeScreen from '../screens/SelectUserTypeScreen';

// Telas principais
import HomeScreen from '../screens/HomeScreen';
import CuidadoHomeScreen from '../screens/CuidadoHomeScreen';

// Telas específicas
import MedicamentosScreen from '../screens/MedicamentosScreen';
import AddMedicamentoScreen from '../screens/AddMedicamentoScreen';
import AlarmesScreen from '../screens/AlarmesScreen';
import EstoqueScreen from '../screens/EstoqueScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import AjudaScreen from '../screens/AjudaScreen';
import NotificacoesScreen from '../screens/NotificacoesScreen';
import PerfilScreen from '../screens/PerfilScreen';
import EditMedicamentoScreen from '../screens/EditMedicamentoScreen';
import PacientesScreen from '../screens/PacientesScreen';


const Stack = createStackNavigator();

// Componente de navegação customizada para evitar problemas com bottom tabs
const CustomTabBar = ({ activeTab, onTabPress }) => {
  const { isDark } = useThemePreference();
  const insets = useSafeAreaInsets();

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
        backgroundColor: isDark ? '#121212' : '#fff',
        borderTopColor: isDark ? '#222' : '#e0e0e0',
        paddingBottom: Platform.OS === 'android' ? insets.bottom : 8,
      }
    ]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && (isDark ? styles.tabItemActiveDark : styles.tabItemActive)
          ]}
          onPress={() => onTabPress(tab.key)}
        >
          <Text style={[
            styles.tabIcon,
            activeTab === tab.key && styles.tabIconActive
          ]}>
            {tab.icon}
          </Text>
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
  const { isDark } = useThemePreference();
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
            <Stack.Screen name="Estoque" component={EstoqueScreen} />
            <Stack.Screen name="Historico" component={HistoricoScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="Ajuda" component={AjudaScreen} />
            <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
            <Stack.Screen name="EditMedicamento" component={EditMedicamentoScreen} />
          </>
        ) : (
          // Interface simplificada para idosos
          <>
            <Stack.Screen name="CuidadoHome" component={CuidadoHomeScreen} />
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

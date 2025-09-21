import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
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
import PacientesScreen from '../screens/PacientesScreen';
import AjudaScreen from '../screens/AjudaScreen';
import NotificacoesScreen from '../screens/NotificacoesScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createStackNavigator();

// Componente de navegação customizada para evitar problemas com bottom tabs
const CustomTabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { key: 'home', label: 'Início', icon: '🏠' },
    { key: 'medicamentos', label: 'Medicamentos', icon: '💊' },
    { key: 'alarmes', label: 'Alarmes', icon: '⏰' },
    { key: 'pacientes', label: 'Pacientes', icon: '👥' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && styles.tabItemActive
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
            activeTab === tab.key && styles.tabLabelActive
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
  const { userType, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
    height: 70,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
    color: '#666',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default RootNavigator;

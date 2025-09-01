import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Telas
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PacientesScreen from '../screens/pacientes/PacientesScreen';
import DetalhePacienteScreen from '../screens/pacientes/DetalhePacienteScreen';
import PrescricaoScreen from '../screens/prescricao/PrescricaoScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';

// Tipos de navegação
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação principal após autenticação
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pacientes"
        component={PacientesNavigator}
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user-circle" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador de pacientes (stack)
const PacientesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ListaPacientes" component={PacientesScreen} options={{ title: 'Pacientes' }} />
      <Stack.Screen name="DetalhePaciente" component={DetalhePacienteScreen} options={{ title: 'Detalhes do Paciente' }} />
      <Stack.Screen name="Prescricao" component={PrescricaoScreen} options={{ title: 'Prescrição' }} />
    </Stack.Navigator>
  );
};

// Ícone da tab bar
const TabBarIcon = ({ name, color }: { name: string, color: string }) => {
  // Placeholder para ícones - numa implementação real, usaria uma biblioteca como react-native-vector-icons
  return null;
};

// Navegador principal que decide entre fluxo de autenticação ou conteúdo do app
const MainNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;

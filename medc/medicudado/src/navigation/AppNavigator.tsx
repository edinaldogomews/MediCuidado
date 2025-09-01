import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/home/HomeScreen';
import MedicamentosScreen from '../screens/medicamentos/MedicamentosScreen';
import AddMedicamentoScreen from '../screens/medicamentos/AddMedicamentoScreen';
import AlarmesScreen from '../screens/alarmes/AlarmesScreen';
import HistoricoScreen from '../screens/historico/HistoricoScreen';
import EstoqueScreen from '../screens/estoque/EstoqueScreen';
import NotificacoesScreen from '../screens/notificacoes/NotificacoesScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MedicamentosStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MedicamentosList"
        component={MedicamentosScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMedicamento"
        component={AddMedicamentoScreen}
        options={{
          headerTitle: 'Novo Medicamento',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

const PerfilStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PerfilMain"
        component={PerfilScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notificacoes"
        component={NotificacoesScreen}
        options={{
          headerTitle: 'Configurar Notificações',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Medicamentos"
          component={MedicamentosStack}
        />
        <Tab.Screen
          name="Alarmes"
          component={AlarmesScreen}
        />
        <Tab.Screen
          name="Histórico"
          component={HistoricoScreen}
        />
        <Tab.Screen
          name="Estoque"
          component={EstoqueScreen}
        />
        <Tab.Screen
          name="Perfil"
          component={PerfilStack}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

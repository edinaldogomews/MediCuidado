import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import SelectUserTypeScreen from '../screens/auth/SelectUserTypeScreen';
import PinVerificationScreen from '../screens/auth/PinVerificationScreen';
import AppNavigator from './AppNavigator';
import CuidadoHomeScreen from '../screens/cuidado/CuidadoHomeScreen';
import SecuritySettingsScreen from '../screens/settings/SecuritySettingsScreen';
import LoadingScreen from '../screens/common/LoadingScreen';
import ConfigurarPinScreen from '../screens/configuracoes/ConfigurarPinScreen';
import AjudaScreen from '../screens/ajuda/AjudaScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { userType, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userType ? (
          // Fluxo inicial - Seleção de tipo de usuário
          <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} />
        ) : userType === 'cuidador' ? (
          // Fluxo do cuidador - Acesso completo
          <>
            <Stack.Screen name="App" component={AppNavigator} />
            <Stack.Screen
              name="SecuritySettings"
              component={SecuritySettingsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Segurança',
                headerStyle: {
                  backgroundColor: '#4CAF50',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="PinVerification"
              component={PinVerificationScreen}
              options={{
                headerShown: false,
                presentation: 'modal'
              }}
            />
          </>
        ) : (
          // Fluxo do idoso - Acesso limitado
          <Stack.Screen name="CuidadoHome" component={CuidadoHomeScreen} />
        )}
        <Stack.Screen
          name="ConfigurarPin"
          component={ConfigurarPinScreen}
          options={{
            headerShown: true,
            headerTitle: 'Configurar PIN',
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="Ajuda"
          component={AjudaScreen}
          options={{
            headerShown: true,
            headerTitle: 'Ajuda e Suporte',
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

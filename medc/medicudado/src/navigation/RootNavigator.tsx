gimport React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import SelectUserTypeScreen from '../screens/auth/SelectUserTypeScreen';
import AppNavigator from './AppNavigator';
import CuidadoHomeScreen from '../screens/cuidado/CuidadoHomeScreen';
import LoadingScreen from '../screens/common/LoadingScreen';

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
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          // Fluxo do idoso - Acesso limitado
          <Stack.Screen name="CuidadoHome" component={CuidadoHomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../screens/LoadingScreen';
import SelectUserTypeScreen from '../screens/SelectUserTypeScreen';
import HomeScreen from '../screens/HomeScreen';
import CuidadoHomeScreen from '../screens/CuidadoHomeScreen';

const Stack = createStackNavigator();

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
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        ) : (
          <Stack.Screen
            name="CuidadoHome"
            component={CuidadoHomeScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

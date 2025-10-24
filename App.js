import React from 'react';
import { View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useThemePreference } from './src/contexts/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { MedicamentosProvider } from './src/screens/MedicamentosContext';

export default function App() {
  return (
    <ThemeProvider>
      <MedicamentosProvider>
        <AppInner />
      </MedicamentosProvider>
    </ThemeProvider>
  );
};

const AppInner = () => {
  const { isDark } = useThemePreference();
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </View>
  );
};



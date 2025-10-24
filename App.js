import React from 'react';
import { View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useThemePreference } from './src/contexts/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { MedicamentosProvider } from './src/screens/MedicamentosContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MedicamentosProvider>
          <AppInner />
        </MedicamentosProvider>
      </ThemeProvider>
    </SafeAreaProvider>
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



import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useThemePreference } from './src/contexts/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { MedicamentosProvider } from './src/screens/MedicamentosContext';
import databaseService from './src/database/DatabaseService';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function initDatabase() {
      try {
        await databaseService.init();
        setIsDbReady(true);
      } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        setIsDbReady(true); // Continua mesmo com erro
      }
    }
    initDatabase();
  }, []);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
      </View>
    );
  }

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



import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserTypeState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const initializeApp = async () => {
      try {
        // Aqui você pode verificar se há dados salvos no AsyncStorage
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const setUserType = async (type) => {
    try {
      setUserTypeState(type);
    } catch (error) {
      console.error('Erro ao definir tipo de usuário:', error);
      throw error;
    }
  };

  const clearUserType = async () => {
    try {
      setUserTypeState(null);
    } catch (error) {
      console.error('Erro ao limpar tipo de usuário:', error);
      throw error;
    }
  };

  const logout = () => {
    clearUserType();
  };

  const canEdit = userType === 'cuidador';

  const value = {
    userType,
    isLoading,
    setUserType,
    clearUserType,
    logout,
    canEdit,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

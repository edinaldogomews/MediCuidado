import React, { createContext, useState, useContext, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

interface AuthContextData {
  userType: 'idoso' | 'cuidador' | null;
  isLoading: boolean;
  setUserType: (type: 'idoso' | 'cuidador') => Promise<void>;
  clearUserType: () => Promise<void>;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [userType, setUserTypeState] = useState<'idoso' | 'cuidador' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUserType();
  }, []);

  const loadStoredUserType = async () => {
    try {
      const storedType = await StorageService.getUserType();
      setUserTypeState(storedType);
    } catch (error) {
      console.error('Erro ao carregar tipo de usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserType = async (type: 'idoso' | 'cuidador') => {
    try {
      await StorageService.setUserType(type);
      setUserTypeState(type);
    } catch (error) {
      console.error('Erro ao definir tipo de usuário:', error);
      throw error;
    }
  };

  const clearUserType = async () => {
    try {
      await StorageService.clearUserType();
      setUserTypeState(null);
    } catch (error) {
      console.error('Erro ao limpar tipo de usuário:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        isLoading,
        setUserType,
        clearUserType,
        canEdit: userType === 'cuidador',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

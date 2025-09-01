import React, { createContext, useState, useContext, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { Alert } from 'react-native';

interface SecurityContextData {
  hasPin: boolean;
  isLoading: boolean;
  setUpPin: (pin: string) => Promise<void>;
  removePin: () => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  requirePin: (action: string) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextData>({} as SecurityContextData);

export const SecurityProvider: React.FC = ({ children }) => {
  const [hasPin, setHasPin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const pinExists = await StorageService.hasPinProtection();
      setHasPin(pinExists);
    } catch (error) {
      console.error('Erro ao verificar status do PIN:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUpPin = async (pin: string) => {
    try {
      await StorageService.setPinProtection(pin);
      setHasPin(true);
    } catch (error) {
      console.error('Erro ao configurar PIN:', error);
      throw error;
    }
  };

  const removePin = async () => {
    try {
      await StorageService.setPinProtection(null);
      setHasPin(false);
    } catch (error) {
      console.error('Erro ao remover PIN:', error);
      throw error;
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    const storedPin = await StorageService.getPin();
    return pin === storedPin;
  };

  const requirePin = async (action: string): Promise<boolean> => {
    if (!hasPin) return true;

    return new Promise((resolve) => {
      Alert.alert(
        'Verificação de Segurança',
        `Digite o PIN para ${action}`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Confirmar',
            onPress: async (pin) => {
              const isValid = await verifyPin(pin as string);
              resolve(isValid);
              if (!isValid) {
                Alert.alert('Erro', 'PIN incorreto');
              }
            },
          },
        ]
      );
    });
  };

  return (
    <SecurityContext.Provider
      value={{
        hasPin,
        isLoading,
        setUpPin,
        removePin,
        verifyPin,
        requirePin,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);

  if (!context) {
    throw new Error('useSecurity deve ser usado dentro de um SecurityProvider');
  }

  return context;
};

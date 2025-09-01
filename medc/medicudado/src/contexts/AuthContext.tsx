import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina o tipo para as informações do usuário
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Defina o tipo para o contexto de autenticação
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

// Crie o contexto de autenticação
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifique o estado de autenticação ao carregar o componente
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const userJson = await AsyncStorage.getItem('@medicudado:user');
        const token = await AsyncStorage.getItem('@medicudado:token');

        if (userJson && token) {
          setUser(JSON.parse(userJson));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao verificar estado de autenticação', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Função de login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Em uma implementação real, você faria uma chamada de API aqui
      // Simulando uma chamada de API bem-sucedida para fins de demonstração
      if (username === 'usuario' && password === 'senha') {
        const mockUser: User = {
          id: '1',
          name: 'Usuário MediCudado',
          email: 'usuario@medicudado.com.br',
          role: 'medico',
        };

        // Armazene os dados do usuário e o token
        await AsyncStorage.setItem('@medicudado:user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('@medicudado:token', 'mock-token-12345');

        setUser(mockUser);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao fazer login', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);

      // Remova os dados do usuário e o token
      await AsyncStorage.removeItem('@medicudado:user');
      await AsyncStorage.removeItem('@medicudado:token');

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

/**
 * ========================================
 * AUTH CONTEXT - CONTEXTO DE AUTENTICAÇÃO
 * ========================================
 *
 * Este arquivo gerencia o tipo de usuário do aplicativo.
 *
 * TIPOS DE USUÁRIO:
 * - 'cuidador': Pode adicionar, editar e excluir medicamentos e alarmes
 * - 'idoso': Pode apenas visualizar e marcar medicamentos como tomados
 * - null: Nenhum usuário selecionado (tela de seleção)
 *
 * FUNCIONALIDADES:
 * - Define o tipo de usuário atual
 * - Controla permissões de edição (canEdit)
 * - Gerencia estado de carregamento inicial
 * - Fornece função de logout
 *
 * COMO USAR:
 * 1. Envolva o app com <AuthProvider>
 * 2. Use o hook useAuth() em qualquer componente
 * 3. Acesse userType para saber qual tipo de usuário está logado
 * 4. Use canEdit para verificar se pode editar
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext();

/**
 * AUTH PROVIDER - Provedor de Autenticação
 *
 * Componente que envolve o app e fornece informações de autenticação.
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const AuthProvider = ({ children }) => {
  // Estado que armazena o tipo de usuário atual ('cuidador', 'idoso' ou null)
  const [userType, setUserTypeState] = useState(null);

  // Estado que indica se o app está carregando (inicialização)
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect que executa ao montar o componente
   * Simula um carregamento inicial do app
   */
  useEffect(() => {
    /**
     * Função de inicialização do app
     * Aqui você pode:
     * - Verificar se há um usuário salvo no AsyncStorage
     * - Carregar configurações iniciais
     * - Inicializar o banco de dados
     */
    const initializeApp = async () => {
      try {
        // Simula um delay de carregamento (1 segundo)
        // Em produção, aqui você carregaria dados do AsyncStorage
        await new Promise(resolve => setTimeout(resolve, 1000));

        // EXEMPLO de como carregar usuário salvo:
        // const savedUserType = await AsyncStorage.getItem('userType');
        // if (savedUserType) {
        //   setUserTypeState(savedUserType);
        // }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        // Sempre marca como carregado, mesmo se der erro
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []); // Array vazio = executa apenas uma vez ao montar

  /**
   * Define o tipo de usuário
   *
   * @param {string} type - Tipo do usuário ('cuidador' ou 'idoso')
   *
   * EXEMPLO:
   * setUserType('cuidador') // Define como cuidador
   * setUserType('idoso')    // Define como idoso
   */
  const setUserType = async (type) => {
    try {
      setUserTypeState(type);

      // OPCIONAL: Salvar no AsyncStorage para persistir entre sessões
      // await AsyncStorage.setItem('userType', type);
    } catch (error) {
      console.error('Erro ao definir tipo de usuário:', error);
      throw error;
    }
  };

  /**
   * Limpa o tipo de usuário (volta para tela de seleção)
   *
   * EXEMPLO:
   * clearUserType() // Remove o usuário atual
   */
  const clearUserType = async () => {
    try {
      setUserTypeState(null);

      // OPCIONAL: Remover do AsyncStorage
      // await AsyncStorage.removeItem('userType');
    } catch (error) {
      console.error('Erro ao limpar tipo de usuário:', error);
      throw error;
    }
  };

  /**
   * Função de logout
   * Limpa o tipo de usuário e volta para tela de seleção
   *
   * EXEMPLO:
   * logout() // Faz logout do usuário atual
   */
  const logout = () => {
    clearUserType();
  };

  /**
   * Verifica se o usuário atual pode editar
   * Apenas cuidadores podem editar medicamentos e alarmes
   *
   * EXEMPLO:
   * if (canEdit) {
   *   // Mostrar botão de editar
   * }
   */
  const canEdit = userType === 'cuidador';

  /**
   * Objeto com todos os valores e funções do contexto
   * Este objeto será acessível via useAuth()
   */
  const value = {
    userType,      // Tipo do usuário atual ('cuidador', 'idoso' ou null)
    isLoading,     // Se está carregando
    setUserType,   // Função para definir o tipo de usuário
    clearUserType, // Função para limpar o tipo de usuário
    logout,        // Função de logout
    canEdit,       // Se o usuário pode editar (true para cuidador)
  };

  // Fornece o valor do contexto para todos os componentes filhos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * HOOK PERSONALIZADO - useAuth
 *
 * Hook para acessar informações de autenticação em qualquer componente.
 *
 * EXEMPLO DE USO:
 * ```javascript
 * const { userType, canEdit, logout } = useAuth();
 *
 * // Verificar tipo de usuário
 * if (userType === 'cuidador') {
 *   // Mostrar opções de cuidador
 * }
 *
 * // Verificar se pode editar
 * if (canEdit) {
 *   // Mostrar botão de editar
 * }
 *
 * // Fazer logout
 * logout();
 * ```
 *
 * @returns {Object} Objeto com userType, isLoading, setUserType, clearUserType, logout, canEdit
 * @throws {Error} Se usado fora do AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Verifica se o hook está sendo usado dentro do AuthProvider
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

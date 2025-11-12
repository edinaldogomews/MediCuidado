/**
 * ========================================
 * THEME CONTEXT - CONTEXTO DE TEMA
 * ========================================
 *
 * Este arquivo gerencia o tema (claro/escuro) do aplicativo.
 *
 * FUNCIONALIDADES:
 * - Permite escolher entre tema claro, escuro ou automático (sistema)
 * - Salva a preferência do usuário no AsyncStorage
 * - Detecta automaticamente o tema do sistema operacional
 * - Fornece o estado do tema para todos os componentes do app
 *
 * COMO USAR:
 * 1. Envolva o app com <ThemeProvider>
 * 2. Use o hook useThemePreference() em qualquer componente
 * 3. Acesse isDark para saber se está no modo escuro
 * 4. Use setThemePreference('light'|'dark'|'system') para mudar o tema
 */

import React from 'react';
import { Appearance } from 'react-native'; // API do React Native para detectar tema do sistema
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para salvar preferências

// Chave usada para salvar a preferência no AsyncStorage
const THEME_PREFERENCE_KEY = 'themePreference'; // Valores possíveis: 'light' | 'dark' | 'system'

/**
 * Cria o contexto do tema com valores padrão
 * Este contexto será compartilhado por todo o app
 */
const ThemeContext = React.createContext({
  themePreference: 'system', // Preferência do usuário (padrão: seguir o sistema)
  isDark: false,             // Se o tema atual é escuro
  setThemePreference: (_pref) => {}, // Função para mudar a preferência
});

/**
 * THEME PROVIDER - Provedor do Tema
 *
 * Componente que envolve o app e fornece o tema para todos os filhos.
 * Gerencia o estado do tema e sincroniza com o AsyncStorage.
 *
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos que terão acesso ao tema
 */
export const ThemeProvider = ({ children }) => {
  // Estado que armazena a preferência do usuário ('light', 'dark' ou 'system')
  const [themePreference, setThemePreferenceState] = React.useState('system');

  // Estado que armazena o tema atual do sistema operacional
  const [systemScheme, setSystemScheme] = React.useState(Appearance.getColorScheme());

  /**
   * Effect que executa ao montar o componente
   * Carrega a preferência salva e escuta mudanças no tema do sistema
   */
  React.useEffect(() => {
    // Função assíncrona para carregar a preferência salva
    const load = async () => {
      try {
        // Busca a preferência salva no AsyncStorage
        const saved = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);

        // Valida se é um valor válido antes de aplicar
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemePreferenceState(saved);
        }
      } catch {
        // Se der erro ao carregar, mantém o padrão 'system'
      }
    };
    load(); // Executa o carregamento

    // Adiciona listener para detectar mudanças no tema do sistema
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme); // Atualiza quando o sistema mudar de tema
    });

    // Cleanup: remove o listener quando o componente desmontar
    return () => sub.remove();
  }, []); // Array vazio = executa apenas uma vez ao montar

  /**
   * Função para alterar a preferência de tema
   * Salva no estado e no AsyncStorage
   *
   * @param {string} pref - Nova preferência ('light', 'dark' ou 'system')
   */
  const setThemePreference = React.useCallback(async (pref) => {
    // Atualiza o estado local
    setThemePreferenceState(pref);

    try {
      // Salva a preferência no AsyncStorage para persistir entre sessões
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, pref);
    } catch {
      // Se der erro ao salvar, apenas ignora (preferência fica só na sessão atual)
    }
  }, []); // Array vazio = função nunca muda

  /**
   * Calcula se o tema atual deve ser escuro
   * Lógica:
   * - Se preferência é 'dark' → sempre escuro
   * - Se preferência é 'light' → sempre claro
   * - Se preferência é 'system' → segue o tema do sistema
   */
  const isDark = React.useMemo(() => {
    if (themePreference === 'dark') return true;   // Forçar escuro
    if (themePreference === 'light') return false; // Forçar claro
    return systemScheme === 'dark';                // Seguir o sistema
  }, [themePreference, systemScheme]); // Recalcula quando qualquer um mudar

  /**
   * Cria o objeto de valor que será fornecido pelo contexto
   * useMemo evita recriação desnecessária do objeto
   */
  const value = React.useMemo(
    () => ({ themePreference, isDark, setThemePreference }),
    [themePreference, isDark, setThemePreference]
  );

  // Fornece o valor do contexto para todos os componentes filhos
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * HOOK PERSONALIZADO - useThemePreference
 *
 * Hook para acessar o tema em qualquer componente.
 *
 * EXEMPLO DE USO:
 * ```javascript
 * const { isDark, themePreference, setThemePreference } = useThemePreference();
 *
 * // Verificar se está no modo escuro
 * if (isDark) {
 *   // Aplicar estilos escuros
 * }
 *
 * // Mudar para tema escuro
 * setThemePreference('dark');
 * ```
 *
 * @returns {Object} Objeto com themePreference, isDark e setThemePreference
 */
export const useThemePreference = () => React.useContext(ThemeContext);



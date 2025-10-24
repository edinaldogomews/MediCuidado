import React from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_PREFERENCE_KEY = 'themePreference'; // 'light' | 'dark' | 'system'

const ThemeContext = React.createContext({
  themePreference: 'system',
  isDark: false,
  setThemePreference: (_pref) => {},
});

export const ThemeProvider = ({ children }) => {
  const [themePreference, setThemePreferenceState] = React.useState('system');
  const [systemScheme, setSystemScheme] = React.useState(Appearance.getColorScheme());

  React.useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemePreferenceState(saved);
        }
      } catch {}
    };
    load();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setThemePreference = React.useCallback(async (pref) => {
    setThemePreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, pref);
    } catch {}
  }, []);

  const isDark = React.useMemo(() => {
    if (themePreference === 'dark') return true;
    if (themePreference === 'light') return false;
    return systemScheme === 'dark';
  }, [themePreference, systemScheme]);

  const value = React.useMemo(() => ({ themePreference, isDark, setThemePreference }), [themePreference, isDark, setThemePreference]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemePreference = () => React.useContext(ThemeContext);



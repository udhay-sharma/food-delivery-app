import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as RNuseColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ThemeColors } from '@/constants/theme';

export type ThemeSettingType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeSetting: ThemeSettingType;
  theme: 'light' | 'dark'; // The resolved theme ('light' or 'dark')
  colors: ThemeColors; // The active theme's colors object
  setThemeSetting: (newSetting: ThemeSettingType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSetting, setThemeSettingState] = useState<ThemeSettingType>('dark');
  const systemScheme = RNuseColorScheme();

  // Load the persisted theme on startup
  useEffect(() => {
    const loadThemeSetting = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@app_theme_setting');
        if (storedTheme) {
          setThemeSettingState(storedTheme as ThemeSettingType);
        } else {
          // Default to 'dark' to preserve the premium dark visual brand on first run
          setThemeSettingState('dark');
          await AsyncStorage.setItem('@app_theme_setting', 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme setting:', error);
      }
    };
    loadThemeSetting();
  }, []);

  // Determine the resolved active theme ('light' or 'dark')
  const resolvedTheme: 'light' | 'dark' = (() => {
    if (themeSetting === 'system') {
      return systemScheme === 'light' ? 'light' : 'dark';
    }
    return themeSetting;
  })();

  const activeColors = Colors[resolvedTheme];

  const setThemeSetting = async (newSetting: ThemeSettingType) => {
    try {
      setThemeSettingState(newSetting);
      await AsyncStorage.setItem('@app_theme_setting', newSetting);
    } catch (error) {
      console.error('Failed to save theme setting:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeSetting,
        theme: resolvedTheme,
        colors: activeColors,
        setThemeSetting,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

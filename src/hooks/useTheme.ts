import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, Theme } from '../constants/themes';

const THEME_KEY = 'theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(themes.light);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') {
        setTheme(themes.dark);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === themes.light ? themes.dark : themes.light;
    setTheme(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme === themes.dark ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}
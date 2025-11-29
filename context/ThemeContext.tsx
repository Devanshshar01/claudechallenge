import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType;
    actualTheme: 'light' | 'dark';
    setTheme: (theme: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    actualTheme: 'light',
    setTheme: async () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useSystemColorScheme();
    const [theme, setThemeState] = useState<ThemeType>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user_theme');
            if (savedTheme) {
                setThemeState(savedTheme as ThemeType);
            }
        } catch (error) {
            console.error('Failed to load theme', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setTheme = async (newTheme: ThemeType) => {
        try {
            await AsyncStorage.setItem('user_theme', newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Failed to save theme', error);
        }
    };

    const actualTheme = theme === 'system'
        ? (systemColorScheme ?? 'light')
        : theme;

    return (
        <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

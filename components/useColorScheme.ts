import { useTheme } from '@/context/ThemeContext';

export const useColorScheme = () => {
    const { actualTheme } = useTheme();
    return actualTheme;
};

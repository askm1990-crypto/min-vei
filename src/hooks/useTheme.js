import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

/**
 * Theme hook — manages dark mode toggle + body class
 */
export function useTheme() {
    const [theme, setTheme] = useLocalStorage('mv2_theme', 'light');

    useEffect(() => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggleTheme, isDark: theme === 'dark' };
}

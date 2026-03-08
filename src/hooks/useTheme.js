import { useAppStore } from '../store/useAppStore';

/**
 * Theme hook — manages dark mode toggle + body class
 */
export function useTheme() {
    const theme = useAppStore(state => state.theme);
    const toggleTheme = useAppStore(state => state.toggleTheme);

    return { theme, toggleTheme, isDark: theme === 'dark' };
}

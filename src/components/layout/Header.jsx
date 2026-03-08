import { Icon } from './Sidebar';
import { useAppStore } from '../../store/useAppStore';
import { getGreeting } from '../../utils/dateUtils';
import './Header.css';

export default function Header() {
    const {
        user, theme, toggleTheme,
        isMenuOpen, setIsMenuOpen
    } = useAppStore();

    const isDark = theme === 'dark';
    const greeting = getGreeting(user?.name);
    const subtitle = 'En dag av gangen.';

    return (
        <header className="header">
            <div className="header__left">
                <button
                    className="header__icon-btn header__menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Åpne meny"
                >
                    <Icon name="menu" />
                </button>
                <div className="header__greeting">
                    <h1>{greeting}</h1>
                    <p className="header__subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="header__actions">
                <button
                    className="header__icon-btn"
                    onClick={toggleTheme}
                    aria-label="Bytt tema"
                >
                    {isDark ? (
                        <Icon name="sun" />
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )}
                </button>
            </div>
        </header>
    );
}

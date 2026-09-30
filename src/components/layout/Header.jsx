import { Icon } from './Sidebar';
import { useAppStore } from '../../store/useAppStore';
import { getGreeting } from '../../utils/dateUtils';
import './Header.css';

export default function Header() {
    const {
        user, theme, toggleTheme,
        currentView, navigate,
    } = useAppStore();

    const isDark = theme === 'dark';
    const greeting = getGreeting(user?.name);

    return (
        <header className="header">
            <div className="header__left">
                <div className="header__mark" aria-hidden="true">
                    <Icon name="sun" />
                </div>
                <div className="header__greeting">
                    <p className="header__eyebrow">En dag av gangen</p>
                    <h1>{greeting}</h1>
                </div>
            </div>

            <div className="header__actions">
                {currentView !== 'crisis' && (
                    <button
                        className="header__sos"
                        onClick={() => navigate('crisis')}
                        aria-label="Krisehjelp"
                    >
                        <Icon name="life-buoy" />
                        <span>SOS</span>
                    </button>
                )}
                <button
                    className="header__icon-btn"
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
                >
                    <Icon name={isDark ? 'sun' : 'moon'} />
                </button>
            </div>
        </header>
    );
}

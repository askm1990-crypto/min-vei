import { Icon } from './Sidebar';
import './Header.css';

export default function Header({ greeting, subtitle, isDark, onToggleTheme, onToggleMenu }) {
    return (
        <header className="header">
            <div className="header__left">
                <button
                    className="header__icon-btn header__menu-btn"
                    onClick={onToggleMenu}
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
                    onClick={onToggleTheme}
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

import { useAppStore } from '../../store/useAppStore';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import './Sidebar.css';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Hjem', icon: 'home' },
    { id: 'timeline', label: 'Dagbok', icon: 'book' },
    { id: 'progress', label: 'Innsikt', icon: 'sparkles' },
    { id: 'goals', label: 'Mål', icon: 'flag' },
    { id: 'strategies', label: 'Mestring', icon: 'anchor' },
    { id: 'knowledge', label: 'Kunnskap', icon: 'book-open' },
    { id: 'profile', label: 'Profil', icon: 'user' },
    { id: 'crisis', label: 'Krisehjelp', icon: 'life-buoy', warning: true },
];

/** SVG icon helper — simple inline feather-style icons */
function Icon({ name }) {
    const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
    const icons = {
        'home': <svg {...p}><path d="M3 10.5 12 3l9 7.5V19a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" /></svg>,
        'edit-3': <svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
        'trending-up': <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
        'lightbulb': <svg {...p}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" /></svg>,
        'sparkles': <svg {...p}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>,
        'flag': <svg {...p}><path d="M4 22V4" /><path d="M4 4h13l-2.5 4.5L17 13H4" /></svg>,
        'anchor': <svg {...p}><circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /></svg>,
        'book-open': <svg {...p}><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" /><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" /></svg>,
        'book': <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M9 7h7" /></svg>,
        'user': <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        'alert-circle': <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
        'life-buoy': <svg {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" /></svg>,
        'sun': <svg {...p}><circle cx="12" cy="12" r="4.5" /><line x1="12" y1="1.5" x2="12" y2="3.5" /><line x1="12" y1="20.5" x2="12" y2="22.5" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1.5" y1="12" x2="3.5" y2="12" /><line x1="20.5" y1="12" x2="22.5" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
        'moon': <svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
        'info': <svg {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
        'x': <svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
        'menu': <svg {...p}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
        'plus': <svg {...p} strokeWidth={2.4}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
        'grid': <svg {...p}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>,
    };
    return icons[name] || null;
}

export { Icon };

export default function Sidebar() {
    const {
        currentView, navigate,
        user,
        disclaimerVisible, setDisclaimerVisible,
        isMenuOpen, setIsMenuOpen
    } = useAppStore();
    const { level, title } = useRecoveryScore();

    // Auto-close menu on selection for mobile
    const handleNavigation = (id) => {
        navigate(id);
        if (isMenuOpen) setIsMenuOpen(false);
    };

    const onClose = () => setIsMenuOpen(false);
    const onDismissDisclaimer = () => setDisclaimerVisible(false);
    const initial = (user?.name || 'M').trim().charAt(0).toUpperCase();

    return (
        <>
            {/* Backdrop for the mobile sheet */}
            <div
                className={`sidebar-overlay ${isMenuOpen ? 'sidebar-overlay--active' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <nav
                className={`sidebar ${isMenuOpen ? 'sidebar--open' : ''}`}
                aria-label="Hovedmeny"
            >
                <span className="sidebar__handle" aria-hidden="true" />

                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">
                        <Icon name="sun" />
                    </div>
                    <div className="sidebar__logo-copy">
                        <span className="sidebar__logo-text">Min Vei</span>
                        <span className="sidebar__logo-tag">En dag av gangen</span>
                    </div>
                </div>

                <ul className="sidebar__nav">
                    {NAV_ITEMS.map(item => (
                        <li
                            key={item.id}
                            className={`sidebar__li ${item.warning ? 'sidebar__li--warning' : ''}`}
                        >
                            <button
                                type="button"
                                className={`sidebar__item ${currentView === item.id ? 'sidebar__item--active' : ''} ${item.warning ? 'sidebar__item--warning' : ''}`}
                                onClick={() => handleNavigation(item.id)}
                                aria-label={item.label}
                                aria-current={currentView === item.id ? 'page' : undefined}
                            >
                                <span className="sidebar__item-icon"><Icon name={item.icon} /></span>
                                <span className="sidebar__item-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="sidebar__foot">
                    {disclaimerVisible && (
                        <div className="sidebar__disclaimer">
                            <div className="sidebar__disclaimer-content">
                                <Icon name="info" />
                                <p><strong>Viktig:</strong> Min Vei erstatter ikke medisinsk behandling. Ved akutt livsfare, ring 113.</p>
                                <button
                                    className="sidebar__dismiss"
                                    onClick={onDismissDisclaimer}
                                    aria-label="Lukk"
                                >
                                    <Icon name="x" />
                                </button>
                            </div>
                        </div>
                    )}

                    {user && (
                        <button
                            type="button"
                            className="sidebar__user"
                            onClick={() => handleNavigation('profile')}
                            aria-label="Åpne profil"
                        >
                            <span className="sidebar__avatar">{initial}</span>
                            <span className="sidebar__user-copy">
                                <strong>{user.name}</strong>
                                <small>Nivå {level} · {title}</small>
                            </span>
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
}

import './Sidebar.css';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Hjem', icon: 'home' },
    { id: 'my-log', label: 'Min Logg', icon: 'edit-3' },
    { id: 'journal', label: 'Dagbok', icon: 'book-open' },
    { id: 'progress', label: 'Fremgang', icon: 'trending-up' },
    { id: 'goals', label: 'Mål', icon: 'flag' },
    { id: 'strategies', label: 'Mestring', icon: 'anchor' },
    { id: 'knowledge', label: 'Kunnskap', icon: 'book' },
    { id: 'profile', label: 'Profil', icon: 'user' },
    { id: 'crisis', label: 'Krisehjelp', icon: 'alert-circle', warning: true },
];

/** SVG icon helper — simple inline feather-style icons */
function Icon({ name }) {
    const icons = {
        'home': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        'edit-3': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
        'trending-up': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
        'flag': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>,
        'anchor': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /></svg>,
        'book-open': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
        'book': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
        'user': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        'alert-circle': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
        'sun': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
        'info': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
        'x': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    };
    return icons[name] || null;
}

export { Icon };

export default function Sidebar({ currentView, onNavigate, disclaimerVisible, onDismissDisclaimer }) {
    return (
        <nav className="sidebar">
            <div className="sidebar__logo">
                <div className="sidebar__logo-icon">
                    <Icon name="sun" />
                </div>
                <span className="sidebar__logo-text">Min Vei</span>
            </div>

            <ul className="sidebar__nav">
                {NAV_ITEMS.map(item => (
                    <li
                        key={item.id}
                        className={`sidebar__item ${currentView === item.id ? 'sidebar__item--active' : ''} ${item.warning ? 'sidebar__item--warning' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        onKeyDown={e => e.key === 'Enter' && onNavigate(item.id)}
                        tabIndex={0}
                        role="button"
                        aria-label={item.label}
                    >
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                    </li>
                ))}
            </ul>

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
        </nav>
    );
}

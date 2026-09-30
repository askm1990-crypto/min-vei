import { Icon } from './Sidebar';
import { useAppStore } from '../../store/useAppStore';
import './TabBar.css';

const LEFT = [
    { id: 'dashboard', label: 'Hjem', icon: 'home' },
    { id: 'timeline', label: 'Dagbok', icon: 'book' },
];
const RIGHT = [
    { id: 'strategies', label: 'Mestring', icon: 'anchor' },
];

/** Floating bottom dock for phones. Centre button starts a new log entry. */
export default function TabBar() {
    const { currentView, navigate, isMenuOpen, setIsMenuOpen } = useAppStore();

    const go = (id) => {
        setIsMenuOpen(false);
        navigate(id);
    };

    const tab = (item) => (
        <button
            key={item.id}
            type="button"
            className={`tabbar__item ${currentView === item.id ? 'tabbar__item--active' : ''}`}
            onClick={() => go(item.id)}
            aria-label={item.label}
            aria-current={currentView === item.id ? 'page' : undefined}
        >
            <Icon name={item.icon} />
            <span>{item.label}</span>
        </button>
    );

    const moreActive = isMenuOpen || !['dashboard', 'timeline', 'strategies', 'log-wizard'].includes(currentView);

    return (
        <div className="tabbar" role="navigation" aria-label="Snarveier">
            {LEFT.map(tab)}

            <button
                type="button"
                className="tabbar__fab"
                onClick={() => go('log-wizard')}
                aria-label="Ny registrering"
            >
                <Icon name="plus" />
            </button>

            {RIGHT.map(tab)}

            <button
                type="button"
                className={`tabbar__item ${moreActive ? 'tabbar__item--active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Mer"
                aria-expanded={isMenuOpen}
            >
                <Icon name="grid" />
                <span>Mer</span>
            </button>
        </div>
    );
}

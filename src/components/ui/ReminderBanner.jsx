import Button from './Button';
import './ReminderBanner.css';
import { useNotificationStore } from '../../store/useNotificationStore';

export default function ReminderBanner({ onNavigate }) {
    const { setShowInAppBanner, setLastInAppBannerShownDate } = useNotificationStore();

    const handleDismiss = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        setLastInAppBannerShownDate(todayStr);
        setShowInAppBanner(false);
    };

    const handleAction = () => {
        handleDismiss();
        onNavigate('timeline');
    };

    return (
        <div className="reminder-banner bounce-in">
            <div className="reminder-banner-content">
                <span className="reminder-banner-icon">📝</span>
                <div className="reminder-banner-text">
                    <strong>God kveld!</strong>
                    <p>Vil du bruke to minutter i dagboken din nå?</p>
                </div>
            </div>
            <div className="reminder-banner-actions">
                <Button variant="primary" size="sm" onClick={handleAction}>Skriv nå</Button>
                <button className="reminder-banner-close" onClick={handleDismiss} aria-label="Lukk varsel">
                    ✕
                </button>
            </div>
        </div>
    );
}

import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';

export function useNotifications() {
    const {
        permissionsGranted,
        setPermissionsGranted,
        dailyReminderEnabled,
        dailyReminderTime,
        lastInAppBannerShownDate,
        setShowInAppBanner,
    } = useNotificationStore();

    const requestPermissions = async () => {
        if (!('Notification' in window)) {
            console.warn('Denne nettleseren støtter ikke skrivebordsvarsler.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setPermissionsGranted(permission === 'granted');
        } catch (error) {
            console.error('Feil ved forespørsel om varslingstillatelse:', error);
            // Ignore error, fallback to in-app banner is handled naturally
        }
    };

    const checkAndShowDailyReminder = () => {
        if (!dailyReminderEnabled) return;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // Do not show if already shown today
        if (lastInAppBannerShownDate === todayStr) return;

        // Parse reminder time (HH:MM)
        const [targetHour, targetMinute] = dailyReminderTime.split(':').map(Number);

        // Check if we are past the reminder time today
        if (now.getHours() > targetHour || (now.getHours() === targetHour && now.getMinutes() >= targetMinute)) {

            // Try Web Notification first
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    new Notification('Tid for refleksjon 📝', {
                        body: 'God kveld! Vil du bruke to minutter i dagboken din nå?',
                        icon: '/vite.svg', // Assuming standard vite icon exists, or fallback
                    });

                    // Consider it shown for today so we don't spam if they reload
                    useNotificationStore.getState().setLastInAppBannerShownDate(todayStr);
                    return;
                } catch (error) {
                    console.error('Kunne ikke vise Web Notification, faller tilbake til In-App Banner:', error);
                    // Safari may throw here, fallback to in-app banner
                }
            }

            // Fallback: Show In-App Banner
            setShowInAppBanner(true);
        }
    };

    return {
        permissionStatus: permissionsGranted ? 'granted' : ('Notification' in window ? Notification.permission : 'unsupported'),
        requestPermissions,
        checkAndShowDailyReminder,
    };
}

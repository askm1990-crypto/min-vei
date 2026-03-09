import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationState {
    permissionsGranted: boolean;
    dailyReminderEnabled: boolean;
    dailyReminderTime: string; // "HH:MM" e.g. "20:00"
    lastInAppBannerShownDate: string | null;
    showInAppBanner: boolean; // Ephemeral flag mapped outside persist
}

export interface NotificationActions {
    setPermissionsGranted: (granted: boolean) => void;
    setDailyReminderEnabled: (enabled: boolean) => void;
    setDailyReminderTime: (time: string) => void;
    setLastInAppBannerShownDate: (date: string | null) => void;
    setShowInAppBanner: (show: boolean) => void;
}

export type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set) => ({
            // State
            permissionsGranted: false,
            dailyReminderEnabled: false,
            dailyReminderTime: "20:00",
            lastInAppBannerShownDate: null,
            showInAppBanner: false,

            // Actions
            setPermissionsGranted: (granted) => set({ permissionsGranted: granted }),
            setDailyReminderEnabled: (enabled) => set({ dailyReminderEnabled: enabled }),
            setDailyReminderTime: (time) => set({ dailyReminderTime: time }),
            setLastInAppBannerShownDate: (date) => set({ lastInAppBannerShownDate: date }),
            setShowInAppBanner: (show) => set({ showInAppBanner: show }),
        }),
        {
            name: 'mv2_notification_store',
            partialize: (state) => ({
                // Only persist these keys explicitly (omit showInAppBanner)
                permissionsGranted: state.permissionsGranted,
                dailyReminderEnabled: state.dailyReminderEnabled,
                dailyReminderTime: state.dailyReminderTime,
                lastInAppBannerShownDate: state.lastInAppBannerShownDate
            })
        }
    )
);

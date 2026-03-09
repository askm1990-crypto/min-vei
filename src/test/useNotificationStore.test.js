/**
 * Unit tests for useNotificationStore (Zustand)
 *
 * @remarks
 * The persist middleware is mocked so localStorage is NOT required.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock persist BEFORE importing the store ───────────────────────────────
vi.mock('zustand/middleware', () => ({
    persist: (fn) => fn,
    devtools: (fn) => fn,
}));

// We dynamically import the store after mocking
const { useNotificationStore } = await import('../store/useNotificationStore');

describe('useNotificationStore', () => {
    beforeEach(() => {
        useNotificationStore.setState({
            permissionsGranted: false,
            dailyReminderEnabled: false,
            dailyReminderTime: "20:00",
            lastInAppBannerShownDate: null,
            showInAppBanner: false,
        });
    });

    it('should have correct default state', () => {
        const state = useNotificationStore.getState();
        expect(state.permissionsGranted).toBe(false);
        expect(state.dailyReminderEnabled).toBe(false);
        expect(state.dailyReminderTime).toBe('20:00');
        expect(state.lastInAppBannerShownDate).toBeNull();
        expect(state.showInAppBanner).toBe(false);
    });

    it('setPermissionsGranted updates state correctly', () => {
        useNotificationStore.getState().setPermissionsGranted(true);
        expect(useNotificationStore.getState().permissionsGranted).toBe(true);
    });

    it('setDailyReminderEnabled updates state correctly', () => {
        useNotificationStore.getState().setDailyReminderEnabled(true);
        expect(useNotificationStore.getState().dailyReminderEnabled).toBe(true);
    });

    it('setDailyReminderTime updates state correctly', () => {
        useNotificationStore.getState().setDailyReminderTime('14:30');
        expect(useNotificationStore.getState().dailyReminderTime).toBe('14:30');
    });

    it('setLastInAppBannerShownDate updates state correctly', () => {
        const dateStr = '2026-03-09';
        useNotificationStore.getState().setLastInAppBannerShownDate(dateStr);
        expect(useNotificationStore.getState().lastInAppBannerShownDate).toBe(dateStr);
    });

    it('setShowInAppBanner updates state correctly', () => {
        useNotificationStore.getState().setShowInAppBanner(true);
        expect(useNotificationStore.getState().showInAppBanner).toBe(true);
    });
});

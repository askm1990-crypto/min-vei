/**
 * Unit tests for useAppStore (Zustand)
 *
 * @remarks
 * The persist middleware is mocked so localStorage is NOT required.
 * This keeps tests deterministic and fast.
 *
 * Future TypeScript migration:
 *   - Store type: `AppState & AppActions`
 *   - Each action can be typed from the store slice definitions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock persist middleware BEFORE importing the store ────────────────────
vi.mock('zustand/middleware', () => ({
    persist: (fn) => fn,
    devtools: (fn) => fn,
}));

// ── Also mock document.body.classList for toggleTheme side-effects ────────
Object.defineProperty(document.body, 'classList', {
    value: { toggle: vi.fn(), add: vi.fn(), remove: vi.fn() },
    writable: true,
});

// ── Import store AFTER mocks are in place ─────────────────────────────────
const { useAppStore } = await import('../store/useAppStore.js');

describe('useAppStore', () => {
    beforeEach(() => {
        // Reset store state between tests
        useAppStore.setState({
            consent: false,
            user: null,
            spending: null,
            disclaimerVisible: true,
            guideSeen: false,
            theme: 'light',
            currentView: 'dashboard',
            activeEventId: null,
            isMenuOpen: false,
            isLocked: false,
            showGuide: false,
        });
    });

    it('consent starts as false', () => {
        expect(useAppStore.getState().consent).toBe(false);
    });

    it('setConsent(true) updates state', () => {
        useAppStore.getState().setConsent(true);
        expect(useAppStore.getState().consent).toBe(true);
    });

    it('navigate("timeline") changes currentView', () => {
        useAppStore.getState().navigate('timeline');
        expect(useAppStore.getState().currentView).toBe('timeline');
    });

    it('navigate("timeline") clears activeEventId', () => {
        useAppStore.setState({ activeEventId: 'old-id' });
        useAppStore.getState().navigate('timeline');
        expect(useAppStore.getState().activeEventId).toBeNull();
    });

    it('navigate("log-wizard-pending", "abc123") sets activeEventId', () => {
        useAppStore.getState().navigate('log-wizard-pending', 'abc123');
        expect(useAppStore.getState().currentView).toBe('log-wizard-pending');
        expect(useAppStore.getState().activeEventId).toBe('abc123');
    });

    it('toggleTheme() switches from "light" to "dark"', () => {
        expect(useAppStore.getState().theme).toBe('light');
        useAppStore.getState().toggleTheme();
        expect(useAppStore.getState().theme).toBe('dark');
    });

    it('toggleTheme() switches back from "dark" to "light"', () => {
        useAppStore.setState({ theme: 'dark' });
        useAppStore.getState().toggleTheme();
        expect(useAppStore.getState().theme).toBe('light');
    });
});

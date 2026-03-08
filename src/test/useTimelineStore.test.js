/**
 * Unit tests for useTimelineStore (Zustand)
 *
 * @remarks
 * The persist middleware is mocked so localStorage is NOT required.
 *
 * Future TypeScript migration:
 *   - Entry type: `TimelineEntry { id: string; date: string; mood?: number; ... }`
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock persist BEFORE importing the store ───────────────────────────────
vi.mock('zustand/middleware', () => ({
    persist: (fn) => fn,
    devtools: (fn) => fn,
}));

const { useTimelineStore } = await import('../store/useTimelineStore.js');

describe('useTimelineStore', () => {
    beforeEach(() => {
        useTimelineStore.setState({ entries: [] });
    });

    it('entries starts as an empty array', () => {
        expect(useTimelineStore.getState().entries).toEqual([]);
    });

    it('setEntries([{id:"1"}]) sets entries directly', () => {
        useTimelineStore.getState().setEntries([{ id: '1' }]);
        expect(useTimelineStore.getState().entries).toEqual([{ id: '1' }]);
    });

    it('setEntries(prev => [...prev, {id:"2"}]) appends via callback', () => {
        useTimelineStore.setState({ entries: [{ id: '1' }] });
        useTimelineStore.getState().setEntries(prev => [...prev, { id: '2' }]);
        expect(useTimelineStore.getState().entries).toEqual([
            { id: '1' },
            { id: '2' },
        ]);
    });

    it('setEntries([]) clears all entries', () => {
        useTimelineStore.setState({ entries: [{ id: '1' }, { id: '2' }] });
        useTimelineStore.getState().setEntries([]);
        expect(useTimelineStore.getState().entries).toHaveLength(0);
    });
});

/**
 * Integration tests for the useTimeline hook.
 * Tests the hook's logic (addEntry, deleteEntry, updateEntry, getStreak)
 * against the Zustand store it wraps.
 *
 * @remarks
 * We test via renderHook from @testing-library/react so that hook
 * state updates go through React's update cycle correctly.
 *
 * The persist middleware is mocked so localStorage is NOT required.
 *
 * Future TypeScript migration:
 *   - Hook return type: `UseTimelineReturn`
 *   - Entry type: `TimelineEntry`
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// ── Mock persist middleware BEFORE importing anything that uses it ─────────
vi.mock('zustand/middleware', () => ({
    persist: (fn) => fn,
    devtools: (fn) => fn,
}));

// Import the store + hook AFTER mocks
const { useTimelineStore } = await import('../store/useTimelineStore.js');
const { useTimeline } = await import('../hooks/useTimeline.js');

describe('useTimeline hook', () => {
    beforeEach(() => {
        // Always start with a fresh empty store
        useTimelineStore.setState({ entries: [] });
    });

    it('addEntry(data) adds a new entry to the timeline', () => {
        const { result } = renderHook(() => useTimeline());

        act(() => {
            result.current.addEntry({ body: 'Test entry', mood: 4 });
        });

        expect(result.current.entries).toHaveLength(1);
        expect(result.current.entries[0].body).toBe('Test entry');
        expect(result.current.entries[0].mood).toBe(4);
        expect(result.current.entries[0].id).toBeDefined();
    });

    it('addEntry() returns the new entry id', () => {
        const { result } = renderHook(() => useTimeline());
        let returnedId;

        act(() => {
            returnedId = result.current.addEntry({ body: 'Another entry' });
        });

        expect(typeof returnedId).toBe('string');
        expect(result.current.entries[0].id).toBe(returnedId);
    });

    it('deleteEntry(id) removes the correct entry', () => {
        // Pre-populate store directly
        useTimelineStore.setState({
            entries: [
                { id: 'entry-1', date: new Date().toISOString(), body: 'Keep me' },
                { id: 'entry-2', date: new Date().toISOString(), body: 'Delete me' },
            ],
        });

        const { result } = renderHook(() => useTimeline());

        act(() => {
            result.current.deleteEntry('entry-2');
        });

        expect(result.current.entries).toHaveLength(1);
        expect(result.current.entries[0].id).toBe('entry-1');
    });

    it('updateEntry(id, changes) updates the correct field', () => {
        useTimelineStore.setState({
            entries: [
                { id: 'entry-1', date: new Date().toISOString(), mood: 2 },
            ],
        });

        const { result } = renderHook(() => useTimeline());

        act(() => {
            result.current.updateEntry('entry-1', { mood: 5 });
        });

        expect(result.current.entries[0].mood).toBe(5);
        // Other fields should be untouched
        expect(result.current.entries[0].id).toBe('entry-1');
    });

    it('updateEntry does not affect other entries', () => {
        useTimelineStore.setState({
            entries: [
                { id: 'entry-1', date: new Date().toISOString(), mood: 3 },
                { id: 'entry-2', date: new Date().toISOString(), mood: 3 },
            ],
        });

        const { result } = renderHook(() => useTimeline());

        act(() => {
            result.current.updateEntry('entry-1', { mood: 5 });
        });

        expect(result.current.entries.find(e => e.id === 'entry-2').mood).toBe(3);
    });

    it('getStreak() returns 0 when entries list is empty', () => {
        const { result } = renderHook(() => useTimeline());
        expect(result.current.getStreak()).toBe(0);
    });

    it('getStreak() returns 1 when there is a valid entry for today', () => {
        // getStreak: computes todayStr as `new Date().setHours(0,0,0,0).toISOString().split('T')[0]`
        // then matches entries by `new Date(e.date).toISOString().split('T')[0]`.
        // We reproduce the same logic here to build a date key that is guaranteed to match.
        const ref = new Date();
        ref.setHours(0, 0, 0, 0); // local midnight
        const todayKey = ref.toISOString().split('T')[0]; // will be today's UTC date

        // Build a Date whose UTC date string equals todayKey: use UTC noon of that day
        const entryDate = `${todayKey}T12:00:00.000Z`;

        useTimelineStore.setState({
            entries: [
                {
                    id: 'entry-today',
                    date: entryDate,
                    mood: 4,
                    body: 'Reflecting today',
                },
            ],
        });

        const { result } = renderHook(() => useTimeline());
        expect(result.current.getStreak()).toBe(1);
    });
});

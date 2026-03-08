/**
 * Unit tests for useGoalsStore (Zustand)
 *
 * @remarks
 * The persist middleware is mocked so localStorage is NOT required.
 *
 * Future TypeScript migration:
 *   - Goal type: `Goal { id: string; title: string; status: 'active' | 'completed'; ... }`
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock persist BEFORE importing the store ───────────────────────────────
vi.mock('zustand/middleware', () => ({
    persist: (fn) => fn,
    devtools: (fn) => fn,
}));

const { useGoalsStore } = await import('../store/useGoalsStore.js');

describe('useGoalsStore', () => {
    beforeEach(() => {
        useGoalsStore.setState({ goals: [] });
    });

    it('goals starts as an empty array', () => {
        expect(useGoalsStore.getState().goals).toEqual([]);
    });

    it('setGoals([...]) sets goals directly', () => {
        const newGoals = [{ id: '1', title: 'Stay sober for 30 days', status: 'active' }];
        useGoalsStore.getState().setGoals(newGoals);
        expect(useGoalsStore.getState().goals).toEqual(newGoals);
    });

    it('setGoals(prev => [...prev, ...]) appends a goal via callback', () => {
        const existingGoal = { id: '1', title: 'First goal', status: 'active' };
        useGoalsStore.setState({ goals: [existingGoal] });

        const newGoal = { id: '2', title: 'Second goal', status: 'active' };
        useGoalsStore.getState().setGoals(prev => [...prev, newGoal]);

        expect(useGoalsStore.getState().goals).toHaveLength(2);
        expect(useGoalsStore.getState().goals[1].id).toBe('2');
    });

    it('setGoals can mark a goal as completed via callback', () => {
        useGoalsStore.setState({
            goals: [{ id: '1', title: 'Goal', status: 'active' }],
        });

        useGoalsStore.getState().setGoals(prev =>
            prev.map(g => g.id === '1' ? { ...g, status: 'completed' } : g)
        );

        expect(useGoalsStore.getState().goals[0].status).toBe('completed');
    });
});

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const migrateLegacyArray = (key, stateKey) => {
    if (typeof window !== 'undefined') {
        const legacy = window.localStorage.getItem(key);
        if (legacy && !legacy.startsWith('{"state":')) {
            try {
                const parsed = JSON.parse(legacy);
                const wrapped = { state: { [stateKey]: parsed }, version: 0 };
                window.localStorage.setItem(key, JSON.stringify(wrapped));
            } catch (e) { }
        }
    }
};

migrateLegacyArray('mv2_goals', 'goals');

export const useGoalsStore = create(
    persist(
        (set) => ({
            goals: [],
            setGoals: (goalsOrUpdater) => set((state) => ({
                goals: typeof goalsOrUpdater === 'function'
                    ? goalsOrUpdater(state.goals)
                    : goalsOrUpdater
            })),
        }),
        {
            name: 'mv2_goals'
        }
    )
);

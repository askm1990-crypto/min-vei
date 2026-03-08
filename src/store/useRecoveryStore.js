import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const migrateLegacyScore = () => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('mv2_recovery_store')) {
        const getLegacy = (key, defaultVal) => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultVal;
            } catch {
                return defaultVal;
            }
        };

        const legacyState = {
            score: getLegacy('mv2_score', 0),
            history: getLegacy('mv2_score_history', [])
        };

        const wrapped = { state: legacyState, version: 0 };
        window.localStorage.setItem('mv2_recovery_store', JSON.stringify(wrapped));
    }
};

migrateLegacyScore();

export const useRecoveryStore = create(
    persist(
        (set) => ({
            score: 0,
            setScore: (scoreOrUpdater) => set((state) => {
                const currentScore = typeof state.score === 'number' ? state.score : 0;
                return {
                    score: typeof scoreOrUpdater === 'function' ? scoreOrUpdater(currentScore) : scoreOrUpdater
                };
            }),
            history: [],
            setHistory: (historyOrUpdater) => set((state) => {
                const currentHistory = Array.isArray(state.history) ? state.history : [];
                return {
                    history: typeof historyOrUpdater === 'function' ? historyOrUpdater(currentHistory) : historyOrUpdater
                };
            }),
        }),
        {
            name: 'mv2_recovery_store'
        }
    )
);

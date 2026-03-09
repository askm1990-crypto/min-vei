import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface ScoreHistoryEntry {
    id: string;
    amount: number;
    reason: string;
    date: string;
}

interface RecoveryState {
    // State
    score: number;
    history: ScoreHistoryEntry[];
    lastSoberMilestone: number;
    lastLoggingMilestone: number;
    // Actions
    setScore: (scoreOrUpdater: number | ((prev: number) => number)) => void;
    setHistory: (historyOrUpdater: ScoreHistoryEntry[] | ((prev: ScoreHistoryEntry[]) => ScoreHistoryEntry[])) => void;
    setLastSoberMilestone: (val: number) => void;
    setLastLoggingMilestone: (val: number) => void;
}

// ----------------------------------------------------------------
// Legacy migration (runs once on import)
// ----------------------------------------------------------------

const migrateLegacyScore = (): void => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('mv2_recovery_store')) {
        const getLegacy = <T>(key: string, defaultVal: T): T => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? (JSON.parse(item) as T) : defaultVal;
            } catch {
                return defaultVal;
            }
        };

        const legacyState = {
            score: getLegacy<number>('mv2_score', 0),
            history: getLegacy<ScoreHistoryEntry[]>('mv2_score_history', [])
        };

        const wrapped = { state: legacyState, version: 0 };
        window.localStorage.setItem('mv2_recovery_store', JSON.stringify(wrapped));
    }
};

migrateLegacyScore();

// ----------------------------------------------------------------
// Store
// ----------------------------------------------------------------

export const useRecoveryStore = create<RecoveryState>()(
    persist(
        (set) => ({
            score: 0,
            setScore: (scoreOrUpdater) => set((state) => {
                const currentScore = (typeof state.score === 'number' && !Number.isNaN(state.score)) ? state.score : 0;
                const newScore = typeof scoreOrUpdater === 'function' ? scoreOrUpdater(currentScore) : scoreOrUpdater;
                return {
                    score: (!Number.isNaN(newScore)) ? newScore : 0
                };
            }),
            history: [],
            setHistory: (historyOrUpdater) => set((state) => {
                const currentHistory = Array.isArray(state.history) ? state.history : [];
                return {
                    history: typeof historyOrUpdater === 'function' ? historyOrUpdater(currentHistory) : historyOrUpdater
                };
            }),
            lastSoberMilestone: 0,
            setLastSoberMilestone: (val) => set({ lastSoberMilestone: val }),
            lastLoggingMilestone: 0,
            setLastLoggingMilestone: (val) => set({ lastLoggingMilestone: val }),
        }),
        {
            name: 'mv2_recovery_store'
        }
    )
);

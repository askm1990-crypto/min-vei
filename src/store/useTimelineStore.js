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
            } catch { /* ignore parse errors */ }
        }
    }
};

migrateLegacyArray('mv2_timeline', 'entries');

export const useTimelineStore = create(
    persist(
        (set) => ({
            entries: [],
            setEntries: (entriesOrUpdater) => set((state) => ({
                entries: typeof entriesOrUpdater === 'function'
                    ? entriesOrUpdater(state.entries)
                    : entriesOrUpdater
            })),
        }),
        {
            name: 'mv2_timeline'
        }
    )
);

import { useLocalStorage } from './useLocalStorage';

export function useJournal() {
    const [entries, setEntries] = useLocalStorage('mv2_journal', []);

    /**
     * Get all entries, sorted newest first
     */
    const getEntries = () => {
        return [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    /**
     * Add a new journal entry
     */
    const addEntry = (entryData) => {
        const newEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...entryData
        };
        setEntries(prev => [newEntry, ...prev]);
        return newEntry;
    };

    /**
     * Update an existing entry
     */
    const updateEntry = (id, updates) => {
        setEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
        ));
    };

    /**
     * Delete an entry
     */
    const deleteEntry = (id) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    };

    /**
     * Get mood trend for last N days (for Dashboard / Progress)
     */
    const getMoodTrend = (days = 14) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        return getEntries()
            .filter(e => new Date(e.date) >= cutoff && e.mood)
            .map(e => ({
                date: e.date,
                mood: e.mood
            }));
    };

    /**
     * Get streak: consecutive days with journal entries
     */
    const getStreak = () => {
        const sorted = getEntries();
        if (sorted.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sorted.length; i++) {
            const entryDate = new Date(sorted[i].date);
            entryDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - streak);

            if (entryDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else if (streak === 0) {
                // Allow yesterday as start of streak
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                if (entryDate.getTime() === yesterday.getTime()) {
                    streak++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        return streak;
    };

    return {
        entries: getEntries(),
        addEntry,
        updateEntry,
        deleteEntry,
        getMoodTrend,
        getStreak
    };
}

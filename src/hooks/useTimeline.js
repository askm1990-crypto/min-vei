import { useLocalStorage } from './useLocalStorage';

export function useTimeline() {
    // Single source of truth for all entries
    const [entries, setEntries] = useLocalStorage('mv2_timeline', []);

    // ── CRUD OPERATIONS ──────────────────────────────────────────────

    const addEntry = (entryData) => {
        const newEntry = {
            id: Date.now().toString(),
            date: entryData.date || new Date().toISOString(),
            ...entryData
        };

        setEntries(prev => [newEntry, ...prev]);
        return newEntry.id;
    };

    const updateEntry = (id, updates) => {
        setEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
        ));
    };

    const deleteEntry = (id) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const getEntry = (id) => {
        return entries.find(e => e.id === id);
    };

    // ── GETTERS FOR SPECIFIC SUBSETS ─────────────────────────────────

    // All events (craving or use incidents)
    const getEvents = () => entries.filter(e => e.intensity !== undefined && e.intensity !== null);

    // Only journal entries (no specific event associated)
    const getJournalEntries = () => entries.filter(e => e.intensity === undefined || e.intensity === null || e.intensity === 0);

    // Pending events (user didn't give an outcome yet)
    const getPendingEvents = () => getEvents().filter(e => e.outcome === 'ongoing');

    // ── STATISTICS AND TRENDS (Maintains compatibility with AI) ──────

    // Calculates current streak of consecutive days logging a journal/reflection
    const getStreak = () => {
        if (entries.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Group valid journal entries by date string
        const entriesByDate = {};
        entries.forEach(e => {
            // Count any entry with mood or text as a potential streak-keeper
            if (e.mood || (e.body && e.body.trim().length > 0)) {
                const date = new Date(e.date);
                entriesByDate[date.toISOString().split('T')[0]] = true;
            }
        });

        // Check if today is logged
        const todayStr = currentDate.toISOString().split('T')[0];
        if (!entriesByDate[todayStr]) {
            // Check yesterday
            currentDate.setDate(currentDate.getDate() - 1);
            const yesterdayStr = currentDate.toISOString().split('T')[0];
            if (!entriesByDate[yesterdayStr]) {
                return 0; // Streak broken
            }
        }

        // Count backwards
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (entriesByDate[dateStr]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                // If today is missing but yesterday exists, the first check handles it, 
                // but we must stop once we hit a missing day going backwards
                const todayBackup = new Date();
                todayBackup.setHours(0, 0, 0, 0);
                if (dateStr === todayBackup.toISOString().split('T')[0]) {
                    // It's today, we can skip and check yesterday
                    currentDate.setDate(currentDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        return streak;
    };

    const getMoodTrend = (days = 7) => {
        const trend = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Group entries by date
        const grouped = {};
        entries.forEach(e => {
            if (e.mood) {
                const dateStr = new Date(e.date).toISOString().split('T')[0];
                if (!grouped[dateStr]) grouped[dateStr] = [];
                grouped[dateStr].push(e.mood);
            }
        });

        // Calculate avg per day for the last N days
        for (let i = 0; i < days; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            if (grouped[dateStr]) {
                const avg = grouped[dateStr].reduce((a, b) => a + b, 0) / grouped[dateStr].length;
                trend.push({ date: d.toISOString(), mood: Math.round(avg) });
            }
        }

        return trend; // Returns newest first natively
    };

    const getRecentEventTrend = (days = 7) => {
        const _events = getEvents();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const recent = _events.filter(e => new Date(e.date) >= cutoff);

        return {
            resisted: recent.filter(e => e.outcome === 'resisted').length,
            used: recent.filter(e => e.outcome === 'used').length,
            total: recent.length
        };
    };

    const getMostCommonTrigger = () => {
        const _events = getEvents();
        if (_events.length === 0) return null;

        const counts = {};
        _events.forEach(ev => {
            if (ev.triggers && Array.isArray(ev.triggers)) {
                ev.triggers.forEach(t => {
                    counts[t] = (counts[t] || 0) + 1;
                });
            }
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : null;
    };

    return {
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        // Legacy support methods
        getEvents,
        getJournalEntries,
        getPendingEvents,
        getStreak,
        getMoodTrend,
        getRecentEventTrend,
        getMostCommonTrigger
    };
}

import { useLocalStorage } from './useLocalStorage';

export function useEvents() {
    const [events, setEvents] = useLocalStorage('mv2_events', []);

    /**
     * Get all events, sorted newest first
     */
    const getEvents = () => {
        return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    /**
     * Add a new event
     */
    const addEvent = (eventData) => {
        const newEvent = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...eventData
        };
        setEvents(prev => [newEvent, ...prev]);
        return newEvent;
    };

    /**
     * Update an existing event (e.g., resolving a pending event)
     */
    const updateEvent = (id, updates) => {
        setEvents(prev => prev.map(ev =>
            ev.id === id ? { ...ev, ...updates } : ev
        ));
    };

    /**
     * Delete an event
     */
    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(ev => ev.id !== id));
    };

    /**
     * Get pending events (events where outcome is 'ongoing')
     */
    const getPendingEvents = () => {
        return events.filter(ev => ev.outcome === 'ongoing');
    };

    /**
     * Get the most common trigger (for Dashboard)
     * Robust: Requires >= 5 events and a clear outlier (top vs second)
     */
    const getMostCommonTrigger = () => {
        if (!events || events.length < 5) return null;

        const triggerCounts = {};
        events.forEach(ev => {
            if (ev.triggers && Array.isArray(ev.triggers)) {
                ev.triggers.forEach(t => {
                    triggerCounts[t] = (triggerCounts[t] || 0) + 1;
                });
            }
        });

        const sorted = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return null;

        const [top, topCount] = sorted[0];
        const nextCount = sorted[1]?.[1] || 0;

        // Must have at least 3 occurrences AND be 2 more than the runner up
        if (topCount >= 3 && (topCount - nextCount >= 2)) {
            return top;
        }

        return null;
    };

    /**
     * Get recent trend stats (last 7 days)
     */
    const getRecentTrend = () => {
        const _events = getEvents();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recent = _events.filter(ev => new Date(ev.date) >= sevenDaysAgo);

        const total = recent.length;
        const resisted = recent.filter(ev => ev.outcome === 'resisted').length;
        const used = recent.filter(ev => ev.outcome === 'used').length;

        return { total, resisted, used };
    };

    return {
        events: getEvents(),
        addEvent,
        updateEvent,
        deleteEvent,
        getPendingEvents,
        getMostCommonTrigger,
        getRecentTrend
    };
}

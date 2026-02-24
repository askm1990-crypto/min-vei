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
     */
    const getMostCommonTrigger = () => {
        if (!events || events.length === 0) return null;

        const triggerCounts = {};
        events.forEach(ev => {
            if (ev.triggers && Array.isArray(ev.triggers)) {
                ev.triggers.forEach(t => {
                    triggerCounts[t] = (triggerCounts[t] || 0) + 1;
                });
            }
        });

        if (Object.keys(triggerCounts).length === 0) return null;

        return Object.keys(triggerCounts).reduce((a, b) => triggerCounts[a] > triggerCounts[b] ? a : b);
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

import { useMemo } from 'react';

/**
 * Activity Heatmap Calendar Component
 * GitHub-style activity visualization showing daily engagement over the last 12 weeks.
 */
export default function ActivityCalendar({ events = [], journalEntries = [], goals = [] }) {
    const { weeks, maxActivity } = useMemo(() => {
        // Build a map of date -> activity count for the last 12 weeks (84 days)
        const activityMap = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Count activities per day
        const countDate = (dateStr) => {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            const key = d.toISOString().split('T')[0];
            activityMap[key] = (activityMap[key] || 0) + 1;
        };

        events.forEach(ev => countDate(ev.date));
        journalEntries.forEach(e => countDate(e.date));
        goals.forEach(g => {
            if (g.completedAt) countDate(g.completedAt);
        });

        // Build weeks grid (12 weeks, 7 days each)
        const weeks = [];
        let maxActivity = 0;

        for (let w = 11; w >= 0; w--) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                date.setDate(today.getDate() - (w * 7 + (6 - d)));
                const key = date.toISOString().split('T')[0];
                const count = activityMap[key] || 0;
                if (count > maxActivity) maxActivity = count;
                week.push({ date: key, count, dayOfWeek: date.getDay() });
            }
            weeks.push(week);
        }

        return { weeks, maxActivity };
    }, [events, journalEntries, goals]);

    const getColor = (count) => {
        if (count === 0) return 'var(--heatmap-empty, rgba(128,128,128,0.1))';
        const intensity = Math.min(count / Math.max(maxActivity, 1), 1);
        if (intensity <= 0.25) return 'var(--heatmap-low, hsl(160, 60%, 80%))';
        if (intensity <= 0.5) return 'var(--heatmap-mid, hsl(160, 60%, 60%))';
        if (intensity <= 0.75) return 'var(--heatmap-high, hsl(160, 60%, 45%))';
        return 'var(--heatmap-max, hsl(160, 60%, 30%))';
    };

    const dayLabels = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];

    return (
        <div className="heatmap-container">
            <div className="heatmap-labels">
                {dayLabels.map((label, i) => (
                    <span key={i} className="heatmap-day-label">{label}</span>
                ))}
            </div>
            <div className="heatmap-grid">
                {weeks.map((week, wi) => (
                    <div key={wi} className="heatmap-week">
                        {week.map((day, di) => (
                            <div
                                key={di}
                                className="heatmap-cell"
                                style={{ backgroundColor: getColor(day.count) }}
                                title={`${day.date}: ${day.count} aktiviteter`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="heatmap-legend">
                <span className="heatmap-legend-label">Mindre</span>
                <div className="heatmap-cell" style={{ backgroundColor: getColor(0) }} />
                <div className="heatmap-cell" style={{ backgroundColor: getColor(1) }} />
                <div className="heatmap-cell" style={{ backgroundColor: getColor(Math.ceil(maxActivity * 0.5)) }} />
                <div className="heatmap-cell" style={{ backgroundColor: getColor(Math.ceil(maxActivity * 0.75)) }} />
                <div className="heatmap-cell" style={{ backgroundColor: getColor(maxActivity) }} />
                <span className="heatmap-legend-label">Mer</span>
            </div>
        </div>
    );
}

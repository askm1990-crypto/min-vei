import { useMemo } from 'react';
import './WeeklyActivity.css';

/**
 * Weekly Activity Component
 * A simpler, Duolingo-style habit tracker showing activity for the last 7 days.
 */
export default function WeeklyActivity({ events = [], journalEntries = [], goals = [] }) {

    // Parse the last 7 days and check for activity
    const { daysData, activeDaysCount } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Build a Set of all dates where the user was active
        const activeDates = new Set();
        const addDate = (dateStr) => {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            activeDates.add(d.toISOString().split('T')[0]);
        };

        events.forEach(ev => addDate(ev.date));
        journalEntries.forEach(e => addDate(e.date));
        goals.forEach(g => {
            if (g.completedAt) addDate(g.completedAt);
        });

        // Generate the array for the last 7 days (including today)
        const daysLabelShort = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];
        const days = [];
        let count = 0;

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const isActive = activeDates.has(dateKey);

            if (isActive) count++;

            days.push({
                key: dateKey,
                label: i === 0 ? 'I dag' : daysLabelShort[d.getDay()],
                isActive: isActive,
                isToday: i === 0
            });
        }

        return { daysData: days, activeDaysCount: count };

    }, [events, journalEntries, goals]);

    return (
        <div className="weekly-activity-container">
            <div className="weekly-activity-circles">
                {daysData.map(day => (
                    <div key={day.key} className="weekly-day">
                        <div className={`weekly-circle ${day.isActive ? 'active' : 'inactive'} ${day.isToday && !day.isActive ? 'today-pulse' : ''}`}>
                            {day.isActive ? '⭐' : ''}
                        </div>
                        <span className={`weekly-label ${day.isToday ? 'today-label' : ''}`}>
                            {day.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="weekly-activity-summary">
                {activeDaysCount === 0 ? (
                    <p>Logg en hendelse eller skriv i dagboken for å tenne din første stjerne!</p>
                ) : activeDaysCount === 7 ? (
                    <p>🔥 Fantastisk! Du har vært aktiv hver eneste dag den siste uken!</p>
                ) : (
                    <p>Du har vært aktiv <strong>{activeDaysCount} av de 7 siste dagene</strong>. Bra jobba!</p>
                )}
            </div>
        </div>
    );
}

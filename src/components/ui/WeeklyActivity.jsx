import { useMemo } from 'react';
import './WeeklyActivity.css';

/**
 * Weekly Activity Component
 * A simpler, Duolingo-style habit tracker showing activity for the last 7 days.
 */
export default function WeeklyActivity({ events = [], journalEntries = [], goals = [] }) {

    // Parse the last 7 days and check for activity
    const { daysData, activeDaysCount } = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const dayOfWeek = today.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(today);
        monday.setDate(today.getDate() - diffToMonday);

        const activeDates = new Set();
        const addDate = (dateStr) => {
            if (!dateStr) return;
            const d = new Date(dateStr);
            activeDates.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split('T')[0]);
        };

        events.forEach(ev => addDate(ev.date));
        journalEntries.forEach(e => addDate(e.date));
        goals.forEach(g => {
            if (g.completedAt) addDate(g.completedAt);
        });

        const daysLabelShort = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];
        const days = [];
        let count = 0;

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateKey = d.toISOString().split('T')[0];
            const isActive = activeDates.has(dateKey);
            const isToday = d.getTime() === today.getTime();

            if (isActive) count++;

            days.push({
                key: dateKey,
                label: daysLabelShort[i],
                isActive: isActive,
                isToday: isToday
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

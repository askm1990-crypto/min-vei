import { useState, useMemo } from 'react';
import './ActivityHistory.css';

/**
 * Activity History Component
 * A browsable monthly calendar showing activity history.
 */
export default function ActivityHistory({ events = [], journalEntries = [], goals = [] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { days, monthLabel } = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // Month label in Norwegian
        const monthLabel = new Intl.DateTimeFormat('nb-NO', { month: 'long', year: 'numeric' }).format(currentMonth);

        // First day of month
        const firstDay = new Date(year, month, 1);
        // dayOfWeek: 0 is Sunday, ..., 6 is Saturday.
        // We want Monday (1) to be first.
        let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // Days array
        const days = [];

        // Padding for previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startOffset - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        // Days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Padding for next month to reach 42 cells (6 rows)
        const totalCells = 42;
        const nextMonthPadding = totalCells - days.length;
        for (let i = 1; i <= nextMonthPadding; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        // Activity Map
        const activeDates = new Set();
        const relapseDates = new Set();

        const addActivity = (dateStr) => {
            if (!dateStr) return;
            const d = new Date(dateStr);
            activeDates.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split('T')[0]);
        };

        const addRelapse = (dateStr) => {
            if (!dateStr) return;
            const d = new Date(dateStr);
            relapseDates.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split('T')[0]);
        };

        events.forEach(ev => {
            addActivity(ev.date);
            if (ev.outcome === 'used') addRelapse(ev.date);
        });
        journalEntries.forEach(e => addActivity(e.date));
        goals.forEach(g => {
            if (g.completedAt) addActivity(g.completedAt);
        });

        // Map activities to days
        const daysWithStatus = days.map(d => {
            const key = d.date.toISOString().split('T')[0];
            return {
                ...d,
                hasActivity: activeDates.has(key),
                hasRelapse: relapseDates.has(key),
                isToday: new Date().toISOString().split('T')[0] === key
            };
        });

        return { days: daysWithStatus, monthLabel };
    }, [currentMonth, events, journalEntries, goals]);

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    return (
        <div className="activity-history">
            <div className="calendar-header">
                <button className="cal-nav-btn" onClick={prevMonth}>←</button>
                <h3 className="month-title">{monthLabel}</h3>
                <button className="cal-nav-btn" onClick={nextMonth}>→</button>
            </div>

            <div className="calendar-grid">
                {['M', 'T', 'O', 'T', 'F', 'L', 'S'].map(d => (
                    <div key={d} className="calendar-day-label">{d}</div>
                ))}

                {days.map((d, i) => (
                    <div
                        key={i}
                        className={`calendar-cell ${d.isCurrentMonth ? '' : 'other-month'} ${d.isToday ? 'today' : ''}`}
                    >
                        <span className="day-num">{d.day}</span>
                        <div className="day-indicators">
                            {d.hasRelapse && <span className="relapse-indicator">🔴</span>}
                            {d.hasActivity && !d.hasRelapse && <span className="activity-indicator">⭐</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="calendar-legend">
                <div className="legend-item"><span className="activity-indicator">⭐</span> Aktivitet</div>
                <div className="legend-item"><span className="relapse-indicator">🔴</span> Tilbakefall</div>
            </div>
        </div>
    );
}

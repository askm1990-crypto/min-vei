import { useMemo } from 'react';

/**
 * Mood Graph - A visual bar chart of mood over time.
 */
export default function MoodGraph({ moodData = [] }) {
    const MOOD_EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁' };
    const MOOD_COLORS = {
        1: 'var(--mood-1)',
        2: 'var(--mood-2)',
        3: 'var(--mood-3)',
        4: 'var(--mood-4)',
        5: 'var(--mood-5)'
    };

    const reversedData = useMemo(() =>
        [...moodData].reverse().slice(-14),
        [moodData]);

    if (reversedData.length === 0) return null;

    return (
        <div className="mood-graph">
            <div className="mood-graph-bars">
                {reversedData.map((entry, i) => {
                    const d = new Date(entry.date);
                    const dayLabel = d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
                    const height = (entry.mood / 5) * 100;

                    return (
                        <div key={i} className="mood-graph-col">
                            <span className="mood-graph-emoji">{MOOD_EMOJIS[entry.mood]}</span>
                            <div className="mood-graph-bar-bg">
                                <div
                                    className="mood-graph-bar-fill"
                                    style={{
                                        height: `${height}%`,
                                        backgroundColor: MOOD_COLORS[entry.mood],
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                />
                            </div>
                            <span className="mood-graph-date">{dayLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

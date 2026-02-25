import { useMemo } from 'react';

/**
 * Local AI Insights Engine
 * Analyzes user data to find patterns and generate actionable insights.
 * Everything runs locally — no network calls, no external APIs.
 */
export function useInsights({ events = [], journalEntries = [], goals = [], user = null, daysSober = 0 }) {
    const insights = useMemo(() => {
        const result = [];

        // ── 1. TIME PATTERN ANALYSIS ────────────────────────────────
        if (events.length >= 3) {
            const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
            const dayCounts = new Array(7).fill(0);
            const hourCounts = new Array(24).fill(0);

            events.forEach(ev => {
                const d = new Date(ev.date);
                dayCounts[d.getDay()]++;
                hourCounts[d.getHours()]++;
            });

            // Find peak day
            const peakDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
            const peakDay = dayNames[peakDayIndex];
            const peakDayCount = dayCounts[peakDayIndex];

            if (peakDayCount >= 2) {
                result.push({
                    id: 'time-pattern-day',
                    type: 'pattern',
                    icon: '📅',
                    priority: 8,
                    title: `${peakDay}er er din mest aktive dag`,
                    description: `Du har logget ${peakDayCount} hendelser på ${peakDay.toLowerCase()}er. Planlegg ekstra mestringsstrategier for denne dagen.`,
                    color: 'var(--info)'
                });
            }

            // Find peak hour range
            const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
            const peakHourCount = hourCounts[peakHour];
            if (peakHourCount >= 2) {
                const timeLabel = peakHour < 12 ? `${peakHour}:00 om morgenen` : peakHour < 18 ? `${peakHour}:00 på ettermiddagen` : `${peakHour}:00 om kvelden`;
                result.push({
                    id: 'time-pattern-hour',
                    type: 'pattern',
                    icon: '⏰',
                    priority: 7,
                    title: `Suget er sterkest rundt kl. ${peakHour}:00`,
                    description: `${peakHourCount} av dine hendelser skjedde rundt ${timeLabel}. Ha en mestringsstrategi klar til da!`,
                    color: 'var(--warning)'
                });
            }
        }

        // ── 2. TRIGGER ANALYSIS ────────────────────────────────────
        if (events.length >= 2) {
            const triggerMap = {};
            events.forEach(ev => {
                const triggers = ev.triggers || [];
                triggers.forEach(t => {
                    if (!triggerMap[t]) triggerMap[t] = { total: 0, resisted: 0 };
                    triggerMap[t].total++;
                    if (ev.outcome === 'resisted') triggerMap[t].resisted++;
                });
            });

            const sortedTriggers = Object.entries(triggerMap).sort((a, b) => b[1].total - a[1].total);

            if (sortedTriggers.length > 0) {
                const [topTrigger, topData] = sortedTriggers[0];
                const resistRate = topData.total > 0 ? Math.round((topData.resisted / topData.total) * 100) : 0;

                result.push({
                    id: 'top-trigger',
                    type: 'trigger',
                    icon: '⚡',
                    priority: 9,
                    title: `"${topTrigger}" er din vanligste trigger`,
                    description: `Oppstått ${topData.total} ganger. Du har mestret ${resistRate}% av dem. ${resistRate >= 70 ? 'Strålende! 💪' : 'Fokuser på strategier for dette.'}`,
                    color: resistRate >= 70 ? 'var(--success)' : 'var(--danger)'
                });
            }

            // Find "best mastered" trigger
            const mastered = sortedTriggers.find(([, data]) => data.total >= 2 && (data.resisted / data.total) >= 0.8);
            if (mastered) {
                result.push({
                    id: 'mastered-trigger',
                    type: 'achievement',
                    icon: '🏆',
                    priority: 6,
                    title: `Du mestrer "${mastered[0]}" godt!`,
                    description: `Du har motstått ${Math.round((mastered[1].resisted / mastered[1].total) * 100)}% av gangene. Fortsett slik!`,
                    color: 'var(--success)'
                });
            }
        }

        // ── 3. MOOD TREND ANALYSIS ─────────────────────────────────
        if (journalEntries.length >= 3) {
            const entriesWithMood = journalEntries.filter(e => e.mood).slice(0, 14);

            if (entriesWithMood.length >= 3) {
                const recentAvg = entriesWithMood.slice(0, Math.ceil(entriesWithMood.length / 2))
                    .reduce((sum, e) => sum + e.mood, 0) / Math.ceil(entriesWithMood.length / 2);
                const olderAvg = entriesWithMood.slice(Math.ceil(entriesWithMood.length / 2))
                    .reduce((sum, e) => sum + e.mood, 0) / (entriesWithMood.length - Math.ceil(entriesWithMood.length / 2));

                const diff = recentAvg - olderAvg;

                if (diff > 0.5) {
                    result.push({
                        id: 'mood-up',
                        type: 'trend',
                        icon: '📈',
                        priority: 7,
                        title: 'Humøret ditt er på vei opp!',
                        description: `Gjennomsnittlig humør har økt fra ${olderAvg.toFixed(1)} til ${recentAvg.toFixed(1)}. Det du gjør fungerer! 🌟`,
                        color: 'var(--success)'
                    });
                } else if (diff < -0.5) {
                    result.push({
                        id: 'mood-down',
                        type: 'warning',
                        icon: '📉',
                        priority: 10,
                        title: 'Vi ser et lite dipp i humøret',
                        description: `Gjennomsnittlig humør har gått ned fra ${olderAvg.toFixed(1)} til ${recentAvg.toFixed(1)}. Det er helt normalt med oppturer og nedturer. Husk pusteøvelsene! 🧘`,
                        color: 'var(--warning)'
                    });
                }
            }
        }

        // ── 4. MASTERY RATE ────────────────────────────────────────
        if (events.length >= 3) {
            const resisted = events.filter(ev => ev.outcome === 'resisted').length;
            const used = events.filter(ev => ev.outcome === 'used').length;
            const total = resisted + used;

            if (total >= 3) {
                const rate = Math.round((resisted / total) * 100);

                result.push({
                    id: 'mastery-rate',
                    type: 'stat',
                    icon: rate >= 70 ? '💪' : '🎯',
                    priority: 5,
                    title: `${rate}% mestringsgrad`,
                    description: `Du har motstått ${resisted} av ${total} situasjoner. ${rate >= 80 ? 'Fantastisk kontroll!' : rate >= 50 ? 'Bra innsats, det går rette veien!' : 'Husk: hver gang du prøver teller.'}`,
                    color: rate >= 70 ? 'var(--success)' : rate >= 40 ? 'var(--warning)' : 'var(--danger)'
                });
            }
        }

        // ── 5. SOBER MILESTONE ─────────────────────────────────────
        if (daysSober > 0) {
            const milestones = [7, 14, 30, 60, 90, 180, 365];
            const nextMilestone = milestones.find(m => m > daysSober);
            const daysToNext = nextMilestone ? nextMilestone - daysSober : null;

            if (daysToNext !== null && daysToNext <= 5) {
                result.push({
                    id: 'milestone-close',
                    type: 'motivation',
                    icon: '🔥',
                    priority: 9,
                    title: `${daysToNext} dager til ${nextMilestone}-dagersmerket!`,
                    description: `Du er så nære en ny milepæl. Hold ut — du klarer dette! 💪`,
                    color: 'var(--secondary)'
                });
            }

            // Celebrate passed milestones
            const passedMilestone = milestones.filter(m => daysSober >= m).pop();
            if (passedMilestone) {
                result.push({
                    id: 'milestone-passed',
                    type: 'achievement',
                    icon: '🏅',
                    priority: 4,
                    title: `${passedMilestone} dager rusfri!`,
                    description: `Du har passert ${passedMilestone}-dagersmerket. Hver dag er en seier. 🎉`,
                    color: 'var(--success)'
                });
            }
        }

        // ── 6. JOURNAL CONSISTENCY ─────────────────────────────────
        if (journalEntries.length > 0) {
            const last7Days = new Set();
            const now = new Date();
            journalEntries.forEach(e => {
                const d = new Date(e.date);
                const daysAgo = Math.floor((now - d) / (1000 * 60 * 60 * 24));
                if (daysAgo < 7) last7Days.add(d.toISOString().split('T')[0]);
            });

            if (last7Days.size >= 5) {
                result.push({
                    id: 'journal-streak',
                    type: 'achievement',
                    icon: '📝',
                    priority: 5,
                    title: 'Stabil skrivevane!',
                    description: `Du har skrevet dagbok ${last7Days.size} av de siste 7 dagene. Konsistens er nøkkelen til endring.`,
                    color: 'var(--primary)'
                });
            } else if (last7Days.size === 0 && journalEntries.length > 2) {
                result.push({
                    id: 'journal-nudge',
                    type: 'nudge',
                    icon: '✍️',
                    priority: 6,
                    title: 'Vi savner deg i dagboken!',
                    description: 'Du har ikke skrevet på en stund. Bare noen få ord kan gjøre en forskjell.',
                    color: 'var(--text-muted)'
                });
            }
        }

        // ── 7. SMART SUGGESTION ────────────────────────────────────
        if (events.length >= 2) {
            // Find the strategy that worked best
            const strategyMap = {};
            events.forEach(ev => {
                if (ev.strategy && ev.outcome === 'resisted') {
                    strategyMap[ev.strategy] = (strategyMap[ev.strategy] || 0) + 1;
                }
            });

            const bestStrategy = Object.entries(strategyMap).sort((a, b) => b[1] - a[1])[0];
            if (bestStrategy) {
                result.push({
                    id: 'smart-suggestion',
                    type: 'suggestion',
                    icon: '💡',
                    priority: 8,
                    title: `"${bestStrategy[0]}" fungerer for deg`,
                    description: `Denne strategien hjalp deg ${bestStrategy[1]} ${bestStrategy[1] === 1 ? 'gang' : 'ganger'}. Bruk den neste gang suget melder seg!`,
                    color: 'var(--accent)'
                });
            }
        }

        // ── 8. GOAL PROGRESS ───────────────────────────────────────
        const activeGoals = goals.filter(g => g.status === 'active');
        const completedGoals = goals.filter(g => g.status === 'completed');

        if (completedGoals.length > 0 && activeGoals.length === 0) {
            result.push({
                id: 'goals-done',
                type: 'nudge',
                icon: '🎯',
                priority: 5,
                title: 'Alle mål er fullført!',
                description: 'Tid for nye utfordringer? Sett et nytt mål for å holde motivasjonen oppe.',
                color: 'var(--primary)'
            });
        }

        // Sort by priority (highest first) and return top 4
        return result
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 4);

    }, [events, journalEntries, goals, user, daysSober]);

    return { insights };
}

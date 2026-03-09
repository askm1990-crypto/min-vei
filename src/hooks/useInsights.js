import { useMemo } from 'react';

/**
 * Local AI Insights Engine
 * Analyzes user data to find patterns and generate actionable insights.
 * Everything runs locally — no network calls, no external APIs.
 */
export function useInsights({ events = [], journalEntries = [], goals = [], daysSober = 0 }) {
    const insights = useMemo(() => {
        const result = [];

        // ── 0. EARLY STAGE / LEARNING PHASE ───────────────────────
        if (events.length < 5) {
            result.push({
                id: 'learning-phase',
                type: 'info',
                icon: '💡',
                priority: 10,
                title: 'Vi ser etter mønstre',
                description: 'Du har logget dine første hendelser. Vi ser etter sammenhenger og vil gi deg dypere innsikt når du når 5 logger.',
                color: 'var(--primary)'
            });

            if (events.length > 0) {
                result.push({
                    id: 'keep-logging',
                    type: 'info',
                    icon: '📝',
                    priority: 9,
                    title: 'Fortsett den gode vanen',
                    description: 'Hver logg hjelper oss å forstå dine triggere bedre. Ved 5 hendelser kan vi begynne å se de første trendene.',
                    color: 'var(--info)'
                });
            }
        }

        // ── 1. TIME PATTERN ANALYSIS ────────────────────────────────
        if (events.length >= 5) {
            const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
            const dayCounts = new Array(7).fill(0);
            const hourCounts = new Array(24).fill(0);

            events.forEach(ev => {
                const d = new Date(ev.date);
                dayCounts[d.getDay()]++;
                hourCounts[d.getHours()]++;
            });

            // Find peak day with distinctness check (at least 3 occurrences AND > 40% of total)
            const peakDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
            const peakDayCount = dayCounts[peakDayIndex];
            const peakDayRatio = peakDayCount / events.length;

            if (peakDayCount >= 3 && peakDayRatio >= 0.4) {
                result.push({
                    id: 'time-pattern-day',
                    type: 'pattern',
                    icon: '📅',
                    priority: 8,
                    title: `${dayNames[peakDayIndex]}er skiller seg ut`,
                    description: `Du har logget ${peakDayCount} hendelser på denne dagen. Vær ekstra oppmerksom på dine rutiner da.`,
                    color: 'var(--info)'
                });
            }

            // Find peak hour range (at least 3 occurrences)
            const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
            const peakHourCount = hourCounts[peakHour];
            if (peakHourCount >= 3) {

                result.push({
                    id: 'time-pattern-hour',
                    type: 'pattern',
                    icon: '⏰',
                    priority: 7,
                    title: `Mønster rundt kl. ${peakHour}:00`,
                    description: `${peakHourCount} av dine hendelser har skjedd rundt dette tidspunktet. Ha en plan klar!`,
                    color: 'var(--warning)'
                });
            }
        }

        // ── 2. TRIGGER ANALYSIS ────────────────────────────────────
        if (events.length >= 5) {
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
                const secondTriggerData = sortedTriggers[1]?.[1] || { total: 0 };

                // Statistical Distinctness: Must have at least 2 more than the second trigger
                // OR be the ONLY trigger reported significantly
                if (topData.total >= 3 && (topData.total - secondTriggerData.total >= 2 || sortedTriggers.length === 1)) {
                    const resistRate = Math.round((topData.resisted / topData.total) * 100);
                    result.push({
                        id: 'top-trigger',
                        type: 'trigger',
                        icon: '⚡',
                        priority: 9,
                        title: `"${topTrigger}" dukker ofte opp`,
                        description: `Dette har vært en faktor ${topData.total} ganger. Du har mestret ${resistRate}% av disse situasjonene.`,
                        color: resistRate >= 70 ? 'var(--success)' : 'var(--danger)'
                    });
                }
            }

            // Find "best mastered" trigger
            const mastered = sortedTriggers.find(([, data]) => data.total >= 3 && (data.resisted / data.total) >= 0.8);
            if (mastered) {
                result.push({
                    id: 'mastered-trigger',
                    type: 'achievement',
                    icon: '🏆',
                    priority: 6,
                    title: `Du mestrer "${mastered[0]}" godt!`,
                    description: `Du har motstått ${Math.round((mastered[1].resisted / mastered[1].total) * 100)}% av gangene. Dette er en styrke!`,
                    color: 'var(--success)'
                });
            }
        }

        // ── 3. MOOD TREND ANALYSIS ─────────────────────────────────
        if (journalEntries.length >= 5) {
            const entriesWithMood = journalEntries.filter(e => e.mood).slice(0, 14);

            if (entriesWithMood.length >= 5) {
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
                        description: `Gjennomsnittlig humør har økt den siste tiden. Det du gjør fungerer! 🌟`,
                        color: 'var(--success)'
                    });
                } else if (diff < -0.5) {
                    result.push({
                        id: 'mood-down',
                        type: 'warning',
                        icon: '📉',
                        priority: 10,
                        title: 'Vi ser et lite dipp i humøret',
                        description: `Husk at det er helt normalt med svingninger. Ta vare på deg selv litt ekstra i dag. 🧘`,
                        color: 'var(--warning)'
                    });
                }
            }
        }

        // ── 4. MASTERY RATE ────────────────────────────────────────
        if (events.length >= 5) {
            const resisted = events.filter(ev => ev.outcome === 'resisted').length;
            const used = events.filter(ev => ev.outcome === 'used').length;
            const total = resisted + used;

            if (total >= 5) {
                const rate = Math.round((resisted / total) * 100);

                result.push({
                    id: 'mastery-rate',
                    type: 'stat',
                    icon: rate >= 70 ? '💪' : '🎯',
                    priority: 5,
                    title: `${rate}% mestringsgrad`,
                    description: `Du har motstått ${resisted} av ${total} utfordringer. ${rate >= 80 ? 'Fantastisk kontroll!' : 'Hver lille seier bygger styrke over tid.'}`,
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
                    title: `${daysToNext} dager til ny milepæl!`,
                    description: `Du nærmer deg ${nextMilestone} dager. Hold fokus, du er nesten der! 💪`,
                    color: 'var(--secondary)'
                });
            }

            const passedMilestone = milestones.filter(m => daysSober >= m).pop();
            if (passedMilestone) {
                result.push({
                    id: 'milestone-passed',
                    type: 'achievement',
                    icon: '🏅',
                    priority: 4,
                    title: `${passedMilestone} dager rusfri!`,
                    description: `En fantastisk prestasjon. Hver dag uten rus er en investering i deg selv. 🎉`,
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
                    description: `Du er flink til å reflektere. Konsistens er nøkkelen til varig endring.`,
                    color: 'var(--primary)'
                });
            } else if (last7Days.size === 0 && journalEntries.length > 2) {
                result.push({
                    id: 'journal-nudge',
                    type: 'nudge',
                    icon: '✍️',
                    priority: 6,
                    title: 'Tid for refleksjon?',
                    description: 'Du har ikke skrevet i dagboken på en stund. Å sette ord på følelser kan hjelpe på tunge dager.',
                    color: 'var(--text-muted)'
                });
            }
        }

        // ── 7. SMART SUGGESTION ────────────────────────────────────
        if (events.length >= 5) {
            const strategyMap = {};
            events.forEach(ev => {
                if (ev.strategies && ev.strategies.length > 0 && ev.outcome === 'resisted') {
                    ev.strategies.forEach(s => {
                        strategyMap[s] = (strategyMap[s] || 0) + 1;
                    });
                }
            });

            const bestStrategy = Object.entries(strategyMap).sort((a, b) => b[1] - a[1])[0];
            if (bestStrategy && bestStrategy[1] >= 3) {
                result.push({
                    id: 'smart-suggestion',
                    type: 'suggestion',
                    icon: '💡',
                    priority: 8,
                    title: `"${bestStrategy[0]}" er effektiv for deg`,
                    description: `Denne strategien har hjulpet deg flere ganger. Husk å bruke den når det trengs!`,
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
                title: 'Alle mål er nådd!',
                description: 'Kanskje det er på tide å sette seg en ny liten utfordring?',
                color: 'var(--primary)'
            });
        }

        // Sort by priority (highest first) and return top 4
        return result
            .sort((a, b) => b.priority - a.priority)
            .slice(0, 4);

    }, [events, journalEntries, goals, daysSober]);

    return { insights };
}

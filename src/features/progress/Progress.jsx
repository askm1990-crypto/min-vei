import { useEvents } from '../../hooks/useEvents';
import { useJournal } from '../../hooks/useJournal';
import { useGoals } from '../../hooks/useGoals';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { daysBetween } from '../../utils/dateUtils';
import { BADGES } from '../../data/challenges';
import Card from '../../components/ui/Card';
import WeeklyActivity from '../../components/ui/WeeklyActivity';
import MoodGraph from '../../components/ui/MoodGraph';
import './Progress.css';

export default function Progress() {
    const { events, getMostCommonTrigger, getRecentTrend } = useEvents();
    const { entries: journalEntries, getMoodTrend, getStreak: journalStreak } = useJournal();
    const { activeGoals, completedGoals } = useGoals();
    const { points } = useRecoveryScore();
    const [user] = useLocalStorage('mv2_user', null);
    const [challengeHistory] = useLocalStorage('mv2_challenge_history', []);

    // ── SOBRIETY CALCULATION ──────────────────────────────────
    const usedEvents = events.filter(e => e.outcome === 'used');
    const lastRelapse = usedEvents.length > 0
        ? usedEvents.reduce((prev, curr) => new Date(prev.date) > new Date(curr.date) ? prev : curr)
        : null;

    // Current Streak (Visually "Dager rusfri")
    const daysSober = lastRelapse
        ? daysBetween(lastRelapse.date)
        : (user?.startDate ? daysBetween(user.startDate) : 0);
    // ──────────────────────────────────────────────────────────

    const resistedEvents = events.filter(e => e.outcome === 'resisted').length;
    const usedEventsCount = usedEvents.length;
    const trend = getRecentTrend();
    const moodData = getMoodTrend(14);

    // Build badge data
    const badgeData = {
        totalEvents: events.length,
        totalJournalEntries: journalEntries.length,
        totalGoals: activeGoals.length + completedGoals.length,
        completedGoals: completedGoals.length,
        daysSober,
        resistedEvents,
        journalStreak: journalStreak(),
        challengeStreak: 0, // TODO: calculate from history
        totalPoints: points,
        crisisPlanComplete: false // TODO: from crisis module
    };

    const earnedBadges = BADGES.filter(b => b.condition(badgeData));
    const lockedBadges = BADGES.filter(b => !b.condition(badgeData));

    // Trigger analysis
    const triggerCounts = {};
    events.forEach(ev => {
        if (ev.triggers && Array.isArray(ev.triggers)) {
            ev.triggers.forEach(t => {
                triggerCounts[t] = (triggerCounts[t] || 0) + 1;
            });
        }
    });
    const sortedTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const MOOD_EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁' };

    return (
        <div className="progress-page">
            <h2 className="progress-title">Din Fremgang</h2>
            <p className="progress-subtitle">Alt du har oppnådd samlet på ett sted.</p>

            {/* STATS OVERVIEW */}
            <div className="progress-stats">
                <div className="p-stat">
                    <span className="p-stat-value">{daysSober}</span>
                    <span className="p-stat-label">Dager rusfri</span>
                </div>
                <div className="p-stat">
                    <span className="p-stat-value">{resistedEvents}</span>
                    <span className="p-stat-label">Sug mestret</span>
                </div>
                <div className="p-stat">
                    <span className="p-stat-value">{journalEntries.length}</span>
                    <span className="p-stat-label">Dagbokinnlegg</span>
                </div>
                <div className="p-stat">
                    <span className="p-stat-value">{earnedBadges.length}</span>
                    <span className="p-stat-label">Badges</span>
                </div>
            </div>

            <div className="progress-grid">
                {/* WEEKLY OVERVIEW */}
                <Card header="Siste 7 dager" hoverable={false}>
                    <div className="weekly-bar">
                        <div className="weekly-item">
                            <div className="weekly-bar-fill success" style={{ height: `${trend.resisted ? (trend.resisted / Math.max(trend.total, 1)) * 100 : 0}%` }} />
                            <span className="weekly-label">✅ {trend.resisted}</span>
                            <span className="weekly-sublabel">Mestret</span>
                        </div>
                        <div className="weekly-item">
                            <div className="weekly-bar-fill error" style={{ height: `${trend.used ? (trend.used / Math.max(trend.total, 1)) * 100 : 0}%` }} />
                            <span className="weekly-label">❌ {trend.used}</span>
                            <span className="weekly-sublabel">Brukt</span>
                        </div>
                        <div className="weekly-item">
                            <span className="weekly-label">📊 {trend.total}</span>
                            <span className="weekly-sublabel">Totalt</span>
                        </div>
                    </div>
                </Card>

                {/* WEEKLY ACTIVITY */}
                <Card header="Aktivitet siste 7 dager" hoverable={false} className="badges-card">
                    <WeeklyActivity
                        events={events}
                        journalEntries={journalEntries}
                        goals={[...activeGoals, ...completedGoals]}
                    />
                </Card>

                {/* TRIGGER ANALYSIS */}
                <Card header="Dine topp-triggere" hoverable={false}>
                    {sortedTriggers.length > 0 ? (
                        <div className="trigger-analysis">
                            {sortedTriggers.map(([trigger, count], i) => (
                                <div key={trigger} className="trigger-row">
                                    <span className="trigger-rank">#{i + 1}</span>
                                    <span className="trigger-name">{trigger}</span>
                                    <div className="trigger-bar-bg">
                                        <div className="trigger-bar-fill" style={{ width: `${(count / sortedTriggers[0][1]) * 100}%` }} />
                                    </div>
                                    <span className="trigger-count">{count}x</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="placeholder-text">Logg hendelser for å se triggeranalyse.</p>
                    )}
                </Card>

                {/* MOOD TREND */}
                <Card header="Humørtrend (14 dager)" hoverable={false}>
                    {moodData.length > 0 ? (
                        <MoodGraph moodData={moodData} />
                    ) : (
                        <p className="placeholder-text">Skriv i dagboken for å se humørtrend.</p>
                    )}
                </Card>

                {/* BADGES */}
                <Card header={`Badges (${earnedBadges.length}/${BADGES.length})`} hoverable={false} className="badges-card">
                    <div className="badges-grid">
                        {earnedBadges.map(b => (
                            <div key={b.id} className="badge earned" title={b.desc}>
                                <span className="badge-emoji">{b.emoji}</span>
                                <span className="badge-title">{b.title}</span>
                            </div>
                        ))}
                        {lockedBadges.map(b => (
                            <div key={b.id} className="badge locked" title={b.desc}>
                                <span className="badge-emoji">🔒</span>
                                <span className="badge-title">{b.title}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

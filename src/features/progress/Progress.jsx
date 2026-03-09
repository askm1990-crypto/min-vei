import { useTimeline } from '../../hooks/useTimeline';
import { useGoals } from '../../hooks/useGoals';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useInsights } from '../../hooks/useInsights';
import { daysBetween } from '../../utils/dateUtils';
import { BADGES } from '../../data/challenges';
import Card from '../../components/ui/Card';
import ActivityHistory from '../../components/ui/ActivityHistory';
import MoodGraph from '../../components/ui/MoodGraph';
import InsightCards from '../../components/ui/InsightCards';
import './Progress.css';

export default function Progress() {
    const { getEvents, getJournalEntries, getRecentEventTrend, getStreak, getMoodTrend } = useTimeline();

    // Fetch once
    const events = getEvents();
    const journalEntries = getJournalEntries();
    const { activeGoals, completedGoals } = useGoals();
    const { points } = useRecoveryScore();
    const [user] = useLocalStorage('mv2_user', null);


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

    const trend = getRecentEventTrend();
    const moodData = getMoodTrend(14);

    // ── challengeStreak: consecutive days with completed challenges ──
    const challengeStreak = (() => {
        try {
            const raw = localStorage.getItem('mv2_challenge_history');
            if (!raw) return 0;
            const history = JSON.parse(raw);
            if (!Array.isArray(history) || history.length === 0) return 0;

            // Collect unique dates (ISO date strings) where a challenge was completed
            const completedDates = new Set(
                history
                    .filter(entry => entry.completed)
                    .map(entry => new Date(entry.date).toISOString().split('T')[0])
            );

            let streak = 0;
            const today = new Date();
            for (let i = 0; i < 365; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const key = d.toISOString().split('T')[0];
                if (completedDates.has(key)) {
                    streak++;
                } else {
                    break;
                }
            }
            return streak;
        } catch {
            return 0;
        }
    })();

    // ── crisisPlanComplete: has at least one phone number AND one coping strategy ──
    const crisisPlanComplete = (() => {
        try {
            const raw = localStorage.getItem('mv2_crisis_plan');
            if (!raw) return false;
            const plan = JSON.parse(raw);
            if (!plan || typeof plan !== 'object') return false;

            // Check for at least one non-empty phone number
            const phones = plan.contacts || plan.phones || plan.phoneNumbers || [];
            const hasPhone = Array.isArray(phones)
                ? phones.some(p => p && (typeof p === 'string' ? p.trim() : (p.phone || p.number || '')).toString().trim())
                : Object.values(plan).some(v => typeof v === 'string' && /\d{4,}/.test(v));

            // Check for at least one coping strategy
            const strategies = plan.strategies || plan.copingStrategies || plan.techniques || [];
            const hasStrategy = Array.isArray(strategies)
                ? strategies.some(s => s && (typeof s === 'string' ? s.trim() : (s.text || s.name || '')).toString().trim())
                : false;

            return hasPhone && hasStrategy;
        } catch {
            return false;
        }
    })();

    // Build badge data
    const badgeData = {
        totalEvents: events.length,
        totalJournalEntries: journalEntries.length,
        totalGoals: activeGoals.length + completedGoals.length,
        completedGoals: completedGoals.length,
        daysSober,
        resistedEvents,
        journalStreak: getStreak(),
        challengeStreak,
        totalPoints: points,
        crisisPlanComplete
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

    // Insights
    const allGoals = [...activeGoals, ...completedGoals];
    const { insights } = useInsights({ events, journalEntries, goals: allGoals, daysSober });

    const MOOD_EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁' };

    return (
        <div className="progress-page">
            <h2 className="progress-title">Innsikt</h2>
            <p className="progress-subtitle">Dine mønstre, din mestring, dine fremskritt.</p>

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
                {/* INSIGHT CARDS — full width, top of grid */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <InsightCards insights={insights} />
                </div>

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

                {/* ACTIVITY HISTORY */}
                <Card header="Aktivitetshistorikk" hoverable={false} className="badges-card">
                    <ActivityHistory
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

import { useState, useEffect, useRef } from 'react';
import { useRecoveryScore, POINTS } from '../../hooks/useRecoveryScore';
import { useTimeline } from '../../hooks/useTimeline';
import { useGoals } from '../../hooks/useGoals';
import { useInsights } from '../../hooks/useInsights';
import { useAppStore } from '../../store/useAppStore';
import { useRecoveryStore } from '../../store/useRecoveryStore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { daysBetween } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import WeeklyActivity from '../../components/ui/WeeklyActivity';
import InsightCards from '../../components/ui/InsightCards';
import { showToast } from '../../components/ui/ToastUtils';
import { getDailyChallenge } from '../../data/challenges';
import MODULES from '../../data/modules.json';
import ReminderBanner from '../../components/ui/ReminderBanner';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotificationStore } from '../../store/useNotificationStore';
import './Dashboard.css';

// ── Helper: find the next module to read ─────────────────────────────────
function getNextModule(progress) {
    // Try in-progress first, then not-started unlocked
    const unlocked = MODULES.filter(m => {
        const required = m.requiredPreviousModules ||
            (m.requiredPreviousModule ? [m.requiredPreviousModule] : []);
        return required.every(id => progress[id] === 'completed');
    });
    const inProgress = unlocked.find(m => progress[m.id] === 'in-progress');
    if (inProgress) return inProgress;
    return unlocked.find(m => !progress[m.id] || progress[m.id] === 'not-started') || null;
}

export default function Dashboard({ onNavigate }) {
    const { points, level, title, progressToNext, nextLevelPoints, addPoints } = useRecoveryScore();
    const { getEvents, getJournalEntries, getMostCommonTrigger, getRecentEventTrend, getStreak, getMoodTrend } = useTimeline();

    // We fetch these once to pass down
    const events = getEvents();
    const journalEntries = getJournalEntries();
    const [moduleProgress] = useLocalStorage('mv2_module_progress', {});
    const { user, spending } = useAppStore();
    const [customTriggers] = useLocalStorage('mv2_custom_triggers', []);
    const { goals } = useGoals();
    const {
        lastSoberMilestone,
        lastLoggingMilestone,
        setLastSoberMilestone,
        setLastLoggingMilestone
    } = useRecoveryStore();
    const { checkAndShowDailyReminder } = useNotifications();
    const { showInAppBanner } = useNotificationStore();

    // ── SOBRIETY CALCULATION ──────────────────────────────────
    const usedEvents = events.filter(e => e.outcome === 'used');
    const lastRelapse = usedEvents.length > 0
        ? usedEvents.reduce((prev, curr) => new Date(prev.date) > new Date(curr.date) ? prev : curr)
        : null;

    // Current Streak (Visually "Rusfrie dager")
    const currentSoberStreak = lastRelapse
        ? daysBetween(lastRelapse.date)
        : (user?.startDate ? daysBetween(user.startDate) : 0);

    // Total Savings Days (Cumulative, but freezing on relapse days)
    const totalDaysSinceStart = user?.startDate ? daysBetween(user.startDate) : 0;
    const uniqueRelapseDates = new Set(usedEvents.map(e => new Date(e.date).toISOString().split('T')[0]));
    const totalSoberDays = Math.max(0, totalDaysSinceStart - uniqueRelapseDates.size);

    const daysSober = currentSoberStreak; // Use streak for display and insights
    // ──────────────────────────────────────────────────────────

    // AI Insights
    const { insights } = useInsights({
        events,
        journalEntries,
        goals,
        user,
        daysSober
    });

    // Daily challenge state
    const [challengeCompleted, setChallengeCompleted] = useLocalStorage('mv2_challenge_completed_date', null);

    // Track last date sober-day points were awarded
    const [lastSoberPointDate, setLastSoberPointDate] = useLocalStorage('mv2_last_sober_point_date', null);

    // Track level for level-up celebrations
    const prevLevelRef = useRef(level);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const todayStr = new Date().toISOString().split('T')[0];

    // Auto-award sober-day points once per day on dashboard load
    useEffect(() => {
        if (!user?.startDate) return;
        const daysSoberNow = daysBetween(user.startDate);
        if (daysSoberNow > 0 && lastSoberPointDate !== todayStr) {
            addPoints(POINTS.SOBER_DAY, `Rusfri dag #${daysSoberNow}`);
            setLastSoberPointDate(todayStr);
            showToast(`+${POINTS.SOBER_DAY} poeng for en ny rusfri dag! 🌟`, 'success');
        }

        // Also check if we should show a daily reminder
        checkAndShowDailyReminder();
    }, [todayStr, user?.startDate, lastSoberPointDate, addPoints, setLastSoberPointDate, checkAndShowDailyReminder]);

    // Streak awarding logic
    useEffect(() => {
        const logStreak = getStreak();

        // Check Sobriety Milestones
        [3, 7, 30].forEach(milestone => {
            if (currentSoberStreak >= milestone && lastSoberMilestone < milestone) {
                addPoints(POINTS[`STREAK_${milestone}_DAYS`], `${milestone} dager rusfri! 🎉`);
                showToast(`${milestone} dager rusfri! +${POINTS[`STREAK_${milestone}_DAYS`]} poeng 🎉`, 'success');
                setLastSoberMilestone(milestone);
            }
        });

        // Check Logging Milestones
        [3, 7, 30].forEach(milestone => {
            if (logStreak >= milestone && lastLoggingMilestone < milestone) {
                addPoints(POINTS[`STREAK_${milestone}_DAYS`], `${milestone} dagers logg-streak! 🔥`);
                showToast(`${milestone} dagers logg-streak! +${POINTS[`STREAK_${milestone}_DAYS`]} poeng 🔥`, 'success');
                setLastLoggingMilestone(milestone);
            }
        });
    }, [currentSoberStreak, getStreak, lastSoberMilestone, lastLoggingMilestone, setLastSoberMilestone, setLastLoggingMilestone, addPoints]);

    // Detect level-up
    useEffect(() => {
        if (prevLevelRef.current < level) {
            setTimeout(() => {
                setShowLevelUp(true);
                showToast(`🎉 Gratulerer! Du er nå Nivå ${level}: ${title}!`, 'success');
                setTimeout(() => setShowLevelUp(false), 3000);
            }, 0);
        }
        prevLevelRef.current = level;
    }, [level, title]);

    // Get user's known triggers from events + custom triggers
    const knownTriggers = [...new Set([
        ...customTriggers,
        ...events.flatMap(e => e.triggers || [])
    ])];

    const dailyChallenge = getDailyChallenge(knownTriggers);

    const handleCompleteChallenge = () => {
        if (!dailyChallenge || challengeCompleted === todayStr) return;

        addPoints(dailyChallenge.points, `Fullført utfordring: ${dailyChallenge.text}`);
        setChallengeCompleted(todayStr);
        showToast(`Bra jobba! +${dailyChallenge.points} poeng 🎉`, 'success');

        // Trigger generic confetti (could be replaced with a real canvas confetti later)
        const emoji = document.createElement('div');
        emoji.innerText = '🎊';
        emoji.className = 'confetti-pop';
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 2000);
    };



    // Calculate money saved (Using totalSoberDays to keep accumulated savings)
    const savedAmount = spending && user?.startDate ? calculateSaved(spending.frequency, spending.amountPerTime, totalSoberDays) : 0;

    return (
        <div className="dashboard">
            {/* IN-APP REMINDER BANNER */}
            {showInAppBanner && <ReminderBanner onNavigate={onNavigate} />}

            {/* LEVEL-UP CELEBRATION */}
            {showLevelUp && (
                <div className="level-up-overlay">
                    <div className="level-up-content">
                        <span className="level-up-emoji">🎉</span>
                        <h2>Nivå {level}!</h2>
                        <p>{title}</p>
                    </div>
                </div>
            )}

            {/* HERO: Gamification progress */}
            <div className="hero-section">
                <div className="hero-level">
                    <span className="hero-level-icon">🏆</span>
                    <div>
                        <h2 className="hero-level-title">Nivå {level}: {title}</h2>
                        <p className="hero-level-sub">{points.toLocaleString('nb-NO')} poeng totalt</p>
                    </div>
                </div>

                <div className="hero-progress-container">
                    <div className="hero-progress-bar">
                        <div
                            className="hero-progress-fill"
                            style={{ width: `${progressToNext}%` }}
                        />
                    </div>
                    {nextLevelPoints && (
                        <div className="hero-progress-text">
                            <span>Nivå {level}</span>
                            <span>Nivå {level + 1} ({nextLevelPoints.toLocaleString('nb-NO')} p)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* AI INSIGHTS */}
            <InsightCards insights={insights} />

            {/* NESTE MODUL FOCUS CARD */}
            {(() => {
                const next = getNextModule(moduleProgress);
                if (!next) return null;
                const completedCount = Object.values(moduleProgress).filter(v => v === 'completed').length;
                const isInProgress = moduleProgress[next.id] === 'in-progress';
                return (
                    <Card className="next-module-card" hoverable={false}>
                        <div className="next-module-card__inner">
                            <div className="next-module-card__left">
                                <span className="next-module-card__eyebrow">
                                    {isInProgress ? '🔄 Fortsett der du slapp' : '📚 Neste i læringsreisen'}
                                </span>
                                <h3 className="next-module-card__title">{next.icon} {next.title}</h3>
                                <p className="next-module-card__summary">{next.summary}</p>
                                <div className="next-module-card__meta">
                                    {next.readingTime && <span>📖 {next.readingTime}</span>}
                                    <span>{completedCount} av {MODULES.length} fullført</span>
                                </div>
                            </div>
                            <button
                                className="next-module-card__cta"
                                onClick={() => onNavigate('knowledge')}
                            >
                                {isInProgress ? 'Fortsett →' : 'Start →'}
                            </button>
                        </div>
                        <div className="next-module-card__progress">
                            <div
                                className="next-module-card__progress-fill"
                                style={{ width: `${(completedCount / MODULES.length) * 100}%` }}
                            />
                        </div>
                    </Card>
                );
            })()}

            <div className="dashboard-grid">

                {/* DAILY CHALLENGE */}
                {dailyChallenge && (
                    <Card className="challenge-card" hoverable={false}>
                        <div className="challenge-header">
                            <h3>⚡ Dagens Utfordring</h3>
                            {challengeCompleted === todayStr && <span className="challenge-badge">Fullført</span>}
                        </div>
                        <p className="challenge-text">"{dailyChallenge.text}"</p>

                        {challengeCompleted !== todayStr ? (
                            <Button
                                variant="primary"
                                wide
                                onClick={handleCompleteChallenge}
                                className="challenge-btn"
                            >
                                Fullfør for +{dailyChallenge.points} poeng 💰
                            </Button>
                        ) : (
                            <p className="challenge-success">Poeng samlet! Kom tilbake i morgen for ny utfordring.</p>
                        )}
                    </Card>
                )}

                {/* QUICK ACTIONS */}
                <Card header="Hurtigvalg (Samle poeng!)" className="quick-actions-card" hoverable={false}>
                    <div className="quick-actions-grid">
                        <button className="qa-btn" onClick={() => onNavigate('log-wizard')}>
                            <span className="qa-icon">📝</span>
                            <span className="qa-title">Ny Registrering</span>
                            <span className="qa-points">Opp til +{POINTS.CRAVING_RESISTED + POINTS.JOURNAL_ENTRY}p</span>
                        </button>
                        <button className="qa-btn" onClick={() => onNavigate('strategies')}>
                            <span className="qa-icon">🌬️</span>
                            <span className="qa-title">Pusteøvelse</span>
                            <span className="qa-points">+{POINTS.BREATHING_EXERCISE}p</span>
                        </button>
                    </div>
                </Card>

                {/* STATS */}
                <Card header="Din Status" className="stats-grid-wrapper" hoverable={false}>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-icon">🌟</span>
                            <div className="stat-content">
                                <strong>{daysSober} Dager</strong>
                                <span>Rusfri (+{POINTS.SOBER_DAY}p / dag)</span>
                            </div>
                        </div>
                        <div className="stat-box">
                            <span className="stat-icon">🏆</span>
                            <div className="stat-content">
                                <strong>{points} poeng</strong>
                                <span>Mestringspoeng</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* SAVINGS CALCULATOR */}
                {spending && (
                    <Card header="Sparekalkulator" className="savings-content-wrapper" hoverable={false}>
                        <div className="savings-content">
                            <span className="savings-icon">💰</span>
                            <div className="savings-details">
                                <strong>Du har spart ca. {savedAmount.toLocaleString('nb-NO')} kr</strong>
                                <span>Tilsvarer {formatFrequency(spending.frequency)} à {spending.amountPerTime} kr</span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* CRISIS CTA */}
                <Card className="crisis-cta-card" hoverable={false}>
                    <div className="crisis-cta-content">
                        <span className="crisis-icon">🛡️</span>
                        <div>
                            <h3>Klar for kriser?</h3>
                            <p>Tjen <strong>+{POINTS.CRISIS_PLAN_COMPLETE} poeng</strong> og bli "Kriseklar" ved å fylle ut din sikkerhetsplan.</p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => onNavigate('crisis')} style={{ marginTop: 'var(--space-3)' }}>
                        Start nå
                    </Button>
                </Card>

                {/* DASHBOARD INSIGHTS (Triggers and Trends) */}
                {events.length > 0 ? (
                    <Card header="Ditt Mønster" className="recent-events-card" hoverable={false}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {getMostCommonTrigger() && (
                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', background: 'var(--bg-body)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎯</span>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vanligste trigger</strong>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)' }}>{getMostCommonTrigger()}</span>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', background: 'var(--bg-body)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>📈</span>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Siste 7 dager</strong>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-main)' }}>
                                        {getRecentEventTrend().resisted} mestret / {getRecentEventTrend().used} ruset
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card header="Siste Hendelser" className="recent-events-card" hoverable={false}>
                        <div className="placeholder-content">
                            <span className="placeholder-icon">📋</span>
                            <p>Registrer din første hendelse for å se trender og din vanligste trigger.</p>
                        </div>
                    </Card>
                )}

                {/* MOOD TREND */}
                {getMoodTrend(7).length > 0 ? (
                    <Card header="Humør siste 7 dager" className="mood-trend-card" hoverable={false}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                            {getMoodTrend(7).slice(0, 7).reverse().map((m, i) => {
                                const EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁' };
                                const d = new Date(m.date);
                                const dayLabel = d.toLocaleDateString('nb-NO', { weekday: 'short' });
                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{EMOJIS[m.mood]}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{dayLabel}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {getStreak() > 1 && (
                            <p style={{ textAlign: 'center', marginTop: 'var(--space-3)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                🔥 {getStreak()} dager logg-streak!
                            </p>
                        )}
                    </Card>
                ) : (
                    <Card header="Humørtrend" className="mood-trend-card" hoverable={false}>
                        <div className="placeholder-content">
                            <span className="placeholder-icon">😊</span>
                            <p>Skriv i dagboken for å se humørtrenden din her.</p>
                        </div>
                    </Card>
                )}

                {/* WEEKLY ACTIVITY */}
                <Card header="Aktivitet siste 7 dager" className="calendar-card" hoverable={false}>
                    <WeeklyActivity
                        events={events}
                        journalEntries={journalEntries}
                        goals={goals}
                    />
                </Card>

            </div>
        </div>
    );
}

function calculateSaved(frequency, amount, days) {
    const freqMap = {
        'daily': 7,
        '4-6_week': 5,
        '2-3_week': 2.5,
        '1_week': 1,
        '2-3_month': 0.625,
        '1_month': 0.25,
    };
    const timesPerWeek = freqMap[frequency] || 0;
    const timesPerDay = timesPerWeek / 7;
    return Math.round(timesPerDay * amount * days);
}

function formatFrequency(frequency) {
    const f = {
        'daily': 'Daglig',
        '4-6_week': '4-6 ganger/uke',
        '2-3_week': '2-3 ganger/uke',
        '1_week': '1 gang/uke',
        '2-3_month': '2-3 ganger/måned',
        '1_month': '1 gang/måned'
    };
    return f[frequency] || frequency;
}

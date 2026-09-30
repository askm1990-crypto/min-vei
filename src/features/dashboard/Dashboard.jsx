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

    const nextModule = getNextModule(moduleProgress);
    const completedModules = Object.values(moduleProgress).filter(v => v === 'completed').length;
    const nextIsInProgress = nextModule && moduleProgress[nextModule.id] === 'in-progress';
    const moodTrend = getMoodTrend(7);
    const logStreak = getStreak();
    const trend = getRecentEventTrend();
    const commonTrigger = getMostCommonTrigger();
    const MOOD_EMOJIS = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😁' };

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

            {/* HERO: sober streak + level progress */}
            <section className="hero-section">
                <div className="hero-main">
                    <span className="hero-eyebrow">Rusfri</span>
                    <div className="hero-count">
                        <strong>{daysSober}</strong>
                        <span>{daysSober === 1 ? 'dag' : 'dager'}</span>
                    </div>
                    <p className="hero-level-sub">
                        Nivå {level}: {title}
                    </p>

                    <div className="hero-progress-container">
                        <div
                            className="hero-progress-bar"
                            role="progressbar"
                            aria-valuenow={Math.round(progressToNext)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Fremgang mot neste nivå"
                        >
                            <div
                                className="hero-progress-fill"
                                style={{ width: `${progressToNext}%` }}
                            />
                        </div>
                        {nextLevelPoints && (
                            <div className="hero-progress-text">
                                <span>Nivå {level}</span>
                                <span>Nivå {level + 1} · {nextLevelPoints.toLocaleString('nb-NO')} p</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hero-side">
                    <div className="hero-chip">
                        <span className="hero-chip__icon">🏆</span>
                        <div>
                            <strong>{points.toLocaleString('nb-NO')}</strong>
                            <span>poeng</span>
                        </div>
                    </div>
                    {logStreak > 0 && (
                        <div className="hero-chip">
                            <span className="hero-chip__icon">🔥</span>
                            <div>
                                <strong>{logStreak}</strong>
                                <span>{logStreak === 1 ? 'dag logget' : 'dager logget'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* QUICK ACTIONS */}
            <div className="qa-row">
                <button className="qa-btn qa-btn--primary" onClick={() => onNavigate('log-wizard')}>
                    <span className="qa-icon">📝</span>
                    <span className="qa-text">
                        <span className="qa-title">Ny registrering</span>
                        <span className="qa-points">Opp til +{POINTS.CRAVING_RESISTED + POINTS.JOURNAL_ENTRY}p</span>
                    </span>
                </button>
                <button className="qa-btn" onClick={() => onNavigate('strategies')}>
                    <span className="qa-icon">🌬️</span>
                    <span className="qa-text">
                        <span className="qa-title">Pusteøvelse</span>
                        <span className="qa-points">+{POINTS.BREATHING_EXERCISE}p</span>
                    </span>
                </button>
            </div>

            {/* AI INSIGHTS */}
            <InsightCards insights={insights} />

            <div className="dashboard-grid">

                {/* DAILY CHALLENGE */}
                {dailyChallenge && (
                    <Card className={`challenge-card ${spending ? '' : 'challenge-card--wide'}`} hoverable={false}>
                        <div className="challenge-header">
                            <span className="eyebrow">⚡ Dagens utfordring</span>
                            {challengeCompleted === todayStr && <span className="challenge-badge">Fullført</span>}
                        </div>
                        <p className="challenge-text">{dailyChallenge.text}</p>

                        {challengeCompleted !== todayStr ? (
                            <Button
                                variant="primary"
                                onClick={handleCompleteChallenge}
                                className="challenge-btn"
                            >
                                Fullfør for +{dailyChallenge.points} poeng
                            </Button>
                        ) : (
                            <p className="challenge-success">Poeng samlet! Kom tilbake i morgen for ny utfordring.</p>
                        )}
                    </Card>
                )}

                {/* SAVINGS */}
                {spending && (
                    <Card className="savings-content-wrapper" hoverable={false}>
                        <span className="eyebrow">💰 Sparekalkulator</span>
                        <div className="savings-amount">
                            {savedAmount.toLocaleString('nb-NO')}<small> kr</small>
                        </div>
                        <p className="savings-note">Tilsvarer {formatFrequency(spending.frequency)} à {spending.amountPerTime} kr</p>
                    </Card>
                )}

                {/* NEXT MODULE */}
                {nextModule && (
                    <Card className="next-module-card" hoverable={false}>
                        <div className="next-module-card__inner">
                            <span className="next-module-card__badge" aria-hidden="true">{nextModule.icon}</span>
                            <div className="next-module-card__left">
                                <span className="eyebrow">
                                    {nextIsInProgress ? '🔄 Fortsett der du slapp' : '📚 Neste i læringsreisen'}
                                </span>
                                <h3 className="next-module-card__title">{nextModule.title}</h3>
                                <p className="next-module-card__summary">{nextModule.summary}</p>
                                <div className="next-module-card__meta">
                                    {nextModule.readingTime && <span>📖 {nextModule.readingTime}</span>}
                                    <span>{completedModules} av {MODULES.length} fullført</span>
                                </div>
                            </div>
                            <button
                                className="next-module-card__cta"
                                onClick={() => onNavigate('knowledge')}
                            >
                                {nextIsInProgress ? 'Fortsett →' : 'Start →'}
                            </button>
                        </div>
                        <div className="next-module-card__progress">
                            <div
                                className="next-module-card__progress-fill"
                                style={{ width: `${(completedModules / MODULES.length) * 100}%` }}
                            />
                        </div>
                    </Card>
                )}

                {/* PATTERNS (triggers and trends) */}
                {events.length > 0 ? (
                    <Card className="recent-events-card" hoverable={false}>
                        <span className="eyebrow">Ditt mønster</span>
                        <div className="pattern-list">
                            {commonTrigger && (
                                <div className="pattern-row">
                                    <span className="pattern-row__icon">🎯</span>
                                    <div>
                                        <span className="pattern-row__label">Vanligste trigger</span>
                                        <strong className="pattern-row__value">{commonTrigger}</strong>
                                    </div>
                                </div>
                            )}
                            <div className="pattern-row">
                                <span className="pattern-row__icon">📈</span>
                                <div>
                                    <span className="pattern-row__label">Siste 7 dager</span>
                                    <strong className="pattern-row__value">
                                        {trend.resisted} mestret · {trend.used} ruset
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="recent-events-card" hoverable={false}>
                        <span className="eyebrow">Siste hendelser</span>
                        <div className="placeholder-content">
                            <span className="placeholder-icon">📋</span>
                            <p>Registrer din første hendelse for å se trender og din vanligste trigger.</p>
                        </div>
                    </Card>
                )}

                {/* MOOD TREND */}
                {moodTrend.length > 0 ? (
                    <Card className="mood-trend-card" hoverable={false}>
                        <span className="eyebrow">Humør siste 7 dager</span>
                        <div className="mood-strip">
                            {moodTrend.slice(0, 7).reverse().map((m, i) => {
                                const dayLabel = new Date(m.date).toLocaleDateString('nb-NO', { weekday: 'short' });
                                return (
                                    <div key={i} className="mood-strip__day" data-mood={m.mood}>
                                        <span className="mood-strip__emoji">{MOOD_EMOJIS[m.mood]}</span>
                                        <span className="mood-strip__label">{dayLabel}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {logStreak > 1 && (
                            <p className="mood-streak">🔥 {logStreak} dager logg-streak!</p>
                        )}
                    </Card>
                ) : (
                    <Card className="mood-trend-card" hoverable={false}>
                        <span className="eyebrow">Humørtrend</span>
                        <div className="placeholder-content">
                            <span className="placeholder-icon">😊</span>
                            <p>Skriv i dagboken for å se humørtrenden din her.</p>
                        </div>
                    </Card>
                )}

                {/* WEEKLY ACTIVITY */}
                <Card className="calendar-card" hoverable={false}>
                    <span className="eyebrow">Aktivitet denne uken</span>
                    <WeeklyActivity
                        events={events}
                        journalEntries={journalEntries}
                        goals={goals}
                    />
                </Card>

                {/* CRISIS CTA */}
                <Card className="crisis-cta-card" hoverable={false}>
                    <div className="crisis-cta-content">
                        <span className="crisis-icon">🛡️</span>
                        <div>
                            <h3>Klar for kriser?</h3>
                            <p>Tjen <strong>+{POINTS.CRISIS_PLAN_COMPLETE} poeng</strong> og bli «Kriseklar» ved å fylle ut din sikkerhetsplan.</p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => onNavigate('crisis')} className="crisis-cta-btn">
                        Start nå
                    </Button>
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

import { useEffect } from 'react';
import { useRecoveryScore, POINTS } from '../../hooks/useRecoveryScore';
import { useTimeline } from '../../hooks/useTimeline';
import { useGoals } from '../../hooks/useGoals';
import { useInsights } from '../../hooks/useInsights';
import { useAppStore } from '../../store/useAppStore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { daysBetween } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import WeeklyActivity from '../../components/ui/WeeklyActivity';
import InsightCards from '../../components/ui/InsightCards';
import ReminderBanner from '../../components/ui/ReminderBanner';
import { Icon } from '../../components/layout/Sidebar';
import { showToast } from '../../components/ui/ToastUtils';
import { getDailyChallenge } from '../../data/challenges';
import MODULES from '../../data/modules.json';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotificationStore } from '../../store/useNotificationStore';
import './Dashboard.css';

function getNextModule(progress) {
    const unlocked = MODULES.filter(module => {
        const required = module.requiredPreviousModules ||
            (module.requiredPreviousModule ? [module.requiredPreviousModule] : []);
        return required.every(id => progress[id] === 'completed');
    });

    return unlocked.find(module => progress[module.id] === 'in-progress') ||
        unlocked.find(module => !progress[module.id] || progress[module.id] === 'not-started') ||
        null;
}

export default function Dashboard({ onNavigate }) {
    const { addPoints } = useRecoveryScore();
    const {
        getEvents,
        getJournalEntries,
        getMostCommonTrigger,
        getRecentEventTrend,
        getMoodTrend
    } = useTimeline();
    const { goals } = useGoals();
    const { user, spending } = useAppStore();
    const [moduleProgress] = useLocalStorage('mv2_module_progress', {});
    const [customTriggers] = useLocalStorage('mv2_custom_triggers', []);
    const [challengeCompleted, setChallengeCompleted] = useLocalStorage('mv2_challenge_completed_date', null);
    const [lastSoberPointDate, setLastSoberPointDate] = useLocalStorage('mv2_last_sober_point_date', null);
    const { checkAndShowDailyReminder } = useNotifications();
    const { showInAppBanner } = useNotificationStore();

    const events = getEvents();
    const journalEntries = getJournalEntries();
    const usedEvents = events.filter(event => event.outcome === 'used');
    const lastRelapse = usedEvents.length > 0
        ? usedEvents.reduce((previous, current) =>
            new Date(previous.date) > new Date(current.date) ? previous : current)
        : null;
    const daysSober = lastRelapse
        ? daysBetween(lastRelapse.date)
        : (user?.startDate ? daysBetween(user.startDate) : 0);
    const totalDaysSinceStart = user?.startDate ? daysBetween(user.startDate) : 0;
    const relapseDates = new Set(usedEvents.map(event => new Date(event.date).toISOString().split('T')[0]));
    const totalSoberDays = Math.max(0, totalDaysSinceStart - relapseDates.size);
    const activityCount = events.length + journalEntries.length;
    const hasActivity = activityCount > 0;
    const today = getLocalDateString();

    const { insights } = useInsights({ events, journalEntries, goals, user, daysSober });
    const knownTriggers = [...new Set([
        ...customTriggers,
        ...events.flatMap(event => event.triggers || [])
    ])];
    const dailyChallenge = getDailyChallenge(knownTriggers);
    const nextModule = getNextModule(moduleProgress);
    const recentTrend = getRecentEventTrend();
    const moodTrend = getMoodTrend(7);
    const commonTrigger = getMostCommonTrigger();
    const savedAmount = spending && user?.startDate
        ? calculateSaved(spending.frequency, spending.amountPerTime, totalSoberDays)
        : 0;

    useEffect(() => {
        if (user?.startDate && daysBetween(user.startDate) > 0 && lastSoberPointDate !== today) {
            addPoints(POINTS.SOBER_DAY, 'Ny dag registrert');
            setLastSoberPointDate(today);
        }
        checkAndShowDailyReminder();
    }, [today, user?.startDate, lastSoberPointDate, addPoints, setLastSoberPointDate, checkAndShowDailyReminder]);

    const handleCompleteChallenge = () => {
        if (!dailyChallenge || challengeCompleted === today) return;
        addPoints(dailyChallenge.points, `Fullført fokus: ${dailyChallenge.text}`);
        setChallengeCompleted(today);
        showToast('Dagens fokus er markert som gjennomført.', 'success');
    };

    return (
        <div className="dashboard">
            {showInAppBanner && <ReminderBanner onNavigate={onNavigate} />}

            <header className="dashboard-welcome">
                <span className="dashboard-eyebrow">Din dag</span>
                <h2>Hva trenger du akkurat nå?</h2>
                <p>Velg ett lite steg. Resten kan vente.</p>
            </header>

            <div className="dashboard-primary-grid">
                <Card className="checkin-card" hoverable={false}>
                    <span className="card-eyebrow">Rask innsjekk</span>
                    <h3>Ta et lite øyeblikk</h3>
                    <p>Registrer en situasjon, eller åpne et verktøy som kan hjelpe her og nå.</p>
                    <div className="dashboard-actions">
                        <button type="button" className="dashboard-action" onClick={() => onNavigate('log-wizard')}>
                            <span className="dashboard-action__icon"><Icon name="edit-3" /></span>
                            <span><strong>Ny registrering</strong><small>Humør, sug eller hendelse</small></span>
                        </button>
                        <button type="button" className="dashboard-action" onClick={() => onNavigate('strategies')}>
                            <span className="dashboard-action__icon"><Icon name="anchor" /></span>
                            <span><strong>Finn ro</strong><small>Pust, grounding og mestring</small></span>
                        </button>
                    </div>
                </Card>

                <Card className="today-card" hoverable={false}>
                    <span className="card-eyebrow">Status</span>
                    <div className="today-stat">
                        <strong>{user?.startDate ? daysSober : '–'}</strong>
                        <span>{user?.startDate ? 'dager siden startdato' : 'Legg til startdato under Profil'}</span>
                    </div>
                    <div className="today-divider" />
                    <div className="today-meta">
                        <span><strong>{activityCount}</strong> registreringer</span>
                        <span><strong>{goals.filter(goal => goal.status === 'active').length}</strong> aktive mål</span>
                    </div>
                    {!user?.startDate && (
                        <Button variant="secondary" wide onClick={() => onNavigate('profile')}>Åpne profil</Button>
                    )}
                </Card>
            </div>

            {dailyChallenge && (
                <Card className="focus-card" hoverable={false}>
                    <div className="focus-card__content">
                        <span className="card-eyebrow">Dagens fokus</span>
                        <h3>{dailyChallenge.text}</h3>
                        <p>Et forslag, ikke et krav. Velg det bare hvis det passer dagen din.</p>
                    </div>
                    <Button
                        variant={challengeCompleted === today ? 'secondary' : 'primary'}
                        onClick={handleCompleteChallenge}
                        disabled={challengeCompleted === today}
                    >
                        {challengeCompleted === today ? 'Gjennomført' : 'Marker som gjort'}
                    </Button>
                </Card>
            )}

            <aside className="support-strip" aria-label="Hjelp og sikkerhet">
                <span className="support-strip__icon"><Icon name="alert-circle" /></span>
                <div>
                    <strong>Trenger du støtte nå?</strong>
                    <p>Finn nødnumre, støttepersoner og din personlige sikkerhetsplan.</p>
                </div>
                <Button variant="secondary" onClick={() => onNavigate('crisis')}>Åpne hjelp</Button>
            </aside>

            {nextModule && (
                <section className="dashboard-section" aria-labelledby="learning-title">
                    <div className="dashboard-section__header">
                        <div>
                            <span className="dashboard-eyebrow">Neste steg</span>
                            <h2 id="learning-title">Lær i ditt tempo</h2>
                        </div>
                    </div>
                    <Card className="learning-card" hoverable={false}>
                        <div>
                            <span className="card-eyebrow">{moduleProgress[nextModule.id] === 'in-progress' ? 'Fortsett der du slapp' : 'Anbefalt innhold'}</span>
                            <h3>{nextModule.title}</h3>
                            <p>{nextModule.summary}</p>
                            <small>{nextModule.readingTime || 'Kort lesing'}</small>
                        </div>
                        <Button variant="secondary" onClick={() => onNavigate('knowledge')}>Åpne</Button>
                    </Card>
                </section>
            )}

            {hasActivity && (
                <section className="dashboard-section" aria-labelledby="insight-title">
                    <div className="dashboard-section__header">
                        <div>
                            <span className="dashboard-eyebrow">Over tid</span>
                            <h2 id="insight-title">Dine mønstre</h2>
                        </div>
                        <Button variant="secondary" size="small" onClick={() => onNavigate('progress')}>Se all innsikt</Button>
                    </div>

                    {insights?.length > 0 && <InsightCards insights={insights} />}

                    <div className="insight-grid">
                        {(commonTrigger || events.length > 0) && (
                            <Card header="Siste 7 dager" hoverable={false}>
                                <dl className="pattern-list">
                                    {commonTrigger && <><dt>Vanligste trigger</dt><dd>{commonTrigger}</dd></>}
                                    <dt>Mestret</dt><dd>{recentTrend.resisted}</dd>
                                    <dt>Registrert bruk</dt><dd>{recentTrend.used}</dd>
                                </dl>
                            </Card>
                        )}

                        {moodTrend.length > 0 && (
                            <Card header="Humør" hoverable={false}>
                                <div className="mood-row" aria-label="Humør de siste sju dagene">
                                    {moodTrend.slice(0, 7).reverse().map((mood, index) => (
                                        <div key={`${mood.date}-${index}`} className="mood-day">
                                            <span className={`mood-dot mood-dot--${mood.mood}`} aria-hidden="true" />
                                            <small>{new Date(mood.date).toLocaleDateString('nb-NO', { weekday: 'short' })}</small>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        <Card header="Aktivitet siste 7 dager" hoverable={false}>
                            <WeeklyActivity events={events} journalEntries={journalEntries} goals={goals} />
                        </Card>
                    </div>
                </section>
            )}

            {spending && (
                <Card className="savings-card" hoverable={false}>
                    <span className="card-eyebrow">Ditt estimat</span>
                    <h3>Omtrent {savedAmount.toLocaleString('nb-NO')} kr spart</h3>
                    <p>Basert på {formatFrequency(spending.frequency).toLowerCase()} à {spending.amountPerTime} kr og oppgitt startdato.</p>
                </Card>
            )}
        </div>
    );
}

function getLocalDateString() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().split('T')[0];
}

function calculateSaved(frequency, amount, days) {
    const frequencyMap = {
        daily: 7,
        '4-6_week': 5,
        '2-3_week': 2.5,
        '1_week': 1,
        '2-3_month': 0.625,
        '1_month': 0.25,
    };
    return Math.round(((frequencyMap[frequency] || 0) / 7) * amount * days);
}

function formatFrequency(frequency) {
    const labels = {
        daily: 'Daglig',
        '4-6_week': '4–6 ganger per uke',
        '2-3_week': '2–3 ganger per uke',
        '1_week': '1 gang per uke',
        '2-3_month': '2–3 ganger per måned',
        '1_month': '1 gang per måned'
    };
    return labels[frequency] || frequency;
}

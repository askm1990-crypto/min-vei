import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { formatDateNO, formatTimeNO, daysBetween } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import './EventLog.css';

export default function EventLog({ onNavigate }) {
    const { events, getPendingEvents } = useEvents();
    const [filter, setFilter] = useState('all'); // 'all', 'resisted', 'used', 'ongoing'

    const pendingEvents = getPendingEvents();

    // Filter events
    const filteredEvents = events.filter(ev => {
        if (filter === 'all') return true;
        return ev.outcome === filter;
    });

    // Group events by month/year for timeline display
    const groupedEvents = filteredEvents.reduce((acc, ev) => {
        const date = new Date(ev.date);
        const monthYear = date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(ev);
        return acc;
    }, {});

    const renderOutcomeIcon = (outcome) => {
        switch (outcome) {
            case 'resisted': return <span className="outcome-icon success" title="Mestret">✅</span>;
            case 'used': return <span className="outcome-icon error" title="Sprekk">❌</span>;
            case 'ongoing': return <span className="outcome-icon warning" title="Pågår">⏳</span>;
            default: return null;
        }
    };

    const renderEventCard = (ev) => {
        const dateObj = new Date(ev.date);
        const isToday = daysBetween(dateObj) === 0;
        const TheDateString = isToday ? 'I dag' : formatDateNO(ev.date);

        return (
            <Card key={ev.id} className={`event-card outcome-${ev.outcome}`}>
                <div className="event-card-header">
                    <div className="event-card-time">
                        {renderOutcomeIcon(ev.outcome)}
                        <strong>{TheDateString} kl. {formatTimeNO(ev.date)}</strong>
                    </div>
                    <div className="event-card-intensity">
                        Intensitet: <strong>{ev.intensity}/10</strong>
                    </div>
                </div>

                <div className="event-card-body">
                    {ev.triggers && ev.triggers.length > 0 && (
                        <div className="event-detail">
                            <span className="detail-label">Triggere:</span>
                            <div className="detail-tags">
                                {ev.triggers.map(t => <span key={t} className="tag trigger-tag">{t}</span>)}
                            </div>
                        </div>
                    )}

                    {ev.feelings && ev.feelings.length > 0 && (
                        <div className="event-detail">
                            <span className="detail-label">Følelser:</span>
                            <div className="detail-tags">
                                {ev.feelings.map(f => <span key={f} className="tag feeling-tag">{f}</span>)}
                            </div>
                        </div>
                    )}

                    <div className="event-detail outcome-detail">
                        <span className="detail-label">Resultat:</span>
                        <span>
                            {ev.outcome === 'resisted' && `Mestret (${(ev.strategies && ev.strategies.length > 0) ? ev.strategies.join(', ') : (ev.strategy || 'Ingen spesifikk strategi')})`}
                            {ev.outcome === 'used' && `Brukte ${ev.substance}${ev.amount ? ` (${ev.amount})` : ''}`}
                            {ev.outcome === 'ongoing' && 'Pågående...'}
                        </span>
                    </div>

                    {ev.note && (
                        <div className="event-note">
                            "{ev.note}"
                        </div>
                    )}
                </div>
            </Card>
        );
    };

    return (
        <div className="event-log">
            {/* HER0 ACTION */}
            <div className="event-log-hero">
                <Button
                    variant="primary"
                    wide
                    onClick={() => onNavigate('event-wizard')}
                    className="new-event-btn"
                >
                    <span className="new-event-icon">➕</span> Registrer Ny Hendelse
                </Button>
                <p className="hero-points-hint">Tjen inntil <strong>+120 poeng</strong></p>
            </div>

            {/* PENDING BANNER */}
            {pendingEvents.length > 0 && (
                <div className="pending-banner">
                    <div className="pending-icon">⚠️</div>
                    <div className="pending-content">
                        <h4>Du har {pendingEvents.length} pågående hendelse{pendingEvents.length > 1 ? 'r' : ''}</h4>
                        <p>Husk å oppdatere utfallet når situasjonen har roet seg.</p>
                    </div>
                    <Button variant="secondary" onClick={() => onNavigate('event-wizard-pending', pendingEvents[0].id)}>
                        Oppdater
                    </Button>
                </div>
            )}

            {/* FILTERS */}
            <div className="event-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Alle
                </button>
                <button
                    className={`filter-btn ${filter === 'resisted' ? 'active' : ''}`}
                    onClick={() => setFilter('resisted')}
                >
                    ✅ Mestret
                </button>
                <button
                    className={`filter-btn ${filter === 'used' ? 'active' : ''}`}
                    onClick={() => setFilter('used')}
                >
                    ❌ Sprekk
                </button>
                <button
                    className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`}
                    onClick={() => setFilter('ongoing')}
                >
                    ⏳ Pågår
                </button>
            </div>

            {/* TIMELINE */}
            <div className="event-timeline">
                {events.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📝</span>
                        <h3>Ingen hendelser registrert ennå</h3>
                        <p>Her vil du se en tidslinje over alle dine registrerte sug og situasjoner. Start med å registrere din første!</p>
                        <Button variant="primary" onClick={() => onNavigate('event-wizard')}>
                            ➕ Registrer din første hendelse
                        </Button>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="empty-state">
                        <p>Ingen hendelser med dette filteret.</p>
                    </div>
                ) : (
                    Object.entries(groupedEvents).map(([monthYear, evs]) => (
                        <div key={monthYear} className="timeline-month">
                            <h3 className="month-header">{monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}</h3>
                            <div className="month-events">
                                {evs.map(renderEventCard)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import { formatDateNO, formatTimeNO, daysBetween } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import './Timeline.css';

const MOOD_EMOJIS = {
    1: '😞',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😁'
};

export default function Timeline({ onNavigate }) {
    const { entries, deleteEntry } = useTimeline();
    const [filter, setFilter] = useState('all'); // 'all', 'resisted', 'used', 'journal'

    // Filter events
    const filteredEntries = entries.filter(ev => {
        if (filter === 'all') return true;
        if (filter === 'journal') return !ev.intensity;
        return ev.outcome === filter;
    });

    // Group events by month/year for timeline display
    const groupedEntries = filteredEntries.reduce((acc, ev) => {
        const date = new Date(ev.date);
        const monthYear = date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(ev);
        return acc;
    }, {});

    const handleDelete = (id) => {
        if (window.confirm('Er du sikker på at du vil slette denne oppføringen?')) {
            deleteEntry(id);
        }
    };

    const renderEntryCard = (ev) => {
        const dateObj = new Date(ev.date);
        const isToday = daysBetween(dateObj) === 0;
        const theDateString = isToday ? 'I dag' : formatDateNO(ev.date);

        // Determine what type of card this is physically based on its data
        const isEvent = ev.intensity > 0;

        // Logic for which Emoji to show prominently
        let mainEmoji = '📝';
        let emojiClass = '';
        if (isEvent) {
            if (ev.outcome === 'resisted') {
                mainEmoji = '✅';
                emojiClass = 'resisted';
            } else if (ev.outcome === 'used') {
                mainEmoji = '❌';
                emojiClass = 'used';
            } else if (ev.outcome === 'ongoing') {
                mainEmoji = '⏳';
            }
        } else if (ev.mood) {
            mainEmoji = MOOD_EMOJIS[ev.mood] || '📝';
        }

        return (
            <Card key={ev.id} className="timeline-card">
                <div className="timeline-card-header">
                    <div className="card-meta-left">
                        <div className={`card-emoji ${emojiClass}`}>
                            {mainEmoji}
                        </div>
                        <div className="card-title-area">
                            <span className="card-title">
                                {ev.title ? ev.title : (
                                    isEvent
                                        ? (ev.outcome === 'resisted' ? 'Mestret sug' : ev.outcome === 'used' ? 'En sprekk' : 'Dagboknotat')
                                        : 'Dagboknotat'
                                )}
                            </span>
                            <span className="card-date">{theDateString} kl. {formatTimeNO(ev.date)}</span>
                        </div>
                    </div>
                    {isEvent && (
                        <div className="card-intensity" title="Intensitet på suget">
                            🔥 {ev.intensity}/10
                        </div>
                    )}
                </div>

                <div className="card-body">
                    {/* Event Strategy / Outcome logic */}
                    {isEvent && ev.outcome === 'resisted' && (
                        <div className="strategy-box">
                            <strong>Brukt strategi:</strong> {(ev.strategies && ev.strategies.length > 0) ? ev.strategies.join(', ') : 'Ingen spesifikk strategi logget'}
                        </div>
                    )}
                    {isEvent && ev.outcome === 'used' && (
                        <div className="strategy-box" style={{ background: 'rgba(255,0,0,0.05)', borderColor: 'rgba(255,0,0,0.2)' }}>
                            <strong>Brukte:</strong> {ev.substance} {ev.amount ? `(${ev.amount})` : ''}
                        </div>
                    )}

                    {/* Text content */}
                    {ev.body && (
                        <div className="entry-text">
                            {ev.body}
                        </div>
                    )}

                    {/* Gratitude */}
                    {ev.gratitude && (
                        <div className="gratitude-box">
                            <div className="gratitude-box-title">🙏 Takknemlig for:</div>
                            {ev.gratitude}
                        </div>
                    )}

                    {/* Tags (Triggers, feelings, generic tags) */}
                    {(ev.triggers?.length > 0 || ev.feelings?.length > 0 || ev.tags?.length > 0) && (
                        <div className="entry-tags">
                            {ev.feelings?.map(f => <span key={`f-${f}`} className="timeline-tag feeling">{f}</span>)}
                            {ev.triggers?.map(t => <span key={`t-${t}`} className="timeline-tag trigger">⚡ {t}</span>)}
                            {ev.tags?.map(t => <span key={`tag-${t}`} className="timeline-tag">#{t}</span>)}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                        <Button variant="secondary" size="sm" onClick={() => handleDelete(ev.id)}>🗑️ Slett</Button>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="timeline">
            {/* HER0 ACTION */}
            <div className="timeline-hero">
                <Button
                    variant="primary"
                    wide
                    onClick={() => onNavigate('log-wizard')}
                    className="new-entry-btn"
                >
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>📝</span> Skriv i dagboken
                </Button>
                <p className="hero-points-hint">Tjen poeng for å logge tanker og mestre sug</p>
            </div>

            {/* FILTERS */}
            <div className="timeline-filters">
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
                    ✅ Mestret Sug
                </button>
                <button
                    className={`filter-btn ${filter === 'used' ? 'active' : ''}`}
                    onClick={() => setFilter('used')}
                >
                    ❌ Sprekk
                </button>
                <button
                    className={`filter-btn ${filter === 'journal' ? 'active' : ''}`}
                    onClick={() => setFilter('journal')}
                >
                    📝 Kun Dagbok
                </button>
            </div>

            {/* TIMELINE LIST */}
            <div className="timeline-list">
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 200 150" className="empty-state-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                            <rect x="50" y="20" width="100" height="110" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="4" />
                            <path d="M70 40h60M70 60h60M70 80h40" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                            <circle cx="130" cy="100" r="12" fill="var(--primary)" opacity="0.8" />
                            <path d="M126 100l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <h3>Din dagbok er tom</h3>
                        <p>Her samles både dagboknotater og situasjoner hvor du kjenner på sug. Start med å registrere hvordan du har det akkurat nå.</p>
                        <Button variant="primary" onClick={() => onNavigate('log-wizard')}>
                            📝 Start din første registrering
                        </Button>
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="empty-state">
                        <p>Ingen oppføringer med dette filteret.</p>
                    </div>
                ) : (
                    Object.entries(groupedEntries).map(([monthYear, evs]) => (
                        <div key={monthYear} className="timeline-month">
                            <h3 className="month-header">{monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}</h3>
                            <div className="month-entries">
                                {evs.map(renderEntryCard)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useJournal } from '../../hooks/useJournal';
import { showToast } from '../../components/ui/ToastUtils';
import { formatDateNO, formatTimeNO, daysBetween } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import JournalEditor from './JournalEditor';
import './Journal.css';

const MOOD_EMOJIS = [
    { value: 1, emoji: '😞', label: 'Veldig dårlig' },
    { value: 2, emoji: '😕', label: 'Ikke bra' },
    { value: 3, emoji: '😐', label: 'Helt ok' },
    { value: 4, emoji: '😊', label: 'Bra' },
    { value: 5, emoji: '😁', label: 'Toppen' }
];

export default function Journal() {
    const { entries, deleteEntry, getStreak } = useJournal();
    const [isWriting, setIsWriting] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    const streak = getStreak();

    const getMoodEmoji = (value) => {
        const mood = MOOD_EMOJIS.find(m => m.value === value);
        return mood ? mood.emoji : '😐';
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Er du sikker på at du vil slette dette innlegget?')) {
            deleteEntry(id);
            showToast('Innlegg slettet.', 'success');
        }
    };

    // Group entries by month/year
    const groupedEntries = entries.reduce((acc, entry) => {
        const date = new Date(entry.date);
        const monthYear = date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(entry);
        return acc;
    }, {});

    if (isWriting) {
        return <JournalEditor onClose={() => setIsWriting(false)} />;
    }

    return (
        <div className="journal">
            {/* HERO */}
            <div className="journal-hero">
                <Button
                    variant="primary"
                    wide
                    onClick={() => setIsWriting(true)}
                    className="new-journal-btn"
                >
                    <span className="new-event-icon">✍️</span> Skriv i dagboken
                </Button>
                <p className="hero-points-hint">Tjen <strong>+30 poeng</strong></p>
            </div>

            {/* STREAK BANNER */}
            {streak > 0 && (
                <div className="streak-banner">
                    <span className="streak-icon">🔥</span>
                    <div>
                        <strong>{streak} dag{streak > 1 ? 'er' : ''} på rad</strong>
                        <p>Du har skrevet i dagboken {streak} dag{streak > 1 ? 'er' : ''} på rad. Fortsett slik!</p>
                    </div>
                </div>
            )}

            {/* TIMELINE */}
            <div className="journal-timeline">
                {entries.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📓</span>
                        <h3>Din dagbok er tom</h3>
                        <p>Skriv ned tanker, følelser og det du er takknemlig for. Det hjelper å sette ord på ting.</p>
                        <Button variant="primary" onClick={() => setIsWriting(true)}>
                            ✍️ Skriv ditt første innlegg
                        </Button>
                    </div>
                ) : (
                    Object.entries(groupedEntries).map(([monthYear, monthEntries]) => (
                        <div key={monthYear} className="timeline-month">
                            <h3 className="month-header">{monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}</h3>
                            <div className="month-entries">
                                {monthEntries.map(entry => {
                                    const isToday = daysBetween(new Date(entry.date)) === 0;
                                    const dateStr = isToday ? 'I dag' : formatDateNO(entry.date);
                                    const isExpanded = expandedId === entry.id;

                                    return (
                                        <Card key={entry.id} className="journal-card" onClick={() => toggleExpand(entry.id)}>
                                            <div className="journal-card-header">
                                                <div className="journal-card-meta">
                                                    <span className="journal-mood">{getMoodEmoji(entry.mood)}</span>
                                                    <div>
                                                        <strong className="journal-title">{entry.title || 'Uten tittel'}</strong>
                                                        <span className="journal-date">{dateStr} kl. {formatTimeNO(entry.date)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {!isExpanded && entry.body && (
                                                <p className="journal-preview">{entry.body.substring(0, 120)}{entry.body.length > 120 ? '...' : ''}</p>
                                            )}

                                            {isExpanded && (
                                                <div className="journal-expanded">
                                                    {entry.body && <p className="journal-body">{entry.body}</p>}

                                                    {entry.tags && entry.tags.length > 0 && (
                                                        <div className="journal-tags">
                                                            {entry.tags.map(tag => (
                                                                <span key={tag} className="tag journal-tag">{tag}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {entry.gratitude && (
                                                        <div className="journal-gratitude">
                                                            <span className="gratitude-icon">🙏</span>
                                                            <p><em>"{entry.gratitude}"</em></p>
                                                        </div>
                                                    )}

                                                    <div className="journal-card-actions">
                                                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}>
                                                            🗑️ Slett
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

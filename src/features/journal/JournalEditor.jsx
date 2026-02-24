import { useState } from 'react';
import { useJournal } from '../../hooks/useJournal';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

const MOOD_OPTIONS = [
    { value: 1, emoji: '😞', label: 'Veldig dårlig' },
    { value: 2, emoji: '😕', label: 'Ikke bra' },
    { value: 3, emoji: '😐', label: 'Helt ok' },
    { value: 4, emoji: '😊', label: 'Bra' },
    { value: 5, emoji: '😁', label: 'Toppen' }
];

const TAG_OPTIONS = [
    'Recovery', 'Familie', 'Jobb', 'Helse', 'Trening',
    'Søvn', 'Mestring', 'Motivasjon', 'Utfordring', 'Feiring'
];

export default function JournalEditor({ onClose }) {
    const { addEntry } = useJournal();
    const { addPoints } = useRecoveryScore();

    const [mood, setMood] = useState(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState([]);
    const [gratitude, setGratitude] = useState('');

    const toggleTag = (tag) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSave = () => {
        if (!mood) {
            showToast('Velg et humør først.', 'warning');
            return;
        }

        addEntry({
            mood,
            title: title.trim() || null,
            body: body.trim() || null,
            tags,
            gratitude: gratitude.trim() || null
        });

        addPoints(30, 'Skrev i dagboken');
        showToast('Innlegg lagret! +30 poeng ✍️', 'success');

        setTimeout(() => {
            onClose();
        }, 100);
    };

    const inputStyle = {
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        width: '100%',
        fontSize: '1rem',
        fontFamily: 'inherit',
        background: 'var(--bg-body)',
        color: 'var(--text-main)'
    };

    return (
        <div className="journal-editor view-enter">
            <div className="editor-header">
                <h2>Nytt innlegg</h2>
                <button className="wizard-back-btn" onClick={onClose}>
                    ✕ Avbryt
                </button>
            </div>

            <div className="editor-card">
                {/* MOOD */}
                <div className="editor-section">
                    <label className="editor-label">Hvordan har du det akkurat nå?</label>
                    <div className="mood-selector">
                        {MOOD_OPTIONS.map(m => (
                            <button
                                key={m.value}
                                className={`mood-btn ${mood === m.value ? 'selected' : ''}`}
                                onClick={() => setMood(m.value)}
                                title={m.label}
                            >
                                <span className="mood-emoji">{m.emoji}</span>
                                <span className="mood-label">{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* TITLE */}
                <div className="editor-section">
                    <label className="editor-label">Tittel (valgfritt)</label>
                    <input
                        type="text"
                        placeholder="Gi innlegget en tittel..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* BODY */}
                <div className="editor-section">
                    <label className="editor-label">Hva tenker du på?</label>
                    <textarea
                        placeholder="Skriv fritt... Hva skjedde i dag? Hvordan føler du deg? Hva lærte du?"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                        style={{ ...inputStyle, resize: 'vertical' }}
                    />
                </div>

                {/* TAGS */}
                <div className="editor-section">
                    <label className="editor-label">Emneknagger (valgfritt)</label>
                    <div className="tag-selector">
                        {TAG_OPTIONS.map(tag => (
                            <button
                                key={tag}
                                className={`option-btn tag-option ${tags.includes(tag) ? 'selected' : ''}`}
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRATITUDE */}
                <div className="editor-section">
                    <label className="editor-label">🙏 Takknemlighet (valgfritt)</label>
                    <input
                        type="text"
                        placeholder="Noe du er takknemlig for i dag..."
                        value={gratitude}
                        onChange={(e) => setGratitude(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* ACTIONS */}
                <div className="editor-actions">
                    <Button variant="secondary" onClick={onClose}>Avbryt</Button>
                    <Button variant="primary" onClick={handleSave} disabled={!mood}>
                        Lagre innlegg (+30p)
                    </Button>
                </div>
            </div>
        </div>
    );
}

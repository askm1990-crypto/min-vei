import { useState } from 'react';

const GRATITUDE_PROMPTS = [
    'En person jeg er glad for å ha...',
    'Noe som gikk bra i dag...',
    'En liten ting som skapte glede...',
    'Noe jeg klarte som var vanskelig...',
    'Noe kroppen eller naturen ga meg...',
];

export default function Step5Text({ data, updateData, onNext, onPrev }) {
    const [activePrompt, setActivePrompt] = useState(null);

    return (
        <div className="wizard-step view-enter">
            <h2 className="step-title">Dagbok & Takknemlighet</h2>
            <p className="step-subtitle">Valgfritt – men skriving hjelper hjernen bearbeide opplevelsen.</p>

            {/* Diary */}
            <div className="lw-card">
                <span className="lw-label">Tittel (valgfritt)</span>
                <input
                    type="text"
                    className="text-input"
                    placeholder="Gi innlegget en tittel..."
                    value={data.title || ''}
                    onChange={(e) => updateData({ title: e.target.value })}
                />
                <hr className="lw-divider-soft" />
                <span className="lw-label">Fri skriving</span>
                <textarea
                    className="text-input lw-textarea"
                    placeholder="Skriv det som faller deg inn. Det er bare for deg..."
                    rows={5}
                    value={data.body || ''}
                    onChange={(e) => updateData({ body: e.target.value })}
                />
            </div>

            {/* Gratitude */}
            <div className="lw-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: '1.3rem' }}>🌱</span>
                    <span className="lw-label" style={{ margin: 0 }}>Én ting jeg er takknemlig for</span>
                </div>
                <p className="lw-hint" style={{ marginBottom: 'var(--space-3)' }}>
                    Forskning viser at takknemlighet styrker mental motstandskraft over tid.
                </p>

                <div className="gratitude-prompts">
                    {GRATITUDE_PROMPTS.map(p => (
                        <button
                            key={p}
                            className={`gratitude-prompt-btn ${activePrompt === p ? 'active' : ''}`}
                            onClick={() => { setActivePrompt(p); updateData({ gratitude: '' }); }}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    className="text-input"
                    placeholder={activePrompt || 'Skriv fritt eller velg et forslag over...'}
                    value={data.gratitude || ''}
                    onChange={(e) => updateData({ gratitude: e.target.value })}
                />
            </div>

            <div className="step-actions">
                <button className="btn btn-secondary" onClick={onPrev}>← Tilbake</button>
                <button className="btn btn-primary" onClick={onNext}>Neste →</button>
            </div>
        </div>
    );
}

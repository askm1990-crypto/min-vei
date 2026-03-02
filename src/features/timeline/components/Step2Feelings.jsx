import { useState } from 'react';

const EMOTIONS = [
    { id: 'glad', label: 'Glad', color: '#F59E0B', emoji: '😊', sub: ['Lettet', 'Takknemlig', 'Håpefull', 'Begeistret', 'Rolig', 'Stolt'] },
    { id: 'trist', label: 'Trist', color: '#6B7280', emoji: '😔', sub: ['Ensom', 'Nedstemt', 'Skuffet', 'Savner noen', 'Håpløs', 'Tom'] },
    { id: 'sint', label: 'Sint', color: '#EF4444', emoji: '😠', sub: ['Frustrert', 'Irritert', 'Bitter', 'Urettferdig behandlet', 'Rasende'] },
    { id: 'redd', label: 'Redd', color: '#8B5CF6', emoji: '😨', sub: ['Urolig', 'Angst', 'Nervøs', 'Utrygg', 'Overveldet', 'Panikk'] },
    { id: 'skam', label: 'Skam/Skyld', color: '#EC4899', emoji: '😳', sub: ['Skamfull', 'Skyldig', 'Flau', 'Angrer', 'Verdiløs'] },
    { id: 'tom', label: 'Følelsesløs', color: '#94A3B8', emoji: '😶', sub: ['Tom', 'Nummen', 'Distansert', 'Ikke til stede', 'Flat'] },
];

const BODY_SCAN_STEPS = [
    { area: 'Bryst / Pust', question: 'Kjenner du kortpustethet, trykk eller tetthet i brystet?', yes: ['redd', 'skam'] },
    { area: 'Mage', question: 'Kjenner du uro, klump eller tomhet i magen?', yes: ['redd', 'trist'] },
    { area: 'Kjeve / Skuldre', question: 'Kjenner du spenning eller stivhet i kjeve, nakke eller skuldre?', yes: ['sint', 'redd'] },
    { area: 'Energi', question: 'Kjenner du deg tung, drenert eller uten overskudd?', yes: ['trist', 'tom'] },
    { area: 'Ansikt / Hud', question: 'Kjenner du varme i ansiktet, skjelvinger eller lyst til å gjemme deg?', yes: ['skam', 'redd'] },
    { area: 'Tanker / Ro', question: 'Er hodet stille og rolig akkurat nå, uten mye som plager deg?', yes: ['glad', 'tom'] },
];

export default function Step2Feelings({ data, updateData, onNext, onPrev }) {
    const [scanning, setScanning] = useState(false);
    const [scanIdx, setScanIdx] = useState(0);
    const [scanHits, setScanHits] = useState([]);
    const [expandedEmotion, setExpandedEmotion] = useState(null);

    // --- Helpers that work with the app's existing `feelings` flat array ---
    const currentFeelings = data.feelings || [];

    const toggleFeeling = (label) => {
        const updated = currentFeelings.includes(label)
            ? currentFeelings.filter(f => f !== label)
            : [...currentFeelings, label];
        updateData({ feelings: updated });
    };

    const isMainSelected = (emotionId) => {
        const e = EMOTIONS.find(em => em.id === emotionId);
        return e && currentFeelings.includes(e.label);
    };

    const toggleMainEmotion = (emotion) => {
        const isSelected = currentFeelings.includes(emotion.label);
        if (isSelected) {
            // Deselecting: remove main and ALL its sub-emotions
            const updated = currentFeelings.filter(f => f !== emotion.label && !emotion.sub.includes(f));
            updateData({ feelings: updated });
            // Close drawer if it was this one
            if (expandedEmotion === emotion.id) setExpandedEmotion(null);
        } else {
            // Selecting
            const updated = [...currentFeelings, emotion.label];
            updateData({ feelings: updated });
            // Auto-expand for convenience
            setExpandedEmotion(emotion.id);
        }
    };

    const toggleExpand = (e, emotionId) => {
        e.stopPropagation(); // Avoid triggering main button click
        setExpandedEmotion(expandedEmotion === emotionId ? null : emotionId);
    };

    // --- Body scan ---
    const handleScan = (yes) => {
        const s = BODY_SCAN_STEPS[scanIdx];
        const hits = yes ? [...new Set([...scanHits, ...s.yes])] : scanHits;
        if (scanIdx < BODY_SCAN_STEPS.length - 1) {
            setScanIdx(i => i + 1);
            setScanHits(hits);
        } else {
            // Scan finished — add the suggested main emotions to `feelings`
            const unique = [...new Set(hits)];
            const labels = unique.map(id => EMOTIONS.find(e => e.id === id)?.label).filter(Boolean);
            const merged = [...new Set([...currentFeelings, ...labels])];

            // Set flag to show instructive banner
            updateData({ feelings: merged, _bodyScanDone: true });
            setScanHits(unique); // Persist hits for the banner
            setScanning(false);

            // Auto-expand the first hit to show user they can explore more
            if (unique.length > 0) {
                setExpandedEmotion(unique[0]);
            }
        }
    };

    // --- Body scan view ---
    if (scanning) {
        const s = BODY_SCAN_STEPS[scanIdx];
        return (
            <div className="wizard-step view-enter">
                <h2 className="step-title">🧘 Kroppsskanning</h2>
                <p className="step-subtitle">Lukk øynene et øyeblikk. Kjenn rolig etter.</p>

                <div className="scan-progress-bar">
                    <div className="scan-progress-fill" style={{ width: `${((scanIdx + 1) / BODY_SCAN_STEPS.length) * 100}%` }} />
                </div>

                <div className="lw-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                    <span className="lw-label" style={{ color: 'var(--primary-color)' }}>{s.area}</span>
                    <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 'var(--space-4) 0 var(--space-6)', lineHeight: 1.5 }}>
                        {s.question}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={() => handleScan(true)}>
                            Ja, kjenner det
                        </button>
                        <button className="btn btn-secondary" onClick={() => handleScan(false)}>
                            Nei / usikker
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
                    {scanIdx + 1} av {BODY_SCAN_STEPS.length}
                </p>
                <button className="lw-link-btn" onClick={() => setScanning(false)}>
                    ← Tilbake til følelsesliste
                </button>
            </div>
        );
    }

    // --- Main feelings view ---
    return (
        <div className="wizard-step view-enter">
            <h2 className="step-title">Følelser akkurat nå</h2>
            <p className="step-subtitle">Velg det som passer best – du kan velge flere.</p>

            {/* Body scan results banner */}
            {data._bodyScanDone && (
                <div className="lw-card lw-card-highlight" style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 700, margin: '0 0 var(--space-2)' }}>
                        🧘 Kroppsskanningen foreslo følgende følelser. Klikk på dem for å velge/fjerne fra loggen:
                    </p>
                    <div className="lw-chip-grid">
                        {EMOTIONS.filter(e => scanHits.includes(e.id)).map(e => (
                            <button
                                key={e.id}
                                className={`lw-chip ${currentFeelings.includes(e.label) ? 'lw-chip-selected' : ''}`}
                                style={{ '--chip-color': e.color }}
                                onClick={() => toggleMainEmotion(e)}
                            >
                                {e.emoji} {e.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Emotion cards with expandable sub-emotions */}
            <div className="emotion-list">
                {EMOTIONS.map(e => (
                    <div key={e.id} className="emotion-group">
                        <div className={`emotion-card-container ${isMainSelected(e.id) ? 'selected' : ''}`} style={{ '--emotion-color': e.color }}>
                            <button
                                className="emotion-card-main"
                                onClick={() => toggleMainEmotion(e)}
                            >
                                <span className="emotion-card-emoji">{e.emoji}</span>
                                <span className="emotion-card-label">{e.label}</span>
                            </button>

                            {isMainSelected(e.id) && (
                                <button className="emotion-expand-toggle" onClick={(ev) => toggleExpand(ev, e.id)}>
                                    {expandedEmotion === e.id ? '▲ Lukk' : '▼ Nyansér'}
                                </button>
                            )}
                        </div>

                        {isMainSelected(e.id) && expandedEmotion === e.id && (
                            <div className="emotion-sub-drawer" style={{ '--emotion-color': e.color }}>
                                <span className="lw-label">Nyansér (valgfritt)</span>
                                <div className="lw-chip-grid">
                                    {e.sub.map(s => (
                                        <button
                                            key={s}
                                            className={`lw-chip ${currentFeelings.includes(s) ? 'lw-chip-selected' : ''}`}
                                            style={{ '--chip-color': e.color }}
                                            onClick={() => toggleFeeling(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Body scan trigger */}
            <button
                className="body-scan-trigger"
                onClick={() => { setScanIdx(0); setScanHits([]); setScanning(true); }}
            >
                <span style={{ fontSize: '1.5rem' }}>🧘</span>
                <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Jeg vet ikke helt...</p>
                    <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.85rem' }}>
                        Ta en rask kroppsskanning – la kroppen hjelpe deg å finne ut av det.
                    </p>
                </div>
            </button>

            <div className="step-actions">
                <button className="btn btn-secondary" onClick={onPrev}>← Tilbake</button>
                <button className="btn btn-primary" onClick={onNext} disabled={currentFeelings.length === 0}>
                    Neste →
                </button>
            </div>
        </div>
    );
}

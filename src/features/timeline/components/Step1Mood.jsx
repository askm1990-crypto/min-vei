export default function Step1Mood({ data, updateData, onNext, onCancel }) {
    const DAGSFORM = [
        { emoji: '😞', label: 'Veldig dårlig', val: 1 },
        { emoji: '😟', label: 'Ikke bra', val: 2 },
        { emoji: '😐', label: 'Helt ok', val: 3 },
        { emoji: '😊', label: 'Bra', val: 4 },
        { emoji: '😄', label: 'Toppen', val: 5 },
    ];

    const sugLabel = [
        'Intet sug', '', 'Svakt sug', '', '', 'Moderat sug', '', 'Sterkt sug', '', '', 'Svært sterkt sug'
    ];

    const sugColor = data.intensity === 0
        ? 'var(--text-muted)'
        : data.intensity <= 3
            ? 'var(--success)'
            : data.intensity <= 6
                ? 'var(--warning)'
                : 'var(--danger)';

    return (
        <div className="wizard-step view-enter">
            <h2 className="step-title">Innsjekk</h2>
            <p className="step-subtitle">Et øyeblikksbilde av hvordan du har det akkurat nå.</p>

            {/* Dagsform */}
            <div className="lw-card">
                <span className="lw-label">Dagsform</span>
                <div className="mood-selector">
                    {DAGSFORM.map(d => (
                        <button
                            key={d.val}
                            className={`mood-btn ${data.mood === d.val ? 'selected' : ''}`}
                            onClick={() => updateData({ mood: d.val })}
                            title={d.label}
                        >
                            <span className="mood-emoji">{d.emoji}</span>
                            <span className="mood-label">{d.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sugemåler */}
            <div className="lw-card">
                <span className="lw-label">Sugemåler akkurat nå</span>
                <p className="lw-hint">0 = Intet sug · 10 = Uutholdelig</p>
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={data.intensity || 0}
                    onChange={(e) => updateData({ intensity: parseInt(e.target.value, 10) || 0 })}
                    className="intensity-slider"
                />
                <div className="sug-value-display">
                    <span className="sug-number" style={{ color: sugColor }}>
                        {data.intensity || 0}
                    </span>
                    <span className="sug-divider"> / 10</span>
                </div>
                {sugLabel[data.intensity || 0] && (
                    <p className="sug-description">{sugLabel[data.intensity || 0]}</p>
                )}
            </div>

            <div className="step-actions">
                <button className="btn btn-secondary" onClick={onCancel}>
                    Avbryt
                </button>
                <button
                    className="btn btn-primary"
                    onClick={onNext}
                    disabled={!data.mood}
                >
                    Neste →
                </button>
            </div>
        </div>
    );
}

export default function Step6Summary({ data, onFinish, onPrev }) {
    const MOOD_LABELS = { 1: 'Veldig dårlig', 2: 'Ikke bra', 3: 'Helt ok', 4: 'Bra', 5: 'Toppen' };
    const MOOD_EMOJIS = { 1: '😞', 2: '😟', 3: '😐', 4: '😊', 5: '😄' };

    const allFeelings = data.feelings || [];
    const allTriggers = data.triggers || [];

    const outcomeIcon = data.outcome === 'resisted' ? '🌟' : data.outcome === 'used' ? '💙' : '⏳';
    const outcomeTitle = data.outcome === 'resisted'
        ? 'Lagret! Godt jobba.'
        : data.outcome === 'used'
            ? 'Lagret. Takk for ærligheten.'
            : 'Lagret. Hold ut!';

    return (
        <div className="wizard-step view-enter" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }}>{outcomeIcon}</div>
            <h2 className="step-title">{outcomeTitle}</h2>
            <p className="step-subtitle">Se over registreringen din før du lagrer.</p>

            <div className="summary-rows">
                {data.mood && (
                    <SummaryRow icon={MOOD_EMOJIS[data.mood]} label="Dagsform" val={MOOD_LABELS[data.mood]} />
                )}
                <SummaryRow icon="🎯" label="Sug" val={`${data.intensity || 0} / 10`} />
                {allFeelings.length > 0 && (
                    <SummaryRow icon="💭" label="Følelser" val={allFeelings.join(', ')} />
                )}
                {allTriggers.length > 0 && (
                    <SummaryRow icon="⚡" label="Triggere" val={allTriggers.join(', ')} />
                )}
                {data.strategies?.length > 0 && (
                    <SummaryRow icon="🛡️" label="Mestringsstrategier" val={data.strategies.join(', ')} />
                )}
                {data.substance && (
                    <SummaryRow icon="📝" label="Rusmidler" val={data.substance} />
                )}
                {data.amount && (
                    <SummaryRow icon="⚖️" label="Mengde" val={data.amount} />
                )}
                {data.title && (
                    <SummaryRow icon="✏️" label="Tittel" val={data.title} />
                )}
                {data.body && (
                    <SummaryRow icon="📖" label="Dagbok" val={data.body} />
                )}
                {data.gratitude && (
                    <SummaryRow icon="🌱" label="Takknemlighet" val={data.gratitude} />
                )}
            </div>

            <div className="step-actions">
                <button className="btn btn-secondary" onClick={onPrev}>← Tilbake</button>
                <button className="btn btn-primary btn-save" onClick={onFinish}>
                    Lagre Registrering ✨
                </button>
            </div>
        </div>
    );
}

function SummaryRow({ icon, label, val }) {
    return (
        <div className="summary-row">
            <span className="summary-row-icon">{icon}</span>
            <div className="summary-row-content">
                <span className="summary-row-label">{label}</span>
                <span className="summary-row-val">{val}</span>
            </div>
        </div>
    );
}

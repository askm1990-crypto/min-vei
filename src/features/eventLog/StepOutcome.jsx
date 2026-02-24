import Button from '../../components/ui/Button';

export default function StepOutcome({ data, updateData, onNext, onPrev }) {

    const handleSelect = (outcome) => {
        updateData({ outcome });
        onNext();
    };

    return (
        <div className="wizard-step">
            <h2 className="step__title">Hvordan gikk det?</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                <button
                    className={`option-btn ${data.outcome === 'resisted' ? 'selected' : ''}`}
                    onClick={() => handleSelect('resisted')}
                    style={{ padding: 'var(--space-4)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                >
                    <span style={{ fontSize: '2rem' }}>✅</span>
                    <div>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Jeg mestret det</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Suget gikk over uten at jeg brukte rusmidler. (+100 poeng)</span>
                    </div>
                </button>

                <button
                    className={`option-btn ${data.outcome === 'used' ? 'selected' : ''}`}
                    onClick={() => handleSelect('used')}
                    style={{ padding: 'var(--space-4)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                >
                    <span style={{ fontSize: '2rem' }}>❌</span>
                    <div>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Jeg ruset meg</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jeg ga etter for suget. (Det er greit å være ærlig)</span>
                    </div>
                </button>

                <button
                    className={`option-btn ${data.outcome === 'ongoing' ? 'selected' : ''}`}
                    onClick={() => handleSelect('ongoing')}
                    style={{ padding: 'var(--space-4)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                >
                    <span style={{ fontSize: '2rem' }}>⏳</span>
                    <div>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Det bygger seg opp...</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jeg kjenner på suget akkurat nå.</span>
                    </div>
                </button>
            </div>

            <div className="step-actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
            </div>
        </div>
    );
}

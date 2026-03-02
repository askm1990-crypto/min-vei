import Button from '../../components/ui/Button';

const SUBSTANCES = [
    { id: 'alcohol', icon: '🍺', label: 'Alkohol' },
    { id: 'cannabis', icon: '🌿', label: 'Cannabis' },
    { id: 'stimulants', icon: '⚡', label: 'Stimulanter', sub: '(Amfetamin, Kokain)' },
    { id: 'opioids', icon: '💊', label: 'Opioider', sub: '(Heroin, Piller)' },
    { id: 'sedatives', icon: '😴', label: 'Beroligende', sub: '(Benzo)' },
    { id: 'hallucinogens', icon: '🍄', label: 'Hallusinogener', sub: '(LSD, Fleinsopp)' },
    { id: 'ghb', icon: '💧', label: 'GHB/GBL' },
    { id: 'steroids', icon: '💪', label: 'Anabole steroider' },
    { id: 'other', icon: '❓', label: 'Annet' },
];

export default function StepSubstances({ data, updateData, onNext, onPrev }) {
    const toggle = (id) => {
        const current = data.substances;
        const updated = current.includes(id)
            ? current.filter(s => s !== id)
            : [...current, id];
        updateData({ substances: updated });
    };

    return (
        <div className="step">
            <h2 className="step__title">Hva er din hovedutfordring?</h2>
            <p className="step__subtitle">
                Velg de rusmidlene som er mest relevante for din tilfriskning.
            </p>

            <div className="selection-grid">
                {SUBSTANCES.map(s => (
                    <div
                        key={s.id}
                        className={`selection-card ${data.substances.includes(s.id) ? 'selected' : ''}`}
                        onClick={() => toggle(s.id)}
                    >
                        <span className="selection-card__icon">{s.icon}</span>
                        <span className="selection-card__label">{s.label}</span>
                        {s.sub && <span className="selection-card__sub">{s.sub}</span>}
                    </div>
                ))}
            </div>

            {data.substances.includes('other') && (
                <div className="form-group slide-down" style={{ marginTop: '1.5rem' }}>
                    <label htmlFor="custom-substance" className="form-label" style={{ fontWeight: '600' }}>
                        Spesifiser rusmiddel (valgfritt)
                    </label>
                    <input
                        id="custom-substance"
                        type="text"
                        className="text-input"
                        placeholder="Hva slags rusmiddel?"
                        value={data.customSubstance || ''}
                        onChange={(e) => updateData({ customSubstance: e.target.value })}
                        autoFocus
                    />
                </div>
            )}

            <div className="step__actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext} disabled={data.substances.length === 0}>
                    Neste
                </Button>
            </div>
        </div>
    );
}

import Button from '../../components/ui/Button';

const SUBSTANCES = [
    { id: 'alcohol', label: 'Alkohol' },
    { id: 'cannabis', label: 'Cannabis' },
    { id: 'stimulants', label: 'Stimulanter', sub: 'Amfetamin, kokain' },
    { id: 'opioids', label: 'Opioider', sub: 'Heroin, smertestillende' },
    { id: 'sedatives', label: 'Beroligende', sub: 'Benzodiazepiner' },
    { id: 'hallucinogens', label: 'Hallusinogener' },
    { id: 'ghb', label: 'GHB/GBL' },
    { id: 'steroids', label: 'Anabole steroider' },
    { id: 'other', label: 'Annet' },
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
            <span className="step__eyebrow">Steg 3 av 4</span>
            <h2 className="step__title">Hva vil du ha støtte til?</h2>
            <p className="step__subtitle">
                Velg det som er relevant, eller hopp over. Valgene brukes til å tilpasse registreringene dine.
            </p>

            <div className="selection-grid" aria-label="Områder du ønsker støtte til">
                {SUBSTANCES.map(s => (
                    <button
                        type="button"
                        key={s.id}
                        className={`selection-card ${data.substances.includes(s.id) ? 'selected' : ''}`}
                        onClick={() => toggle(s.id)}
                        aria-pressed={data.substances.includes(s.id)}
                    >
                        <span className="selection-card__label">{s.label}</span>
                        {s.sub && <span className="selection-card__sub">{s.sub}</span>}
                    </button>
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
                <Button variant="primary" onClick={onNext}>
                    {data.substances.length > 0 ? 'Fortsett' : 'Hopp over'}
                </Button>
            </div>
        </div>
    );
}

import Button from '../../components/ui/Button';

const FEELINGS = [
    { label: 'Sint', emoji: '😠' },
    { label: 'Frustrert', emoji: '😤' },
    { label: 'Trist', emoji: '😢' },
    { label: 'Ensom', emoji: '🥺' },
    { label: 'Redd / Engstelig', emoji: '😨' },
    { label: 'Trøtt / Sliten', emoji: '🥱' },
    { label: 'Stresset', emoji: '🤯' },
    { label: 'Skamfull', emoji: '😳' },
    { label: 'Sulten', emoji: '🤤' },
    { label: 'Rastløs', emoji: '🌪️' },
    { label: 'Likegyldig', emoji: '😐' },
    { label: 'Glad / Oppspilt', emoji: '🤩' }
];

export default function StepFeelings({ data, updateData, onNext, onPrev }) {

    const toggleFeeling = (feeling) => {
        const current = data.feelings || [];
        if (current.includes(feeling)) {
            updateData({ feelings: current.filter(f => f !== feeling) });
        } else {
            updateData({ feelings: [...current, feeling] });
        }
    };

    return (
        <div className="wizard-step">
            <h2 className="step__title">Hva kjente du på?</h2>
            <p className="step__subtitle">Velg følelsene som best beskriver hvordan du hadde det i opptakten til suget.</p>

            <div className="options-grid">
                {FEELINGS.map(f => (
                    <button
                        key={f.label}
                        className={`option-btn ${data.feelings.includes(f.label) ? 'selected' : ''}`}
                        onClick={() => toggleFeeling(f.label)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{f.emoji}</span>
                        <span>{f.label}</span>
                    </button>
                ))}
            </div>

            <div className="step-actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>
                    Neste
                </Button>
            </div>
        </div>
    );
}

import Button from '../../components/ui/Button';

const REASONS = [
    { id: 'numbing', label: 'For å dempe vonde følelser / flukt' },
    { id: 'social', label: 'For å fungere sosialt / tilhørighet' },
    { id: 'sleep', label: 'For å få sove / ro' },
    { id: 'euphoria', label: 'For opplevelsen av rus / spenning' },
    { id: 'habit', label: 'Vane / fysisk avhengighet' },
];

export default function StepReasons({ data, updateData, onNext, onPrev }) {
    const toggle = (id) => {
        const current = data.reasons;
        const updated = current.includes(id)
            ? current.filter(r => r !== id)
            : [...current, id];
        updateData({ reasons: updated });
    };

    return (
        <div className="step">
            <h2 className="step__title">Hvorfor ruser du deg?</h2>
            <p className="step__subtitle">
                Forstå funksjonen rusen har for deg. Velg det som passer best.
            </p>

            <div className="check-list">
                {REASONS.map(r => (
                    <div
                        key={r.id}
                        className={`check-item ${data.reasons.includes(r.id) ? 'selected' : ''}`}
                        onClick={() => toggle(r.id)}
                    >
                        <span className="check-item__check">
                            {data.reasons.includes(r.id) ? '✓' : ''}
                        </span>
                        <span>{r.label}</span>
                    </div>
                ))}
            </div>

            <div className="step__actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>Neste</Button>
            </div>
        </div>
    );
}

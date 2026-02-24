import { useState } from 'react';
import Button from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const TRIGGERS = [
    'Stress',
    'Tristhet',
    'Angst / Uro',
    'Sosialt press',
    'Vane / Rutine',
    'Kjedsomhet',
    'Fysisk ubehag',
    'Glede / Feiring',
    'Konflikt',
    'Tilgjengelighet'
];

export default function StepTriggers({ data, updateData, onNext, onPrev }) {
    const [customTriggers, setCustomTriggers] = useLocalStorage('mv2_custom_triggers', []);
    const [newTrigger, setNewTrigger] = useState('');

    const allTriggers = [...TRIGGERS, ...customTriggers];

    const toggleTrigger = (trigger) => {
        const current = data.triggers || [];
        if (current.includes(trigger)) {
            updateData({ triggers: current.filter(t => t !== trigger) });
        } else {
            updateData({ triggers: [...current, trigger] });
        }
    };

    const handleAddCustom = (e) => {
        e.preventDefault();
        const trimmed = newTrigger.trim();
        if (trimmed && !allTriggers.includes(trimmed)) {
            setCustomTriggers(prev => [...prev, trimmed]);
            toggleTrigger(trimmed);
            setNewTrigger('');
        } else if (allTriggers.includes(trimmed)) {
            if (!data.triggers?.includes(trimmed)) toggleTrigger(trimmed);
            setNewTrigger('');
        }
    };

    return (
        <div className="wizard-step">
            <h2 className="step__title">Hva utløste suget?</h2>
            <p className="step__subtitle">Velg en eller flere triggere som passer situasjonen.</p>

            <div className="options-grid" style={{ marginBottom: 'var(--space-4)' }}>
                {allTriggers.map(trigger => (
                    <button
                        key={trigger}
                        className={`option-btn ${data.triggers?.includes(trigger) ? 'selected' : ''}`}
                        onClick={() => toggleTrigger(trigger)}
                    >
                        {trigger}
                    </button>
                ))}
            </div>

            <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <input
                    type="text"
                    placeholder="Legg til egen trigger..."
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    style={{
                        flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text-main)',
                        fontSize: '1rem', fontFamily: 'inherit'
                    }}
                />
                <Button type="submit" variant="secondary" disabled={!newTrigger.trim()}>Legg til</Button>
            </form>

            <div className="step-actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>
                    Neste
                </Button>
            </div>
        </div>
    );
}

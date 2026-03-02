import { useState } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const INNER_TRIGGERS = [
    'Negative tanker', 'Fysisk ubehag', 'Sult eller tørste',
    'Søvnmangel', 'Trøtthet', 'Gode minner',
    'Kjedsomhet', 'Ensomhet', 'Selvkritikk', 'Uro uten grunn',
];

const OUTER_TRIGGERS = [
    'Konflikt med noen', 'Økonomi eller stress', 'Kjente steder eller miljøer',
    'Helg eller fritid', 'Sosiale situasjoner', 'Familie eller nære relasjoner',
    'Jobb eller skole', 'Nyheter eller sosiale medier',
];

export default function Step3Triggers({ data, updateData, onNext, onPrev }) {
    const [savedCustomInner, setSavedCustomInner] = useLocalStorage('mv2_custom_inner_triggers', []);
    const [savedCustomOuter, setSavedCustomOuter] = useLocalStorage('mv2_custom_outer_triggers', []);
    const [newInner, setNewInner] = useState('');
    const [newOuter, setNewOuter] = useState('');

    // We store everything in the flat `triggers` array for backward compatibility
    const currentTriggers = data.triggers || [];

    const toggleTrigger = (t) => {
        const updated = currentTriggers.includes(t)
            ? currentTriggers.filter(x => x !== t)
            : [...currentTriggers, t];
        updateData({ triggers: updated });
    };

    const addCustomInner = (e) => {
        e.preventDefault();
        const cleaned = newInner.trim();
        if (cleaned && !savedCustomInner.includes(cleaned)) {
            setSavedCustomInner([...savedCustomInner, cleaned]);
        }
        if (cleaned && !currentTriggers.includes(cleaned)) {
            toggleTrigger(cleaned);
        }
        setNewInner('');
    };

    const addCustomOuter = (e) => {
        e.preventDefault();
        const cleaned = newOuter.trim();
        if (cleaned && !savedCustomOuter.includes(cleaned)) {
            setSavedCustomOuter([...savedCustomOuter, cleaned]);
        }
        if (cleaned && !currentTriggers.includes(cleaned)) {
            toggleTrigger(cleaned);
        }
        setNewOuter('');
    };

    const allInner = [...INNER_TRIGGERS, ...savedCustomInner];
    const allOuter = [...OUTER_TRIGGERS, ...savedCustomOuter];

    return (
        <div className="wizard-step view-enter">
            <h2 className="step-title">Hva trigger suget?</h2>
            <p className="step-subtitle">Velg alt som passer. Egne triggere huskes til neste gang.</p>

            {/* Inner triggers */}
            <span className="lw-section-label">Indre triggere — Ting inni meg</span>
            <div className="lw-chip-grid">
                {allInner.map(t => (
                    <button
                        key={t}
                        className={`lw-chip ${currentTriggers.includes(t) ? 'lw-chip-selected' : ''}`}
                        onClick={() => toggleTrigger(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <form onSubmit={addCustomInner} className="lw-custom-input">
                <input
                    type="text"
                    placeholder="Legg til egen indre trigger..."
                    value={newInner}
                    onChange={(e) => setNewInner(e.target.value)}
                    className="text-input"
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={!newInner.trim()}>
                    Legg til
                </button>
            </form>

            <hr className="lw-divider" />

            {/* Outer triggers */}
            <span className="lw-section-label">Ytre triggere — Ting rundt meg</span>
            <div className="lw-chip-grid">
                {allOuter.map(t => (
                    <button
                        key={t}
                        className={`lw-chip ${currentTriggers.includes(t) ? 'lw-chip-selected' : ''}`}
                        onClick={() => toggleTrigger(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <form onSubmit={addCustomOuter} className="lw-custom-input">
                <input
                    type="text"
                    placeholder="Legg til egen ytre trigger..."
                    value={newOuter}
                    onChange={(e) => setNewOuter(e.target.value)}
                    className="text-input"
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={!newOuter.trim()}>
                    Legg til
                </button>
            </form>

            <p className="lw-hint-center">Ingen triggere akkurat nå? Trykk «Neste» for å hoppe over.</p>

            <div className="step-actions">
                <button className="btn btn-secondary" onClick={onPrev}>← Tilbake</button>
                <button className="btn btn-primary" onClick={onNext}>Neste →</button>
            </div>
        </div>
    );
}

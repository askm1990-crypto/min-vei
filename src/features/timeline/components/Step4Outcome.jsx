import { useState } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const MASTERY_STRATEGIES = [
    'Tok noen dype pust', 'Gikk en tur', 'Ringte noen jeg stoler på',
    'Hørte på musikk', 'Drakk vann eller spiste noe', 'Distraherte meg selv',
    'Beveget kroppen', 'Tok en pause og hvile', 'Ventet til det gikk over',
    'Skrev eller tegnet', 'Var ute i naturen', 'Brukte et verktøy eller en øvelse',
];

const SUBSTANCES = [
    'Alkohol', 'Cannabis / Hasj', 'Amfetamin', 'Kokain',
    'Heroin / Opioider', 'Benzodiazepiner', 'MDMA / Ecstasy',
    'GHB / GBL', 'Snus / Nikotin', 'Syntetiske stoffer', 'Smertestillende',
];

const AMOUNTS = ['Svært lite', 'Litt', 'En del', 'Mye', 'Vet ikke'];

export default function Step4Outcome({ data, updateData, onNext, onPrev }) {
    const [savedCustomSubstances, setSavedCustomSubstances] = useLocalStorage('mv2_custom_substances', []);
    const [savedCustomStrategies, setSavedCustomStrategies] = useLocalStorage('mv2_custom_strategies', []);
    const [showCustomSubstance, setShowCustomSubstance] = useState(false);
    const [newStrategy, setNewStrategy] = useState('');
    const [newSubstance, setNewSubstance] = useState('');

    // Use the app's existing field names: outcome, strategies, substance, amount
    const currentStrategies = data.strategies || [];
    const currentSubstances = data._substances || []; // internal tracking array

    const toggleStrategy = (s) => {
        const updated = currentStrategies.includes(s)
            ? currentStrategies.filter(x => x !== s)
            : [...currentStrategies, s];
        updateData({ strategies: updated });
    };

    const toggleSubstance = (s) => {
        const updated = currentSubstances.includes(s)
            ? currentSubstances.filter(x => x !== s)
            : [...currentSubstances, s];
        // Store as internal array and also as flat string for backward compat
        updateData({
            _substances: updated,
            substance: updated.join(', ')
        });
    };

    const setOutcome = (val) => {
        // Map prototype values to our app values
        const mapping = { mestret: 'resisted', pagaar: 'ongoing', sprekk: 'used' };
        updateData({ outcome: mapping[val] || val });
    };

    const addCustomStrategy = (e) => {
        e.preventDefault();
        const cleaned = newStrategy.trim();
        if (cleaned && !savedCustomStrategies.includes(cleaned)) {
            setSavedCustomStrategies([...savedCustomStrategies, cleaned]);
        }
        if (cleaned && !currentStrategies.includes(cleaned)) {
            toggleStrategy(cleaned);
        }
        setNewStrategy('');
    };

    const addCustomSubstance = () => {
        const cleaned = newSubstance.trim();
        if (cleaned && !savedCustomSubstances.includes(cleaned)) {
            setSavedCustomSubstances([...savedCustomSubstances, cleaned]);
        }
        if (cleaned && !currentSubstances.includes(cleaned)) {
            toggleSubstance(cleaned);
        }
        setNewSubstance('');
        setShowCustomSubstance(false);
    };

    const allSubstances = [...SUBSTANCES, ...savedCustomSubstances];
    const allStrategies = [...MASTERY_STRATEGIES, ...savedCustomStrategies];

    const canNext = () => {
        if (!data.outcome) return false;
        if (data.outcome === 'used') return currentSubstances.length > 0 && data.amount;
        if (data.outcome === 'resisted' || data.outcome === 'ongoing') return currentStrategies.length > 0;
        return true;
    };

    return (
        <div className="wizard-step view-enter">
            <h2 className="step-title">Utfall & Mestring</h2>
            <p className="step-subtitle">Hva skjedde med suget? Ærlighet er alltid det riktige valget.</p>

            {/* Outcome cards */}
            <div className="outcome-selectors">
                <button
                    className={`outcome-card ${data.outcome === 'resisted' ? 'selected success' : ''}`}
                    onClick={() => setOutcome('mestret')}
                >
                    <span className="outcome-emoji">✅</span>
                    <div className="outcome-card-text">
                        <span className="outcome-title">Jeg mestret det!</span>
                        <span className="outcome-desc">Suget er over eller under kontroll uten bruk av rusmidler.</span>
                    </div>
                    {data.outcome === 'resisted' && <span className="outcome-check">✓</span>}
                </button>

                <button
                    className={`outcome-card ${data.outcome === 'ongoing' ? 'selected warning' : ''}`}
                    onClick={() => setOutcome('pagaar')}
                >
                    <span className="outcome-emoji">⏳</span>
                    <div className="outcome-card-text">
                        <span className="outcome-title">Det pågår fortsatt</span>
                        <span className="outcome-desc">Jeg kjemper fortsatt mot suget akkurat nå.</span>
                    </div>
                    {data.outcome === 'ongoing' && <span className="outcome-check">✓</span>}
                </button>

                <button
                    className={`outcome-card ${data.outcome === 'used' ? 'selected danger' : ''}`}
                    onClick={() => setOutcome('sprekk')}
                >
                    <span className="outcome-emoji">💔</span>
                    <div className="outcome-card-text">
                        <span className="outcome-title">Det ble en sprekk</span>
                        <span className="outcome-desc">Jeg ga etter for suget og brukte rusmidler.</span>
                    </div>
                    {data.outcome === 'used' && <span className="outcome-check">✓</span>}
                </button>
            </div>

            {/* Mastery strategies */}
            {(data.outcome === 'resisted' || data.outcome === 'ongoing') && (
                <div className="outcome-followup">
                    <hr className="lw-divider" />
                    <p className="outcome-followup-title">
                        {data.outcome === 'resisted' ? '🌟 Hva hjalp deg?' : '💪 Hva gjør du for å hjelpe deg selv?'}
                    </p>
                    <p className="outcome-followup-desc">
                        Velg ett eller flere – dette er viktig lærdom om hva som fungerer for deg.
                    </p>
                    <div className="lw-chip-grid">
                        {allStrategies.map(s => (
                            <button
                                key={s}
                                className={`lw-chip ${currentStrategies.includes(s) ? 'lw-chip-selected' : ''}`}
                                onClick={() => toggleStrategy(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={addCustomStrategy} className="lw-custom-input">
                        <input
                            type="text"
                            placeholder="Legg til egen mestringsstrategi..."
                            value={newStrategy}
                            onChange={(e) => setNewStrategy(e.target.value)}
                            className="text-input"
                        />
                        <button type="submit" className="btn btn-primary btn-sm" disabled={!newStrategy.trim()}>
                            Legg til
                        </button>
                    </form>

                    {currentStrategies.length > 0 && (
                        <div className="lw-card lw-card-highlight">
                            <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 var(--space-1)' }}>
                                {data.outcome === 'resisted' ? '💪 Godt jobba!' : '💙 Du gjør det du kan'}
                            </p>
                            <p className="lw-hint">{currentStrategies.join(' · ')}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Relapse details */}
            {data.outcome === 'used' && (
                <div className="outcome-followup">
                    <hr className="lw-divider" />
                    <div className="lw-card" style={{ background: 'rgba(var(--danger-rgb), 0.05)', borderColor: 'rgba(var(--danger-rgb), 0.2)' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 var(--space-1)' }}>
                            💙 Takk for at du er ærlig
                        </p>
                        <p className="lw-hint">
                            Det krever mot. La oss registrere hva som skjedde – det hjelper oss forstå mønsteret bedre.
                        </p>
                    </div>

                    <p style={{ fontWeight: 700, margin: 'var(--space-4) 0 var(--space-2)' }}>Hva ble brukt?</p>
                    <div className="lw-chip-grid">
                        {allSubstances.map(s => (
                            <button
                                key={s}
                                className={`lw-chip ${currentSubstances.includes(s) ? 'lw-chip-selected' : ''}`}
                                onClick={() => toggleSubstance(s)}
                            >
                                {s}
                            </button>
                        ))}
                        <button
                            className={`lw-chip ${showCustomSubstance ? 'lw-chip-selected' : ''}`}
                            onClick={() => setShowCustomSubstance(v => !v)}
                        >
                            Annet ＋
                        </button>
                    </div>
                    {showCustomSubstance && (
                        <div className="lw-custom-input">
                            <input
                                type="text"
                                placeholder="Skriv rusmiddel (lagres til neste gang)..."
                                value={newSubstance}
                                onChange={(e) => setNewSubstance(e.target.value)}
                                className="text-input"
                            />
                            <button
                                className="btn btn-primary btn-sm"
                                disabled={!newSubstance.trim()}
                                onClick={addCustomSubstance}
                            >
                                Legg til
                            </button>
                        </div>
                    )}

                    <p style={{ fontWeight: 700, margin: 'var(--space-5) 0 var(--space-2)' }}>Omtrentlig mengde</p>
                    <div className="lw-chip-grid">
                        {AMOUNTS.map(a => (
                            <button
                                key={a}
                                className={`lw-chip ${data.amount === a ? 'lw-chip-selected' : ''}`}
                                onClick={() => updateData({ amount: a })}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="step-actions">
                <button className="btn btn-secondary" onClick={onPrev}>← Tilbake</button>
                <button className="btn btn-primary" onClick={onNext} disabled={!canNext()}>
                    Neste →
                </button>
            </div>
        </div>
    );
}

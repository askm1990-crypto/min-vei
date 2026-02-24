import { useState } from 'react';
import Button from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const STRATEGIES = [
    'Forsinket valget (Ventet 15 min)',
    'Avledet meg selv',
    'Snakket med noen',
    'Fysisk aktivitet / Gikk en tur',
    'Pusteøvelse',
    'Påminnet meg selv om målet',
    'Forlot situasjonen'
];

export default function StepDetails({ data, updateData, onNext, onPrev }) {
    const [user] = useLocalStorage('mv2_user', null);
    const [customStrategies, setCustomStrategies] = useLocalStorage('mv2_custom_strategies', []);
    const [newStrategy, setNewStrategy] = useState('');

    const allStrategies = [...STRATEGIES, ...customStrategies];

    const toggleStrategy = (strat) => {
        const current = data.strategies || [];
        if (current.includes(strat)) {
            updateData({ strategies: current.filter(s => s !== strat) });
        } else {
            updateData({ strategies: [...current, strat] });
        }
    };

    const handleAddCustom = (e) => {
        e.preventDefault();
        const trimmed = newStrategy.trim();
        if (trimmed && !allStrategies.includes(trimmed)) {
            setCustomStrategies(prev => [...prev, trimmed]);
            toggleStrategy(trimmed);
            setNewStrategy('');
        } else if (allStrategies.includes(trimmed)) {
            if (!data.strategies?.includes(trimmed)) toggleStrategy(trimmed);
            setNewStrategy('');
        }
    };

    // User's mapped substances or fallback list
    const SUBSTANCES = user?.substances?.length > 0 ? user.substances : [
        'Alkohol', 'Cannabis', 'Stimulanter (Kokain/Amfetamin)', 'Opioider', 'Beroligende', 'Annet'
    ];

    if (data.outcome === 'ongoing') {
        return (
            <div className="wizard-step">
                <h2 className="step__title">Pust med magen</h2>
                <p className="step__subtitle" style={{ marginBottom: 'var(--space-6)' }}>
                    Det er beintøft å stå i det, men husk at sug er som en bølge. Den bygger seg opp, men den <strong>vil</strong> trekke seg tilbake.
                </p>

                <div style={{ textAlign: 'center', fontSize: '4rem', margin: 'var(--space-6) 0' }}>🌊</div>

                <div className="step-actions">
                    <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                    <Button variant="primary" onClick={onNext}>
                        Neste
                    </Button>
                </div>
            </div>
        );
    }

    if (data.outcome === 'resisted') {
        return (
            <div className="wizard-step">
                <h2 className="step__title">Hva fungerte for deg?</h2>
                <p className="step__subtitle">Hvilken strategi brukte du for å mestre suget?</p>

                <div className="options-grid" style={{ gridTemplateColumns: '1fr', marginBottom: 'var(--space-4)' }}>
                    {allStrategies.map(strat => (
                        <button
                            key={strat}
                            className={`option-btn ${data.strategies?.includes(strat) ? 'selected' : ''}`}
                            onClick={() => toggleStrategy(strat)}
                            style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)' }}
                        >
                            {strat}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                    <input
                        type="text"
                        placeholder="Legg til egen strategi..."
                        value={newStrategy}
                        onChange={(e) => setNewStrategy(e.target.value)}
                        style={{
                            flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text-main)',
                            fontSize: '1rem', fontFamily: 'inherit'
                        }}
                    />
                    <Button type="submit" variant="secondary" disabled={!newStrategy.trim()}>Legg til</Button>
                </form>

                <div className="step-actions">
                    <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                    <Button variant="primary" onClick={onNext} disabled={!data.strategies || data.strategies.length === 0}>
                        Neste
                    </Button>
                </div>
            </div>
        );
    }

    // Default: 'used'
    return (
        <div className="wizard-step">
            <h2 className="step__title">Hva ble brukt?</h2>

            <div style={{ marginBottom: 'var(--space-6)' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Hvilket rusmiddel?</label>
                <select
                    value={data.substance}
                    onChange={(e) => updateData({ substance: e.target.value })}
                    style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        width: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        background: 'var(--bg-body)',
                        color: 'var(--text-main)',
                        marginBottom: 'var(--space-4)'
                    }}
                >
                    <option value="">Velg fra listen...</option>
                    {SUBSTANCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <label className="input-label" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Omtrentlig mengde (valgfritt)</label>
                <input
                    type="text"
                    placeholder="F.eks. 3 øl, 1 joint..."
                    value={data.amount || ''}
                    onChange={(e) => updateData({ amount: e.target.value })}
                    className="input-field"
                    style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        width: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        background: 'var(--bg-body)',
                        color: 'var(--text-main)'
                    }}
                />
            </div>

            <div className="step-actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext} disabled={!data.substance}>
                    Neste
                </Button>
            </div>
        </div>
    );
}

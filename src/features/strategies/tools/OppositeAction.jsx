import { useState } from 'react';
import Button from '../../../components/ui/Button';

const EXAMPLES = [
    { impulse: 'Trekke seg unna', opposite: 'Ta kontakt med noen, ta en telefon', emoji: '📞' },
    { impulse: 'Bli i sengen', opposite: 'Stå opp, kle på deg, gå ut', emoji: '🚶' },
    { impulse: 'Ruse seg', opposite: 'Gjør en pusteøvelse eller ring noen', emoji: '🌬️' },
    { impulse: 'Skjelle ut noen', opposite: 'Vær rolig, bruk \"jeg føler\"-setninger', emoji: '💬' },
    { impulse: 'Gi opp', opposite: 'Gjør én liten ting som beveger deg fremover', emoji: '🪜' },
];

export default function OppositeAction({ onComplete }) {
    const [step, setStep] = useState('intro'); // 'intro' | 'identify' | 'opposite' | 'done'
    const [myImpulse, setMyImpulse] = useState('');
    const [myOpposite, setMyOpposite] = useState('');

    const inputStyle = {
        padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)', width: '100%', fontSize: '1rem',
        fontFamily: 'inherit', background: 'var(--bg-body)', color: 'var(--text-main)'
    };

    return (
        <div className="tool-container">
            <h2>🔄 Motstatt handling</h2>

            {step === 'intro' && (
                <>
                    <p>Når en følelse fører til en uheldig impuls, gjør det stikk motsatte. Her er noen eksempler:</p>
                    <div className="steps-list">
                        {EXAMPLES.map((e, i) => (
                            <div key={i} className="step-item">
                                <span style={{ fontSize: '1.3rem' }}>{e.emoji}</span>
                                <div className="step-text">
                                    <strong>Impuls: {e.impulse}</strong>
                                    <span>Motsatt: {e.opposite}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" onClick={() => setStep('identify')}>Prøv selv →</Button>
                </>
            )}

            {step === 'identify' && (
                <>
                    <p>Hva er impulsen din akkurat nå?</p>
                    <input style={inputStyle} placeholder="F.eks. «Jeg vil bare ligge i sengen»" value={myImpulse} onChange={e => setMyImpulse(e.target.value)} />
                    <Button variant="primary" onClick={() => setStep('opposite')} disabled={!myImpulse.trim()}>Neste →</Button>
                </>
            )}

            {step === 'opposite' && (
                <>
                    <p>Hva er det <strong>stikk motsatte</strong> du kan gjøre?</p>
                    <div style={{ background: 'var(--bg-body)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: '100%', maxWidth: 400 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Din impuls:</span>
                        <p style={{ margin: 0, fontWeight: 600 }}>"{myImpulse}"</p>
                    </div>
                    <input style={inputStyle} placeholder="Hva er det motsatte?" value={myOpposite} onChange={e => setMyOpposite(e.target.value)} />
                    <Button variant="primary" onClick={() => setStep('done')} disabled={!myOpposite.trim()}>
                        Gjør det! 💪
                    </Button>
                </>
            )}

            {step === 'done' && (
                <>
                    <div style={{ fontSize: '3rem' }}>💪</div>
                    <h3>Fantastisk!</h3>
                    <p>Du valgte å gjøre: <strong>"{myOpposite}"</strong> i stedet for "{myImpulse}". Det er motstatt handling i praksis!</p>
                    <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
                </>
            )}
        </div>
    );
}

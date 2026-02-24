import { useState } from 'react';
import Button from '../../../components/ui/Button';

const DEAR_MAN_STEPS = [
    { letter: 'D', title: 'Describe', norwegian: 'Beskriv', emoji: '📋', prompt: 'Beskriv situasjonen objektivt, med bare fakta. Unngå tolkninger og dommer.', placeholder: 'F.eks. «Da du sa X i går, så...»' },
    { letter: 'E', title: 'Express', norwegian: 'Uttrykk', emoji: '💬', prompt: 'Uttrykk dine følelser med «jeg føler»-setninger. Vær ærlig men respektfull.', placeholder: '«Jeg føler meg ... når ...»' },
    { letter: 'A', title: 'Assert', norwegian: 'Vær tydelig', emoji: '🎯', prompt: 'Vær spesifikk om hva du ønsker eller trenger. Be om det direkte.', placeholder: '«Jeg ønsker at ... / Kan du ...»' },
    { letter: 'R', title: 'Reinforce', norwegian: 'Forsterk', emoji: '🎁', prompt: 'Forklar den positive konsekvensen av at personen sier ja. Hva får de ut av det?', placeholder: '«Da ville jeg føle meg ... og vi kunne ...»' },
    { letter: 'M', title: 'Mindful', norwegian: 'Vær oppmerksom', emoji: '🧘', prompt: 'Hold fokus på målet ditt. Ikke la deg avlede av gamle argumenter eller angrep. Gjenta om nødvendig.', placeholder: '' },
    { letter: 'A', title: 'Appear confident', norwegian: 'Utstrål selvtillit', emoji: '💎', prompt: 'Hold øyekontakt, snakk tydelig, stå oppreist. Selv om du er nervøs — late som til du klarer det.', placeholder: '' },
    { letter: 'N', title: 'Negotiate', norwegian: 'Forhandl', emoji: '🤝', prompt: 'Vær villig til å gi og ta. Spør: «Hva fungerer for deg?» Finn en løsning som fungerer for begge.', placeholder: '' },
];

export default function DEARMAN({ onComplete }) {
    const [step, setStep] = useState(0);
    const [notes, setNotes] = useState({});
    const done = step >= DEAR_MAN_STEPS.length;
    const current = DEAR_MAN_STEPS[step];

    const inputStyle = {
        padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)', width: '100%', fontSize: '1rem',
        fontFamily: 'inherit', background: 'var(--bg-body)', color: 'var(--text-main)'
    };

    return (
        <div className="tool-container">
            <h2>🗣️ DEAR MAN</h2>
            <p>En DBT-teknikk for å kommunisere dine behov tydelig og respektfullt.</p>

            {!done ? (
                <>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {DEAR_MAN_STEPS.map((s, i) => (
                            <span key={i} style={{
                                width: 32, height: 32, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.85rem', fontWeight: 700,
                                background: i === step ? 'var(--primary)' : i < step ? 'hsl(150,60%,50%)' : 'var(--bg-body)',
                                color: i <= step ? 'white' : 'var(--text-muted)',
                                border: '1px solid var(--border)'
                            }}>
                                {i < step ? '✓' : s.letter}
                            </span>
                        ))}
                    </div>

                    <div style={{ fontSize: '2.5rem' }}>{current.emoji}</div>
                    <h3>{current.letter} — {current.title} ({current.norwegian})</h3>
                    <p style={{ maxWidth: 450 }}>{current.prompt}</p>

                    {current.placeholder && (
                        <textarea
                            style={{ ...inputStyle, resize: 'vertical' }}
                            rows={3}
                            placeholder={current.placeholder}
                            value={notes[step] || ''}
                            onChange={e => setNotes(prev => ({ ...prev, [step]: e.target.value }))}
                        />
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        {step > 0 && <Button variant="secondary" onClick={() => setStep(p => p - 1)}>← Tilbake</Button>}
                        <Button variant="primary" onClick={() => setStep(p => p + 1)}>
                            {step < DEAR_MAN_STEPS.length - 1 ? 'Neste →' : 'Fullfør'}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ fontSize: '3rem' }}>🎉</div>
                    <h3>DEAR MAN ferdig!</h3>
                    <p>Du har gått gjennom alle stegene. Neste gang du trenger å kommunisere et behov, bruk denne strukturen.</p>
                    <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
                </>
            )}
        </div>
    );
}

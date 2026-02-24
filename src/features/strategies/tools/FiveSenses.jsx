import { useState } from 'react';
import Button from '../../../components/ui/Button';

const SENSES = [
    { sense: 'Syn', emoji: '👀', prompt: 'Hva kan du SE akkurat nå som er vakkert, rolig eller behagelig? Kanskje et bilde, lyset, farger?' },
    { sense: 'Hørsel', emoji: '🎵', prompt: 'Hva kan du HØRE som er behagelig? Sett på favorittmusikk, lytt til fugler, eller nyt stillheten.' },
    { sense: 'Lukt', emoji: '🌸', prompt: 'Hva kan du LUKTE som er godt? Tenn et stearinlys, lukk på kaffe, eller gå ut i frisk luft.' },
    { sense: 'Smak', emoji: '🍵', prompt: 'Hva kan du SMAKE på som er behagelig? Lag en kopp te, spis en bit sjokolade, smak sakte og bevisst.' },
    { sense: 'Berøring', emoji: '🧸', prompt: 'Hva kan du TA PÅ som kjennes godt? Et mykt pledd, varmt vann, strekk kroppen din.' },
];

export default function FiveSenses({ onComplete }) {
    const [step, setStep] = useState(0);
    const done = step >= SENSES.length;
    const current = SENSES[step];

    return (
        <div className="tool-container">
            <h2>🛁 Selvberoligende med 5 sanser</h2>
            <p>Bruk én sans om gangen for å finne ro og komfort i øyeblikket.</p>

            {!done ? (
                <>
                    <div style={{ fontSize: '3rem' }}>{current.emoji}</div>
                    <h3>{current.sense}</h3>
                    <p style={{ maxWidth: '450px' }}>{current.prompt}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sans {step + 1} av {SENSES.length}</p>
                    <Button variant="primary" onClick={() => setStep(p => p + 1)}>Neste sans →</Button>
                </>
            ) : (
                <>
                    <div style={{ fontSize: '3rem' }}>✨</div>
                    <h3>Alle 5 sanser aktivert</h3>
                    <p>Du har brukt alle 5 sansene til å berolige deg selv. Legg merke til hvordan kroppen føles nå.</p>
                    <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
                </>
            )}
        </div>
    );
}

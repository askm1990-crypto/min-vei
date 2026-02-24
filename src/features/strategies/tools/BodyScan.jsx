import { useState } from 'react';
import Button from '../../../components/ui/Button';

const BODY_PARTS = [
    { area: 'Føttene', instruction: 'Legg merke til føttene dine mot gulvet. Kjenner du varme, kulde, press? Bare observer.' },
    { area: 'Leggene', instruction: 'Flytt oppmerksomheten til leggene. Er det spenning? Slipp den løs med hvert utpust.' },
    { area: 'Lårene & hoftene', instruction: 'Kjenner du vekten av kroppen der du sitter? La muskler slappe av.' },
    { area: 'Magen', instruction: 'Legg merke til magen som beveger seg med pusten. Pust rolig og dypt.' },
    { area: 'Brystet', instruction: 'Kjenner du hjertet slå? Bare observer hjerterytmen uten å endre noe.' },
    { area: 'Hendene', instruction: 'Åpne og lukk hendene sakte. Kjenner du fingrene? La dem hvile mykt.' },
    { area: 'Skuldrene', instruction: 'Trekk skuldrene opp mot ørene, hold 3 sekunder, slipp dem ned. Kjenner du forskjellen.' },
    { area: 'Ansiktet', instruction: 'Slapp av i kjeven, pannen, rundt øynene. La alle muskler i ansiktet hvile.' },
    { area: 'Hele kroppen', instruction: 'Kjenner du hele kroppen nå som en helhet. Du er her. Du er trygg. Pust.' },
];

export default function BodyScan({ onComplete }) {
    const [step, setStep] = useState(0);
    const done = step >= BODY_PARTS.length;
    const current = BODY_PARTS[step];

    return (
        <div className="tool-container">
            <h2>🧘 Kroppsskanning</h2>
            {!done ? (
                <>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Del {step + 1} av {BODY_PARTS.length}
                    </p>
                    <div style={{ fontSize: '3rem', margin: 'var(--space-4) 0' }}>
                        {['🦶', '🦵', '🦴', '💨', '💓', '🤲', '💪', '😌', '🙏'][step]}
                    </div>
                    <h3 style={{ fontSize: '1.2rem' }}>{current.area}</h3>
                    <p style={{ maxWidth: '450px', lineHeight: 1.7 }}>{current.instruction}</p>
                    <Button variant="primary" onClick={() => setStep(prev => prev + 1)}>
                        {step < BODY_PARTS.length - 1 ? 'Neste område →' : 'Fullfør skanning'}
                    </Button>
                </>
            ) : (
                <>
                    <div style={{ fontSize: '4rem' }}>✨</div>
                    <h3>Ferdig! Godt jobbet.</h3>
                    <p>Du har skannet hele kroppen din. Legg merke til hvordan du føler deg nå sammenlignet med da du startet.</p>
                    <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
                </>
            )}
        </div>
    );
}

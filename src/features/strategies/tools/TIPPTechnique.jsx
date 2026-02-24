import { useState } from 'react';
import Button from '../../../components/ui/Button';

const TIPP_STEPS = [
    { letter: 'T', title: 'Temperatur', emoji: '🧊', instruction: 'Hold noe kaldt mot ansiktet (ispose, kaldt vann) i 30 sekunder. Dette aktiverer dykkerrefleksen og senker hjerterytmen raskt.' },
    { letter: 'I', title: 'Intens trening', emoji: '🏃', instruction: 'Gjør noe fysisk intenst i 5-10 minutter: hopp, løp på stedet, ta armhevinger, gå raskt. Brenn opp stresshormoner.' },
    { letter: 'P', title: 'Paced breathing', emoji: '🌬️', instruction: 'Pust ut saktere enn du puster inn. F.eks. pust inn i 4 sekunder, ut i 8 sekunder. Gjenta i 2-3 minutter.' },
    { letter: 'P', title: 'Paired muscle relaxation', emoji: '💪', instruction: 'Spenn en muskelgruppe (f.eks. hendene) HARDT i 5 sekunder mens du puster inn. Slipp helt løs mens du puster ut. Gjenta med ulike muskelgrupper.' },
];

export default function TIPPTechnique({ onComplete }) {
    const [step, setStep] = useState(0);
    const done = step >= TIPP_STEPS.length;

    return (
        <div className="tool-container">
            <h2>🧊 TIPP-teknikken</h2>
            <p>Fire raske teknikker for å roe ned kroppen når følelsene er overveldende.</p>

            <div className="steps-list">
                {TIPP_STEPS.map((s, i) => (
                    <div key={i} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                        <span className="step-number">{i < step ? '✓' : s.letter}</span>
                        <div className="step-text">
                            <strong>{s.emoji} {s.title}</strong>
                            <span>{s.instruction}</span>
                        </div>
                    </div>
                ))}
            </div>

            {!done ? (
                <Button variant="primary" onClick={() => setStep(p => p + 1)}>
                    {step === 0 ? 'Start med T' : 'Ferdig, neste →'}
                </Button>
            ) : (
                <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
            )}
        </div>
    );
}

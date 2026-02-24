import { useState } from 'react';
import Button from '../../../components/ui/Button';

const STEPS = [
    { sense: 'Se', count: 5, emoji: '👀', prompt: 'Nevn 5 ting du kan SE rundt deg akkurat nå.' },
    { sense: 'Høre', count: 4, emoji: '👂', prompt: 'Nevn 4 ting du kan HØRE akkurat nå.' },
    { sense: 'Føle', count: 3, emoji: '✋', prompt: 'Nevn 3 ting du kan FØLE/TA PÅ akkurat nå.' },
    { sense: 'Lukte', count: 2, emoji: '👃', prompt: 'Nevn 2 ting du kan LUKTE akkurat nå.' },
    { sense: 'Smake', count: 1, emoji: '👅', prompt: 'Nevn 1 ting du kan SMAKE akkurat nå.' },
];

export default function Grounding({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const done = currentStep >= STEPS.length;

    return (
        <div className="tool-container">
            <h2>⚓ 5-4-3-2-1 Grounding</h2>
            <p>Bruk sansene dine for å forankre deg i øyeblikket. Denne øvelsen hjelper deg ut av angst og tilbake til nåtid.</p>

            <div className="steps-list">
                {STEPS.map((step, i) => (
                    <div key={i} className={`step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}>
                        <span className="step-number">{i < currentStep ? '✓' : step.count}</span>
                        <div className="step-text">
                            <strong>{step.emoji} {step.sense}</strong>
                            <span>{step.prompt}</span>
                        </div>
                    </div>
                ))}
            </div>

            {!done ? (
                <Button variant="primary" onClick={() => setCurrentStep(prev => prev + 1)}>
                    {currentStep === 0 ? 'Start' : `Neste (${STEPS[currentStep]?.sense})`}
                </Button>
            ) : (
                <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
            )}
        </div>
    );
}

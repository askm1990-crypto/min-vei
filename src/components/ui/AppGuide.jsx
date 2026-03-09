import { useState } from 'react';
import Button from '../../components/ui/Button';
import './AppGuide.css';

const GUIDE_STEPS = [
    {
        title: 'Velkommen til Min Vei! 👋',
        text: 'La oss ta en rask tur gjennom appen, slik at du vet hvor alt er.',
        icon: '🏠',
        highlight: 'dashboard'
    },
    {
        title: 'Dagbok 📝',
        text: 'Her registrerer du hendelser, sug, mestringsteknikker, eller bare tanker i dagboken. Alt samlet på ett sted! Du tjener poeng for hver registrering.',
        icon: '📝',
        highlight: 'timeline'
    },
    {
        title: 'Mål 🎯',
        text: 'Sett SMART-mål for deg selv. Fullfør dem for å tjene bonuspoeng og se fremgang.',
        icon: '🎯',
        highlight: 'goals'
    },
    {
        title: 'Mestringsverktøy 🧘',
        text: 'Pusteøvelser, grounding-teknikker og andre verktøy du kan bruke i vanskelige øyeblikk.',
        icon: '🧘',
        highlight: 'strategies'
    },
    {
        title: 'Krisehjelp 🛡️',
        text: 'Fyll ut sikkerhetsplanen din. Den gir deg tilgang til viktige kontakter og strategier i krisesituasjoner.',
        icon: '🛡️',
        highlight: 'crisis'
    },
    {
        title: 'Innsikt 💡',
        text: 'Se mønstre i dine egne data: triggere, humørtrend, mestringsgrad og badges – alt samlet på Innsikt-siden. Jo mer du logger, jo tydeligere blir mønstrene.',
        icon: '💡',
        highlight: 'progress'
    },
    {
        title: 'Du er klar! 🚀',
        text: 'Nå vet du det viktigste. Start med å registrere din første hendelse på tidslinjen. Lykke til!',
        icon: '🚀',
        highlight: 'dashboard'
    },
];

export default function AppGuide({ onComplete, onNavigateHighlight }) {
    const [currentStep, setCurrentStep] = useState(0);

    const step = GUIDE_STEPS[currentStep];
    const isLast = currentStep === GUIDE_STEPS.length - 1;

    const handleNext = () => {
        if (isLast) {
            onComplete();
        } else {
            const nextStep = GUIDE_STEPS[currentStep + 1];
            if (nextStep.highlight && onNavigateHighlight) {
                onNavigateHighlight(nextStep.highlight);
            }
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    return (
        <div className="app-guide-overlay">
            <div className="app-guide-card">
                <div className="app-guide-progress">
                    {GUIDE_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`app-guide-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}
                        />
                    ))}
                </div>
                <span className="app-guide-icon">{step.icon}</span>
                <h3 className="app-guide-title">{step.title}</h3>
                <p className="app-guide-text">{step.text}</p>
                <div className="app-guide-actions">
                    {!isLast && (
                        <button className="app-guide-skip" onClick={handleSkip}>
                            Hopp over
                        </button>
                    )}
                    <Button variant="primary" onClick={handleNext}>
                        {isLast ? 'Start appen! 🚀' : 'Neste →'}
                    </Button>
                </div>
                <span className="app-guide-counter">{currentStep + 1} / {GUIDE_STEPS.length}</span>
            </div>
        </div>
    );
}

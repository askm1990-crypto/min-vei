import { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';

const PHASES = [
    { label: 'Pust inn', duration: 4000 },
    { label: 'Hold', duration: 7000 },
    { label: 'Pust ut', duration: 8000 },
];

export default function BreathingExercise({ onComplete }) {
    const [isRunning, setIsRunning] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [round, setRound] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const totalRounds = 4;
    const timerRef = useRef(null);

    useEffect(() => {
        if (!isRunning) return;

        const phase = PHASES[phaseIndex];
        // TotalSecs is now set when phaseIndex changes, avoiding synchronous setState in effect.


        const countdownInterval = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        timerRef.current = setTimeout(() => {
            const nextPhase = (phaseIndex + 1) % PHASES.length;
            if (nextPhase === 0) {
                const nextRound = round + 1;
                if (nextRound >= totalRounds) {
                    setIsRunning(false);
                    clearInterval(countdownInterval);
                    return;
                }
                setRound(nextRound);
            }
            const nextPhaseData = PHASES[nextPhase];
            setCountdown(Math.ceil(nextPhaseData.duration / 1000));
            setPhaseIndex(nextPhase);
        }, phase.duration);

        return () => {
            clearTimeout(timerRef.current);
            clearInterval(countdownInterval);
        };
    }, [isRunning, phaseIndex, round]);

    const phaseClass = isRunning ? ['inhale', 'hold', 'exhale'][phaseIndex] : '';
    const done = !isRunning && round >= totalRounds;

    return (
        <div className="tool-container">
            <h2>🌬️ 4-7-8 Pusteøvelse</h2>
            <p>Pust inn i 4 sek, hold i 7, og pust ut i 8. Denne teknikken aktiverer det parasympatiske nervesystemet og reduserer stress.</p>

            <div className={`breathing-circle ${phaseClass}`}>
                {isRunning ? (
                    <div style={{ textAlign: 'center' }}>
                        <div>{PHASES[phaseIndex].label}</div>
                        <div style={{ fontSize: '2rem' }}>{countdown}</div>
                    </div>
                ) : done ? '✅' : 'Start'}
            </div>

            {isRunning && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Runde {round + 1} av {totalRounds}
                </p>
            )}

            {!isRunning && !done && (
                <Button variant="primary" onClick={() => {
                    setIsRunning(true);
                    setRound(0);
                    setPhaseIndex(0);
                    setCountdown(Math.ceil(PHASES[0].duration / 1000));
                }}>
                    Start øvelsen
                </Button>
            )}

            {done && (
                <Button variant="primary" onClick={onComplete}>
                    Fullfør ✓
                </Button>
            )}
        </div>
    );
}

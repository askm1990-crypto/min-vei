import { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';

export default function CravingTimer({ onComplete }) {
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(15 * 60); // 15 min
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isRunning) return;
        intervalRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const done = seconds === 0;
    const progress = ((15 * 60 - seconds) / (15 * 60)) * 100;

    return (
        <div className="tool-container">
            <h2>⏱️ Sug-timer</h2>
            <p>De fleste sug varer 10-20 minutter. Hold ut — bølgen VIL passere.</p>

            <div style={{ position: 'relative', width: 200, height: 200 }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <div className="timer-display">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</div>
                </div>
            </div>

            <p className="timer-label">{done ? '🎉 Du klarte det!' : isRunning ? '🌊 Bølgen passerer...' : 'Klar?'}</p>

            {!isRunning && !done && (
                <Button variant="primary" onClick={() => setIsRunning(true)}>Start nedtelling</Button>
            )}
            {isRunning && (
                <Button variant="secondary" onClick={() => { setIsRunning(false); clearInterval(intervalRef.current); }}>Pause</Button>
            )}
            {done && <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>}
        </div>
    );
}

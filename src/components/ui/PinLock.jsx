import { useState, useRef, useEffect } from 'react';
import './PinLock.css';

export default function PinLock({ onUnlock }) {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError('');

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        // Check PIN when all 4 digits are entered
        if (index === 3 && value) {
            const enteredPin = newPin.join('');
            const storedPin = localStorage.getItem('mv2_pin');
            if (enteredPin === storedPin) {
                onUnlock();
            } else {
                setError('Feil kode. Prøv igjen.');
                setShake(true);
                setTimeout(() => {
                    setPin(['', '', '', '']);
                    setShake(false);
                    inputRefs[0].current?.focus();
                }, 600);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div className="pin-lock-overlay">
            <div className={`pin-lock-card ${shake ? 'shake' : ''}`}>
                <div className="pin-lock-icon">🔒</div>
                <h2 className="pin-lock-title">Min Vei</h2>
                <p className="pin-lock-subtitle">Tast inn din 4-sifrede kode</p>
                <div className="pin-lock-inputs">
                    {pin.map((digit, i) => (
                        <input
                            key={i}
                            ref={inputRefs[i]}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="pin-lock-digit"
                            autoComplete="off"
                        />
                    ))}
                </div>
                {error && <p className="pin-lock-error">{error}</p>}
            </div>
        </div>
    );
}

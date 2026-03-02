import { useState, useRef, useEffect } from 'react';
import './PinLock.css';

export default function PinLock({ onUnlock }) {
    const inputRefs = useRef([]);
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError('');

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
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
                    inputRefs.current[0]?.focus();
                }, 600);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
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
                            ref={el => inputRefs.current[i] = el}
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

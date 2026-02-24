import { useState } from 'react';
import Button from '../../../components/ui/Button';

const PLEASE_ITEMS = [
    { id: 'illness', emoji: '🏥', title: 'PhysicaL illness', desc: 'Har du tatt vare på fysisk helse? Medisiner, legetime, smerter?' },
    { id: 'eating', emoji: '🥗', title: 'Eating balanced', desc: 'Har du spist regelmessig og balansert i dag? Ikke for mye eller for lite.' },
    { id: 'avoid', emoji: '🚫', title: 'Avoid substances', desc: 'Har du unngått rusmidler og/eller andre substanser som påvirker humøret?' },
    { id: 'sleep', emoji: '😴', title: 'Sleep balanced', desc: 'Fikk du nok søvn i natt? (7-9 timer) Har du en god rutine for leggetid?' },
    { id: 'exercise', emoji: '🏃', title: 'Exercise', desc: 'Har du vært fysisk aktiv i dag? Selv en kort tur teller.' },
];

export default function PLEASESkills({ onComplete }) {
    const [checked, setChecked] = useState({});

    const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    const checkedCount = Object.values(checked).filter(Boolean).length;

    return (
        <div className="tool-container">
            <h2>💊 PLEASE-ferdigheter</h2>
            <p>Reduser sårbarhet for negative følelser ved å ta vare på grunnleggende behov. Kryss av det du har gjort i dag.</p>

            <div className="checklist">
                {PLEASE_ITEMS.map(item => (
                    <div
                        key={item.id}
                        className={`checklist-item ${checked[item.id] ? 'checked' : ''}`}
                        onClick={() => toggle(item.id)}
                    >
                        <span className="check-icon">{checked[item.id] ? '✓' : ''}</span>
                        <div className="step-text">
                            <strong>{item.emoji} {item.title}</strong>
                            <span>{item.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {checkedCount}/{PLEASE_ITEMS.length} fullført
            </p>

            <Button variant="primary" onClick={onComplete}>
                Fullfør ✓
            </Button>
        </div>
    );
}

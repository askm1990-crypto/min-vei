import { useState } from 'react';
import Button from '../../../components/ui/Button';

const ACTIVITIES = [
    '🚶 Gå en rask tur rundt blokken',
    '🎵 Sett på din yndlingsmusikk og dans!',
    '🧊 Hold en isbit i hånden og fokuser på følelsen',
    '📱 Ring eller send melding til en venn',
    '🧹 Rydd et rom — fysisk rydding = mental rydding',
    '🎮 Spill et spill i 15 minutter',
    '📖 Les en artikkel eller et kapittel i en bok',
    '🎨 Tegn eller doodle noe — det trenger ikke være pent',
    '🧩 Løs en kryssord, sudoku eller puslespill',
    '🍵 Lag en kopp te og drikk den sakte og bevisst',
    '🌳 Gå ut og finn 3 forskjellige planter eller trær',
    '📝 Skriv et kort dagbokinnlegg om akkurat nå',
    '🤸 Gjør 10 jumping jacks eller strekkøvelser',
    '📸 Ta et bilde av noe vakkert rundt deg',
    '🎧 Hør på en podcast eller en meditasjon',
    '🛁 Ta en varm dusj eller vask ansiktet med kaldt vann',
];

export default function Distraction({ onComplete }) {
    const [activity, setActivity] = useState(null);

    const getRandomActivity = () => {
        const filtered = ACTIVITIES.filter(a => a !== activity);
        const idx = Math.floor(Math.random() * filtered.length);
        setActivity(filtered[idx]);
    };

    return (
        <div className="tool-container">
            <h2>🔀 Distraksjon</h2>
            <p>Noen ganger trenger du bare å gjøre noe helt annet. Trykk på knappen for et tilfeldig forslag!</p>

            {activity ? (
                <>
                    <div style={{
                        fontSize: '1.3rem', fontWeight: 600, padding: 'var(--space-5)',
                        background: 'var(--bg-body)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', maxWidth: 400, lineHeight: 1.6,
                        textAlign: 'center'
                    }}>
                        {activity}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Button variant="secondary" onClick={getRandomActivity}>🔀 Nytt forslag</Button>
                        <Button variant="primary" onClick={onComplete}>Gjort! ✓</Button>
                    </div>
                </>
            ) : (
                <Button variant="primary" onClick={getRandomActivity}>
                    🎲 Gi meg en aktivitet!
                </Button>
            )}
        </div>
    );
}

import { useState } from 'react';
import Button from '../../../components/ui/Button';

export default function ProsCons({ onComplete }) {
    const [pros, setPros] = useState([]);
    const [cons, setCons] = useState([]);
    const [proInput, setProInput] = useState('');
    const [conInput, setConInput] = useState('');

    const addPro = (e) => { e.preventDefault(); if (proInput.trim()) { setPros(p => [...p, proInput.trim()]); setProInput(''); } };
    const addCon = (e) => { e.preventDefault(); if (conInput.trim()) { setCons(p => [...p, conInput.trim()]); setConInput(''); } };

    return (
        <div className="tool-container">
            <h2>⚖️ Pros & Cons</h2>
            <p>Skriv ned fordeler og ulemper med å gi etter for impulsen akkurat nå. Ofte hjelper det å se det svart på hvitt.</p>

            <div className="proscons-grid">
                <div className="proscons-col">
                    <h3>✅ Fordeler med å motstå</h3>
                    <div className="proscons-items">
                        {pros.map((p, i) => <div key={i} className="pc-item">{p}</div>)}
                    </div>
                    <form className="proscons-input" onSubmit={addPro}>
                        <input placeholder="Legg til..." value={proInput} onChange={e => setProInput(e.target.value)} />
                        <Button type="submit" variant="secondary" disabled={!proInput.trim()}>+</Button>
                    </form>
                </div>
                <div className="proscons-col">
                    <h3>❌ Ulemper med å gi etter</h3>
                    <div className="proscons-items">
                        {cons.map((c, i) => <div key={i} className="pc-item">{c}</div>)}
                    </div>
                    <form className="proscons-input" onSubmit={addCon}>
                        <input placeholder="Legg til..." value={conInput} onChange={e => setConInput(e.target.value)} />
                        <Button type="submit" variant="secondary" disabled={!conInput.trim()}>+</Button>
                    </form>
                </div>
            </div>

            {(pros.length > 0 || cons.length > 0) && (
                <Button variant="primary" onClick={onComplete}>Fullfør ✓</Button>
            )}
        </div>
    );
}

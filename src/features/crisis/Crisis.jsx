import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import './Crisis.css';

const EMERGENCY_NUMBERS = [
    { name: 'Nødnummer (akutt livsfare)', number: '113', emoji: '🚑', priority: true },
    { name: 'Legevakten', number: '116 117', emoji: '🏥', priority: true },
    { name: 'Mental Helse Hjelpetelefonen', number: '116 123', emoji: '💬', priority: true },
    { name: 'Kirkens SOS', number: '22 40 00 40', emoji: '🙏', priority: false },
    { name: 'Rustelefonen', number: '08588', emoji: '📞', priority: false },
    { name: 'Alarmtelefonen for barn og unge', number: '116 111', emoji: '👧', priority: false },
];

export default function Crisis({ onNavigate }) {
    const { addPoints } = useRecoveryScore();
    const [safetyPlan, setSafetyPlan] = useLocalStorage('mv2_safety_plan', {
        warnings: '',
        copingStrategies: '',
        supportPeople: '',
        professionalContacts: '',
        safeEnvironment: '',
        reasonsToLive: ''
    });
    const [planCompleted, setPlanCompleted] = useLocalStorage('mv2_safety_plan_completed', false);
    const [editing, setEditing] = useState(false);

    const handleSave = () => {
        setEditing(false);
        const fieldsFilledCount = Object.values(safetyPlan).filter(v => v.trim()).length;
        if (fieldsFilledCount >= 4 && !planCompleted) {
            setPlanCompleted(true);
            addPoints(500, 'Fullførte sikkerhetsplanen');
            showToast('Sikkerhetsplan lagret! +500 poeng 🛡️ Du er nå Kriseklar!', 'success');
        } else {
            showToast('Sikkerhetsplan oppdatert ✓', 'success');
        }
    };

    const updateField = (field, value) => {
        setSafetyPlan(prev => ({ ...prev, [field]: value }));
    };

    const fieldStyle = {
        width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '0.9rem',
        background: 'var(--bg-body)', color: 'var(--text-main)', resize: 'vertical'
    };

    return (
        <div className="crisis-page">
            {/* HEADER */}
            <div className="crisis-hero">
                <h2>🆘 Krisehjelp</h2>
                <p>Du er ikke alene. Hjelp er tilgjengelig, alltid.</p>
            </div>

            {/* EMERGENCY NUMBERS */}
            <Card header="Nødnumre" hoverable={false} className="emergency-card">
                <div className="emergency-list">
                    {EMERGENCY_NUMBERS.map(num => (
                        <a
                            key={num.number}
                            href={`tel:${num.number.replace(/\s/g, '')}`}
                            className={`emergency-item ${num.priority ? 'priority' : ''}`}
                        >
                            <span className="emergency-emoji">{num.emoji}</span>
                            <div className="emergency-info">
                                <strong>{num.name}</strong>
                                <span className="emergency-number">{num.number}</span>
                            </div>
                            <span className="emergency-call">📞 Ring</span>
                        </a>
                    ))}
                </div>
            </Card>

            {/* QUICK TOOLS */}
            <Card header="Rask hjelp — Bruk et verktøy nå" hoverable={false}>
                <div className="quick-tools">
                    <button className="quick-tool" onClick={() => onNavigate('strategies')}>
                        <span>🌬️</span> Pusteøvelse
                    </button>
                    <button className="quick-tool" onClick={() => onNavigate('strategies')}>
                        <span>⚓</span> Grounding
                    </button>
                    <button className="quick-tool" onClick={() => onNavigate('strategies')}>
                        <span>⏱️</span> Sug-timer
                    </button>
                    <button className="quick-tool" onClick={() => onNavigate('strategies')}>
                        <span>🧊</span> TIPP-teknikk
                    </button>
                </div>
            </Card>

            {/* SAFETY PLAN */}
            <Card
                header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>🛡️ Min Sikkerhetsplan {planCompleted && '✅'}</span>
                        {!editing && (
                            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                                ✏️ Rediger
                            </Button>
                        )}
                    </div>
                }
                hoverable={false}
                className="safety-plan-card"
            >
                {!editing ? (
                    <div className="safety-plan-view">
                        {Object.values(safetyPlan).every(v => !v.trim()) ? (
                            <div className="empty-state">
                                <span className="empty-icon">🛡️</span>
                                <h3>Du har ikke fylt ut sikkerhetsplanen ennå</h3>
                                <p>En sikkerhetsplan hjelper deg å vite hva du skal gjøre i vanskelige øyeblikk. Tjen <strong>+500 poeng</strong> ved å fylle den ut!</p>
                                <Button variant="primary" onClick={() => setEditing(true)}>Start nå</Button>
                            </div>
                        ) : (
                            <div className="safety-fields-view">
                                {safetyPlan.warnings && (
                                    <div className="sp-field"><strong>⚠️ Varselsignaler:</strong><p>{safetyPlan.warnings}</p></div>
                                )}
                                {safetyPlan.copingStrategies && (
                                    <div className="sp-field"><strong>🛠️ Mestringsstrategier:</strong><p>{safetyPlan.copingStrategies}</p></div>
                                )}
                                {safetyPlan.supportPeople && (
                                    <div className="sp-field"><strong>👥 Støttepersoner:</strong><p>{safetyPlan.supportPeople}</p></div>
                                )}
                                {safetyPlan.professionalContacts && (
                                    <div className="sp-field"><strong>🏥 Profesjonelle kontakter:</strong><p>{safetyPlan.professionalContacts}</p></div>
                                )}
                                {safetyPlan.safeEnvironment && (
                                    <div className="sp-field"><strong>🏠 Trygt miljø:</strong><p>{safetyPlan.safeEnvironment}</p></div>
                                )}
                                {safetyPlan.reasonsToLive && (
                                    <div className="sp-field"><strong>❤️ Grunner til å holde ut:</strong><p>{safetyPlan.reasonsToLive}</p></div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="safety-plan-edit">
                        <div className="sp-edit-field">
                            <label>⚠️ Varselsignaler — Hva merker du når det begynner å bli vanskelig?</label>
                            <textarea style={fieldStyle} rows={2} value={safetyPlan.warnings}
                                onChange={e => updateField('warnings', e.target.value)}
                                placeholder="F.eks. uro i magen, dårlig søvn, isolerer meg..." />
                        </div>
                        <div className="sp-edit-field">
                            <label>🛠️ Mestringsstrategier — Hva kan du gjøre selv?</label>
                            <textarea style={fieldStyle} rows={2} value={safetyPlan.copingStrategies}
                                onChange={e => updateField('copingStrategies', e.target.value)}
                                placeholder="F.eks. gå en tur, gjøre pusteøvelse, skrive i dagboken..." />
                        </div>
                        <div className="sp-edit-field">
                            <label>👥 Støttepersoner — Hvem kan du kontakte?</label>
                            <textarea style={fieldStyle} rows={2} value={safetyPlan.supportPeople}
                                onChange={e => updateField('supportPeople', e.target.value)}
                                placeholder="Navn og telefonnummer til noen du stoler på..." />
                        </div>
                        <div className="sp-edit-field">
                            <label>🏥 Profesjonelle kontakter — Behandler, lege, NAV?</label>
                            <textarea style={fieldStyle} rows={2} value={safetyPlan.professionalContacts}
                                onChange={e => updateField('professionalContacts', e.target.value)}
                                placeholder="Navn, nummer, tidspunkt de er tilgjengelige..." />
                        </div>
                        <div className="sp-edit-field">
                            <label>🏠 Trygt miljø — Hva gjør at du føler deg trygg?</label>
                            <textarea style={fieldStyle} rows={2} value={safetyPlan.safeEnvironment}
                                onChange={e => updateField('safeEnvironment', e.target.value)}
                                placeholder="F.eks. fjerne tilgang til substanser, unngå visse steder..." />
                        </div>
                        <div className="sp-edit-field">
                            <label>❤️ Grunner til å holde ut — Hva er viktig for deg?</label>
                            <textarea style={fieldStyle} rows={2} value={safetyPlan.reasonsToLive}
                                onChange={e => updateField('reasonsToLive', e.target.value)}
                                placeholder="F.eks. barna mine, fremtiden min, helsen min..." />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={() => setEditing(false)}>Avbryt</Button>
                            <Button variant="primary" onClick={handleSave}>Lagre plan</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* DISCLAIMER */}
            <div className="crisis-disclaimer">
                <p>
                    <strong>⚠️ Viktig:</strong> Min Vei er et selvhjelpsverktøy og erstatter <strong>ikke</strong> profesjonell medisinsk behandling, terapi eller rådgivning.
                    Ved akutt livsfare, ring alltid <strong>113</strong>.
                    Informasjonen i denne appen er ment som støtte og kan ikke brukes som grunnlag for medisinske beslutninger.
                </p>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useRecoveryScore, POINTS } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/ToastUtils';
import { LIFE_AREAS } from '../../data/challenges';
import Button from '../../components/ui/Button';
import './Goals.css';

export default function GoalWizard({ onClose }) {
    const { addGoal } = useGoals();
    const { addPoints } = useRecoveryScore();
    const [step, setStep] = useState(1);

    const [goalData, setGoalData] = useState({
        lifeArea: null,
        description: '',
        specific: '',
        measurable: '',
        timeframe: 'short', // short | medium | long
        deadline: '',
    });

    const update = (field, value) => setGoalData(prev => ({ ...prev, [field]: value }));

    const selectedArea = LIFE_AREAS.find(a => a.id === goalData.lifeArea);

    const handleSave = () => {
        addGoal({
            ...goalData,
            lifeAreaLabel: selectedArea?.label,
            lifeAreaEmoji: selectedArea?.emoji,
        });
        addPoints(POINTS.GOAL_SET, 'Satte et nytt mål');
        showToast(`Mål lagret! +${POINTS.GOAL_SET} poeng 🎯`, 'success');
        setTimeout(() => onClose(), 100);
    };

    return (
        <div className="goal-wizard view-enter">
            <div className="editor-header">
                <h2>Nytt Mål</h2>
                <button className="wizard-back-btn" onClick={onClose}>✕ Avbryt</button>
            </div>

            <div className="editor-card">
                {/* Progress */}
                <div className="wizard-progress">
                    <div className="wizard-progress-bar">
                        <div className="wizard-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
                    </div>
                    <div className="wizard-step-counter">Steg {step} av 4</div>
                </div>

                {/* Step 1: Life Area */}
                {step === 1 && (
                    <div className="wizard-step">
                        <h3 className="step__title">Hvilket livsområde er viktigst for deg nå?</h3>
                        <p className="step__subtitle">Velg den verdien du vil jobbe med.</p>

                        <div className="life-area-grid">
                            {LIFE_AREAS.map(area => (
                                <button
                                    key={area.id}
                                    className={`life-area-btn ${goalData.lifeArea === area.id ? 'selected' : ''}`}
                                    onClick={() => update('lifeArea', area.id)}
                                >
                                    <span className="la-emoji">{area.emoji}</span>
                                    <span className="la-label">{area.label}</span>
                                    <span className="la-desc">{area.desc}</span>
                                </button>
                            ))}
                        </div>

                        <div className="step-actions">
                            <Button variant="primary" onClick={() => setStep(2)} disabled={!goalData.lifeArea}>
                                Neste
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: What do you want to achieve? */}
                {step === 2 && (
                    <div className="wizard-step">
                        <h3 className="step__title">{selectedArea?.emoji} {selectedArea?.label}</h3>
                        <p className="step__subtitle">Hva betyr dette livsområdet for deg? Hva vil du oppnå?</p>

                        <textarea
                            placeholder="F.eks. «Jeg vil bli sterkere fysisk og ha mer energi i hverdagen» eller «Jeg vil gjenoppbygge tilliten til familien min»..."
                            value={goalData.description}
                            onChange={(e) => update('description', e.target.value)}
                            rows={5}
                            style={{
                                padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)', width: '100%', fontSize: '1rem',
                                fontFamily: 'inherit', background: 'var(--bg-body)', color: 'var(--text-main)',
                                resize: 'vertical'
                            }}
                        />

                        <div className="step-actions">
                            <Button variant="secondary" onClick={() => setStep(1)}>Tilbake</Button>
                            <Button variant="primary" onClick={() => setStep(3)} disabled={!goalData.description.trim()}>
                                Neste
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: SMART Check */}
                {step === 3 && (
                    <div className="wizard-step">
                        <h3 className="step__title">La oss gjøre målet SMART</h3>
                        <p className="step__subtitle">Spesifikt, målbart, realistisk og tidsbegrenset.</p>

                        <div className="smart-fields">
                            <div className="smart-field">
                                <label>🎯 Spesifikt — Hva konkret skal du gjøre?</label>
                                <input
                                    type="text"
                                    placeholder="F.eks. «Trene styrke 3 ganger i uken»"
                                    value={goalData.specific}
                                    onChange={(e) => update('specific', e.target.value)}
                                />
                            </div>

                            <div className="smart-field">
                                <label>📏 Målbart — Hvordan vet du at du har klart det?</label>
                                <input
                                    type="text"
                                    placeholder="F.eks. «Når jeg har trent 12 ganger på en måned»"
                                    value={goalData.measurable}
                                    onChange={(e) => update('measurable', e.target.value)}
                                />
                            </div>

                            <div className="smart-field">
                                <label>⏱️ Tidsramme</label>
                                <div className="timeframe-btns">
                                    {[
                                        { id: 'short', label: 'Kort (1-2 uker)' },
                                        { id: 'medium', label: 'Mellom (1-3 mnd)' },
                                        { id: 'long', label: 'Lang (3+ mnd)' }
                                    ].map(tf => (
                                        <button
                                            key={tf.id}
                                            className={`option-btn ${goalData.timeframe === tf.id ? 'selected' : ''}`}
                                            onClick={() => update('timeframe', tf.id)}
                                        >
                                            {tf.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="smart-field">
                                <label>📅 Frist (valgfritt)</label>
                                <input
                                    type="date"
                                    value={goalData.deadline}
                                    onChange={(e) => update('deadline', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="step-actions">
                            <Button variant="secondary" onClick={() => setStep(2)}>Tilbake</Button>
                            <Button variant="primary" onClick={() => setStep(4)} disabled={!goalData.specific.trim()}>
                                Neste
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Summary */}
                {step === 4 && (
                    <div className="wizard-step">
                        <h3 className="step__title">Ditt mål er klart! 🎉</h3>

                        <div className="goal-summary-card">
                            <div className="goal-summary-header">
                                <span className="goal-summary-emoji">{selectedArea?.emoji}</span>
                                <div>
                                    <strong>{selectedArea?.label}</strong>
                                    <p>{goalData.description}</p>
                                </div>
                            </div>

                            <div className="goal-summary-details">
                                <div className="summary-row">
                                    <span className="summary-label">🎯 Konkret:</span>
                                    <span>{goalData.specific}</span>
                                </div>
                                {goalData.measurable && (
                                    <div className="summary-row">
                                        <span className="summary-label">📏 Mål:</span>
                                        <span>{goalData.measurable}</span>
                                    </div>
                                )}
                                <div className="summary-row">
                                    <span className="summary-label">⏱️ Tidsramme:</span>
                                    <span>{goalData.timeframe === 'short' ? '1-2 uker' : goalData.timeframe === 'medium' ? '1-3 måneder' : '3+ måneder'}</span>
                                </div>
                                {goalData.deadline && (
                                    <div className="summary-row">
                                        <span className="summary-label">📅 Frist:</span>
                                        <span>{new Date(goalData.deadline).toLocaleDateString('nb-NO')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Du tjener <strong style={{ color: 'var(--primary)' }}>+{POINTS.GOAL_SET} poeng</strong> for å sette et nytt mål!
                        </p>

                        <div className="step-actions">
                            <Button variant="secondary" onClick={() => setStep(3)}>Tilbake</Button>
                            <Button variant="primary" onClick={handleSave}>
                                Lagre mål 🎯
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

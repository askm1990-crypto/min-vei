import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/ToastUtils';
import MODULES from '../../data/modules.json';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './Knowledge.css';

// ─────────────────────────────────────────────
//  Status helpers
// ─────────────────────────────────────────────
function getStatus(moduleId, progress) {
    return progress[moduleId] || 'not-started';
}

function isUnlocked(module, progress) {
    if (!module.requiredPreviousModule) return true;
    return progress[module.requiredPreviousModule] === 'completed';
}

function statusLabel(status, locked) {
    if (locked) return { emoji: '🔒', text: 'Låst', cls: 'status--locked' };
    if (status === 'completed') return { emoji: '✅', text: 'Fullført', cls: 'status--completed' };
    if (status === 'in-progress') return { emoji: '🔄', text: 'Pågår', cls: 'status--progress' };
    return { emoji: '⏳', text: 'Ikke startet', cls: 'status--pending' };
}

// ─────────────────────────────────────────────
//  Article view
// ─────────────────────────────────────────────
function ModuleArticle({ module, onBack, onComplete, isCompleted }) {
    return (
        <div className="module-article view-enter">
            {/* Header */}
            <div className="module-article__header">
                <button className="wizard-back-btn" onClick={onBack}>← Tilbake</button>
                <span className="module-article__num">Modul {MODULES.indexOf(module) + 1}</span>
            </div>

            {/* Hero */}
            <div className="module-article__hero">
                <span className="module-article__icon">{module.icon}</span>
                <h1 className="module-article__title">{module.title}</h1>
                <p className="module-article__summary">{module.summary}</p>
            </div>

            {/* Core message callout */}
            <div className="module-callout">
                <span className="module-callout__label">Kjernebeskjed</span>
                <p className="module-callout__text">{module.content.coreMessage}</p>
            </div>

            {/* What this means for you */}
            <section className="module-section">
                <h2 className="module-section__heading">
                    <span role="img" aria-label="deg">💬</span> Hva betyr dette for deg?
                </h2>
                <div className="module-paragraphs">
                    {module.content.whatThisMeansForYou.map((para, i) => (
                        <p key={i} className="module-para">{para}</p>
                    ))}
                </div>
            </section>

            {/* Actionable advice */}
            <section className="module-section">
                <h2 className="module-section__heading">
                    <span role="img" aria-label="råd">💡</span> Konkrete råd til deg
                </h2>
                <ol className="advice-list">
                    {module.content.actionableAdvice.map((tip, i) => (
                        <li key={i} className="advice-list__item">
                            <span className="advice-list__num">{i + 1}</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {/* App integrations */}
            {module.content.appIntegrations?.length > 0 && (
                <section className="module-section">
                    <h2 className="module-section__heading">
                        <span role="img" aria-label="app">📱</span> Bruk appen aktivt
                    </h2>
                    <div className="integration-chips">
                        {module.content.appIntegrations.map((item, i) => (
                            <div key={i} className="integration-chip">
                                <strong className="integration-chip__feature">{item.feature}</strong>
                                <span className="integration-chip__desc">{item.description}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Complete button */}
            <div className="module-article__footer">
                {isCompleted ? (
                    <div className="completed-banner">
                        ✅ Du har fullført denne modulen – bra jobba!
                    </div>
                ) : (
                    <Button variant="primary" wide onClick={onComplete}>
                        ✅ Marker som fullført
                    </Button>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  Main Knowledge component
// ─────────────────────────────────────────────
export default function Knowledge() {
    const { addPoints } = useRecoveryScore();
    const [progress, setProgress] = useLocalStorage('mv2_module_progress', {});
    const [selected, setSelected] = useState(null);

    const completedCount = Object.values(progress).filter(v => v === 'completed').length;

    const handleOpen = (module) => {
        const unlocked = isUnlocked(module, progress);
        if (!unlocked) return;

        // Mark as in-progress if not yet started
        if (!progress[module.id]) {
            setProgress(prev => ({ ...prev, [module.id]: 'in-progress' }));
        }
        setSelected(module);
    };

    const handleComplete = () => {
        if (!selected) return;
        setProgress(prev => ({ ...prev, [selected.id]: 'completed' }));
        addPoints(50, `Fullførte ${selected.title}`);
        showToast(`🎉 +50 poeng! ${selected.title} fullfort!`, 'success');
        setSelected(null);
    };

    // Show article view
    if (selected) {
        return (
            <ModuleArticle
                module={selected}
                onBack={() => setSelected(null)}
                onComplete={handleComplete}
                isCompleted={progress[selected.id] === 'completed'}
            />
        );
    }

    // Show module list
    return (
        <div className="fagbibliotek-page">
            {/* Page header */}
            <div className="fagbibliotek-header">
                <h2 className="fagbibliotek-title">Fagbibliotek</h2>
                <p className="fagbibliotek-subtitle">
                    Din personlige læringsreise gjennom fem kliniske moduler.
                </p>
            </div>

            {/* Progress bar */}
            <div className="progress-track">
                <div className="progress-track__labels">
                    <span>{completedCount} av {MODULES.length} moduler fullfort</span>
                    <span className="progress-track__pct">{Math.round((completedCount / MODULES.length) * 100)}%</span>
                </div>
                <div className="progress-track__bar">
                    <div
                        className="progress-track__fill"
                        style={{ width: `${(completedCount / MODULES.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Module cards */}
            <div className="module-grid">
                {MODULES.map((module, idx) => {
                    const status = getStatus(module.id, progress);
                    const locked = !isUnlocked(module, progress);
                    const sLabel = statusLabel(status, locked);

                    return (
                        <Card
                            key={module.id}
                            className={`module-card ${locked ? 'module-card--locked' : ''} ${status === 'completed' ? 'module-card--completed' : ''}`}
                            hoverable={!locked}
                            onClick={() => handleOpen(module)}
                        >
                            {/* Card top row */}
                            <div className="module-card__top">
                                <div className="module-card__num-icon">
                                    <span className="module-card__num">Modul {idx + 1}</span>
                                    <span className="module-card__icon">{locked ? '🔒' : module.icon}</span>
                                </div>
                                <span className={`status-pill ${sLabel.cls}`}>
                                    {sLabel.emoji} {sLabel.text}
                                </span>
                            </div>

                            {/* Title & summary */}
                            <h3 className="module-card__title">{module.title}</h3>
                            <p className="module-card__summary">{module.summary}</p>

                            {/* Footer */}
                            <div className="module-card__footer">
                                {locked ? (
                                    <span className="module-card__unlock-hint">
                                        Fullfør foregående modul for å låse opp
                                    </span>
                                ) : (
                                    <span className="module-card__cta">
                                        {status === 'completed' ? 'Les igjen →' : 'Start modul →'}
                                    </span>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

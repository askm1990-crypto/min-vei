import { useState, useEffect } from 'react';
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
    const required = module.requiredPreviousModules ||
        (module.requiredPreviousModule ? [module.requiredPreviousModule] : []);
    if (required.length === 0) return true;
    return required.every(id => progress[id] === 'completed');
}

function statusLabel(status, locked) {
    if (locked) return { emoji: '🔒', text: 'Låst', cls: 'status--locked' };
    if (status === 'completed') return { emoji: '✅', text: 'Fullført', cls: 'status--completed' };
    if (status === 'in-progress') return { emoji: '🔄', text: 'Pågår', cls: 'status--progress' };
    return { emoji: '⏳', text: 'Ikke startet', cls: 'status--pending' };
}

// ─────────────────────────────────────────────
//  Reaction chips
// ─────────────────────────────────────────────
const REACTIONS = [
    { id: 'yes', emoji: '🙋', label: 'Ja, dette er meg' },
    { id: 'maybe', emoji: '🤔', label: 'Litt' },
    { id: 'curious', emoji: '🔍', label: 'Vil lære mer' },
];

function ReactionChips({ moduleId, sectionIndex }) {
    const key = `mv2_reaction_${moduleId}_${sectionIndex}`;
    const [chosen, setChosen] = useLocalStorage(key, null);

    return (
        <div className="reaction-chips">
            {REACTIONS.map(r => (
                <button
                    key={r.id}
                    className={`reaction-chip ${chosen === r.id ? 'reaction-chip--chosen' : ''}`}
                    onClick={() => setChosen(prev => prev === r.id ? null : r.id)}
                    aria-pressed={chosen === r.id}
                >
                    <span>{r.emoji}</span>
                    <span>{r.label}</span>
                </button>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────
//  Reflection box
// ─────────────────────────────────────────────
function ReflectionBox({ prompt, moduleId, sectionIndex }) {
    const storageKey = `mv2_reflection_${moduleId}_${sectionIndex}`;
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useLocalStorage(storageKey, '');

    return (
        <div className={`reflection-box ${isOpen ? 'reflection-box--open' : ''}`}>
            <button
                className="reflection-box__toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="reflection-box__icon">💭</span>
                <span className="reflection-box__prompt">{prompt}</span>
                <span className={`reflection-box__chevron ${isOpen ? 'open' : ''}`}>▾</span>
            </button>
            {isOpen && (
                <div className="reflection-box__content">
                    <textarea
                        className="reflection-box__input"
                        placeholder="Skriv tankene dine her... Alt lagres kun på din enhet."
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        rows={3}
                    />
                    <span className="reflection-box__hint">🔒 Privat – lagres kun lokalt</span>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
//  RichText – renders **bold** markers
// ─────────────────────────────────────────────
function RichText({ text }) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <>
            {parts.map((part, i) =>
                part.startsWith('**') && part.endsWith('**')
                    ? <strong key={i}>{part.slice(2, -2)}</strong>
                    : <span key={i}>{part}</span>
            )}
        </>
    );
}

// ─────────────────────────────────────────────
//  Section stepper
// ─────────────────────────────────────────────
function SectionStepper({ total, current, onChange }) {
    return (
        <nav className="section-stepper" aria-label="Fremgang i modul">
            {Array.from({ length: total }, (_, i) => (
                <button
                    key={i}
                    className={`stepper-dot ${i === current ? 'stepper-dot--active' : ''} ${i < current ? 'stepper-dot--done' : ''}`}
                    onClick={() => onChange(i)}
                    aria-label={`Del ${i + 1}`}
                    aria-current={i === current ? 'step' : undefined}
                >
                    {i < current ? '✓' : i + 1}
                </button>
            ))}
        </nav>
    );
}

// ─────────────────────────────────────────────
//  Single section view (paginated step)
// ─────────────────────────────────────────────
function SectionPage({ section, moduleId, sectionIndex }) {
    return (
        <div className="section-page view-enter" key={sectionIndex}>
            <h2 className="module-section__heading">{section.heading}</h2>

            <div className="module-paragraphs">
                {section.paragraphs.map((para, i) => (
                    <p key={i} className="module-para">
                        <RichText text={para} />
                    </p>
                ))}
            </div>

            {/* Reaction chips */}
            <ReactionChips moduleId={moduleId} sectionIndex={sectionIndex} />

            {/* Pull quote */}
            {section.pullQuote && (
                <blockquote className="pull-quote">
                    <p>{section.pullQuote}</p>
                </blockquote>
            )}

            {/* Reflection */}
            {section.reflection && (
                <ReflectionBox
                    prompt={section.reflection}
                    moduleId={moduleId}
                    sectionIndex={sectionIndex}
                />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
//  Article view – paginated
// ─────────────────────────────────────────────
function ModuleArticle({ module, onBack, onComplete, isCompleted }) {
    const moduleIndex = MODULES.indexOf(module) + 1;
    const hasSections = module.content.sections?.length > 0;
    const sections = hasSections ? module.content.sections : [];

    // Pages: 0 = intro, 1..N = sections, N+1 = advice+app, N+2 = finish
    const INTRO = 0;
    const FINISH = sections.length + 2;
    const ADVICE = sections.length + 1;

    const [page, setPage] = useState(0);

    // Scroll to top on page change
    useEffect(() => {
        const el = document.querySelector('.view-container') || window;
        el.scrollTo?.({ top: 0, behavior: 'smooth' });
    }, [page]);

    const goNext = () => setPage(p => Math.min(p + 1, FINISH));
    const goPrev = () => setPage(p => Math.max(p - 1, 0));

    // Map stepper to section pages only (pages 1..N → stepper 0..N-1)
    const stepperCurrent = page === INTRO ? -1 : page > sections.length ? sections.length : page - 1;

    const progressPct = Math.round((page / Math.max(FINISH, 1)) * 100);

    return (
        <div className="module-article">
            {/* Reading progress bar */}
            <div className="reading-progress" aria-hidden="true">
                <div className="reading-progress__fill" style={{ width: `${progressPct}%` }} />
                <span className="reading-progress__label">{progressPct}% lest</span>
            </div>

            {/* Header */}
            <div className="module-article__header">
                <button className="wizard-back-btn" onClick={onBack}>← Tilbake</button>
                <div className="module-article__meta">
                    <span className="module-article__num">Modul {moduleIndex}</span>
                    {module.readingTime && (
                        <span className="module-article__reading-time">📖 {module.readingTime}</span>
                    )}
                </div>
            </div>

            {/* Section stepper – always visible */}
            {sections.length > 1 && (
                <SectionStepper
                    total={sections.length}
                    current={stepperCurrent}
                    onChange={i => setPage(i + 1)}
                />
            )}

            {/* ── PAGE 0: Intro ───────────────────────────── */}
            {page === INTRO && (
                <div className="section-page view-enter">
                    <div className="module-article__hero">
                        <span className="module-article__icon">{module.icon}</span>
                        <h1 className="module-article__title">{module.title}</h1>
                        <p className="module-article__summary">{module.summary}</p>
                    </div>
                    <div className="module-callout">
                        <span className="module-callout__label">Kjernebeskjed</span>
                        <p className="module-callout__text">{module.content.coreMessage}</p>
                    </div>
                </div>
            )}

            {/* ── PAGES 1..N: Sections ────────────────────── */}
            {hasSections && page >= 1 && page <= sections.length && (
                <SectionPage
                    key={page}
                    section={sections[page - 1]}
                    moduleId={module.id}
                    sectionIndex={page - 1}
                />
            )}

            {/* ── PAGE N+1: Advice + App integrations ─────── */}
            {page === ADVICE && (
                <div className="section-page view-enter">
                    <section className="module-section">
                        <h2 className="module-section__heading">
                            <span role="img" aria-label="råd">💡</span> Konkrete råd til deg
                        </h2>
                        <ol className="advice-list">
                            {module.content.actionableAdvice.map((item, i) => {
                                const tip = typeof item === 'string' ? item : item.tip;
                                const why = typeof item === 'object' ? item.why : null;
                                return (
                                    <li key={i} className="advice-list__item">
                                        <span className="advice-list__num">{i + 1}</span>
                                        <div className="advice-list__content">
                                            <span className="advice-list__tip">{tip}</span>
                                            {why && <span className="advice-list__why">Fordi: {why}</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

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
                </div>
            )}

            {/* ── PAGE N+2: Finish ────────────────────────── */}
            {page === FINISH && (
                <div className="section-page section-page--finish view-enter">
                    <div className="finish-icon">🎓</div>
                    <h2 className="finish-title">Du er ferdig med modulen!</h2>
                    <p className="finish-sub">
                        Du har lest gjennom hele <strong>{module.title}</strong>.
                        Ta gjerne en pause og la innholdet synke inn.
                    </p>
                    {isCompleted ? (
                        <div className="completed-banner">
                            ✅ Du har fullført denne modulen – bra jobba!
                        </div>
                    ) : (
                        <Button variant="primary" wide onClick={onComplete}>
                            ✅ Marker som fullført (+50 poeng)
                        </Button>
                    )}
                </div>
            )}

            {/* ── Navigation ──────────────────────────────── */}
            <div className="page-nav">
                <button
                    className="page-nav__btn page-nav__btn--prev"
                    onClick={goPrev}
                    disabled={page === 0}
                    aria-label="Forrige del"
                >
                    ← Forrige
                </button>

                <span className="page-nav__counter">
                    {page === INTRO ? 'Intro' :
                        page === ADVICE ? 'Råd & tips' :
                            page === FINISH ? 'Fullføring' :
                                `Del ${page} av ${sections.length}`}
                </span>

                {page < FINISH ? (
                    <button
                        className="page-nav__btn page-nav__btn--next"
                        onClick={goNext}
                        aria-label="Neste del"
                    >
                        Neste →
                    </button>
                ) : (
                    <div style={{ width: '90px' }} />
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
        if (!isUnlocked(module, progress)) return;
        if (!progress[module.id]) {
            setProgress(prev => ({ ...prev, [module.id]: 'in-progress' }));
        }
        setSelected(module);
    };

    const handleComplete = () => {
        if (!selected) return;
        setProgress(prev => ({ ...prev, [selected.id]: 'completed' }));
        addPoints(50, `Fullførte ${selected.title}`);
        showToast(`🎉 +50 poeng! ${selected.title} fullført!`, 'success');
        setSelected(null);
    };

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

    return (
        <div className="fagbibliotek-page">
            <div className="fagbibliotek-header">
                <h2 className="fagbibliotek-title">Fagbibliotek</h2>
                <p className="fagbibliotek-subtitle">
                    Din personlige læringsreise gjennom fem kliniske moduler.
                </p>
            </div>

            <div className="progress-track">
                <div className="progress-track__labels">
                    <span>{completedCount} av {MODULES.length} moduler fullført</span>
                    <span className="progress-track__pct">{Math.round((completedCount / MODULES.length) * 100)}%</span>
                </div>
                <div className="progress-track__bar">
                    <div
                        className="progress-track__fill"
                        style={{ width: `${(completedCount / MODULES.length) * 100}%` }}
                    />
                </div>
            </div>

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
                            <div className="module-card__top">
                                <div className="module-card__num-icon">
                                    <span className="module-card__num">Modul {idx + 1}</span>
                                    <span className="module-card__icon">{locked ? '🔒' : module.icon}</span>
                                </div>
                                <span className={`status-pill ${sLabel.cls}`}>
                                    {sLabel.emoji} {sLabel.text}
                                </span>
                            </div>

                            <h3 className="module-card__title">{module.title}</h3>
                            <p className="module-card__summary">{module.summary}</p>

                            <div className="module-card__footer">
                                {module.readingTime && (
                                    <span className="module-card__time">📖 {module.readingTime}</span>
                                )}
                                {locked ? (
                                    <span className="module-card__unlock-hint">
                                        Fullfør modul 1–3 for å låse opp
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

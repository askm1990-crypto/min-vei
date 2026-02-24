import { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/Toast';
import { formatDateNO } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GoalWizard from './GoalWizard';
import './Goals.css';

export default function Goals({ onNavigate }) {
    const { activeGoals, completedGoals, completeGoal, deleteGoal } = useGoals();
    const { addPoints } = useRecoveryScore();
    const [showWizard, setShowWizard] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    const handleComplete = (goal) => {
        completeGoal(goal.id);
        addPoints(200, `Fullførte mål: ${goal.specific || goal.description}`);
        showToast('Mål fullført! +200 poeng 🎉🎉🎉', 'success');

        // Confetti
        const emoji = document.createElement('div');
        emoji.innerText = '🎊';
        emoji.className = 'confetti-pop';
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 2000);
    };

    const handleDelete = (id) => {
        if (window.confirm('Er du sikker på at du vil slette dette målet?')) {
            deleteGoal(id);
            showToast('Mål slettet.', 'success');
        }
    };

    if (showWizard) {
        return <GoalWizard onClose={() => setShowWizard(false)} />;
    }

    return (
        <div className="goals-page">
            {/* HERO */}
            <div className="journal-hero">
                <Button variant="primary" wide onClick={() => setShowWizard(true)}>
                    🎯 Sett et nytt mål
                </Button>
                <p className="hero-points-hint">Tjen <strong>+50 poeng</strong> for å sette mål, <strong>+200</strong> for å fullføre!</p>
            </div>

            {/* ACTIVE GOALS */}
            <div className="goals-section">
                <h3 className="goals-section-title">Aktive mål ({activeGoals.length})</h3>

                {activeGoals.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🎯</span>
                        <h3>Ingen aktive mål</h3>
                        <p>Sett ditt første SMART-mål for å komme i gang!</p>
                    </div>
                ) : (
                    <div className="goals-list">
                        {activeGoals.map(goal => (
                            <Card key={goal.id} className="goal-card">
                                <div className="goal-card-header">
                                    <div className="goal-card-meta">
                                        <span className="goal-emoji">{goal.lifeAreaEmoji}</span>
                                        <div>
                                            <strong className="goal-area">{goal.lifeAreaLabel}</strong>
                                            <span className="goal-timeframe">
                                                {goal.timeframe === 'short' ? '1-2 uker' : goal.timeframe === 'medium' ? '1-3 mnd' : '3+ mnd'}
                                                {goal.deadline && ` · Frist: ${formatDateNO(goal.deadline)}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="goal-specific">{goal.specific}</p>
                                {goal.measurable && <p className="goal-measurable">📏 {goal.measurable}</p>}
                                {goal.description && <p className="goal-description">{goal.description}</p>}

                                <div className="goal-card-actions">
                                    <Button variant="primary" size="sm" onClick={() => handleComplete(goal)}>
                                        ✅ Fullfør (+200p)
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => handleDelete(goal.id)}>
                                        🗑️ Slett
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* COMPLETED GOALS */}
            {completedGoals.length > 0 && (
                <div className="goals-section">
                    <button className="completed-toggle" onClick={() => setShowCompleted(prev => !prev)}>
                        <h3 className="goals-section-title">
                            Fullførte mål ({completedGoals.length}) {showCompleted ? '▲' : '▼'}
                        </h3>
                    </button>

                    {showCompleted && (
                        <div className="goals-list completed-list">
                            {completedGoals.map(goal => (
                                <Card key={goal.id} className="goal-card goal-card--completed">
                                    <div className="goal-card-header">
                                        <div className="goal-card-meta">
                                            <span className="goal-emoji">{goal.lifeAreaEmoji}</span>
                                            <div>
                                                <strong className="goal-area">{goal.lifeAreaLabel}</strong>
                                                <span className="goal-timeframe">
                                                    Fullført {goal.completedAt ? formatDateNO(goal.completedAt) : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="completed-badge">✅</span>
                                    </div>
                                    <p className="goal-specific">{goal.specific}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useRecoveryScore, POINTS } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/ToastUtils';
import StepIntensity from './StepIntensity';
import StepTriggers from './StepTriggers';
import StepFeelings from './StepFeelings';
import StepOutcome from './StepOutcome';
import StepDetails from './StepDetails';
import StepSummary from './StepSummary';
import './EventWizard.css';

const STEPS = [
    { id: 1, label: 'Intensitet' },
    { id: 2, label: 'Triggere' },
    { id: 3, label: 'Følelser' },
    { id: 4, label: 'Utfall' },
    { id: 5, label: 'Detaljer' },
    { id: 6, label: 'Notat' }
];

export default function EventWizard({ onNavigate, pendingEventId = null }) {
    const { addEvent, updateEvent, events } = useEvents();
    const { addPoints } = useRecoveryScore();

    // If pendingEventId is provided, we start from Step 4 (Outcome)
    const initialStep = pendingEventId ? 4 : 1;
    const [currentStep, setCurrentStep] = useState(initialStep);

    const existingEvent = pendingEventId ? events.find(e => e.id === pendingEventId) : null;

    // Migrate old string strategy to array
    let initialStrategies = [];
    if (existingEvent) {
        if (existingEvent.strategies && Array.isArray(existingEvent.strategies)) {
            initialStrategies = existingEvent.strategies;
        } else if (existingEvent.strategy) {
            initialStrategies = [existingEvent.strategy];
        }
    }

    const [eventData, setEventData] = useState(existingEvent || {
        date: new Date().toISOString(),
        intensity: 5,
        triggers: [],
        feelings: [],
        outcome: null, // 'resisted', 'used', 'ongoing'
        strategies: initialStrategies, // if resisted
        substance: '', // if used
        amount: '', // if used
        note: ''
    });

    const progress = (currentStep / STEPS.length) * 100;

    const updateData = (updates) => {
        setEventData(prev => ({ ...prev, ...updates }));
    };

    const next = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            onNavigate('my-log');
        }
    };

    const handleSave = () => {
        if (pendingEventId) {
            updateEvent(pendingEventId, eventData);
            if (eventData.outcome === 'resisted') {
                addPoints(POINTS.CRAVING_RESISTED, 'Mestret pågående sug i hendelsesloggen');
                showToast('Oppdatert! Sterkt jobba, +100 poeng! 🎉', 'success');
            } else {
                showToast('Hendelse oppdatert.', 'success');
            }
        } else {
            addEvent(eventData);

            if (eventData.outcome === 'resisted') {
                addPoints(POINTS.CRAVING_RESISTED, 'Mestret sug i hendelsesloggen');
                showToast('Lagret! Sterkt jobba, +100 poeng! 🎉', 'success');
            } else if (eventData.outcome === 'ongoing') {
                addPoints(20, 'Logget et pågående sug');
                showToast('Suget er registrert. Vi heier på deg! (+20p)', 'warning');
            } else {
                addPoints(20, 'Vært ærlig i hendelsesloggen');
                showToast('Hendelse lagret. Takk for at du deler ærlig.', 'success');
            }
        }

        // Delay navigation slightly so they see the toast and it feels more saved
        setTimeout(() => {
            onNavigate('my-log');
        }, 100);
    };

    return (
        <div className="event-wizard view-enter">
            <div className="wizard-header">
                <button className="wizard-back-btn" onClick={() => onNavigate('my-log')}>
                    ✕ Avbryt
                </button>
            </div>

            <div className="wizard-container">
                <div className="wizard-progress">
                    <div className="wizard-progress-bar">
                        <div
                            className="wizard-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="wizard-step-counter">
                        Steg {currentStep} av {STEPS.length}: {STEPS[currentStep - 1].label}
                    </div>
                </div>

                <div className="wizard-content">
                    {currentStep === 1 && (
                        <StepIntensity data={eventData} updateData={updateData} onNext={next} />
                    )}
                    {currentStep === 2 && (
                        <StepTriggers data={eventData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 3 && (
                        <StepFeelings data={eventData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 4 && (
                        <StepOutcome data={eventData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 5 && (
                        <StepDetails data={eventData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 6 && (
                        <StepSummary data={eventData} updateData={updateData} onFinish={handleSave} onPrev={prev} />
                    )}
                </div>
            </div>
        </div>
    );
}

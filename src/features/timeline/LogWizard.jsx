import { useState } from 'react';
import { useTimeline } from '../../hooks/useTimeline';
import { useRecoveryScore, POINTS } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/Toast';
import Step1Mood from './components/Step1Mood';
import Step2Feelings from './components/Step2Feelings';
import Step3Triggers from './components/Step3Triggers';
import Step4Outcome from './components/Step4Outcome';
import Step5Text from './components/Step5Text';
import Step6Summary from './components/Step6Summary';
import './LogWizard.css';

export default function LogWizard({ onNavigate, pendingEventId = null }) {
    const { addEntry, updateEntry, getEntry } = useTimeline();
    const { addPoints } = useRecoveryScore();

    // If pendingEventId is provided, start from Step 4 (Outcome)
    const initialStep = pendingEventId ? 4 : 1;
    const [currentStep, setCurrentStep] = useState(initialStep);

    const existingEntry = pendingEventId ? getEntry(pendingEventId) : null;

    // Use existing data or start fresh
    const [entryData, setEntryData] = useState(existingEntry || {
        date: new Date().toISOString(),
        mood: null,
        intensity: 0,
        feelings: [],
        triggers: [],
        outcome: null,
        strategies: [],
        substance: '',
        _substances: [],  // internal tracking array for Step4Outcome chips
        amount: '',
        title: '',
        body: '',
        gratitude: '',
        _bodyScanDone: false,
    });

    const getNextStep = (current) => {
        // Skip steps 3 (Triggers) and 4 (Outcome) if intensity is 0
        if (current === 2 && (!entryData.intensity || entryData.intensity === 0)) return 5;
        return current + 1;
    };

    const getPrevStep = (current) => {
        if (current === 5 && (!entryData.intensity || entryData.intensity === 0)) return 2;
        return current - 1;
    };

    const updateData = (updates) => {
        setEntryData(prev => ({ ...prev, ...updates }));
    };

    const next = () => setCurrentStep(prev => getNextStep(prev));
    const prev = () => {
        if (currentStep > 1) setCurrentStep(p => getPrevStep(p));
        else onNavigate('timeline');
    };

    const handleSave = () => {
        if (pendingEventId) {
            updateEntry(pendingEventId, entryData);
            if (entryData.outcome === 'resisted') {
                addPoints(POINTS.CRAVING_RESISTED, 'Mestret pågående sug i tidslinjen');
                showToast('Oppdatert! Sterkt jobba, +100 poeng! 🎉', 'success');
            } else {
                showToast('Hendelse oppdatert.', 'success');
            }
        } else {
            addEntry(entryData);

            // Calculate base points. 30 for writing diary, extra 100 if craving resisted
            let newlyEarnedPoints = 0;
            if (entryData.body?.trim()?.length > 0 || entryData.mood) newlyEarnedPoints += 30; // base logging

            if (entryData.intensity > 0) {
                if (entryData.outcome === 'resisted') {
                    newlyEarnedPoints += 100;
                    addPoints(130, 'Logget mestret sug');
                    showToast('Lagret! Sterkt jobba, +130 poeng! 🎉', 'success');
                } else if (entryData.outcome === 'ongoing') {
                    addPoints(newlyEarnedPoints + 20, 'Logget et pågående sug');
                    showToast('Suget er registrert. Vi heier på deg! (+50p)', 'warning');
                } else {
                    addPoints(newlyEarnedPoints + 20, 'Vært ærlig om sprekk');
                    showToast('Registrering lagret. Takk for at du deler ærlig.', 'success');
                }
            } else {
                if (newlyEarnedPoints > 0) {
                    addPoints(newlyEarnedPoints, 'Skrevet i dagboken');
                    showToast(`Registrering lagret! +${newlyEarnedPoints} poeng ✍️`, 'success');
                } else {
                    showToast('Registrering lagret.', 'success');
                }
            }
        }

        setTimeout(() => {
            onNavigate('timeline');
        }, 100);
    };

    // Total steps fixed conceptually to 6 for the progress bar calculation
    // even though a user might skip steps 3 and 4.
    const progress = (currentStep / 6) * 100;

    return (
        <div className="log-wizard view-enter">
            <div className="wizard-header">
                <button className="wizard-back-btn" onClick={() => onNavigate('timeline')}>
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
                </div>

                <div className="wizard-content">
                    {currentStep === 1 && (
                        <Step1Mood data={entryData} updateData={updateData} onNext={next} onCancel={() => onNavigate('timeline')} />
                    )}
                    {currentStep === 2 && (
                        <Step2Feelings data={entryData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 3 && (
                        <Step3Triggers data={entryData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 4 && (
                        <Step4Outcome data={entryData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 5 && (
                        <Step5Text data={entryData} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 6 && (
                        <Step6Summary data={entryData} onFinish={handleSave} onPrev={prev} />
                    )}
                </div>
            </div>
        </div>
    );
}

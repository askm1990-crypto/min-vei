import { useState } from 'react';
import StepWelcome from './StepWelcome';
import StepSubstances from './StepSubstances';
import StepProfile from './StepProfile';
import StepGamification from './StepGamification';
import './OnboardingWizard.css';

const STEPS = [
    { id: 1, label: 'Velkommen' },
    { id: 2, label: 'Om deg' },
    { id: 3, label: 'Ditt fokus' },
    { id: 4, label: 'Klar' },
];

export default function OnboardingWizard({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState({
        substances: [],
        customSubstance: '',
        reasons: [],
        customReason: '',
        duration: '',
        treatmentHistory: '',
        motivation: '',
        spendingFrequency: '',
        spendingAmount: '',
        skipSpending: false,
        name: '',
        goal: 'total_abstinence',
        startDate: '',
    });

    const progress = (currentStep / STEPS.length) * 100;

    const updateData = (updates) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const next = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const finish = () => {
        // Prepare final payload by injecting custom 'other' text if provided
        const finalData = { ...data };

        if (finalData.substances.includes('other')) {
            finalData.substances = finalData.substances.filter(s => s !== 'other');
            if (finalData.customSubstance?.trim()) {
                finalData.substances.push(finalData.customSubstance.trim());
            }
        }

        if (finalData.reasons.includes('other')) {
            finalData.reasons = finalData.reasons.filter(r => r !== 'other');
            if (finalData.customReason?.trim()) {
                finalData.reasons.push(finalData.customReason.trim());
            }
        }

        onComplete(finalData);
    };

    return (
        <div className="onboarding">
            <div className="onboarding__container">
                <div
                    className="onboarding__progress-bar"
                    role="progressbar"
                    aria-label="Fremdrift i oppsettet"
                    aria-valuemin="1"
                    aria-valuemax={STEPS.length}
                    aria-valuenow={currentStep}
                >
                    <div
                        className="onboarding__progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="onboarding__steps" aria-label={`Steg ${currentStep} av ${STEPS.length}`}>
                    {STEPS.map(step => (
                        <button
                            type="button"
                            key={step.id}
                            className={`onboarding__step-dot ${step.id < currentStep ? 'completed clickable' :
                                step.id === currentStep ? 'active' : ''
                                }`}
                            onClick={() => {
                                if (step.id < currentStep) {
                                    setCurrentStep(step.id);
                                }
                            }}
                            disabled={step.id >= currentStep}
                            aria-current={step.id === currentStep ? 'step' : undefined}
                            aria-label={`${step.label}${step.id < currentStep ? ', fullført' : step.id === currentStep ? ', aktivt steg' : ''}`}
                        >
                            {step.id < currentStep ? '✓' : step.id}
                        </button>
                    ))}
                </div>

                {/* Step content */}
                <div className="onboarding__content">
                    {currentStep === 1 && (
                        <StepWelcome onNext={next} />
                    )}
                    {currentStep === 2 && (
                        <StepProfile data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 3 && (
                        <StepSubstances data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 4 && (
                        <StepGamification onNext={finish} onPrev={prev} />
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import StepWelcome from './StepWelcome';
import StepSubstances from './StepSubstances';
import StepReasons from './StepReasons';
import StepHistory from './StepHistory';
import StepSpending from './StepSpending';
import StepProfile from './StepProfile';
import StepGamification from './StepGamification';
import './OnboardingWizard.css';

const STEPS = [
    { id: 1, label: 'Velkommen' },
    { id: 2, label: 'Rusmidler' },
    { id: 3, label: 'Funksjon' },
    { id: 4, label: 'Bakgrunn' },
    { id: 5, label: 'Forbruk' },
    { id: 6, label: 'Profil' },
    { id: 7, label: 'Poeng' },
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
                {/* Progress bar */}
                <div className="onboarding__progress-bar">
                    <div
                        className="onboarding__progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step indicators */}
                <div className="onboarding__steps">
                    {STEPS.map(step => (
                        <div
                            key={step.id}
                            className={`onboarding__step-dot ${step.id < currentStep ? 'completed clickable' :
                                step.id === currentStep ? 'active' : ''
                                }`}
                            onClick={() => {
                                if (step.id < currentStep) {
                                    setCurrentStep(step.id);
                                }
                            }}
                            role={step.id < currentStep ? "button" : "presentation"}
                            style={{ cursor: step.id < currentStep ? 'pointer' : 'default' }}
                        >
                            {step.id < currentStep ? '✓' : step.id}
                        </div>
                    ))}
                </div>

                {/* Step content */}
                <div className="onboarding__content">
                    {currentStep === 1 && (
                        <StepWelcome onNext={next} />
                    )}
                    {currentStep === 2 && (
                        <StepSubstances data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 3 && (
                        <StepReasons data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 4 && (
                        <StepHistory data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 5 && (
                        <StepSpending data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 6 && (
                        <StepProfile data={data} updateData={updateData} onNext={next} onPrev={prev} />
                    )}
                    {currentStep === 7 && (
                        <StepGamification onNext={finish} onPrev={prev} />
                    )}
                </div>
            </div>
        </div>
    );
}

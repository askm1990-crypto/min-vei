import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import PinLock from './components/ui/PinLock';
import { ToastContainer } from './components/ui/Toast';
import { showToast } from './components/ui/ToastUtils';
import OnboardingWizard from './features/onboarding/OnboardingWizard';
import Dashboard from './features/dashboard/Dashboard';
import Timeline from './features/timeline/Timeline';
import LogWizard from './features/timeline/LogWizard';
import Goals from './features/goals/Goals';
import Progress from './features/progress/Progress';
import Strategies from './features/strategies/Strategies';
import Knowledge from './features/knowledge/Knowledge';
import Profile from './features/profile/Profile';
import Crisis from './features/crisis/Crisis';
import { useAppStore } from './store/useAppStore';
import './App.css';

export default function App() {
  const {
    currentView, navigate,
    activeEventId,
    consent, setConsent,
    user, setUser, setSpending,
    guideSeen, setGuideSeen,
    isLocked, setIsLocked
  } = useAppStore();

  const handleNavigate = (view, payload = null) => {
    navigate(view, payload);
  };

  const handleOnboardingComplete = (data) => {
    // Save user profile
    setUser({
      name: data.name,
      goal: data.goal,
      startDate: data.startDate,
      substances: data.substances,
      reasons: data.reasons,
      duration: data.duration,
      treatmentHistory: data.treatmentHistory,
      motivation: data.motivation,
      createdAt: new Date().toISOString(),
    });

    // Save spending data if provided
    if (!data.skipSpending && data.spendingFrequency && data.spendingAmount) {
      setSpending({
        frequency: data.spendingFrequency,
        amountPerTime: Number(data.spendingAmount),
      });
    }

    showToast(data.name ? `Velkommen, ${data.name}.` : 'Velkommen til Min Vei.', 'success');

    // The dashboard is intentionally self-explanatory; avoid another tour after onboarding.
    if (!guideSeen) {
      setGuideSeen(true);
    }
  };

  // Show onboarding for new users (after consent)
  const needsOnboarding = consent && !user;

  return (
    <>
      {/* PIN Lock Screen */}
      {isLocked && <PinLock onUnlock={() => setIsLocked(false)} />}

      {/* GDPR Consent Modal */}
      <Modal isOpen={!consent} title="Velkommen til Min Vei">
        <p><strong>Du har kontroll over opplysningene dine.</strong></p>
        <p>Før du starter, er dette viktig å vite:</p>
        <ul>
          <li><strong>Lokal lagring:</strong> Registreringene lagres i denne nettleseren, ikke på en Min Vei-server.</li>
          <li><strong>Ingen brukerkonto:</strong> Appen identifiserer eller sporer deg ikke.</li>
          <li><strong>Sikkerhetskopi:</strong> Nettleserdata kan bli slettet. Bruk eksport hvis du vil ta vare på historikken.</li>
        </ul>
        <p><strong>Min Vei er et egenhjelpsverktøy og erstatter ikke helsehjelp.</strong> Ved akutt fare, ring 113.</p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" wide onClick={() => setConsent(true)}>
            Jeg forstår – fortsett
          </Button>
        </div>
      </Modal>

      {/* App Shell */}
      <div className="app-container">
        <Sidebar />

        <main className="main-content">
          <Header />

          {needsOnboarding ? (
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          ) : (
            <div className="view-container">
              {currentView === 'dashboard' && (
                <section className="view view-enter">
                  <Dashboard onNavigate={handleNavigate} />
                </section>
              )}

              {currentView === 'timeline' && (
                <section className="view view-enter">
                  <Timeline onNavigate={handleNavigate} />
                </section>
              )}

              {currentView === 'log-wizard' && (
                <LogWizard onNavigate={handleNavigate} />
              )}

              {currentView === 'log-wizard-pending' && (
                <LogWizard onNavigate={handleNavigate} pendingEventId={activeEventId} />
              )}

              {currentView === 'progress' && (
                <section className="view view-enter">
                  <Progress />
                </section>
              )}

              {currentView === 'goals' && (
                <section className="view view-enter">
                  <Goals onNavigate={handleNavigate} />
                </section>
              )}

              {currentView === 'strategies' && (
                <section className="view view-enter">
                  <Strategies />
                </section>
              )}

              {currentView === 'knowledge' && (
                <section className="view view-enter">
                  <Knowledge />
                </section>
              )}

              {currentView === 'profile' && (
                <section className="view view-enter">
                  <Profile />
                </section>
              )}

              {currentView === 'crisis' && (
                <section className="view view-enter">
                  <Crisis onNavigate={handleNavigate} />
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      <ToastContainer />

    </>
  );
}

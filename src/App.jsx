import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import AppGuide from './components/ui/AppGuide';
import PinLock from './components/ui/PinLock';
import { ToastContainer, showToast } from './components/ui/Toast';
import OnboardingWizard from './features/onboarding/OnboardingWizard';
import Dashboard from './features/dashboard/Dashboard';
import EventLog from './features/eventLog/EventLog';
import EventWizard from './features/eventLog/EventWizard';
import Journal from './features/journal/Journal';
import Goals from './features/goals/Goals';
import Progress from './features/progress/Progress';
import Strategies from './features/strategies/Strategies';
import Knowledge from './features/knowledge/Knowledge';
import Profile from './features/profile/Profile';
import Crisis from './features/crisis/Crisis';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getGreeting } from './utils/dateUtils';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeEventId, setActiveEventId] = useState(null); // Used for editing/resolving pending events
  const { theme, toggleTheme, isDark } = useTheme();
  const [consent, setConsent] = useLocalStorage('mv2_consent', false);
  const [user, setUser] = useLocalStorage('mv2_user', null);
  const [spending, setSpending] = useLocalStorage('mv2_spending', null);
  const [disclaimerVisible, setDisclaimerVisible] = useLocalStorage('mv2_disclaimer', true);
  const [guideSeen, setGuideSeen] = useLocalStorage('mv2_guide_seen', false);
  const [showGuide, setShowGuide] = useState(false);
  const [isLocked, setIsLocked] = useState(() => !!localStorage.getItem('mv2_pin'));

  const greeting = getGreeting(user?.name);
  const subtitle = 'En dag av gangen.';

  const handleNavigate = (view, payload = null) => {
    if (view === 'event-wizard-pending' && payload) {
      setActiveEventId(payload);
    }
    // Clear activeEventId if we are navigating somewhere else or starting a fresh wizard
    if (view !== 'event-wizard-pending') {
      setActiveEventId(null);
    }
    setCurrentView(view);
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

    showToast(`Velkommen, ${data.name}! 🎉`, 'success');

    // Show guided tour for new users
    if (!guideSeen) {
      setShowGuide(true);
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
        <p><strong>Ditt personvern er vår prioritet.</strong></p>
        <p>Denne appen er designet for å hjelpe deg i din recovery, og fungerer slik:</p>
        <ul>
          <li><strong>Ingen sky-lagring:</strong> Alt lagres <em>utelukkende lokalt</em> på din enhet.</li>
          <li><strong>Ingen sporing:</strong> Vi sporer ikke hva du gjør eller hvem du er.</li>
          <li><strong>Ditt ansvar:</strong> Sletter du nettleserdataene, forsvinner også din historikk (med mindre du eksporterer først).</li>
        </ul>
        <p><strong>Viktig:</strong> Appen erstatter ikke profesjonell medisinsk behandling. Ved akutt helsefare, ring 113.</p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" wide onClick={() => setConsent(true)}>
            Jeg forstår og aksepterer
          </Button>
        </div>
      </Modal>

      {/* App Shell */}
      <div className="app-container">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isDark={isDark}
          disclaimerVisible={disclaimerVisible}
          onDismissDisclaimer={() => setDisclaimerVisible(false)}
        />

        <main className="main-content">
          <Header
            greeting={greeting}
            subtitle={subtitle}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          {needsOnboarding ? (
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          ) : (
            <div className="view-container">
              {currentView === 'dashboard' && (
                <section className="view view-enter">
                  <Dashboard onNavigate={handleNavigate} />
                </section>
              )}

              {currentView === 'my-log' && (
                <section className="view view-enter">
                  <EventLog onNavigate={handleNavigate} />
                </section>
              )}

              {currentView === 'event-wizard' && (
                <EventWizard onNavigate={handleNavigate} />
              )}

              {currentView === 'event-wizard-pending' && (
                <EventWizard onNavigate={handleNavigate} pendingEventId={activeEventId} />
              )}

              {currentView === 'progress' && (
                <section className="view view-enter">
                  <Progress />
                </section>
              )}

              {currentView === 'journal' && (
                <section className="view view-enter">
                  <Journal onNavigate={handleNavigate} />
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

      {/* Guided App Tour */}
      {showGuide && (
        <AppGuide
          onComplete={() => {
            setShowGuide(false);
            setGuideSeen(true);
          }}
          onNavigateHighlight={(view) => setCurrentView(view)}
        />
      )}
    </>
  );
}

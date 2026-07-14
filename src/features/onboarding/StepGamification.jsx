import Button from '../../components/ui/Button';

export default function StepGamification({ onNext, onPrev }) {
    return (
        <div className="step">
            <span className="step__eyebrow">Alt er klart</span>
            <h2 className="step__title">Din vei, i ditt tempo</h2>
            <p className="step__subtitle">
                Start med det som kjennes nyttig i dag. Du trenger ikke fylle ut alt for å få verdi av appen.
            </p>

            <div className="gamification-intro">
                <div className="score-item">
                    <div className="score-icon" aria-hidden="true">01</div>
                    <div className="score-text">
                        <strong>Sjekk inn</strong>
                        <span>Registrer hvordan du har det når det passer deg.</span>
                    </div>
                </div>

                <div className="score-item">
                    <div className="score-icon" aria-hidden="true">02</div>
                    <div className="score-text">
                        <strong>Finn støtte</strong>
                        <span>Bruk konkrete verktøy for sug, uro og vanskelige situasjoner.</span>
                    </div>
                </div>

                <div className="score-item">
                    <div className="score-icon" aria-hidden="true">03</div>
                    <div className="score-text">
                        <strong>Se mønstre</strong>
                        <span>Innsikt vises først når du har registrert nok til at den er meningsfull.</span>
                    </div>
                </div>
            </div>

            <div className="step__actions" style={{ marginTop: 'var(--space-8)' }}>
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>
                    Åpne Min Vei
                </Button>
            </div>
        </div>
    );
}

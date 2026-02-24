import Button from '../../components/ui/Button';

export default function StepGamification({ onNext, onPrev }) {
    return (
        <div className="step">
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-2)' }}>🏆</div>
            <h2 className="step__title">Recovery Score</h2>
            <p className="step__subtitle" style={{ marginBottom: 'var(--space-8)' }}>
                Få belønning for all den gode innsatsen du legger ned! Appen bruker et poengsystem for å hjelpe deg med å bygge og opprettholde gode vaner.
            </p>

            <div className="gamification-intro">
                <div className="score-item">
                    <div className="score-icon">🌟</div>
                    <div className="score-text">
                        <strong>Nye Nivåer</strong>
                        <span>Start som 'Stifinner' og jobb deg helt opp til 'Mester'.</span>
                    </div>
                </div>

                <div className="score-item">
                    <div className="score-icon">💰</div>
                    <div className="score-text">
                        <strong>Lønnsomme handlinger</strong>
                        <span>Hver dag rusfri gir +50 poeng. Å skrive dagbok gir +30 poeng. Hver lille ting teller!</span>
                    </div>
                </div>

                <div className="score-item">
                    <div className="score-icon">🔥</div>
                    <div className="score-text">
                        <strong>Gjennomfør Streaks</strong>
                        <span>Hold deg til planen flere dager på rad for å utløse store bonus-poeng.</span>
                    </div>
                </div>

                <div className="score-item">
                    <div className="score-icon">⚡</div>
                    <div className="score-text">
                        <strong>Dagens Utfordring</strong>
                        <span>Fullfør enkle, positive daglige utfordringer fra dashboardet for ekstra poeng.</span>
                    </div>
                </div>
            </div>

            <div className="step__actions" style={{ marginTop: 'var(--space-8)' }}>
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>
                    Kult, la oss starte!
                </Button>
            </div>
        </div>
    );
}

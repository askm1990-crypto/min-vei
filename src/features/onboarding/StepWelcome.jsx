import Button from '../../components/ui/Button';

export default function StepWelcome({ onNext }) {
    return (
        <div className="step">
            <span className="step__icon">🧭</span>
            <h2 className="step__title">Velkommen til Min Vei</h2>
            <p className="step__subtitle">
                For å kunne støtte deg best mulig, trenger vi å vite litt om din situasjon.
                Denne informasjonen lagres <strong>kun på din enhet</strong> og deles aldri med noen.
            </p>
            <Button variant="primary" wide onClick={onNext}>
                Start kartlegging
            </Button>
        </div>
    );
}

import Button from '../../components/ui/Button';

export default function StepWelcome({ onNext }) {
    return (
        <div className="step">
            <span className="step__eyebrow">Trygt og privat</span>
            <h2 className="step__title">Velkommen til Min Vei</h2>
            <p className="step__subtitle">
                Et rolig sted for å forstå mønstre, finne mestringsverktøy og følge din egen utvikling.
                Oppsettet tar under ett minutt, og alle spørsmål kan hoppes over.
            </p>
            <div className="step__trust-note">
                Det du registrerer lagres lokalt i denne nettleseren. Ingenting sendes til Min Vei.
            </div>
            <Button variant="primary" wide onClick={onNext}>
                Kom i gang
            </Button>
        </div>
    );
}

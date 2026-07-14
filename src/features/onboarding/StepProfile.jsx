import Button from '../../components/ui/Button';

export default function StepProfile({ data, updateData, onNext, onPrev }) {
    const today = getLocalDateString();
    const hasFutureDate = Boolean(data.startDate && data.startDate > today);

    return (
        <div className="step">
            <span className="step__eyebrow">Steg 2 av 4</span>
            <h2 className="step__title">Gjør appen til din</h2>
            <p className="step__subtitle">Feltene er valgfrie og kan endres senere under Profil.</p>

            <div className="step__form">
                <div className="form-group">
                    <label htmlFor="user-name">Hva vil du at vi skal kalle deg? <span className="optional-label">Valgfritt</span></label>
                    <input
                        id="user-name"
                        type="text"
                        className="text-input"
                        placeholder="F.eks. ditt navn eller kallenavn"
                        value={data.name}
                        onChange={e => updateData({ name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="recovery-goal">Hva er ditt hovedmål akkurat nå?</label>
                    <select
                        id="recovery-goal"
                        className="select-input"
                        value={data.goal}
                        onChange={e => updateData({ goal: e.target.value })}
                    >
                        <option value="total_abstinence">Total avholdenhet</option>
                        <option value="reduction">Redusere bruk</option>
                        <option value="control">Bedre kontroll</option>
                        <option value="unsure">Usikker ennå</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="start-date">Startdato <span className="optional-label">Valgfritt</span></label>
                    <input
                        id="start-date"
                        type="date"
                        className="text-input"
                        value={data.startDate}
                        onChange={e => updateData({ startDate: e.target.value })}
                        max={today}
                        aria-describedby="start-date-help"
                        aria-invalid={hasFutureDate}
                    />
                    <span id="start-date-help" className={hasFutureDate ? 'form-message form-message--error' : 'form-message'}>
                        {hasFutureDate ? 'Velg dagens dato eller en tidligere dato.' : 'Brukes bare til å vise din egen fremdrift.'}
                    </span>
                </div>
            </div>

            <div className="step__actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext} disabled={hasFutureDate}>
                    Fortsett
                </Button>
            </div>
        </div>
    );
}

function getLocalDateString() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().split('T')[0];
}

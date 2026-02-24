import Button from '../../components/ui/Button';

export default function StepProfile({ data, updateData, onNext, onPrev }) {
    const canFinish = data.name.trim().length > 0 && data.startDate.length >= 10;

    return (
        <div className="step">
            <h2 className="step__title">Litt om deg</h2>
            <p className="step__subtitle">Siste steg — fortell oss litt om deg selv.</p>

            <div className="step__form">
                <div className="form-group">
                    <label htmlFor="user-name">Hva vil du at vi skal kalle deg?</label>
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
                    <label htmlFor="start-date">Når starter din nye reise? (Dato for rusfrihet)</label>
                    <input
                        id="start-date"
                        type="date"
                        className="text-input"
                        value={data.startDate}
                        onChange={e => updateData({ startDate: e.target.value })}
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>
            </div>

            <div className="step__actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext} disabled={!canFinish}>
                    Neste
                </Button>
            </div>
        </div>
    );
}

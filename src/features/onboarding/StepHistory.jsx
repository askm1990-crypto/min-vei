import Button from '../../components/ui/Button';

export default function StepHistory({ data, updateData, onNext, onPrev }) {
    return (
        <div className="step">
            <h2 className="step__title">Din bakgrunn</h2>
            <p className="step__subtitle">Litt mer om din historie (valgfritt)</p>

            <div className="step__form">
                <div className="form-group">
                    <label>Hvor lenge har du hatt utfordringer med rus?</label>
                    <select
                        className="select-input"
                        value={data.duration}
                        onChange={e => updateData({ duration: e.target.value })}
                    >
                        <option value="">Velg varighet...</option>
                        <option value="under_1">Under 1 år</option>
                        <option value="1_5">1-5 år</option>
                        <option value="5_10">5-10 år</option>
                        <option value="over_10">Over 10 år</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Har du vært i behandling før?</label>
                    <div className="radio-group">
                        <div
                            className={`radio-item ${data.treatmentHistory === 'yes' ? 'selected' : ''}`}
                            onClick={() => updateData({ treatmentHistory: 'yes' })}
                        >
                            Ja
                        </div>
                        <div
                            className={`radio-item ${data.treatmentHistory === 'no' ? 'selected' : ''}`}
                            onClick={() => updateData({ treatmentHistory: 'no' })}
                        >
                            Nei
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="motivation">Hva er din viktigste motivasjon?</label>
                    <textarea
                        id="motivation"
                        className="text-input"
                        rows={3}
                        placeholder="F.eks. barna mine, helsa, økonomi..."
                        value={data.motivation}
                        onChange={e => updateData({ motivation: e.target.value })}
                    />
                </div>
            </div>

            <div className="step__actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>Neste</Button>
            </div>
        </div>
    );
}

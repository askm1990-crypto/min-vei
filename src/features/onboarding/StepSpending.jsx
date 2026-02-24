import Button from '../../components/ui/Button';

export default function StepSpending({ data, updateData, onNext, onPrev }) {
    const skip = () => {
        updateData({ skipSpending: true, spendingFrequency: '', spendingAmount: '' });
        onNext();
    };

    return (
        <div className="step">
            <h2 className="step__title">💰 Ditt forbruk</h2>
            <p className="step__subtitle">
                Denne infoen brukes til å beregne hvor mye penger du sparer ved rusfrihet.
                Helt valgfritt — hopp over om du ikke ønsker dette.
            </p>

            <div className="step__form">
                <div className="spending-info">
                    <strong>ℹ️ Hvordan vi beregner:</strong> Vi ganger frekvens × beløp for å estimere ukentlig kostnad,
                    og viser deg hvor mye du har spart basert på antall rusfrie dager.
                </div>

                <div className="form-group">
                    <label>Ca. hvor ofte brukte du rusmidler?</label>
                    <select
                        className="select-input"
                        value={data.spendingFrequency}
                        onChange={e => updateData({ spendingFrequency: e.target.value })}
                    >
                        <option value="">Velg frekvens...</option>
                        <option value="daily">Daglig</option>
                        <option value="4-6_week">4-6 ganger per uke</option>
                        <option value="2-3_week">2-3 ganger per uke</option>
                        <option value="1_week">Ca. 1 gang per uke</option>
                        <option value="2-3_month">2-3 ganger per måned</option>
                        <option value="1_month">Ca. 1 gang per måned</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Ca. hvor mye brukte du per gang? (kr)</label>
                    <input
                        type="number"
                        className="text-input"
                        placeholder="F.eks. 500"
                        value={data.spendingAmount}
                        onChange={e => updateData({ spendingAmount: e.target.value })}
                        min="0"
                        step="50"
                    />
                </div>

                {data.spendingFrequency && data.spendingAmount && (
                    <div className="spending-info" style={{ background: 'var(--success-light)', borderColor: 'var(--success)' }}>
                        <strong>📊 Estimat:</strong> Basert på dine tall vil du spare ca. <strong>
                            {calculateWeeklyCost(data.spendingFrequency, Number(data.spendingAmount)).toLocaleString('nb-NO')} kr per uke
                        </strong> ved rusfrihet.
                    </div>
                )}
            </div>

            <div className="step__actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onNext}>Neste</Button>
            </div>

            <span className="skip-link" onClick={skip}>
                Hopp over — jeg vil ikke oppgi dette
            </span>
        </div>
    );
}

function calculateWeeklyCost(frequency, amount) {
    const freqMap = {
        'daily': 7,
        '4-6_week': 5,
        '2-3_week': 2.5,
        '1_week': 1,
        '2-3_month': 0.625,
        '1_month': 0.25,
    };
    const timesPerWeek = freqMap[frequency] || 0;
    return Math.round(timesPerWeek * amount);
}

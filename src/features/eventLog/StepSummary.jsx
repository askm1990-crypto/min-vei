import Button from '../../components/ui/Button';

export default function StepSummary({ data, updateData, onFinish, onPrev }) {

    return (
        <div className="wizard-step">
            <h2 className="step__title">Vil du skrive et notat?</h2>
            <p className="step__subtitle">Noen få stikkord om situasjonen kan hjelpe deg med å forstå mønsteret ditt senere. (Valgfritt)</p>

            <textarea
                placeholder="Hva tenkte du? Hvor var du? Hvem var du med?"
                value={data.note || ''}
                onChange={(e) => updateData({ note: e.target.value })}
                rows={5}
                style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    width: '100%',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    background: 'var(--bg-body)',
                    color: 'var(--text-main)',
                    resize: 'vertical',
                    marginTop: 'var(--space-2)'
                }}
            />

            <div className="step-actions">
                <Button variant="secondary" onClick={onPrev}>Tilbake</Button>
                <Button variant="primary" onClick={onFinish}>
                    Lagre hendelse
                </Button>
            </div>
        </div>
    );
}

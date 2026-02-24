import Button from '../../components/ui/Button';

export default function StepIntensity({ data, updateData, onNext }) {

    // Fallback if not set
    const dateVal = data.date || new Date().toISOString();
    // Format for datetime-local input (YYYY-MM-DDThh:mm)
    const formattedDate = dateVal.slice(0, 16);

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value).toISOString();
        updateData({ date: newDate });
    };

    return (
        <div className="wizard-step">
            <h2 className="step__title">Når skjedde det?</h2>

            <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>
                    Tidspunkt for hendelsen
                </label>
                <input
                    type="datetime-local"
                    value={formattedDate}
                    onChange={handleDateChange}
                    style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        width: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        background: 'var(--bg-body)',
                        color: 'var(--text-main)'
                    }}
                />
            </div>

            <h2 className="step__title">Hvor sterkt var suget?</h2>
            <p className="step__subtitle">Hvor intens var trangen til å bruke fra 1 til 10?</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {data.intensity}
                </span>

                <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.intensity}
                    onChange={(e) => updateData({ intensity: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <span>1 (Mildt)</span>
                    <span>10 (Overveldende)</span>
                </div>
            </div>

            <div className="step-actions">
                <Button variant="primary" wide onClick={onNext}>
                    Neste steg
                </Button>
            </div>
        </div>
    );
}

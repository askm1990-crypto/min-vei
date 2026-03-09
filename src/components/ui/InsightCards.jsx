import './InsightCards.css';

export default function InsightCards({ insights }) {
    if (!insights || insights.length === 0) return null;

    return (
        <div className="insight-section">
            <h3 className="insight-section-title">💡 Dine Innsikter</h3>
            <div className="insight-grid">
                {insights.map(insight => (
                    <div
                        key={insight.id}
                        className={`insight-card insight-${insight.type}`}
                        style={{ '--insight-color': insight.color }}
                    >
                        <span className="insight-icon">{insight.icon}</span>
                        <div className="insight-body">
                            <h4 className="insight-title">{insight.title}</h4>
                            <p className="insight-desc">{insight.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

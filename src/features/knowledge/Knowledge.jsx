import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { showToast } from '../../components/ui/Toast';
import { ARTICLES } from '../../data/articles';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './Knowledge.css';

export default function Knowledge() {
    const [user] = useLocalStorage('mv2_user', null);
    const { addPoints } = useRecoveryScore();
    const [readArticles, setReadArticles] = useLocalStorage('mv2_read_articles', []);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // User's substances from onboarding
    const userSubstances = user?.substances || [];

    // Sort: articles matching user's substances come first
    const sortedArticles = [...ARTICLES].sort((a, b) => {
        const aMatch = a.tags.some(t => userSubstances.includes(t)) ? 1 : 0;
        const bMatch = b.tags.some(t => userSubstances.includes(t)) ? 1 : 0;
        return bMatch - aMatch;
    });

    // Filter & search
    const filtered = sortedArticles.filter(a => {
        if (filter !== 'all' && a.category !== filter) return false;
        if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.summary.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const handleRead = (article) => {
        setSelectedArticle(article);
        if (!readArticles.includes(article.id)) {
            setReadArticles(prev => [...prev, article.id]);
            addPoints(15, `Leste artikkel: ${article.title}`);
            showToast('+15 poeng for å lese! 📖', 'success');
        }
    };

    if (selectedArticle) {
        return (
            <div className="article-view view-enter">
                <div className="editor-header">
                    <h2>{selectedArticle.title}</h2>
                    <button className="wizard-back-btn" onClick={() => setSelectedArticle(null)}>
                        ← Tilbake
                    </button>
                </div>
                <div className="article-content">
                    <div className="article-meta">
                        <span className="article-category-badge">{selectedArticle.category}</span>
                        {selectedArticle.tags.map(t => (
                            <span key={t} className="tag journal-tag">{t}</span>
                        ))}
                    </div>
                    <div className="article-body">
                        {selectedArticle.body.split('\n').map((line, i) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <h3 key={i}>{line.replace(/\*\*/g, '')}</h3>;
                            }
                            if (line.startsWith('- ')) {
                                return <li key={i}>{line.substring(2).replace(/\*\*/g, '')}</li>;
                            }
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i}>{line.replace(/\*\*/g, '')}</p>;
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="knowledge-page">
            <h2 className="strategies-title">Kunnskapsbank</h2>
            <p className="strategies-subtitle">Forståelse er første steg mot endring. Artikler personalisert for deg.</p>

            {/* Search & Filters */}
            <div className="knowledge-controls">
                <input
                    type="text"
                    placeholder="🔍 Søk i artikler..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="knowledge-search"
                />
                <div className="knowledge-filters">
                    {[
                        { id: 'all', label: 'Alle' },
                        { id: 'avhengighet', label: 'Avhengighet' },
                        { id: 'rusmidler', label: 'Rusmidler' },
                        { id: 'recovery', label: 'Recovery' },
                    ].map(f => (
                        <button
                            key={f.id}
                            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Grid */}
            <div className="articles-grid">
                {filtered.map(article => {
                    const isRead = readArticles.includes(article.id);
                    const isPersonalized = article.tags.some(t => userSubstances.includes(t));
                    return (
                        <Card
                            key={article.id}
                            className={`article-card ${isRead ? 'article-read' : ''}`}
                            onClick={() => handleRead(article)}
                        >
                            {isPersonalized && <span className="personalized-badge">For deg ✨</span>}
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-summary">{article.summary}</p>
                            <div className="article-footer">
                                <span className="article-category">{article.category}</span>
                                {isRead ? <span className="read-badge">✓ Lest</span> : <span className="points-badge">+15p</span>}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="empty-state">
                    <h3>Ingen artikler funnet</h3>
                    <p>Prøv å endre filter eller søkeord.</p>
                </div>
            )}
        </div>
    );
}

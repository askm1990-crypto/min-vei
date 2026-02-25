import { useState } from 'react';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../hooks/useTheme';
import { useEvents } from '../../hooks/useEvents';
import { useJournal } from '../../hooks/useJournal';
import { useGoals } from '../../hooks/useGoals';
import { daysBetween, formatDateNO } from '../../utils/dateUtils';
import { exportToPDF } from '../../utils/pdfExport';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { showToast } from '../../components/ui/Toast';
import './Profile.css';

export default function Profile() {
    const { points, level, title, progressToNext, nextLevelPoints } = useRecoveryScore();
    const [user] = useLocalStorage('mv2_user', null);
    const { theme, toggleTheme } = useTheme();
    const { events } = useEvents();
    const { entries: journalEntries } = useJournal();
    const { goals } = useGoals();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pinEnabled, setPinEnabled] = useState(() => !!localStorage.getItem('mv2_pin'));
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [newPin, setNewPin] = useState('');

    const daysSober = user?.startDate ? daysBetween(user.startDate) : 0;

    // Export data
    const handleExport = () => {
        const data = {
            exportDate: new Date().toISOString(),
            version: '2.0',
            user: localStorage.getItem('mv2_user'),
            spending: localStorage.getItem('mv2_spending'),
            events: localStorage.getItem('mv2_events'),
            journal: localStorage.getItem('mv2_journal'),
            goals: localStorage.getItem('mv2_goals'),
            score: localStorage.getItem('mv2_recovery_score'),
            readArticles: localStorage.getItem('mv2_read_articles'),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `min-vei-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Backup lastet ned! 📦', 'success');
    };

    // Import data
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.user) localStorage.setItem('mv2_user', data.user);
                if (data.spending) localStorage.setItem('mv2_spending', data.spending);
                if (data.events) localStorage.setItem('mv2_events', data.events);
                if (data.journal) localStorage.setItem('mv2_journal', data.journal);
                if (data.goals) localStorage.setItem('mv2_goals', data.goals);
                if (data.score) localStorage.setItem('mv2_recovery_score', data.score);
                if (data.readArticles) localStorage.setItem('mv2_read_articles', data.readArticles);
                showToast('Data importert! Last inn siden på nytt.', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } catch {
                showToast('Feil ved import. Ugyldig fil.', 'error');
            }
        };
        reader.readAsText(file);
    };

    // Delete all data
    const handleDeleteAll = () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('mv2_'));
        keys.forEach(k => localStorage.removeItem(k));
        showToast('Alle data slettet. Laster inn på nytt...', 'success');
        setTimeout(() => window.location.reload(), 1500);
    };

    // PIN management
    const handleEnablePin = () => {
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            showToast('PIN-koden må være nøyaktig 4 siffer.', 'error');
            return;
        }
        localStorage.setItem('mv2_pin', newPin);
        setPinEnabled(true);
        setShowPinSetup(false);
        setNewPin('');
        showToast('Sikkerhetslås aktivert! 🔒', 'success');
    };

    const handleRemovePin = () => {
        localStorage.removeItem('mv2_pin');
        setPinEnabled(false);
        showToast('Sikkerhetslås deaktivert.', 'success');
    };

    // PDF export
    const handlePdfExport = () => {
        exportToPDF({
            user,
            events: events || [],
            journal: journalEntries || [],
            goals: goals || [],
            points,
            level,
            title,
            daysSober
        });
        showToast('Rapport generert! Lagre som PDF via utskriftsdialogen. 📄', 'success');
    };

    return (
        <div className="profile-page">
            {/* USER CARD */}
            <div className="profile-hero">
                <div className="profile-avatar">
                    <span>{user?.name?.[0]?.toUpperCase() || '👤'}</span>
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">{user?.name || 'Min Vei-bruker'}</h2>
                    <p className="profile-subtitle">
                        Nivå {level}: {title} · {points.toLocaleString('nb-NO')} poeng
                    </p>
                    {user?.startDate && (
                        <p className="profile-start">
                            Startdato: {formatDateNO(user.startDate)} · {daysSober} dager
                        </p>
                    )}
                </div>
            </div>

            {/* LEVEL PROGRESS */}
            <Card hoverable={false}>
                <div className="profile-progress">
                    <div className="profile-progress-label">
                        <span>Nivå {level}</span>
                        {nextLevelPoints && <span>Nivå {level + 1}</span>}
                    </div>
                    <div className="hero-progress-bar">
                        <div className="hero-progress-fill" style={{ width: `${progressToNext}%` }} />
                    </div>
                </div>
            </Card>

            {/* RECOVERY PROFILE */}
            <Card header="Min Recovery-Profil" hoverable={false}>
                <div className="profile-details">
                    <div className="profile-detail-group">
                        <span className="detail-label">Mine utfordringer (rusmidler):</span>
                        <div className="detail-tags">
                            {user?.substances?.length > 0 ? (
                                user.substances.map(s => <span key={s} className="tag">{s}</span>)
                            ) : (
                                <span className="text-muted">Ikke angitt</span>
                            )}
                        </div>
                    </div>
                    <div className="profile-detail-group">
                        <span className="detail-label">Kjente triggere:</span>
                        <div className="detail-tags">
                            {user?.triggers?.length > 0 ? (
                                user.triggers.map(t => <span key={t} className="tag trigger-tag">{t}</span>)
                            ) : (
                                <span className="text-muted">Ikke angitt</span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* SETTINGS */}
            <Card header="Innstillinger" hoverable={false}>
                <div className="settings-list">
                    <div className="settings-row">
                        <div>
                            <strong>Tema</strong>
                            <span className="settings-hint">{theme === 'dark' ? 'Mørkt tema' : 'Lyst tema'}</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={toggleTheme}>
                            {theme === 'dark' ? '☀️ Lyst' : '🌙 Mørkt'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* SECURITY */}
            <Card header="Sikkerhet" hoverable={false}>
                <div className="settings-list">
                    <div className="settings-row">
                        <div>
                            <strong>Sikkerhetslås (PIN)</strong>
                            <span className="settings-hint">
                                {pinEnabled ? 'Appen er beskyttet med PIN-kode' : 'Beskytt appen med en 4-sifret kode'}
                            </span>
                        </div>
                        {pinEnabled ? (
                            <Button variant="secondary" size="sm" onClick={handleRemovePin}>🔓 Fjern PIN</Button>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={() => setShowPinSetup(true)}>🔒 Sett PIN</Button>
                        )}
                    </div>
                    {showPinSetup && (
                        <div className="pin-setup-row">
                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="4 siffer"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                className="pin-setup-input"
                            />
                            <Button variant="primary" size="sm" onClick={handleEnablePin}>Lagre</Button>
                            <Button variant="secondary" size="sm" onClick={() => { setShowPinSetup(false); setNewPin(''); }}>Avbryt</Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* DATA */}
            <Card header="Data & Personvern" hoverable={false}>
                <div className="settings-list">
                    <div className="settings-row">
                        <div>
                            <strong>Eksporter data</strong>
                            <span className="settings-hint">Last ned all data som JSON-fil</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleExport}>📦 Eksporter</Button>
                    </div>
                    <div className="settings-row">
                        <div>
                            <strong>Generer PDF-rapport</strong>
                            <span className="settings-hint">Lag en utskriftsvennlig rapport (for lege/behandler)</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handlePdfExport}>📄 PDF</Button>
                    </div>
                    <div className="settings-row">
                        <div>
                            <strong>Importer data</strong>
                            <span className="settings-hint">Gjenopprett fra en tidligere backup</span>
                        </div>
                        <label className="import-btn">
                            📥 Importer
                            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                        </label>
                    </div>
                    <div className="settings-row danger">
                        <div>
                            <strong>Slett all data</strong>
                            <span className="settings-hint">Fjerner all lokal data permanent</span>
                        </div>
                        {!showDeleteConfirm ? (
                            <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(true)}>🗑️ Slett</Button>
                        ) : (
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>Avbryt</Button>
                                <Button variant="primary" size="sm" onClick={handleDeleteAll} style={{ background: 'hsl(0,70%,50%)' }}>
                                    Bekreft sletting
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <p className="privacy-note">
                    🔒 All data lagres kun lokalt i din nettleser. Ingenting sendes til noen server.
                    Vi samler ikke inn persondata. Du har full kontroll.
                </p>
            </Card>
        </div>
    );
}

import { useState } from 'react';
import { useRecoveryScore } from '../../hooks/useRecoveryScore';
import { useAppStore } from '../../store/useAppStore';
import { useTimeline } from '../../hooks/useTimeline';
import { useGoals } from '../../hooks/useGoals';
import { daysBetween, formatDateNO } from '../../utils/dateUtils';
import { exportToPDF } from '../../utils/pdfExport';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { showToast } from '../../components/ui/ToastUtils';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useNotifications } from '../../hooks/useNotifications';
import './Profile.css';

export default function Profile() {
    const { points, level, title, progressToNext, nextLevelPoints } = useRecoveryScore();
    const { user, theme, toggleTheme } = useAppStore();
    const { getEvents, getJournalEntries } = useTimeline();
    const { goals } = useGoals();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pinEnabled, setPinEnabled] = useState(() => !!localStorage.getItem('mv2_pin'));
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [newPin, setNewPin] = useState('');

    const {
        dailyReminderEnabled,
        setDailyReminderEnabled,
        dailyReminderTime,
        setDailyReminderTime
    } = useNotificationStore();
    const { permissionStatus, requestPermissions } = useNotifications();

    const daysSober = user?.startDate ? daysBetween(user.startDate) : 0;

    // Export data
    const handleExport = () => {
        const data = {
            exportDate: new Date().toISOString(),
            version: '2.0',
            user: localStorage.getItem('mv2_user'),
            spending: localStorage.getItem('mv2_spending'),
            timeline: localStorage.getItem('mv2_timeline'),
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
                if (data.timeline) localStorage.setItem('mv2_timeline', data.timeline);

                // Legacy support if they import an old backup
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
            events: getEvents(),
            journal: getJournalEntries(),
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
                        <span className="detail-label">🎯 Mitt mål:</span>
                        <p className="detail-value">
                            {user?.goal === 'total_abstinence' ? 'Total avholdenhet' :
                                user?.goal === 'reduction' ? 'Redusert bruk' :
                                    user?.goal === 'harm_reduction' ? 'Skadereduksjon' :
                                        user?.goal || 'Ikke angitt'}
                        </p>
                    </div>
                    <div className="profile-detail-group">
                        <span className="detail-label">💊 Mine utfordringer (rusmidler):</span>
                        <div className="detail-tags">
                            {user?.substances?.length > 0 ? (
                                user.substances.map(s => <span key={s} className="tag">{s}</span>)
                            ) : (
                                <span className="text-muted">Ikke angitt</span>
                            )}
                        </div>
                    </div>
                    <div className="profile-detail-group">
                        <span className="detail-label">❤️ Grunner for endring:</span>
                        <div className="detail-tags">
                            {user?.reasons?.length > 0 ? (
                                user.reasons.map(r => <span key={r} className="tag">{r}</span>)
                            ) : (
                                <span className="text-muted">Ikke angitt</span>
                            )}
                        </div>
                    </div>
                    <div className="profile-detail-group">
                        <span className="detail-label">⏳ Varighet av bruk:</span>
                        <p className="detail-value">{user?.duration || 'Ikke angitt'}</p>
                    </div>
                    <div className="profile-detail-group">
                        <span className="detail-label">🏥 Behandlingshistorikk:</span>
                        <p className="detail-value">{user?.treatmentHistory || 'Ikke angitt'}</p>
                    </div>
                    <div className="profile-detail-group">
                        <span className="detail-label">💪 Motivasjon:</span>
                        <p className="detail-value">{user?.motivation || 'Ikke angitt'}</p>
                    </div>
                </div>
            </Card>

            {/* NOTIFICATIONS */}
            <Card header="Varsler & Påminnelser" hoverable={false}>
                <div className="settings-list">
                    <div className="settings-row">
                        <div>
                            <strong>Daglig påminnelse</strong>
                            <span className="settings-hint">Få et varsel om å skrive i dagboken</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={dailyReminderEnabled}
                                onChange={(e) => setDailyReminderEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {dailyReminderEnabled && (
                        <div className="settings-row" style={{ background: 'var(--bg-body)', margin: '0 var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                            <div>
                                <strong>Tidspunkt</strong>
                                <span className="settings-hint">Når vil du bli påminnet?</span>
                            </div>
                            <input
                                type="time"
                                className="time-input"
                                value={dailyReminderTime}
                                onChange={(e) => setDailyReminderTime(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="settings-row">
                        <div>
                            <strong>Systemvarsler</strong>
                            <span className="settings-hint">
                                {permissionStatus === 'granted' ? 'Tillatelse gitt ✅' :
                                    permissionStatus === 'denied' ? 'Blokkert av nettleser ❌' :
                                        permissionStatus === 'unsupported' ? 'Ikke støttet på denne enheten' :
                                            'Spør om tillatelse for Push-varsler'}
                            </span>
                        </div>
                        {permissionStatus === 'default' && (
                            <Button variant="secondary" size="sm" onClick={requestPermissions}>
                                Aktiver
                            </Button>
                        )}
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

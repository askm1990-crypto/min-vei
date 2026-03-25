/**
 * pdfExport.js — Min Vei
 * Clinical HTML-to-PDF report generator.
 * Opens in a new tab and triggers window.print().
 */

// ---------------------------------------------------------------------------
// Inline translation maps (mirrors translations.ts — no import needed here
// since this is a plain JS utility that may be used outside React context)
// ---------------------------------------------------------------------------
const SUBSTANCE_LABELS = {
    alcohol: 'Alkohol',
    cannabis: 'Cannabis',
    stimulants: 'Stimulanter (Amfetamin, Kokain)',
    opioids: 'Opioider (Heroin, Piller)',
    sedatives: 'Beroligende (Benzo)',
    hallucinogens: 'Hallusinogener (LSD, Fleinsopp)',
    ghb: 'GHB/GBL',
    steroids: 'Anabole steroider',
    other: 'Annet',
};

const REASON_LABELS = {
    numbing: 'For å dempe vonde følelser / flukt',
    social: 'For å fungere sosialt / tilhørighet',
    sleep: 'For å få sove / ro',
    euphoria: 'For opplevelsen av rus / spenning',
    habit: 'Vane / fysisk avhengighet',
    pain: 'Dempe fysisk smerte',
    focus_adhd: 'Håndtere ADHD / roe hodet',
    performance: 'Prestasjonsfremmende (jobb/skole)',
    other: 'Annet',
};

const DURATION_LABELS = {
    under_1: 'Under 1 år',
    '1_5': '1-5 år',
    '5_10': '5-10 år',
    over_10: 'Over 10 år',
};

const TREATMENT_HISTORY_LABELS = { yes: 'Ja', no: 'Nei' };

const GOAL_LABELS = {
    total_abstinence: 'Total avholdenhet',
    reduction: 'Redusert bruk',
    harm_reduction: 'Skadereduksjon',
};

function tl(map, key) {
    if (!key) return '–';
    return map[key] || key;
}

function _TlArr(map, arr) {
    if (!arr || arr.length === 0) return '–';
    return arr.map(k => map[k] || k).join(', ');
}

// ---------------------------------------------------------------------------
// SVG Pie Chart generator
// ---------------------------------------------------------------------------
/**
 * Builds an SVG pie chart string from a frequency map.
 * @param {Record<string, number>} freq  - e.g. { Stress: 5, Sug: 2 }
 * @param {string[]} palette            - hex/hsl colours for slices
 * @returns {string} SVG markup string
 */
function buildPieChart(freq, palette) {
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    if (total === 0 || entries.length === 0) {
        return '<p style="color:#94a3b8;font-style:italic;font-size:0.8rem;">Ingen data tilgjengelig</p>';
    }

    const CX = 80;
    const CY = 80;
    const R = 68;
    const CIRCUM = 2 * Math.PI * R;

    // Default colour palette (clinical but readable)
    const COLORS = palette || [
        '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
        '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
        '#f97316', '#a78bfa',
    ];

    let svgSlices = '';
    let cumulativeFrac = 0;

    entries.forEach(([, count], i) => {
        const frac = count / total;
        const dasharray = (frac * CIRCUM).toFixed(2);
        const dashoffset = (-(cumulativeFrac * CIRCUM)).toFixed(2);
        const color = COLORS[i % COLORS.length];

        /*
         * SVG stroke-dasharray trick:
         * - Circle starts at top (transform="rotate(-90 cx cy)")
         * - stroke-dasharray = [slice_arc, remaining_arc]
         * - stroke-dashoffset walks around as cumulative fraction increases
         */
        svgSlices += `
            <circle
                cx="${CX}" cy="${CY}" r="${R}"
                fill="none"
                stroke="${color}"
                stroke-width="28"
                stroke-dasharray="${dasharray} ${(CIRCUM - parseFloat(dasharray)).toFixed(2)}"
                stroke-dashoffset="${dashoffset}"
                transform="rotate(-90 ${CX} ${CY})"
            />`;

        cumulativeFrac += frac;
    });

    // Legend items
    let legendHTML = '<div style="display:flex;flex-direction:column;gap:5px;justify-content:center;min-width:140px;">';
    entries.forEach(([label, count], i) => {
        const pct = ((count / total) * 100).toFixed(0);
        const color = COLORS[i % COLORS.length];
        legendHTML += `
            <div style="display:flex;align-items:center;gap:6px;font-size:0.75rem;color:#334155;">
                <span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${color};flex-shrink:0;"></span>
                <span>${escHtml(label)} (${count} — ${pct}%)</span>
            </div>`;
    });
    legendHTML += '</div>';

    const svgStr = `
        <svg viewBox="0 0 160 160" width="160" height="160" style="overflow:visible;">
            <circle cx="${CX}" cy="${CY}" r="${R}" fill="#f1f5f9" />
            ${svgSlices}
            <circle cx="${CX}" cy="${CY}" r="40" fill="white" />
            <text x="${CX}" y="${CY + 4}" text-anchor="middle"
                fill="#334155" font-size="11" font-weight="700">${total}</text>
            <text x="${CX}" y="${CY + 16}" text-anchor="middle"
                fill="#94a3b8" font-size="8">totalt</text>
        </svg>`;

    return `
        <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;">
            ${svgStr}
            ${legendHTML}
        </div>`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function fmtDate(dateStr) {
    if (!dateStr) return '–';
    try {
        return new Date(dateStr).toLocaleDateString('nb-NO', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch {
        return String(dateStr);
    }
}

function getLast30Days(arr, dateField = 'date') {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return (arr || []).filter(item => {
        const d = new Date(item[dateField] || item.createdAt || item.date);
        return d.getTime() >= cutoff;
    }).sort((a, b) => {
        const da = new Date(a[dateField] || a.createdAt);
        const db = new Date(b[dateField] || b.createdAt);
        return db - da; // newest first
    });
}

/** Count occurrences in an array of arrays (or strings). */
function buildFreqMap(rows, accessor) {
    const map = {};
    rows.forEach(row => {
        const values = accessor(row);
        (Array.isArray(values) ? values : [values]).forEach(v => {
            if (v) map[v] = (map[v] || 0) + 1;
        });
    });
    return map;
}

// ---------------------------------------------------------------------------
// Main export function
// ---------------------------------------------------------------------------
export function exportToPDF({ user, events, journal, goals, points, level, title, daysSober }) {
    const printDate = new Date().toLocaleDateString('nb-NO', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const recentEvents = getLast30Days(events || [], 'date');
    const recentJournal = getLast30Days(journal || [], 'date');

    // Frequency maps for charts
    const triggerFreq = buildFreqMap(recentEvents, e => e.triggers || []);
    const strategyFreq = buildFreqMap(recentEvents, e => e.strategies || []);

    // Pie chart SVGs
    const triggerPie = buildPieChart(triggerFreq, [
        '#ef4444', '#f97316', '#f59e0b', '#eab308',
        '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
        '#3b82f6', '#8b5cf6',
    ]);
    const strategyPie = buildPieChart(strategyFreq, [
        '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b',
        '#06b6d4', '#ec4899', '#a78bfa', '#84cc16',
        '#f97316', '#ef4444',
    ]);

    // Events table rows
    const eventRows = recentEvents.map(ev => `
        <tr>
            <td>${fmtDate(ev.date || ev.createdAt)}</td>
            <td>${escHtml((ev.triggers || []).join(', ') || '–')}</td>
            <td style="text-align:center;">${ev.intensity ?? '–'}</td>
            <td>${escHtml((ev.strategies || []).join(', ') || '–')}</td>
        </tr>`).join('');

    // Journal table rows
    const journalRows = recentJournal.map(j => `
        <tr>
            <td>${fmtDate(j.date)}</td>
            <td style="text-align:center;">${j.mood ?? '–'}/5</td>
            <td>${escHtml(j.body?.substring(0, 200) || '–')}</td>
        </tr>`).join('');

    // Goals list
    const goalsHTML = (goals || []).length > 0
        ? (goals || []).map(g => `
            <div class="goal-item ${g.completed ? 'done' : ''}">
                <span class="goal-icon">${g.completed ? '✅' : '⏳'}</span>
                <span>${escHtml(g.text || g.title || '')}</span>
            </div>`).join('')
        : '<p style="color:#94a3b8;font-style:italic;">Ingen mål registrert.</p>';

    // -----------------------------------------------------------------------
    // Full HTML document
    // -----------------------------------------------------------------------
    const html = `<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="utf-8" />
    <title>Klinisk Oppsummering – Min Vei</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: 13px;
            color: #1e293b;
            background: #fff;
            line-height: 1.65;
        }

        /* ---- Layout ---- */
        .page {
            max-width: 780px;
            margin: 0 auto;
            padding: 40px 36px 60px;
        }

        /* ---- Header ---- */
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 16px;
            margin-bottom: 28px;
        }

        .report-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e3a8a;
            letter-spacing: -0.5px;
        }

        .report-subtitle {
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 3px;
        }

        .report-meta {
            text-align: right;
            font-size: 0.78rem;
            color: #64748b;
            line-height: 1.8;
        }

        .report-meta strong {
            color: #334155;
        }

        /* ---- Section ---- */
        .section {
            margin-bottom: 32px;
        }

        .section-title {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #3b82f6;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
        }

        /* ---- Info Grid ---- */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px 24px;
        }

        .info-cell { }

        .info-label {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin-bottom: 3px;
        }

        .info-value {
            font-size: 0.88rem;
            color: #334155;
        }

        .badge-wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 4px;
        }

        .badge {
            background: #eff6ff;
            color: #1d4ed8;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 0.76rem;
            font-weight: 600;
            border: 1px solid #bfdbfe;
        }

        .stat-strip {
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
        }

        .stat-card {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 18px;
            text-align: center;
        }

        .stat-card .stat-num {
            font-size: 1.8rem;
            font-weight: 800;
            color: #1d4ed8;
            line-height: 1;
        }

        .stat-card .stat-label {
            font-size: 0.72rem;
            color: #64748b;
            margin-top: 4px;
            font-weight: 500;
        }

        /* ---- Charts ---- */
        .charts-row {
            display: flex;
            gap: 40px;
            flex-wrap: wrap;
        }

        .chart-block {
            flex: 1;
            min-width: 260px;
        }

        .chart-title {
            font-size: 0.78rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 10px;
        }

        /* ---- Tables ---- */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.82rem;
        }

        thead th {
            background: #1e3a8a;
            color: white;
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 0.74rem;
            letter-spacing: 0.5px;
        }

        tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        tbody tr:hover {
            background: #eff6ff;
        }

        tbody td {
            padding: 7px 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: top;
        }

        .no-data {
            color: #94a3b8;
            font-style: italic;
            font-size: 0.82rem;
            padding: 10px 0;
        }

        /* ---- Goals ---- */
        .goal-item {
            display: flex;
            align-items: baseline;
            gap: 8px;
            padding: 6px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.85rem;
            color: #334155;
        }

        .goal-item.done {
            color: #15803d;
        }

        .goal-icon {
            font-size: 0.9rem;
            flex-shrink: 0;
        }

        /* ---- Footer ---- */
        .report-footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 0.75rem;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* ---- Print ---- */
        @media print {
            body { font-size: 12px; }
            .page { padding: 20px 24px 40px; }
            .stat-card { break-inside: avoid; }
            .charts-row { break-inside: avoid; }
            table { break-inside: auto; }
            tr { break-inside: avoid; }
        }
    </style>
</head>
<body>
<div class="page">

    <!-- HEADER -->
    <div class="report-header">
        <div>
            <div class="report-title">Klinisk Oppsummering – Min Vei</div>
            <div class="report-subtitle">Selvrapportert pasientdata · Konfidensielt</div>
        </div>
        <div class="report-meta">
            <div><strong>Utskriftsdato:</strong> ${printDate}</div>
            <div><strong>Pasient:</strong> ${escHtml(user?.name || 'Ikke oppgitt')}</div>
            <div><strong>Periode:</strong> Siste 30 dager</div>
        </div>
    </div>

    <!-- STATS STRIP -->
    <div class="stat-strip">
        <div class="stat-card">
            <div class="stat-num">${daysSober}</div>
            <div class="stat-label">Dager siden start</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${level}</div>
            <div class="stat-label">Nivå (${escHtml(title || '')})</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${(points || 0).toLocaleString('nb-NO')}</div>
            <div class="stat-label">Recovery-poeng</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${recentEvents.length}</div>
            <div class="stat-label">Hendelser (30d)</div>
        </div>
        <div class="stat-card">
            <div class="stat-num">${recentJournal.length}</div>
            <div class="stat-label">Dagbokinnlegg (30d)</div>
        </div>
    </div>

    <!-- BACKGROUND SECTION -->
    <div class="section">
        <div class="section-title">Bakgrunnsinformasjon</div>
        <div class="info-grid">
            <div class="info-cell">
                <div class="info-label">Startdato</div>
                <div class="info-value">${fmtDate(user?.startDate)}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Behandlingsmål</div>
                <div class="info-value">${tl(GOAL_LABELS, user?.goal)}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Varighet av bruk</div>
                <div class="info-value">${tl(DURATION_LABELS, user?.duration)}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">Tidligere behandling</div>
                <div class="info-value">${tl(TREATMENT_HISTORY_LABELS, user?.treatmentHistory)}</div>
            </div>
            <div class="info-cell" style="grid-column:1/-1;">
                <div class="info-label">Rusmidler</div>
                <div class="badge-wrap">
                    ${(user?.substances || []).length > 0
        ? (user.substances).map(s => `<span class="badge">${escHtml(tl(SUBSTANCE_LABELS, s))}</span>`).join('')
        : '<span style="color:#94a3b8;">Ikke angitt</span>'}
                </div>
            </div>
            <div class="info-cell" style="grid-column:1/-1;">
                <div class="info-label">Grunner for endring</div>
                <div class="badge-wrap">
                    ${(user?.reasons || []).length > 0
        ? (user.reasons).map(r => `<span class="badge">${escHtml(tl(REASON_LABELS, r))}</span>`).join('')
        : '<span style="color:#94a3b8;">Ikke angitt</span>'}
                </div>
            </div>
            ${user?.motivation ? `
            <div class="info-cell" style="grid-column:1/-1;">
                <div class="info-label">Motivasjon (pasientens egne ord)</div>
                <div class="info-value" style="white-space:pre-wrap;">${escHtml(user.motivation)}</div>
            </div>` : ''}
        </div>
    </div>

    <!-- DATA VISUALISATION -->
    <div class="section">
        <div class="section-title">Datavisualisering – Siste 30 dager</div>
        <div class="charts-row">
            <div class="chart-block">
                <div class="chart-title">Triggere (hyppighet)</div>
                ${triggerPie}
            </div>
            <div class="chart-block">
                <div class="chart-title">Mestringsstrategier (hyppighet)</div>
                ${strategyPie}
            </div>
        </div>
    </div>

    <!-- EVENTS TABLE -->
    <div class="section">
        <div class="section-title">Hendelseslogg – Siste 30 dager (${recentEvents.length} oppføringer)</div>
        ${recentEvents.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th style="width:90px;">Dato</th>
                    <th>Triggere</th>
                    <th style="width:80px;text-align:center;">Intensitet (1–10)</th>
                    <th>Mestringsstrategi</th>
                </tr>
            </thead>
            <tbody>
                ${eventRows}
            </tbody>
        </table>` : '<p class="no-data">Ingen hendelser registrert de siste 30 dagene.</p>'}
    </div>

    <!-- JOURNAL TABLE -->
    <div class="section">
        <div class="section-title">Dagbok – Siste 30 dager (${recentJournal.length} innlegg)</div>
        ${recentJournal.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th style="width:90px;">Dato</th>
                    <th style="width:80px;text-align:center;">Humør (1–5)</th>
                    <th>Tekst</th>
                </tr>
            </thead>
            <tbody>
                ${journalRows}
            </tbody>
        </table>` : '<p class="no-data">Ingen dagbokinnlegg registrert de siste 30 dagene.</p>'}
    </div>

    <!-- GOALS -->
    <div class="section">
        <div class="section-title">Mål</div>
        ${goalsHTML}
    </div>

    <!-- FOOTER -->
    <div class="report-footer">
        <span>🔒 Generert lokalt i Min Vei-appen. Ingen data er sendt til ekstern server.</span>
        <span>Min Vei · ${printDate}</span>
    </div>

</div>
<script>
    // Trigger print dialog after fonts/images load
    window.onload = function() {
        setTimeout(function() { window.print(); }, 400);
    };
</script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        // Fallback: offer as downloadable HTML file
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `min-vei-rapport-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
}

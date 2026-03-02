/**
 * PDF Export Utility for Min Vei
 * Generates a simple text-based PDF using browser APIs (no external libraries needed).
 */

export function exportToPDF({ user, events, journal, goals, points, level, title, daysSober }) {
    // Build the report content
    const lines = [];
    const date = new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: 'long', year: 'numeric' });

    lines.push('MIN VEI — RECOVERY-RAPPORT');
    lines.push(`Generert: ${date}`);
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');

    // User info
    lines.push('BRUKERINFO');
    lines.push(`Navn: ${user?.name || 'Ikke oppgitt'}`);
    lines.push(`Startdato: ${user?.startDate || 'Ikke satt'}`);
    lines.push(`Dager uten rus: ${daysSober}`);
    lines.push(`Nivå: ${level} — ${title}`);
    lines.push(`Poeng: ${points?.toLocaleString('nb-NO') || 0}`);
    lines.push('');

    // Substances
    if (user?.substances?.length > 0) {
        lines.push('UTFORDRINGER (RUSMIDLER)');
        user.substances.forEach(s => lines.push(`  • ${s}`));
        lines.push('');
    }

    // Journal entries (last 10)
    const journalData = journal || [];
    if (journalData.length > 0) {
        lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        lines.push('');
        lines.push(`DAGBOK (siste ${Math.min(10, journalData.length)} innlegg)`);
        lines.push('');
        journalData.slice(0, 10).forEach(entry => {
            const d = new Date(entry.date).toLocaleDateString('nb-NO');
            lines.push(`📅 ${d} — Humør: ${entry.mood || '–'}/5`);
            lines.push(`   ${entry.body?.substring(0, 120) || 'Ingen tekst'}`);
            lines.push('');
        });
    }

    // Events (last 10)
    const eventsData = events || [];
    if (eventsData.length > 0) {
        lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        lines.push('');
        lines.push(`HENDELSER (siste ${Math.min(10, eventsData.length)})`);
        lines.push('');
        eventsData.slice(0, 10).forEach(event => {
            const d = new Date(event.date || event.createdAt).toLocaleDateString('nb-NO');

            // Format triggers as string
            const triggerStr = event.triggers?.length > 0 ? event.triggers.join(', ') : 'Hendelse';

            lines.push(`📌 ${d} — ${triggerStr}`);
            if (event.intensity) lines.push(`   Intensitet: ${event.intensity}/10`);
            if (event.strategies?.length > 0) lines.push(`   Strategi: ${event.strategies.join(', ')}`);
            lines.push('');
        });
    }

    // Goals
    const goalsData = goals || [];
    if (goalsData.length > 0) {
        lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        lines.push('');
        lines.push('MÅL');
        lines.push('');
        goalsData.forEach(goal => {
            const status = goal.completed ? '✅' : '⏳';
            lines.push(`${status} ${goal.text || goal.title}`);
        });
        lines.push('');
    }

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push('🔒 Denne rapporten er generert lokalt i Min Vei-appen.');
    lines.push('Ingen data er sendt til noen server.');

    // Create a printable HTML document and trigger print/save as PDF
    const content = lines.join('\n');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        // Fallback: download as text file
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `min-vei-rapport-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Min Vei — Recovery-Rapport</title>
        <meta charset="utf-8" />
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
                font-family: 'Inter', system-ui, sans-serif;
                max-width: 700px;
                margin: 0 auto;
                padding: 40px 20px;
                color: #1e293b;
                line-height: 1.7;
                font-size: 13px;
            }
            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                font-family: inherit;
                margin: 0;
            }
            @media print {
                body { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        <script>
            window.onload = function() { window.print(); };
        </script>
    </body>
    </html>
    `);
    printWindow.document.close();
}

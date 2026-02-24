/**
 * Norwegian date utilities
 */

/** Format ISO date string to DD.MM.YYYY */
export function formatDateNO(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Format time to HH:MM (24h) */
export function formatTimeNO(timeString) {
    if (!timeString) return '';
    if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
    const d = new Date(timeString);
    if (isNaN(d.getTime())) return timeString;
    return d.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Convert DD.MM.YYYY to ISO YYYY-MM-DD */
export function dateNOtoISO(dateNO) {
    if (!dateNO) return '';
    const parts = dateNO.split('.');
    if (parts.length !== 3) return dateNO;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/** Get current date in DD.MM.YYYY */
export function getCurrentDateNO() {
    return new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Get current time in HH:MM */
export function getCurrentTimeNO() {
    return new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Get time-of-day greeting */
export function getGreeting(name) {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 6) greeting = 'God natt';
    else if (hour < 10) greeting = 'God morgen';
    else if (hour < 17) greeting = 'God dag';
    else if (hour < 22) greeting = 'God kveld';
    else greeting = 'God natt';
    return name ? `${greeting}, ${name}` : greeting;
}

/** Calculate days between two dates */
export function daysBetween(startDate, endDate = new Date()) {
    let startStr = startDate;
    if (typeof startStr === 'string' && startStr.includes('.')) {
        startStr = dateNOtoISO(startStr);
    }

    let endStr = endDate;
    if (typeof endStr === 'string' && endStr.includes('.')) {
        endStr = dateNOtoISO(endStr);
    }

    const start = new Date(startStr);
    const end = new Date(endStr);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = end - start;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/** Norwegian month names */
export const MONTHS_NO = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

/** Norwegian day abbreviations */
export const DAYS_NO = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];

/**
 * Personalized daily challenges pool.
 * Challenges are categorized to match goal life-areas and onboarding data.
 * The app rotates through these based on user profile + date.
 */

export const LIFE_AREAS = [
    { id: 'health', label: 'Helse & Kropp', emoji: '🏥', desc: 'Fysisk helse, trening, søvn, kosthold' },
    { id: 'mental', label: 'Mental helse', emoji: '🧠', desc: 'Selvinnsikt, ro, mestring av følelser' },
    { id: 'family', label: 'Familie', emoji: '👨‍👩‍👧', desc: 'Barn, partner, foreldre, søsken' },
    { id: 'social', label: 'Vennskap & Sosialt', emoji: '👥', desc: 'Tilhørighet, relasjoner, nettverk' },
    { id: 'work', label: 'Jobb & Utdanning', emoji: '💼', desc: 'Karriere, kompetanse, mestring på jobb' },
    { id: 'economy', label: 'Økonomi & Materielt', emoji: '💰', desc: 'Sparing, gjeld, bolig, eiendeler' },
    { id: 'recovery', label: 'Recovery', emoji: '🎯', desc: 'Rusfrihet, behandling, tilbakefallsforebygging' },
    { id: 'growth', label: 'Personlig vekst', emoji: '🌱', desc: 'Selvtillit, mot, ærlighet, tålmodighet' },
    { id: 'hobby', label: 'Hobby & Kreativitet', emoji: '🎨', desc: 'Musikk, kunst, friluftsliv, sport' },
    { id: 'spiritual', label: 'Spiritualitet & Mening', emoji: '🙏', desc: 'Tro, verdier, livsmening, indre fred' },
    { id: 'love', label: 'Kjærlighet & Intimitet', emoji: '❤️', desc: 'Romantikk, tillit, nærhet' },
    { id: 'home', label: 'Hjem & Stabilitet', emoji: '🏡', desc: 'Struktur, rutiner, trygghet' }
];

export const CHALLENGES = [
    // --- Fysisk helse ---
    { id: 'c1', text: 'Gå en 15 min tur i frisk luft', category: 'health', points: 100, triggers: [] },
    { id: 'c2', text: 'Drikk 8 glass vann i dag', category: 'health', points: 50, triggers: [] },
    { id: 'c3', text: 'Strekk kroppen i 5 minutter', category: 'health', points: 50, triggers: [] },
    { id: 'c4', text: 'Legg deg 30 min tidligere i kveld', category: 'health', points: 100, triggers: [] },
    { id: 'c5', text: 'Spis et sunt måltid du lager selv', category: 'health', points: 100, triggers: [] },

    // --- Mental helse ---
    { id: 'c6', text: 'Gjør en 5-minutters pusteøvelse', category: 'mental', points: 100, triggers: ['Stress', 'Angst / Uro'] },
    { id: 'c7', text: 'Skriv ned 3 ting du er takknemlig for', category: 'mental', points: 150, triggers: ['Tristhet'] },
    { id: 'c8', text: 'Praktiser 5 min stille mindfulness', category: 'mental', points: 100, triggers: ['Stress', 'Angst / Uro'] },
    { id: 'c9', text: 'Gjør 5-4-3-2-1 grounding-øvelsen', category: 'mental', points: 100, triggers: ['Angst / Uro'] },
    { id: 'c10', text: 'Skriv i dagboken om noe positivt fra i dag', category: 'mental', points: 100, triggers: ['Tristhet', 'Likegyldig'] },

    // --- Sosialt ---
    { id: 'c11', text: 'Ring eller send melding til noen du bryr deg om', category: 'social', points: 100, triggers: ['Sosialt press'] },
    { id: 'c12', text: 'Si nei til noe du egentlig ikke vil gjøre', category: 'social', points: 150, triggers: ['Sosialt press'] },
    { id: 'c13', text: 'Gi noen et genuint kompliment i dag', category: 'social', points: 50, triggers: [] },
    { id: 'c14', text: 'Fortell noen du stoler på hvordan du egentlig har det', category: 'social', points: 200, triggers: [] },

    // --- Recovery ---
    { id: 'c15', text: 'Skriv i dagboken', category: 'recovery', points: 100, triggers: [] },
    { id: 'c16', text: 'Les en artikkel i kunnskapsbanken', category: 'recovery', points: 100, triggers: [] },
    { id: 'c17', text: 'Gjennomgå din sikkerhetsplan', category: 'recovery', points: 150, triggers: ['Tilgjengelighet'] },
    { id: 'c18', text: 'Identifiser én trigger du kan unngå i morgen', category: 'recovery', points: 100, triggers: [] },
    { id: 'c19', text: 'Bruk sug-timeren neste gang du kjenner på sug', category: 'recovery', points: 200, triggers: [] },

    // --- Økonomi ---
    { id: 'c20', text: 'Sjekk hvor mye du har spart i sparekalkulator', category: 'economy', points: 50, triggers: [] },
    { id: 'c21', text: 'Legg merke til én ting du ikke brukte penger på i dag', category: 'economy', points: 50, triggers: [] },
    { id: 'c22', text: 'Sett opp et mini-budsjett for resten av uken', category: 'economy', points: 100, triggers: [] },

    // --- Familie ---
    { id: 'c23', text: 'Send en hyggelig melding til noen i familien', category: 'family', points: 100, triggers: ['Konflikt'] },
    { id: 'c24', text: 'Planlegg en aktivitet med noen du er glad i', category: 'family', points: 100, triggers: [] },
    { id: 'c25', text: 'Si «takk» til noen som har hjulpet deg', category: 'family', points: 50, triggers: [] },

    // --- Personlig vekst ---
    { id: 'c26', text: 'Gjør noe du har utsatt i over en uke', category: 'growth', points: 150, triggers: ['Kjedsomhet'] },
    { id: 'c27', text: 'Lær noe nytt i dag (en artikkel, en video, en podcast)', category: 'growth', points: 100, triggers: ['Kjedsomhet'] },
    { id: 'c28', text: 'Prøv noe du er litt redd for', category: 'growth', points: 200, triggers: [] },

    // --- Hobby ---
    { id: 'c29', text: 'Bruk 20 min på en hobby du liker', category: 'hobby', points: 100, triggers: ['Kjedsomhet', 'Vane / Rutine'] },
    { id: 'c30', text: 'Hør på musikk som gjør deg glad i 15 min', category: 'hobby', points: 50, triggers: ['Tristhet'] },

    // --- Hjem & Stabilitet ---
    { id: 'c31', text: 'Rydd og vask et rom hjemme', category: 'home', points: 100, triggers: [] },
    { id: 'c32', text: 'Lag en plan for morgendagen før du legger deg', category: 'home', points: 50, triggers: ['Vane / Rutine'] },
];

/**
 * Get a personalized daily challenge based on user profile and date.
 * Prioritizes challenges matching the user's known triggers.
 */
export function getDailyChallenge(userTriggers = [], date = new Date()) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    // Weight challenges: +3 for each matching trigger
    const weighted = CHALLENGES.map(c => {
        let weight = 1;
        if (c.triggers && c.triggers.length > 0) {
            const matchCount = c.triggers.filter(t => userTriggers.includes(t)).length;
            weight += matchCount * 3;
        }
        return { ...c, weight };
    });

    // Deterministic pseudo-random pick based on day
    const totalWeight = weighted.reduce((sum, c) => sum + c.weight, 0);
    let pick = (dayOfYear * 7919) % totalWeight; // Large prime for distribution

    for (const challenge of weighted) {
        pick -= challenge.weight;
        if (pick <= 0) return challenge;
    }

    return weighted[dayOfYear % weighted.length];
}

export const BADGES = [
    { id: 'first_event', title: 'Første Steg', emoji: '👣', desc: 'Logget din første hendelse', condition: (data) => data.totalEvents >= 1 },
    { id: 'first_journal', title: 'Dagbokforfatter', emoji: '📓', desc: 'Skrev ditt første dagbokinnlegg', condition: (data) => data.totalJournalEntries >= 1 },
    { id: 'first_goal', title: 'Målsetter', emoji: '🎯', desc: 'Satte ditt første mål', condition: (data) => data.totalGoals >= 1 },
    { id: 'goal_crusher', title: 'Målknuser', emoji: '💪', desc: 'Fullførte ditt første mål', condition: (data) => data.completedGoals >= 1 },
    { id: 'goal_master', title: 'Mål-Mester', emoji: '🏹', desc: 'Fullførte 5 mål', condition: (data) => data.completedGoals >= 5 },
    { id: 'week_sober', title: 'En Uke!', emoji: '⭐', desc: '7 dager rusfri', condition: (data) => data.daysSober >= 7 },
    { id: 'two_weeks', title: 'To Uker!', emoji: '🌱', desc: '14 dager rusfri', condition: (data) => data.daysSober >= 14 },
    { id: 'month_sober', title: 'En Måned!', emoji: '🌟', desc: '30 dager rusfri', condition: (data) => data.daysSober >= 30 },
    { id: 'two_months', title: 'To Måneder!', emoji: '🌈', desc: '60 dager rusfri', condition: (data) => data.daysSober >= 60 },
    { id: 'quarter_sober', title: 'Kvartalsfeiring', emoji: '🏅', desc: '90 dager rusfri', condition: (data) => data.daysSober >= 90 },
    { id: 'half_year', title: 'Halvårsjubileum', emoji: '🎆', desc: '180 dager rusfri', condition: (data) => data.daysSober >= 180 },
    { id: 'year_sober', title: 'Ett År!', emoji: '👑', desc: '365 dager rusfri', condition: (data) => data.daysSober >= 365 },
    { id: 'resisted_5', title: 'Mestringsmester', emoji: '🛡️', desc: 'Mestret 5 sug', condition: (data) => data.resistedEvents >= 5 },
    { id: 'resisted_20', title: 'Ustoppelig', emoji: '🔥', desc: 'Mestret 20 sug', condition: (data) => data.resistedEvents >= 20 },
    { id: 'resisted_50', title: 'Helten', emoji: '🦸', desc: 'Mestret 50 sug', condition: (data) => data.resistedEvents >= 50 },
    { id: 'journal_10', title: 'Skribent', emoji: '✍️', desc: '10 dagbokinnlegg', condition: (data) => data.totalJournalEntries >= 10 },
    { id: 'journal_streak_7', title: 'Dagbok-streak', emoji: '📝', desc: '7 dager dagbok på rad', condition: (data) => data.journalStreak >= 7 },
    { id: 'events_50', title: 'Datasamler', emoji: '📊', desc: 'Logget 50 hendelser', condition: (data) => data.totalEvents >= 50 },
    { id: 'challenge_streak_3', title: 'Utfordrer', emoji: '⚡', desc: '3 utfordringer på rad', condition: (data) => data.challengeStreak >= 3 },
    { id: 'challenge_streak_7', title: 'Ukemester', emoji: '🎪', desc: '7 utfordringer på rad', condition: (data) => data.challengeStreak >= 7 },
    { id: 'points_1000', title: 'Tusen Takk', emoji: '💎', desc: 'Samlet 1000 poeng', condition: (data) => data.totalPoints >= 1000 },
    { id: 'points_5000', title: 'Poengsamler', emoji: '🏆', desc: 'Samlet 5000 poeng', condition: (data) => data.totalPoints >= 5000 },
    { id: 'points_10000', title: 'Poengkonge', emoji: '💰', desc: 'Samlet 10.000 poeng', condition: (data) => data.totalPoints >= 10000 },
    { id: 'crisis_ready', title: 'Kriseklar', emoji: '🛡️', desc: 'Fullførte sikkerhetsplanen', condition: (data) => data.crisisPlanComplete },
];

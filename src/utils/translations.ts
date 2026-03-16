/**
 * translations.ts
 * Maps onboarding raw keys → Norwegian UI strings for Min Vei.
 */

export const SUBSTANCE_LABELS: Record<string, string> = {
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

export const REASON_LABELS: Record<string, string> = {
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

export const DURATION_LABELS: Record<string, string> = {
    under_1: 'Under 1 år',
    '1_5': '1-5 år',
    '5_10': '5-10 år',
    over_10: 'Over 10 år',
};

export const TREATMENT_HISTORY_LABELS: Record<string, string> = {
    yes: 'Ja',
    no: 'Nei',
};

export const GOAL_LABELS: Record<string, string> = {
    total_abstinence: 'Total avholdenhet',
    reduction: 'Redusert bruk',
    harm_reduction: 'Skadereduksjon',
};

/** Utility: look up a key in a label map, falling back to the raw string. */
export function translate(map: Record<string, string>, key: string): string {
    return map[key] ?? key;
}

/** Utility: translate an array of keys, falling back per-item. */
export function translateAll(map: Record<string, string>, keys: string[]): string[] {
    return (keys || []).map((k) => translate(map, k));
}

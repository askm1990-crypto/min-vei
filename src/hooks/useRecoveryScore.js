import { useLocalStorage } from './useLocalStorage';

// Level thresholds
const LEVELS = [
    { level: 1, title: 'Stifinner', minPoints: 0, maxPoints: 500 },
    { level: 2, title: 'Vandrer', minPoints: 500, maxPoints: 1500 },
    { level: 3, title: 'Klatrer', minPoints: 1500, maxPoints: 3000 },
    { level: 4, title: 'Tindebestiger', minPoints: 3000, maxPoints: 6000 },
    { level: 5, title: 'Fjellgeit', minPoints: 6000, maxPoints: 12000 },
    { level: 6, title: 'Ledestjerne', minPoints: 12000, maxPoints: 25000 },
    { level: 7, title: 'Mester', minPoints: 25000, maxPoints: Infinity }
];

// Point values for actions
export const POINTS = {
    SOBER_DAY: 50,
    CRAVING_RESISTED: 100,
    JOURNAL_ENTRY: 30,
    BREATHING_EXERCISE: 15,
    DAILY_CHALLENGE: 100,
    CRISIS_PLAN_COMPLETE: 1000,
    STREAK_3_DAYS: 100,
    STREAK_7_DAYS: 500,
    STREAK_30_DAYS: 2000
};

/**
 * Hook to manage Recovery Score and Levels
 */
export function useRecoveryScore() {
    // Current total points
    const [points, setPoints] = useLocalStorage('mv2_score', 0);
    // History of transactions for stats/display
    const [history, setHistory] = useLocalStorage('mv2_score_history', []);

    // Calculate current level based on points
    const currentLevelInfo = LEVELS.slice().reverse().find(l => points >= l.minPoints) || LEVELS[0];
    const nextLevelInfo = LEVELS.find(l => l.level === currentLevelInfo.level + 1);

    // Calculate progress percentage to next level
    let progress = 0;
    if (nextLevelInfo) {
        const pointsInCurrentLevel = points - currentLevelInfo.minPoints;
        const totalPointsNeededForNextLevel = nextLevelInfo.minPoints - currentLevelInfo.minPoints;
        progress = Math.min(100, Math.max(0, (pointsInCurrentLevel / totalPointsNeededForNextLevel) * 100));
    } else {
        progress = 100; // Max level reached
    }

    /**
     * Add points for an action
     * @param {number} amount - Amount of points to add
     * @param {string} reason - Description of why points were added
     */
    const addPoints = (amount, reason) => {
        setPoints(prev => prev + amount);

        const transaction = {
            id: Date.now().toString(),
            amount,
            reason,
            date: new Date().toISOString()
        };

        setHistory(prev => [transaction, ...prev].slice(0, 100)); // Keep last 100 transactions
    };

    return {
        points,
        level: currentLevelInfo.level,
        title: currentLevelInfo.title,
        progressToNext: progress,
        nextLevelPoints: nextLevelInfo ? nextLevelInfo.minPoints : null,
        addPoints,
        history
    };
}

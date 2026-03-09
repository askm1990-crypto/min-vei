import { useRecoveryStore } from '../store/useRecoveryStore';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface LevelInfo {
    level: number;
    title: string;
    minPoints: number;
}

interface ScoreHistoryEntry {
    id: string;
    amount: number;
    reason: string;
    date: string;
}

type PointsMap = {
    SOBER_DAY: number;
    CRAVING_RESISTED: number;
    JOURNAL_ENTRY: number;
    BREATHING_EXERCISE: number;
    DAILY_CHALLENGE: number;
    CRISIS_PLAN_COMPLETE: number;
    GOAL_SET: number;
    GOAL_COMPLETE: number;
    KNOWLEDGE_COMPLETE: number;
    CRAVING_LOGGED_ONLY: number;
    RELAPSE_HONESTY: number;
    STREAK_3_DAYS: number;
    STREAK_7_DAYS: number;
    STREAK_30_DAYS: number;
};

interface RecoveryScoreResult {
    points: number;
    level: number;
    title: string;
    progressToNext: number;
    nextLevelPoints: number | null;
    addPoints: (amount: number, reason: string) => void;
    history: ScoreHistoryEntry[];
}

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

// Level thresholds
const LEVELS: LevelInfo[] = [
    { level: 1, title: 'Stuegris 🛋️', minPoints: 0 },
    { level: 2, title: 'Garasjeridder 👟', minPoints: 500 },
    { level: 3, title: "Kaffekoker'n ☕", minPoints: 2000 },
    { level: 4, title: 'Sukkerjunkie 🍬', minPoints: 5000 },
    { level: 5, title: 'Bruspulver-entusiast 🥤', minPoints: 10000 },
    { level: 6, title: 'Pepsi Max-proff 🏁', minPoints: 18000 },
    { level: 7, title: 'Endorfin-jeger 🏃‍♂️', minPoints: 28000 },
    { level: 8, title: 'Tåkeløfter 🌫️', minPoints: 40000 },
    { level: 9, title: 'Våghals i tøfler 🏠', minPoints: 55000 },
    { level: 10, title: 'Hobby-filosof 🧠', minPoints: 75000 },
    { level: 11, title: 'Gummistøvel-Zen 🧘', minPoints: 95000 },
    { level: 12, title: 'Recovery-Legende 👑', minPoints: 120000 }
];

// Point values for actions
export const POINTS: PointsMap = {
    SOBER_DAY: 50,
    CRAVING_RESISTED: 100,
    JOURNAL_ENTRY: 30,
    BREATHING_EXERCISE: 15,
    DAILY_CHALLENGE: 100,
    CRISIS_PLAN_COMPLETE: 1000,
    GOAL_SET: 50,
    GOAL_COMPLETE: 200,
    KNOWLEDGE_COMPLETE: 50,
    CRAVING_LOGGED_ONLY: 20,
    RELAPSE_HONESTY: 20,
    // Streak Milestones
    STREAK_3_DAYS: 100,
    STREAK_7_DAYS: 500,
    STREAK_30_DAYS: 2000
};

/**
 * Hook to manage Recovery Score and Levels
 */
export function useRecoveryScore(): RecoveryScoreResult {
    // Current total points
    const { score: points, setScore: setPoints, history, setHistory } = useRecoveryStore();

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
     * @param amount - Amount of points to add
     * @param reason - Description of why points were added
     */
    const addPoints = (amount: number, reason: string): void => {
        setPoints(prev => prev + amount);

        const transaction: ScoreHistoryEntry = {
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

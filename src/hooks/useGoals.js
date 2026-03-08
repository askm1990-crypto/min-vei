import { useGoalsStore } from '../store/useGoalsStore';

export function useGoals() {
    const { goals, setGoals } = useGoalsStore();

    const getGoals = () => {
        return [...goals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const getActiveGoals = () => getGoals().filter(g => g.status === 'active');
    const getCompletedGoals = () => getGoals().filter(g => g.status === 'completed');

    const addGoal = (goalData) => {
        const newGoal = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: 'active', // 'active' | 'completed'
            ...goalData
        };
        setGoals(prev => [newGoal, ...prev]);
        return newGoal;
    };

    const completeGoal = (id) => {
        setGoals(prev => prev.map(g =>
            g.id === id ? { ...g, status: 'completed', completedAt: new Date().toISOString() } : g
        ));
    };

    const deleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const updateGoal = (id, updates) => {
        setGoals(prev => prev.map(g =>
            g.id === id ? { ...g, ...updates } : g
        ));
    };

    return {
        goals: getGoals(),
        activeGoals: getActiveGoals(),
        completedGoals: getCompletedGoals(),
        addGoal,
        completeGoal,
        deleteGoal,
        updateGoal
    };
}

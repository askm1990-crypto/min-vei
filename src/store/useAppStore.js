import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Legacy Migration ---
// App state used to be spread across multiple useLocalStorage keys.
// We merge them into 'mv2_app' if it doesn't exist yet.
const migrateLegacyAppState = () => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('mv2_app')) {
        const getLegacy = (key, defaultVal) => {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultVal;
            } catch {
                return defaultVal;
            }
        };

        const legacyState = {
            consent: getLegacy('mv2_consent', false),
            user: getLegacy('mv2_user', null),
            spending: getLegacy('mv2_spending', null),
            disclaimerVisible: getLegacy('mv2_disclaimer', true),
            guideSeen: getLegacy('mv2_guide_seen', false),
            theme: getLegacy('mv2_theme', 'light')
        };

        const wrapped = { state: legacyState, version: 0 };
        window.localStorage.setItem('mv2_app', JSON.stringify(wrapped));
    }
};

migrateLegacyAppState();

export const useAppStore = create(
    persist(
        (set) => ({
            // Persisted State
            consent: false,
            user: null,
            spending: null,
            disclaimerVisible: true,
            guideSeen: false,
            theme: 'light',

            // Ephemeral State (Excluded from persistence)
            currentView: 'dashboard',
            activeEventId: null,
            isMenuOpen: false,
            isLocked: typeof window !== 'undefined' ? !!window.localStorage.getItem('mv2_pin') : false,
            showGuide: false,

            // Actions - Persisted
            setConsent: (consent) => set({ consent }),
            setUser: (user) => set({ user }),
            setSpending: (spending) => set({ spending }),
            setDisclaimerVisible: (disclaimerVisible) => set({ disclaimerVisible }),
            setGuideSeen: (guideSeen) => set({ guideSeen }),
            setTheme: (theme) => {
                set({ theme });
                document.body.classList.toggle('dark-mode', theme === 'dark');
            },
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                document.body.classList.toggle('dark-mode', newTheme === 'dark');
                return { theme: newTheme };
            }),

            // Actions - Ephemeral
            setCurrentView: (view) => set({ currentView: view }),
            setActiveEventId: (id) => set({ activeEventId: id }),
            setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
            setIsLocked: (isLocked) => set({ isLocked }),
            setShowGuide: (show) => set({ showGuide: show }),

            // App Navigation helper
            navigate: (view, payload = null) => set((state) => {
                let activeEventId = state.activeEventId;
                if (view === 'log-wizard-pending' && payload) {
                    activeEventId = payload;
                } else if (view !== 'log-wizard-pending') {
                    activeEventId = null;
                }
                return { currentView: view, activeEventId };
            }),
        }),
        {
            name: 'mv2_app',
            // Only persist these specific fields
            partialize: (state) => ({
                consent: state.consent,
                user: state.user,
                spending: state.spending,
                disclaimerVisible: state.disclaimerVisible,
                guideSeen: state.guideSeen,
                theme: state.theme
            }),
            onRehydrateStorage: () => (state) => {
                // Ensure body class matches theme on load
                if (state && state.theme === 'dark') {
                    document.body.classList.add('dark-mode');
                }
            }
        }
    )
);

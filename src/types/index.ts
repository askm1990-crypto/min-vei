export type DateString = string;

export interface User {
    name: string;
    startDate?: DateString;
    substances?: string[];
    goal?: string;
    [key: string]: any;
}

export interface JournalEntry {
    id: string;
    date: DateString;
    body: string;
    mood?: string;
    [key: string]: any;
}

export interface Event {
    id: string;
    date?: DateString;
    createdAt?: DateString;
    triggers?: string[];
    intensity?: number;
    outcome?: string;
    strategies?: string[];
    [key: string]: any;
}

export interface Goal {
    id: string;
    title?: string;
    text?: string;
    category?: string;
    isCompleted?: boolean;
    completed?: boolean;
    [key: string]: any;
}

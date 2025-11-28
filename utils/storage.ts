import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
    id: string;
    content: string;
    mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'positive' | 'negative' | 'mixed';
    timestamp: number;
    tags: string[];
    updatedAt?: number;
}

export interface StorageStats {
    totalEntries: number;
    streakDays: number;
    oldestEntry: number | null;
    newestEntry: number | null;
}

const STORAGE_KEY = '@mindsafe_journal_data';

// --- Basic Encryption/Obfuscation ---
// Simple Base64 encoding to prevent plain text reading
const encrypt = (data: string): string => {
    try {
        return btoa(encodeURIComponent(data));
    } catch (e) {
        console.error('Encryption failed', e);
        return data;
    }
};

const decrypt = (data: string): string => {
    try {
        return decodeURIComponent(atob(data));
    } catch (e) {
        console.error('Decryption failed', e);
        return data;
    }
};

// Polyfill for btoa/atob in React Native if needed
// (React Native usually provides these, but just in case or use a library)
// Actually, React Native includes btoa/atob in the JS environment since 0.54.

// --- Storage Functions ---

export const saveEntry = async (entryData: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> => {
    try {
        const entries = await getAllEntries();
        const now = Date.now();
        const newEntry: JournalEntry = {
            ...entryData,
            id: now.toString() + Math.random().toString(36).substr(2, 9),
            timestamp: now,
            updatedAt: now,
        };

        const updatedEntries = [newEntry, ...entries];
        await saveData(updatedEntries);
        return newEntry;
    } catch (e) {
        console.error('Error saving entry:', e);
        throw new Error('Failed to save entry');
    }
};

export const getAllEntries = async (): Promise<JournalEntry[]> => {
    try {
        const encryptedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (!encryptedData) return [];

        const jsonString = decrypt(encryptedData);
        const entries: JournalEntry[] = JSON.parse(jsonString);

        // Ensure sorted by date (newest first)
        return entries.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
        console.error('Error getting entries:', e);
        // If decryption fails or JSON parse fails, return empty to avoid app crash, 
        // but log error.
        return [];
    }
};

export const getEntryById = async (id: string): Promise<JournalEntry | null> => {
    try {
        const entries = await getAllEntries();
        return entries.find(e => e.id === id) || null;
    } catch (e) {
        console.error('Error getting entry by id:', e);
        throw new Error('Failed to retrieve entry');
    }
};

export const deleteEntry = async (id: string): Promise<void> => {
    try {
        const entries = await getAllEntries();
        const updatedEntries = entries.filter(e => e.id !== id);
        await saveData(updatedEntries);
    } catch (e) {
        console.error('Error deleting entry:', e);
        throw new Error('Failed to delete entry');
    }
};

export const deleteAllEntries = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Error deleting all entries:', e);
        throw new Error('Failed to clear storage');
    }
};

export const exportDataAsJSON = async (): Promise<string> => {
    try {
        const entries = await getAllEntries();
        return JSON.stringify(entries, null, 2);
    } catch (e) {
        console.error('Error exporting data:', e);
        throw new Error('Failed to export data');
    }
};

export const importDataFromJSON = async (jsonString: string): Promise<void> => {
    try {
        const entries = JSON.parse(jsonString);
        if (!Array.isArray(entries)) throw new Error("Invalid data format");
        await saveData(entries);
    } catch (e) {
        console.error('Error importing data:', e);
        throw new Error('Failed to import data');
    }
}

export const searchEntries = async (keyword: string): Promise<JournalEntry[]> => {
    try {
        const entries = await getAllEntries();
        const lowerKeyword = keyword.toLowerCase();
        return entries.filter(entry =>
            entry.content.toLowerCase().includes(lowerKeyword) ||
            entry.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
        );
    } catch (e) {
        console.error('Error searching entries:', e);
        return [];
    }
};

export const getStats = async (): Promise<StorageStats> => {
    try {
        const entries = await getAllEntries();
        const totalEntries = entries.length;

        if (totalEntries === 0) {
            return {
                totalEntries: 0,
                streakDays: 0,
                oldestEntry: null,
                newestEntry: null,
            };
        }

        const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
        const newestEntry = sortedEntries[0].timestamp;
        const oldestEntry = sortedEntries[sortedEntries.length - 1].timestamp;

        // Calculate Streak
        // A streak is consecutive days with at least one entry.
        // We iterate backwards from today (or the most recent entry if it's today/yesterday).

        let streakDays = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Group entries by date string (YYYY-MM-DD)
        const entryDates = new Set(sortedEntries.map(e => {
            const d = new Date(e.timestamp);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }));

        // Check if we have an entry for today
        let currentCheckDate = today.getTime();
        if (!entryDates.has(currentCheckDate)) {
            // If no entry today, check yesterday. If yes, streak continues from yesterday.
            // If no entry yesterday either, streak is 0 (unless we count today as day 0 of potential streak?)
            // Usually streak implies active consecutive days ending today or yesterday.
            currentCheckDate -= 86400000; // Subtract 1 day
            if (!entryDates.has(currentCheckDate)) {
                streakDays = 0;
            }
        }

        // If we found a starting point (today or yesterday), count backwards
        if (entryDates.has(currentCheckDate)) {
            while (entryDates.has(currentCheckDate)) {
                streakDays++;
                currentCheckDate -= 86400000;
            }
        }

        return {
            totalEntries,
            streakDays,
            oldestEntry,
            newestEntry,
        };
    } catch (e) {
        console.error('Error calculating stats:', e);
        return {
            totalEntries: 0,
            streakDays: 0,
            oldestEntry: null,
            newestEntry: null,
        };
    }
};

// --- Internal Helper ---

const saveData = async (entries: JournalEntry[]) => {
    const jsonString = JSON.stringify(entries);
    const encryptedData = encrypt(jsonString);
    await AsyncStorage.setItem(STORAGE_KEY, encryptedData);
};

// --- Clear Storage (Alias for consistency) ---
export const clearEntries = deleteAllEntries;

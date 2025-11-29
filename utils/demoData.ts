// Demo data for MindSafe Journal - Hackathon Presentation
// 15 realistic journal entries spanning different moods and dates

export const demoEntries = [
    {
        id: 'demo-1',
        content: "Started my new job today! The team seems amazing and everyone was so welcoming. I'm excited but also a bit nervous about the learning curve ahead. Had a great lunch with my new colleagues and we talked about everything from tech to travel. Feeling optimistic about this new chapter!",
        mood: 'happy',
        tags: ['joy', 'anticipation', 'excitement'],
        timestamp: Date.now() - (0 * 24 * 60 * 60 * 1000), // Today
    },
    {
        id: 'demo-2',
        content: "Meditation session this morning was exactly what I needed. 20 minutes of just breathing and being present. It's amazing how much clearer my mind feels afterwards. No racing thoughts, just peace. I should really make this a daily habit.",
        mood: 'calm',
        tags: ['peace', 'contentment'],
        timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // Yesterday
    },
    {
        id: 'demo-3',
        content: "Productive day at work but feeling a bit overwhelmed with the new project timeline. So many moving pieces to coordinate. Need to remember to take breaks and not let perfectionism slow me down. One step at a time.",
        mood: 'neutral',
        tags: ['stress'],
        timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-4',
        content: "Had an argument with my best friend today. I said things I didn't mean. Feeling guilty and sad about it. I know I need to apologize, but my ego is getting in the way. Tomorrow I'll reach out and make things right.",
        mood: 'sad',
        tags: ['sadness', 'guilt', 'regret'],
        timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-5',
        content: "Presentation at work didn't go as planned. My slides froze, I stuttered through my talking points, and I could see people checking their phones. Heart still racing hours later. Why do I always mess up the important moments?",
        mood: 'anxious',
        tags: ['fear', 'worry', 'stress'],
        timestamp: Date.now() - (4 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-6',
        content: "Weekend hike with friends was incredible! The view from the summit was breathtaking. We laughed so much my cheeks hurt. These are the moments that make life beautiful. Grateful for good friends and nature.",
        mood: 'happy',
        tags: ['joy', 'gratitude', 'excitement'],
        timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-7',
        content: "Rainy Sunday. Made tea, read a book, and just existed. No pressure to be productive. Sometimes the best thing you can do is nothing at all. Feeling recharged.",
        mood: 'calm',
        tags: ['peace', 'contentment'],
        timestamp: Date.now() - (6 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-8',
        content: "Mom's birthday dinner tonight. Family gatherings are always a mix of joy and stress. Love seeing everyone but the small talk exhausts me. At least the food was good!",
        mood: 'neutral',
        tags: ['stress'],
        timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-9',
        content: "Got some difficult news about my health test results. Nothing serious, but requires lifestyle changes. Feeling scared and a bit sorry for myself. I know I'll adapt, but right now it feels overwhelming.",
        mood: 'sad',
        tags: ['sadness', 'fear', 'worry'],
        timestamp: Date.now() - (10 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-10',
        content: "Can't stop thinking about that email I need to send. What if they say no? What if I'm not good enough? My mind won't shut off. Need to practice those breathing exercises again.",
        mood: 'anxious',
        tags: ['fear', 'worry', 'stress'],
        timestamp: Date.now() - (12 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-11',
        content: "Finished that personal project I've been working on for months! It's finally live and people are actually using it. This feeling of accomplishment is incredible. All those late nights were worth it!",
        mood: 'happy',
        tags: ['joy', 'pride', 'excitement'],
        timestamp: Date.now() - (14 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-12',
        content: "Therapy session today was really productive. We talked about my tendency to people-please and how it's draining my energy. Working on setting boundaries. It's hard but necessary. Feeling hopeful about the progress.",
        mood: 'calm',
        tags: ['peace', 'gratitude'],
        timestamp: Date.now() - (17 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-13',
        content: "Just another Monday. Work was fine, nothing special. Gym after work. Dinner. TV. Is this all there is? Not sad, not happy, just... existing. Maybe I need to switch things up.",
        mood: 'neutral',
        tags: [],
        timestamp: Date.now() - (20 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-14',
        content: "Watched the sunset alone today and cried. Not sure why. Just felt this wave of emotion. Life feels heavy sometimes. Missing the way things used to be, missing people who aren't around anymore.",
        mood: 'sad',
        tags: ['sadness', 'grief'],
        timestamp: Date.now() - (25 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'demo-15',
        content: "Surprise visit from an old friend! We stayed up until 2am talking and laughing like no time had passed. These connections are what life is about. Feeling so full of love and gratitude right now.",
        mood: 'happy',
        tags: ['joy', 'gratitude', 'love'],
        timestamp: Date.now() - (30 * 24 * 60 * 60 * 1000),
    },
];

// Function to load demo data into storage
export const loadDemoData = async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const { encrypt } = require('./encryption');

    try {
        const STORAGE_KEY = 'mindsafe_journal_entries';
        const jsonString = JSON.stringify(demoEntries);
        const encryptedData = encrypt(jsonString);
        await AsyncStorage.setItem(STORAGE_KEY, encryptedData);
        return { success: true, count: demoEntries.length };
    } catch (error) {
        console.error('Error loading demo data:', error);
        return { success: false, error };
    }
};

export default { demoEntries, loadDemoData };

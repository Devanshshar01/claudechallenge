import { JournalEntry } from './storage';

// --- Word Lists ---

const POSITIVE_WORDS = new Set([
    'happy', 'joy', 'delight', 'love', 'wonderful', 'fantastic', 'great', 'good', 'excellent', 'amazing',
    'peace', 'calm', 'serene', 'tranquil', 'relaxed', 'content', 'satisfied', 'grateful', 'thankful',
    'hope', 'optimistic', 'excited', 'enthusiastic', 'inspired', 'motivated', 'proud', 'accomplished',
    'confident', 'strong', 'capable', 'brave', 'courageous', 'safe', 'secure', 'supported', 'loved',
    'appreciated', 'valued', 'precious', 'beautiful', 'lovely', 'charming', 'radiant', 'bright', 'sunny',
    'warm', 'cozy', 'comfortable', 'refreshing', 'renewed', 'energized', 'alive', 'vibrant', 'thriving',
    'growing', 'learning', 'improving', 'better', 'best', 'success', 'victory', 'win', 'achievement',
    'progress', 'forward', 'upward', 'light', 'clarity', 'understanding', 'wisdom', 'insight', 'creative',
    'productive', 'flow', 'easy', 'smooth', 'grace', 'kind', 'gentle', 'compassionate', 'forgiving',
    'accepting', 'open', 'free', 'liberated', 'fun', 'laugh', 'smile', 'humor', 'play', 'enjoy',
    'pleasure', 'bliss', 'ecstasy', 'euphoria', 'harmony', 'balance', 'connection', 'unity', 'friend',
    'family', 'together', 'share', 'give', 'help', 'serve', 'contribute', 'meaning', 'purpose', 'worth',
    'lucky', 'fortunate', 'blessed', 'miracle', 'magic', 'wonder', 'awe', 'sublime', 'divine', 'spirit'
]);

const NEGATIVE_WORDS = new Set([
    'sad', 'unhappy', 'depressed', 'gloomy', 'miserable', 'sorrow', 'grief', 'cry', 'tears', 'pain',
    'hurt', 'ache', 'suffer', 'agony', 'torment', 'torture', 'bad', 'terrible', 'awful', 'horrible',
    'dreadful', 'worst', 'failure', 'lose', 'defeat', 'mistake', 'error', 'wrong', 'guilt', 'shame',
    'regret', 'sorry', 'apology', 'fault', 'blame', 'angry', 'mad', 'furious', 'rage', 'hate',
    'dislike', 'resent', 'jealous', 'envy', 'bitter', 'frustrated', 'annoyed', 'irritated', 'bothered',
    'stress', 'tense', 'pressure', 'overwhelmed', 'burden', 'heavy', 'tired', 'exhausted', 'drained',
    'fatigue', 'weary', 'weak', 'sick', 'ill', 'nausea', 'dizzy', 'headache', 'anxious', 'nervous',
    'scared', 'afraid', 'fear', 'terror', 'panic', 'worry', 'concern', 'doubt', 'uncertain', 'confused',
    'lost', 'alone', 'lonely', 'isolated', 'rejected', 'abandoned', 'ignored', 'neglected', 'empty',
    'hollow', 'numb', 'dead', 'dark', 'cold', 'frozen', 'stuck', 'trapped', 'helpless', 'hopeless',
    'despair', 'useless', 'worthless', 'stupid', 'idiot', 'fool', 'crazy', 'insane', 'madness', 'chaos',
    'mess', 'disaster', 'crisis', 'problem', 'trouble', 'conflict', 'fight', 'argue', 'enemy', 'threat'
]);

const EMOTION_KEYWORDS = {
    joy: ['happy', 'joy', 'excited', 'delight', 'wonderful', 'amazing', 'great', 'love', 'laugh', 'smile'],
    sadness: ['sad', 'cry', 'grief', 'sorrow', 'depressed', 'gloomy', 'miserable', 'lonely', 'miss', 'heartbroken'],
    anxiety: ['anxious', 'worry', 'nervous', 'scared', 'afraid', 'fear', 'panic', 'stress', 'overwhelmed', 'tense'],
    anger: ['angry', 'mad', 'furious', 'rage', 'hate', 'resent', 'annoyed', 'irritated', 'frustrated', 'bitter'],
    peace: ['calm', 'peace', 'relaxed', 'serene', 'tranquil', 'quiet', 'still', 'balance', 'harmony', 'content'],
};

// --- Types ---

export interface SentimentResult {
    mood: 'positive' | 'negative' | 'neutral' | 'mixed';
    intensity: number; // 0-1
    confidence: number; // 0-1
    emotions: {
        joy: number;
        sadness: number;
        anxiety: number;
        anger: number;
        peace: number;
    };
    insight: string;
    timestamp: number;
}

export interface PatternAnalysis {
    trends: {
        weekly: 'improving' | 'declining' | 'stable' | 'fluctuating';
        monthly: 'improving' | 'declining' | 'stable' | 'fluctuating';
    };
    averageMood: string;
    recommendations: string[];
    needsSupport: boolean;
    totalEntries: number;
    moodCounts: Record<string, number>;
    dominantMood: string;
}

// --- Helper Functions ---

const tokenize = (text: string): string[] => {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0);
};

const getInsight = (mood: string, dominantEmotion: string, intensity: number): string => {
    if (mood === 'positive') {
        if (dominantEmotion === 'peace') return "You seem to be in a good place. Cherish this calm.";
        return "It's great to see you feeling positive! Hold onto this energy.";
    }
    if (mood === 'negative') {
        if (intensity > 0.7) return "It sounds like you're going through a really tough time. Be gentle with yourself.";
        if (dominantEmotion === 'anxiety') return "Anxiety can be overwhelming. Remember to breathe and take it one step at a time.";
        if (dominantEmotion === 'anger') return "It's okay to feel angry. Try to channel that energy into something constructive or let it out safely.";
        if (dominantEmotion === 'sadness') return "Sorrow is a heavy burden. It's okay to not be okay right now.";
        return "Things seem difficult right now. Remember that this feeling is temporary.";
    }
    if (mood === 'mixed') {
        return "You're experiencing a mix of emotions. It's complex, just like life.";
    }
    return "A neutral day is a steady day. Keep moving forward.";
};

// --- Exported Functions ---

export const analyzeEntry = (text: string): SentimentResult => {
    const tokens = tokenize(text);
    if (tokens.length === 0) {
        return {
            mood: 'neutral',
            intensity: 0,
            confidence: 0,
            emotions: { joy: 0, sadness: 0, anxiety: 0, anger: 0, peace: 0 },
            insight: "Start writing to see insights.",
            timestamp: Date.now(),
        };
    }

    let posCount = 0;
    let negCount = 0;
    const emotionCounts = { joy: 0, sadness: 0, anxiety: 0, anger: 0, peace: 0 };

    tokens.forEach(token => {
        if (POSITIVE_WORDS.has(token)) posCount++;
        if (NEGATIVE_WORDS.has(token)) negCount++;

        Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
            if (keywords.includes(token)) {
                emotionCounts[emotion as keyof typeof emotionCounts]++;
            }
        });
    });

    const totalEmotionalWords = posCount + negCount;
    const totalWords = tokens.length;

    // Calculate Mood
    let mood: SentimentResult['mood'] = 'neutral';
    if (posCount > negCount && posCount > 0) mood = 'positive';
    else if (negCount > posCount && negCount > 0) mood = 'negative';
    else if (posCount > 0 && negCount > 0 && posCount === negCount) mood = 'mixed';

    // Calculate Intensity (ratio of emotional words to total words, capped)
    const intensity = Math.min(totalEmotionalWords / Math.max(totalWords, 5), 1);

    // Calculate Confidence (based on text length and density of emotional words)
    const confidence = Math.min((totalWords / 10) * (intensity + 0.5), 1);

    // Determine dominant emotion for insight
    let dominantEmotion = 'neutral';
    let maxEmotionCount = 0;
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
        if (count > maxEmotionCount) {
            maxEmotionCount = count;
            dominantEmotion = emotion;
        }
    });

    return {
        mood,
        intensity,
        confidence,
        emotions: emotionCounts,
        insight: getInsight(mood, dominantEmotion, intensity),
        timestamp: Date.now(),
    };
};

export const analyzePatterns = (entries: JournalEntry[]): PatternAnalysis => {
    const totalEntries = entries.length;
    const moodCounts = entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    let dominantMood = 'neutral';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantMood = mood;
        }
    });

    if (entries.length === 0) {
        return {
            trends: { weekly: 'stable', monthly: 'stable' },
            averageMood: 'neutral',
            recommendations: ["Start journaling to get personalized insights."],
            needsSupport: false,
            totalEntries: 0,
            moodCounts: {},
            dominantMood: 'neutral',
        };
    }

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);

    // Calculate scores for trend analysis (Positive = 1, Neutral = 0, Negative = -1)
    const getScore = (mood: string) => {
        if (['happy', 'joy', 'excited', 'calm', 'peace', 'positive'].includes(mood)) return 1;
        if (['sad', 'depressed', 'grief', 'anxious', 'fear', 'angry', 'negative'].includes(mood)) return -1;
        return 0;
    };

    const scores = sortedEntries.map(e => getScore(e.mood));
    const recentScores = scores.slice(-7); // Last 7 entries
    const avgScore = scores.reduce((a: number, b) => a + b, 0) / scores.length;
    const recentAvg = recentScores.reduce((a: number, b) => a + b, 0) / recentScores.length;

    let weeklyTrend: PatternAnalysis['trends']['weekly'] = 'stable';
    if (recentAvg > avgScore + 0.3) weeklyTrend = 'improving';
    else if (recentAvg < avgScore - 0.3) weeklyTrend = 'declining';
    else if (Math.abs(recentAvg - avgScore) > 0.5) weeklyTrend = 'fluctuating';

    // Check for support need (consistently negative recently)
    const needsSupport = recentScores.length >= 3 && recentAvg < -0.6;

    const recommendations: string[] = [];
    if (needsSupport) {
        recommendations.push("You've been feeling down lately. Consider reaching out to a friend or professional.");
        recommendations.push("Try a small self-care activity today, like a short walk or deep breathing.");
    } else if (weeklyTrend === 'improving') {
        recommendations.push("You're on an upward trend! Keep doing what you're doing.");
    } else if (weeklyTrend === 'declining') {
        recommendations.push("It seems like a tough week. Be kind to yourself.");
    } else {
        recommendations.push("Consistency is key. Keep journaling to understand your patterns better.");
    }

    return {
        trends: {
            weekly: weeklyTrend,
            monthly: 'stable',
        },
        averageMood: avgScore > 0.3 ? 'positive' : avgScore < -0.3 ? 'negative' : 'neutral',
        recommendations,
        needsSupport,
        totalEntries,
        moodCounts,
        dominantMood,
    };
};

export const getMoodEmoji = (mood: string): string => {
    switch (mood) {
        case 'happy': return '😊';
        case 'joy': return '😄';
        case 'excited': return '🤩';
        case 'calm': return '😌';
        case 'peace': return '☮️';
        case 'neutral': return '😐';
        case 'sad': return '😔';
        case 'depressed': return '😢';
        case 'anxious': return '😰';
        case 'nervous': return '😬';
        case 'angry': return '😠';
        case 'frustrated': return '😤';
        case 'positive': return '🙂';
        case 'negative': return '🙁';
        case 'mixed': return '🤔';
        default: return '😶';
    }
};

export const getMoodColor = (mood: string): string => {
    switch (mood) {
        case 'happy':
        case 'joy':
        case 'positive':
            return '#F59E0B'; // Amber/Orange
        case 'calm':
        case 'peace':
            return '#10B981'; // Emerald Green
        case 'neutral':
            return '#94A3B8'; // Slate Gray
        case 'sad':
        case 'depressed':
        case 'negative':
            return '#64748B'; // Blue Gray
        case 'anxious':
        case 'nervous':
            return '#8B5CF6'; // Violet
        case 'angry':
            return '#EF4444'; // Red
        case 'mixed':
            return '#F472B6'; // Pink
        default:
            return '#CBD5E1';
    }
};

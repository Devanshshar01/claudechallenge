import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

import { PrivacyBadge } from '@/components/PrivacyBadge';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { analyzeEntry, getMoodColor, getMoodEmoji, SentimentResult } from '@/utils/analysis';
import { saveEntry } from '@/utils/storage';

const { width } = Dimensions.get('window');

export default function JournalScreen() {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SentimentResult | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const charCount = text.length;
    const canAnalyze = charCount > 20;

    const handleAnalyze = async () => {
        if (!canAnalyze) return;

        setIsAnalyzing(true);
        // Simulate a brief delay for "processing" feel and animation
        setTimeout(() => {
            const analysis = analyzeEntry(text);
            setResult(analysis);
            setIsAnalyzing(false);
        }, 1500);
    };

    const handleSave = async () => {
        if (!result) return;

        try {
            await saveEntry({
                content: text,
                mood: result.mood,
                tags: Object.entries(result.emotions)
                    .filter(([_, score]) => score > 0)
                    .map(([emotion]) => emotion),
            });

            setIsSaved(true);
            Alert.alert(
                "Saved Successfully",
                "Your entry has been saved to your private journal.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to save entry. Please try again.");
        }
    };

    const handleClear = () => {
        Alert.alert(
            "Clear Entry",
            "Are you sure you want to clear your writing?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                        setText('');
                        setResult(null);
                        setIsSaved(false);
                    }
                }
            ]
        );
    };

    return (
        <LinearGradient
            colors={[theme.background, '#E0E7FF', theme.background]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* Header */}
                    <View style={styles.header}>
                        <PrivacyBadge />
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={32} color={theme.subtext} />
                        </TouchableOpacity>
                    </View>

                    {/* Writing Area */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="How are you feeling today?"
                            placeholderTextColor={theme.subtext}
                            multiline
                            textAlignVertical="top"
                            value={text}
                            onChangeText={(t) => {
                                setText(t);
                                if (result) setResult(null); // Reset result on edit
                            }}
                        />
                        <View style={styles.counterContainer}>
                            <Text style={[styles.counterText, { color: theme.subtext }]}>
                                {wordCount} words | {charCount} chars
                            </Text>
                        </View>
                    </View>

                    {/* Analysis Loading State */}
                    {isAnalyzing && (
                        <Animated.View entering={FadeInUp} style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.primary} />
                            <Text style={[styles.loadingText, { color: theme.primary }]}>
                                Analyzing your thoughts...
                            </Text>
                        </Animated.View>
                    )}

                    {/* Analysis Result */}
                    {result && !isAnalyzing && (
                        <Animated.View
                            entering={FadeInDown.springify()}
                            layout={Layout.springify()}
                            style={[styles.resultCard, { backgroundColor: theme.card }]}
                        >
                            <View style={styles.resultHeader}>
                                <Text style={[styles.moodEmoji]}>{getMoodEmoji(result.mood)}</Text>
                                <View>
                                    <Text style={[styles.moodTitle, { color: theme.text }]}>
                                        {result.mood.charAt(0).toUpperCase() + result.mood.slice(1)} Mood
                                    </Text>
                                    <Text style={[styles.confidenceText, { color: theme.subtext }]}>
                                        {Math.round(result.confidence * 100)}% Confidence
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={[styles.insightText, { color: theme.text }]}>
                                "{result.insight}"
                            </Text>

                            <View style={styles.emotionsContainer}>
                                {Object.entries(result.emotions).map(([emotion, score]) => (
                                    score > 0 && (
                                        <View key={emotion} style={[styles.emotionTag, { backgroundColor: getMoodColor(emotion) + '20' }]}>
                                            <Text style={[styles.emotionText, { color: getMoodColor(emotion) }]}>
                                                {emotion}
                                            </Text>
                                        </View>
                                    )
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Save Entry</Text>
                                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                </ScrollView>

                {/* Floating Action Bar (when not analyzing/showing result) */}
                {!result && !isAnalyzing && (
                    <Animated.View entering={FadeInUp} style={styles.actionBar}>
                        <TouchableOpacity
                            onPress={handleClear}
                            disabled={charCount === 0}
                            style={[styles.actionButton, styles.clearButton]}
                        >
                            <Ionicons name="trash-outline" size={24} color={charCount > 0 ? '#EF4444' : '#CBD5E1'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleAnalyze}
                            disabled={!canAnalyze}
                            style={[
                                styles.analyzeButton,
                                { backgroundColor: canAnalyze ? theme.primary : '#E2E8F0' }
                            ]}
                        >
                            <Text style={[styles.analyzeButtonText, { color: canAnalyze ? '#FFF' : '#94A3B8' }]}>
                                Analyze Mood
                            </Text>
                            <Ionicons name="sparkles" size={20} color={canAnalyze ? '#FFF' : '#94A3B8'} />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    closeButton: {
        padding: 4,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        fontSize: 18,
        lineHeight: 28,
        minHeight: 200,
        padding: 0,
    },
    counterContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    counterText: {
        fontSize: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    resultCard: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    moodEmoji: {
        fontSize: 48,
    },
    moodTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    confidenceText: {
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    insightText: {
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 24,
        marginBottom: 20,
    },
    emotionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    emotionTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    emotionText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionBar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    clearButton: {
        // specific styles if needed
    },
    analyzeButton: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    analyzeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

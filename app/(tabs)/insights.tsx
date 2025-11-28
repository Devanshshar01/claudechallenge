import { MoodIndicator } from '@/components/MoodIndicator';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { analyzePatterns, PatternAnalysis } from '@/utils/analysis';
import { getEntries } from '@/utils/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function InsightsScreen() {
    const [stats, setStats] = useState<PatternAnalysis>({
        trends: { weekly: 'stable', monthly: 'stable' },
        averageMood: 'neutral',
        recommendations: [],
        needsSupport: false,
        totalEntries: 0,
        moodCounts: {},
        dominantMood: 'neutral'
    });
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const loadStats = async () => {
        const entries = await getEntries();
        const analysis = analyzePatterns(entries);
        setStats(analysis);
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Insights</Text>

            {/* Support Alert */}
            {stats.needsSupport && (
                <View style={[styles.alertCard, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
                    <View style={styles.alertHeader}>
                        <Ionicons name="heart" size={24} color="#EF4444" />
                        <Text style={[styles.alertTitle, { color: '#991B1B' }]}>We're here for you</Text>
                    </View>
                    <Text style={[styles.alertText, { color: '#7F1D1D' }]}>
                        You've been feeling down lately. Please remember to be kind to yourself. Consider reaching out to a friend or professional if you need support.
                    </Text>
                </View>
            )}

            {/* Recommendations */}
            {stats.recommendations.length > 0 && (
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.subtext }]}>Daily Insight</Text>
                    {stats.recommendations.map((rec, index) => (
                        <View key={index} style={styles.recommendationRow}>
                            <Ionicons name="bulb-outline" size={20} color={theme.primary} />
                            <Text style={[styles.recommendationText, { color: theme.text }]}>{rec}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.subtext }]}>Entries</Text>
                    <Text style={[styles.bigNumber, { color: theme.primary }]}>{stats.totalEntries}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.subtext }]}>Trend</Text>
                    <View style={styles.trendContainer}>
                        <Ionicons
                            name={stats.trends.weekly === 'improving' ? 'trending-up' : stats.trends.weekly === 'declining' ? 'trending-down' : 'remove'}
                            size={24}
                            color={stats.trends.weekly === 'improving' ? theme.success : stats.trends.weekly === 'declining' ? theme.warning : theme.subtext}
                        />
                        <Text style={[styles.trendText, { color: theme.text }]}>
                            {stats.trends.weekly.charAt(0).toUpperCase() + stats.trends.weekly.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.subtext }]}>Dominant Mood</Text>
                <View style={styles.dominantMoodContainer}>
                    <MoodIndicator mood={stats.dominantMood} size={48} />
                    <Text style={[styles.moodText, { color: theme.text }]}>
                        {stats.dominantMood.charAt(0).toUpperCase() + stats.dominantMood.slice(1)}
                    </Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mood Breakdown</Text>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {Object.entries(stats.moodCounts).map(([mood, count]) => (
                    <View key={mood} style={styles.row}>
                        <View style={styles.rowLabel}>
                            <MoodIndicator mood={mood} size={20} />
                            <Text style={[styles.rowText, { color: theme.text }]}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
                        </View>
                        <Text style={[styles.rowValue, { color: theme.text }]}>{count}</Text>
                    </View>
                ))}
                {Object.keys(stats.moodCounts).length === 0 && (
                    <Text style={{ color: theme.subtext, textAlign: 'center', padding: 20 }}>No data yet</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    alertCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    alertText: {
        fontSize: 14,
        lineHeight: 20,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    bigNumber: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    trendText: {
        fontSize: 16,
        fontWeight: '600',
    },
    dominantMoodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    moodText: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowText: {
        fontSize: 16,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendationRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 15,
        flex: 1,
        lineHeight: 22,
    },
});

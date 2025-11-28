import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { analyzePatterns, getMoodColor, getMoodEmoji, PatternAnalysis } from '@/utils/analysis';
import { deleteEntry, getAllEntries, getStats, JournalEntry } from '@/utils/storage';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [patterns, setPatterns] = useState<PatternAnalysis | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const loadData = async () => {
        const allEntries = await getAllEntries();
        const storageStats = await getStats();
        const patternAnalysis = analyzePatterns(allEntries);

        setEntries(allEntries);
        setStats(storageStats);
        setPatterns(patternAnalysis);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteEntry(id);
                        await loadData();
                        if (selectedEntry?.id === id) {
                            setSelectedEntry(null);
                        }
                    },
                },
            ]
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="journal-outline" size={80} color={theme.subtext} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                Start Your Journey
            </Text>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>
                Begin your journey to better mental wellness by writing your first entry
            </Text>
        </View>
    );

    const renderStatsCard = () => {
        if (!stats || !patterns) return null;

        return (
            <Animated.View entering={FadeInDown.delay(100)}>
                <LinearGradient
                    colors={[theme.primary, theme.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.statsCard}
                >
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.totalEntries}</Text>
                            <Text style={styles.statLabel}>Entries</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.streakDays}</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{getMoodEmoji(patterns.dominantMood)}</Text>
                            <Text style={styles.statLabel}>Main Mood</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        );
    };

    const renderLast7Days = () => {
        if (!entries || entries.length === 0) return null;

        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const dayEntries = entries.filter(e => {
                const entryDate = new Date(e.timestamp);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === date.getTime();
            });

            const dayName = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en', { weekday: 'short' });
            last7Days.push({ date, dayName, entries: dayEntries });
        }

        return (
            <Animated.View entering={FadeInDown.delay(200)} style={[styles.trendCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Last 7 Days</Text>
                <View style={styles.daysContainer}>
                    {last7Days.map((day, index) => (
                        <View key={index} style={styles.dayItem}>
                            <Text style={[styles.dayEmoji]}>
                                {day.entries.length > 0 ? getMoodEmoji(day.entries[0].mood) : '·'}
                            </Text>
                            <Text style={[styles.dayLabel, { color: theme.subtext }]}>{day.dayName}</Text>
                        </View>
                    ))}
                </View>
            </Animated.View>
        );
    };

    const renderMoodBreakdown = () => {
        if (!patterns || patterns.totalEntries === 0) return null;

        const total = patterns.totalEntries;
        const positiveCount = (patterns.moodCounts['happy'] || 0) +
            (patterns.moodCounts['calm'] || 0) +
            (patterns.moodCounts['positive'] || 0);
        const negativeCount = (patterns.moodCounts['sad'] || 0) +
            (patterns.moodCounts['anxious'] || 0) +
            (patterns.moodCounts['negative'] || 0);
        const neutralCount = patterns.moodCounts['neutral'] || 0;

        const positivePercent = Math.round((positiveCount / total) * 100);
        const negativePercent = Math.round((negativeCount / total) * 100);
        const neutralPercent = Math.round((neutralCount / total) * 100);

        return (
            <Animated.View entering={FadeInDown.delay(300)} style={[styles.breakdownCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Mood Distribution</Text>

                <View style={styles.breakdownBar}>
                    {positivePercent > 0 && (
                        <View style={[styles.barSegment, { width: `${positivePercent}%`, backgroundColor: '#10B981' }]} />
                    )}
                    {neutralPercent > 0 && (
                        <View style={[styles.barSegment, { width: `${neutralPercent}%`, backgroundColor: '#94A3B8' }]} />
                    )}
                    {negativePercent > 0 && (
                        <View style={[styles.barSegment, { width: `${negativePercent}%`, backgroundColor: '#64748B' }]} />
                    )}
                </View>

                <View style={styles.legendContainer}>
                    {positivePercent > 0 && (
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                            <Text style={[styles.legendText, { color: theme.subtext }]}>Positive {positivePercent}%</Text>
                        </View>
                    )}
                    {neutralPercent > 0 && (
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#94A3B8' }]} />
                            <Text style={[styles.legendText, { color: theme.subtext }]}>Neutral {neutralPercent}%</Text>
                        </View>
                    )}
                    {negativePercent > 0 && (
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#64748B' }]} />
                            <Text style={[styles.legendText, { color: theme.subtext }]}>Negative {negativePercent}%</Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        );
    };

    const renderEntryItem = ({ item, index }: { item: JournalEntry; index: number }) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
        const preview = item.content.substring(0, 60) + (item.content.length > 60 ? '...' : '');

        return (
            <Animated.View entering={FadeInUp.delay(index * 50)}>
                <TouchableOpacity
                    style={[styles.entryCard, { backgroundColor: theme.card }]}
                    onPress={() => setSelectedEntry(item)}
                    activeOpacity={0.7}
                >
                    <View style={styles.entryHeader}>
                        <View style={styles.entryMoodContainer}>
                            <Text style={styles.entryMoodEmoji}>{getMoodEmoji(item.mood)}</Text>
                            <View>
                                <Text style={[styles.entryDate, { color: theme.text }]}>{dateStr}</Text>
                                <Text style={[styles.entryTime, { color: theme.subtext }]}>{timeStr}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.entryPreview, { color: theme.subtext }]}>{preview}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderEntryModal = () => {
        if (!selectedEntry) return null;

        const date = new Date(selectedEntry.timestamp);
        const dateStr = date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

        return (
            <Modal
                visible={!!selectedEntry}
                animationType="slide"
                onRequestClose={() => setSelectedEntry(null)}
            >
                <LinearGradient
                    colors={[theme.background, '#E0E7FF', theme.background]}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setSelectedEntry(null)} style={styles.modalCloseButton}>
                            <Ionicons name="close-circle" size={32} color={theme.subtext} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.modalMoodHeader}>
                            <Text style={styles.modalMoodEmoji}>{getMoodEmoji(selectedEntry.mood)}</Text>
                            <View>
                                <Text style={[styles.modalDate, { color: theme.text }]}>{dateStr}</Text>
                                <Text style={[styles.modalTime, { color: theme.subtext }]}>{timeStr}</Text>
                            </View>
                        </View>

                        <View style={[styles.modalContentCard, { backgroundColor: theme.card }]}>
                            <Text style={[styles.modalEntryText, { color: theme.text }]}>
                                {selectedEntry.content}
                            </Text>
                        </View>

                        {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                            <View style={styles.modalTagsContainer}>
                                {selectedEntry.tags.map((tag, index) => (
                                    <View key={index} style={[styles.modalTag, { backgroundColor: getMoodColor(tag) + '20' }]}>
                                        <Text style={[styles.modalTagText, { color: getMoodColor(tag) }]}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </LinearGradient>
            </Modal>
        );
    };

    if (!stats || !patterns) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Insights</Text>
                {renderEmptyState()}
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                renderItem={renderEntryItem}
                ListHeaderComponent={() => (
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Insights</Text>
                        {renderStatsCard()}
                        {renderLast7Days()}
                        {renderMoodBreakdown()}
                        {patterns.recommendations.length > 0 && (
                            <Animated.View entering={FadeInDown.delay(400)} style={[styles.recommendCard, { backgroundColor: theme.card }]}>
                                <View style={styles.recommendHeader}>
                                    <Ionicons name="bulb" size={24} color={theme.primary} />
                                    <Text style={[styles.cardTitle, { color: theme.text }]}>For You</Text>
                                </View>
                                {patterns.recommendations.map((rec, index) => (
                                    <Text key={index} style={[styles.recommendText, { color: theme.subtext }]}>
                                        • {rec}
                                    </Text>
                                ))}
                            </Animated.View>
                        )}
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Entries</Text>
                    </View>
                )}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            {renderEntryModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 40,
    },
    statsCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.9,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#FFF',
        opacity: 0.3,
    },
    trendCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayItem: {
        alignItems: 'center',
        gap: 8,
    },
    dayEmoji: {
        fontSize: 24,
    },
    dayLabel: {
        fontSize: 10,
    },
    breakdownCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    breakdownBar: {
        flexDirection: 'row',
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
    barSegment: {
        height: '100%',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 14,
    },
    recommendCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    recommendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    recommendText: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 16,
    },
    entryCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    entryMoodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    entryMoodEmoji: {
        fontSize: 32,
    },
    entryDate: {
        fontSize: 14,
        fontWeight: '600',
    },
    entryTime: {
        fontSize: 12,
    },
    deleteButton: {
        padding: 8,
    },
    entryPreview: {
        fontSize: 14,
        lineHeight: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        paddingTop: 60,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalContent: {
        padding: 20,
    },
    modalMoodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    modalMoodEmoji: {
        fontSize: 56,
    },
    modalDate: {
        fontSize: 18,
        fontWeight: '600',
    },
    modalTime: {
        fontSize: 14,
    },
    modalContentCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
    },
    modalEntryText: {
        fontSize: 16,
        lineHeight: 26,
    },
    modalTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modalTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    modalTagText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});

import { EntryDetailModal } from '@/components/EntryDetailModal';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { analyzePatterns, getMoodColor, getMoodEmoji, PatternAnalysis } from '@/utils/analysis';
import { deleteEntry, getAllEntries, getStats, JournalEntry } from '@/utils/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MOOD_FILTERS = ['all', 'happy', 'calm', 'neutral', 'sad', 'anxious', 'positive', 'negative'];

export default function InsightsScreen() {
    const router = useRouter();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [patterns, setPatterns] = useState<PatternAnalysis | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showSearch, setShowSearch] = useState(false);

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const loadData = async () => {
        try {
            const allEntries = await getAllEntries();
            const storageStats = await getStats();
            const patternAnalysis = analyzePatterns(allEntries);

            setEntries(allEntries);
            setFilteredEntries(allEntries);
            setStats(storageStats);
            setPatterns(patternAnalysis);
        } catch (error) {
            console.error('Failed to load data:', error);
            Alert.alert('Error', 'Failed to load insights. Please try again.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await loadData();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // Handle Search & Filter
    useEffect(() => {
        let result = entries;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.content.toLowerCase().includes(lowerQuery) ||
                e.tags?.some(t => t.toLowerCase().includes(lowerQuery))
            );
        }

        if (activeFilter !== 'all') {
            result = result.filter(e => e.mood === activeFilter);
        }

        setFilteredEntries(result);
    }, [searchQuery, activeFilter, entries]);

    const handleDelete = (id: string) => {
        // This is now handled by the modal, but kept for list view swipe actions if added later
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

    const renderSearchBar = () => (
        <Animated.View entering={FadeInDown.delay(50)} style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="search" size={20} color={theme.subtext} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search entries..."
                    placeholderTextColor={theme.subtext}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={theme.subtext} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContainer}
            >
                {MOOD_FILTERS.map((mood) => (
                    <TouchableOpacity
                        key={mood}
                        style={[
                            styles.filterChip,
                            activeFilter === mood
                                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                                : { backgroundColor: theme.card, borderColor: theme.border }
                        ]}
                        onPress={() => setActiveFilter(mood)}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === mood ? { color: '#FFF' } : { color: theme.text }
                        ]}>
                            {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );

    const renderAchievements = () => {
        if (!stats) return null;

        const milestones = [
            { days: 1, label: 'First Step', icon: 'footsteps', achieved: stats.totalEntries >= 1 },
            { days: 7, label: 'Week Streak', icon: 'flame', achieved: stats.streakDays >= 7 },
            { days: 30, label: 'Monthly Master', icon: 'calendar', achieved: stats.streakDays >= 30 },
            { days: 100, label: 'Century Club', icon: 'trophy', achieved: stats.totalEntries >= 100 },
        ];

        return (
            <Animated.View entering={FadeInDown.delay(150)} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="ribbon" size={24} color={theme.primary} />
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Achievements</Text>
                </View>
                <View style={styles.achievementsGrid}>
                    {milestones.map((m, i) => (
                        <View key={i} style={[styles.achievementItem, !m.achieved && styles.achievementLocked]}>
                            <View style={[
                                styles.achievementIcon,
                                { backgroundColor: m.achieved ? theme.primary + '20' : theme.border }
                            ]}>
                                <Ionicons
                                    name={m.icon as any}
                                    size={24}
                                    color={m.achieved ? theme.primary : theme.subtext}
                                />
                            </View>
                            <Text style={[styles.achievementLabel, { color: theme.text }]}>{m.label}</Text>
                            {m.achieved && (
                                <View style={styles.checkBadge}>
                                    <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </Animated.View>
        );
    };

    const renderMoodCalendar = () => {
        if (!entries || entries.length === 0) return null;

        // Get last 30 days
        const days = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);

            const entry = entries.find(e => {
                const ed = new Date(e.timestamp);
                ed.setHours(0, 0, 0, 0);
                return ed.getTime() === d.getTime();
            });

            days.push({ date: d, entry });
        }

        return (
            <Animated.View entering={FadeInDown.delay(250)} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="calendar" size={24} color={theme.primary} />
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Mood Calendar</Text>
                </View>
                <View style={styles.calendarGrid}>
                    {days.map((day, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.calendarDay,
                                day.entry ? { backgroundColor: getMoodColor(day.entry.mood) + '20' } : { backgroundColor: theme.background }
                            ]}
                            onPress={() => day.entry && setSelectedEntry(day.entry)}
                            disabled={!day.entry}
                        >
                            <Text style={[styles.calendarDayText, { color: theme.subtext }]}>
                                {day.date.getDate()}
                            </Text>
                            {day.entry && (
                                <Text style={styles.calendarEmoji}>
                                    {getMoodEmoji(day.entry.mood)}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        );
    };

    const renderMoodChart = () => {
        if (!patterns || patterns.totalEntries === 0) return null;

        const total = patterns.totalEntries;
        // Group moods for simpler visualization
        const positiveCount = (patterns.moodCounts['happy'] || 0) +
            (patterns.moodCounts['joy'] || 0) +
            (patterns.moodCounts['excited'] || 0) +
            (patterns.moodCounts['calm'] || 0) +
            (patterns.moodCounts['peace'] || 0) +
            (patterns.moodCounts['positive'] || 0);

        const negativeCount = (patterns.moodCounts['sad'] || 0) +
            (patterns.moodCounts['depressed'] || 0) +
            (patterns.moodCounts['anxious'] || 0) +
            (patterns.moodCounts['angry'] || 0) +
            (patterns.moodCounts['negative'] || 0);

        const neutralCount = (patterns.moodCounts['neutral'] || 0) +
            (patterns.moodCounts['mixed'] || 0);

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
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                        <Text style={[styles.legendText, { color: theme.subtext }]}>Positive {positivePercent}%</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#94A3B8' }]} />
                        <Text style={[styles.legendText, { color: theme.subtext }]}>Neutral {neutralPercent}%</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#64748B' }]} />
                        <Text style={[styles.legendText, { color: theme.subtext }]}>Negative {negativePercent}%</Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const renderEntryItem = ({ item, index }: { item: JournalEntry; index: number }) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
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
                                <Text style={[styles.entryTime, { color: theme.subtext }]}>
                                    {date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
                    </View>
                    <Text style={[styles.entryPreview, { color: theme.subtext }]} numberOfLines={2}>
                        {preview}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={filteredEntries}
                keyExtractor={(item) => item.id}
                renderItem={renderEntryItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.primary}
                        colors={[theme.primary]}
                    />
                }
                ListHeaderComponent={() => (
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Insights</Text>

                        {renderSearchBar()}

                        {/* Only show stats/charts when not searching */}
                        {!searchQuery && activeFilter === 'all' && (
                            <>
                                {stats && (
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
                                                    <Text style={styles.statValue}>
                                                        {patterns ? getMoodEmoji(patterns.dominantMood) : '-'}
                                                    </Text>
                                                    <Text style={styles.statLabel}>Main Mood</Text>
                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </Animated.View>
                                )}

                                {renderAchievements()}
                                {renderMoodCalendar()}
                                {renderMoodChart()}
                            </>
                        )}

                        <View style={styles.listHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                {searchQuery || activeFilter !== 'all' ? 'Search Results' : 'Recent Entries'}
                            </Text>
                            {(searchQuery || activeFilter !== 'all') && (
                                <Text style={[styles.resultCount, { color: theme.subtext }]}>
                                    {filteredEntries.length} found
                                </Text>
                            )}
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color={theme.subtext} />
                        <Text style={[styles.emptyText, { color: theme.subtext }]}>
                            No entries found matching your criteria
                        </Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

            <EntryDetailModal
                visible={!!selectedEntry}
                entry={selectedEntry}
                onClose={() => setSelectedEntry(null)}
                onDelete={async (id) => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    await deleteEntry(id);
                    await loadData();
                    setSelectedEntry(null);
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onEdit={async (entry) => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedEntry(null);
                    router.push({ pathname: '/modal', params: { entryId: entry.id } });
                }}
            />
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
    searchContainer: {
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    filterContainer: {
        gap: 8,
        paddingRight: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statsCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
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
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementItem: {
        width: '48%',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        gap: 8,
    },
    achievementLocked: {
        opacity: 0.5,
    },
    achievementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
    },
    calendarDay: {
        width: (width - 80) / 7,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarDayText: {
        fontSize: 10,
        marginBottom: 2,
    },
    calendarEmoji: {
        fontSize: 16,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    resultCount: {
        fontSize: 14,
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
        marginBottom: 8,
    },
    entryMoodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    entryMoodEmoji: {
        fontSize: 24,
    },
    entryDate: {
        fontSize: 14,
        fontWeight: '600',
    },
    entryTime: {
        fontSize: 12,
    },
    entryPreview: {
        fontSize: 14,
        lineHeight: 20,
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    breakdownCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
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
        backgroundColor: '#F1F5F9',
    },
    barSegment: {
        height: '100%',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
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
        fontWeight: '500',
    },
});

import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { JournalEntry } from '@/utils/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EntryDetailModalProps {
    visible: boolean;
    entry: JournalEntry | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit?: (entry: JournalEntry) => void;
}

const MOOD_ICONS: Record<string, any> = {
    happy: { icon: 'happy', color: '#F59E0B', label: 'Happy' },
    calm: { icon: 'leaf', color: '#10B981', label: 'Calm' },
    neutral: { icon: 'remove-circle', color: '#6B7280', label: 'Neutral' },
    sad: { icon: 'sad', color: '#6366F1', label: 'Sad' },
    anxious: { icon: 'thunderstorm', color: '#8B5CF6', label: 'Anxious' },
    positive: { icon: 'sunny', color: '#F59E0B', label: 'Positive' },
    negative: { icon: 'rainy', color: '#6366F1', label: 'Negative' },
    mixed: { icon: 'shuffle', color: '#EC4899', label: 'Mixed' },
};

export function EntryDetailModal({ visible, entry, onClose, onDelete, onEdit }: EntryDetailModalProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    if (!entry) return null;

    const moodConfig = MOOD_ICONS[entry.mood] || MOOD_ICONS.neutral;
    const date = new Date(entry.timestamp);

    const handleDelete = () => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(entry.id);
                        onClose();
                    },
                },
            ]
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            presentationStyle="pageSheet"
        >
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={theme.text} />
                    </TouchableOpacity>

                    <View style={styles.headerActions}>
                        {onEdit && (
                            <TouchableOpacity onPress={() => onEdit(entry)} style={styles.actionButton}>
                                <Ionicons name="create-outline" size={24} color={theme.primary} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Date & Time */}
                    <Animated.View entering={FadeInDown.delay(100)} style={styles.dateContainer}>
                        <Text style={[styles.day, { color: theme.text }]}>
                            {date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </Text>
                        <Text style={[styles.date, { color: theme.subtext }]}>
                            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </Text>
                        <Text style={[styles.time, { color: theme.subtext }]}>
                            {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </Text>
                    </Animated.View>

                    {/* Mood Badge */}
                    <Animated.View entering={FadeInDown.delay(200)} style={styles.moodSection}>
                        <View style={[styles.moodBadge, { backgroundColor: moodConfig.color + '20' }]}>
                            <Ionicons name={moodConfig.icon} size={24} color={moodConfig.color} />
                            <Text style={[styles.moodText, { color: moodConfig.color }]}>
                                {moodConfig.label}
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Entry Content */}
                    <Animated.View entering={FadeInDown.delay(300)}>
                        <Text style={[styles.entryText, { color: theme.text }]}>
                            {entry.content}
                        </Text>
                    </Animated.View>

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                        <Animated.View entering={FadeInDown.delay(400)} style={styles.tagsContainer}>
                            {entry.tags.map((tag, index) => (
                                <View key={index} style={[styles.tag, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                    <Text style={[styles.tagText, { color: theme.subtext }]}>#{tag}</Text>
                                </View>
                            ))}
                        </Animated.View>
                    )}

                    {/* Analysis Section (Placeholder for now, could be expanded) */}
                    <Animated.View entering={FadeInDown.delay(500)} style={[styles.analysisCard, { backgroundColor: theme.card }]}>
                        <View style={styles.analysisHeader}>
                            <Ionicons name="analytics" size={20} color={theme.primary} />
                            <Text style={[styles.analysisTitle, { color: theme.text }]}>Analysis</Text>
                        </View>
                        <Text style={[styles.analysisText, { color: theme.subtext }]}>
                            This entry reflects a {moodConfig.label.toLowerCase()} state of mind.
                            {entry.content.length > 100 ? ' You expressed yourself in detail.' : ' A concise reflection.'}
                        </Text>
                    </Animated.View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        padding: 8,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    dateContainer: {
        marginBottom: 24,
    },
    day: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    date: {
        fontSize: 18,
        marginBottom: 4,
    },
    time: {
        fontSize: 16,
    },
    moodSection: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    moodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    moodText: {
        fontSize: 16,
        fontWeight: '600',
    },
    entryText: {
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 32,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 32,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    tagText: {
        fontSize: 14,
    },
    analysisCard: {
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    analysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    analysisTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    analysisText: {
        fontSize: 15,
        lineHeight: 22,
    },
});

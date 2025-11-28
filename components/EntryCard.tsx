import { Colors } from '@/constants/Colors';
import { JournalEntry } from '@/utils/storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MoodIndicator } from './MoodIndicator';

interface EntryCardProps {
    entry: JournalEntry;
    onPress: () => void;
}

export const EntryCard = ({ entry, onPress }: EntryCardProps) => {
    const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const time = new Date(entry.timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}>{date}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <MoodIndicator mood={entry.mood} size={20} />
            </View>
            <Text style={styles.content} numberOfLines={3}>{entry.content}</Text>
            {entry.tags && entry.tags.length > 0 && (
                <View style={styles.tags}>
                    {entry.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    date: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    time: {
        fontSize: 12,
        color: Colors.light.subtext,
    },
    content: {
        fontSize: 15,
        color: Colors.light.text,
        lineHeight: 22,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },
    tag: {
        backgroundColor: Colors.light.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        color: Colors.light.tint,
    },
});

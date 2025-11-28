import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    color?: string;
    delay?: number;
}

/**
 * StatCard Component
 * 
 * A beautiful card for displaying statistics with an icon
 * 
 * @param title - The label for the stat (e.g., "Total Entries")
 * @param value - The value to display (e.g., "42" or "7 days")
 * @param icon - Ionicons icon name
 * @param color - Optional custom color (defaults to primary theme color)
 * @param delay - Animation delay in milliseconds
 * 
 * @example
 * <StatCard 
 *   title="Streak" 
 *   value={7} 
 *   icon="flame" 
 *   color="#F59E0B" 
 * />
 */
export const StatCard = ({ title, value, icon, color, delay = 0 }: StatCardProps) => {
    const cardColor = color || Colors.light.primary;

    return (
        <Animated.View entering={FadeInDown.delay(delay)} style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: cardColor + '20' }]}>
                <Ionicons name={icon as any} size={32} color={cardColor} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        minWidth: 100,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    value: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    title: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },
});

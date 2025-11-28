import { getMoodColor } from '@/utils/analysis';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MoodIndicatorProps {
    mood: string;
    size?: 'small' | 'medium' | 'large' | number;
    showLabel?: boolean;
}

export const MoodIndicator = ({ mood, size = 'medium', showLabel = false }: MoodIndicatorProps) => {
    // Convert size preset to number
    let iconSize = 24;
    let containerSize = 40;
    let labelSize = 12;

    if (size === 'small') {
        iconSize = 16;
        containerSize = 28;
        labelSize = 10;
    } else if (size === 'medium') {
        iconSize = 24;
        containerSize = 40;
        labelSize = 12;
    } else if (size === 'large') {
        iconSize = 32;
        containerSize = 56;
        labelSize = 14;
    } else if (typeof size === 'number') {
        iconSize = size;
        containerSize = size * 1.6;
        labelSize = size * 0.5;
    }

    // Get icon and color based on mood
    let iconName: any = 'happy-outline';
    const color = getMoodColor(mood);

    switch (mood.toLowerCase()) {
        case 'happy':
        case 'joy':
            iconName = 'happy';
            break;
        case 'calm':
        case 'peace':
            iconName = 'leaf';
            break;
        case 'neutral':
            iconName = 'ellipse-outline';
            break;
        case 'sad':
        case 'sadness':
            iconName = 'sad';
            break;
        case 'anxious':
        case 'anxiety':
            iconName = 'thunderstorm';
            break;
        case 'angry':
        case 'anger':
            iconName = 'flame';
            break;
        case 'positive':
            iconName = 'happy-outline';
            break;
        case 'negative':
            iconName = 'sad-outline';
            break;
        case 'mixed':
            iconName = 'swap-horizontal';
            break;
        default:
            iconName = 'help-circle-outline';
    }

    if (!showLabel) {
        // Simple icon only
        return <Ionicons name={iconName} size={iconSize} color={color} />;
    }

    // Icon with background and optional label
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: color + '20',
                        width: containerSize,
                        height: containerSize,
                        borderRadius: containerSize / 2,
                    },
                ]}
            >
                <Ionicons name={iconName} size={iconSize} color={color} />
            </View>
            <Text style={[styles.label, { fontSize: labelSize, color }]}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 4,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});

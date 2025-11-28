import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';

interface MoodIndicatorProps {
    mood: string;
    size?: number;
}

export const MoodIndicator = ({ mood, size = 24 }: MoodIndicatorProps) => {
    let iconName: any = 'happy-outline';
    let color = '#6366F1';

    switch (mood) {
        case 'happy':
            iconName = 'happy';
            color = '#F59E0B'; // Amber
            break;
        case 'calm':
            iconName = 'leaf';
            color = '#10B981'; // Green
            break;
        case 'neutral':
            iconName = 'ellipse-outline';
            color = '#94A3B8';
            break;
        case 'sad':
            iconName = 'sad';
            color = '#64748B';
            break;
        case 'anxious':
            iconName = 'thunderstorm';
            color = '#8B5CF6'; // Purple
            break;
        default:
            iconName = 'help-circle-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
    text?: string;
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

/**
 * LoadingSpinner Component
 * 
 * A beautiful loading animation with calming pulse effect
 * 
 * @param text - Optional text to display below spinner (default: "Analyzing your entry...")
 * @param size - Size of the spinner: 'small' | 'medium' | 'large'
 * @param color - Optional custom color for the spinner
 * 
 * @example
 * <LoadingSpinner text="Processing..." size="large" />
 */
export const LoadingSpinner = ({
    text = 'Analyzing your entry...',
    size = 'medium',
    color
}: LoadingSpinnerProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.7);

    const spinnerColor = color || Colors.light.primary;

    let spinnerSize: 'small' | 'large' = 'small';
    let dotSize = 12;

    if (size === 'small') {
        spinnerSize = 'small';
        dotSize = 8;
    } else if (size === 'large') {
        spinnerSize = 'large';
        dotSize = 16;
    } else {
        dotSize = 12;
    }

    useEffect(() => {
        // Pulse animation for the dots
        scale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            false
        );

        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0.7, { duration: 800 })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle1 = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const animatedStyle3 = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View style={styles.container}>
            {/* Main spinner */}
            <ActivityIndicator size={spinnerSize} color={spinnerColor} />

            {/* Animated pulse dots */}
            <View style={styles.dotsContainer}>
                <Animated.View
                    style={[
                        styles.dot,
                        { width: dotSize, height: dotSize, backgroundColor: spinnerColor },
                        animatedStyle1,
                    ]}
                />
                <Animated.View
                    style={[
                        styles.dot,
                        { width: dotSize, height: dotSize, backgroundColor: spinnerColor },
                        animatedStyle2,
                    ]}
                />
                <Animated.View
                    style={[
                        styles.dot,
                        { width: dotSize, height: dotSize, backgroundColor: spinnerColor },
                        animatedStyle3,
                    ]}
                />
            </View>

            {/* Loading text */}
            {text && <Text style={[styles.text, { color: spinnerColor }]}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 8,
    },
    dot: {
        borderRadius: 999,
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

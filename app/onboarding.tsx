import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
    {
        title: '100% Private',
        description: 'Your thoughts stay on your device. No cloud, no servers, no tracking. Complete privacy guaranteed.',
        icon: 'shield-checkmark',
        color: '#10B981',
    },
    {
        title: 'AI-Powered Insights',
        description: 'Advanced sentiment analysis runs entirely on your device to help you understand your emotional patterns.',
        icon: 'analytics',
        color: '#6366F1',
    },
    {
        title: 'Track Your Journey',
        description: 'Visualize mood trends, build streaks, and celebrate achievements on your mental wellness journey.',
        icon: 'trending-up',
        color: '#F59E0B',
    },
];

export default function OnboardingScreen() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    const handleNext = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (currentSlide < ONBOARDING_SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            await completeOnboarding();
        }
    };

    const handleSkip = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await completeOnboarding();
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Failed to save onboarding status', error);
            router.replace('/(tabs)');
        }
    };

    const slide = ONBOARDING_SLIDES[currentSlide];

    return (
        <LinearGradient
            colors={['#F8FAFC', '#E0E7FF', '#F8FAFC']}
            style={styles.container}
        >
            <View style={styles.header}>
                {currentSlide < ONBOARDING_SLIDES.length - 1 && (
                    <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View key={currentSlide} entering={FadeInUp.springify()} style={styles.slideContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
                        <Ionicons name={slide.icon as any} size={80} color={slide.color} />
                    </View>

                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.description}>{slide.description}</Text>
                </Animated.View>

                <View style={styles.indicatorContainer}>
                    {ONBOARDING_SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === currentSlide && styles.activeIndicator,
                            ]}
                        />
                    ))}
                </View>

                <Animated.View entering={FadeInDown.delay(300)} style={styles.privacyBadge}>
                    <Ionicons name="lock-closed" size={16} color="#10B981" />
                    <Text style={styles.privacyText}>
                        Works 100% offline • No data collection
                    </Text>
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleNext}
                    style={styles.nextButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextText}>
                        {currentSlide < ONBOARDING_SLIDES.length - 1 ? 'Next' : 'Get Started'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 32,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    slideContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 17,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 16,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
    },
    activeIndicator: {
        width: 24,
        backgroundColor: '#6366F1',
    },
    privacyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#F0FDF4',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#BBF7D0',
        alignSelf: 'center',
    },
    privacyText: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6366F1',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

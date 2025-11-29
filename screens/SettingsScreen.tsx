import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Linking,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PrivacyBadge } from '@/components/PrivacyBadge';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useTheme as useThemeContext } from '@/context/ThemeContext';
import { deleteAllEntries, exportDataAsJSON, exportDataAsPDF, getStats } from '@/utils/storage';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
    const [stats, setStats] = useState<any>(null);
    const [showHowItWorks, setShowHowItWorks] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const themeContext = useThemeContext();

    const loadStats = async () => {
        const storageStats = await getStats();
        setStats(storageStats);
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const handleExportData = async () => {
        try {
            const jsonData = await exportDataAsJSON();
            const fileName = `mindsafe-backup-${new Date().toISOString().split('T')[0]}.json`;

            if (Platform.OS === 'web') {
                // For web, download as file
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
                Alert.alert('Success', 'Your data has been exported!');
            } else {
                // For mobile, share the file
                await Share.share({
                    message: jsonData,
                    title: 'MindSafe Journal Backup',
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export data. Please try again.');
        }
    };

    const handleExportPDF = async () => {
        try {
            await exportDataAsPDF();
        } catch (error) {
            Alert.alert('Error', 'Failed to export PDF. Please try again.');
        }
    };

    const handleLoadDemoData = () => {
        Alert.alert(
            'Load Demo Data',
            'This will add 15 sample journal entries for demonstration purposes. Your existing data will not be deleted.\n\nPerfect for hackathon presentations!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Load Demo Data',
                    onPress: async () => {
                        try {
                            const { loadDemoData } = require('@/utils/demoData');
                            const result = await loadDemoData();
                            if (result.success) {
                                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                await loadStats();
                                Alert.alert('Success', `Loaded ${result.count} demo entries! Check the Insights screen.`);
                            } else {
                                throw new Error('Failed to load demo data');
                            }
                        } catch (error) {
                            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            Alert.alert('Error', 'Failed to load demo data. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAllData = () => {
        Alert.alert(
            'Delete All Data',
            'This will permanently delete all your journal entries. This action cannot be undone.\n\nAre you absolutely sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Everything',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAllEntries();
                            await loadStats();
                            Alert.alert('Done', 'All your data has been deleted.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete data. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const openCrisisLine = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

            {/* Privacy & Security */}
            <Animated.View entering={FadeInDown.delay(100)} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.privacyHeader}>
                    <View style={styles.checkmarkContainer}>
                        <Ionicons name="shield-checkmark" size={48} color="#10B981" />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>100% Private</Text>
                </View>

                <PrivacyBadge />

                <Text style={[styles.privacyText, { color: theme.subtext }]}>
                    All your data stays on your device. Nothing is ever sent to the cloud or any external servers.
                </Text>

                <TouchableOpacity
                    style={styles.expandButton}
                    onPress={() => setShowHowItWorks(!showHowItWorks)}
                >
                    <Text style={[styles.expandButtonText, { color: theme.primary }]}>How it works</Text>
                    <Ionicons
                        name={showHowItWorks ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={theme.primary}
                    />
                </TouchableOpacity>

                {showHowItWorks && (
                    <Animated.View entering={FadeInDown} style={styles.expandedContent}>
                        <View style={styles.howItWorksItem}>
                            <Ionicons name="document-text" size={24} color={theme.primary} />
                            <Text style={[styles.howItWorksText, { color: theme.subtext }]}>
                                Your entries are stored locally using encrypted AsyncStorage
                            </Text>
                        </View>
                        <View style={styles.howItWorksItem}>
                            <Ionicons name="analytics" size={24} color={theme.primary} />
                            <Text style={[styles.howItWorksText, { color: theme.subtext }]}>
                                Sentiment analysis runs entirely on your device using on-device algorithms
                            </Text>
                        </View>
                        <View style={styles.howItWorksItem}>
                            <Ionicons name="cloud-offline" size={24} color={theme.primary} />
                            <Text style={[styles.howItWorksText, { color: theme.subtext }]}>
                                No internet connection required - works 100% offline
                            </Text>
                        </View>
                        <View style={styles.howItWorksItem}>
                            <Ionicons name="lock-closed" size={24} color={theme.primary} />
                            <Text style={[styles.howItWorksText, { color: theme.subtext }]}>
                                Basic encryption protects your data from casual access
                            </Text>
                        </View>
                    </Animated.View>
                )}
            </Animated.View>

            {/* Data Management */}
            <Animated.View entering={FadeInDown.delay(200)} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="folder-open" size={24} color={theme.text} />
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Data Management</Text>
                </View>

                {stats && (
                    <View style={styles.storageInfo}>
                        <Text style={[styles.storageText, { color: theme.subtext }]}>
                            Total Entries: {stats.totalEntries}
                        </Text>
                        {stats.newestEntry && (
                            <Text style={[styles.storageText, { color: theme.subtext }]}>
                                Last Entry: {new Date(stats.newestEntry).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleExportData}
                >
                    <Ionicons name="download-outline" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Export Data (JSON)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.secondary, marginTop: 12 }]}
                    onPress={handleExportPDF}
                >
                    <Ionicons name="document-text-outline" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Export as PDF</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#F59E0B', marginBottom: 12 }]}
                    onPress={handleLoadDemoData}
                >
                    <Ionicons name="flask-outline" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Load Demo Data (Presentation)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.dangerButton]}
                    onPress={handleDeleteAllData}
                >
                    <Ionicons name="trash-outline" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Delete All Data</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Appearance */}
            <Animated.View entering={FadeInDown.delay(300)} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="color-palette" size={24} color={theme.text} />
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Appearance</Text>
                </View>

                <View>
                    <Text style={[styles.settingLabel, { color: theme.text, marginBottom: 12 }]}>Theme</Text>
                    <View style={styles.themeOptions}>
                        {['system', 'light', 'dark'].map((themeOption) => (
                            <TouchableOpacity
                                key={themeOption}
                                onPress={async () => {
                                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    await themeContext.setTheme(themeOption as 'system' | 'light' | 'dark');
                                }}
                                style={[
                                    styles.themeOption,
                                    themeContext.theme === themeOption && [
                                        styles.themeOptionActive,
                                        { backgroundColor: theme.primary, borderColor: theme.primary }
                                    ],
                                ]}
                            >
                                <Ionicons
                                    name={
                                        themeOption === 'system' ? 'phone-portrait' :
                                            themeOption === 'light' ? 'sunny' : 'moon'
                                    }
                                    size={20}
                                    color={themeContext.theme === themeOption ? '#FFF' : theme.subtext}
                                />
                                <Text style={[
                                    styles.themeOptionText,
                                    { color: themeContext.theme === themeOption ? '#FFF' : theme.text }
                                ]}>
                                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Animated.View>

            {/* About */}
            <Animated.View entering={FadeInDown.delay(400)} style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="information-circle" size={24} color={theme.text} />
                    <Text style={[styles.cardTitle, { color: theme.text }]}>About</Text>
                </View>

                <View style={styles.aboutContent}>
                    <Text style={[styles.appName, { color: theme.text }]}>MindSafe</Text>
                    <Text style={[styles.appTagline, { color: theme.subtext }]}>
                        Privacy-First Mental Health Journaling
                    </Text>
                    <Text style={[styles.appVersion, { color: theme.subtext }]}>Version 1.0.0</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                        <Text style={[styles.featureText, { color: theme.subtext }]}>Built for offline use</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                        <Text style={[styles.featureText, { color: theme.subtext }]}>AI-powered mood analysis</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                        <Text style={[styles.featureText, { color: theme.subtext }]}>Complete data privacy</Text>
                    </View>
                </View>

                <Text style={[styles.credits, { color: theme.subtext }]}>
                    Developed with ❤️ for mental health awareness
                </Text>
            </Animated.View>

            {/* Support & Crisis Resources */}
            <Animated.View entering={FadeInDown.delay(500)} style={[styles.card, styles.crisisCard]}>
                <View style={styles.crisisHeader}>
                    <Ionicons name="heart" size={24} color="#EF4444" />
                    <Text style={[styles.cardTitle, { color: '#991B1B' }]}>Need Help?</Text>
                </View>

                <Text style={[styles.crisisWarning, { color: '#7F1D1D' }]}>
                    If you're in crisis or need immediate support, please reach out:
                </Text>

                <View style={styles.crisisLinks}>
                    <TouchableOpacity
                        style={styles.crisisButton}
                        onPress={() => openCrisisLine('988')}
                    >
                        <Ionicons name="call" size={20} color="#EF4444" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.crisisButtonTitle, { color: '#991B1B' }]}>
                                988 Suicide & Crisis Lifeline
                            </Text>
                            <Text style={[styles.crisisButtonSubtitle, { color: '#7F1D1D' }]}>
                                24/7 free and confidential support
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.crisisButton}
                        onPress={() => Linking.openURL('sms:741741')}
                    >
                        <Ionicons name="chatbubble" size={20} color="#EF4444" />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.crisisButtonTitle, { color: '#991B1B' }]}>
                                Crisis Text Line
                            </Text>
                            <Text style={[styles.crisisButtonSubtitle, { color: '#7F1D1D' }]}>
                                Text "HELLO" to 741741
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.crisisFooter, { color: '#7F1D1D' }]}>
                    This app is designed to complement, not replace, professional mental health care.
                </Text>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingTop: 40,
        paddingBottom: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    privacyHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    checkmarkContainer: {
        marginBottom: 12,
    },
    privacyText: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    expandButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    expandedContent: {
        marginTop: 16,
        gap: 16,
    },
    howItWorksItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    howItWorksText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    storageInfo: {
        marginBottom: 16,
        gap: 4,
    },
    storageText: {
        fontSize: 14,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dangerButton: {
        backgroundColor: '#EF4444',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    settingSubtext: {
        fontSize: 13,
        marginTop: 2,
    },
    settingValue: {
        fontSize: 15,
    },
    aboutContent: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    appTagline: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 8,
    },
    appVersion: {
        fontSize: 13,
    },
    featureList: {
        gap: 12,
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 15,
    },
    credits: {
        fontSize: 13,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    crisisCard: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
    },
    crisisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    crisisWarning: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        marginBottom: 16,
    },
    crisisLinks: {
        gap: 12,
        marginBottom: 16,
    },
    crisisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    crisisButtonTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    crisisButtonSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    crisisFooter: {
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    themeOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    themeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    themeOptionActive: {
        borderWidth: 2,
    },
    themeOptionText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

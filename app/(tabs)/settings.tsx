import { PrivacyBadge } from '@/components/PrivacyBadge';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { clearEntries } from '@/utils/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const handleClearData = () => {
        Alert.alert(
            "Clear All Data",
            "Are you sure you want to delete all your journal entries? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await clearEntries();
                        Alert.alert("Success", "All data has been cleared.");
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: theme.subtext }]}>Data & Privacy</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.privacyContainer}>
                        <PrivacyBadge />
                        <Text style={[styles.privacyText, { color: theme.text }]}>
                            Your data is stored locally on your device. No data is ever sent to the cloud.
                        </Text>
                    </View>

                    <View style={[styles.separator, { backgroundColor: theme.border }]} />

                    <TouchableOpacity style={styles.row} onPress={handleClearData}>
                        <View style={styles.rowLabel}>
                            <Ionicons name="trash-outline" size={24} color="#EF4444" />
                            <Text style={[styles.rowText, { color: "#EF4444" }]}>Clear All Data</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: theme.subtext }]}>About</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.row}>
                        <Text style={[styles.rowText, { color: theme.text }]}>Version</Text>
                        <Text style={[styles.rowValue, { color: theme.subtext }]}>1.0.0</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
    privacyContainer: {
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },
    privacyText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
    separator: {
        height: 1,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowText: {
        fontSize: 16,
        fontWeight: '500',
    },
    rowValue: {
        fontSize: 16,
    },
});

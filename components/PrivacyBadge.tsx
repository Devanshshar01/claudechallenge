import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const PrivacyBadge = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.light.success} />
            <Text style={styles.text}>100% Private & Offline</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5', // Light green bg
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'center',
        marginVertical: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    text: {
        color: '#065F46', // Dark green text
        fontSize: 12,
        fontWeight: '600',
    },
});

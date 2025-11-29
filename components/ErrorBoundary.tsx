import Ionicons from '@expo/vector-icons/Ionicons';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    children: ReactNode;
    fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary Caught:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error!, this.resetError);
            }

            return (
                <View style={styles.container}>
                    <Ionicons name="alert-circle" size={64} color="#EF4444" />
                    <Text style={styles.title}>Oops! Something went wrong</Text>
                    <Text style={styles.message}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.resetError}
                    >
                        <Ionicons name="reload" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                    <Text style={styles.privacy}>
                        Don't worry - your data is safe and stored locally on your device.
                    </Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#F8FAFC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    privacy: {
        fontSize: 13,
        color: '#10B981',
        textAlign: 'center',
        marginTop: 16,
    },
});

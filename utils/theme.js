/**
 * Design System - Theme Configuration
 * Centralized design tokens for colors, spacing, typography, and more
 */

// Color Palette
export const COLORS = {
    // Primary Colors
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',

    // Secondary Colors
    secondary: '#8B5CF6',
    secondaryLight: '#A78BFA',
    secondaryDark: '#7C3AED',

    // Semantic Colors
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',

    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',

    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',

    info: '#3B82F6',
    infoLight: '#60A5FA',
    infoDark: '#2563EB',

    // Neutral Colors - Light Theme
    white: '#FFFFFF',
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    card: '#FFFFFF',
    border: '#E2E8F0',

    text: '#1E293B',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    subtext: '#64748B',

    inactive: '#94A3B8',
    disabled: '#CBD5E1',

    // Neutral Colors - Dark Theme
    darkBackground: '#0F172A',
    darkBackgroundSecondary: '#1E293B',
    darkCard: '#1E293B',
    darkBorder: '#334155',

    darkText: '#F8FAFC',
    darkTextSecondary: '#CBD5E1',
    darkTextTertiary: '#94A3B8',

    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
    transparent: 'transparent',
};

// Tab Bar Specific Colors
export const TAB_COLORS = {
    active: COLORS.primary,
    inactive: COLORS.inactive,
    background: COLORS.white,
    darkBackground: COLORS.darkCard,
};

// Spacing Scale (8px base unit)
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
    '6xl': 80,
};

// Typography
export const TYPOGRAPHY = {
    // Font Families
    fontFamily: {
        regular: 'System',
        mono: 'SpaceMono',
    },

    // Font Sizes
    fontSize: {
        xs: 12,
        sm: 13,
        base: 14,
        md: 15,
        lg: 16,
        xl: 18,
        '2xl': 20,
        '3xl': 24,
        '4xl': 28,
        '5xl': 32,
        '6xl': 36,
    },

    // Font Weights
    fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
        loose: 2,
    },
};

// Border Radius
export const RADIUS = {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
};

// Shadows
export const SHADOWS = {
    small: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    medium: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    large: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    xlarge: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Animations & Transitions
export const ANIMATION = {
    duration: {
        fast: 150,
        normal: 250,
        slow: 350,
    },
    easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
    },
};

// Tab Bar Configuration
export const TAB_BAR_CONFIG = {
    height: 70,
    iconSize: 24,
    labelSize: 12,
    paddingBottom: 8,
    paddingTop: 8,
};

// Status Bar Heights (iOS safe areas)
export const SAFE_AREA = {
    top: 44,
    bottom: 34,
};

// Z-Index Layers
export const Z_INDEX = {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    toast: 500,
    overlay: 600,
};

// Component Specific Sizes
export const SIZES = {
    button: {
        small: 32,
        medium: 40,
        large: 48,
    },
    input: {
        height: 48,
        borderWidth: 1,
    },
    icon: {
        xs: 16,
        sm: 20,
        base: 24,
        lg: 28,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
    },
    avatar: {
        small: 32,
        medium: 48,
        large: 64,
    },
};

// Export all as a single theme object
export const theme = {
    colors: COLORS,
    spacing: SPACING,
    typography: TYPOGRAPHY,
    radius: RADIUS,
    shadows: SHADOWS,
    animation: ANIMATION,
    tabBar: TAB_BAR_CONFIG,
    safeArea: SAFE_AREA,
    zIndex: Z_INDEX,
    sizes: SIZES,
};

export default theme;

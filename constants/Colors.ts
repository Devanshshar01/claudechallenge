const primary = '#6366F1';
const secondary = '#8B5CF6';
const background = '#F8FAFC';
const card = '#FFFFFF';
const text = '#1E293B';
const success = '#10B981';
const warning = '#F59E0B';

export const Colors = {
  light: {
    text: text,
    background: background,
    tint: primary,
    tabIconDefault: '#94A3B8',
    tabIconSelected: primary,
    primary,
    secondary,
    card,
    success,
    warning,
    border: '#E2E8F0',
    subtext: '#64748B',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: primary,
    tabIconDefault: '#94A3B8',
    tabIconSelected: primary,
    primary,
    secondary,
    card: '#1E293B',
    success,
    warning,
    border: '#334155',
    subtext: '#94A3B8',
  },
};

export default Colors.light; // Default export for backward compatibility if needed, but we should use named export or access via theme


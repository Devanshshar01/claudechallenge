import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused?: boolean;
}) {
  return (
    <Ionicons
      size={24}
      style={{
        marginBottom: -3,
        transform: [{ scale: props.focused ? 1.1 : 1 }],
      }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        // Tab Bar Colors
        tabBarActiveTintColor: '#6366F1', // Primary color
        tabBarInactiveTintColor: '#94A3B8', // Inactive gray

        // Header Configuration
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: theme.text,
        },

        // Tab Bar Styling
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? theme.card : '#FFFFFF',
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },

        // Tab Bar Label Styling
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },

        // Animation
        tabBarHideOnKeyboard: true,
        animation: 'shift',
      }}>

      {/* Journal Tab - Home Icon */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Journal',
          headerTitle: 'My Journal',
        }}
      />

      {/* Insights Tab - Chart/Trending Icon */}
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'trending-up' : 'trending-up-outline'} color={color} focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Insights',
          headerTitle: 'Insights & Analytics',
        }}
      />

      {/* Settings Tab - Gear Icon */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Settings',
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemeProvider } from '@/context/ThemeContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user has completed onboarding
        const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
        setHasCompletedOnboarding(hasCompleted === 'true');

        // You can add any additional loading logic here
        await new Promise(resolve => setTimeout(resolve, 500)); // Minimum splash time

        setIsAppReady(true);
      } catch (e) {
        console.warn(e);
        setHasCompletedOnboarding(false); // Default to showing onboarding on error
        setIsAppReady(true);
      }
    }

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAppReady]);

  // Show loading indicator while fonts are loading
  if (!loaded || !isAppReady || hasCompletedOnboarding === null) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background
      }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return <RootLayoutNav hasCompletedOnboarding={hasCompletedOnboarding} />;
}

function RootLayoutNav({ hasCompletedOnboarding }: { hasCompletedOnboarding: boolean }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {/* StatusBar configuration for light/dark mode */}
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          <Stack initialRouteName={hasCompletedOnboarding ? '(tabs)' : 'onboarding'}>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                title: 'New Entry',
                headerShown: true,
              }}
            />
          </Stack>
        </NavigationThemeProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Handicrafts-Regular": require("../assets/fonts/TheYearofHandicrafts-Regular.otf"),
    "Handicrafts-Medium": require("../assets/fonts/TheYearofHandicrafts-Medium.otf"),
    "Handicrafts-SemiBold": require("../assets/fonts/TheYearofHandicrafts-SemiBold.otf"),
    "Handicrafts-Bold": require("../assets/fonts/TheYearofHandicrafts-Bold.otf"),
    "Handicrafts-Black": require("../assets/fonts/TheYearofHandicrafts-Black.otf"),
  });
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

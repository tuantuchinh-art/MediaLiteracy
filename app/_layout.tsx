import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { GameProvider } from '@/contexts/GameContext';
import { AchievementProvider } from '@/contexts/AchievementContext';
import { StatusBar } from 'expo-status-bar';
import AchievementBridge from '@/components/ui/AchievementBridge';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <GameProvider>
          <AchievementProvider>
            {/* Bridges GameContext ↔ AchievementContext + renders popup */}
            <AchievementBridge />
            <StatusBar style="light" backgroundColor="#050510" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050510' } }}>
              <Stack.Screen name="(tabs)"            options={{ headerShown: false }} />
              <Stack.Screen name="battle-game"       options={{ headerShown: false, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="investigation-game" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="leaderboard"       options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="video-learning"    options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="daily-challenge"   options={{ headerShown: false, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="premium"           options={{ headerShown: false, animation: 'slide_from_bottom', presentation: 'modal' }} />
              <Stack.Screen name="pvp-battle"        options={{ headerShown: false, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="achievements"      options={{ headerShown: false, animation: 'slide_from_right' }} />
            </Stack>
          </AchievementProvider>
        </GameProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}

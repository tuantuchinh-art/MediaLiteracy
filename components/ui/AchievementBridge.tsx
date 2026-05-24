/**
 * AchievementBridge — mounts inside both GameProvider and AchievementProvider.
 * Wires the GameContext achievement callback to the AchievementContext unlock function,
 * and renders the neon-glow popup queue at the top of the screen.
 */
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/hooks/useGame';
import { useAchievements } from '@/hooks/useAchievements';
import { checkAchievements } from '@/hooks/useAchievements';
import { GameState } from '@/contexts/GameContext';
import AchievementPopup from '@/components/ui/AchievementPopup';

export default function AchievementBridge() {
  const { setAchievementCallback } = useGame();
  const { unlockAchievement, isUnlocked, popupQueue, dismissPopup } = useAchievements();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setAchievementCallback((state: GameState, extra?: Record<string, boolean>) => {
      checkAchievements(state, unlockAchievement, isUnlocked, extra as any);
    });
  }, [unlockAchievement, isUnlocked]);

  if (popupQueue.length === 0) return null;

  return (
    <View style={[styles.overlay, { top: insets.top + 8 }]} pointerEvents="box-none">
      <AchievementPopup
        key={popupQueue[0].id}
        achievement={popupQueue[0]}
        onDismiss={dismissPopup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

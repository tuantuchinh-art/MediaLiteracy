import { useContext, useCallback } from 'react';
import { AchievementContext, AchievementContextType } from '@/contexts/AchievementContext';
import { AchievementId } from '@/constants/achievements';
import { GameState } from '@/contexts/GameContext';

export function useAchievements(): AchievementContextType {
  const context = useContext(AchievementContext);
  if (!context) throw new Error('useAchievements must be used within AchievementProvider');
  return context;
}

/**
 * Call this after any game state change to check and unlock eligible achievements.
 * Designed to be called from GameContext actions.
 */
export function checkAchievements(
  state: GameState,
  unlockFn: (id: AchievementId) => void,
  isUnlocked: (id: AchievementId) => boolean,
  extra?: {
    pvpWin?: boolean;
    pvpPerfect?: boolean;
    investigationComplete?: boolean;
    investigationPerfect?: boolean;
    speedAnswer?: boolean;
    battlePerfect?: boolean;
  }
) {
  const u = (id: AchievementId) => { if (!isUnlocked(id)) unlockFn(id); };

  // ── Streak ────────────────────────────────────────────────────
  if (state.streak >= 3)  u('streak_3');
  if (state.streak >= 7)  u('streak_7');
  if (state.streak >= 14) u('streak_14');
  if (state.streak >= 30) u('streak_30');

  // ── Correct answers ────────────────────────────────────────────
  if (state.totalCorrect >= 10)  u('correct_10');
  if (state.totalCorrect >= 50)  u('correct_50');
  if (state.totalCorrect >= 100) u('correct_100');
  if (state.totalCorrect >= 500) u('correct_500');

  // ── Combo ──────────────────────────────────────────────────────
  if (state.maxCombo >= 5)  u('combo_5');
  if (state.maxCombo >= 10) u('combo_10');
  if (state.maxCombo >= 20) u('combo_20');

  // ── XP / Level ────────────────────────────────────────────────
  if (state.xp >= 1000)  u('xp_1000');
  if (state.xp >= 5000)  u('xp_5000');
  if (state.level >= 5)  u('level_5');
  if (state.level >= 10) u('level_10');
  if (state.level >= 20) u('level_20');

  // ── PvP ───────────────────────────────────────────────────────
  if (state.pvpWins >= 1)  u('pvp_first_win');
  if (state.pvpWins >= 5)  u('pvp_win_5');
  if (state.pvpWins >= 20) u('pvp_win_20');
  if (extra?.pvpPerfect)   u('pvp_no_miss');

  // ── Investigation ─────────────────────────────────────────────
  if (state.investigationsCompleted >= 1) u('investigate_first');
  if (state.investigationsCompleted >= 5) u('investigate_5');
  if (extra?.investigationPerfect)        u('investigate_perfect');

  // ── Daily challenge ────────────────────────────────────────────
  if (state.dailyChallengesCompleted >= 7) u('daily_7');

  // ── Special ───────────────────────────────────────────────────
  if (extra?.speedAnswer)   u('speed_demon');
  if (extra?.battlePerfect) u('perfectionist');
}

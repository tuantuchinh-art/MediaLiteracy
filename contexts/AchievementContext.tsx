import React, { createContext, useState, useCallback, useRef, ReactNode } from 'react';
import { ACHIEVEMENTS, AchievementId, Achievement } from '@/constants/achievements';

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: number; // timestamp
}

export interface AchievementContextType {
  unlockedIds: Set<AchievementId>;
  popupQueue: Achievement[];
  unlockAchievement: (id: AchievementId) => void;
  dismissPopup: () => void;
  isUnlocked: (id: AchievementId) => boolean;
  unlockedList: UnlockedAchievement[];
}

export const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Pre-unlock some achievements based on initial game state (47 correct, streak 7, etc.)
const INITIAL_UNLOCKED: AchievementId[] = [
  'streak_3', 'streak_7',
  'correct_10', 'correct_50',
  'xp_1000',
  'level_5',
];

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [unlockedList, setUnlockedList] = useState<UnlockedAchievement[]>(
    INITIAL_UNLOCKED.map(id => ({ id, unlockedAt: Date.now() - Math.random() * 86400000 * 7 }))
  );
  const [popupQueue, setPopupQueue] = useState<Achievement[]>([]);
  const processingRef = useRef(false);

  const unlockedIds = new Set(unlockedList.map(u => u.id));

  const unlockAchievement = useCallback((id: AchievementId) => {
    setUnlockedList(prev => {
      if (prev.some(u => u.id === id)) return prev; // already unlocked
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (!achievement) return prev;
      // Add to popup queue
      setPopupQueue(q => [...q, achievement]);
      return [...prev, { id, unlockedAt: Date.now() }];
    });
  }, []);

  const dismissPopup = useCallback(() => {
    setPopupQueue(prev => prev.slice(1));
  }, []);

  const isUnlocked = useCallback((id: AchievementId) => {
    return unlockedList.some(u => u.id === id);
  }, [unlockedList]);

  return (
    <AchievementContext.Provider value={{
      unlockedIds,
      popupQueue,
      unlockAchievement,
      dismissPopup,
      isUnlocked,
      unlockedList,
    }}>
      {children}
    </AchievementContext.Provider>
  );
}

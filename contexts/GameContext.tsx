import React, { createContext, useState, useCallback, ReactNode, useContext, useRef } from 'react';

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  coins: number;
  rank: string;
  username: string;
  isPremium: boolean;
  dailyChallengeCompleted: boolean;
  totalCorrect: number;
  totalAnswered: number;
  comboStreak: number;
  maxCombo: number;
  // Achievement-tracked fields
  pvpWins: number;
  investigationsCompleted: number;
  dailyChallengesCompleted: number;
}

export interface GameContextType {
  gameState: GameState;
  addXP: (amount: number) => void;
  addCombo: () => void;
  resetCombo: () => void;
  markChallengeComplete: () => void;
  upgradeToPremium: () => void;
  recordAnswer: (correct: boolean) => void;
  recordPvPWin: () => void;
  recordInvestigation: () => void;
  resetProgress: () => void;
  setUsername: (name: string) => void;
  // Achievement check callback — set by AchievementContext bridge
  onStateChange?: (state: GameState, extra?: Record<string, boolean>) => void;
  setAchievementCallback: (cb: (state: GameState, extra?: Record<string, boolean>) => void) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

const getLevelFromXP = (xp: number): number => Math.floor(xp / 500) + 1;
const getRankFromLevel = (level: number): string => {
  if (level >= 30) return 'Kim Cương';
  if (level >= 20) return 'Bạch Kim';
  if (level >= 10) return 'Vàng';
  if (level >= 5)  return 'Bạc';
  return 'Đồng';
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    xp: 1240,
    level: 3,
    streak: 7,
    coins: 850,
    rank: 'Bạc',
    username: 'Bạn',
    isPremium: false,
    dailyChallengeCompleted: false,
    totalCorrect: 47,
    totalAnswered: 62,
    comboStreak: 0,
    maxCombo: 8,
    pvpWins: 0,
    investigationsCompleted: 0,
    dailyChallengesCompleted: 0,
  });

  const achievementCb = useRef<((s: GameState, extra?: Record<string, boolean>) => void) | null>(null);

  const setAchievementCallback = useCallback((cb: (s: GameState, extra?: Record<string, boolean>) => void) => {
    achievementCb.current = cb;
  }, []);

  const triggerCheck = (nextState: GameState, extra?: Record<string, boolean>) => {
    achievementCb.current?.(nextState, extra);
  };

  const addXP = useCallback((amount: number) => {
    setGameState(prev => {
      const newXP  = prev.xp + amount;
      const newLvl = getLevelFromXP(newXP);
      const next = {
        ...prev,
        xp: newXP,
        level: newLvl,
        rank: getRankFromLevel(newLvl),
        coins: prev.coins + Math.floor(amount / 10),
      };
      triggerCheck(next);
      return next;
    });
  }, []);

  const addCombo = useCallback(() => {
    setGameState(prev => {
      const newCombo = prev.comboStreak + 1;
      const next = {
        ...prev,
        comboStreak: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
      };
      triggerCheck(next);
      return next;
    });
  }, []);

  const resetCombo = useCallback(() => {
    setGameState(prev => ({ ...prev, comboStreak: 0 }));
  }, []);

  const markChallengeComplete = useCallback(() => {
    setGameState(prev => {
      const next = {
        ...prev,
        dailyChallengeCompleted: true,
        dailyChallengesCompleted: prev.dailyChallengesCompleted + 1,
      };
      triggerCheck(next);
      return next;
    });
  }, []);

  const upgradeToPremium = useCallback(() => {
    setGameState(prev => ({ ...prev, isPremium: true }));
  }, []);

  const recordAnswer = useCallback((correct: boolean) => {
    setGameState(prev => {
      const next = {
        ...prev,
        totalCorrect: correct ? prev.totalCorrect + 1 : prev.totalCorrect,
        totalAnswered: prev.totalAnswered + 1,
      };
      triggerCheck(next);
      return next;
    });
  }, []);

  const recordPvPWin = useCallback(() => {
    setGameState(prev => {
      const next = { ...prev, pvpWins: prev.pvpWins + 1 };
      triggerCheck(next);
      return next;
    });
  }, []);

  const recordInvestigation = useCallback(() => {
    setGameState(prev => {
      const next = { ...prev, investigationsCompleted: prev.investigationsCompleted + 1 };
      triggerCheck(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh: GameState = {
      xp: 0, level: 1, streak: 0, coins: 0, rank: 'Đồng',
      username: 'Bạn', isPremium: false,
      dailyChallengeCompleted: false,
      totalCorrect: 0, totalAnswered: 0,
      comboStreak: 0, maxCombo: 0,
      pvpWins: 0, investigationsCompleted: 0, dailyChallengesCompleted: 0,
    };
    setGameState(fresh);
  }, []);

  const setUsername = useCallback((name: string) => {
    setGameState(prev => ({ ...prev, username: name }));
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      addXP, addCombo, resetCombo,
      markChallengeComplete, upgradeToPremium, recordAnswer,
      recordPvPWin, recordInvestigation,
      resetProgress, setUsername,
      setAchievementCallback,
    }}>
      {children}
    </GameContext.Provider>
  );
}

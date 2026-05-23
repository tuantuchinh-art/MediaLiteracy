import React, { createContext, useState, ReactNode } from 'react';

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
}

export interface GameContextType {
  gameState: GameState;
  addXP: (amount: number) => void;
  addCombo: () => void;
  resetCombo: () => void;
  markChallengeComplete: () => void;
  upgradeToPremium: () => void;
  recordAnswer: (correct: boolean) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

const getLevelFromXP = (xp: number): number => Math.floor(xp / 500) + 1;
const getRankFromLevel = (level: number): string => {
  if (level >= 30) return 'Kim Cương';
  if (level >= 20) return 'Bạch Kim';
  if (level >= 10) return 'Vàng';
  if (level >= 5) return 'Bạc';
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
  });

  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = getLevelFromXP(newXP);
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        rank: getRankFromLevel(newLevel),
        coins: prev.coins + Math.floor(amount / 10),
      };
    });
  };

  const addCombo = () => {
    setGameState(prev => ({
      ...prev,
      comboStreak: prev.comboStreak + 1,
      maxCombo: Math.max(prev.maxCombo, prev.comboStreak + 1),
    }));
  };

  const resetCombo = () => {
    setGameState(prev => ({ ...prev, comboStreak: 0 }));
  };

  const markChallengeComplete = () => {
    setGameState(prev => ({ ...prev, dailyChallengeCompleted: true }));
  };

  const upgradeToPremium = () => {
    setGameState(prev => ({ ...prev, isPremium: true }));
  };

  const recordAnswer = (correct: boolean) => {
    setGameState(prev => ({
      ...prev,
      totalCorrect: correct ? prev.totalCorrect + 1 : prev.totalCorrect,
      totalAnswered: prev.totalAnswered + 1,
    }));
  };

  return (
    <GameContext.Provider value={{ gameState, addXP, addCombo, resetCombo, markChallengeComplete, upgradeToPremium, recordAnswer }}>
      {children}
    </GameContext.Provider>
  );
}

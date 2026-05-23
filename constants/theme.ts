// Media Literacy App — Design System
export const Colors = {
  // Backgrounds
  bg: '#050510',
  bgCard: '#0D0D1F',
  bgSurface: '#12122A',
  bgPanel: '#1A1A35',
  bgElevated: '#1F1F40',

  // Neon Highlights
  neonCyan: '#00F5FF',
  neonPink: '#FF006E',
  neonPurple: '#7B2FFF',
  neonGold: '#FFD700',
  neonGreen: '#00FF88',
  neonOrange: '#FF6B00',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#505078',
  textAccent: '#00F5FF',

  // Status Colors
  colorTrue: '#00FF88',
  colorFake: '#FF006E',
  colorMisleading: '#FFD700',
  colorContext: '#FF6B00',
  colorAI: '#7B2FFF',

  // UI
  border: '#1E1E3F',
  borderGlow: 'rgba(0, 245, 255, 0.3)',
  overlay: 'rgba(5, 5, 16, 0.85)',

  // Rank Colors
  rankBronze: '#CD7F32',
  rankSilver: '#C0C0C0',
  rankGold: '#FFD700',
  rankPlatinum: '#00F5FF',
  rankDiamond: '#7B2FFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 36,
  hero: 48,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const Shadow = {
  neonCyan: {
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  neonPink: {
    shadowColor: '#FF006E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  neonPurple: {
    shadowColor: '#7B2FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

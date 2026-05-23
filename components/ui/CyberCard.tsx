import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii } from '@/constants/theme';

interface CyberCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  variant?: 'default' | 'elevated' | 'panel';
}

export default function CyberCard({ children, style, glowColor, variant = 'default' }: CyberCardProps) {
  const bgMap = {
    default: Colors.bgCard,
    elevated: Colors.bgSurface,
    panel: Colors.bgPanel,
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bgMap[variant] },
        glowColor && {
          borderColor: glowColor + '40',
          shadowColor: glowColor,
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});

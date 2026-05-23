import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radii, FontSize, FontWeight, Spacing } from '@/constants/theme';

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function NeonButton({
  label,
  onPress,
  color = Colors.neonCyan,
  variant = 'solid',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  fullWidth = false,
}: NeonButtonProps) {
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: FontSize.sm },
    md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: FontSize.base },
    lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: FontSize.md },
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          opacity: pressed ? 0.8 : disabled ? 0.4 : 1,
          backgroundColor: variant === 'solid' ? color : 'transparent',
          borderWidth: variant !== 'ghost' ? 1.5 : 0,
          borderColor: color,
          shadowColor: color,
          shadowOpacity: variant === 'solid' ? 0.5 : 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
          width: fullWidth ? '100%' : undefined,
          transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
        },
        style,
      ]}
    >
      <Text style={[
        styles.label,
        { 
          fontSize: sizeStyles[size].fontSize, 
          color: variant === 'solid' ? (color === Colors.neonGold ? '#000' : '#fff') : color 
        },
        textStyle,
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
});

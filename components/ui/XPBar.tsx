import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSize, FontWeight, Radii } from '@/constants/theme';

interface XPBarProps {
  currentXP: number;
  level: number;
  compact?: boolean;
}

export default function XPBar({ currentXP, level, compact = false }: XPBarProps) {
  const xpPerLevel = 500;
  const xpInLevel = currentXP % xpPerLevel;
  const progress = xpInLevel / xpPerLevel;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.levelText}>Lv.{level}</Text>
        <View style={styles.barBg}>
          <Animated.View
            style={[
              styles.barFill,
              { width: animWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
        <Text style={styles.xpText}>{xpInLevel}/{xpPerLevel}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.levelBig}>Level {level}</Text>
        <Text style={styles.xpText}>{xpInLevel} / {xpPerLevel} XP</Text>
      </View>
      <View style={styles.barBgLarge}>
        <Animated.View
          style={[
            styles.barFillLarge,
            { width: animWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  container: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelText: {
    color: Colors.neonCyan,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  levelBig: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  xpText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgPanel,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  barBgLarge: {
    height: 10,
    backgroundColor: Colors.bgPanel,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.neonCyan,
    borderRadius: Radii.full,
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  barFillLarge: {
    height: '100%',
    backgroundColor: Colors.neonCyan,
    borderRadius: Radii.full,
    shadowColor: Colors.neonCyan,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});

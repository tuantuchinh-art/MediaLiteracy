import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
} from 'react-native';
import { Achievement } from '@/constants/achievements';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';

interface AchievementPopupProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export default function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  const slideY    = useRef(new Animated.Value(-140)).current;
  const opacity   = useRef(new Animated.Value(0)).current;
  const glow      = useRef(new Animated.Value(0)).current;
  const scale     = useRef(new Animated.Value(0.85)).current;
  const progressW = useRef(new Animated.Value(1)).current;

  const rarityColor = achievement.rarityColor;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(glow, { toValue: 1, duration: 700, useNativeDriver: false }),
            Animated.timing(glow, { toValue: 0, duration: 700, useNativeDriver: false }),
          ])
        ),
        Animated.timing(progressW, { toValue: 0, duration: 4000, useNativeDriver: false }),
      ]).start();
    });

    const timer = setTimeout(() => dismiss(), 4200);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: -140, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  const glowOpacity  = glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.85] });
  const progressWPct = progressW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideY }, { scale }], opacity },
      ]}
    >
      {/* Neon border glow */}
      <Animated.View style={[styles.glowBorder, { borderColor: rarityColor, opacity: glowOpacity }]} />

      <Pressable onPress={dismiss} style={styles.inner}>
        {/* Left: icon */}
        <View style={[styles.iconWrap, { backgroundColor: rarityColor + '22', borderColor: rarityColor + '60' }]}>
          <Text style={styles.iconText}>{achievement.icon}</Text>
        </View>

        {/* Center: text */}
        <View style={styles.textBlock}>
          <View style={styles.topRow}>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor + '25', borderColor: rarityColor + '50' }]}>
              <Text style={[styles.rarityText, { color: rarityColor }]}>{achievement.rarity}</Text>
            </View>
            <Text style={styles.unlockLabel}>🎉 Huy Hiệu Mới!</Text>
          </View>
          <Text style={styles.achieveName} numberOfLines={1}>{achievement.name}</Text>
          <Text style={styles.achieveDesc} numberOfLines={1}>{achievement.description}</Text>
        </View>

        {/* Right: XP reward */}
        <View style={[styles.xpWrap, { backgroundColor: rarityColor + '18' }]}>
          <Text style={[styles.xpAmount, { color: rarityColor }]}>+{achievement.xpReward}</Text>
          <Text style={styles.xpLabel}>XP</Text>
        </View>
      </Pressable>

      {/* Countdown progress bar */}
      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, { backgroundColor: rarityColor, width: progressWPct }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 9999,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 26 },
  textBlock: { flex: 1, gap: 3 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rarityBadge: {
    borderRadius: Radii.full,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  rarityText: { fontSize: 9, fontWeight: FontWeight.black, letterSpacing: 0.8 },
  unlockLabel: { fontSize: FontSize.xs, color: Colors.neonGold },
  achieveName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
  },
  achieveDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },
  xpWrap: {
    borderRadius: Radii.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 48,
  },
  xpAmount: { fontSize: FontSize.base, fontWeight: FontWeight.black },
  xpLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: FontWeight.bold },
  progressBg: { height: 3, backgroundColor: Colors.bgPanel },
  progressFill: { height: '100%' },
});

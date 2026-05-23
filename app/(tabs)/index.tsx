import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { useGame } from '@/hooks/useGame';
import XPBar from '@/components/ui/XPBar';
import CyberCard from '@/components/ui/CyberCard';
import StatBadge from '@/components/feature/StatBadge';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const accuracy = gameState.totalAnswered > 0
    ? Math.round((gameState.totalCorrect / gameState.totalAnswered) * 100)
    : 0;

  const pressIn = (anim: Animated.Value) => Animated.spring(anim, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = (anim: Animated.Value) => Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào, Thám Tử! 👋</Text>
            <Text style={styles.subGreeting}>Sẵn sàng chiến đấu chưa?</Text>
          </View>
          <Pressable onPress={() => router.push('/leaderboard')} style={styles.notifBtn}>
            <MaterialIcons name="leaderboard" size={22} color={Colors.neonGold} />
          </Pressable>
        </View>

        {/* XP & Level Card */}
        <CyberCard glowColor={Colors.neonCyan} style={styles.xpCard}>
          <View style={styles.xpTop}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankIcon}>🥈</Text>
              <Text style={styles.rankText}>{gameState.rank}</Text>
            </View>
            <View style={styles.streakRow}>
              <Text style={styles.streakFire}>🔥</Text>
              <Text style={styles.streakNum}>{gameState.streak} ngày</Text>
            </View>
          </View>
          <XPBar currentXP={gameState.xp} level={gameState.level} />
          <View style={styles.statRow}>
            <StatBadge icon="⚡" value={gameState.xp.toLocaleString()} label="XP" color={Colors.neonCyan} />
            <StatBadge icon="🎯" value={`${accuracy}%`} label="Chính xác" color={Colors.neonGreen} />
            <StatBadge icon="💰" value={gameState.coins} label="Coins" color={Colors.neonGold} />
          </View>
        </CyberCard>

        {/* Daily Challenge Banner */}
        <Pressable onPress={() => router.push('/daily-challenge')}>
          <CyberCard glowColor={Colors.neonGold} style={styles.dailyCard}>
            <View style={styles.dailyContent}>
              <View>
                <View style={styles.dailyBadge}>
                  <Text style={styles.dailyBadgeText}>HÀNG NGÀY</Text>
                </View>
                <Text style={styles.dailyTitle}>Thử Thách Hôm Nay 🏆</Text>
                <Text style={styles.dailyDesc}>Phân loại 10 Clickbait · +200 XP</Text>
                <Text style={styles.dailyTimer}>⏱ Còn: 14:23:00</Text>
              </View>
              <Text style={styles.dailyEmoji}>🎣</Text>
            </View>
            <View style={styles.dailyBar}>
              <View style={[styles.dailyProgress, { width: '0%' }]} />
            </View>
          </CyberCard>
        </Pressable>

        {/* Main Game Modes */}
        <Text style={styles.sectionTitle}>Chế Độ Chơi</Text>
        <View style={styles.modesGrid}>
          
          <Animated.View style={[styles.modeCardWrap, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
              onPress={() => router.push('/battle-game')}
              onPressIn={() => pressIn(scaleAnim)}
              onPressOut={() => pressOut(scaleAnim)}
            >
              <CyberCard glowColor={Colors.neonCyan} style={styles.modeCard}>
                <Image source={require('@/assets/images/hero-banner.png')} style={styles.modeBg} contentFit="cover" />
                <View style={styles.modeOverlay}>
                  <View style={[styles.modePill, { backgroundColor: Colors.neonCyan + '30', borderColor: Colors.neonCyan }]}>
                    <Text style={[styles.modePillText, { color: Colors.neonCyan }]}>⚔️ BATTLE</Text>
                  </View>
                  <Text style={styles.modeName}>Chiến Đấu Quiz</Text>
                  <Text style={styles.modeDesc}>Phân loại tin thật/giả siêu tốc độ</Text>
                  <View style={styles.modeStats}>
                    <Text style={styles.modeStat}>⚡ +50-200 XP</Text>
                    <Text style={styles.modeStat}>🔥 Combo</Text>
                  </View>
                </View>
              </CyberCard>
            </Pressable>
          </Animated.View>

          <Pressable onPress={() => router.push('/investigation-game')}>
            <CyberCard glowColor={Colors.neonPurple} style={styles.modeCard}>
              <View style={[styles.modeOverlay, styles.investigateBg]}>
                <Text style={styles.modeIcon}>🕵️</Text>
                <View style={[styles.modePill, { backgroundColor: Colors.neonPurple + '30', borderColor: Colors.neonPurple }]}>
                  <Text style={[styles.modePillText, { color: Colors.neonPurple }]}>🔍 DETECTIVE</Text>
                </View>
                <Text style={styles.modeName}>Điều Tra Chuyên Sâu</Text>
                <Text style={styles.modeDesc}>Phân tích deepfake, metadata, nguồn tin</Text>
                <View style={styles.modeStats}>
                  <Text style={styles.modeStat}>🏆 +100-300 XP</Text>
                  <Text style={styles.modeStat}>🧩 Case Study</Text>
                </View>
              </View>
            </CyberCard>
          </Pressable>
        </View>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Thành Tích Của Bạn</Text>
        <CyberCard style={styles.achieveCard}>
          <View style={styles.achieveGrid}>
            {[
              { icon: '🎯', val: gameState.totalCorrect, label: 'Trả lời đúng' },
              { icon: '⚡', val: gameState.maxCombo, label: 'Combo cao nhất' },
              { icon: '📚', val: '3', label: 'Kỹ năng học' },
              { icon: '🏅', val: '5', label: 'Huy hiệu' },
            ].map((item, i) => (
              <View key={i} style={styles.achieveItem}>
                <Text style={styles.achieveIcon}>{item.icon}</Text>
                <Text style={styles.achieveVal}>{item.val}</Text>
                <Text style={styles.achieveLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </CyberCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Học Nhanh</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {[
            { label: '🎣 Clickbait', color: Colors.neonCyan, route: '/skills' },
            { label: '🔍 Nguồn Tin', color: Colors.neonGreen, route: '/skills' },
            { label: '🎭 Deepfake', color: Colors.neonPurple, route: '/skills' },
            { label: '📹 Video', color: Colors.neonPink, route: '/video-learning' },
          ].map((q, i) => (
            <Pressable key={i} onPress={() => router.push(q.route as any)}>
              <View style={[styles.quickChip, { borderColor: q.color + '60', backgroundColor: q.color + '15' }]}>
                <Text style={[styles.quickChipText, { color: q.color }]}>{q.label}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  greeting: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  subGreeting: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  notifBtn: {
    width: 44, height: 44, borderRadius: Radii.full,
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  xpCard: { padding: Spacing.base, marginBottom: Spacing.md, gap: Spacing.md },
  xpTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rankIcon: { fontSize: 20 },
  rankText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakFire: { fontSize: 18 },
  streakNum: { color: Colors.neonGold, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },

  dailyCard: { padding: Spacing.base, marginBottom: Spacing.lg },
  dailyContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  dailyBadge: {
    backgroundColor: Colors.neonGold + '30', borderRadius: Radii.sm, paddingHorizontal: 8, paddingVertical: 2,
    alignSelf: 'flex-start', marginBottom: 6, borderWidth: 1, borderColor: Colors.neonGold + '60',
  },
  dailyBadgeText: { color: Colors.neonGold, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1 },
  dailyTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  dailyDesc: { fontSize: FontSize.sm, color: Colors.textSecondary },
  dailyTimer: { fontSize: FontSize.xs, color: Colors.neonOrange, marginTop: 4, fontWeight: FontWeight.semibold },
  dailyEmoji: { fontSize: 48 },
  dailyBar: { height: 4, backgroundColor: Colors.bgPanel, borderRadius: Radii.full, overflow: 'hidden' },
  dailyProgress: { height: '100%', backgroundColor: Colors.neonGold, borderRadius: Radii.full },

  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary,
    marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  modesGrid: { gap: Spacing.sm, marginBottom: Spacing.md },
  modeCardWrap: {},
  modeCard: { height: 180, overflow: 'hidden' },
  modeBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modeOverlay: {
    flex: 1, padding: Spacing.base,
    backgroundColor: 'rgba(5,5,16,0.7)',
    justifyContent: 'flex-end', gap: 4,
  },
  investigateBg: { backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'flex-start' },
  modeIcon: { fontSize: 48, marginBottom: 4 },
  modePill: {
    alignSelf: 'flex-start', borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4,
  },
  modePillText: { fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1 },
  modeName: { fontSize: FontSize.lg, fontWeight: FontWeight.black, color: Colors.textPrimary },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textSecondary },
  modeStats: { flexDirection: 'row', gap: Spacing.md },
  modeStat: { fontSize: FontSize.xs, color: Colors.textMuted },

  achieveCard: { padding: Spacing.base, marginBottom: Spacing.md },
  achieveGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  achieveItem: { alignItems: 'center', gap: 4 },
  achieveIcon: { fontSize: 24 },
  achieveVal: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  achieveLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },

  quickRow: { flexDirection: 'row', gap: Spacing.sm, paddingRight: Spacing.base },
  quickChip: {
    borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10,
  },
  quickChipText: { fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
});

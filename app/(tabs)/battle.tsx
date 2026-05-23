import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { useGame } from '@/hooks/useGame';
import CyberCard from '@/components/ui/CyberCard';
import NeonButton from '@/components/ui/NeonButton';

const { width } = Dimensions.get('window');

const MODES = [
  {
    id: 'quick',
    title: 'Chiến Nhanh',
    subtitle: 'Quick Battle',
    desc: 'Phân loại 10 tin tức trong 60 giây. Nhanh, nghiện, và hồi hộp!',
    icon: '⚡',
    color: Colors.neonCyan,
    xp: '50-150 XP',
    time: '60 giây',
    badge: 'HOT',
  },
  {
    id: 'ranked',
    title: 'Xếp Hạng',
    subtitle: 'Ranked Mode',
    desc: 'Thi đấu để leo rank. Combo × 2.0 XP. Mất streak nếu sai liên tiếp.',
    icon: '🏆',
    color: Colors.neonGold,
    xp: '100-300 XP',
    time: '90 giây',
    badge: 'RANKED',
  },
  {
    id: 'pvp',
    title: 'PvP 1v1',
    subtitle: 'Player vs Player',
    desc: 'Đấu trực tiếp với người khác. Ai đúng nhiều hơn trong 60s sẽ thắng — XP ×2!',
    icon: '🥊',
    color: Colors.neonPink,
    xp: '200-500 XP (×2)',
    time: '60 giây',
    badge: 'LIVE PvP',
  },
  {
    id: 'daily',
    title: 'Thử Thách Ngày',
    subtitle: 'Daily Challenge',
    desc: 'Nhiệm vụ đặc biệt mỗi ngày. Hoàn thành để nhận bonus XP và coins.',
    icon: '📅',
    color: Colors.neonOrange,
    xp: '+200 XP Bonus',
    time: 'Hết hôm nay',
    badge: 'DAILY',
  },
];

const CATEGORIES = [
  { icon: '📰', label: 'Fake News', color: Colors.neonPink, count: 234 },
  { icon: '🤖', label: 'AI Generated', color: Colors.neonPurple, count: 89 },
  { icon: '🎭', label: 'Deepfake', color: Colors.neonCyan, count: 56 },
  { icon: '🎣', label: 'Clickbait', color: Colors.neonGold, count: 178 },
  { icon: '✂️', label: 'Cắt Ngữ Cảnh', color: Colors.neonOrange, count: 112 },
];

export default function BattleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚔️ Chiến Đấu</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>🥈 {gameState.rank}</Text>
          </View>
        </View>

        {/* Current Streak */}
        <CyberCard glowColor={Colors.neonGold} style={styles.streakCard}>
          <Text style={styles.streakLabel}>🔥 Chuỗi Chiến Thắng</Text>
          <View style={styles.streakRow}>
            {Array.from({ length: 7 }).map((_, i) => (
              <View key={i} style={[styles.streakDot, i < gameState.streak ? styles.streakActive : styles.streakInactive]} />
            ))}
          </View>
          <Text style={styles.streakInfo}>{gameState.streak} ngày liên tiếp · Tiếp tục để giữ streak!</Text>
        </CyberCard>

        {/* Battle Modes */}
        <Text style={styles.sectionTitle}>Chọn Chế Độ</Text>
        <View style={styles.modesGrid}>
          {MODES.map(mode => (
            <Pressable key={mode.id} onPress={() => router.push(mode.id === 'pvp' ? '/pvp-battle' : '/battle-game')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, transform: pressed ? [{ scale: 0.98 }] : [] }]}>
              <CyberCard glowColor={mode.color} style={styles.modeCard}>
                <View style={styles.modeTop}>
                  <View style={styles.modeLeft}>
                    <Text style={styles.modeIcon}>{mode.icon}</Text>
                    <View>
                      <View style={[styles.modeBadge, { backgroundColor: mode.color + '25', borderColor: mode.color + '60' }]}>
                        <Text style={[styles.modeBadgeText, { color: mode.color }]}>{mode.badge}</Text>
                      </View>
                      <Text style={styles.modeTitle}>{mode.title}</Text>
                      <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.modeArrow}>
                    <Text style={[styles.arrowText, { color: mode.color }]}>›</Text>
                  </View>
                </View>
                <Text style={styles.modeDesc}>{mode.desc}</Text>
                <View style={styles.modeMeta}>
                  <Text style={styles.metaTag}>⚡ {mode.xp}</Text>
                  <Text style={styles.metaTag}>⏱ {mode.time}</Text>
                </View>
              </CyberCard>
            </Pressable>
          ))}
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Luyện Tập Theo Chủ Đề</Text>
        <View style={styles.catGrid}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat.label} onPress={() => router.push('/battle-game')}>
              <View style={[styles.catCard, { borderColor: cat.color + '50', backgroundColor: cat.color + '12' }]}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
                <Text style={styles.catCount}>{cat.count} bài</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.base },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  rankBadge: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  rankText: { color: Colors.textPrimary, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  streakCard: { padding: Spacing.base, marginBottom: Spacing.lg, gap: Spacing.sm },
  streakLabel: { color: Colors.neonGold, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  streakRow: { flexDirection: 'row', gap: 8 },
  streakDot: { width: 36, height: 10, borderRadius: Radii.full },
  streakActive: { backgroundColor: Colors.neonGold, shadowColor: Colors.neonGold, shadowOpacity: 0.8, shadowRadius: 4, shadowOffset: { width: 0, height: 0 } },
  streakInactive: { backgroundColor: Colors.bgPanel },
  streakInfo: { fontSize: FontSize.xs, color: Colors.textMuted },

  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },

  modesGrid: { gap: Spacing.sm, marginBottom: Spacing.md },
  modeCard: { padding: Spacing.base, gap: Spacing.sm },
  modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  modeIcon: { fontSize: 36 },
  modeBadge: { borderRadius: Radii.sm, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  modeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 0.8 },
  modeTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  modeSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted },
  modeArrow: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  arrowText: { fontSize: 32, fontWeight: FontWeight.black, lineHeight: 36 },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  modeMeta: { flexDirection: 'row', gap: Spacing.sm },
  metaTag: { fontSize: FontSize.xs, color: Colors.textMuted, backgroundColor: Colors.bgPanel, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  catCard: {
    borderRadius: Radii.lg, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12,
    alignItems: 'center', minWidth: (width - 48 - 12) / 2, gap: 4,
    width: (width - 48 - 12) / 2,
  },
  catIcon: { fontSize: 28 },
  catLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  catCount: { fontSize: FontSize.xs, color: Colors.textMuted },
});

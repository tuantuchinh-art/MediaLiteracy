import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { useGame } from '@/hooks/useGame';
import CyberCard from '@/components/ui/CyberCard';
import XPBar from '@/components/ui/XPBar';
import NeonButton from '@/components/ui/NeonButton';

const BADGES = [
  { icon: '🔍', label: 'Thám Tử', earned: true },
  { icon: '🎣', label: 'Anti-Clickbait', earned: true },
  { icon: '🔥', label: '7 Ngày', earned: true },
  { icon: '🏆', label: 'Top 100', earned: false },
  { icon: '💎', label: 'Diamond', earned: false },
  { icon: '🤖', label: 'AI Hunter', earned: false },
];

const MENU_ITEMS = [
  { icon: '📹', label: 'Video Học Tập', route: '/video-learning', color: Colors.neonPink },
  { icon: '🏅', label: 'Bảng Xếp Hạng', route: '/leaderboard', color: Colors.neonGold },
  { icon: '📅', label: 'Thử Thách Hàng Ngày', route: '/daily-challenge', color: Colors.neonOrange },
  { icon: '⭐', label: 'Nâng Cấp Premium', route: '/premium', color: Colors.neonGold },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();

  const accuracy = gameState.totalAnswered > 0
    ? Math.round((gameState.totalCorrect / gameState.totalAnswered) * 100)
    : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Profile Hero */}
        <CyberCard glowColor={Colors.neonCyan} style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={require('@/assets/images/avatar-default.png')}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.avatarLevel}>
                <Text style={styles.avatarLevelText}>{gameState.level}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Thám Tử Ẩn Danh</Text>
              <Text style={styles.profileHandle}>@media_hunter</Text>
              <View style={styles.rankRow}>
                <Text style={styles.rankIcon}>🥈</Text>
                <Text style={styles.rankLabel}>{gameState.rank}</Text>
              </View>
            </View>
            <Pressable style={styles.editBtn}>
              <MaterialIcons name="edit" size={18} color={Colors.neonCyan} />
            </Pressable>
          </View>
          <XPBar currentXP={gameState.xp} level={gameState.level} />
        </CyberCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { val: gameState.totalCorrect, label: 'Đúng', color: Colors.neonGreen, icon: '🎯' },
            { val: `${accuracy}%`, label: 'Chính Xác', color: Colors.neonCyan, icon: '📊' },
            { val: gameState.streak, label: 'Streak', color: Colors.neonGold, icon: '🔥' },
            { val: gameState.maxCombo, label: 'Best Combo', color: Colors.neonPink, icon: '⚡' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { borderColor: stat.color + '40', backgroundColor: stat.color + '12' }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statVal, { color: stat.color }]}>{stat.val}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Huy Hiệu</Text>
        <CyberCard style={styles.badgesCard}>
          <View style={styles.badgesRow}>
            {BADGES.map(badge => (
              <View key={badge.label} style={[styles.badgeItem, !badge.earned && styles.badgeLocked]}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
                {!badge.earned && <View style={styles.badgeLockOverlay}><Text style={styles.badgeLockText}>🔒</Text></View>}
              </View>
            ))}
          </View>
        </CyberCard>

        {/* Premium CTA */}
        {!gameState.isPremium && (
          <CyberCard glowColor={Colors.neonGold} style={styles.premiumCard}>
            <View style={styles.premiumContent}>
              <View>
                <Text style={styles.premiumTitle}>⭐ Nâng Cấp Premium</Text>
                <Text style={styles.premiumDesc}>Mở khóa deepfake, OSINT, video chuyên sâu</Text>
              </View>
              <NeonButton label="Xem Gói" onPress={() => router.push('/premium')} color={Colors.neonGold} size="sm" />
            </View>
          </CyberCard>
        )}

        {/* Menu Items */}
        <Text style={styles.sectionTitle}>Khám Phá</Text>
        <CyberCard style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }, i < MENU_ITEMS.length - 1 && styles.menuDivider]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
            </Pressable>
          ))}
        </CyberCard>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base },
  profileCard: { padding: Spacing.base, marginVertical: Spacing.base, gap: Spacing.md },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: Colors.neonCyan },
  avatarLevel: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: Colors.neonCyan, borderRadius: Radii.full, width: 24, height: 24,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.bgCard,
  },
  avatarLevelText: { color: Colors.bg, fontSize: 11, fontWeight: FontWeight.black },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  profileHandle: { fontSize: FontSize.sm, color: Colors.textMuted },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rankIcon: { fontSize: 16 },
  rankLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  editBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgPanel,
    borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },

  statsGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: {
    flex: 1, alignItems: 'center', borderRadius: Radii.lg, borderWidth: 1,
    paddingVertical: Spacing.md, gap: 3,
  },
  statIcon: { fontSize: 20 },
  statVal: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted },

  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.sm },

  badgesCard: { padding: Spacing.base, marginBottom: Spacing.sm },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-around' },
  badgeItem: { alignItems: 'center', gap: 4, width: 72, position: 'relative' },
  badgeLocked: { opacity: 0.4 },
  badgeIcon: { fontSize: 32 },
  badgeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
  badgeLockOverlay: { position: 'absolute', top: 4, right: 10 },
  badgeLockText: { fontSize: 12 },

  premiumCard: { padding: Spacing.base, marginBottom: Spacing.sm },
  premiumContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.md },
  premiumTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.neonGold, marginBottom: 4 },
  premiumDesc: { fontSize: FontSize.sm, color: Colors.textSecondary },

  menuCard: { marginBottom: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.base },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 40, height: 40, borderRadius: Radii.md, justifyContent: 'center', alignItems: 'center' },
  menuIconText: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: FontWeight.medium },
});

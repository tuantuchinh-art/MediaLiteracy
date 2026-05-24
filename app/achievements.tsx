import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import {
  ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, AchievementCategory,
  Achievement,
} from '@/constants/achievements';
import { useAchievements } from '@/hooks/useAchievements';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - Spacing.base * 2 - Spacing.sm * 2) / 3;

const RARITY_ORDER = ['Common', 'Rare', 'Epic', 'Legendary'];

const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  'Streak': '🔥',
  'Chiến Đấu': '⚔️',
  'PvP': '🥊',
  'Điều Tra': '🕵️',
  'Kỹ Năng': '📚',
  'Đặc Biệt': '✨',
};

function AchievementCard({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const rc = achievement.rarityColor;
  return (
    <View style={[
      styles.card,
      unlocked
        ? { borderColor: rc + '60', backgroundColor: rc + '10' }
        : { borderColor: Colors.border, backgroundColor: Colors.bgPanel + '80' },
    ]}>
      {/* Rarity top bar */}
      <View style={[styles.cardRarityBar, { backgroundColor: unlocked ? rc : Colors.border }]} />

      {/* Icon */}
      <View style={[styles.cardIconWrap, { opacity: unlocked ? 1 : 0.35 }]}>
        <Text style={styles.cardIcon}>{unlocked ? achievement.icon : '🔒'}</Text>
      </View>

      {/* Name */}
      <Text
        style={[styles.cardName, { color: unlocked ? Colors.textPrimary : Colors.textMuted }]}
        numberOfLines={2}
      >
        {unlocked ? achievement.name : '???'}
      </Text>

      {/* Rarity pill */}
      {unlocked && (
        <View style={[styles.cardRarityPill, { backgroundColor: rc + '20', borderColor: rc + '50' }]}>
          <Text style={[styles.cardRarityText, { color: rc }]}>{achievement.rarity}</Text>
        </View>
      )}

      {/* XP reward */}
      {unlocked && (
        <Text style={[styles.cardXP, { color: rc }]}>+{achievement.xpReward} XP</Text>
      )}

      {/* Unlocked checkmark */}
      {unlocked && (
        <View style={[styles.checkBadge, { backgroundColor: rc }]}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </View>
  );
}

function AchievementDetail({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const rc = achievement.rarityColor;
  return (
    <View style={[
      styles.detail,
      { borderColor: unlocked ? rc + '50' : Colors.border }
    ]}>
      <View style={styles.detailLeft}>
        <View style={[styles.detailIconWrap, { backgroundColor: unlocked ? rc + '20' : Colors.bgPanel, borderColor: unlocked ? rc + '50' : Colors.border }]}>
          <Text style={[styles.detailIcon, { opacity: unlocked ? 1 : 0.4 }]}>
            {unlocked ? achievement.icon : '🔒'}
          </Text>
        </View>
      </View>
      <View style={styles.detailMiddle}>
        <View style={styles.detailTopRow}>
          <Text style={[styles.detailName, { color: unlocked ? Colors.textPrimary : Colors.textMuted }]}>
            {unlocked ? achievement.name : '??? Chưa Mở Khóa'}
          </Text>
          <View style={[styles.rarityBadge, { backgroundColor: rc + '20', borderColor: rc + '50' }]}>
            <Text style={[styles.rarityBadgeText, { color: rc }]}>{achievement.rarity}</Text>
          </View>
        </View>
        <Text style={styles.detailCondition}>{achievement.condition}</Text>
        {unlocked && (
          <Text style={styles.detailDesc} numberOfLines={2}>{achievement.description}</Text>
        )}
      </View>
      <View style={styles.detailRight}>
        {unlocked ? (
          <>
            <Text style={[styles.detailXPVal, { color: rc }]}>+{achievement.xpReward}</Text>
            <Text style={styles.detailXPLabel}>XP</Text>
          </>
        ) : (
          <MaterialIcons name="lock" size={20} color={Colors.textMuted} />
        )}
      </View>
    </View>
  );
}

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { unlockedIds, unlockedList } = useAchievements();
  const [selectedCat, setSelectedCat] = useState<AchievementCategory | 'Tất Cả'>('Tất Cả');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const totalCount    = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.size;
  const progress      = Math.round((unlockedCount / totalCount) * 100);

  const allCats: (AchievementCategory | 'Tất Cả')[] = ['Tất Cả', ...ACHIEVEMENT_CATEGORIES];

  const filtered = selectedCat === 'Tất Cả'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === selectedCat);

  // Sort: unlocked first, then by rarity desc
  const sorted = [...filtered].sort((a, b) => {
    const aU = unlockedIds.has(a.id) ? 0 : 1;
    const bU = unlockedIds.has(b.id) ? 0 : 1;
    if (aU !== bU) return aU - bU;
    return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
  });

  // Stats per rarity
  const byRarity = (rarity: string) => ({
    total: ACHIEVEMENTS.filter(a => a.rarity === rarity).length,
    unlocked: ACHIEVEMENTS.filter(a => a.rarity === rarity && unlockedIds.has(a.id)).length,
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>🏅 Huy Hiệu</Text>
        <Pressable
          onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
          style={styles.viewToggle}
        >
          <MaterialIcons
            name={viewMode === 'grid' ? 'view-list' : 'grid-view'}
            size={22}
            color={Colors.neonCyan}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Overall progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressTitle}>Tiến Độ Tổng</Text>
            <Text style={styles.progressCount}>
              <Text style={{ color: Colors.neonCyan }}>{unlockedCount}</Text>
              <Text style={{ color: Colors.textMuted }}>/{totalCount}</Text>
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPct}>{progress}% hoàn thành</Text>

          {/* Rarity breakdown */}
          <View style={styles.rarityRow}>
            {['Common', 'Rare', 'Epic', 'Legendary'].map(r => {
              const s = byRarity(r);
              const rc = ['#A0A0C0', '#00F5FF', '#7B2FFF', '#FFD700'][RARITY_ORDER.indexOf(r)];
              return (
                <View key={r} style={styles.rarityItem}>
                  <View style={[styles.rarityDot, { backgroundColor: rc }]} />
                  <Text style={[styles.rarityCount, { color: rc }]}>{s.unlocked}/{s.total}</Text>
                  <Text style={styles.rarityName}>{r}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {allCats.map(cat => {
            const isActive = selectedCat === cat;
            return (
              <Pressable key={cat} onPress={() => setSelectedCat(cat)}>
                <View style={[styles.filterChip, isActive ? styles.filterActive : styles.filterInactive]}>
                  <Text style={styles.filterEmoji}>
                    {cat === 'Tất Cả' ? '🌐' : CATEGORY_ICONS[cat as AchievementCategory]}
                  </Text>
                  <Text style={[styles.filterText, isActive ? styles.filterTextActive : styles.filterTextInactive]}>
                    {cat}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Count label */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultLabel}>
            {sorted.filter(a => unlockedIds.has(a.id)).length} đã mở ·{' '}
            {sorted.filter(a => !unlockedIds.has(a.id)).length} chưa mở
          </Text>
        </View>

        {/* Grid or List */}
        {viewMode === 'grid' ? (
          <View style={styles.grid}>
            {sorted.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedIds.has(achievement.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {sorted.map((achievement, i) => (
              <AchievementDetail
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedIds.has(achievement.id)}
              />
            ))}
          </View>
        )}

        {/* Recently Unlocked */}
        {unlockedList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🕒 Mới Mở Khóa</Text>
            <View style={styles.recentList}>
              {[...unlockedList]
                .sort((a, b) => b.unlockedAt - a.unlockedAt)
                .slice(0, 3)
                .map(u => {
                  const a = ACHIEVEMENTS.find(x => x.id === u.id);
                  if (!a) return null;
                  return (
                    <View key={u.id} style={[styles.recentItem, { borderColor: a.rarityColor + '40' }]}>
                      <Text style={styles.recentIcon}>{a.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.recentName}>{a.name}</Text>
                        <Text style={styles.recentTime}>
                          {u.unlockedAt > Date.now() - 60000
                            ? 'Vừa mở khóa'
                            : u.unlockedAt > Date.now() - 3600000
                            ? 'Hôm nay'
                            : `${Math.floor((Date.now() - u.unlockedAt) / 86400000)} ngày trước`}
                        </Text>
                      </View>
                      <Text style={[styles.recentXP, { color: a.rarityColor }]}>+{a.xpReward} XP</Text>
                    </View>
                  );
                })}
            </View>
          </>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  viewToggle: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  scroll: { paddingHorizontal: Spacing.base },

  // Progress card
  progressCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1,
    borderColor: Colors.neonCyan + '30', padding: Spacing.base,
    marginBottom: Spacing.md, gap: Spacing.sm,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  progressCount: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  progressBarBg: { height: 8, backgroundColor: Colors.bgPanel, borderRadius: Radii.full, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.neonCyan, borderRadius: Radii.full },
  progressPct: { fontSize: FontSize.xs, color: Colors.textMuted },
  rarityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  rarityItem: { alignItems: 'center', gap: 3 },
  rarityDot: { width: 10, height: 10, borderRadius: 5 },
  rarityCount: { fontSize: FontSize.sm, fontWeight: FontWeight.black },
  rarityName: { fontSize: 9, color: Colors.textMuted },

  // Filter
  filterScroll: { marginBottom: Spacing.sm },
  filterRow: { flexDirection: 'row', gap: Spacing.sm, paddingRight: Spacing.sm },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  filterActive: { backgroundColor: Colors.neonCyan + '20', borderColor: Colors.neonCyan },
  filterInactive: { backgroundColor: 'transparent', borderColor: Colors.border },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  filterTextActive: { color: Colors.neonCyan },
  filterTextInactive: { color: Colors.textSecondary },

  // Result header
  resultHeader: { marginBottom: Spacing.md },
  resultLabel: { fontSize: FontSize.sm, color: Colors.textMuted },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  card: {
    width: CARD_SIZE,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 130,
    justifyContent: 'center',
  },
  cardRarityBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardIconWrap: { marginTop: Spacing.sm },
  cardIcon: { fontSize: 30 },
  cardName: { fontSize: 10, fontWeight: FontWeight.bold, textAlign: 'center', lineHeight: 14 },
  cardRarityPill: {
    borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  cardRarityText: { fontSize: 8, fontWeight: FontWeight.black },
  cardXP: { fontSize: 9, fontWeight: FontWeight.black },
  checkBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  checkText: { fontSize: 9, fontWeight: FontWeight.black, color: '#000' },

  // List
  list: { gap: Spacing.sm, marginBottom: Spacing.md },
  detail: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg, borderWidth: 1,
    padding: Spacing.md,
  },
  detailLeft: {},
  detailIconWrap: {
    width: 50, height: 50, borderRadius: 25, borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
  },
  detailIcon: { fontSize: 24 },
  detailMiddle: { flex: 1, gap: 3 },
  detailTopRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  detailName: { fontSize: FontSize.base, fontWeight: FontWeight.bold, flex: 1 },
  rarityBadge: { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2 },
  rarityBadgeText: { fontSize: 9, fontWeight: FontWeight.black },
  detailCondition: { fontSize: FontSize.xs, color: Colors.textMuted },
  detailDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 16 },
  detailRight: { alignItems: 'center', minWidth: 40 },
  detailXPVal: { fontSize: FontSize.base, fontWeight: FontWeight.black },
  detailXPLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: FontWeight.bold },

  // Section title
  sectionTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary,
    marginBottom: Spacing.sm, marginTop: Spacing.md,
  },

  // Recently unlocked
  recentList: { gap: Spacing.sm, marginBottom: Spacing.md },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg, borderWidth: 1,
    padding: Spacing.md,
  },
  recentIcon: { fontSize: 28 },
  recentName: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  recentTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  recentXP: { fontSize: FontSize.base, fontWeight: FontWeight.black },
});

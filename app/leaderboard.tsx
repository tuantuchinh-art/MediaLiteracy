import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { LEADERBOARD } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';
import CyberCard from '@/components/ui/CyberCard';

const TABS = ['Toàn Cầu', 'Việt Nam', 'Bạn Bè'];
const RANK_COLORS: Record<number, string> = { 1: Colors.neonGold, 2: Colors.rankSilver, 3: Colors.rankBronze };

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();
  const [activeTab, setActiveTab] = useState(0);

  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>🏆 Bảng Xếp Hạng</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab, i) => (
          <Pressable key={tab} onPress={() => setActiveTab(i)} style={[styles.tabBtn, activeTab === i && styles.tabBtnActive]}>
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Top 3 Podium */}
        <View style={styles.podium}>
          {/* 2nd */}
          <View style={[styles.podiumItem, styles.podiumSecond]}>
            <Text style={styles.podiumBadge}>{top3[1].badge}</Text>
            <View style={[styles.podiumAvatar, { borderColor: Colors.rankSilver }]}>
              <Text style={styles.podiumAvatarText}>{top3[1].name[0]}</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[1].name}</Text>
            <Text style={[styles.podiumXP, { color: Colors.rankSilver }]}>{top3[1].xp.toLocaleString()}</Text>
            <View style={[styles.podiumBlock, { height: 60, backgroundColor: Colors.rankSilver + '30', borderColor: Colors.rankSilver + '60' }]}>
              <Text style={[styles.podiumRankNum, { color: Colors.rankSilver }]}>2</Text>
            </View>
          </View>

          {/* 1st */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <Text style={styles.podiumBadgeLarge}>{top3[0].badge}</Text>
            <View style={[styles.podiumAvatarLarge, { borderColor: Colors.neonGold }]}>
              <Text style={styles.podiumAvatarTextLarge}>{top3[0].name[0]}</Text>
            </View>
            <Text style={styles.podiumNameLarge} numberOfLines={1}>{top3[0].name}</Text>
            <Text style={[styles.podiumXP, { color: Colors.neonGold }]}>{top3[0].xp.toLocaleString()}</Text>
            <View style={[styles.podiumBlock, { height: 80, backgroundColor: Colors.neonGold + '30', borderColor: Colors.neonGold + '60' }]}>
              <Text style={[styles.podiumRankNum, { color: Colors.neonGold, fontSize: FontSize.xxl }]}>1</Text>
            </View>
          </View>

          {/* 3rd */}
          <View style={[styles.podiumItem, styles.podiumThird]}>
            <Text style={styles.podiumBadge}>{top3[2].badge}</Text>
            <View style={[styles.podiumAvatar, { borderColor: Colors.rankBronze }]}>
              <Text style={styles.podiumAvatarText}>{top3[2].name[0]}</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[2].name}</Text>
            <Text style={[styles.podiumXP, { color: Colors.rankBronze }]}>{top3[2].xp.toLocaleString()}</Text>
            <View style={[styles.podiumBlock, { height: 44, backgroundColor: Colors.rankBronze + '30', borderColor: Colors.rankBronze + '60' }]}>
              <Text style={[styles.podiumRankNum, { color: Colors.rankBronze }]}>3</Text>
            </View>
          </View>
        </View>

        {/* Rest of leaderboard */}
        <CyberCard style={styles.listCard}>
          {rest.map((player, i) => (
            <View key={player.rank} style={[styles.playerRow, i < rest.length - 1 && styles.playerDivider]}>
              <Text style={styles.playerRank}>#{player.rank}</Text>
              <View style={styles.playerAvatarSmall}>
                <Text style={styles.playerAvatarText}>{player.name[0]}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerStreak}>🔥 {player.streak} ngày</Text>
              </View>
              <View style={styles.playerRight}>
                <Text style={styles.playerBadge}>{player.badge}</Text>
                <Text style={styles.playerXP}>{player.xp.toLocaleString()} XP</Text>
              </View>
            </View>
          ))}
        </CyberCard>

        {/* Your Rank */}
        <CyberCard glowColor={Colors.neonCyan} style={styles.yourRankCard}>
          <View style={styles.playerRow}>
            <Text style={styles.playerRank}>#247</Text>
            <View style={[styles.playerAvatarSmall, { borderColor: Colors.neonCyan }]}>
              <Text style={styles.playerAvatarText}>B</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={[styles.playerName, { color: Colors.neonCyan }]}>Bạn</Text>
              <Text style={styles.playerStreak}>🔥 {gameState.streak} ngày</Text>
            </View>
            <View style={styles.playerRight}>
              <Text style={styles.playerBadge}>🥉</Text>
              <Text style={[styles.playerXP, { color: Colors.neonCyan }]}>{gameState.xp.toLocaleString()} XP</Text>
            </View>
          </View>
        </CyberCard>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },

  tabsRow: { flexDirection: 'row', marginHorizontal: Spacing.base, backgroundColor: Colors.bgCard, borderRadius: Radii.full, padding: 4, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radii.full },
  tabBtnActive: { backgroundColor: Colors.neonCyan },
  tabText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  tabTextActive: { color: Colors.bg, fontWeight: FontWeight.bold },

  scroll: { paddingHorizontal: Spacing.base },

  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: Spacing.lg, gap: 0 },
  podiumItem: { flex: 1, alignItems: 'center', gap: 4 },
  podiumFirst: { zIndex: 1 },
  podiumSecond: {},
  podiumThird: {},
  podiumBadge: { fontSize: 20 },
  podiumBadgeLarge: { fontSize: 28 },
  podiumAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, backgroundColor: Colors.bgPanel, justifyContent: 'center', alignItems: 'center' },
  podiumAvatarLarge: { width: 66, height: 66, borderRadius: 33, borderWidth: 2.5, backgroundColor: Colors.bgPanel, justifyContent: 'center', alignItems: 'center' },
  podiumAvatarText: { fontSize: FontSize.md, fontWeight: FontWeight.black, color: Colors.textPrimary },
  podiumAvatarTextLarge: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  podiumName: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', fontWeight: FontWeight.semibold, maxWidth: 90 },
  podiumNameLarge: { fontSize: FontSize.sm, color: Colors.textPrimary, textAlign: 'center', fontWeight: FontWeight.bold, maxWidth: 100 },
  podiumXP: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  podiumBlock: { width: '100%', borderRadius: Radii.md, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  podiumRankNum: { fontSize: FontSize.lg, fontWeight: FontWeight.black },

  listCard: { marginBottom: Spacing.sm },
  playerRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.md },
  playerDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  playerRank: { color: Colors.textMuted, fontWeight: FontWeight.bold, fontSize: FontSize.sm, width: 30 },
  playerAvatarSmall: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bgPanel, justifyContent: 'center', alignItems: 'center' },
  playerAvatarText: { fontSize: FontSize.base, fontWeight: FontWeight.black, color: Colors.textPrimary },
  playerInfo: { flex: 1, gap: 2 },
  playerName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  playerStreak: { fontSize: FontSize.xs, color: Colors.textMuted },
  playerRight: { alignItems: 'flex-end', gap: 2 },
  playerBadge: { fontSize: 18 },
  playerXP: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: FontWeight.semibold },

  yourRankCard: { padding: 0, marginBottom: Spacing.sm },
});

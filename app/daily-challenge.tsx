import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { DAILY_CHALLENGES } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';
import CyberCard from '@/components/ui/CyberCard';
import NeonButton from '@/components/ui/NeonButton';

const WEEKLY_REWARDS = [
  { day: 'T2', done: true, xp: 50, icon: '⚡' },
  { day: 'T3', done: true, xp: 75, icon: '🎯' },
  { day: 'T4', done: true, xp: 100, icon: '🔥' },
  { day: 'T5', done: true, xp: 125, icon: '💎' },
  { day: 'T6', done: true, xp: 150, icon: '🏆' },
  { day: 'T7', done: true, xp: 200, icon: '⭐' },
  { day: 'CN', done: false, xp: 300, icon: '👑', today: true },
];

export default function DailyChallengeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addXP, markChallengeComplete, gameState } = useGame();
  const [started, setStarted] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const challenge = DAILY_CHALLENGES[0];

  const handleStart = () => {
    setStarted(true);
    addXP(challenge.xpReward + challenge.bonusXP);
    markChallengeComplete();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>📅 Thử Thách Hôm Nay</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Weekly Streak Calendar */}
        <CyberCard glowColor={Colors.neonGold} style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>🔥 Chuỗi 7 Ngày</Text>
          <View style={styles.weekRow}>
            {WEEKLY_REWARDS.map(item => (
              <View key={item.day} style={styles.dayItem}>
                <View style={[
                  styles.dayCircle,
                  item.done ? styles.dayDone : item.today ? styles.dayToday : styles.dayFuture
                ]}>
                  <Text style={styles.dayIcon}>{item.icon}</Text>
                </View>
                <Text style={[styles.dayLabel, item.today && { color: Colors.neonGold }]}>{item.day}</Text>
                <Text style={styles.dayXP}>+{item.xp}</Text>
              </View>
            ))}
          </View>
        </CyberCard>

        {/* Main Challenge */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <CyberCard glowColor={Colors.neonOrange} style={styles.mainChallenge}>
            <View style={styles.challengeTop}>
              <Text style={styles.challengeEmoji}>{challenge.icon}</Text>
              <View style={styles.challengeBadges}>
                <View style={styles.hotBadge}><Text style={styles.hotText}>🔥 HOT</Text></View>
                <View style={styles.diffBadge}><Text style={styles.diffText}>{challenge.difficulty}</Text></View>
              </View>
            </View>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>

            <View style={styles.rewardRow}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>⚡</Text>
                <Text style={styles.rewardVal}>{challenge.xpReward} XP</Text>
                <Text style={styles.rewardLabel}>Base</Text>
              </View>
              <View style={styles.rewardDivider} />
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>🎁</Text>
                <Text style={[styles.rewardVal, { color: Colors.neonGold }]}>+{challenge.bonusXP} XP</Text>
                <Text style={styles.rewardLabel}>Bonus</Text>
              </View>
              <View style={styles.rewardDivider} />
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>⏱</Text>
                <Text style={styles.rewardVal}>{Math.floor(challenge.timeLimit / 60)} mín</Text>
                <Text style={styles.rewardLabel}>Thời gian</Text>
              </View>
            </View>

            <View style={styles.timerBox}>
              <Text style={styles.timerLabel}>⏰ Còn lại</Text>
              <Text style={styles.timerValue}>{challenge.expiresIn}</Text>
            </View>

            {started || gameState.dailyChallengeCompleted ? (
              <View style={styles.doneBox}>
                <Text style={styles.doneIcon}>✅</Text>
                <Text style={styles.doneText}>Đã hoàn thành hôm nay!</Text>
                <Text style={styles.doneSubText}>Quay lại ngày mai để nhận thưởng mới</Text>
              </View>
            ) : (
              <NeonButton
                label="⚡ Bắt Đầu Thử Thách"
                onPress={handleStart}
                color={Colors.neonOrange}
                fullWidth
                size="lg"
              />
            )}
          </CyberCard>
        </Animated.View>

        {/* Challenge Tips */}
        <Text style={styles.sectionTitle}>💡 Mẹo Chiến Thắng</Text>
        <CyberCard style={styles.tipsCard}>
          {[
            '🎣 Chú ý các từ khóa cảm xúc mạnh như "KINH HOÀNG", "SỐC"',
            '🔍 Tìm dấu hiệu của nguồn không rõ ràng',
            '⚡ Combo liên tiếp giúp nhân đôi XP',
            '📊 Đọc kỹ nội dung, đừng chỉ xem tiêu đề',
          ].map((tip, i) => (
            <View key={i} style={[styles.tipItem, i > 0 && styles.tipDivider]}>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
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
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.black, color: Colors.textPrimary },

  scroll: { paddingHorizontal: Spacing.base },

  calendarCard: { padding: Spacing.base, marginBottom: Spacing.md, gap: Spacing.md },
  calendarTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.neonGold },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayItem: { alignItems: 'center', gap: 4 },
  dayCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  dayDone: { backgroundColor: Colors.neonGold + '30', borderWidth: 1.5, borderColor: Colors.neonGold },
  dayToday: { backgroundColor: Colors.neonGold, shadowColor: Colors.neonGold, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  dayFuture: { backgroundColor: Colors.bgPanel, borderWidth: 1, borderColor: Colors.border },
  dayIcon: { fontSize: 18 },
  dayLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  dayXP: { fontSize: 9, color: Colors.textMuted },

  mainChallenge: { padding: Spacing.base, marginBottom: Spacing.md, gap: Spacing.md },
  challengeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  challengeEmoji: { fontSize: 52 },
  challengeBadges: { gap: 6, alignItems: 'flex-end' },
  hotBadge: { backgroundColor: Colors.neonOrange + '25', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonOrange + '60', paddingHorizontal: 10, paddingVertical: 4 },
  hotText: { color: Colors.neonOrange, fontSize: FontSize.xs, fontWeight: FontWeight.black },
  diffBadge: { backgroundColor: Colors.neonGreen + '25', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGreen + '60', paddingHorizontal: 10, paddingVertical: 4 },
  diffText: { color: Colors.neonGreen, fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  challengeTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  challengeDesc: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 24 },

  rewardRow: { flexDirection: 'row', backgroundColor: Colors.bgPanel, borderRadius: Radii.lg, padding: Spacing.md },
  rewardItem: { flex: 1, alignItems: 'center', gap: 3 },
  rewardDivider: { width: 1, backgroundColor: Colors.border },
  rewardIcon: { fontSize: 20 },
  rewardVal: { fontSize: FontSize.md, fontWeight: FontWeight.black, color: Colors.neonCyan },
  rewardLabel: { fontSize: FontSize.xs, color: Colors.textMuted },

  timerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.bgPanel, borderRadius: Radii.md, padding: Spacing.md },
  timerLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
  timerValue: { color: Colors.neonOrange, fontWeight: FontWeight.black, fontSize: FontSize.lg },

  doneBox: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  doneIcon: { fontSize: 48 },
  doneText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.neonGreen },
  doneSubText: { fontSize: FontSize.sm, color: Colors.textMuted },

  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  tipsCard: { marginBottom: Spacing.md },
  tipItem: { padding: Spacing.base },
  tipDivider: { borderTopWidth: 1, borderTopColor: Colors.border },
  tipText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});

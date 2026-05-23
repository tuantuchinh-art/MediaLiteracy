import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { SKILLS } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';
import CyberCard from '@/components/ui/CyberCard';
import NeonButton from '@/components/ui/NeonButton';

const { width } = Dimensions.get('window');

const LEVELS = ['Tất Cả', 'Cơ Bản', 'Nâng Cao', 'Chuyên Gia'];

export default function SkillsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();
  const [selectedLevel, setSelectedLevel] = useState('Tất Cả');

  const filtered = selectedLevel === 'Tất Cả' ? SKILLS : SKILLS.filter(s => s.level === selectedLevel);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌟 Kỹ Năng</Text>
          <Pressable onPress={() => router.push('/premium')}>
            <View style={styles.premiumBtn}>
              <Text style={styles.premiumBtnText}>⭐ Premium</Text>
            </View>
          </Pressable>
        </View>

        {/* Skill Tree Visual */}
        <CyberCard glowColor={Colors.neonPurple} style={styles.treeBanner}>
          <Image
            source={require('@/assets/images/skill-tree-bg.png')}
            style={styles.treeBg}
            contentFit="cover"
          />
          <View style={styles.treeOverlay}>
            <Text style={styles.treeTitle}>CÂY KỸ NĂNG</Text>
            <Text style={styles.treeSub}>Mở khóa kỹ năng để trở thành Thám Tử Truyền Thông</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>3/8 kỹ năng đã mở khóa</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '37.5%' }]} />
              </View>
            </View>
          </View>
        </CyberCard>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {LEVELS.map(lv => (
            <Pressable key={lv} onPress={() => setSelectedLevel(lv)}>
              <View style={[
                styles.filterChip,
                selectedLevel === lv ? styles.filterActive : styles.filterInactive,
              ]}>
                <Text style={[styles.filterText, selectedLevel === lv ? styles.filterTextActive : styles.filterTextInactive]}>
                  {lv}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Skills */}
        <View style={styles.skillsGrid}>
          {filtered.map(skill => {
            const isLocked = !skill.isUnlocked;
            const progress = skill.lessons > 0 ? skill.completedLessons / skill.lessons : 0;

            return (
              <Pressable
                key={skill.id}
                onPress={() => skill.isPremium ? router.push('/premium') : null}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              >
                <CyberCard
                  glowColor={isLocked ? undefined : skill.color}
                  style={[styles.skillCard, isLocked && styles.skillLocked]}
                >
                  <View style={styles.skillTop}>
                    <View style={[styles.skillIconBox, { backgroundColor: skill.color + '20', borderColor: skill.color + '50' }]}>
                      <Text style={styles.skillIconText}>{skill.icon}</Text>
                    </View>
                    <View style={styles.skillMeta}>
                      {skill.isPremium && (
                        <View style={styles.premiumMini}>
                          <Text style={styles.premiumMiniText}>⭐ PREMIUM</Text>
                        </View>
                      )}
                      {!skill.isPremium && skill.isUnlocked && (
                        <View style={styles.freeMini}>
                          <Text style={styles.freeMiniText}>✅ MIỄN PHÍ</Text>
                        </View>
                      )}
                      {isLocked && !skill.isPremium && (
                        <View style={styles.lockedMini}>
                          <Text style={styles.lockedMiniText}>🔒 {skill.xpRequired} XP</Text>
                        </View>
                      )}
                      <Text style={[styles.skillLevel, { color: skill.color }]}>{skill.level}</Text>
                    </View>
                  </View>

                  <Text style={[styles.skillName, isLocked && styles.textLocked]}>{skill.name}</Text>
                  <Text style={[styles.skillDesc, isLocked && styles.textLocked]}>{skill.description}</Text>

                  {!isLocked && !skill.isPremium && (
                    <>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: skill.color }]} />
                      </View>
                      <Text style={styles.lessonCount}>
                        {skill.completedLessons}/{skill.lessons} bài học
                      </Text>
                    </>
                  )}

                  {skill.isPremium && (
                    <NeonButton
                      label="Mở Khóa Premium ⭐"
                      onPress={() => router.push('/premium')}
                      color={Colors.neonGold}
                      variant="outline"
                      size="sm"
                    />
                  )}

                  {!skill.isPremium && !skill.isUnlocked && (
                    <Text style={styles.xpNeeded}>Cần {skill.xpRequired - gameState.xp} XP nữa</Text>
                  )}
                </CyberCard>
              </Pressable>
            );
          })}
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
  premiumBtn: {
    backgroundColor: Colors.neonGold + '25', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGold,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  premiumBtnText: { color: Colors.neonGold, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  treeBanner: { height: 160, overflow: 'hidden', marginBottom: Spacing.md },
  treeBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  treeOverlay: { flex: 1, backgroundColor: 'rgba(5,5,16,0.75)', padding: Spacing.base, justifyContent: 'flex-end', gap: 6 },
  treeTitle: { fontSize: FontSize.base, fontWeight: FontWeight.black, color: Colors.neonPurple, letterSpacing: 3 },
  treeSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  progressRow: { gap: 6 },
  progressText: { fontSize: FontSize.xs, color: Colors.textMuted },
  progressBar: { height: 6, backgroundColor: Colors.bgPanel, borderRadius: Radii.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.neonPurple, borderRadius: Radii.full },

  filterScroll: { marginBottom: Spacing.sm },
  filterRow: { flexDirection: 'row', gap: Spacing.sm, paddingRight: Spacing.base },
  filterChip: { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8 },
  filterActive: { backgroundColor: Colors.neonCyan, borderColor: Colors.neonCyan },
  filterInactive: { backgroundColor: 'transparent', borderColor: Colors.border },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  filterTextActive: { color: Colors.bg },
  filterTextInactive: { color: Colors.textSecondary },

  skillsGrid: { gap: Spacing.sm },
  skillCard: { padding: Spacing.base, gap: Spacing.sm },
  skillLocked: { opacity: 0.6 },
  skillTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  skillIconBox: { width: 52, height: 52, borderRadius: Radii.md, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  skillIconText: { fontSize: 26 },
  skillMeta: { alignItems: 'flex-end', gap: 4 },
  premiumMini: { backgroundColor: Colors.neonGold + '25', borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.neonGold + '60', paddingHorizontal: 7, paddingVertical: 3 },
  premiumMiniText: { color: Colors.neonGold, fontSize: 10, fontWeight: FontWeight.black },
  freeMini: { backgroundColor: Colors.neonGreen + '25', borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.neonGreen + '60', paddingHorizontal: 7, paddingVertical: 3 },
  freeMiniText: { color: Colors.neonGreen, fontSize: 10, fontWeight: FontWeight.black },
  lockedMini: { backgroundColor: Colors.bgPanel, borderRadius: Radii.sm, paddingHorizontal: 7, paddingVertical: 3 },
  lockedMiniText: { color: Colors.textMuted, fontSize: 10, fontWeight: FontWeight.semibold },
  skillLevel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  skillName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  skillDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  textLocked: { opacity: 0.6 },
  progressBarBg: { height: 6, backgroundColor: Colors.bgPanel, borderRadius: Radii.full, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: Radii.full },
  lessonCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  xpNeeded: { fontSize: FontSize.xs, color: Colors.neonOrange, fontWeight: FontWeight.semibold },
});

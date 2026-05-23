import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { VIDEOS } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';
import CyberCard from '@/components/ui/CyberCard';

const CATEGORIES = ['Tất Cả', 'Cơ Bản', 'Nâng Cao', 'Chuyên Gia'];

export default function VideoLearningScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();
  const [selectedCat, setSelectedCat] = useState('Tất Cả');

  const filtered = selectedCat === 'Tất Cả' ? VIDEOS : VIDEOS.filter(v => v.category === selectedCat);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>📹 Video Học Tập</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Featured Banner */}
        <CyberCard glowColor={Colors.neonPink} style={styles.featuredCard}>
          <Image source={{ uri: VIDEOS[0].thumbnail }} style={styles.featuredImage} contentFit="cover" />
          <View style={styles.featuredOverlay}>
            <View style={styles.freeTag}>
              <Text style={styles.freeTagText}>✅ MIỄN PHÍ</Text>
            </View>
            <Text style={styles.featuredTitle}>{VIDEOS[0].title}</Text>
            <View style={styles.featuredMeta}>
              <Text style={styles.metaText}>▶ {VIDEOS[0].duration}</Text>
              <Text style={styles.metaText}>👁 {VIDEOS[0].views} lượt xem</Text>
            </View>
            <Pressable style={styles.playBtn}>
              <MaterialIcons name="play-circle-filled" size={48} color={Colors.neonPink} />
            </Pressable>
          </View>
        </CyberCard>

        {/* Premium Banner */}
        {!gameState.isPremium && (
          <Pressable onPress={() => router.push('/premium')}>
            <CyberCard glowColor={Colors.neonGold} style={styles.premiumBanner}>
              <Text style={styles.premiumIcon}>⭐</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumBannerTitle}>Mở Khóa Tất Cả Video</Text>
                <Text style={styles.premiumBannerDesc}>Deepfake, OSINT, Bias Analysis + 20 video chuyên sâu</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={Colors.neonGold} />
            </CyberCard>
          </Pressable>
        )}

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat} onPress={() => setSelectedCat(cat)}>
              <View style={[styles.filterChip, selectedCat === cat ? styles.filterActive : styles.filterInactive]}>
                <Text style={[styles.filterText, selectedCat === cat ? styles.filterTextActive : styles.filterTextInactive]}>{cat}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Video List */}
        <View style={styles.videoList}>
          {filtered.map(video => (
            <Pressable key={video.id} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
              <CyberCard
                style={styles.videoCard}
                glowColor={video.isPremium ? Colors.neonGold : undefined}
              >
                <View style={styles.thumbnailWrap}>
                  <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} contentFit="cover" />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>▶ {video.duration}</Text>
                  </View>
                  {video.isPremium && !gameState.isPremium && (
                    <View style={styles.lockBadge}>
                      <Text style={styles.lockBadgeText}>🔒 PREMIUM</Text>
                    </View>
                  )}
                  {(!video.isPremium || gameState.isPremium) && (
                    <View style={styles.playOverlay}>
                      <MaterialIcons name="play-circle-outline" size={40} color="rgba(255,255,255,0.9)" />
                    </View>
                  )}
                </View>
                <View style={styles.videoInfo}>
                  <View style={styles.videoMeta}>
                    <View style={[
                      styles.catChip,
                      { backgroundColor: video.isPremium ? Colors.neonGold + '20' : Colors.neonGreen + '20', borderColor: video.isPremium ? Colors.neonGold + '50' : Colors.neonGreen + '50' }
                    ]}>
                      <Text style={[styles.catChipText, { color: video.isPremium ? Colors.neonGold : Colors.neonGreen }]}>
                        {video.isPremium ? '⭐' : '✅'} {video.category}
                      </Text>
                    </View>
                    <Text style={styles.viewsText}>👁 {video.views}</Text>
                  </View>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                </View>
              </CyberCard>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },

  scroll: { paddingHorizontal: Spacing.base },

  featuredCard: { height: 240, overflow: 'hidden', marginBottom: Spacing.md },
  featuredImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  featuredOverlay: { flex: 1, backgroundColor: 'rgba(5,5,16,0.65)', padding: Spacing.base, justifyContent: 'flex-end', gap: 6 },
  freeTag: { alignSelf: 'flex-start', backgroundColor: Colors.neonGreen + '30', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGreen + '60', paddingHorizontal: 10, paddingVertical: 3 },
  freeTagText: { color: Colors.neonGreen, fontSize: FontSize.xs, fontWeight: FontWeight.black },
  featuredTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  featuredMeta: { flexDirection: 'row', gap: Spacing.md },
  metaText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  playBtn: { position: 'absolute', top: Spacing.base, right: Spacing.base },

  premiumBanner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, marginBottom: Spacing.md, gap: Spacing.md },
  premiumIcon: { fontSize: 32 },
  premiumBannerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.neonGold, marginBottom: 2 },
  premiumBannerDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },

  filterScroll: { marginBottom: Spacing.md },
  filterRow: { flexDirection: 'row', gap: Spacing.sm },
  filterChip: { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8 },
  filterActive: { backgroundColor: Colors.neonCyan, borderColor: Colors.neonCyan },
  filterInactive: { backgroundColor: 'transparent', borderColor: Colors.border },
  filterText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  filterTextActive: { color: Colors.bg },
  filterTextInactive: { color: Colors.textSecondary },

  videoList: { gap: Spacing.sm },
  videoCard: { overflow: 'hidden' },
  thumbnailWrap: { position: 'relative' },
  thumbnail: { width: '100%', height: 180 },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: Radii.sm, paddingHorizontal: 8, paddingVertical: 3 },
  durationText: { color: '#fff', fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  lockBadge: { position: 'absolute', inset: 0, backgroundColor: 'rgba(5,5,16,0.7)', justifyContent: 'center', alignItems: 'center' },
  lockBadgeText: { color: Colors.neonGold, fontWeight: FontWeight.black, fontSize: FontSize.base },
  playOverlay: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -20 },
  videoInfo: { padding: Spacing.md, gap: 6 },
  videoMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catChip: { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3 },
  catChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  viewsText: { fontSize: FontSize.xs, color: Colors.textMuted },
  videoTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, lineHeight: 22 },
});

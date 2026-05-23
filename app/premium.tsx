import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { useGame } from '@/hooks/useGame';
import { useAlert } from '@/template';
import CyberCard from '@/components/ui/CyberCard';
import NeonButton from '@/components/ui/NeonButton';

const PLANS = [
  {
    id: 'monthly',
    name: 'Hàng Tháng',
    price: '49.000đ',
    period: '/tháng',
    badge: null,
    color: Colors.neonCyan,
  },
  {
    id: 'yearly',
    name: 'Hàng Năm',
    price: '399.000đ',
    period: '/năm',
    badge: 'TIẾT KIỆM 32%',
    color: Colors.neonGold,
  },
];

const FEATURES = [
  { icon: '🎭', title: 'Phân Tích Deepfake Nâng Cao', desc: 'Frame-by-frame analysis, pixel inconsistency detection' },
  { icon: '🧠', title: 'Thao Túng Tâm Lý & Media', desc: 'Hiểu cognitive bias, propaganda và emotional manipulation' },
  { icon: '⚖️', title: 'Phân Tích Bias Báo Chí', desc: 'Nhận diện thiên vị trong ngôn ngữ và chọn lọc thông tin' },
  { icon: '📊', title: 'Kiểm Tra Số Liệu Giả', desc: 'Xác minh thống kê, đồ thị gian lận và data fabrication' },
  { icon: '🕵️', title: 'OSINT Cơ Bản', desc: 'Reverse image search, geolocation verification, timeline' },
  { icon: '📹', title: '20+ Video Chuyên Sâu', desc: 'Framework SIFT, case studies thực tế, training nâng cao' },
  { icon: '🤖', title: 'AI Analysis Tool', desc: 'Phân tích AI-powered cho mọi nội dung nghi ngờ' },
  { icon: '📚', title: 'Case Study Thực Tế', desc: 'Hàng trăm vụ án tin tức giả nổi tiếng trên thế giới' },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState, upgradeToPremium } = useGame();
  const { showAlert } = useAlert();
  const [selectedPlan, setSelectedPlan] = React.useState('yearly');
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleUpgrade = () => {
    upgradeToPremium();
    showAlert('🎉 Chào Mừng Premium!', 'Bạn đã mở khóa toàn bộ nội dung Premium. Hãy bắt đầu khám phá!', [
      { text: 'Tuyệt vời!', onPress: () => router.back() }
    ]);
  };

  if (gameState.isPremium) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.alreadyPremium}>
          <Text style={styles.premiumEmoji}>⭐</Text>
          <Text style={styles.alreadyTitle}>Bạn Đã Là Premium!</Text>
          <Text style={styles.alreadyDesc}>Tận hưởng toàn bộ nội dung không giới hạn.</Text>
          <NeonButton label="← Quay Lại" onPress={() => router.back()} color={Colors.neonGold} size="lg" />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.title}>⭐ Premium</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Hero Section */}
        <CyberCard glowColor={Colors.neonGold} style={styles.heroCard} variant="panel">
          <Animated.View style={[styles.goldGlow, { opacity: shimmerAnim }]} />
          <Text style={styles.heroEmoji}>🕵️</Text>
          <Text style={styles.heroTitle}>Trở Thành Thám Tử{'\n'}Chuyên Nghiệp</Text>
          <Text style={styles.heroDesc}>Mở khóa kỹ năng nâng cao, video chuyên sâu và công cụ phân tích AI để trở thành chuyên gia nhận diện thông tin sai lệch.</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Không pay-to-win · Kiến thức thực sự</Text>
          </View>
        </CyberCard>

        {/* Plan Selection */}
        <Text style={styles.sectionTitle}>Chọn Gói</Text>
        <View style={styles.plansRow}>
          {PLANS.map(plan => (
            <Pressable key={plan.id} onPress={() => setSelectedPlan(plan.id)} style={{ flex: 1 }}>
              <CyberCard
                glowColor={selectedPlan === plan.id ? plan.color : undefined}
                style={[styles.planCard, selectedPlan === plan.id && { borderColor: plan.color }]}
              >
                {plan.badge && (
                  <View style={[styles.planBadge, { backgroundColor: plan.color + '25', borderColor: plan.color + '60' }]}>
                    <Text style={[styles.planBadgeText, { color: plan.color }]}>{plan.badge}</Text>
                  </View>
                )}
                {selectedPlan === plan.id && <View style={styles.selectedDot}><Text style={styles.selectedDotText}>✓</Text></View>}
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </CyberCard>
            </Pressable>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Quyền Lợi Premium</Text>
        <CyberCard style={styles.featuresCard}>
          {FEATURES.map((feat, i) => (
            <View key={i} style={[styles.featureItem, i > 0 && styles.featureDivider]}>
              <Text style={styles.featureIcon}>{feat.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feat.title}</Text>
                <Text style={styles.featureDesc}>{feat.desc}</Text>
              </View>
              <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>
            </View>
          ))}
        </CyberCard>

        {/* Free vs Premium comparison note */}
        <CyberCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>💡 Free vs Premium</Text>
          <Text style={styles.noteText}>✅ Free: Tất cả gameplay, kỹ năng cơ bản, daily challenge</Text>
          <Text style={styles.noteText}>⭐ Premium: Kỹ năng chuyên sâu, video phân tích, AI tools</Text>
          <Text style={[styles.noteText, { color: Colors.neonGreen }]}>Không pay-to-win — Free users vẫn chơi đầy đủ!</Text>
        </CyberCard>

        {/* CTA */}
        <NeonButton
          label={`⭐ Nâng Cấp ${selectedPlan === 'yearly' ? '399.000đ/năm' : '49.000đ/tháng'}`}
          onPress={handleUpgrade}
          color={Colors.neonGold}
          fullWidth
          size="lg"
        />
        <Text style={styles.disclaimer}>Dùng thử 7 ngày miễn phí · Hủy bất cứ lúc nào</Text>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.neonGold },

  scroll: { paddingHorizontal: Spacing.base },

  heroCard: { padding: Spacing.xl, marginBottom: Spacing.md, alignItems: 'center', gap: Spacing.md, overflow: 'hidden' },
  goldGlow: { position: 'absolute', top: -50, left: -50, right: -50, height: 200, backgroundColor: Colors.neonGold + '15', borderRadius: 200 },
  heroEmoji: { fontSize: 64 },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, color: Colors.textPrimary, textAlign: 'center', lineHeight: 36 },
  heroDesc: { fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  heroBadge: { backgroundColor: Colors.neonGold + '20', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGold + '50', paddingHorizontal: 16, paddingVertical: 8 },
  heroBadgeText: { color: Colors.neonGold, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },

  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },

  plansRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  planCard: { padding: Spacing.md, alignItems: 'center', gap: 4, position: 'relative', minHeight: 130 },
  planBadge: { borderRadius: Radii.sm, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'stretch', alignItems: 'center', marginBottom: 4 },
  planBadgeText: { fontSize: 10, fontWeight: FontWeight.black },
  selectedDot: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.neonGold, justifyContent: 'center', alignItems: 'center' },
  selectedDotText: { color: '#000', fontSize: 12, fontWeight: FontWeight.black },
  planName: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  planPrice: { fontSize: FontSize.xl, fontWeight: FontWeight.black },
  planPeriod: { fontSize: FontSize.xs, color: Colors.textMuted },

  featuresCard: { marginBottom: Spacing.md },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.base, gap: Spacing.md },
  featureDivider: { borderTopWidth: 1, borderTopColor: Colors.border },
  featureIcon: { fontSize: 24, width: 32 },
  featureText: { flex: 1, gap: 3 },
  featureTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  featureDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  checkmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.neonGold + '25', borderWidth: 1, borderColor: Colors.neonGold, justifyContent: 'center', alignItems: 'center' },
  checkmarkText: { color: Colors.neonGold, fontSize: 12, fontWeight: FontWeight.black },

  noteCard: { padding: Spacing.base, marginBottom: Spacing.lg, gap: Spacing.sm },
  noteTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  noteText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  disclaimer: { textAlign: 'center', color: Colors.textMuted, fontSize: FontSize.xs, marginTop: Spacing.sm },

  alreadyPremium: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl, gap: Spacing.lg },
  premiumEmoji: { fontSize: 80 },
  alreadyTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, color: Colors.neonGold, textAlign: 'center' },
  alreadyDesc: { fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center' },
});

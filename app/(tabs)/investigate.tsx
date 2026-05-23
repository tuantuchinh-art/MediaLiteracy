import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { INVESTIGATION_CASES } from '@/constants/gameData';
import CyberCard from '@/components/ui/CyberCard';

const { width } = Dimensions.get('window');

const TOOLS = [
  { icon: '🔬', label: 'Phân Tích Ảnh', desc: 'Pixel & artifact detection' },
  { icon: '📊', label: 'Metadata', desc: 'EXIF, GPS, timestamps' },
  { icon: '🌐', label: 'Nguồn Gốc', desc: 'Reverse image search' },
  { icon: '⏱', label: 'Timeline', desc: 'Xác minh thời điểm' },
  { icon: '🧠', label: 'AI Scan', desc: 'Deepfake probability' },
  { icon: '🔗', label: 'Cross-Check', desc: 'Multi-source verify' },
];

const DIFF_COLORS: Record<string, string> = {
  'Dễ': Colors.neonGreen,
  'Trung Bình': Colors.neonGold,
  'Khó': Colors.neonPink,
};

export default function InvestigateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🕵️ Điều Tra</Text>
          <View style={styles.scanBadge}>
            <Text style={styles.scanText}>🟢 ACTIVE</Text>
          </View>
        </View>

        {/* Cyber Dashboard Banner */}
        <CyberCard glowColor={Colors.neonPurple} style={styles.dashBanner} variant="panel">
          <View style={styles.dashHeader}>
            <Text style={styles.dashTitle}>DETECTIVE DASHBOARD</Text>
            <Text style={styles.dashSub}>Media Intelligence System v2.5</Text>
          </View>
          <View style={styles.dashGrid}>
            {['📡 Real-time Analysis', '🧬 AI Detection', '🌍 OSINT Tools', '⚡ Fast Verdict'].map((item, i) => (
              <View key={i} style={styles.dashItem}>
                <Text style={styles.dashItemText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.dashTerminal}>
            <Text style={styles.termText}>{'> '}<Text style={styles.termCursor}>Sẵn sàng điều tra...</Text></Text>
          </View>
        </CyberCard>

        {/* Investigation Tools */}
        <Text style={styles.sectionTitle}>Công Cụ Điều Tra</Text>
        <View style={styles.toolsGrid}>
          {TOOLS.map(tool => (
            <View key={tool.label} style={styles.toolCard}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <Text style={styles.toolLabel}>{tool.label}</Text>
              <Text style={styles.toolDesc}>{tool.desc}</Text>
            </View>
          ))}
        </View>

        {/* Cases */}
        <Text style={styles.sectionTitle}>Vụ Án Đang Mở</Text>
        {INVESTIGATION_CASES.map(caseItem => {
          const diffColor = DIFF_COLORS[caseItem.difficulty] || Colors.neonCyan;
          return (
            <Pressable
              key={caseItem.id}
              onPress={() => router.push('/investigation-game')}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, transform: pressed ? [{ scale: 0.98 }] : [] }]}
            >
              <CyberCard glowColor={diffColor} style={styles.caseCard}>
                <View style={styles.caseHeader}>
                  <View style={[styles.caseDiff, { backgroundColor: diffColor + '25', borderColor: diffColor + '60' }]}>
                    <Text style={[styles.caseDiffText, { color: diffColor }]}>{caseItem.difficulty}</Text>
                  </View>
                  <Text style={styles.caseXP}>+{caseItem.xpReward} XP</Text>
                </View>
                <Text style={styles.caseTitle}>{caseItem.title}</Text>
                <Text style={styles.caseDesc}>{caseItem.description}</Text>
                <View style={styles.caseFooter}>
                  <View style={styles.evidenceRow}>
                    {caseItem.evidence.map((ev, i) => (
                      <View key={i} style={styles.evidenceTag}>
                        <Text style={styles.evidenceTagText}>
                          {ev.type === 'image' ? '📷' : ev.type === 'metadata' ? '📊' : '📝'} {ev.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.caseTime}>⏱ {Math.floor(caseItem.timeLimit / 60)} phút</Text>
                </View>
              </CyberCard>
            </Pressable>
          );
        })}

        {/* Locked Premium Case */}
        <CyberCard glowColor={Colors.neonPink} style={[styles.caseCard, styles.lockedCase]}>
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockTitle}>Vụ Án Khó: Chiến Dịch Propaganda</Text>
            <Text style={styles.lockDesc}>Phân tích chiến dịch thao túng truyền thông xuyên quốc gia</Text>
            <View style={styles.premiumTag}>
              <Text style={styles.premiumTagText}>⭐ PREMIUM</Text>
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
  scroll: { paddingHorizontal: Spacing.base },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.base },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  scanBadge: {
    backgroundColor: Colors.neonGreen + '20', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGreen + '60',
    paddingHorizontal: 12, paddingVertical: 6,
  },
  scanText: { color: Colors.neonGreen, fontWeight: FontWeight.bold, fontSize: FontSize.xs },

  dashBanner: { padding: Spacing.base, marginBottom: Spacing.lg, gap: Spacing.md },
  dashHeader: { gap: 2 },
  dashTitle: { fontSize: FontSize.base, fontWeight: FontWeight.black, color: Colors.neonCyan, letterSpacing: 2 },
  dashSub: { fontSize: FontSize.xs, color: Colors.textMuted },
  dashGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dashItem: {
    backgroundColor: Colors.neonPurple + '20', borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.neonPurple + '40',
    paddingHorizontal: 10, paddingVertical: 6,
  },
  dashItemText: { fontSize: FontSize.xs, color: Colors.neonPurple, fontWeight: FontWeight.semibold },
  dashTerminal: { backgroundColor: '#000', borderRadius: Radii.sm, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.neonGreen + '40' },
  termText: { color: Colors.neonGreen, fontSize: FontSize.xs, fontFamily: 'monospace' },
  termCursor: { color: Colors.neonGreen },

  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  toolCard: {
    width: (width - 48 - 12) / 2, backgroundColor: Colors.bgCard, borderRadius: Radii.lg, borderWidth: 1,
    borderColor: Colors.border, padding: Spacing.md, gap: 4,
  },
  toolIcon: { fontSize: 24 },
  toolLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  toolDesc: { fontSize: FontSize.xs, color: Colors.textMuted },

  caseCard: { padding: Spacing.base, marginBottom: Spacing.sm, gap: Spacing.sm },
  caseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  caseDiff: { borderRadius: Radii.sm, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  caseDiffText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  caseXP: { color: Colors.neonGold, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  caseTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  caseDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  caseFooter: { gap: Spacing.sm },
  evidenceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  evidenceTag: { backgroundColor: Colors.bgPanel, borderRadius: Radii.sm, paddingHorizontal: 8, paddingVertical: 4 },
  evidenceTagText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  caseTime: { fontSize: FontSize.xs, color: Colors.textMuted },

  lockedCase: { opacity: 0.7 },
  lockOverlay: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  lockIcon: { fontSize: 36 },
  lockTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center' },
  lockDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' },
  premiumTag: {
    backgroundColor: Colors.neonGold + '30', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGold,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  premiumTagText: { color: Colors.neonGold, fontWeight: FontWeight.black, fontSize: FontSize.sm },
});

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { INVESTIGATION_CASES } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';

const VERDICT_OPTIONS = [
  { key: 'real', label: '✅ Thật', color: Colors.colorTrue },
  { key: 'fake', label: '❌ Giả Hoàn Toàn', color: Colors.colorFake },
  { key: 'misleading', label: '⚠️ Gây Hiểu Lầm', color: Colors.colorMisleading },
  { key: 'context', label: '✂️ Sai Ngữ Cảnh', color: Colors.colorContext },
  { key: 'ai_generated', label: '🤖 AI/Deepfake', color: Colors.colorAI },
];

export default function InvestigationGameScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addXP } = useGame();

  const caseData = INVESTIGATION_CASES[0];
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState<number[]>([]);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const TABS = caseData.evidence.map((e, i) => ({ label: e.label, type: e.type }));

  const toggleEvidence = (idx: number) => {
    setSelectedEvidence(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const submitVerdict = () => {
    if (!verdict) return;
    const isCorrect = verdict === caseData.verdict;
    if (isCorrect) addXP(caseData.xpReward);
    setShowResult(true);
  };

  const currentEvidence = caseData.evidence[activeTab];

  if (showResult) {
    const isCorrect = verdict === caseData.verdict;
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.resultScreen}>
          <Text style={styles.resultEmoji}>{isCorrect ? '🔍' : '😅'}</Text>
          <Text style={styles.resultTitle}>{isCorrect ? 'Vụ Án Khép Lại!' : 'Chưa Đúng!'}</Text>
          <Text style={[styles.resultXP, { color: isCorrect ? Colors.neonGreen : Colors.colorFake }]}>
            {isCorrect ? `+${caseData.xpReward} XP` : '+0 XP'}
          </Text>
          <View style={styles.verdictResultCard}>
            <Text style={styles.verdictResultLabel}>Kết Luận Đúng:</Text>
            <Text style={styles.verdictResultAnswer}>
              {VERDICT_OPTIONS.find(v => v.key === caseData.verdict)?.label}
            </Text>
          </View>
          <Text style={styles.explanationText}>{caseData.verdictExplanation}</Text>
          <Pressable onPress={() => router.back()} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>← Quay Lại</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>VỤ ÁN</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{caseData.title}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpBadgeText}>+{caseData.xpReward} XP</Text>
        </View>
      </View>

      {/* Terminal-style description */}
      <View style={styles.terminal}>
        <Text style={styles.terminalHeader}>{'> '}<Text style={styles.terminalAccent}>CASE BRIEF</Text></Text>
        <Text style={styles.terminalText}>{caseData.description}</Text>
      </View>

      {/* Evidence Tabs */}
      <View style={styles.evidenceTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map((tab, i) => (
            <Pressable key={i} onPress={() => setActiveTab(i)}>
              <View style={[styles.tab, activeTab === i ? styles.tabActive : styles.tabInactive]}>
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                  {tab.type === 'image' ? '📷' : tab.type === 'metadata' ? '📊' : '📝'} {tab.label}
                </Text>
                {selectedEvidence.includes(i) && <View style={styles.tabChecked}><Text style={styles.tabCheckedText}>✓</Text></View>}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Evidence Viewer */}
        <View style={styles.evidenceCard}>
          <View style={styles.evidenceHeader}>
            <Text style={styles.evidenceTitle}>{currentEvidence.label}</Text>
            <Pressable onPress={() => toggleEvidence(activeTab)}>
              <View style={[styles.markBtn, selectedEvidence.includes(activeTab) && styles.markBtnActive]}>
                <Text style={styles.markBtnText}>
                  {selectedEvidence.includes(activeTab) ? '✓ Đã Đánh Dấu' : '+ Đánh Dấu'}
                </Text>
              </View>
            </Pressable>
          </View>

          {currentEvidence.type === 'image' && (
            <View>
              <Image
                source={{ uri: (currentEvidence as any).url }}
                style={styles.evidenceImage}
                contentFit="cover"
              />
              <View style={styles.scanOverlay}>
                <View style={styles.scanLine} />
                <Text style={styles.scanText}>{'> '}<Text style={styles.scanAccent}>Phân tích pixel...</Text></Text>
              </View>
              <View style={styles.imageTools}>
                {['🔍 Phóng To', '🎨 Enhance', '⚡ AI Scan'].map(tool => (
                  <Pressable key={tool}>
                    <View style={styles.imageTool}>
                      <Text style={styles.imageToolText}>{tool}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {currentEvidence.type === 'metadata' && (
            <View style={styles.metadataCard}>
              <Text style={styles.metadataHeader}>{'> METADATA DUMP'}</Text>
              {Object.entries((currentEvidence as any).data).map(([key, val]) => (
                <View key={key} style={styles.metaRow}>
                  <Text style={styles.metaKey}>{key}:</Text>
                  <Text style={[
                    styles.metaVal,
                    key === 'Vị trí GPS' && { color: Colors.neonPink, fontWeight: FontWeight.bold },
                    key === 'Xác suất Deepfake' && { color: Colors.colorFake, fontWeight: FontWeight.bold },
                  ]}>{val as string}</Text>
                </View>
              ))}
            </View>
          )}

          {currentEvidence.type === 'text' && (
            <View style={styles.textEvidenceCard}>
              <Text style={styles.textEvidenceContent}>{(currentEvidence as any).content}</Text>
              <View style={styles.textAnalysis}>
                <Text style={styles.textAnalysisHeader}>🧠 Phân Tích Ngôn Ngữ:</Text>
                <Text style={styles.textAnalysisItem}>• Ngôn ngữ cảm xúc cao: ✓</Text>
                <Text style={styles.textAnalysisItem}>• Nguồn tin cụ thể: ✗</Text>
                <Text style={styles.textAnalysisItem}>• Kêu gọi hành động gấp: ✓</Text>
              </View>
            </View>
          )}
        </View>

        {/* Evidence Summary */}
        <View style={styles.evidenceSummary}>
          <Text style={styles.summaryTitle}>📋 Bằng Chứng Đã Thu Thập: {selectedEvidence.length}/{TABS.length}</Text>
          {selectedEvidence.map(idx => (
            <View key={idx} style={styles.summaryItem}>
              <Text style={styles.summaryItemText}>✓ {TABS[idx].label}</Text>
            </View>
          ))}
        </View>

        {/* Verdict */}
        <Text style={styles.verdictTitle}>⚖️ Phán Quyết Của Bạn</Text>
        <View style={styles.verdictGrid}>
          {VERDICT_OPTIONS.map(opt => (
            <Pressable key={opt.key} onPress={() => setVerdict(opt.key)}>
              <View style={[
                styles.verdictBtn,
                { borderColor: opt.color + '60' },
                verdict === opt.key && { backgroundColor: opt.color + '25', borderColor: opt.color },
              ]}>
                <Text style={[styles.verdictBtnText, { color: verdict === opt.key ? opt.color : Colors.textSecondary }]}>
                  {opt.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={submitVerdict}
          style={[styles.submitBtn, !verdict && styles.submitBtnDisabled]}
          disabled={!verdict}
        >
          <Text style={styles.submitBtnText}>
            {verdict ? '🔍 Nộp Phán Quyết' : 'Chọn Phán Quyết Trước'}
          </Text>
        </Pressable>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: FontSize.xs, color: Colors.neonPurple, fontWeight: FontWeight.black, letterSpacing: 2 },
  headerSub: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: FontWeight.bold },
  xpBadge: { backgroundColor: Colors.neonGold + '25', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGold + '60', paddingHorizontal: 10, paddingVertical: 4 },
  xpBadgeText: { color: Colors.neonGold, fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  terminal: { marginHorizontal: Spacing.base, backgroundColor: '#000', borderRadius: Radii.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.neonGreen + '30', marginBottom: Spacing.sm },
  terminalHeader: { color: Colors.neonGreen, fontSize: FontSize.xs, fontFamily: 'monospace', marginBottom: 4 },
  terminalAccent: { color: Colors.neonCyan, fontWeight: FontWeight.bold },
  terminalText: { color: Colors.neonGreen + 'CC', fontSize: FontSize.xs, fontFamily: 'monospace', lineHeight: 18 },

  evidenceTabs: { marginBottom: Spacing.sm },
  tabsRow: { paddingHorizontal: Spacing.base, gap: Spacing.sm },
  tab: { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tabActive: { backgroundColor: Colors.neonCyan + '25', borderColor: Colors.neonCyan },
  tabInactive: { backgroundColor: 'transparent', borderColor: Colors.border },
  tabText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  tabTextActive: { color: Colors.neonCyan },
  tabChecked: { backgroundColor: Colors.neonGreen, borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  tabCheckedText: { color: '#000', fontSize: 10, fontWeight: FontWeight.black },

  scroll: { paddingHorizontal: Spacing.base },
  evidenceCard: { backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.md },
  evidenceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base },
  evidenceTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, flex: 1 },
  markBtn: { backgroundColor: Colors.bgPanel, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  markBtnActive: { backgroundColor: Colors.neonGreen + '25', borderColor: Colors.neonGreen },
  markBtnText: { fontSize: FontSize.xs, color: Colors.neonGreen, fontWeight: FontWeight.semibold },

  evidenceImage: { width: '100%', height: 220 },
  scanOverlay: { padding: Spacing.sm, backgroundColor: '#000' },
  scanLine: { height: 1, backgroundColor: Colors.neonGreen + '60', marginBottom: 4 },
  scanText: { color: Colors.neonGreen, fontSize: FontSize.xs, fontFamily: 'monospace' },
  scanAccent: { color: Colors.neonGreen },
  imageTools: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.sm, backgroundColor: Colors.bgPanel },
  imageTool: { backgroundColor: Colors.bgCard, borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  imageToolText: { fontSize: FontSize.xs, color: Colors.neonCyan, fontWeight: FontWeight.semibold },

  metadataCard: { backgroundColor: '#000', padding: Spacing.md, gap: Spacing.sm },
  metadataHeader: { color: Colors.neonGreen, fontSize: FontSize.sm, fontFamily: 'monospace', fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.neonGreen + '20' },
  metaKey: { color: Colors.textMuted, fontSize: FontSize.sm, fontFamily: 'monospace' },
  metaVal: { color: Colors.neonGreen, fontSize: FontSize.sm, fontFamily: 'monospace', flex: 1, textAlign: 'right' },

  textEvidenceCard: { padding: Spacing.base, gap: Spacing.md },
  textEvidenceContent: { fontSize: FontSize.base, color: Colors.textPrimary, lineHeight: 24, backgroundColor: Colors.bgPanel, borderRadius: Radii.md, padding: Spacing.md, fontStyle: 'italic' },
  textAnalysis: { gap: 6 },
  textAnalysisHeader: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.neonCyan },
  textAnalysisItem: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  evidenceSummary: { backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.base, marginBottom: Spacing.md, gap: Spacing.sm },
  summaryTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  summaryItem: { paddingVertical: 4 },
  summaryItemText: { fontSize: FontSize.sm, color: Colors.neonGreen },

  verdictTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  verdictGrid: { gap: Spacing.sm, marginBottom: Spacing.md },
  verdictBtn: { borderWidth: 1.5, borderRadius: Radii.full, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', backgroundColor: Colors.bgCard },
  verdictBtnText: { fontWeight: FontWeight.bold, fontSize: FontSize.base },

  submitBtn: { backgroundColor: Colors.neonPurple, borderRadius: Radii.full, paddingVertical: 16, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: Colors.bgPanel },
  submitBtnText: { color: Colors.textPrimary, fontWeight: FontWeight.black, fontSize: FontSize.base },

  resultScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl, gap: Spacing.md },
  resultEmoji: { fontSize: 80 },
  resultTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  resultXP: { fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  verdictResultCard: { backgroundColor: Colors.bgCard, borderRadius: Radii.lg, padding: Spacing.base, alignItems: 'center', width: '100%' },
  verdictResultLabel: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: 4 },
  verdictResultAnswer: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  explanationText: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 24, textAlign: 'center' },
  doneBtn: { backgroundColor: Colors.neonCyan, borderRadius: Radii.full, paddingVertical: 14, paddingHorizontal: 40, marginTop: Spacing.sm },
  doneBtnText: { color: Colors.bg, fontWeight: FontWeight.black, fontSize: FontSize.base },
});

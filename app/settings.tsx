import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, Animated, KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { useGame } from '@/hooks/useGame';
import { useAlert } from '@/template';

const SOUND_KEY      = '@media_literacy_sound';
const ANIMATION_KEY  = '@media_literacy_animation';
const USERNAME_KEY   = '@media_literacy_username';
const ONBOARDING_KEY = '@media_literacy_onboarding_done';

// ─── Neon Toggle Switch ────────────────────────────────────────────────────────
function NeonToggle({
  value, onToggle, color = Colors.neonCyan,
}: { value: boolean; onToggle: () => void; color?: string }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      friction: 6,
      tension: 120,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const thumbX   = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 25] });
  const trackBg  = anim.interpolate({ inputRange: [0, 1], outputRange: [Colors.bgPanel, color + '40'] });
  const thumbBg  = anim.interpolate({ inputRange: [0, 1], outputRange: [Colors.textMuted, color] });
  const glowOp   = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] });

  return (
    <Pressable onPress={onToggle} hitSlop={12} accessibilityRole="switch" accessibilityState={{ checked: value }}>
      <Animated.View style={[styles.track, { backgroundColor: trackBg, borderColor: value ? color + '80' : Colors.border }]}>
        {/* Glow behind thumb */}
        <Animated.View style={[styles.thumbGlow, { backgroundColor: color, opacity: glowOp, left: thumbX }]} />
        {/* Thumb */}
        <Animated.View style={[styles.thumb, { backgroundColor: thumbBg, transform: [{ translateX: thumbX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLine} />
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

// ─── Settings Row ──────────────────────────────────────────────────────────────
function SettingRow({
  icon, label, sublabel, children, onPress, danger = false, last = false,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowDivider,
        pressed && onPress ? { backgroundColor: Colors.bgPanel } : null,
      ]}
    >
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, danger && { color: Colors.colorFake }]}>{label}</Text>
        {sublabel ? <Text style={styles.rowSub}>{sublabel}</Text> : null}
      </View>
      {children ? (
        <View style={styles.rowControl}>{children}</View>
      ) : onPress ? (
        <MaterialIcons name="chevron-right" size={20} color={danger ? Colors.colorFake : Colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

// ─── Main Settings Screen ──────────────────────────────────────────────────────
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState, resetProgress } = useGame();
  const { showAlert } = useAlert();

  const [sound, setSound]         = useState(true);
  const [animation, setAnimation] = useState(true);
  const [username, setUsername]   = useState(gameState.username || 'Bạn');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(username);
  const [nameFocused, setNameFocused] = useState(false);
  const [nameError, setNameError] = useState('');

  // Load persisted prefs on mount
  useEffect(() => {
    AsyncStorage.multiGet([SOUND_KEY, ANIMATION_KEY, USERNAME_KEY]).then(pairs => {
      const soundVal = pairs[0][1];
      const animVal  = pairs[1][1];
      const nameVal  = pairs[2][1];
      if (soundVal !== null) setSound(soundVal === '1');
      if (animVal  !== null) setAnimation(animVal === '1');
      if (nameVal)           { setUsername(nameVal); setNameInput(nameVal); }
    });
  }, []);

  const toggleSound = async () => {
    const next = !sound;
    setSound(next);
    await AsyncStorage.setItem(SOUND_KEY, next ? '1' : '0');
  };

  const toggleAnimation = async () => {
    const next = !animation;
    setAnimation(next);
    await AsyncStorage.setItem(ANIMATION_KEY, next ? '1' : '0');
  };

  const saveName = async () => {
    const trimmed = nameInput.trim();
    if (trimmed.length < 3) { setNameError('Tên phải có ít nhất 3 ký tự'); return; }
    if (trimmed.length > 20) { setNameError('Tên tối đa 20 ký tự'); return; }
    await AsyncStorage.setItem(USERNAME_KEY, trimmed);
    setUsername(trimmed);
    setEditingName(false);
    setNameError('');
  };

  const handleResetProgress = () => {
    showAlert(
      '⚠️ Reset Tiến Trình',
      'Toàn bộ XP, level, huy hiệu và thống kê sẽ bị xóa. Hành động này không thể hoàn tác!',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Reset Ngay',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            showAlert('Đã Reset', 'Tiến trình của bạn đã được đặt lại về ban đầu.');
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    showAlert(
      'Xem Lại Onboarding?',
      'Màn hình hướng dẫn sẽ hiển thị lại lần tiếp theo bạn mở app.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng Ý',
          onPress: async () => {
            await AsyncStorage.removeItem(ONBOARDING_KEY);
            showAlert('Đã Reset', 'Onboarding sẽ xuất hiện khi bạn khởi động lại app.');
          },
        },
      ]
    );
  };

  const nameInputScale = useRef(new Animated.Value(1)).current;
  const triggerNameShake = () => {
    Animated.sequence([
      Animated.timing(nameInputScale, { toValue: 1.02, duration: 80, useNativeDriver: true }),
      Animated.spring(nameInputScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Text style={styles.title}>⚙️ Cài Đặt</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing.xxxl }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── BIỆT DANH ── */}
          <SectionHeader label="DANH TÍNH" />
          <View style={styles.card}>
            <View style={styles.nameSection}>
              <View style={styles.nameTop}>
                <View style={styles.nameIconWrap}>
                  <Text style={styles.nameIconEmoji}>🕵️</Text>
                </View>
                <View style={styles.nameInfo}>
                  <Text style={styles.nameLabel}>Biệt Danh Hiện Tại</Text>
                  <Text style={styles.nameValue}>@{username}</Text>
                </View>
                <Pressable
                  onPress={() => { setEditingName(v => !v); setNameInput(username); setNameError(''); }}
                  style={[styles.editNameBtn, editingName && { borderColor: Colors.neonCyan + '80' }]}
                >
                  <MaterialIcons name={editingName ? 'close' : 'edit'} size={16} color={Colors.neonCyan} />
                  <Text style={styles.editNameBtnText}>{editingName ? 'Hủy' : 'Đổi'}</Text>
                </Pressable>
              </View>

              {editingName && (
                <View style={styles.nameEditArea}>
                  <Animated.View style={[
                    styles.nameInputWrap,
                    nameFocused && styles.nameInputFocused,
                    { transform: [{ scale: nameInputScale }] },
                  ]}>
                    <Text style={styles.nameInputAt}>@</Text>
                    <TextInput
                      style={styles.nameInput}
                      value={nameInput}
                      onChangeText={t => { setNameInput(t); setNameError(''); }}
                      placeholder="biệt_danh_mới"
                      placeholderTextColor={Colors.textMuted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={20}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      accessibilityLabel="Nhập biệt danh mới"
                    />
                    <Text style={styles.nameInputCount}>{nameInput.length}/20</Text>
                  </Animated.View>
                  {nameError ? <Text style={styles.nameError}>⚠️ {nameError}</Text> : null}
                  <Pressable
                    onPress={() => {
                      if (nameInput.trim().length < 3) { setNameError('Tên phải có ít nhất 3 ký tự'); triggerNameShake(); return; }
                      saveName();
                    }}
                    style={({ pressed }) => [styles.saveNameBtn, pressed && { opacity: 0.85 }]}
                  >
                    <Text style={styles.saveNameBtnText}>✅ Lưu Biệt Danh</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

          {/* ── TRẢI NGHIỆM ── */}
          <SectionHeader label="TRẢI NGHIỆM" />
          <View style={styles.card}>
            <SettingRow
              icon={<Ionicons name="volume-high" size={20} color={Colors.neonCyan} />}
              label="Âm Thanh"
              sublabel={sound ? 'Đang bật — hiệu ứng game' : 'Đang tắt'}
            >
              <NeonToggle value={sound} onToggle={toggleSound} color={Colors.neonCyan} />
            </SettingRow>
            <SettingRow
              icon={<MaterialIcons name="animation" size={20} color={Colors.neonPurple} />}
              label="Hiệu Ứng Chuyển Động"
              sublabel={animation ? 'Đang bật — mượt mà hơn' : 'Đang tắt — tiết kiệm pin'}
              last
            >
              <NeonToggle value={animation} onToggle={toggleAnimation} color={Colors.neonPurple} />
            </SettingRow>
          </View>

          {/* ── TÀI KHOẢN ── */}
          <SectionHeader label="TÀI KHOẢN" />
          <View style={styles.card}>
            <SettingRow
              icon={<MaterialIcons name="replay" size={20} color={Colors.neonGold} />}
              label="Xem Lại Onboarding"
              sublabel="Hiển thị lại hướng dẫn lần tiếp"
              onPress={handleResetOnboarding}
            />
            <SettingRow
              icon={<MaterialIcons name="delete-sweep" size={20} color={Colors.colorFake} />}
              label="Reset Tiến Trình"
              sublabel="Xóa toàn bộ XP, level và thành tích"
              onPress={handleResetProgress}
              danger
              last
            />
          </View>

          {/* ── THÔNG TIN ── */}
          <SectionHeader label="THÔNG TIN" />
          <View style={styles.card}>
            <SettingRow
              icon={<MaterialIcons name="privacy-tip" size={20} color={Colors.neonGreen} />}
              label="Chính Sách Bảo Mật"
              sublabel="Xem cách chúng tôi bảo vệ dữ liệu"
              onPress={() => Linking.openURL('https://example.com/privacy')}
            />
            <SettingRow
              icon={<MaterialIcons name="description" size={20} color={Colors.neonGreen} />}
              label="Điều Khoản Sử Dụng"
              sublabel="Quy định sử dụng dịch vụ"
              onPress={() => Linking.openURL('https://example.com/terms')}
            />
            <SettingRow
              icon={<MaterialIcons name="help-outline" size={20} color={Colors.neonCyan} />}
              label="Trợ Giúp & FAQ"
              sublabel="Câu hỏi thường gặp"
              onPress={() => Linking.openURL('https://example.com/help')}
            />
            <SettingRow
              icon={<MaterialIcons name="star-rate" size={20} color={Colors.neonGold} />}
              label="Đánh Giá App"
              sublabel="Ủng hộ chúng tôi trên Store"
              onPress={() => Linking.openURL('https://example.com/rate')}
              last
            />
          </View>

          {/* App version card */}
          <View style={styles.versionCard}>
            <View style={styles.versionDot} />
            <Text style={styles.versionText}>Media Literacy</Text>
            <Text style={styles.versionSub}>v1.0.0 · Made with ❤️ for Gen Z</Text>
            <View style={styles.versionDot} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },

  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, gap: Spacing.xs },

  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.md },
  sectionLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.black, color: Colors.textMuted, letterSpacing: 2 },

  // Card container
  card: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1,
    borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.xs,
  },

  // Row
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: 14, minHeight: 56,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowIcon: {
    width: 36, height: 36, borderRadius: Radii.md,
    backgroundColor: Colors.bgPanel, justifyContent: 'center', alignItems: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  rowLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  rowSub: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },
  rowControl: { marginLeft: Spacing.sm },

  // Neon Toggle
  track: {
    width: 50, height: 28, borderRadius: 14, borderWidth: 1.5,
    justifyContent: 'center', position: 'relative',
  },
  thumbGlow: {
    position: 'absolute', width: 24, height: 24, borderRadius: 12,
    top: 2,
  },
  thumb: {
    position: 'absolute', width: 22, height: 22, borderRadius: 11,
    top: 3,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },

  // Name section
  nameSection: { padding: Spacing.base, gap: Spacing.md },
  nameTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  nameIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.neonCyan + '18',
    borderWidth: 1.5, borderColor: Colors.neonCyan + '50',
    justifyContent: 'center', alignItems: 'center',
  },
  nameIconEmoji: { fontSize: 22 },
  nameInfo: { flex: 1, gap: 2 },
  nameLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: FontWeight.semibold },
  nameValue: { fontSize: FontSize.md, fontWeight: FontWeight.black, color: Colors.neonCyan },
  editNameBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.neonCyan + '15', borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.neonCyan + '40',
    paddingHorizontal: 12, paddingVertical: 7,
  },
  editNameBtnText: { fontSize: FontSize.xs, color: Colors.neonCyan, fontWeight: FontWeight.bold },

  nameEditArea: { gap: Spacing.sm },
  nameInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgPanel, borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, height: 52, gap: Spacing.sm,
  },
  nameInputFocused: {
    borderColor: Colors.neonCyan,
    shadowColor: Colors.neonCyan, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  nameInputAt: { fontSize: FontSize.lg, color: Colors.neonCyan, fontWeight: FontWeight.bold },
  nameInput: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary, fontWeight: FontWeight.semibold },
  nameInputCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  nameError: { fontSize: FontSize.xs, color: Colors.colorFake },
  saveNameBtn: {
    backgroundColor: Colors.neonCyan, borderRadius: Radii.full,
    paddingVertical: 13, alignItems: 'center',
    shadowColor: Colors.neonCyan, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 10, elevation: 6,
  },
  saveNameBtnText: { color: Colors.bg, fontWeight: FontWeight.black, fontSize: FontSize.base },

  // Version
  versionCard: {
    alignItems: 'center', gap: 6, paddingVertical: Spacing.xl,
    flexDirection: 'column',
  },
  versionDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.neonCyan + '60',
  },
  versionText: { fontSize: FontSize.base, fontWeight: FontWeight.black, color: Colors.textPrimary },
  versionSub: { fontSize: FontSize.xs, color: Colors.textMuted },
});

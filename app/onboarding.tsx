import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { useGame } from '@/hooks/useGame';

const { width, height } = Dimensions.get('window');

export const ONBOARDING_KEY = '@media_literacy_onboarding_done';

// ─── Slide Data ────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    image: require('@/assets/images/onboard-1.png'),
    tag: '⚔️ BATTLE QUIZ',
    tagColor: Colors.neonCyan,
    title: 'Phân Loại Tin\nSiêu Tốc Độ',
    desc: 'Lướt qua các bài đăng mạng xã hội và phán đoán: Thật, Giả, Gây hiểu lầm, hay AI tạo ra? Combo streak, XP, và bảng xếp hạng chờ bạn!',
    features: ['⚡ Timer 30 giây', '🔥 Combo x10', '🏆 Rank toàn cầu'],
    accent: Colors.neonCyan,
  },
  {
    id: 1,
    image: require('@/assets/images/onboard-2.png'),
    tag: '🕵️ INVESTIGATION',
    tagColor: Colors.neonPurple,
    title: 'Điều Tra Như\nThám Tử Thật',
    desc: 'Phân tích hình ảnh, soi metadata, kiểm tra timeline và tìm dấu hiệu deepfake. Giao diện hacker dashboard chờ bạn khám phá!',
    features: ['📷 Phân tích ảnh AI', '📊 Soi metadata', '🎭 Nhận diện deepfake'],
    accent: Colors.neonPurple,
  },
  {
    id: 2,
    image: require('@/assets/images/onboard-3.png'),
    tag: '🥊 PvP 1V1',
    tagColor: Colors.neonGold,
    title: 'Đấu Tay Đôi\nReal-Time',
    desc: 'Thách đấu người chơi khác trong trận 1v1 60 giây! Ai phân loại đúng nhiều hơn sẽ thắng. XP thưởng nhân đôi cho người chiến thắng!',
    features: ['⏱ 60 giây', '🏅 XP ×2 khi thắng', '👑 Rank PvP riêng'],
    accent: Colors.neonGold,
  },
];

// ─── Dot Indicator ─────────────────────────────────────────────────────────────
function DotIndicator({ total, current, accent }: { total: number; current: number; accent: string }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current
              ? [styles.dotActive, { backgroundColor: accent, shadowColor: accent }]
              : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ─── Slide Component ───────────────────────────────────────────────────────────
function OnboardSlide({ slide, anim }: { slide: typeof SLIDES[0]; anim: Animated.Value }) {
  const translateX = anim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-width, 0, width] });
  const opacity    = anim.interpolate({ inputRange: [-1, -0.3, 0, 0.3, 1], outputRange: [0, 0, 1, 0, 0] });
  const scale      = anim.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.88, 1, 0.88] });

  return (
    <Animated.View style={[styles.slideWrap, { opacity, transform: [{ translateX }, { scale }] }]}>
      {/* Hero Image */}
      <View style={styles.heroImageWrap}>
        <Image
          source={slide.image}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
        />
        {/* Cinematic overlay gradient */}
        <View style={styles.heroOverlayTop} />
        <View style={styles.heroOverlayBottom} />

        {/* Floating tag */}
        <View style={[styles.heroTag, { backgroundColor: slide.accent + '25', borderColor: slide.accent + '70' }]}>
          <Text style={[styles.heroTagText, { color: slide.accent }]}>{slide.tag}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.slideContent}>
        <Text style={[styles.slideTitle, { color: Colors.textPrimary }]}>{slide.title}</Text>
        <Text style={styles.slideDesc}>{slide.desc}</Text>

        {/* Feature pills */}
        <View style={styles.featuresRow}>
          {slide.features.map((f, i) => (
            <View key={i} style={[styles.featurePill, { borderColor: slide.accent + '50', backgroundColor: slide.accent + '12' }]}>
              <Text style={[styles.featurePillText, { color: slide.accent }]}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Username Step ─────────────────────────────────────────────────────────────
function UsernameStep({
  slideAnim, onComplete,
}: {
  slideAnim: Animated.Value;
  onComplete: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const translateX = slideAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-width, 0, width] });
  const opacity    = slideAnim.interpolate({ inputRange: [-1, -0.3, 0, 0.3, 1], outputRange: [0, 0, 1, 0, 0] });
  const scale      = slideAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.88, 1, 0.88] });

  const triggerPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.spring(pulseAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setError('Tên phải có ít nhất 3 ký tự');
      triggerPulse();
      return;
    }
    if (trimmed.length > 20) {
      setError('Tên tối đa 20 ký tự');
      triggerPulse();
      return;
    }
    setError('');
    onComplete(trimmed);
  };

  const SUGGESTIONS = ['TruthHunter', 'NamDetective', 'FactChecker', 'MediaGuard'];

  return (
    <Animated.View style={[styles.slideWrap, { opacity, transform: [{ translateX }, { scale }] }]}>
      <KeyboardAvoidingView
        style={styles.usernameWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.usernameScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Icon area */}
          <View style={styles.usernamIconArea}>
            <View style={styles.usernameIconCircle}>
              <Text style={styles.usernameIconEmoji}>🕵️</Text>
            </View>
            <View style={styles.usernameScanLine} />
          </View>

          <Text style={styles.usernameTitle}>Đặt Biệt Danh{'\n'}Thám Tử</Text>
          <Text style={styles.usernameDesc}>
            Đây là tên xuất hiện trên bảng xếp hạng và trong trận PvP. Hãy chọn một cái gì đó thật ngầu!
          </Text>

          {/* Input */}
          <Animated.View style={[
            styles.inputWrap,
            focused && styles.inputWrapFocused,
            { transform: [{ scale: pulseAnim }] },
          ]}>
            <Text style={styles.inputPrefix}>@</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(t) => { setName(t); setError(''); }}
              placeholder="biệt_danh_của_bạn"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              accessibilityLabel="Nhập biệt danh"
            />
            <Text style={styles.inputCount}>{name.length}/20</Text>
          </Animated.View>

          {error ? (
            <Text style={styles.errorText}>⚠️ {error}</Text>
          ) : null}

          {/* Suggestions */}
          <Text style={styles.suggestLabel}>Gợi ý nhanh:</Text>
          <View style={styles.suggestRow}>
            {SUGGESTIONS.map(s => (
              <Pressable key={s} onPress={() => { setName(s); setError(''); }}>
                <View style={styles.suggestChip}>
                  <Text style={styles.suggestChipText}>{s}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Start button */}
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.startBtn,
              { backgroundColor: name.trim().length >= 3 ? Colors.neonCyan : Colors.bgPanel },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={[
              styles.startBtnText,
              { color: name.trim().length >= 3 ? Colors.bg : Colors.textMuted }
            ]}>
              🚀 Bắt Đầu Hành Trình!
            </Text>
          </Pressable>

          <Text style={styles.termsNote}>
            Bằng cách tiếp tục, bạn đồng ý với các điều khoản sử dụng của Media Literacy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

// ─── Root Onboarding Screen ────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { gameState } = useGame();

  const TOTAL_STEPS = SLIDES.length + 1; // 3 slides + username
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // One Animated.Value per "page position" (relative to current step)
  const anims = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 0 : 1))).current;
  const usernameAnim = useRef(new Animated.Value(1)).current;

  const getSlideAnim = (idx: number) => {
    if (idx < SLIDES.length) return anims[idx];
    return usernameAnim;
  };

  const goTo = useCallback((next: number) => {
    if (isTransitioning) return;
    const prev = step;
    setIsTransitioning(true);

    // Current slides out to the left
    const outAnim = getSlideAnim(prev);
    // Next slides in from the right
    const inAnim = getSlideAnim(next);
    inAnim.setValue(1); // start from right

    Animated.parallel([
      Animated.timing(outAnim, { toValue: -1, duration: 380, useNativeDriver: true }),
      Animated.spring(inAnim, { toValue: 0, friction: 9, tension: 60, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      setIsTransitioning(false);
    });
  }, [step, isTransitioning]);

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) goTo(step + 1);
  };

  const handleSkip = async () => {
    // Jump straight to username step
    if (step < SLIDES.length) goTo(SLIDES.length);
  };

  const handleComplete = async (username: string) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, '1');
      await AsyncStorage.setItem('@media_literacy_username', username);
    } catch (_) {}
    router.replace('/(tabs)');
  };

  const currentAccent = step < SLIDES.length ? SLIDES[step].accent : Colors.neonCyan;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Slides layer — all rendered, animated in/out */}
      <View style={styles.slidesContainer}>
        {SLIDES.map((slide, i) => (
          <OnboardSlide key={slide.id} slide={slide} anim={anims[i]} />
        ))}
        <UsernameStep slideAnim={usernameAnim} onComplete={handleComplete} />
      </View>

      {/* Fixed bottom controls */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + Spacing.md }]}>
        {/* Dots */}
        <DotIndicator total={TOTAL_STEPS} current={step} accent={currentAccent} />

        {/* Buttons */}
        {step < SLIDES.length && (
          <View style={styles.btnRow}>
            <Pressable onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Bỏ qua</Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.nextBtn,
                { backgroundColor: currentAccent, shadowColor: currentAccent },
                pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text style={styles.nextBtnText}>
                {step === SLIDES.length - 1 ? 'Sẵn sàng! 🚀' : 'Tiếp theo →'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const HERO_HEIGHT = height * 0.46;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  slidesContainer: { flex: 1, position: 'relative' },

  // Slide wrapper — absolute, fills the container
  slideWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },

  // Hero image section
  heroImageWrap: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 80,
    backgroundColor: Colors.bg,
    opacity: 0.55,
  },
  heroOverlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
    // Gradient-like fade using multiple layers isn't possible directly,
    // so we use a solid that fades the image into the content
    backgroundColor: Colors.bg,
    opacity: 0.82,
  },
  heroTag: {
    position: 'absolute', top: 20, left: Spacing.xl,
    borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  heroTagText: { fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1.5 },

  // Slide text content
  slideContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  slideTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  slideDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  featurePill: {
    borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  featurePillText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  // Username step
  usernameWrap: { flex: 1 },
  usernameScroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },

  usernamIconArea: { alignItems: 'center', marginBottom: Spacing.sm },
  usernameIconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.neonCyan + '18',
    borderWidth: 2, borderColor: Colors.neonCyan + '60',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  usernameIconEmoji: { fontSize: 46 },
  usernameScanLine: {
    width: 64, height: 2,
    backgroundColor: Colors.neonCyan,
    borderRadius: Radii.full,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },

  usernameTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.black,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  usernameDesc: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 56,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  inputWrapFocused: {
    borderColor: Colors.neonCyan,
    shadowColor: Colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  inputPrefix: { fontSize: FontSize.lg, color: Colors.neonCyan, fontWeight: FontWeight.bold },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
  inputCount: { fontSize: FontSize.xs, color: Colors.textMuted },

  errorText: { fontSize: FontSize.sm, color: Colors.colorFake, textAlign: 'center', marginTop: -Spacing.xs },

  suggestLabel: { fontSize: FontSize.sm, color: Colors.textMuted, alignSelf: 'flex-start' },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  suggestChip: {
    backgroundColor: Colors.bgPanel, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  suggestChipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.semibold },

  startBtn: {
    width: '100%', borderRadius: Radii.full, paddingVertical: 16,
    alignItems: 'center', marginTop: Spacing.sm,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  startBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.black },

  termsNote: {
    fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', lineHeight: 18, marginTop: Spacing.sm,
  },

  // Bottom controls
  bottomControls: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.bg,
  },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  dot: { height: 6, borderRadius: 3 },
  dotActive: {
    width: 24, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4,
  },
  dotInactive: { width: 6, backgroundColor: Colors.bgPanel },

  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  skipText: { fontSize: FontSize.base, color: Colors.textMuted, fontWeight: FontWeight.medium },
  nextBtn: {
    borderRadius: Radii.full, paddingVertical: 14, paddingHorizontal: 32,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  nextBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.black, color: Colors.bg },
});

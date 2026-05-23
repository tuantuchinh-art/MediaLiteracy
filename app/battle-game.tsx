import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { BATTLE_POSTS } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';
import { useAlert } from '@/template';

const { width, height } = Dimensions.get('window');

const ANSWER_OPTIONS = [
  { key: 'real', label: '✅ Thật', color: Colors.colorTrue, bgColor: Colors.colorTrue + '20' },
  { key: 'fake', label: '❌ Giả', color: Colors.colorFake, bgColor: Colors.colorFake + '20' },
  { key: 'misleading', label: '⚠️ Gây Hiểu Lầm', color: Colors.colorMisleading, bgColor: Colors.colorMisleading + '20' },
  { key: 'context', label: '✂️ Cắt Ngữ Cảnh', color: Colors.colorContext, bgColor: Colors.colorContext + '20' },
  { key: 'ai_generated', label: '🤖 AI Tạo', color: Colors.colorAI, bgColor: Colors.colorAI + '20' },
];

const PLATFORM_ICONS: Record<string, string> = {
  facebook: '📘',
  tiktok: '🎵',
  instagram: '📷',
};

const TIME_LIMIT = 15;

export default function BattleGameScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { addXP, addCombo, resetCombo, recordAnswer, gameState } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [answered, setAnswered] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const post = BATTLE_POSTS[currentIndex];

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex]);

  const startTimer = () => {
    setTimeLeft(TIME_LIMIT);
    if (timerRef.current) clearInterval(timerRef.current);
    Animated.timing(timerAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start();
    Animated.timing(timerAnim, { toValue: 0, duration: TIME_LIMIT * 1000, useNativeDriver: false }).start();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeOut = () => {
    setAnswered('timeout');
    setCombo(0);
    resetCombo();
    setShowExplanation(true);
    recordAnswer(false);
    setAnswers(prev => [...prev, false]);
    Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleAnswer = (key: string) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(key);

    const isCorrect = key === post.correctAnswer;
    recordAnswer(isCorrect);
    setAnswers(prev => [...prev, isCorrect]);

    if (isCorrect) {
      const xpGained = 50 + combo * 10;
      addXP(xpGained);
      addCombo();
      setScore(prev => prev + xpGained);
      setCombo(prev => prev + 1);
    } else {
      resetCombo();
      setCombo(0);
    }

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true }).start();
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setAnswered(null);
    resultAnim.setValue(0);
    if (currentIndex >= BATTLE_POSTS.length - 1) {
      setGameOver(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (gameOver) {
    const correct = answers.filter(Boolean).length;
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.resultScreen}>
          <Text style={styles.resultEmoji}>{correct >= 4 ? '🏆' : correct >= 2 ? '👍' : '😅'}</Text>
          <Text style={styles.resultTitle}>Kết Thúc!</Text>
          <Text style={styles.resultScore}>+{score} XP</Text>
          <View style={styles.resultStats}>
            <View style={styles.resultStatItem}>
              <Text style={styles.resultStatVal}>{correct}/{BATTLE_POSTS.length}</Text>
              <Text style={styles.resultStatLabel}>Đúng</Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={[styles.resultStatVal, { color: Colors.neonGold }]}>{gameState.maxCombo}x</Text>
              <Text style={styles.resultStatLabel}>Best Combo</Text>
            </View>
            <View style={styles.resultStatItem}>
              <Text style={[styles.resultStatVal, { color: Colors.neonPink }]}>{score}</Text>
              <Text style={styles.resultStatLabel}>XP Gained</Text>
            </View>
          </View>
          <Pressable onPress={() => { setCurrentIndex(0); setScore(0); setCombo(0); setGameOver(false); setAnswers([]); }} style={styles.playAgainBtn}>
            <Text style={styles.playAgainText}>⚡ Chơi Lại</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Thoát</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const timerColor = timeLeft <= 5 ? Colors.neonPink : timeLeft <= 10 ? Colors.neonGold : Colors.neonCyan;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
        </Pressable>
        <View style={styles.progressDots}>
          {BATTLE_POSTS.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i < currentIndex ? styles.dotDone : i === currentIndex ? styles.dotCurrent : styles.dotFuture
            ]} />
          ))}
        </View>
        <View style={styles.comboBox}>
          {combo > 0 && <Text style={styles.comboText}>🔥 {combo}x</Text>}
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerRow}>
        <View style={styles.timerBarBg}>
          <Animated.View style={[styles.timerBarFill, { 
            width: timerAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            backgroundColor: timerColor,
          }]} />
        </View>
        <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Post Card */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={[styles.postCard, answered && { borderColor: answered === post.correctAnswer ? Colors.colorTrue + '60' : Colors.colorFake + '60' }]}>
            {/* Platform Header */}
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.postAvatar} contentFit="cover" />
              <View style={styles.postUserInfo}>
                <Text style={styles.postUsername}>{post.username}</Text>
                <Text style={styles.postTime}>{PLATFORM_ICONS[post.platform]} {post.time}</Text>
              </View>
              {answered && (
                <Animated.View style={[styles.verdictBadge, {
                  backgroundColor: answered === post.correctAnswer ? Colors.colorTrue + '30' : Colors.colorFake + '30',
                  opacity: resultAnim,
                }]}>
                  <Text style={[styles.verdictText, { color: answered === post.correctAnswer ? Colors.colorTrue : Colors.colorFake }]}>
                    {answered === post.correctAnswer ? '✅ ĐÚNG!' : '❌ SAI!'}
                  </Text>
                </Animated.View>
              )}
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} contentFit="cover" />
            )}

            <View style={styles.postStats}>
              <Text style={styles.postStat}>👍 {post.likes.toLocaleString()}</Text>
              <Text style={styles.postStat}>🔄 {post.shares.toLocaleString()}</Text>
              <Text style={styles.postStat}>💬 {post.comments.toLocaleString()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Answer Options */}
        {!showExplanation && (
          <View style={styles.answersGrid}>
            {ANSWER_OPTIONS.map(opt => (
              <Pressable
                key={opt.key}
                onPress={() => handleAnswer(opt.key)}
                style={({ pressed }) => [
                  styles.answerBtn,
                  { borderColor: opt.color + '60', backgroundColor: opt.bgColor },
                  pressed && { transform: [{ scale: 0.97 }], opacity: 0.85 },
                ]}
              >
                <Text style={[styles.answerText, { color: opt.color }]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Explanation */}
        {showExplanation && (
          <Animated.View style={[styles.explanation, { opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <View style={[styles.explanationHeader, { backgroundColor: answered === post.correctAnswer ? Colors.colorTrue + '20' : Colors.colorFake + '20' }]}>
              <Text style={[styles.explanationTitle, { color: answered === post.correctAnswer ? Colors.colorTrue : Colors.colorFake }]}>
                {answered === post.correctAnswer ? '🎉 Chính xác!' : answered === 'timeout' ? '⏱ Hết giờ!' : '💡 Giải thích:'}
              </Text>
              <Text style={styles.correctAnswerText}>
                Đáp án: {ANSWER_OPTIONS.find(o => o.key === post.correctAnswer)?.label}
              </Text>
            </View>
            <Text style={styles.explanationText}>{post.explanation}</Text>
            <Text style={styles.cluesTitle}>🔍 Dấu Hiệu Nhận Biết:</Text>
            {post.clues.map((clue, i) => (
              <Text key={i} style={styles.clueItem}>• {clue}</Text>
            ))}
            <Pressable onPress={handleNext} style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>
                {currentIndex >= BATTLE_POSTS.length - 1 ? 'Xem Kết Quả 🏆' : 'Tiếp Theo →'}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm },
  closeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  progressDots: { flex: 1, flexDirection: 'row', gap: 4, justifyContent: 'center' },
  dot: { height: 6, borderRadius: 3, flex: 1 },
  dotDone: { backgroundColor: Colors.neonCyan },
  dotCurrent: { backgroundColor: Colors.neonGold },
  dotFuture: { backgroundColor: Colors.bgPanel },
  comboBox: { width: 60, alignItems: 'flex-end' },
  comboText: { color: Colors.neonGold, fontWeight: FontWeight.bold, fontSize: FontSize.sm },

  timerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.sm },
  timerBarBg: { flex: 1, height: 8, backgroundColor: Colors.bgPanel, borderRadius: Radii.full, overflow: 'hidden' },
  timerBarFill: { height: '100%', borderRadius: Radii.full },
  timerText: { fontSize: FontSize.sm, fontWeight: FontWeight.black, minWidth: 28, textAlign: 'right' },

  content: { paddingHorizontal: Spacing.base },

  postCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1.5,
    borderColor: Colors.border, padding: Spacing.base, marginBottom: Spacing.md, gap: Spacing.sm,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  postAvatar: { width: 44, height: 44, borderRadius: 22 },
  postUserInfo: { flex: 1, gap: 2 },
  postUsername: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  postTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  verdictBadge: { borderRadius: Radii.full, paddingHorizontal: 12, paddingVertical: 6 },
  verdictText: { fontWeight: FontWeight.black, fontSize: FontSize.sm },
  postContent: { fontSize: FontSize.base, color: Colors.textPrimary, lineHeight: 24 },
  postImage: { width: '100%', height: 200, borderRadius: Radii.lg },
  postStats: { flexDirection: 'row', gap: Spacing.lg },
  postStat: { fontSize: FontSize.sm, color: Colors.textMuted },

  answersGrid: { gap: Spacing.sm, marginBottom: Spacing.md },
  answerBtn: {
    borderWidth: 1.5, borderRadius: Radii.full, paddingVertical: 14, paddingHorizontal: 20,
    alignItems: 'center',
  },
  answerText: { fontWeight: FontWeight.bold, fontSize: FontSize.base },

  explanation: { backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', gap: 0 },
  explanationHeader: { padding: Spacing.base, gap: 4 },
  explanationTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  correctAnswerText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  explanationText: { fontSize: FontSize.base, color: Colors.textPrimary, lineHeight: 24, padding: Spacing.base, paddingTop: 0 },
  cluesTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.neonCyan, paddingHorizontal: Spacing.base },
  clueItem: { fontSize: FontSize.sm, color: Colors.textSecondary, paddingHorizontal: Spacing.base, paddingVertical: 2, lineHeight: 20 },
  nextBtn: {
    margin: Spacing.base, backgroundColor: Colors.neonCyan, borderRadius: Radii.full,
    paddingVertical: 14, alignItems: 'center',
  },
  nextBtnText: { color: Colors.bg, fontWeight: FontWeight.black, fontSize: FontSize.base },

  resultScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl, gap: Spacing.lg },
  resultEmoji: { fontSize: 80 },
  resultTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  resultScore: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, color: Colors.neonCyan },
  resultStats: { flexDirection: 'row', gap: Spacing.xxl },
  resultStatItem: { alignItems: 'center', gap: 4 },
  resultStatVal: { fontSize: FontSize.xxl, fontWeight: FontWeight.black, color: Colors.neonGreen },
  resultStatLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  playAgainBtn: {
    backgroundColor: Colors.neonCyan, borderRadius: Radii.full, width: '100%',
    paddingVertical: 16, alignItems: 'center',
  },
  playAgainText: { color: Colors.bg, fontWeight: FontWeight.black, fontSize: FontSize.lg },
  backBtn: { paddingVertical: 12 },
  backBtnText: { color: Colors.textSecondary, fontWeight: FontWeight.medium, fontSize: FontSize.base },
});

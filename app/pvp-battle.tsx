import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, ScrollView, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Radii } from '@/constants/theme';
import { BATTLE_POSTS } from '@/constants/gameData';
import { useGame } from '@/hooks/useGame';
import { useAchievements } from '@/hooks/useAchievements';

// ─── Constants ────────────────────────────────────────────────────────────────
const BATTLE_DURATION = 60;
const POSTS = BATTLE_POSTS.slice(0, 6);

const ANSWER_OPTIONS = [
  { key: 'real',         label: '✅ Thật',           color: Colors.colorTrue,       bg: Colors.colorTrue + '20' },
  { key: 'fake',         label: '❌ Giả',            color: Colors.colorFake,       bg: Colors.colorFake + '20' },
  { key: 'misleading',   label: '⚠️ Gây Hiểu Lầm',  color: Colors.colorMisleading, bg: Colors.colorMisleading + '20' },
  { key: 'context',      label: '✂️ Cắt Ngữ Cảnh',  color: Colors.colorContext,    bg: Colors.colorContext + '20' },
  { key: 'ai_generated', label: '🤖 AI Tạo',         color: Colors.colorAI,         bg: Colors.colorAI + '20' },
];

const PLATFORM_ICONS: Record<string, string> = { facebook: '📘', tiktok: '🎵', instagram: '📷' };

const OPPONENTS = [
  { name: 'TruthHunter_VN', avatar: 'https://i.pravatar.cc/150?img=21', level: 42, rank: 'Kim Cương' },
  { name: 'MinhDetective',   avatar: 'https://i.pravatar.cc/150?img=33', level: 36, rank: 'Bạch Kim'  },
  { name: 'FactChecker2025', avatar: 'https://i.pravatar.cc/150?img=47', level: 28, rank: 'Vàng'      },
  { name: 'HaNoiTruth',      avatar: 'https://i.pravatar.cc/150?img=55', level: 15, rank: 'Bạc'       },
];

type Phase = 'searching' | 'found' | 'countdown' | 'battle' | 'result';
type Opponent = typeof OPPONENTS[0];

// ─── Searching Phase ──────────────────────────────────────────────────────────
function SearchingPhase({ onFound }: { onFound: () => void }) {
  const ring1 = useRef(new Animated.Value(0.2)).current;
  const ring2 = useRef(new Animated.Value(0.15)).current;
  const ring3 = useRef(new Animated.Value(0.1)).current;
  const spin  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (a: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(a, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.1, duration: 900, useNativeDriver: true }),
      ]));
    pulse(ring1, 0).start();
    pulse(ring2, 300).start();
    pulse(ring3, 600).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2200, useNativeDriver: true })).start();
    const t = setTimeout(onFound, 2600);
    return () => clearTimeout(t);
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={S.searchRoot}>
      {[ring3, ring2, ring1].map((r, i) => (
        <Animated.View key={i} style={[S.ring, {
          width: 120 + i * 72, height: 120 + i * 72,
          borderRadius: 60 + i * 36, opacity: r,
        }]} />
      ))}
      <Animated.View style={[S.spinnerRing, { transform: [{ rotate }] }]}>
        <View style={S.spinnerDot} />
      </Animated.View>
      <View style={S.searchIconBox}><Text style={{ fontSize: 34 }}>🔍</Text></View>

      <View style={S.searchTextBlock}>
        <Text style={S.searchTitle}>Đang Tìm Đối Thủ...</Text>
        <Text style={S.searchSub}>Kết nối với người chơi gần nhất</Text>
        <View style={S.dotsRow}>
          {[0, 1, 2].map(i => <BlinkDot key={i} delay={i * 220} />)}
        </View>
      </View>
    </View>
  );
}

function BlinkDot({ delay }: { delay: number }) {
  const a = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(a, { toValue: 0.3, duration: 380, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={[S.blinkDot, { opacity: a }]} />;
}

// ─── Found Phase ──────────────────────────────────────────────────────────────
function FoundPhase({ opponent, onStart }: { opponent: Opponent; onStart: () => void }) {
  const slideY = useRef(new Animated.Value(50)).current;
  const fade   = useRef(new Animated.Value(0)).current;
  const vsScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start(() => {
      Animated.spring(vsScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    });
    const t = setTimeout(onStart, 2900);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[S.foundRoot, { opacity: fade, transform: [{ translateY: slideY }] }]}>
      <View style={S.foundBanner}>
        <Text style={S.foundBannerText}>🎯 ĐÃ TÌM THẤY ĐỐI THỦ!</Text>
      </View>

      <View style={S.vsRow}>
        <PlayerBio name="Bạn" avatar="https://i.pravatar.cc/150?img=1" rank="Bạc" rankColor={Colors.neonCyan} />
        <Animated.View style={[S.vsCircle, { transform: [{ scale: vsScale }] }]}>
          <Text style={S.vsText}>VS</Text>
        </Animated.View>
        <PlayerBio name={opponent.name} avatar={opponent.avatar} rank={opponent.rank} rankColor={Colors.neonGold} />
      </View>

      <Text style={S.foundHint}>Trận đấu bắt đầu sau ít giây...</Text>
    </Animated.View>
  );
}

function PlayerBio({ name, avatar, rank, rankColor }: { name: string; avatar: string; rank: string; rankColor: string }) {
  return (
    <View style={S.playerBio}>
      <Image source={{ uri: avatar }} style={S.bioAvatar} contentFit="cover" />
      <Text style={S.bioName} numberOfLines={1}>{name.split('_')[0]}</Text>
      <View style={[S.bioRankPill, { backgroundColor: rankColor + '25', borderColor: rankColor + '60' }]}>
        <Text style={[S.bioRankText, { color: rankColor }]}>{rank}</Text>
      </View>
    </View>
  );
}

// ─── Countdown Phase ──────────────────────────────────────────────────────────
function CountdownPhase({ onDone }: { onDone: () => void }) {
  const [num, setNum] = useState(3);
  const scale = useRef(new Animated.Value(0)).current;

  const tick = useCallback((n: number) => {
    scale.setValue(0);
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    if (n > 0) setTimeout(() => { setNum(n - 1); tick(n - 1); }, 850);
    else setTimeout(onDone, 700);
  }, []);

  useEffect(() => { tick(3); }, []);

  return (
    <View style={S.countRoot}>
      <Text style={S.countHint}>Chuẩn bị chiến đấu!</Text>
      <Animated.Text style={[S.countNum, { transform: [{ scale }], color: num === 0 ? Colors.neonGreen : Colors.neonCyan }]}>
        {num === 0 ? 'GO!' : num}
      </Animated.Text>
      <Text style={S.countSub}>Ai đúng nhiều hơn trong {BATTLE_DURATION}s sẽ thắng!</Text>
    </View>
  );
}

// ─── Battle Phase ─────────────────────────────────────────────────────────────
function BattlePhase({ opponent, onFinish }: {
  opponent: Opponent;
  onFinish: (ms: number, os: number, mc: number, oc: number) => void;
}) {
  const [timeLeft, setTimeLeft]     = useState(BATTLE_DURATION);
  const [postIdx, setPostIdx]       = useState(0);
  const [answered, setAnswered]     = useState<string | null>(null);
  const [showExp, setShowExp]       = useState(false);
  const [myScore, setMyScore]       = useState(0);
  const [myCorrect, setMyCorrect]   = useState(0);
  const [oppScore, setOppScore]     = useState(0);
  const [oppCorrect, setOppCorrect] = useState(0);

  const timerAnim  = useRef(new Animated.Value(1)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const oppFlash   = useRef(new Animated.Value(0)).current;
  const doneRef    = useRef(false);

  // Snapshot refs for the finish callback
  const myScoreRef   = useRef(0);
  const myCorrectRef = useRef(0);
  const oppScoreRef  = useRef(0);
  const oppCorrectRef = useRef(0);

  const post = POSTS[postIdx % POSTS.length];

  // Timer
  useEffect(() => {
    Animated.timing(timerAnim, { toValue: 0, duration: BATTLE_DURATION * 1000, useNativeDriver: false }).start();
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (!doneRef.current) {
            doneRef.current = true;
            setTimeout(() => onFinish(myScoreRef.current, oppScoreRef.current, myCorrectRef.current, oppCorrectRef.current), 80);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Opponent bot
  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      const d = 3200 + Math.random() * 5000;
      setTimeout(() => {
        if (cancelled || doneRef.current) return;
        const correct = Math.random() < 0.60;
        if (correct) {
          setOppScore(p => { const n = p + 60; oppScoreRef.current = n; return n; });
          setOppCorrect(p => { const n = p + 1; oppCorrectRef.current = n; return n; });
          Animated.sequence([
            Animated.timing(oppFlash, { toValue: 1, duration: 130, useNativeDriver: true }),
            Animated.timing(oppFlash, { toValue: 0, duration: 320, useNativeDriver: true }),
          ]).start();
        }
        if (!cancelled) schedule();
      }, d);
    };
    schedule();
    return () => { cancelled = true; };
  }, []);

  const handleAnswer = (key: string) => {
    if (answered || doneRef.current) return;
    setAnswered(key);
    if (key === post.correctAnswer) {
      setMyScore(p => { const n = p + 60; myScoreRef.current = n; return n; });
      setMyCorrect(p => { const n = p + 1; myCorrectRef.current = n; return n; });
    }
    Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true }).start();
    setShowExp(true);
  };

  const handleNext = () => {
    setAnswered(null);
    setShowExp(false);
    resultAnim.setValue(0);
    setPostIdx(p => p + 1);
  };

  const urgent = timeLeft <= 10;
  const tc = urgent ? Colors.neonPink : timeLeft <= 20 ? Colors.neonGold : Colors.neonCyan;
  const timerW = timerAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={B.root}>
      {/* Scoreboard */}
      <View style={B.scoreboard}>
        <View style={B.sideBox}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=1' }} style={B.sbAvatar} contentFit="cover" />
          <Text style={B.sbName} numberOfLines={1}>Bạn</Text>
          <Text style={[B.sbScore, { color: Colors.neonCyan }]}>{myScore}</Text>
          <Text style={B.sbRight}>{myCorrect} đúng</Text>
        </View>

        <View style={B.sbCenter}>
          <Text style={[B.sbTimer, { color: tc }]}>{timeLeft}</Text>
          <Text style={B.sbTimerLabel}>giây</Text>
        </View>

        <Animated.View style={[B.sideBox, B.sideRight, {
          backgroundColor: oppFlash.interpolate({ inputRange: [0, 1], outputRange: ['transparent', Colors.neonGold + '22'] })
        }]}>
          <Image source={{ uri: opponent.avatar }} style={B.sbAvatar} contentFit="cover" />
          <Text style={B.sbName} numberOfLines={1}>{opponent.name.split('_')[0]}</Text>
          <Text style={[B.sbScore, { color: Colors.neonGold }]}>{oppScore}</Text>
          <Text style={B.sbRight}>{oppCorrect} đúng</Text>
        </Animated.View>
      </View>

      {/* Timer bar */}
      <View style={B.timerBg}>
        <Animated.View style={[B.timerFill, { width: timerW, backgroundColor: tc }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={B.scroll}>
        {/* Post */}
        <View style={[B.card, answered ? { borderColor: answered === post.correctAnswer ? Colors.colorTrue + '70' : Colors.colorFake + '70' } : null]}>
          <View style={B.cardHeader}>
            <Image source={{ uri: post.avatar }} style={B.cardAvatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={B.cardUser}>{post.username}</Text>
              <Text style={B.cardTime}>{PLATFORM_ICONS[post.platform]} {post.time}</Text>
            </View>
            {answered && (
              <View style={[B.verdict, { backgroundColor: answered === post.correctAnswer ? Colors.colorTrue + '25' : Colors.colorFake + '25' }]}>
                <Text style={[B.verdictText, { color: answered === post.correctAnswer ? Colors.colorTrue : Colors.colorFake }]}>
                  {answered === post.correctAnswer ? '✅ ĐÚNG' : '❌ SAI'}
                </Text>
              </View>
            )}
          </View>
          <Text style={B.cardContent}>{post.content}</Text>
          {post.image ? <Image source={{ uri: post.image }} style={B.cardImg} contentFit="cover" /> : null}
          <View style={B.cardStats}>
            <Text style={B.cardStat}>👍 {post.likes.toLocaleString()}</Text>
            <Text style={B.cardStat}>🔄 {post.shares.toLocaleString()}</Text>
            <Text style={B.cardStat}>💬 {post.comments.toLocaleString()}</Text>
          </View>
        </View>

        {/* Options */}
        {!showExp && (
          <View style={B.optGrid}>
            {ANSWER_OPTIONS.map(o => (
              <Pressable key={o.key} onPress={() => handleAnswer(o.key)}
                style={({ pressed }) => [B.optBtn, { borderColor: o.color + '60', backgroundColor: o.bg }, pressed && { transform: [{ scale: 0.97 }] }]}>
                <Text style={[B.optText, { color: o.color }]}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Explanation */}
        {showExp && (
          <Animated.View style={[B.exp, {
            opacity: resultAnim,
            transform: [{ translateY: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
          }]}>
            <View style={[B.expHead, { backgroundColor: answered === post.correctAnswer ? Colors.colorTrue + '18' : Colors.colorFake + '18' }]}>
              <Text style={[B.expTitle, { color: answered === post.correctAnswer ? Colors.colorTrue : Colors.colorFake }]}>
                {answered === post.correctAnswer ? '🎉 Chính xác! +60 điểm' : '💡 Đáp án: ' + ANSWER_OPTIONS.find(o => o.key === post.correctAnswer)?.label}
              </Text>
            </View>
            <Text style={B.expText} numberOfLines={3}>{post.explanation}</Text>
            <Pressable onPress={handleNext} style={B.nextBtn}>
              <Text style={B.nextText}>Câu Tiếp Theo →</Text>
            </Pressable>
          </Animated.View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// ─── Result Phase ─────────────────────────────────────────────────────────────
function ResultPhase({ opponent, myScore, oppScore, myCorrect, oppCorrect, onReplay, onExit }: {
  opponent: Opponent;
  myScore: number; oppScore: number;
  myCorrect: number; oppCorrect: number;
  onReplay: () => void; onExit: () => void;
}) {
  const { addXP, recordPvPWin } = useGame();
  const won = myScore >= oppScore;
  const xpGained = won ? myCorrect * 100 : myCorrect * 50;
  const isPerfect = won && oppCorrect === 0;

  const crownScale = useRef(new Animated.Value(0)).current;
  const cardSlide  = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    addXP(xpGained);
    if (won) recordPvPWin();
    Animated.parallel([
      Animated.spring(crownScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(cardSlide,  { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const accuracy = Math.round((myCorrect / POSTS.length) * 100);

  return (
    <View style={R.root}>
      {/* Trophy / badge */}
      <Animated.View style={[R.heroArea, { transform: [{ scale: crownScale }] }]}>
        <Text style={R.trophy}>{won ? '🏆' : '😤'}</Text>
        <Text style={[R.resultLabel, { color: won ? Colors.neonGold : Colors.neonPink }]}>
          {won ? 'CHIẾN THẮNG!' : 'THẤT BẠI!'}
        </Text>
        <View style={[R.xpBadge, { backgroundColor: won ? Colors.neonGold + '22' : Colors.neonCyan + '22', borderColor: won ? Colors.neonGold + '60' : Colors.neonCyan + '60' }]}>
          <Text style={[R.xpText, { color: won ? Colors.neonGold : Colors.neonCyan }]}>
            {won ? '⭐ Thưởng ×2 XP — ' : ''}+{xpGained} XP
          </Text>
        </View>
      </Animated.View>

      {/* Score card */}
      <Animated.View style={[R.scoreCard, { transform: [{ translateY: cardSlide }] }]}>
        {/* Avatars row */}
        <View style={R.avatarRow}>
          <View style={R.avatarCol}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=1' }} style={[R.bigAvatar, { borderColor: Colors.neonCyan }]} contentFit="cover" />
            {won ? <Text style={R.winCrown}>👑</Text> : null}
            <Text style={R.playerLabel}>Bạn</Text>
            <Text style={[R.scoreBig, { color: Colors.neonCyan }]}>{myScore}</Text>
            <Text style={R.correctLabel}>{myCorrect}/{POSTS.length} đúng</Text>
          </View>

          <View style={R.divider}>
            <Text style={R.divText}>VS</Text>
          </View>

          <View style={R.avatarCol}>
            <Image source={{ uri: opponent.avatar }} style={[R.bigAvatar, { borderColor: Colors.neonGold }]} contentFit="cover" />
            {!won ? <Text style={R.winCrown}>👑</Text> : null}
            <Text style={R.playerLabel} numberOfLines={1}>{opponent.name.split('_')[0]}</Text>
            <Text style={[R.scoreBig, { color: Colors.neonGold }]}>{oppScore}</Text>
            <Text style={R.correctLabel}>{oppCorrect}/{POSTS.length} đúng</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={R.statsStrip}>
          {[
            { val: myScore.toString(), label: 'Điểm', color: Colors.neonCyan },
            { val: `+${xpGained}`,    label: 'XP',   color: Colors.neonGold },
            { val: `${accuracy}%`,    label: 'Chính xác', color: Colors.neonGreen },
          ].map(s => (
            <View key={s.label} style={R.statItem}>
              <Text style={[R.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={R.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Buttons */}
      <View style={R.actions}>
        <Pressable onPress={onReplay} style={R.primaryBtn}>
          <Text style={R.primaryBtnText}>⚡ Tìm Trận Mới</Text>
        </Pressable>
        <Pressable onPress={onExit} style={R.secondaryBtn}>
          <Text style={R.secondaryBtnText}>← Về Trang Chủ</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Root Orchestrator ────────────────────────────────────────────────────────
export default function PvPBattleScreen() {
  const insets   = useSafeAreaInsets();
  const router   = useRouter();
  const [phase, setPhase] = useState<Phase>('searching');
  const [opponent] = useState<Opponent>(() => OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)]);
  const [result, setResult] = useState({ ms: 0, os: 0, mc: 0, oc: 0 });

  const handleFinish = (ms: number, os: number, mc: number, oc: number) => {
    setResult({ ms, os, mc, oc });
    setPhase('result');
  };

  const handleReplay = () => {
    setPhase('searching');
  };

  return (
    <View style={[G.root, { paddingTop: insets.top }]}>
      {/* Top bar (hide during battle & result) */}
      {phase !== 'battle' && phase !== 'result' && (
        <View style={G.topBar}>
          <Pressable onPress={() => router.back()} style={G.closeBtn}>
            <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Text style={G.topTitle}>🥊 PvP 1v1</Text>
          <View style={{ width: 36 }} />
        </View>
      )}

      {phase === 'searching' && <SearchingPhase onFound={() => setPhase('found')} />}
      {phase === 'found'     && <FoundPhase opponent={opponent} onStart={() => setPhase('countdown')} />}
      {phase === 'countdown' && <CountdownPhase onDone={() => setPhase('battle')} />}
      {phase === 'battle'    && <BattlePhase opponent={opponent} onFinish={handleFinish} />}
      {phase === 'result'    && (
        <ResultPhase
          opponent={opponent}
          myScore={result.ms} oppScore={result.os}
          myCorrect={result.mc} oppCorrect={result.oc}
          onReplay={handleReplay}
          onExit={() => router.back()}
        />
      )}
    </View>
  );
}

// ─── Style Sheets ─────────────────────────────────────────────────────────────

// Global
const G = StyleSheet.create({
  root:     { flex: 1, backgroundColor: Colors.bg },
  topBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  closeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.black, color: Colors.neonPink },
});

// Searching
const S = StyleSheet.create({
  searchRoot:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ring:          { position: 'absolute', borderWidth: 1.5, borderColor: Colors.neonCyan + '60' },
  spinnerRing:   { width: 108, height: 108, borderRadius: 54, borderWidth: 2.5, borderColor: Colors.neonCyan, borderTopColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center' },
  spinnerDot:    { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.neonCyan, marginTop: 6 },
  searchIconBox: { position: 'absolute', width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.bgCard, borderWidth: 2, borderColor: Colors.neonCyan + '60', justifyContent: 'center', alignItems: 'center' },
  searchTextBlock: { position: 'absolute', bottom: 160, alignItems: 'center', gap: Spacing.sm },
  searchTitle:   { fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.textPrimary },
  searchSub:     { fontSize: FontSize.sm, color: Colors.textSecondary },
  dotsRow:       { flexDirection: 'row', gap: 8, marginTop: 4 },
  blinkDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.neonCyan },
  // Found
  foundRoot:     { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xxl, gap: Spacing.xxl },
  foundBanner:   { backgroundColor: Colors.neonGreen + '22', borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.neonGreen + '60', paddingHorizontal: 20, paddingVertical: 10 },
  foundBannerText: { color: Colors.neonGreen, fontWeight: FontWeight.black, fontSize: FontSize.base, letterSpacing: 1 },
  vsRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', gap: Spacing.xl },
  playerBio:     { flex: 1, alignItems: 'center', gap: Spacing.sm },
  bioAvatar:     { width: 76, height: 76, borderRadius: 38, borderWidth: 2.5, borderColor: Colors.neonCyan },
  bioName:       { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center', maxWidth: 90 },
  bioRankPill:   { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  bioRankText:   { fontSize: FontSize.xs, fontWeight: FontWeight.black },
  vsCircle:      { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neonPink + '28', borderWidth: 2, borderColor: Colors.neonPink, justifyContent: 'center', alignItems: 'center' },
  vsText:        { color: Colors.neonPink, fontWeight: FontWeight.black, fontSize: FontSize.md },
  foundHint:     { color: Colors.textMuted, fontSize: FontSize.sm },
  // Countdown
  countRoot:     { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.lg },
  countHint:     { fontSize: FontSize.lg, color: Colors.textSecondary, fontWeight: FontWeight.semibold },
  countNum:      { fontSize: 116, fontWeight: FontWeight.black, lineHeight: 124 },
  countSub:      { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xxl },
});

// Battle
const B = StyleSheet.create({
  root:         { flex: 1, backgroundColor: Colors.bg },
  scoreboard:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  sideBox:      { flex: 1, alignItems: 'center', gap: 2 },
  sideRight:    { borderRadius: Radii.md, paddingVertical: 6 },
  sbAvatar:     { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: Colors.border },
  sbName:       { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textPrimary, maxWidth: 78, textAlign: 'center' },
  sbScore:      { fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  sbRight:      { fontSize: FontSize.xs, color: Colors.textMuted },
  sbCenter:     { alignItems: 'center', paddingHorizontal: Spacing.sm },
  sbTimer:      { fontSize: FontSize.xxl, fontWeight: FontWeight.black, lineHeight: 30 },
  sbTimerLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  timerBg:      { height: 3, backgroundColor: Colors.bgPanel },
  timerFill:    { height: '100%' },
  scroll:       { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },
  card:         { backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1.5, borderColor: Colors.border, padding: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.sm },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardAvatar:   { width: 38, height: 38, borderRadius: 19 },
  cardUser:     { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  cardTime:     { fontSize: FontSize.xs, color: Colors.textMuted },
  verdict:      { borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 5 },
  verdictText:  { fontWeight: FontWeight.black, fontSize: FontSize.xs },
  cardContent:  { fontSize: FontSize.base, color: Colors.textPrimary, lineHeight: 22 },
  cardImg:      { width: '100%', height: 175, borderRadius: Radii.lg },
  cardStats:    { flexDirection: 'row', gap: Spacing.lg },
  cardStat:     { fontSize: FontSize.xs, color: Colors.textMuted },
  optGrid:      { gap: Spacing.sm, marginBottom: Spacing.sm },
  optBtn:       { borderWidth: 1.5, borderRadius: Radii.full, paddingVertical: 13, alignItems: 'center' },
  optText:      { fontWeight: FontWeight.bold, fontSize: FontSize.base },
  exp:          { backgroundColor: Colors.bgCard, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.sm },
  expHead:      { padding: Spacing.base },
  expTitle:     { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  expText:      { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, paddingHorizontal: Spacing.base, paddingBottom: 4 },
  nextBtn:      { margin: Spacing.base, backgroundColor: Colors.neonCyan, borderRadius: Radii.full, paddingVertical: 12, alignItems: 'center' },
  nextText:     { color: Colors.bg, fontWeight: FontWeight.black, fontSize: FontSize.base },
});

// Result
const R = StyleSheet.create({
  root:           { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.xl },
  heroArea:       { alignItems: 'center', gap: Spacing.sm },
  trophy:         { fontSize: 84 },
  resultLabel:    { fontSize: FontSize.xxxl, fontWeight: FontWeight.black, letterSpacing: 2 },
  xpBadge:        { borderRadius: Radii.full, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 8, marginTop: 4 },
  xpText:         { fontSize: FontSize.base, fontWeight: FontWeight.black },
  scoreCard:      { backgroundColor: Colors.bgCard, borderRadius: Radii.xxl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, gap: Spacing.xl },
  avatarRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  avatarCol:      { alignItems: 'center', gap: Spacing.sm, flex: 1, position: 'relative' },
  bigAvatar:      { width: 76, height: 76, borderRadius: 38, borderWidth: 2.5 },
  winCrown:       { position: 'absolute', top: -14, fontSize: 26 },
  playerLabel:    { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center', maxWidth: 100 },
  scoreBig:       { fontSize: FontSize.xxxl, fontWeight: FontWeight.black },
  correctLabel:   { fontSize: FontSize.xs, color: Colors.textMuted },
  divider:        { paddingHorizontal: Spacing.sm },
  divText:        { fontSize: FontSize.md, fontWeight: FontWeight.black, color: Colors.textMuted },
  statsStrip:     { flexDirection: 'row', backgroundColor: Colors.bgPanel, borderRadius: Radii.lg, paddingVertical: Spacing.md },
  statItem:       { flex: 1, alignItems: 'center', gap: 4 },
  statVal:        { fontSize: FontSize.lg, fontWeight: FontWeight.black },
  statLabel:      { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  actions:        { gap: Spacing.sm },
  primaryBtn:     { backgroundColor: Colors.neonCyan, borderRadius: Radii.full, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: Colors.bg, fontWeight: FontWeight.black, fontSize: FontSize.base },
  secondaryBtn:   { backgroundColor: Colors.bgCard, borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  secondaryBtnText: { color: Colors.textSecondary, fontWeight: FontWeight.semibold, fontSize: FontSize.base },
});

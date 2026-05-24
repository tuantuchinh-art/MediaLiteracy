// Achievement System — Media Literacy App

export type AchievementId =
  // Streak
  | 'streak_3' | 'streak_7' | 'streak_14' | 'streak_30'
  // Correct Answers
  | 'correct_10' | 'correct_50' | 'correct_100' | 'correct_500'
  // Combo
  | 'combo_5' | 'combo_10' | 'combo_20'
  // PvP
  | 'pvp_first_win' | 'pvp_win_5' | 'pvp_win_20' | 'pvp_no_miss'
  // XP / Level
  | 'xp_1000' | 'xp_5000' | 'level_5' | 'level_10' | 'level_20'
  // Investigation
  | 'investigate_first' | 'investigate_5' | 'investigate_perfect'
  // Category
  | 'clickbait_master' | 'deepfake_hunter' | 'ai_detector'
  // Special
  | 'daily_7' | 'speed_demon' | 'perfectionist';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  rarityColor: string;
  xpReward: number;
  // Progress tracking
  maxProgress?: number; // if set, badge shows progress bar
  condition: string; // human-readable unlock condition
}

export type AchievementCategory =
  | 'Streak'
  | 'Chiến Đấu'
  | 'PvP'
  | 'Điều Tra'
  | 'Kỹ Năng'
  | 'Đặc Biệt';

export const ACHIEVEMENT_RARITY_COLORS: Record<string, string> = {
  Common: '#A0A0C0',
  Rare: '#00F5FF',
  Epic: '#7B2FFF',
  Legendary: '#FFD700',
};

export const ACHIEVEMENTS: Achievement[] = [
  // ── STREAK ─────────────────────────────────────────────────────
  {
    id: 'streak_3',
    name: 'Khởi Động',
    description: 'Duy trì streak 3 ngày liên tiếp',
    icon: '🔥',
    category: 'Streak',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 50,
    maxProgress: 3,
    condition: 'Đăng nhập 3 ngày liên tiếp',
  },
  {
    id: 'streak_7',
    name: 'Tuần Chiến Binh',
    description: '7 ngày streak liên tiếp không gián đoạn',
    icon: '🗓️',
    category: 'Streak',
    rarity: 'Rare',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Rare,
    xpReward: 150,
    maxProgress: 7,
    condition: 'Đăng nhập 7 ngày liên tiếp',
  },
  {
    id: 'streak_14',
    name: 'Nửa Tháng Bất Bại',
    description: 'Chuỗi 14 ngày không nghỉ',
    icon: '🏅',
    category: 'Streak',
    rarity: 'Epic',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Epic,
    xpReward: 350,
    maxProgress: 14,
    condition: 'Duy trì 14 ngày streak',
  },
  {
    id: 'streak_30',
    name: 'Huyền Thoại Tháng',
    description: '30 ngày streak — bạn là legend!',
    icon: '👑',
    category: 'Streak',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 1000,
    maxProgress: 30,
    condition: 'Duy trì streak 30 ngày liên tiếp',
  },

  // ── CHIẾN ĐẤU (Correct Answers) ────────────────────────────────
  {
    id: 'correct_10',
    name: 'Tân Binh Sáng Suốt',
    description: 'Trả lời đúng 10 câu hỏi đầu tiên',
    icon: '🎯',
    category: 'Chiến Đấu',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 75,
    maxProgress: 10,
    condition: 'Trả lời đúng 10 câu',
  },
  {
    id: 'correct_50',
    name: 'Thám Tử Nhanh Nhạy',
    description: '50 câu trả lời chính xác',
    icon: '🔍',
    category: 'Chiến Đấu',
    rarity: 'Rare',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Rare,
    xpReward: 200,
    maxProgress: 50,
    condition: 'Đạt 50 câu đúng tổng cộng',
  },
  {
    id: 'correct_100',
    name: 'Trăm Câu Bách Phát',
    description: 'Cột mốc 100 câu đúng — ấn tượng!',
    icon: '💯',
    category: 'Chiến Đấu',
    rarity: 'Epic',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Epic,
    xpReward: 500,
    maxProgress: 100,
    condition: 'Trả lời đúng 100 câu',
  },
  {
    id: 'correct_500',
    name: 'Không Thể Bẻ Gãy',
    description: '500 câu đúng — bạn là máy phát hiện tin giả!',
    icon: '🦾',
    category: 'Chiến Đấu',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 2000,
    maxProgress: 500,
    condition: 'Đạt mốc 500 câu đúng',
  },

  // ── COMBO ───────────────────────────────────────────────────────
  {
    id: 'combo_5',
    name: 'Combo Khởi Đầu',
    description: 'Đạt combo x5 liên tiếp trong một trận',
    icon: '⚡',
    category: 'Chiến Đấu',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 80,
    maxProgress: 5,
    condition: 'Combo 5 câu đúng liên tiếp',
  },
  {
    id: 'combo_10',
    name: 'Siêu Combo',
    description: 'Combo x10 không sai một lần',
    icon: '🌪️',
    category: 'Chiến Đấu',
    rarity: 'Epic',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Epic,
    xpReward: 300,
    maxProgress: 10,
    condition: 'Đạt combo x10 trong một session',
  },
  {
    id: 'combo_20',
    name: 'Unstoppable',
    description: '20 câu đúng liên tiếp — không thể tin được!',
    icon: '🔥',
    category: 'Chiến Đấu',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 800,
    maxProgress: 20,
    condition: 'Đạt combo x20',
  },

  // ── PvP ─────────────────────────────────────────────────────────
  {
    id: 'pvp_first_win',
    name: 'Chiến Thắng Đầu Tiên',
    description: 'Giành chiến thắng trận PvP đầu tiên',
    icon: '🥊',
    category: 'PvP',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 100,
    condition: 'Thắng 1 trận PvP',
  },
  {
    id: 'pvp_win_5',
    name: 'Đấu Thủ Thực Thụ',
    description: 'Thắng 5 trận PvP 1v1',
    icon: '🏆',
    category: 'PvP',
    rarity: 'Rare',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Rare,
    xpReward: 300,
    maxProgress: 5,
    condition: 'Thắng 5 trận PvP',
  },
  {
    id: 'pvp_win_20',
    name: 'Vô Địch Arena',
    description: '20 chiến thắng PvP — bạn thống trị đấu trường!',
    icon: '⚔️',
    category: 'PvP',
    rarity: 'Epic',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Epic,
    xpReward: 800,
    maxProgress: 20,
    condition: 'Thắng 20 trận PvP',
  },
  {
    id: 'pvp_no_miss',
    name: 'Hoàn Hảo Tuyệt Đối',
    description: 'Thắng PvP với tỷ lệ đúng 100%',
    icon: '💎',
    category: 'PvP',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 1200,
    condition: 'Thắng PvP mà không sai câu nào',
  },

  // ── XP / LEVEL ──────────────────────────────────────────────────
  {
    id: 'xp_1000',
    name: 'Ngàn XP Đầu Tiên',
    description: 'Tích lũy 1,000 XP',
    icon: '⭐',
    category: 'Chiến Đấu',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 50,
    maxProgress: 1000,
    condition: 'Tích lũy tổng 1,000 XP',
  },
  {
    id: 'xp_5000',
    name: 'Nhà Giàu XP',
    description: 'Tích lũy 5,000 XP',
    icon: '💰',
    category: 'Chiến Đấu',
    rarity: 'Rare',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Rare,
    xpReward: 250,
    maxProgress: 5000,
    condition: 'Tích lũy tổng 5,000 XP',
  },
  {
    id: 'level_5',
    name: 'Cấp 5 Đạt Đỉnh',
    description: 'Đạt cấp độ 5',
    icon: '🌟',
    category: 'Chiến Đấu',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 100,
    condition: 'Lên cấp 5',
  },
  {
    id: 'level_10',
    name: 'Chiến Binh Cấp 10',
    description: 'Đạt cấp độ 10 — bước vào hàng Elite',
    icon: '🔱',
    category: 'Chiến Đấu',
    rarity: 'Rare',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Rare,
    xpReward: 400,
    condition: 'Lên cấp 10',
  },
  {
    id: 'level_20',
    name: 'Huyền Thoại Cấp 20',
    description: 'Đạt cấp 20 — gia nhập tầng lớp Legends',
    icon: '🌈',
    category: 'Chiến Đấu',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 1500,
    condition: 'Lên cấp 20',
  },

  // ── ĐIỀU TRA ────────────────────────────────────────────────────
  {
    id: 'investigate_first',
    name: 'Thám Tử Nhập Môn',
    description: 'Hoàn thành vụ án điều tra đầu tiên',
    icon: '🕵️',
    category: 'Điều Tra',
    rarity: 'Common',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Common,
    xpReward: 100,
    condition: 'Hoàn thành 1 vụ điều tra',
  },
  {
    id: 'investigate_5',
    name: 'Sherlock Việt Nam',
    description: 'Giải quyết 5 vụ án điều tra',
    icon: '🔭',
    category: 'Điều Tra',
    rarity: 'Epic',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Epic,
    xpReward: 500,
    maxProgress: 5,
    condition: 'Hoàn thành 5 vụ điều tra',
  },
  {
    id: 'investigate_perfect',
    name: 'Zero Error Detective',
    description: 'Giải vụ án điều tra mà không cần gợi ý',
    icon: '🎖️',
    category: 'Điều Tra',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 700,
    condition: 'Hoàn thành điều tra với 100% bằng chứng',
  },

  // ── ĐẶC BIỆT ───────────────────────────────────────────────────
  {
    id: 'daily_7',
    name: 'Daily Warrior',
    description: 'Hoàn thành thử thách hàng ngày 7 lần',
    icon: '📅',
    category: 'Đặc Biệt',
    rarity: 'Rare',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Rare,
    xpReward: 350,
    maxProgress: 7,
    condition: 'Hoàn thành Daily Challenge 7 lần',
  },
  {
    id: 'speed_demon',
    name: 'Tốc Độ Ánh Sáng',
    description: 'Trả lời đúng trong vòng 2 giây',
    icon: '⚡',
    category: 'Đặc Biệt',
    rarity: 'Epic',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Epic,
    xpReward: 400,
    condition: 'Trả lời đúng trong < 2 giây',
  },
  {
    id: 'perfectionist',
    name: 'Hoàn Mỹ Chủ Nghĩa',
    description: 'Đạt 100% chính xác trong một trận Battle',
    icon: '💫',
    category: 'Đặc Biệt',
    rarity: 'Legendary',
    rarityColor: ACHIEVEMENT_RARITY_COLORS.Legendary,
    xpReward: 600,
    condition: 'Đúng 100% trong một ván chiến đấu',
  },
];

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  'Streak', 'Chiến Đấu', 'PvP', 'Điều Tra', 'Kỹ Năng', 'Đặc Biệt',
];

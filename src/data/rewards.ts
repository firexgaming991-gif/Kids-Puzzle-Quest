import { StickerItem, BadgeItem, GameCategory } from '../types/game';

export interface CategoryMeta {
  id: GameCategory;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'shapes_shadows',
    title: 'عالم الظلال والأشكال',
    subtitle: 'طابق الظل مع الشكل الملون',
    icon: '✨',
    themeColor: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    description: 'درّب عينيك الذكيتين على اكتشاف أشكال الظلال والرسوم!',
  },
  {
    id: 'letters_words',
    title: 'حديقة الحروف والكلمات',
    subtitle: 'أول حرف وتركيب الكلمات',
    icon: '📚',
    themeColor: '#0EA5E9',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    description: 'تعرف على حروف لغتنا العربية الجميلة وصور الحيوانات المحبوبة!',
  },
  {
    id: 'numbers_math',
    title: 'مزرعة الأرقام والعد',
    subtitle: 'عد الأشياء وحل الجمع البسيط',
    icon: '🔢',
    themeColor: '#10B981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    description: 'عد الكتاكيت اللطيفة والفراولة الشهية واجمع الأرقام!',
  },
  {
    id: 'colors_patterns',
    title: 'مختبر الألوان والأنماط',
    subtitle: 'سحر مزج الألوان وتسلسل الأنماط',
    icon: '🎨',
    themeColor: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    description: 'اكتشف ماذا ينتج عن خلط الألوان وأكمل السلاسل الذكية!',
  },
  {
    id: 'memory_quest',
    title: 'تحدي الذاكرة السريعة',
    subtitle: 'اقلب البطاقات وطابق الأزواج',
    icon: '🧠',
    themeColor: '#EC4899',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    description: 'اقلب البطاقات الملونة واعثر على التوائم المتطابقة بأسرع وقت!',
  },
];

export const INITIAL_STICKERS: StickerItem[] = [
  { id: 'st_crown', name: 'التاج الملكي', emoji: '👑', requiredStars: 1, unlocked: false, category: 'magic' },
  { id: 'st_butterfly', name: 'الفراشة البراقة', emoji: '🦋', requiredStars: 2, unlocked: false, category: 'animals' },
  { id: 'st_rocket', name: 'الصاروخ النفاث', emoji: '🚀', requiredStars: 3, unlocked: false, category: 'space' },
  { id: 'st_rainbow', name: 'قوس قزح السعيد', emoji: '🌈', requiredStars: 4, unlocked: false, category: 'magic' },
  { id: 'st_sun', name: 'الشمس المبتسمة', emoji: '☀️', requiredStars: 5, unlocked: false, category: 'magic' },
  { id: 'st_icecream', name: 'مثلجات الفراولة', emoji: '🍦', requiredStars: 6, unlocked: false, category: 'fun' },
  { id: 'st_dino', name: 'ديناصور صغير', emoji: '🦕', requiredStars: 7, unlocked: false, category: 'animals' },
  { id: 'st_gem', name: 'جوهرة الألماس', emoji: '💎', requiredStars: 8, unlocked: false, category: 'magic' },
  { id: 'st_car', name: 'سيارة السباق', emoji: '🏎️', requiredStars: 9, unlocked: false, category: 'fun' },
  { id: 'st_planet', name: 'كوكب زحل', emoji: '🪐', requiredStars: 10, unlocked: false, category: 'space' },
  { id: 'st_lion', name: 'شبل شجاع', emoji: '🦁', requiredStars: 12, unlocked: false, category: 'animals' },
  { id: 'st_trophy', name: 'كأس البطولة', emoji: '🏆', requiredStars: 14, unlocked: false, category: 'magic' },
  { id: 'st_balloon', name: 'بالون الحفلة', emoji: '🎈', requiredStars: 16, unlocked: false, category: 'fun' },
  { id: 'st_astronaut', name: 'رائد الفضاء', emoji: '👨‍🚀', requiredStars: 18, unlocked: false, category: 'space' },
  { id: 'st_magic_wand', name: 'العصا السحرية', emoji: '🪄', requiredStars: 20, unlocked: false, category: 'magic' },
  { id: 'st_unicorn', name: 'المهر الطائر', emoji: '🦄', requiredStars: 22, unlocked: false, category: 'magic' },
];

export const BADGES: BadgeItem[] = [
  {
    id: 'badge_first_star',
    title: 'نجم البداية',
    description: 'أحسنت! حصلت على أول نجمة ذهبية في رحلتك.',
    icon: '⭐',
    requiredCondition: '1 نجمة على الأقل',
    unlocked: false,
  },
  {
    id: 'badge_shadow_hunter',
    title: 'صائد الظلال',
    description: 'أكملت ألغاز الأشكال والظلال بدقة مذهلة!',
    icon: '🕵️',
    requiredCondition: 'حل 3 ألغاز ظلال',
    unlocked: false,
  },
  {
    id: 'badge_letter_master',
    title: 'بطل الحروف',
    description: 'أتقنت الحروف والكلمات العربية الجميلة!',
    icon: '🔤',
    requiredCondition: 'حل 3 ألغاز حروف',
    unlocked: false,
  },
  {
    id: 'badge_number_wizard',
    title: 'عبقري الأرقام',
    description: 'أظهرت مهارة رائعة في العد والجمع السريع!',
    icon: ':// 🔢',
    requiredCondition: 'حل 3 ألغاز أرقام',
    unlocked: false,
  },
  {
    id: 'badge_color_artist',
    title: 'فنان الألوان',
    description: 'فهمت سحر خلط الألوان وإكمال الأنماط ببراعة!',
    icon: '🎨',
    requiredCondition: 'حل 3 ألغاز ألوان',
    unlocked: false,
  },
  {
    id: 'badge_memory_king',
    title: 'ملك الذاكرة الفولاذية',
    description: 'أنهيت تحدي مطابقة بطاقات الذاكرة بنجاح!',
    icon: '🧠',
    requiredCondition: 'إنهاء تحدي الذاكرة',
    unlocked: false,
  },
  {
    id: 'badge_grand_champion',
    title: 'بطل الواحة الذهبي',
    description: 'جمعت أكثر من 18 نجمة وأصبحت البطل الأسطوري!',
    icon: '👑',
    requiredCondition: 'جمع 18 نجمة أو أكثر',
    unlocked: false,
  },
];

export const AVATARS = [
  { id: 'lion', label: 'أسد شجاع', emoji: '🦁' },
  { id: 'bunny', label: 'أرنب مرح', emoji: '🐰' },
  { id: 'panda', label: 'باندا لطيف', emoji: '🐼' },
  { id: 'astronaut', label: 'رائد فضاء', emoji: '🚀' },
  { id: 'cat', label: 'قطة ذكية', emoji: '🐱' },
  { id: 'unicorn', label: 'مهر سحري', emoji: '🦄' },
];

export type GameCategory = 
  | 'shapes_shadows' 
  | 'letters_words' 
  | 'numbers_math' 
  | 'colors_patterns' 
  | 'memory_quest';

export interface BasePuzzle {
  id: string;
  category: GameCategory;
  title: string;
  instruction: string;
  voiceText: string;
  hint: string;
}

export interface ShadowPuzzle extends BasePuzzle {
  category: 'shapes_shadows';
  shadowSvg: string; // SVG path or shape identifier
  options: {
    id: string;
    label: string;
    icon: string;
    svgColor: string;
    isCorrect: boolean;
  }[];
}

export interface LetterPuzzle extends BasePuzzle {
  category: 'letters_words';
  subtype: 'first_letter' | 'word_builder';
  targetWord?: string;
  targetLetter?: string;
  imageEmoji: string;
  imageAlt: string;
  options: {
    id: string;
    letter: string;
    label: string;
    isCorrect: boolean;
  }[];
  // For word_builder
  lettersToArrange?: {
    id: string;
    char: string;
  }[];
  correctWordOrder?: string[];
}

export interface NumberPuzzle extends BasePuzzle {
  category: 'numbers_math';
  subtype: 'count_items' | 'simple_addition' | 'number_sequence';
  items?: {
    emoji: string;
    count: number;
    color: string;
    name: string;
  };
  additionFormula?: {
    leftCount: number;
    leftEmoji: string;
    rightCount: number;
    rightEmoji: string;
  };
  sequence?: (number | null)[];
  options: {
    id: string;
    value: number;
    label: string;
    isCorrect: boolean;
  }[];
}

export interface ColorPatternPuzzle extends BasePuzzle {
  category: 'colors_patterns';
  subtype: 'pattern_sequence' | 'color_mix' | 'odd_one_out';
  patternItems?: {
    emoji: string;
    color: string;
    name: string;
  }[];
  mixInput?: {
    color1: { name: string; hex: string; emoji: string };
    color2: { name: string; hex: string; emoji: string };
  };
  options: {
    id: string;
    emoji: string;
    label: string;
    hexColor?: string;
    isCorrect: boolean;
  }[];
}

export type Puzzle = ShadowPuzzle | LetterPuzzle | NumberPuzzle | ColorPatternPuzzle;

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  requiredStars: number;
  unlocked: boolean;
  category: 'animals' | 'space' | 'magic' | 'fun';
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredCondition: string;
  unlocked: boolean;
}

export interface PlacedSticker {
  instanceId: string;
  stickerId: string;
  emoji: string;
  x: number; // percentage
  y: number; // percentage
  scale: number;
  rotation: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  stars: number;
  completedPuzzleIds: Record<string, number>; // puzzleId -> stars earned (1-3)
  unlockedBadgeIds: string[];
  placedStickers: PlacedSticker[];
  currentBackground: 'meadow' | 'space' | 'fantasy';
  soundEnabled: boolean;
  voiceEnabled: boolean;
  arabicNumerals: boolean;
}

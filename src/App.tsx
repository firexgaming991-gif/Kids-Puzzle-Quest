/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Puzzle, GameCategory, PlacedSticker } from './types/game';
import { PUZZLES } from './data/puzzles';
import { INITIAL_STICKERS, BADGES } from './data/rewards';
import { Navbar } from './components/Navbar';
import { PuzzlesHub } from './components/PuzzlesHub';
import { PuzzleCard } from './components/PuzzleCard';
import { AlphabetNumbersAcademy } from './components/AlphabetNumbersAcademy';
import { MemoryGame } from './components/MemoryGame';
import { StickerCanvas } from './components/StickerCanvas';
import { BadgeShowcase } from './components/BadgeShowcase';
import { ParentalSettingsModal } from './components/ParentalSettingsModal';
import { sound } from './services/soundEngine';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'kids_genius_adventure_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'البطل الصغير',
  avatar: '🦁',
  stars: 0,
  completedPuzzleIds: {},
  unlockedBadgeIds: [],
  placedStickers: [],
  currentBackground: 'meadow',
  soundEnabled: true,
  voiceEnabled: true,
  arabicNumerals: true,
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [currentTab, setCurrentTab] = useState<'hub' | 'puzzle' | 'academy' | 'memory' | 'stickers' | 'trophies'>('hub');
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [unlockedBadgeBanner, setUnlockedBadgeBanner] = useState<string | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage error
    }
  }, [profile]);

  // Sync sound engine settings on init
  useEffect(() => {
    sound.setSoundEnabled(profile.soundEnabled);
    sound.setVoiceEnabled(profile.voiceEnabled);
  }, [profile.soundEnabled, profile.voiceEnabled]);

  // Evaluate badge unlocks
  const evaluateBadges = (updatedProfile: UserProfile) => {
    const currentUnlocked = new Set(updatedProfile.unlockedBadgeIds);
    const newUnlocked: string[] = [];

    // 1. First star
    if (updatedProfile.stars >= 1 && !currentUnlocked.has('badge_first_star')) {
      newUnlocked.push('badge_first_star');
    }

    // 2. Shapes & Shadows (3 solved)
    const shadowSolved = Object.keys(updatedProfile.completedPuzzleIds).filter((id) =>
      id.startsWith('shadow_')
    ).length;
    if (shadowSolved >= 3 && !currentUnlocked.has('badge_shadow_hunter')) {
      newUnlocked.push('badge_shadow_hunter');
    }

    // 3. Letters & Words (3 solved)
    const letterSolved = Object.keys(updatedProfile.completedPuzzleIds).filter(
      (id) => id.startsWith('letter_') || id.startsWith('word_')
    ).length;
    if (letterSolved >= 3 && !currentUnlocked.has('badge_letter_master')) {
      newUnlocked.push('badge_letter_master');
    }

    // 4. Numbers & Math (3 solved)
    const numberSolved = Object.keys(updatedProfile.completedPuzzleIds).filter((id) =>
      id.startsWith('num_')
    ).length;
    if (numberSolved >= 3 && !currentUnlocked.has('badge_number_wizard')) {
      newUnlocked.push('badge_number_wizard');
    }

    // 5. Colors & Patterns (3 solved)
    const colorSolved = Object.keys(updatedProfile.completedPuzzleIds).filter(
      (id) => id.startsWith('pattern_') || id.startsWith('mix_') || id.startsWith('odd_')
    ).length;
    if (colorSolved >= 3 && !currentUnlocked.has('badge_color_artist')) {
      newUnlocked.push('badge_color_artist');
    }

    // 6. Grand champion (18+ stars)
    if (updatedProfile.stars >= 18 && !currentUnlocked.has('badge_grand_champion')) {
      newUnlocked.push('badge_grand_champion');
    }

    if (newUnlocked.length > 0) {
      const merged = [...updatedProfile.unlockedBadgeIds, ...newUnlocked];
      setProfile((prev) => ({ ...prev, unlockedBadgeIds: merged }));

      // Announcement celebration
      const firstBadge = BADGES.find((b) => b.id === newUnlocked[0]);
      if (firstBadge) {
        setUnlockedBadgeBanner(firstBadge.title);
        sound.playFanfare();
        confetti({ particleCount: 100, spread: 70 });
        sound.speakArabic(`مبارك يا بطل! لقد حصلت على وسام ${firstBadge.title}!`);
        setTimeout(() => setUnlockedBadgeBanner(null), 5000);
      }
    }
  };

  // Puzzle Solved Handler
  const handlePuzzleSolve = (puzzleId: string, starsEarned: number) => {
    setProfile((prev) => {
      const oldStars = prev.completedPuzzleIds[puzzleId] || 0;
      // Only add difference if improved
      const starDiff = Math.max(0, starsEarned - oldStars);
      const newTotalStars = prev.stars + starDiff;

      const updated = {
        ...prev,
        stars: newTotalStars,
        completedPuzzleIds: {
          ...prev.completedPuzzleIds,
          [puzzleId]: Math.max(oldStars, starsEarned),
        },
      };

      evaluateBadges(updated);
      return updated;
    });
  };

  // Memory game win handler
  const handleMemoryGameWin = (starsEarned: number) => {
    setProfile((prev) => {
      const newStars = prev.stars + starsEarned;
      const currentBadges = new Set(prev.unlockedBadgeIds);
      const newBadges = [...prev.unlockedBadgeIds];

      if (!currentBadges.has('badge_memory_king')) {
        newBadges.push('badge_memory_king');
        setUnlockedBadgeBanner('ملك الذاكرة الفولاذية');
        sound.speakArabic('مبارك! حصلت على وسام ملك الذاكرة!');
        setTimeout(() => setUnlockedBadgeBanner(null), 5000);
      }

      return {
        ...prev,
        stars: newStars,
        unlockedBadgeIds: newBadges,
      };
    });
  };

  const handleNextPuzzle = () => {
    if (!activePuzzleId) return;
    const currentPz = PUZZLES.find((p) => p.id === activePuzzleId);
    if (!currentPz) {
      setCurrentTab('hub');
      return;
    }
    const categoryPuzzles = PUZZLES.filter((p) => p.category === currentPz.category);
    const catIndex = categoryPuzzles.findIndex((p) => p.id === activePuzzleId);
    if (catIndex !== -1 && catIndex < categoryPuzzles.length - 1) {
      setActivePuzzleId(categoryPuzzles[catIndex + 1].id);
    } else {
      // Completed all stages in this world!
      sound.playFanfare();
      sound.speakArabic('مبارك يا بطل! لقد أكملت جميع مراحل هذا العالم بنجاح باهر!');
      setCurrentTab('hub');
      setActivePuzzleId(null);
    }
  };

  const handleSelectPuzzle = (puzzleId: string) => {
    setActivePuzzleId(puzzleId);
    setCurrentTab('puzzle');
  };

  const handleUpdatePlacedStickers = (stickers: PlacedSticker[]) => {
    setProfile((prev) => ({ ...prev, placedStickers: stickers }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProgress = () => {
    sound.playPop();
    const fresh: UserProfile = {
      ...DEFAULT_PROFILE,
      name: profile.name,
      avatar: profile.avatar,
      soundEnabled: profile.soundEnabled,
      voiceEnabled: profile.voiceEnabled,
      arabicNumerals: profile.arabicNumerals,
    };
    setProfile(fresh);
    setCurrentTab('hub');
    setActivePuzzleId(null);
    sound.speakArabic('تمت إعادة تصفير التقدم، هيا نبدأ المغامرة من جديد!');
  };

  const currentPuzzle = PUZZLES.find((p) => p.id === activePuzzleId);
  const currentCategoryPuzzles = currentPuzzle
    ? PUZZLES.filter((p) => p.category === currentPuzzle.category)
    : [];
  const isLastInWorld = currentPuzzle
    ? currentCategoryPuzzles.findIndex((p) => p.id === currentPuzzle.id) ===
      currentCategoryPuzzles.length - 1
    : false;

  const badgesWithStatus = BADGES.map((b) => ({
    ...b,
    unlocked: profile.unlockedBadgeIds.includes(b.id),
  }));

  return (
    <div className="min-h-screen bg-kids-pattern flex flex-col text-slate-800">
      {/* Universal Top Bar */}
      <Navbar
        currentTab={currentTab === 'puzzle' ? 'hub' : currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setActivePuzzleId(null);
        }}
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Unlocked Badge Pop-in Notification Banner */}
      {unlockedBadgeBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 font-black px-6 py-3 rounded-full shadow-2xl border-2 border-white flex items-center gap-3 animate-bounce">
          <span className="text-2xl">🎖️</span>
          <span>مبارك! لقد فتحت وسام: {unlockedBadgeBanner}!</span>
        </div>
      )}

      {/* Main Game Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {currentTab === 'hub' && (
          <PuzzlesHub
            profile={profile}
            onSelectCategory={(cat: GameCategory) => {
              const categoryPuzzles = PUZZLES.filter((p) => p.category === cat);
              const firstUnsolved =
                categoryPuzzles.find(
                  (p) => profile.completedPuzzleIds[p.id] === undefined
                ) || categoryPuzzles[0];
              if (firstUnsolved) {
                handleSelectPuzzle(firstUnsolved.id);
              }
            }}
            onSelectPuzzle={handleSelectPuzzle}
            onGoToAcademy={() => setCurrentTab('academy')}
            onGoToMemory={() => setCurrentTab('memory')}
            onGoToStickers={() => setCurrentTab('stickers')}
            onGoToTrophies={() => setCurrentTab('trophies')}
          />
        )}

        {currentTab === 'academy' && (
          <AlphabetNumbersAcademy
            onBackToHub={() => setCurrentTab('hub')}
            arabicNumerals={profile.arabicNumerals}
          />
        )}

        {currentTab === 'puzzle' && currentPuzzle && (
          <PuzzleCard
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onNext={handleNextPuzzle}
            onBackToHub={() => {
              setCurrentTab('hub');
              setActivePuzzleId(null);
            }}
            arabicNumerals={profile.arabicNumerals}
            isLastInWorld={isLastInWorld}
          />
        )}

        {currentTab === 'memory' && (
          <MemoryGame
            onWin={handleMemoryGameWin}
            onBackToHub={() => setCurrentTab('hub')}
            arabicNumerals={profile.arabicNumerals}
          />
        )}

        {currentTab === 'stickers' && (
          <StickerCanvas
            totalStars={profile.stars}
            stickers={INITIAL_STICKERS}
            placedStickers={profile.placedStickers}
            onUpdatePlacedStickers={handleUpdatePlacedStickers}
            arabicNumerals={profile.arabicNumerals}
          />
        )}

        {currentTab === 'trophies' && (
          <BadgeShowcase
            badges={badgesWithStatus}
            profile={profile}
            totalPuzzlesSolved={Object.keys(profile.completedPuzzleIds).length}
          />
        )}
      </main>

      {/* Quiet Kid-Friendly Footer */}
      <footer className="w-full border-t border-emerald-100 bg-white/70 py-4 text-center text-xs font-bold text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>مغامرات العباقرة الصغار · لعبة تعليمية تفاعلية للأطفال</span>
          <span className="text-emerald-700">معاً نتعلم ونمرح بذكاء 🌟</span>
        </div>
      </footer>

      {/* Parental & Audio Settings Modal */}
      <ParentalSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}

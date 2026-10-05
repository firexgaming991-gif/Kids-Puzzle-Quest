import React, { useState } from 'react';
import { GameCategory, UserProfile } from '../types/game';
import { CATEGORIES } from '../data/rewards';
import { PUZZLES } from '../data/puzzles';
import { StarRating } from './StarRating';
import { sound } from '../services/soundEngine';

interface PuzzlesHubProps {
  profile: UserProfile;
  onSelectCategory: (category: GameCategory) => void;
  onSelectPuzzle: (puzzleId: string) => void;
  onGoToAcademy: () => void;
  onGoToMemory: () => void;
  onGoToStickers: () => void;
  onGoToTrophies: () => void;
}

export const PuzzlesHub: React.FC<PuzzlesHubProps> = ({
  profile,
  onSelectCategory,
  onSelectPuzzle,
  onGoToAcademy,
  onGoToMemory,
  onGoToStickers,
  onGoToTrophies,
}) => {
  const [modalCategory, setModalCategory] = useState<GameCategory | null>(null);

  const getPuzzlesForCategory = (cat: GameCategory) => {
    return PUZZLES.filter((p) => p.category === cat);
  };

  const getCategoryStats = (cat: GameCategory) => {
    const list = getPuzzlesForCategory(cat);
    const solved = list.filter((p) => profile.completedPuzzleIds[p.id] !== undefined);
    const totalStars = list.reduce(
      (sum, p) => sum + (profile.completedPuzzleIds[p.id] || 0),
      0
    );
    return {
      total: list.length,
      solvedCount: solved.length,
      stars: totalStars,
      maxStars: list.length * 3,
    };
  };

  const formatNumber = (num: number) => {
    return profile.arabicNumerals ? num.toLocaleString('ar-SA') : num.toString();
  };

  const activeCategoryMeta = modalCategory
    ? CATEGORIES.find((c) => c.id === modalCategory)
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3">
      {/* Compact Streamlined Top Banner (No vertical height waste) */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl px-4 py-2.5 text-white shadow-md border border-emerald-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 border border-white/30">
            🦁
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black leading-tight flex items-center gap-1.5">
              <span>مرحباً يا بطلنا {profile.name}!</span>
              <span className="text-xs font-bold text-emerald-100 hidden sm:inline">
                اختر عالماً لبدء التحدي
              </span>
            </h2>
          </div>
        </div>

        {/* Compact Metrics Strip */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 text-xs font-bold">
          <div className="flex items-center gap-1 text-amber-300">
            <span>⭐</span>
            <span className="tabular-nums font-black">{formatNumber(profile.stars)}</span>
            <span className="hidden sm:inline text-white/80">نجمة</span>
          </div>

          <span className="text-white/30">·</span>

          <div className="flex items-center gap-1 text-white">
            <span>🧩</span>
            <span className="tabular-nums font-black">
              {formatNumber(Object.keys(profile.completedPuzzleIds).length)}
            </span>
            <span className="hidden sm:inline text-white/80">محلول</span>
          </div>

          <span className="text-white/30">·</span>

          <button
            type="button"
            onClick={onGoToTrophies}
            className="flex items-center gap-1 text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>🏆</span>
            <span className="tabular-nums font-black">{formatNumber(profile.unlockedBadgeIds.length)}</span>
            <span className="hidden sm:inline text-white/80">وسام</span>
          </button>
        </div>
      </div>

      {/* Main 4 Smart Worlds - Compact 2x2 Grid with Reduced Shrunk Icons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5">
            <span>🗺️</span>
            <span>عوالم الألغاز الذكية</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-500">
            اضغط على أي عالم للعب فوراً
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {CATEGORIES.filter((c) => c.id !== 'memory_quest').map((cat) => {
            const stats = getCategoryStats(cat.id);
            const isCompleted = stats.solvedCount === stats.total;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  sound.playPop();
                  onSelectCategory(cat.id);
                }}
                className={`group relative rounded-2xl border-2 p-3 sm:p-3.5 transition-all duration-150 cursor-pointer hover:shadow-md hover:-translate-y-0.5 select-none ${cat.bgColor} ${cat.borderColor}`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Compact Shrunk Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight">
                        {cat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bold truncate max-w-[200px] sm:max-w-[240px]">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Compact Stats */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[11px] font-bold text-slate-600">
                      {formatNumber(stats.solvedCount)} / {formatNumber(stats.total)}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-black text-xs">
                      <span>⭐</span>
                      <span>{formatNumber(stats.stars)}</span>
                    </div>
                  </div>
                </div>

                {/* Compact Progress Bar */}
                <div className="w-full bg-white/80 rounded-full h-2 overflow-hidden border border-slate-200/80 mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-300"
                    style={{
                      width: `${(stats.solvedCount / Math.max(1, stats.total)) * 100}%`,
                    }}
                  />
                </div>

                {/* Compact Direct Actions Row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playPop();
                      setModalCategory(cat.id);
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>📋</span>
                    <span>المراحل</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playPop();
                      onSelectCategory(cat.id);
                    }}
                    className="btn-tactile-emerald text-white text-xs font-black px-3 py-1 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>🚀</span>
                    <span>{isCompleted ? 'إعادة اللعب' : 'العب الآن'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Compact Shortcut Cards: Academy (New!) + Memory + Stickers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5">
            <span>✨</span>
            <span>الأنشطة الإضافية والتعليمية</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. NEW: Arabic Letters & Numbers Academy Card */}
          <div
            onClick={() => {
              sound.playPop();
              onGoToAcademy();
            }}
            className="group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 hover:border-emerald-500 rounded-2xl p-3 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-2 select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                🔤
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-emerald-950">الحروف والأرقام</h4>
                  <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    جديد
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-bold truncate max-w-[160px]">
                  تعلم الحروف والأرقام بالنطق
                </p>
              </div>
            </div>
            <span className="text-emerald-700 text-sm font-bold shrink-0">⬅️</span>
          </div>

          {/* 2. Memory Challenge Compact Card */}
          <div
            onClick={() => {
              sound.playPop();
              onGoToMemory();
            }}
            className="group bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 hover:border-pink-400 rounded-2xl p-3 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-2 select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                🧠
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-pink-950">تحدي الذاكرة</h4>
                <p className="text-[11px] text-pink-700 font-bold truncate max-w-[160px]">
                  طابق البطاقات الذكية
                </p>
              </div>
            </div>
            <span className="text-pink-600 text-sm font-bold shrink-0">⬅️</span>
          </div>

          {/* 3. Sticker Album Compact Card */}
          <div
            onClick={() => {
              sound.playPop();
              onGoToStickers();
            }}
            className="group bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-3 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-2 select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                🎨
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-950">ألبوم الملصقات</h4>
                <p className="text-[11px] text-amber-800 font-bold truncate max-w-[160px]">
                  زين اللوحات بإبداعك
                </p>
              </div>
            </div>
            <span className="text-amber-700 text-sm font-bold shrink-0">⬅️</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Centered Modal for Stage Selection (Full Viewport Overlay) */}
      {/* ========================================================= */}
      {modalCategory && activeCategoryMeta && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-white rounded-2xl border-2 border-emerald-400 p-4 sm:p-5 max-w-xl w-full shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeCategoryMeta.icon}</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    {activeCategoryMeta.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {activeCategoryMeta.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setModalCategory(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Play Button in Modal */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  const catId = modalCategory;
                  setModalCategory(null);
                  onSelectCategory(catId);
                }}
                className="w-full btn-tactile-emerald text-white font-black py-2.5 px-4 rounded-xl text-sm shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>ابدأ اللعب من المرحلة الحالية فوراً!</span>
              </button>
            </div>

            {/* Stage List Grid */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-500 block mb-1">
                اختر مرحلة معينة للعب:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getPuzzlesForCategory(modalCategory).map((pz, idx) => {
                  const stars = profile.completedPuzzleIds[pz.id];
                  const isSolved = stars !== undefined;

                  return (
                    <button
                      key={pz.id}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setModalCategory(null);
                        onSelectPuzzle(pz.id);
                      }}
                      className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer select-none ${
                        isSolved
                          ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
                          : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          مرحلة {formatNumber(idx + 1)}
                        </span>
                        {isSolved ? (
                          <StarRating stars={stars} size="sm" />
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            جديد ✨
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-slate-800 text-xs sm:text-sm">{pz.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{pz.instruction}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

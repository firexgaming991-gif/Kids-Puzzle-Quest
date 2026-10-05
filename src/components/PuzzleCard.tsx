import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Puzzle, LetterPuzzle } from '../types/game';
import { ShadowShape } from './ShadowShape';
import { StarRating } from './StarRating';
import { sound } from '../services/soundEngine';

interface PuzzleCardProps {
  puzzle: Puzzle;
  onSolve: (puzzleId: string, starsEarned: number) => void;
  onNext: () => void;
  onBackToHub: () => void;
  arabicNumerals: boolean;
  isLastInWorld?: boolean;
}

export const PuzzleCard: React.FC<PuzzleCardProps> = ({
  puzzle,
  onSolve,
  onNext,
  onBackToHub,
  arabicNumerals,
  isLastInWorld = false,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wrongOptionIds, setWrongOptionIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [hintShown, setHintShown] = useState(false);

  // For word_builder subtype
  const [wordBuilderAnswer, setWordBuilderAnswer] = useState<string[]>([]);

  // For interactive counting items
  const [tappedItemIndices, setTappedItemIndices] = useState<number[]>([]);

  // Speak instruction on puzzle change
  useEffect(() => {
    setSelectedOptionId(null);
    setWrongOptionIds([]);
    setAttempts(0);
    setIsSolved(false);
    setEarnedStars(3);
    setHintShown(false);
    setWordBuilderAnswer([]);
    setTappedItemIndices([]);

    const timer = setTimeout(() => {
      sound.speakArabic(puzzle.voiceText);
    }, 350);

    return () => clearTimeout(timer);
  }, [puzzle]);

  // Handle standard option selection
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isSolved || wrongOptionIds.includes(optionId)) return;

    setSelectedOptionId(optionId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      let stars = 3;
      if (newAttempts === 2) stars = 2;
      else if (newAttempts >= 3) stars = 1;

      setEarnedStars(stars);
      setIsSolved(true);
      sound.playSuccess();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });

      const praises = [
        'ممتاز جداً! إجابة رائعة يا بطل!',
        'أحسنت! أنت ذكي للغاية!',
        'عمل رائع ومتقن!',
        'ما شاء الله، إجابة صحيحة!',
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setTimeout(() => sound.speakArabic(randomPraise), 250);

      onSolve(puzzle.id, stars);
    } else {
      sound.playGentleTryAgain();
      setWrongOptionIds((prev) => [...prev, optionId]);
      sound.speakArabic('حاول مرة أخرى يا بطل!');
    }
  };

  // Word builder handler
  const handleWordTileClick = (letter: string, letterPuzzle: LetterPuzzle) => {
    if (isSolved) return;
    sound.playPop();

    const newArr = [...wordBuilderAnswer, letter];
    setWordBuilderAnswer(newArr);

    const targetOrder = letterPuzzle.correctWordOrder || [];
    if (newArr.length === targetOrder.length) {
      const isMatch = newArr.every((ch, i) => ch === targetOrder[i]);
      if (isMatch) {
        let stars = 3;
        if (attempts >= 1) stars = 2;
        setEarnedStars(stars);
        setIsSolved(true);
        sound.playSuccess();
        confetti({ particleCount: 50, spread: 60 });
        sound.speakArabic(`أحسنت! كلمة ${letterPuzzle.targetWord || ''} مكتوبة بامتياز!`);
        onSolve(puzzle.id, stars);
      } else {
        sound.playGentleTryAgain();
        setAttempts((prev) => prev + 1);
        sound.speakArabic('حاول ترتيب الحروف مجدداً يا صديقي!');
        setTimeout(() => setWordBuilderAnswer([]), 800);
      }
    }
  };

  // Counting item tap
  const handleCountItemTap = (idx: number) => {
    sound.playPop();
    if (!tappedItemIndices.includes(idx)) {
      setTappedItemIndices((prev) => [...prev, idx]);
    }
  };

  const formatNumber = (num: number) => {
    return arabicNumerals ? num.toLocaleString('ar-SA') : num.toString();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-emerald-100 shadow-lg overflow-hidden p-3 sm:p-4">
      {/* Top Header Bar - Compact & Clean */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToHub();
          }}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <span>⬅️</span>
          <span>الواحة</span>
        </button>

        <h2 className="text-sm sm:text-base font-black text-slate-800 truncate max-w-[200px] sm:max-w-xs text-center">
          {puzzle.title}
        </h2>

        {/* Read aloud voice button */}
        <button
          type="button"
          onClick={() => sound.speakArabic(puzzle.voiceText)}
          className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          title="استمع للسؤال"
        >
          <span>🔊</span>
          <span className="hidden sm:inline">اقرأ</span>
        </button>
      </div>

      {/* Main Question Instruction - Compact text */}
      <div className="text-center mb-2">
        <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
          {puzzle.instruction}
        </p>
      </div>

      {/* Category Specific Puzzle Canvas (Compact Heights) */}
      <div className="my-2">
        {/* ==================================================== */}
        {/* Category 1: SHAPES & SHADOWS */}
        {/* ==================================================== */}
        {puzzle.category === 'shapes_shadows' && (
          <div className="flex flex-col items-center gap-3">
            {/* The Mystery Shadow Center Stage - Compact */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-slate-300 flex items-center justify-center shadow-inner group">
              <ShadowShape shape={puzzle.shadowSvg} size={80} isShadow={true} />
              <span className="absolute bottom-1 bg-slate-700 text-white text-[10px] px-2 py-0.2 rounded-full font-bold shadow-xs">
                الظل 🔍
              </span>
            </div>

            {/* The 4 Colorful Options - Compact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
              {puzzle.options.map((opt) => {
                const isWrong = wrongOptionIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSolved || isWrong}
                    onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isWrong
                        ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed scale-95'
                        : isSolved && opt.isCorrect
                        ? 'bg-emerald-100 border-emerald-500 scale-102 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xs active:translate-y-0.5'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl mb-1 filter drop-shadow-2xs">
                      {opt.icon}
                    </span>
                    <span className="font-bold text-slate-800 text-xs text-center truncate max-w-full">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* Category 2: LETTERS & PHONICS */}
        {/* ==================================================== */}
        {puzzle.category === 'letters_words' && (
          <div className="flex flex-col items-center gap-2.5">
            {/* Illustrated Emoji Card */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-4xl sm:text-5xl filter drop-shadow-2xs">
                {puzzle.imageEmoji}
              </span>
              <span className="text-[10px] font-bold text-amber-800">{puzzle.imageAlt}</span>
            </div>

            {/* Subtype 1: Pick First Letter */}
            {puzzle.subtype === 'first_letter' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md">
                {puzzle.options.map((opt) => {
                  const isWrong = wrongOptionIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSolved || isWrong}
                      onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border-2 font-black transition-all cursor-pointer ${
                        isWrong
                          ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                          : isSolved && opt.isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-102 shadow-xs'
                          : 'bg-white border-sky-200 hover:border-sky-400 text-sky-800 hover:bg-sky-50 shadow-2xs'
                      }`}
                    >
                      <span className="text-3xl font-['Tajawal'] mb-0.5">
                        {opt.letter}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Subtype 2: Word Builder */}
            {puzzle.subtype === 'word_builder' && (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 min-h-[56px]">
                  {puzzle.correctWordOrder?.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-11 h-11 rounded-lg bg-white border-2 border-dashed border-amber-300 flex items-center justify-center text-2xl font-black text-amber-700 shadow-2xs"
                    >
                      {wordBuilderAnswer[idx] || ''}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  {puzzle.lettersToArrange?.map((tile) => {
                    const isUsed = wordBuilderAnswer.includes(tile.char);
                    return (
                      <button
                        key={tile.id}
                        type="button"
                        disabled={isSolved || isUsed}
                        onClick={() => handleWordTileClick(tile.char, puzzle as LetterPuzzle)}
                        className={`w-12 h-12 rounded-xl text-2xl font-black shadow-xs border-b-3 transition-all cursor-pointer ${
                          isUsed
                            ? 'opacity-30 bg-slate-200 border-slate-300 cursor-not-allowed'
                            : 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-600 active:translate-y-0.5'
                        }`}
                      >
                        {tile.char}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* Category 3: NUMBERS & MATH */}
        {/* ==================================================== */}
        {puzzle.category === 'numbers_math' && (
          <div className="flex flex-col items-center gap-3">
            {/* Subtype 1: Interactive Count Items */}
            {puzzle.subtype === 'count_items' && puzzle.items && (
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 w-full flex flex-wrap items-center justify-center gap-2 min-h-[70px]">
                  {Array.from({ length: puzzle.items.count }).map((_, idx) => {
                    const isTapped = tappedItemIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCountItemTap(idx)}
                        className={`relative text-3xl sm:text-4xl p-1.5 rounded-xl transition-transform cursor-pointer ${
                          isTapped
                            ? 'scale-105 bg-white shadow-xs border border-emerald-400'
                            : 'hover:scale-105'
                        }`}
                      >
                        {puzzle.items?.emoji}
                        {isTapped && (
                          <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                            {formatNumber(tappedItemIndices.indexOf(idx) + 1)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md">
                  {puzzle.options.map((opt) => {
                    const isWrong = wrongOptionIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSolved || isWrong}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        className={`p-2 rounded-xl border-2 font-black transition-all cursor-pointer text-center ${
                          isWrong
                            ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSolved && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-102 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-2xs'
                        }`}
                      >
                        <span className="text-xl block">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subtype 2: Simple Addition */}
            {puzzle.subtype === 'simple_addition' && puzzle.additionFormula && (
              <div className="flex flex-col items-center gap-2.5 w-full">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-center gap-2 text-xl font-black text-slate-800">
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-amber-300">
                    <span>{puzzle.additionFormula.leftEmoji.repeat(puzzle.additionFormula.leftCount)}</span>
                    <span className="text-amber-800 text-xs">
                      ({formatNumber(puzzle.additionFormula.leftCount)})
                    </span>
                  </div>

                  <span className="text-amber-600 text-xl font-black">+</span>

                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-amber-300">
                    <span>{puzzle.additionFormula.rightEmoji.repeat(puzzle.additionFormula.rightCount)}</span>
                    <span className="text-amber-800 text-xs">
                      ({formatNumber(puzzle.additionFormula.rightCount)})
                    </span>
                  </div>

                  <span className="text-amber-600 text-xl font-black">=</span>

                  <div className="w-9 h-9 rounded-xl bg-amber-200 border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-900 font-black text-sm">
                    ؟
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {puzzle.options.map((opt) => {
                    const isWrong = wrongOptionIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSolved || isWrong}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        className={`p-2 rounded-xl border-2 font-black transition-all cursor-pointer text-center ${
                          isWrong
                            ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSolved && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                            : 'bg-white border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <span className="text-lg block">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subtype 3: Number Sequence */}
            {puzzle.subtype === 'number_sequence' && puzzle.sequence && (
              <div className="flex flex-col items-center gap-2.5 w-full">
                <div className="flex items-center gap-2 p-2.5 bg-sky-50 rounded-2xl border border-sky-200">
                  {puzzle.sequence.map((num, i) => (
                    <div
                      key={i}
                      className={`w-11 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-2xs ${
                        num === null
                          ? 'bg-amber-200 border-2 border-dashed border-amber-500 text-amber-900'
                          : 'bg-white border border-sky-300 text-sky-800'
                      }`}
                    >
                      {num === null ? '؟' : formatNumber(num)}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {puzzle.options.map((opt) => {
                    const isWrong = wrongOptionIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSolved || isWrong}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        className={`p-2 rounded-xl border-2 font-black transition-all cursor-pointer text-center ${
                          isWrong
                            ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSolved && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                            : 'bg-white border-slate-200 hover:border-sky-400'
                        }`}
                      >
                        <span className="text-lg block">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* Category 4: COLORS & PATTERNS */}
        {/* ==================================================== */}
        {puzzle.category === 'colors_patterns' && (
          <div className="flex flex-col items-center gap-3">
            {/* Subtype 1: Pattern Sequence */}
            {puzzle.subtype === 'pattern_sequence' && puzzle.patternItems && (
              <div className="flex flex-col items-center gap-2.5 w-full">
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-2xl border border-slate-200">
                  {puzzle.patternItems.map((item, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-2xs"
                    >
                      {item.emoji}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl bg-amber-200 border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-900 font-black text-sm">
                    ؟
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {puzzle.options.map((opt) => {
                    const isWrong = wrongOptionIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSolved || isWrong}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isWrong
                            ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSolved && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500'
                            : 'bg-white border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <span className="text-2xl mb-0.5">{opt.emoji}</span>
                        <span className="text-[11px] font-bold text-slate-700">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subtype 2: Color Mix */}
            {puzzle.subtype === 'color_mix' && puzzle.mixInput && (
              <div className="flex flex-col items-center gap-2.5 w-full">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    <span className="text-xl">{puzzle.mixInput.color1.emoji}</span>
                    <span className="text-xs font-bold">{puzzle.mixInput.color1.name}</span>
                  </div>

                  <span className="text-slate-500 font-black">+</span>

                  <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    <span className="text-xl">{puzzle.mixInput.color2.emoji}</span>
                    <span className="text-xs font-bold">{puzzle.mixInput.color2.name}</span>
                  </div>

                  <span className="text-slate-500 font-black">=</span>

                  <div className="w-9 h-9 rounded-xl bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-800 font-black text-xs">
                    ؟
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {puzzle.options.map((opt) => {
                    const isWrong = wrongOptionIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSolved || isWrong}
                        onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                        className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isWrong
                            ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSolved && opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-500'
                            : 'bg-white border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <span className="text-2xl mb-0.5">{opt.emoji}</span>
                        <span className="text-[11px] font-bold text-slate-700">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subtype 3: Odd One Out */}
            {puzzle.subtype === 'odd_one_out' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md">
                {puzzle.options.map((opt) => {
                  const isWrong = wrongOptionIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSolved || isWrong}
                      onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isWrong
                          ? 'opacity-35 bg-slate-100 border-slate-200 cursor-not-allowed'
                          : isSolved && opt.isCorrect
                          ? 'bg-emerald-100 border-emerald-500'
                          : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-3xl mb-1">{opt.emoji}</span>
                      <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint strip - compact */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setHintShown(!hintShown);
            if (!hintShown) sound.speakArabic(`تلميح: ${puzzle.hint}`);
          }}
          className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
        >
          <span>💡</span>
          <span>{hintShown ? 'إخفاء' : 'تلميح'}</span>
        </button>

        {hintShown && (
          <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-1 rounded-lg animate-fade-in">
            {puzzle.hint}
          </span>
        )}
      </div>

      {/* ==================================================== */}
      {/* VICTORY CELEBRATION MODAL OVERLAY */}
      {/* ==================================================== */}
      {isSolved && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-fade-in z-30">
          <div className="text-4xl mb-1 animate-bounce">🎉</div>
          <h3 className="text-xl font-black text-emerald-700 mb-1">
            رائع يا بطل! أحسنت!
          </h3>
          <p className="text-slate-600 text-xs font-bold mb-3">
            لقد قمت بحل هذا اللغز بنجاح وذكاء باهر!
          </p>

          {/* Stars Earned */}
          <div className="mb-4 flex flex-col items-center gap-0.5">
            <span className="text-[11px] font-bold text-slate-500">النجوم المكتسبة:</span>
            <StarRating stars={earnedStars} size="md" animated={true} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onNext();
              }}
              className="w-full btn-tactile-emerald text-white font-black py-2.5 px-4 rounded-xl text-sm shadow-md cursor-pointer"
            >
              {isLastInWorld ? 'أكملت هذا العالم! 🏆' : 'اللغز التالي 🚀'}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onBackToHub();
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              العودة للواحة 🏡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

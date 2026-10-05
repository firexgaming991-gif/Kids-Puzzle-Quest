import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundEngine';
import { StarRating } from './StarRating';

interface CardItem {
  id: number;
  pairId: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_ITEMS = [
  { pairId: 'lion', emoji: '🦁', name: 'أسد' },
  { pairId: 'panda', emoji: '🐼', name: 'باندا' },
  { pairId: 'bunny', emoji: '🐰', name: 'أرنب' },
  { pairId: 'rocket', emoji: '🚀', name: 'صاروخ' },
  { pairId: 'rainbow', emoji: '🌈', name: 'قوس قزح' },
  { pairId: 'icecream', emoji: '🍦', name: 'مثلجات' },
  { pairId: 'strawberry', emoji: '🍓', name: 'فراولة' },
  { pairId: 'star', emoji: '⭐', name: 'نجمة' },
];

interface MemoryGameProps {
  onWin: (stars: number) => void;
  onBackToHub: () => void;
  arabicNumerals: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onWin,
  onBackToHub,
  arabicNumerals,
}) => {
  const [difficulty, setDifficulty] = useState<4 | 6>(4);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = (pairCount: 4 | 6) => {
    const selectedPairs = MEMORY_ITEMS.slice(0, pairCount);
    const deck: CardItem[] = [];

    selectedPairs.forEach((item, index) => {
      deck.push({
        id: index * 2,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: index * 2 + 1,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCardIds([]);
    setMoves(0);
    setIsGameOver(false);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty]);

  const handleCardClick = (id: number) => {
    if (isLocked) return;

    const clickedCard = cards.find((c) => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playCardFlip();

    const newCards = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCardIds, id];
    setFlippedCardIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((prev) => prev + 1);

      const firstCard = cards.find((c) => c.id === newFlipped[0]);
      const secondCard = clickedCard;

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          sound.playSuccess();
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCardIds([]);
          setIsLocked(false);

          const remainingUnmatched = newCards.filter(
            (c) => !c.isMatched && c.pairId !== firstCard.pairId
          );
          if (remainingUnmatched.length === 0) {
            handleVictory();
          }
        }, 400);
      } else {
        setTimeout(() => {
          sound.playGentleTryAgain();
          setCards((prev) =>
            prev.map((c) => (newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c))
          );
          setFlippedCardIds([]);
          setIsLocked(false);
        }, 750);
      }
    }
  };

  const handleVictory = () => {
    setIsGameOver(true);
    sound.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
    });

    const stars = moves <= difficulty + 2 ? 3 : moves <= difficulty + 5 ? 2 : 1;
    sound.speakArabic('يا لك من عبقري! ذاكرتك قوية جداً ورائعة!');
    onWin(stars);
  };

  const formatNumber = (num: number) => {
    return arabicNumerals ? num.toLocaleString('ar-SA') : num.toString();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-pink-200 shadow-lg p-3 sm:p-4">
      {/* Header controls - Compact */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-pink-100">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToHub();
          }}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer"
        >
          <span>⬅️</span>
          <span>الواحة</span>
        </button>

        <div className="text-center">
          <h2 className="text-sm sm:text-base font-black text-pink-600">
            تحدي الذاكرة 🧠
          </h2>
          <span className="text-[11px] font-bold text-slate-500">
            الحركات: {formatNumber(moves)}
          </span>
        </div>

        {/* Difficulty Switcher */}
        <div className="flex items-center gap-1 bg-pink-50 p-0.5 rounded-lg border border-pink-200">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setDifficulty(4);
            }}
            className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer transition-colors ${
              difficulty === 4
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'text-pink-800 hover:bg-pink-100'
            }`}
          >
            ٨ كروت
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setDifficulty(6);
            }}
            className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer transition-colors ${
              difficulty === 6
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'text-pink-800 hover:bg-pink-100'
            }`}
          >
            ١٢ كرت
          </button>
        </div>
      </div>

      {/* Card Grid - Compact */}
      <div
        className={`grid gap-2 max-w-lg mx-auto my-2 ${
          difficulty === 4 ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'
        }`}
      >
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={showFace || isLocked}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1.5 text-center transition-all duration-200 select-none cursor-pointer ${
                card.isMatched
                  ? 'bg-emerald-50 border-2 border-emerald-400 scale-95 opacity-90 shadow-2xs'
                  : showFace
                  ? 'bg-white border-2 border-pink-400 scale-100 shadow-xs'
                  : 'bg-gradient-to-br from-pink-400 to-rose-400 border-2 border-pink-500 hover:scale-102 hover:shadow-xs active:scale-95 text-white'
              }`}
            >
              {showFace ? (
                <>
                  <span className="text-2xl sm:text-3xl filter drop-shadow-2xs">
                    {card.emoji}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-full">
                    {card.name}
                  </span>
                </>
              ) : (
                <span className="text-xl opacity-90">❓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory modal */}
      {isGameOver && (
        <div className="mt-3 bg-pink-50 border-2 border-pink-300 rounded-xl p-3 text-center animate-fade-in flex flex-col items-center gap-1.5">
          <span className="text-3xl">🎉</span>
          <h3 className="text-base font-black text-pink-700">مبروك يا ذكي!</h3>
          <p className="text-xs text-slate-600 font-bold">
            أنهيت التحدي في {formatNumber(moves)} حركة فقط!
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => initializeGame(difficulty)}
              className="btn-tactile-emerald text-white text-xs font-black px-3 py-1.5 rounded-lg cursor-pointer"
            >
              العب مجدداً 🔄
            </button>
            <button
              type="button"
              onClick={onBackToHub}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              العودة للواحة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

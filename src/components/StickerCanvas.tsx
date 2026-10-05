import React, { useState, useRef } from 'react';
import { StickerItem, PlacedSticker } from '../types/game';
import { ASSETS } from '../assets/images';
import { sound } from '../services/soundEngine';
import confetti from 'canvas-confetti';

interface StickerCanvasProps {
  totalStars: number;
  stickers: StickerItem[];
  placedStickers: PlacedSticker[];
  onUpdatePlacedStickers: (stickers: PlacedSticker[]) => void;
  arabicNumerals: boolean;
}

export const StickerCanvas: React.FC<StickerCanvasProps> = ({
  totalStars,
  stickers,
  placedStickers,
  onUpdatePlacedStickers,
  arabicNumerals,
}) => {
  const [background, setBackground] = useState<'meadow' | 'space' | 'fantasy'>('meadow');
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Background map
  const bgMap = {
    meadow: ASSETS.bgStickerMeadow,
    space: ASSETS.bgStickerSpace,
    fantasy: ASSETS.bgFantasyLand,
  };

  const handleAddSticker = (sticker: StickerItem) => {
    if (totalStars < sticker.requiredStars) {
      sound.playGentleTryAgain();
      sound.speakArabic(`هذا الملصق مقفل، اجمع ${sticker.requiredStars} نجمة لفتحه!`);
      return;
    }

    sound.playStickerStamp();

    // Randomize initial center position slightly
    const offset = (Math.random() - 0.5) * 20;
    const newSticker: PlacedSticker = {
      instanceId: `inst_${Date.now()}_${Math.random()}`,
      stickerId: sticker.id,
      emoji: sticker.emoji,
      x: 50 + offset,
      y: 50 + offset,
      scale: 1,
      rotation: 0,
    };

    onUpdatePlacedStickers([...placedStickers, newSticker]);
    setSelectedInstanceId(newSticker.instanceId);
  };

  const handleSelectPlaced = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation();
    sound.playPop();
    setSelectedInstanceId(instanceId);
  };

  const handleRotateSelected = () => {
    if (!selectedInstanceId) return;
    sound.playPop();
    onUpdatePlacedStickers(
      placedStickers.map((s) =>
        s.instanceId === selectedInstanceId
          ? { ...s, rotation: (s.rotation + 30) % 360 }
          : s
      )
    );
  };

  const handleScaleSelected = (delta: number) => {
    if (!selectedInstanceId) return;
    sound.playPop();
    onUpdatePlacedStickers(
      placedStickers.map((s) =>
        s.instanceId === selectedInstanceId
          ? { ...s, scale: Math.max(0.6, Math.min(2.5, s.scale + delta)) }
          : s
      )
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedInstanceId) return;
    sound.playPop();
    onUpdatePlacedStickers(
      placedStickers.filter((s) => s.instanceId !== selectedInstanceId)
    );
    setSelectedInstanceId(null);
  };

  const handleClearAll = () => {
    if (placedStickers.length === 0) return;
    sound.playPop();
    onUpdatePlacedStickers([]);
    setSelectedInstanceId(null);
  };

  const handleSaveArtwork = () => {
    sound.playFanfare();
    confetti({
      particleCount: 70,
      spread: 60,
    });
    sound.speakArabic('يا لها من لوحة فنية ساحرة! أنت فنان مبدع يا بطل!');
  };

  // Dragging support on canvas
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !selectedInstanceId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onUpdatePlacedStickers(
      placedStickers.map((s) =>
        s.instanceId === selectedInstanceId
          ? { ...s, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
          : s
      )
    );
  };

  const unlockedCount = stickers.filter((s) => totalStars >= s.requiredStars).length;

  const formatNumber = (num: number) => {
    return arabicNumerals ? num.toLocaleString('ar-SA') : num.toString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Bar for Sticker Board */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-4 sm:p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-700 flex items-center gap-2">
            <span>🎨</span>
            <span>لوحة ملصقاتي الإبداعية</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
            الملصقات المفتوحة: {formatNumber(unlockedCount)} من {formatNumber(stickers.length)} ملصق
          </p>
        </div>

        {/* Scene Switcher */}
        <div className="flex items-center gap-2 bg-amber-50 p-1.5 rounded-2xl border border-amber-200">
          <span className="text-xs font-bold text-amber-900 px-2 hidden sm:inline">الخلفية:</span>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setBackground('meadow');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              background === 'meadow'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            🌸 المرج الأخضر
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setBackground('space');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              background === 'space'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            🪐 الفضاء الكوني
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setBackground('fantasy');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              background === 'fantasy'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            🏰 قصر الخيال
          </button>
        </div>
      </div>

      {/* The Interactive Scenic Canvas */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
        <div
          ref={canvasRef}
          onClick={() => setSelectedInstanceId(null)}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] bg-cover bg-center select-none overflow-hidden cursor-crosshair"
          style={{
            backgroundImage: `url(${bgMap[background]})`,
          }}
        >
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

          {/* Prompt if empty */}
          {placedStickers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border-2 border-amber-300 shadow-lg animate-float">
                <span className="text-3xl block mb-1">👆</span>
                <p className="text-base sm:text-lg font-black text-amber-900">
                  اختر ملصقاً من الأسفل والصقه هنا!
                </p>
                <span className="text-xs font-bold text-amber-700">
                  يمكنك تحريكه وتكبيره وتدويره كما تحب
                </span>
              </div>
            </div>
          )}

          {/* Placed Stickers */}
          {placedStickers.map((st) => {
            const isSelected = st.instanceId === selectedInstanceId;
            return (
              <div
                key={st.instanceId}
                draggable
                onDragStart={() => setSelectedInstanceId(st.instanceId)}
                onClick={(e) => handleSelectPlaced(e, st.instanceId)}
                style={{
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  transform: `translate(-50%, -50%) rotate(${st.rotation}deg) scale(${st.scale})`,
                }}
                className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-75 select-none ${
                  isSelected
                    ? 'p-2 ring-4 ring-amber-400 ring-offset-2 rounded-2xl bg-white/20'
                    : 'hover:scale-110'
                }`}
              >
                <span className="text-5xl sm:text-6xl md:text-7xl filter drop-shadow-lg block pointer-events-none">
                  {st.emoji}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating Canvas Action Toolbar */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          {/* Selected sticker manipulation tools */}
          {selectedInstanceId ? (
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-lg animate-fade-in">
              <button
                type="button"
                onClick={handleRotateSelected}
                title="تدوير الملصق"
                className="p-1.5 rounded-xl hover:bg-amber-100 text-amber-800 text-sm font-bold flex items-center gap-1 cursor-pointer"
              >
                🔄 تدوير
              </button>
              <button
                type="button"
                onClick={() => handleScaleSelected(0.2)}
                title="تكبير"
                className="p-1.5 rounded-xl hover:bg-amber-100 text-amber-800 text-sm font-bold cursor-pointer"
              >
                ➕ تكبير
              </button>
              <button
                type="button"
                onClick={() => handleScaleSelected(-0.2)}
                title="تصغير"
                className="p-1.5 rounded-xl hover:bg-amber-100 text-amber-800 text-sm font-bold cursor-pointer"
              >
                ➖ تصغير
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                title="حذف هذا الملصق"
                className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 text-sm font-bold cursor-pointer"
              >
                🗑️ حذف
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* General Canvas Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={placedStickers.length === 0}
              className="bg-white/90 hover:bg-white text-slate-700 font-bold px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 shadow-md cursor-pointer disabled:opacity-50"
            >
              مسح اللوحة 🧹
            </button>
            <button
              type="button"
              onClick={handleSaveArtwork}
              className="btn-tactile-emerald text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md cursor-pointer"
            >
              حفظ لوحتي الساحرة 🌟
            </button>
          </div>
        </div>
      </div>

      {/* Stickers Showcase Tray */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-4 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-800">
            ألبوم الملصقات المتاحة (اضغط للصقها في اللوحة):
          </h3>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            مجموع نجومك: {formatNumber(totalStars)} ⭐
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {stickers.map((st) => {
            const isUnlocked = totalStars >= st.requiredStars;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleAddSticker(st)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all select-none cursor-pointer ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400 hover:scale-105 active:scale-95 shadow-xs'
                    : 'bg-slate-100 border-slate-200 opacity-60 hover:opacity-80'
                }`}
              >
                <span className="text-4xl sm:text-5xl mb-1 filter drop-shadow">
                  {st.emoji}
                </span>
                <span className="text-[11px] font-bold text-slate-700 truncate max-w-full">
                  {st.name}
                </span>

                {/* Locked overlay badge */}
                {!isUnlocked && (
                  <span className="absolute top-1 left-1 bg-slate-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                    🔒 {formatNumber(st.requiredStars)}⭐
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

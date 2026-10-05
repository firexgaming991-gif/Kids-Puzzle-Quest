import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ARABIC_LETTERS, ARABIC_NUMBERS, ArabicLetter, ArabicNumberItem } from '../data/alphabetNumbers';
import { sound } from '../services/soundEngine';

interface AcademyProps {
  onBackToHub: () => void;
  arabicNumerals: boolean;
}

export const AlphabetNumbersAcademy: React.FC<AcademyProps> = ({
  onBackToHub,
  arabicNumerals,
}) => {
  const [section, setSection] = useState<'letters' | 'numbers'>('letters');
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter>(ARABIC_LETTERS[0]);
  const [selectedNumber, setSelectedNumber] = useState<ArabicNumberItem>(ARABIC_NUMBERS[0]);
  
  // Interactive tapped items counter in Numbers mode
  const [tappedItemCount, setTappedItemCount] = useState<number>(0);
  // Practice quiz mode
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);

  // Reset interactive count when number changes
  useEffect(() => {
    setTappedItemCount(0);
  }, [selectedNumber]);

  // Audio pronunciation on selection
  const handleSelectLetter = (letter: ArabicLetter) => {
    setSelectedLetter(letter);
    sound.playPop();
    sound.speakArabic(`حرف ${letter.name}. ${letter.wordTashkeel}.`);
  };

  const handleSelectNumber = (item: ArabicNumberItem) => {
    setSelectedNumber(item);
    setTappedItemCount(0);
    sound.playPop();
    sound.speakArabic(`الرقم ${item.nameArabic}. ${item.funFact}`);
  };

  const handlePronounceHaraka = (harakaText: string, soundDesc: string) => {
    sound.playPop();
    sound.speakArabic(`${harakaText}. صوت ${soundDesc}`);
  };

  const handleTapCounterItem = (index: number) => {
    sound.playPop();
    const newCount = Math.min(selectedNumber.number, Math.max(tappedItemCount, index + 1));
    setTappedItemCount(newCount);
    
    const countNumberArabic = arabicNumerals
      ? (index + 1).toLocaleString('ar-SA')
      : (index + 1).toString();
    sound.speakArabic(countNumberArabic);

    if (newCount === selectedNumber.number) {
      sound.playSuccess();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      sound.speakArabic(`أحسنت! قمت بعدّ جميع الـ ${selectedNumber.itemName} بنجاح!`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3">
      {/* Compact Top Header Bar */}
      <div className="flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-emerald-100 shadow-xs">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToHub();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <span>⬅️</span>
          <span>الواحة</span>
        </button>

        {/* Compact Segmented Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setSection('letters');
            }}
            className={`px-3 py-1 text-xs sm:text-sm font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              section === 'letters'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🔤</span>
            <span>الحروف العربية</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setSection('numbers');
            }}
            className={`px-3 py-1 text-xs sm:text-sm font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              section === 'numbers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🔢</span>
            <span>الأرقام والعد</span>
          </button>
        </div>

        {/* Read aloud voice shortcut */}
        <button
          type="button"
          onClick={() => {
            if (section === 'letters') {
              sound.speakArabic(`حرف ${selectedLetter.name}. نلفظه: ${selectedLetter.wordTashkeel}. ${selectedLetter.sentence}`);
            } else {
              sound.speakArabic(`العدد ${selectedNumber.nameArabic}. ${selectedNumber.funFact}`);
            }
          }}
          className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          title="استمع للنطق"
        >
          <span>🔊</span>
          <span className="hidden sm:inline">نطق</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. ARABIC LETTERS SECTION (Compact Viewport Fitted) */}
      {/* ========================================================= */}
      {section === 'letters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Left Column: Compact Alphabet Selector Grid (28 Letters) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-700">اختر حرفاً للاستكشاف ({ARABIC_LETTERS.length})</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                اضغط لسماع النطق
              </span>
            </div>

            {/* 7 columns x 4 rows compact letter grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {ARABIC_LETTERS.map((letter) => {
                const isSelected = selectedLetter.id === letter.id;
                return (
                  <button
                    key={letter.id}
                    type="button"
                    onClick={() => handleSelectLetter(letter)}
                    className={`aspect-square rounded-xl font-black transition-all flex flex-col items-center justify-center cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 scale-105 shadow-sm'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="text-lg sm:text-xl leading-none font-['Tajawal']">{letter.char}</span>
                    <span className="text-[9px] opacity-75 leading-none mt-0.5">{letter.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Letter Deep-Dive Showcase Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-emerald-200 p-4 shadow-sm flex flex-col gap-3">
            {/* Main Letter & Word Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl font-black border border-white/30">
                  {selectedLetter.char}
                </div>
                <div>
                  <h3 className="text-xl font-black">حرف {selectedLetter.name}</h3>
                  <p className="text-xs text-emerald-100 font-bold">{selectedLetter.sentence}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => sound.speakArabic(`حرف ${selectedLetter.name}. ${selectedLetter.wordTashkeel}`)}
                className="w-9 h-9 rounded-xl bg-white/25 hover:bg-white/40 flex items-center justify-center text-base cursor-pointer transition-colors"
                title="استمع"
              >
                🔊
              </button>
            </div>

            {/* Word and Emoji Example */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-xs">{selectedLetter.emoji}</span>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 block">مثال بالكلمة:</span>
                  <span className="text-lg font-black text-amber-950 font-['Tajawal']">
                    {selectedLetter.wordTashkeel}
                  </span>
                </div>
              </div>

              <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-200 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-sky-700 block">المعنى والشكل:</span>
                <span className="text-xs font-bold text-sky-950">
                  يبدأ بحرف ({selectedLetter.char}) المفتوح
                </span>
              </div>
            </div>

            {/* Harakat Row (Diacritics: Fatha, Damma, Kasra, Sukoon) */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <span className="text-xs font-black text-slate-700 block mb-1.5">
                أصوات الحرف مع الحركات القصيرة:
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handlePronounceHaraka(selectedLetter.harakat.fatha, 'الفَتحَة')}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 p-2 rounded-lg text-center cursor-pointer transition-all"
                >
                  <span className="block text-xl font-black text-emerald-700">{selectedLetter.harakat.fatha}</span>
                  <span className="text-[10px] font-bold text-slate-500">فَتحَة َ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePronounceHaraka(selectedLetter.harakat.damma, 'الضَّمَّة')}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 p-2 rounded-lg text-center cursor-pointer transition-all"
                >
                  <span className="block text-xl font-black text-amber-600">{selectedLetter.harakat.damma}</span>
                  <span className="text-[10px] font-bold text-slate-500">ضَمَّة ُ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePronounceHaraka(selectedLetter.harakat.kasra, 'الكَسرَة')}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 p-2 rounded-lg text-center cursor-pointer transition-all"
                >
                  <span className="block text-xl font-black text-sky-600">{selectedLetter.harakat.kasra}</span>
                  <span className="text-[10px] font-bold text-slate-500">كَسرَة ِ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePronounceHaraka(selectedLetter.harakat.sukoon, 'السُّكُون')}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 p-2 rounded-lg text-center cursor-pointer transition-all"
                >
                  <span className="block text-xl font-black text-purple-600">{selectedLetter.harakat.sukoon}</span>
                  <span className="text-[10px] font-bold text-slate-500">سُكُون ْ</span>
                </button>
              </div>
            </div>

            {/* Letter Shapes in Word: Isolated, Initial, Medial, Final */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
              <span className="text-xs font-black text-slate-700 block mb-1.5">
                أشكال الحرف في الكلمة:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                  <span className="text-base font-black text-slate-800">{selectedLetter.shapes.isolated}</span>
                  <span className="block text-[9px] text-slate-500 font-bold">منفصل</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                  <span className="text-base font-black text-slate-800">{selectedLetter.shapes.initial}</span>
                  <span className="block text-[9px] text-slate-500 font-bold">أول الكلمة</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                  <span className="text-base font-black text-slate-800">{selectedLetter.shapes.medial}</span>
                  <span className="block text-[9px] text-slate-500 font-bold">وسط الكلمة</span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                  <span className="text-base font-black text-slate-800">{selectedLetter.shapes.final}</span>
                  <span className="block text-[9px] text-slate-500 font-bold">آخر الكلمة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ARABIC NUMBERS SECTION (Compact Viewport Fitted) */}
      {/* ========================================================= */}
      {section === 'numbers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Left Column: Number Selector Pills (1 to 20) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-700">اختر رقماً (١ إلى ٢٠)</span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                اضغط للعد والتفاعل
              </span>
            </div>

            {/* 5 columns x 4 rows compact number selector */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {ARABIC_NUMBERS.map((numItem) => {
                const isSelected = selectedNumber.number === numItem.number;
                return (
                  <button
                    key={numItem.number}
                    type="button"
                    onClick={() => handleSelectNumber(numItem)}
                    className={`aspect-square rounded-xl font-black transition-all flex flex-col items-center justify-center cursor-pointer select-none border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-sm'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-lg sm:text-xl leading-none">
                      {arabicNumerals ? numItem.arabicNumeral : numItem.number}
                    </span>
                    <span className="text-[9px] opacity-80 leading-none mt-0.5">
                      {arabicNumerals ? numItem.number : numItem.arabicNumeral}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Number Showcase & Interactive Tap-To-Count Board */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm flex flex-col gap-3">
            {/* Header with Number name and audio */}
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl font-black border border-white/30">
                  {arabicNumerals ? selectedNumber.arabicNumeral : selectedNumber.number}
                </div>
                <div>
                  <h3 className="text-xl font-black">العدد {selectedNumber.nameArabic}</h3>
                  <p className="text-xs text-amber-100 font-bold">{selectedNumber.funFact}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => sound.speakArabic(`العدد ${selectedNumber.nameArabic}. ${selectedNumber.funFact}`)}
                className="w-9 h-9 rounded-xl bg-white/25 hover:bg-white/40 flex items-center justify-center text-base cursor-pointer transition-colors"
                title="استمع"
              >
                🔊
              </button>
            </div>

            {/* Interactive Counting Board */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-950">لوحة العد التفاعلي:</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    المعدود: {arabicNumerals ? tappedItemCount.toLocaleString('ar-SA') : tappedItemCount} من {arabicNumerals ? selectedNumber.arabicNumeral : selectedNumber.number}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setTappedItemCount(0);
                  }}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer"
                >
                  إعادة العد 🔄
                </button>
              </div>

              {/* Items grid for tapping */}
              <div className="flex flex-wrap items-center justify-center gap-2 min-h-[90px] p-2 bg-white rounded-lg border border-amber-100">
                {Array.from({ length: selectedNumber.number }).map((_, idx) => {
                  const isTapped = idx < tappedItemCount;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTapCounterItem(idx)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer relative ${
                        isTapped
                          ? 'bg-amber-100 border-2 border-amber-500 scale-105 shadow-xs'
                          : 'bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:scale-105'
                      }`}
                      title={`اضغط لعد العنصر ${idx + 1}`}
                    >
                      <span>{selectedNumber.emoji}</span>
                      {isTapped && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                          {arabicNumerals ? (idx + 1).toLocaleString('ar-SA') : idx + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-center text-amber-800 font-bold mt-2">
                👆 اضغط على كل {selectedNumber.emoji} لحسابه ونطقه بصوت عالي!
              </p>
            </div>

            {/* Quick Math Comparison Note */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-700">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span>الرقم السابق: </span>
                <span className="font-black text-amber-700">
                  {selectedNumber.number > 1
                    ? arabicNumerals
                      ? (selectedNumber.number - 1).toLocaleString('ar-SA')
                      : selectedNumber.number - 1
                    : 'لا يوجد (الأول)'}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span>الرقم التالي: </span>
                <span className="font-black text-emerald-700">
                  {selectedNumber.number < 20
                    ? arabicNumerals
                      ? (selectedNumber.number + 1).toLocaleString('ar-SA')
                      : selectedNumber.number + 1
                    : '٢٠ (الأخير)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ASSETS } from '../assets/images';
import { sound } from '../services/soundEngine';

interface MascotProps {
  speechText?: string;
  isCelebrating?: boolean;
  onTap?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const MascotSimsim: React.FC<MascotProps> = ({
  speechText = 'مرحباً يا بطل! هل أنت مستعد للغز جديد؟',
  isCelebrating = false,
  onTap,
  size = 'md',
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const cheers = [
    'أنا فخور بذكائك!',
    'ما شاء الله، أنت سريع جداً!',
    'هيا يا صديقي البطل!',
    'كل لغز يحلك يقربك من وسام البطولة!',
  ];

  const handleMascotClick = () => {
    sound.playPop();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);

    const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
    sound.speakArabic(randomCheer);

    if (onTap) onTap();
  };

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 md:w-24 md:h-24',
    lg: 'w-28 h-28 md:w-36 md:h-36',
  };

  return (
    <div className="relative inline-flex items-center gap-3 select-none">
      {/* Interactive Mascot Avatar */}
      <button
        type="button"
        onClick={handleMascotClick}
        title="اضغط على سمسم للاستماع لصوت مشجع!"
        className={`group relative rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 shadow-lg border-2 border-white hover:scale-105 transition-transform duration-200 cursor-pointer ${
          isCelebrating ? 'animate-bounce' : isWiggling ? 'animate-wiggle' : 'animate-float'
        } ${sizeClasses[size]}`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-amber-100 flex items-center justify-center relative">
          <img
            src={ASSETS.mascotSimsim}
            alt="سمسم السنجاب الذكي"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Graceful SVG fallback
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'text-4xl flex items-center justify-center';
                fallback.innerText = '🐿️';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        {/* Little badge star */}
        <span className="absolute -bottom-1 -left-1 bg-amber-400 border border-white text-xs px-1.5 py-0.5 rounded-full shadow font-bold text-amber-950 flex items-center gap-0.5">
          ⭐ سمسم
        </span>
      </button>

      {/* Cheerful Speech Bubble */}
      {speechText && (
        <div className="relative bg-white/95 backdrop-blur-xs border-2 border-amber-200 rounded-2xl px-4 py-2.5 shadow-md max-w-xs md:max-w-sm text-slate-800 text-sm md:text-base font-medium leading-relaxed animate-fade-in">
          {/* Speech bubble tail pointer (RTL positioned) */}
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 bg-white border-t-2 border-r-2 border-amber-200 rotate-45" />
          <div className="flex items-center justify-between gap-2">
            <span>{speechText}</span>
            <button
              type="button"
              onClick={() => sound.speakArabic(speechText)}
              className="text-amber-600 hover:text-amber-700 p-1 rounded-full hover:bg-amber-50 transition-colors shrink-0"
              title="استمع للصوت"
            >
              🔊
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

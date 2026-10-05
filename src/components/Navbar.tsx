import React from 'react';
import { UserProfile } from '../types/game';
import { sound } from '../services/soundEngine';

interface NavbarProps {
  currentTab: 'hub' | 'academy' | 'memory' | 'stickers' | 'trophies';
  onSelectTab: (tab: 'hub' | 'academy' | 'memory' | 'stickers' | 'trophies') => void;
  profile: UserProfile;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Wordmark logo */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onSelectTab('hub');
          }}
          className="text-base sm:text-lg md:text-xl font-black text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 text-right cursor-pointer flex items-center gap-1.5"
        >
          <span className="text-xl">🌟</span>
          <span>العباقرة الصغار</span>
        </button>

        {/* Clean compact navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm font-bold text-slate-600 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onSelectTab('hub');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'hub'
                ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            واحة الألغاز
          </button>

          {/* NEW: Arabic Letters & Numbers Academy tab */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onSelectTab('academy');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              currentTab === 'academy'
                ? 'text-teal-700 bg-teal-50 border-b-2 border-teal-600'
                : 'hover:text-slate-900'
            }`}
          >
            <span>🔤</span>
            <span>الحروف والأرقام</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onSelectTab('memory');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'memory'
                ? 'text-pink-600 bg-pink-50 border-b-2 border-pink-600'
                : 'hover:text-slate-900'
            }`}
          >
            تحدي الذاكرة
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onSelectTab('stickers');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'stickers'
                ? 'text-amber-600 bg-amber-50 border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            الملصقات
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onSelectTab('trophies');
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              currentTab === 'trophies'
                ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600'
                : 'hover:text-slate-900'
            }`}
          >
            الأوسمة
          </button>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Star counter display button */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onSelectTab('trophies');
            }}
            title="مجموع النجوم الذهبية التي جمعتها"
            className="flex items-center gap-1 bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full transition-colors font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
          >
            <span className="text-amber-500 text-sm">⭐</span>
            <span className="tabular-nums font-black">
              {profile.arabicNumerals
                ? profile.stars.toLocaleString('ar-SA')
                : profile.stars}
            </span>
          </button>

          {/* Parental / Sound Settings Button */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onOpenSettings();
            }}
            title="إعدادات الصوت والتحكم"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm transition-colors cursor-pointer shadow-2xs"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};

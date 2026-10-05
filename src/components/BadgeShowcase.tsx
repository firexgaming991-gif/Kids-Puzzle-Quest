import React from 'react';
import { BadgeItem, UserProfile } from '../types/game';
import { sound } from '../services/soundEngine';

interface BadgeShowcaseProps {
  badges: BadgeItem[];
  profile: UserProfile;
  totalPuzzlesSolved: number;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  badges,
  profile,
  totalPuzzlesSolved,
}) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const formatNumber = (num: number) => {
    return profile.arabicNumerals ? num.toLocaleString('ar-SA') : num.toString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {/* Top Hero Certificate - Compact */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl p-3.5 sm:p-4 text-amber-950 shadow-md border-2 border-yellow-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/90 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs shrink-0">
            {profile.avatar}
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.2 rounded-full inline-block">
              شهادة عبقري الألغاز 📜
            </span>
            <h2 className="text-base sm:text-lg font-black leading-tight">{profile.name}</h2>
            <p className="text-xs font-bold text-amber-900">
              أكملت {formatNumber(totalPuzzlesSolved)} لغزاً وجمعت {formatNumber(profile.stars)} نجمة ذهبية!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs shrink-0">
          <span className="text-xs font-bold text-slate-500">الأوسمة المفتوحة:</span>
          <span className="text-lg font-black text-amber-600">
            {formatNumber(unlockedCount)} / {formatNumber(badges.length)}
          </span>
        </div>
      </div>

      {/* Badges Grid - Compact */}
      <div className="bg-white rounded-2xl border border-purple-200 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-100">
          <h3 className="text-sm sm:text-base font-black text-purple-900 flex items-center gap-1.5">
            <span>🏆</span>
            <span>خزانة الأوسمة والبطولات</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            انقر على أي وسام لسماع قصته
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {badges.map((badge) => {
            return (
              <div
                key={badge.id}
                onClick={() => {
                  sound.playPop();
                  if (badge.unlocked) {
                    sound.speakArabic(`وسام ${badge.title}. ${badge.description}`);
                  } else {
                    sound.speakArabic(`وسام مغلق. متطلب الفتح: ${badge.requiredCondition}`);
                  }
                }}
                className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 select-none ${
                  badge.unlocked
                    ? 'bg-purple-50/70 border-purple-300 hover:border-purple-500 hover:shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    badge.unlocked
                      ? 'bg-purple-100 border border-purple-300'
                      : 'bg-slate-200 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded shrink-0">
                        مفتوح ✔
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {badge.unlocked ? badge.description : badge.requiredCondition}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

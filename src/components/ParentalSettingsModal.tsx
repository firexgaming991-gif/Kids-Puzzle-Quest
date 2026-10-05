import React, { useState } from 'react';
import { UserProfile } from '../types/game';
import { AVATARS } from '../data/rewards';
import { sound } from '../services/soundEngine';

interface ParentalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetProgress: () => void;
}

export const ParentalSettingsModal: React.FC<ParentalSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onResetProgress,
}) => {
  // Simple parental gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [num1] = useState(3);
  const [num2] = useState(4);
  const [answerInput, setAnswerInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [childName, setChildName] = useState(profile.name);
  const [childAvatar, setChildAvatar] = useState(profile.avatar);

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answerInput, 10) === num1 + num2) {
      sound.playSuccess();
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      sound.playGentleTryAgain();
      setErrorMsg('إجابة غير صحيحة، يرجى إعادة المحاولة.');
    }
  };

  const handleSaveProfile = () => {
    sound.playPop();
    onUpdateProfile({
      name: childName.trim() || 'البطل الذكي',
      avatar: childAvatar,
    });
    onClose();
  };

  const handleToggleSound = () => {
    const newVal = !profile.soundEnabled;
    sound.setSoundEnabled(newVal);
    onUpdateProfile({ soundEnabled: newVal });
    if (newVal) sound.playPop();
  };

  const handleToggleVoice = () => {
    const newVal = !profile.voiceEnabled;
    sound.setVoiceEnabled(newVal);
    onUpdateProfile({ voiceEnabled: newVal });
    if (newVal) {
      sound.playPop();
      sound.speakArabic('تم تشغيل القراءة الصوتية!');
    }
  };

  const handleToggleNumerals = () => {
    sound.playPop();
    onUpdateProfile({ arabicNumerals: !profile.arabicNumerals });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-4 border-emerald-300 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>⚙️</span>
            <span>إعدادات اللعبة والأهل</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Parental Verification Gate if resetting or full settings */}
        {!isUnlocked ? (
          <div className="space-y-4 py-2">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-sm text-amber-900 font-bold leading-relaxed">
              🔐 للتأكد من أنك ولي الأمر، يرجى الإجابة على السؤال الحسابي البسيط:
            </div>

            <form onSubmit={handleVerifyGate} className="space-y-4">
              <div className="text-center font-black text-2xl text-slate-800">
                ما هو ناتج: {num1} + {num2} = ؟
              </div>

              <input
                type="number"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="أدخل الناتج هنا"
                autoFocus
                className="w-full text-center py-3 px-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 font-bold text-lg outline-none"
              />

              {errorMsg && (
                <p className="text-xs font-bold text-rose-600 text-center">{errorMsg}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 btn-tactile-emerald text-white font-black py-2.5 rounded-xl cursor-pointer"
                >
                  تأكيد ودخول الإعدادات
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Unlocked Settings Content */
          <div className="space-y-6 animate-fade-in">
            {/* Child Profile Editing */}
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-800">
                اسم الطفل أو البطل:
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                maxLength={24}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-400 font-bold text-base outline-none"
              />

              <label className="block text-sm font-black text-slate-800 mt-2">
                الشخصية المفضلة (الأفاتار):
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setChildAvatar(av.emoji);
                    }}
                    className={`p-2 rounded-xl text-3xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                      childAvatar === av.emoji
                        ? 'bg-amber-100 border-amber-500 scale-105 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggles */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-sm">المؤثرات الصوتية</div>
                  <div className="text-xs text-slate-500">أصوات النجوم والتشجيع والضغطات</div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                    profile.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white absolute top-1 shadow-md transition-transform ${
                      profile.soundEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-sm">القراءة الصوتية التلقائية</div>
                  <div className="text-xs text-slate-500">قراءة الأسئلة للأطفال الصغار بصوت واضح</div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                    profile.voiceEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white absolute top-1 shadow-md transition-transform ${
                      profile.voiceEnabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-sm">طريقة كتابة الأرقام</div>
                  <div className="text-xs text-slate-500">
                    {profile.arabicNumerals ? 'الأرقام المشرقية (١، ٢، ٣)' : 'الأرقام العادية (1, 2, 3)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleNumerals}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer border border-slate-300"
                >
                  {profile.arabicNumerals ? '١، ٢، ٣' : '1, 2, 3'}
                </button>
              </div>
            </div>

            {/* Reset Progress Section */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-700 text-sm">إعادة تصفير التقدم</div>
                  <div className="text-xs text-slate-500">مسح النجوم والملصقات للبدء من جديد</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تصفير تقدم اللعبة؟')) {
                      onResetProgress();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 cursor-pointer"
                >
                  تصفير التقدم
                </button>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 btn-tactile-emerald text-white font-black py-3 rounded-2xl cursor-pointer"
              >
                حفظ التغييرات ✅
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

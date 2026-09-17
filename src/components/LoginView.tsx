import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { signInWithGoogle } from '../lib/firebase';
import { triggerCelebration } from '../lib/fileHelper';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  isDark: boolean;
  onToggleDark: () => void;
  showToast: (msg: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  isDark,
  onToggleDark,
  showToast,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      triggerCelebration({ count: 70, spread: 80 });
      showToast(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${user.displayName || user.email}`);
      onLoginSuccess(user);
    } catch (err: unknown) {
      console.error('Google Sign-in error in LoginView:', err);
      let message = 'ไม่สามารถเข้าสู่ระบบผ่าน Google ได้ กรุณาลองใหม่อีกครั้ง';
      if (err instanceof Error) {
        if (err.message.includes('popup-closed-by-user')) {
          message = 'หน้าต่างเข้าสู่ระบบถูกปิดก่อนทำรายการสำเร็จ กรุณากดเข้าสู่ระบบใหม่';
        } else if (err.message.includes('popup-blocked')) {
          message = 'เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป กรุณาอนุญาต Pop-up สำหรับเว็บไซต์นี้';
        } else {
          message = err.message;
        }
      }
      setErrorMessage(message);
      showToast('❌ ' + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark ? 'bg-[#0b1120] text-[#f1f5f9]' : 'bg-[#f4f7fb] text-[#131b2e]'
      }`}
    >
      {/* Top Bar with Minimal Header */}
      <header
        className={`w-full border-b backdrop-blur-md sticky top-0 z-20 transition-colors ${
          isDark
            ? 'bg-[#0f172a]/90 border-[#1e293b]'
            : 'bg-white/90 border-[#e2e8f0]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003975] to-[#005bb7] flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight leading-tight">
                Teacher Practicum Portal
              </h1>
              <p
                className={`text-[11px] leading-tight ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                ระบบรายงานการฝึกสอนประสบการณ์วิชาชีพครู
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDark}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          {/* Main Card */}
          <div
            className={`rounded-3xl border shadow-xl p-6 sm:p-9 transition-colors relative overflow-hidden ${
              isDark
                ? 'bg-[#131d33] border-slate-750 shadow-black/40'
                : 'bg-white border-slate-200 shadow-blue-900/5'
            }`}
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003975] via-[#006398] to-[#10b981]" />

            {/* Emblem & Badge */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                    isDark
                      ? 'bg-gradient-to-br from-[#1e3a8a] to-[#0284c7] text-white shadow-blue-950/50'
                      : 'bg-gradient-to-br from-[#003975] to-[#0284c7] text-white shadow-blue-700/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[42px]">menu_book</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131d33] flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">lock_person</span>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  isDark
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                ระบบยืนยันตัวตนความปลอดภัย
              </span>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                เข้าสู่ระบบด้วย Gmail
              </h2>
              <p
                className={`text-sm max-w-sm mb-6 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                กรุณาเข้าสู่ระบบด้วยบัญชี Google เพื่อเปิดใช้งานระบบและเข้าถึงข้อมูลบันทึกการฝึกสอน 18 สัปดาห์ของคุณ
              </p>
            </div>

            {/* Error Message Box if login failed */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
              >
                <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-500">
                  error
                </span>
                <div className="flex-1">
                  <p className="font-semibold mb-0.5">ไม่สามารถเข้าสู่ระบบได้</p>
                  <p className="leading-relaxed opacity-90">{errorMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-400 hover:text-rose-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* Big Google Sign-in Button */}
            <div className="space-y-4">
              <button
                type="button"
                id="googleSignInPrimaryBtn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full relative py-3.5 px-5 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center gap-3.5 transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-250 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-white"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[22px] text-blue-600">
                      progress_activity
                    </span>
                    <span>กำลังเชื่อมต่อกับ Google...</span>
                  </>
                ) : (
                  <>
                    {/* Google G Brand Icon SVG */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>เข้าสู่ระบบด้วยบัญชี Google (Gmail)</span>
                  </>
                )}
              </button>

              <p
                className={`text-[11px] text-center leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                ระบบจะใช้บัญชี Google ของท่านในการระบุตัวตนและจัดเก็บข้อมูลแยกบัญชีอย่างปลอดภัยบน Firebase Cloud Firestore
              </p>
            </div>

            {/* Separator */}
            <div className="my-6 flex items-center gap-3">
              <div
                className={`flex-1 h-px ${isDark ? 'bg-slate-750' : 'bg-slate-200'}`}
              />
              <span
                className={`text-[11px] font-medium uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                สิทธิประโยชน์เมื่อเข้าสู่ระบบ
              </span>
              <div
                className={`flex-1 h-px ${isDark ? 'bg-slate-750' : 'bg-slate-200'}`}
              />
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div
                className={`p-3 rounded-2xl border transition-colors ${
                  isDark
                    ? 'bg-slate-850/50 border-slate-750'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1 text-[#006398] dark:text-sky-400">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    บันทึก 18 สัปดาห์
                  </span>
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  บันทึกกิจกรรม ปัญหา แนวทางแก้ไข และสถานะการตรวจแผน
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl border transition-colors ${
                  isDark
                    ? 'bg-slate-850/50 border-slate-750'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1 text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ซิงค์ข้อมูลคลาวด์
                  </span>
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  บันทึกอัตโนมัติบน Firestore ปลอดภัย ไม่สูญหายเมื่อเปลี่ยนเครื่อง
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl border transition-colors ${
                  isDark
                    ? 'bg-slate-850/50 border-slate-750'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1 text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    แนบไฟล์ภาพ & PDF
                  </span>
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  แนบแผนการสอน บันทึกนิเทศ รูปภาพกิจกรรม พร้อมพรีวิวในตัว
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl border transition-colors ${
                  isDark
                    ? 'bg-slate-850/50 border-slate-750'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1 text-amber-600 dark:text-amber-400">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ความเป็นส่วนตัว
                  </span>
                </div>
                <p
                  className={`text-[11px] leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  มีระบบสิทธิ์เฉพาะบัญชีคุณเท่านั้นที่เข้าถึงและแก้ไขข้อมูลได้
                </p>
              </div>
            </div>

            {/* Note about popups */}
            <div
              className={`mt-5 pt-4 border-t text-center text-[11px] ${
                isDark ? 'border-slate-750 text-slate-400' : 'border-slate-100 text-slate-400'
              }`}
            >
              💡 หากคลิกแล้วหน้าต่างไม่ปรากฏ กรุณาตรวจสอบการบล็อก Pop-up ของเบราว์เซอร์
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className={`w-full py-4 text-center text-xs transition-colors border-t ${
          isDark
            ? 'bg-[#0f172a] border-[#1e293b] text-slate-400'
            : 'bg-white border-slate-200 text-slate-500'
        }`}
      >
        <p>
          ระบบรายงานการฝึกสอนประสบการณ์วิชาชีพครู (Teacher Practicum Report) • พัฒนาด้วย Firebase & Google Authentication
        </p>
      </footer>
    </div>
  );
};

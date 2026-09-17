import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logOutOfFirebase } from '../../lib/firebase';
import { triggerCelebration } from '../../lib/fileHelper';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChanged?: (user: User | null) => void;
  onAuthSuccess?: (user: User) => void;
  onSyncNow?: () => Promise<void> | void;
  onManualSync?: () => Promise<void> | void;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  onShowToast?: (msg: string) => void;
  isDark?: boolean;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onAuthSuccess,
  onSyncNow,
  onManualSync,
  isSyncing,
  lastSyncedAt,
  onShowToast,
  isDark = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifyToast = (msg: string) => {
    if (typeof onShowToast === 'function') {
      onShowToast(msg);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle();
      if (typeof onUserChanged === 'function') {
        onUserChanged(user);
      }
      if (typeof onAuthSuccess === 'function') {
        onAuthSuccess(user);
      }
      triggerCelebration({ count: 70, spread: 80 });
      notifyToast(`ยินดีต้อนรับ ${user.displayName || user.email}! เข้าสู่ระบบด้วย Gmail สำเร็จ`);
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setErrorMsg(msg);
      notifyToast('เข้าสู่ระบบไม่สำเร็จ: ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('คุณต้องการออกจากระบบ Google และ Firebase ใช่หรือไม่?')) {
      try {
        await logOutOfFirebase();
        if (typeof onUserChanged === 'function') {
          onUserChanged(null);
        }
        notifyToast('ออกจากระบบเรียบร้อยแล้ว');
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  const handleManualSync = async () => {
    try {
      if (typeof onSyncNow === 'function') {
        await onSyncNow();
      } else if (typeof onManualSync === 'function') {
        await onManualSync();
      }
      triggerCelebration({ count: 50, spread: 60 });
    } catch (e) {
      console.error('Sync error:', e);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
            isDark ? 'bg-[#131b2e] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              isDark ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold">ระบบบัญชีและ Cloud Firebase</h3>
                <p className="text-[11.5px] text-slate-400">
                  จัดเก็บข้อมูลการฝึกสอนถาวรบน Cloud Firestore
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-5">
            {currentUser ? (
              // Authenticated State
              <div className="flex flex-col gap-4">
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-4 ${
                    isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-blue-50/60 border-blue-100'
                  }`}
                >
                  <img
                    src={currentUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvAaCO8VzSaXFEfdx7noVJ0CkGU2lWWkJaoDGraTJpt8q0BL_dB332T9_D5CGA1-rIWN5gtlfdRR33Rgm-vJ6pP6U8EjNtfjbc3pfGYHg5yrMP23-ldx0UGAlSea-rIDDFwMhoYQpriDu45_A7WPZNjSmWPeyyNBd77FrNBYfGgLGh8rwmDF7QexqD-qMTkUztjcUH5pgl8PWvbvWZ6AY4ueOVSjSL_90dixxzwsLFXIyhUbJUnDwjSw'}
                    alt="Google Avatar"
                    className="w-14 h-14 rounded-full ring-2 ring-blue-600 object-cover shadow-xs"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold truncate">
                        {currentUser.displayName || 'ผู้ใช้งาน Google'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                        ออนไลน์
                      </span>
                    </div>
                    <span className="text-[12.5px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {currentUser.email}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      เชื่อมต่อกับ Cloud Firestore เรียบร้อยแล้ว
                    </span>
                  </div>
                </div>

                {/* Cloud Sync Status */}
                <div
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      สถานะ Cloud Firestore
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      เชื่อมต่อสำเร็จ (Online)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400">
                    <span>ซิงค์ล่าสุด:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {lastSyncedAt ? lastSyncedAt : 'เพิ่งซิงค์ข้อมูล'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-blue-800 text-white font-semibold text-[13px] transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isSyncing ? 'animate-spin' : ''
                      }`}
                    >
                      sync
                    </span>
                    <span>{isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูลขึ้น Cloud ตอนนี้'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[13px] font-semibold transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            ) : (
              // Unauthenticated State
              <div className="flex flex-col gap-4 text-center py-2">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#1e3a8a] dark:text-blue-300 flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>

                <div>
                  <h4 className="text-[17px] font-bold text-slate-800 dark:text-white">
                    เข้าสู่ระบบด้วย Google (Gmail)
                  </h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    เชื่อมต่อบัญชี Gmail ของท่านเพื่อบันทึกข้อมูลสมุด 18 สัปดาห์, แผนการสอน, ไฟล์วิจัย และรูปภาพลงใน Firebase Cloud Firestore แบบถาวร
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[12px] text-left">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-semibold text-[14px] shadow-sm hover:shadow transition-all cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Gmail (Google)'}</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[11.5px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-500">lock</span>
                    ความปลอดภัยระดับองค์กร
                  </span>
                  <span>•</span>
                  <span>ซิงค์ข้อมูลข้ามอุปกรณ์</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

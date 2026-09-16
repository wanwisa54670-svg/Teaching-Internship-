import React, { useState } from 'react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
  defaultEmail?: string;
  isDark?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  defaultEmail = 'wanwisa54670@gmail.com',
  isDark = false,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('teacher123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('กรุณากรอกอีเมลของคุณ');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      return;
    }
    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating safely
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email.trim());
    }, 450);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('teacher123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(demoEmail);
    }, 350);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:px-6 transition-colors duration-200 ${
        isDark ? 'bg-[#0b1329] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full max-w-md flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Top Logo and Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center ring-4 ring-[#1e3a8a]/10 dark:ring-blue-400/10">
            <img
              alt="Teacher Practicum Emblem"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VdlbsRjovBR-L3yNXPkaZ2z7jfGR4oGWcIE1EReLLlYHTIHs82WaL5uphJsPcFvWLnjbb_fH0phiR_DcfeobKywoL0mjGGzGzHH0tsxsKKuUKjGf7dZl8Osl_PwIYLSC8KA2lB1FOo7la4HITYbSFPMKCajcFyhubNTB-LT7hQfxYHipu3f1jfgeQkbItmGiiWiLmkU9maUNrk7wcvd1y4H8MLr9IT8uqKPSn6bUvTpXrwJutBvAb0TBKm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#1e3a8a] dark:text-blue-300 tracking-tight leading-snug">
              ระบบบันทึกประสบการณ์วิชาชีพครู
            </h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
              โรงเรียนสาธิตมหาวิทยาลัย • ภาคเรียนที่ 1/2569
            </p>
          </div>
        </div>

        {/* Main Login Card */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col gap-5 ${
            isDark
              ? 'bg-[#131b2e] border-slate-800 text-white'
              : 'bg-white border-slate-100 text-slate-900'
          }`}
        >
          <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <h2 className="text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[22px]">
                login
              </span>
              <span>เข้าสู่ระบบ</span>
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานสมุดบันทึกและระบบวิชาการ
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-300 text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="loginEmail"
                className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <span>อีเมล (Email)</span>
                <span className="text-[11px] font-normal text-slate-400">
                  บัญชีผู้ใช้ครูฝึกสอน
                </span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-slate-400">
                  mail
                </span>
                <input
                  id="loginEmail"
                  type="email"
                  required
                  placeholder="เช่น wanwisa54670@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-[13.5px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="loginPassword"
                  className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  รหัสผ่าน (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11.5px] text-[#1e3a8a] dark:text-blue-300 hover:underline cursor-pointer"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-slate-400">
                  lock
                </span>
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-11 pl-10 pr-11 rounded-xl border text-[13.5px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Note */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1e3a8a] focus:ring-[#1e3a8a]"
                />
                <span className="text-[12px] text-slate-600 dark:text-slate-300">
                  จดจำการเข้าสู่ระบบ
                </span>
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ระบบปลอดภัย
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px]">
                    progress_activity
                  </span>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <span className="text-[11.5px] font-semibold text-slate-400 text-center">
              หรือเข้าสู่ระบบด่วนเพื่อทดสอบระบบ
            </span>

            <button
              type="button"
              onClick={() => handleQuickLogin('wanwisa54670@gmail.com')}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1e3a8a] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span>เข้าสู่ระบบด้วยบัญชีคุณครูวันวิสาข์ (Demo)</span>
            </button>
          </div>
        </div>

        {/* Footer help note */}
        <div className="text-center text-[12px] text-slate-400 flex flex-col items-center gap-1">
          <span>คณะครุศาสตร์ มหาวิทยาลัยราชภัฏ • ภาคเรียนที่ 1/2569</span>
          <span className="text-[11px] text-slate-500">
            ระบบจัดเก็บข้อมูลและประวัติการฝึกสอนในเบราว์เซอร์อัตโนมัติ
          </span>
        </div>
      </div>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 ${
              isDark ? 'bg-[#18233c] text-white border border-slate-700' : 'bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 text-[#1e3a8a] dark:text-blue-300 font-bold text-[15px]">
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span>ข้อมูลการเข้าสู่ระบบ</span>
            </div>
            <p className="text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              สำหรับระบบตัวอย่างนี้ คุณสามารถใช้อีเมล <strong>wanwisa54670@gmail.com</strong>{' '}
              และรหัสผ่านใดก็ได้ (เช่น <strong>teacher123</strong>) หรือกดปุ่ม <strong>"เข้าสู่ระบบด่วน"</strong>{' '}
              เพื่อเข้าใช้งานได้ทันที
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full h-9 rounded-xl bg-[#1e3a8a] text-white font-semibold text-[12px] cursor-pointer"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

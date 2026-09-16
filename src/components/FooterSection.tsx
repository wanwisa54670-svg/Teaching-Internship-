import React from 'react';

interface FooterSectionProps {
  onLogout: () => void;
  isDark?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onLogout, isDark = false }) => {
  return (
    <section className="pt-2 flex flex-col gap-4 pb-2">
      {/* Logout Button */}
      <button
        id="logoutTriggerBtn"
        type="button"
        onClick={onLogout}
        className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-[14px] transition-all active:scale-[0.99] cursor-pointer shadow-xs ${
          isDark
            ? 'bg-rose-950/50 hover:bg-rose-950 text-rose-300 border border-rose-900/60'
            : 'bg-[#ffdad6]/70 hover:bg-[#ffdad6] text-[#ba1a1a]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        <span>ออกจากระบบ</span>
      </button>

      {/* App Version & Institutional Credit Footer */}
      <div className="flex flex-col items-center justify-center text-center gap-1 py-1">
        <div
          className={`flex items-center gap-1.5 text-[12px] font-medium ${
            isDark ? 'text-slate-400' : 'text-[#444651]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isDark ? 'text-blue-400' : 'text-[#1e3a8a]'
            }`}
          >
            verified
          </span>
          <span>ระบบรายงานการฝึกประสบการณ์วิชาชีพครู v2.4.0</span>
        </div>
        <p
          className={`text-[11px] max-w-sm ${
            isDark ? 'text-slate-500' : 'text-[#444651]/80'
          }`}
        >
          คณะครุศาสตร์ มหาวิทยาลัยราชภัฏ • ฝ่ายมาตรฐานและฝึกประสบการณ์วิชาชีพ
        </p>
      </div>
    </section>
  );
};

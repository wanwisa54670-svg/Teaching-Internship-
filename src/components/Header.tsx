import React from 'react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onSaveAll?: () => void;
  unreadCount?: number;
  avatarUrl: string;
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenProfile,
  onSaveAll,
  unreadCount = 2,
  avatarUrl,
  isDark = false,
}) => {
  return (
    <header
      id="mainHeader"
      className={`fixed top-0 left-0 right-0 w-full z-40 pt-safe transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#131b2e]/95 border-slate-800 backdrop-blur-xl shadow-md'
          : 'bg-[#faf8ff]/95 border-slate-200/60 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="max-w-xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left: Emblem & Title */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <img
            alt="Teacher Practicum Emblem"
            className="h-8 w-auto object-contain drop-shadow-xs shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VdlbsRjovBR-L3yNXPkaZ2z7jfGR4oGWcIE1EReLLlYHTIHs82WaL5uphJsPcFvWLnjbb_fH0phiR_DcfeobKywoL0mjGGzGzHH0tsxsKKuUKjGf7dZl8Osl_PwIYLSC8KA2lB1FOo7la4HITYbSFPMKCajcFyhubNTB-LT7hQfxYHipu3f1jfgeQkbItmGiiWiLmkU9maUNrk7wcvd1y4H8MLr9IT8uqKPSn6bUvTpXrwJutBvAb0TBKm"
          />
          <div className="flex flex-col min-w-0">
            <span
              className={`text-[13.5px] sm:text-[15px] font-bold leading-tight tracking-tight truncate ${
                isDark ? 'text-blue-200' : 'text-[#1e3a8a]'
              }`}
            >
              รายงานการฝึกสอนประสบการณ์วิชาชีพครู
            </span>
            <span
              className={`text-[10.5px] sm:text-[11px] font-medium leading-none mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-[#444651]'
              }`}
            >
              บันทึกข้อมูลอัตโนมัติ
            </span>
          </div>
        </div>

        {/* Right: Save Button, Notifications & Avatar */}
        <div className="flex items-center gap-1.5">
          {onSaveAll && (
            <button
              id="saveAllHeaderBtn"
              type="button"
              onClick={onSaveAll}
              title="บันทึกข้อมูลทั้งหมดลงในเครื่อง"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isDark
                  ? 'bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/60'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span className="hidden xs:inline">บันทึกข้อมูล</span>
            </button>
          )}

          <button
            id="notificationBellBtn"
            type="button"
            onClick={onOpenNotifications}
            aria-label="การแจ้งเตือน"
            className={`w-10 h-10 flex items-center justify-center rounded-full relative transition-colors ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-[#444651] hover:bg-[#eaedff]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf8ff] animate-pulse" />
            )}
          </button>

          <button
            id="profileAvatarHeaderBtn"
            type="button"
            onClick={onOpenProfile}
            title="ดูโปรไฟล์"
            className="flex items-center justify-center p-0.5 rounded-full ring-2 ring-[#cce5ff] hover:ring-[#1e3a8a] transition-all cursor-pointer"
          >
            <img
              alt="Profile avatar"
              className="w-8 h-8 rounded-full object-cover"
              src={avatarUrl}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

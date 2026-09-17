import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onSaveAll?: () => void;
  onToggleDark?: () => void;
  unreadCount?: number;
  avatarUrl: string;
  profileName?: string;
  isDark?: boolean;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'หน้าแรก', icon: 'dashboard' },
  { id: 'weekly-log', label: 'บันทึก 18 สัปดาห์', icon: 'auto_stories' },
  { id: 'academics', label: 'งานวิชาการ', icon: 'menu_book' },
  { id: 'school', label: 'สถานศึกษา & รูปถ่าย', icon: 'domain' },
  { id: 'settings', label: 'ข้อมูลนักศึกษา & ตั้งค่า', icon: 'manage_accounts' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenNotifications,
  onOpenProfile,
  onSaveAll,
  onToggleDark,
  unreadCount = 2,
  avatarUrl,
  profileName = 'คุณครูฝึกสอน',
  isDark = false,
}) => {
  return (
    <header
      id="mainHeader"
      className={`fixed top-0 left-0 right-0 w-full z-40 pt-safe transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#10172a]/95 border-slate-800/80 backdrop-blur-xl shadow-md'
          : 'bg-white/95 border-slate-200/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 sm:h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Emblem & Website Title */}
        <div
          onClick={() => onChangeTab('home')}
          className="flex items-center gap-3 min-w-0 shrink-0 cursor-pointer group"
          title="ไปที่หน้าแรกของเว็บไซต์"
        >
          <img
            alt="Teacher Practicum Emblem"
            className="h-9 sm:h-10 w-auto object-contain drop-shadow-xs shrink-0 group-hover:scale-105 transition-transform"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VdlbsRjovBR-L3yNXPkaZ2z7jfGR4oGWcIE1EReLLlYHTIHs82WaL5uphJsPcFvWLnjbb_fH0phiR_DcfeobKywoL0mjGGzGzHH0tsxsKKuUKjGf7dZl8Osl_PwIYLSC8KA2lB1FOo7la4HITYbSFPMKCajcFyhubNTB-LT7hQfxYHipu3f1jfgeQkbItmGiiWiLmkU9maUNrk7wcvd1y4H8MLr9IT8uqKPSn6bUvTpXrwJutBvAb0TBKm"
          />
          <div className="flex flex-col min-w-0">
            <span
              className={`text-[14px] sm:text-[15.5px] font-bold leading-tight tracking-tight truncate ${
                isDark ? 'text-blue-200' : 'text-[#1e3a8a]'
              }`}
            >
              รายงานการฝึกสอนประสบการณ์วิชาชีพครู
            </span>
            <span
              className={`text-[11px] font-medium leading-none mt-1 hidden sm:inline ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              คณะครุศาสตร์ มหาวิทยาลัยราชภัฏ • ภาคเรียนที่ 1/2569
            </span>
          </div>
        </div>

        {/* Center: Desktop Website Navigation Tabs */}
        <nav
          aria-label="เมนูหลักเว็บไซต์"
          className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? isDark
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'bg-[#1e3a8a] text-white shadow-xs'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-[#1e3a8a] hover:bg-white/80'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Theme Toggle, Notifications & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Save Button */}
          {onSaveAll && (
            <button
              id="saveAllHeaderBtn"
              type="button"
              onClick={onSaveAll}
              title="บันทึกข้อมูลทั้งหมดลงในเครื่อง"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span className="hidden sm:inline">บันทึกทั้งหมด</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          {onToggleDark && (
            <button
              type="button"
              onClick={onToggleDark}
              title={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                isDark
                  ? 'text-amber-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          {/* Notifications Bell */}
          <button
            id="notificationBellBtn"
            type="button"
            onClick={onOpenNotifications}
            aria-label="การแจ้งเตือน"
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl relative transition-all cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Profile Chip Button */}
          <button
            id="profileAvatarHeaderBtn"
            type="button"
            onClick={onOpenProfile}
            title="ดูข้อมูลและแก้ไขโปรไฟล์"
            className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700/80 hover:border-slate-600 bg-slate-800/50'
                : 'border-slate-200 hover:border-blue-300 bg-slate-50/80 hover:bg-blue-50/40'
            }`}
          >
            <div className="relative">
              <img
                alt="Profile avatar"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-[#1e3a8a]/30"
                src={avatarUrl}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[12px] font-bold leading-tight truncate max-w-[130px]">
                {profileName}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">ครูฝึกสอน</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isDark?: boolean;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'หน้าแรก', icon: 'dashboard' },
  { id: 'school', label: 'สถานศึกษา', icon: 'domain' },
  { id: 'weekly-log', label: 'บันทึก 18 สัปดาห์', icon: 'edit_note' },
  { id: 'academics', label: 'งานวิชาการ', icon: 'menu_book' },
  { id: 'settings', label: 'ตั้งค่า', icon: 'settings' },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  isDark = false,
}) => {
  return (
    <nav
      id="bottomNavigation"
      className={`fixed bottom-0 left-0 right-0 w-full z-40 pb-safe transition-colors duration-200 border-t md:hidden ${
        isDark
          ? 'bg-[#131b2e]/95 border-slate-800 backdrop-blur-xl shadow-lg'
          : 'bg-[#faf8ff]/95 border-slate-200/70 backdrop-blur-xl shadow-[0_-4px_16px_rgba(15,23,42,0.06)]'
      }`}
    >
      <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`navTab-${item.id}`}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[58px] h-full py-1 transition-all gap-0.5 cursor-pointer relative ${
                isActive
                  ? isDark
                    ? 'text-blue-300 font-semibold'
                    : 'text-[#1e3a8a] font-semibold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-[#444651] hover:text-[#131b2e]'
              }`}
            >
              {/* Active micro top bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-[3px] rounded-full bg-[#1e3a8a]" />
              )}
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'scale-110 font-bold' : ''
                } transition-transform`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] leading-tight text-center truncate tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

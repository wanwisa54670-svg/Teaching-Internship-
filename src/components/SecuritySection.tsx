import React, { useState } from 'react';

interface SecuritySectionProps {
  onOpenPassword: () => void;
  showToast: (msg: string) => void;
  isDark: boolean;
  onToggleTheme: (dark: boolean) => void;
  onSaveAll?: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData?: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  onOpenPassword,
  showToast,
  isDark,
  onToggleTheme,
  onSaveAll,
  onExportBackup,
  onImportBackup,
  onResetData,
}) => {
  const [weeklyReminder, setWeeklyReminder] = useState(true);

  const handleToggleWeekly = (checked: boolean) => {
    setWeeklyReminder(checked);
    showToast(
      checked
        ? 'เปิดการแจ้งเตือนส่งบันทึกทุกวันศุกร์ 16:00 น.'
        : 'ปิดการแจ้งเตือนส่งบันทึกประจำสัปดาห์'
    );
  };

  return (
    <section className="flex flex-col gap-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#004a31]" />
          <h3
            className={`text-[17px] font-bold ${
              isDark ? 'text-emerald-300' : 'text-[#004a31]'
            }`}
          >
            การแจ้งเตือนและความปลอดภัย
          </h3>
        </div>
        <span
          className={`text-[12px] font-medium ${
            isDark ? 'text-slate-400' : 'text-[#444651]'
          }`}
        >
          หมวดที่ 3
        </span>
      </div>

      {/* Group Card Container */}
      <div
        className={`flex flex-col rounded-2xl shadow-sm overflow-hidden border transition-colors duration-200 ${
          isDark
            ? 'bg-[#18233c] border-slate-800'
            : 'bg-white border-slate-100'
        }`}
      >
        {/* Item 1: Weekly Log Reminder */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-slate-800 text-blue-300' : 'bg-[#e2e7ff] text-[#1e3a8a]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">notification_important</span>
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <span
                className={`text-[14px] font-semibold ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                เตือนส่งบันทึกประจำสัปดาห์
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                ทุกวันศุกร์ เวลา 16:00 น.
              </span>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyReminder}
                onChange={(e) => handleToggleWeekly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]" />
            </label>
          </div>
        </div>

        <div className={`h-[1px] mx-4 ${isDark ? 'bg-slate-800' : 'bg-[#e2e7ff]'}`} />

        {/* Item 2: Change Password / Security */}
        <button
          type="button"
          onClick={onOpenPassword}
          className={`w-full flex items-center justify-between p-4 text-left transition-colors group cursor-pointer ${
            isDark ? 'hover:bg-slate-800/60' : 'hover:bg-[#f2f3ff]'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-[#eaedff] text-[#444651]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">lock_reset</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[14px] font-semibold transition-colors group-hover:text-[#1e3a8a] ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                เปลี่ยนรหัสผ่านและความปลอดภัย
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                อัปเดตล่าสุด 45 วันที่แล้ว
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        <div className={`h-[1px] mx-4 ${isDark ? 'bg-slate-800' : 'bg-[#e2e7ff]'}`} />

        {/* Item 4: Theme Settings */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-[#eaedff] text-[#444651]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">palette</span>
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <span
                className={`text-[14px] font-semibold ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                ธีมการแสดงผล
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                {isDark ? 'โหมดมืด (Dark Night Mode)' : 'โทนสีกรมท่ามาตรฐาน (Classic Navy)'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {/* Classic Navy Theme Button */}
            <button
              type="button"
              onClick={() => {
                onToggleTheme(false);
                showToast('เปลี่ยนเป็นธีมสีกรมท่ามาตรฐาน (Classic Navy)');
              }}
              title="ธีมสีกรมท่ามาตรฐาน"
              className={`w-8 h-8 rounded-full bg-[#00236f] flex items-center justify-center transition-all cursor-pointer ${
                !isDark
                  ? 'ring-2 ring-offset-2 ring-[#00236f] scale-105'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {!isDark && (
                <span className="material-symbols-outlined text-[15px] text-white">check</span>
              )}
            </button>

            {/* Dark Theme Button */}
            <button
              type="button"
              onClick={() => {
                onToggleTheme(true);
                showToast('เปลี่ยนเป็นโหมดมืด (Dark Theme)');
              }}
              title="ธีมโหมดมืด"
              className={`w-8 h-8 rounded-full bg-[#283044] flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? 'ring-2 ring-offset-2 ring-slate-400 scale-105'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#eef0ff]">
                dark_mode
              </span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />

        {/* Row 6: Data Persistence & Backup Controls */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">cloud_done</span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[14px] font-semibold ${
                    isDark ? 'text-white' : 'text-[#131b2e]'
                  }`}
                >
                  การจัดเก็บบันทึกข้อมูล (Storage)
                </span>
                <span
                  className={`text-[12px] ${
                    isDark ? 'text-slate-400' : 'text-[#444651]'
                  }`}
                >
                  บันทึกข้อมูลอัตโนมัติลงในเบราว์เซอร์ (Auto-saved to LocalStorage)
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              พร้อมใช้งาน
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {onSaveAll && (
              <button
                type="button"
                onClick={onSaveAll}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-98 ${
                  isDark
                    ? 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/60'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                บันทึกข้อมูลทันที
              </button>
            )}

            {onExportBackup && (
              <button
                type="button"
                onClick={onExportBackup}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-98 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                ส่งออกสำรอง (JSON)
              </button>
            )}

            {onImportBackup && (
              <label
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-98 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">upload</span>
                นำเข้าข้อมูลสำรอง
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={onImportBackup}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

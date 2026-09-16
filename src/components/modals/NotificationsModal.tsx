import React from 'react';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  isDark?: boolean;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  isDark = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[85vh] overflow-y-auto ${
          isDark
            ? 'bg-[#18233c] text-white border border-slate-700'
            : 'bg-white text-[#131b2e]'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]">
              notifications
            </span>
            <h4 className="text-[17px] font-bold">การแจ้งเตือน</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 hover:underline cursor-pointer"
            >
              อ่านทั้งหมด
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                n.read
                  ? isDark
                    ? 'bg-slate-800/40 border-slate-800 opacity-70'
                    : 'bg-slate-50 border-slate-100 opacity-80'
                  : isDark
                  ? 'bg-blue-950/40 border-blue-900/60'
                  : 'bg-[#f2f3ff] border-blue-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'urgent'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : n.type === 'success'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-blue-100 text-[#1e3a8a] dark:bg-blue-950 dark:text-blue-300'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {n.type === 'urgent'
                    ? 'warning'
                    : n.type === 'success'
                    ? 'verified'
                    : 'info'}
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[13px] font-semibold leading-snug">{n.title}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {n.time}
                </span>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] transition-colors cursor-pointer"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDark?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDark = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="logoutDialog"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#18233c] text-white border border-slate-700'
            : 'bg-white text-[#131b2e]'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] mx-auto">
          <span className="material-symbols-outlined text-[28px]">logout</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <h4 className="text-[18px] font-bold">ยืนยันการออกจากระบบ?</h4>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            ข้อมูลบันทึกสัปดาห์ล่าสุดถูกสำรองไว้บนคลาวด์แล้ว คุณสามารถกลับเข้ามาแก้ไขได้ตลอดเวลา
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            id="cancelLogoutBtn"
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[14px] transition-colors cursor-pointer"
          >
            กลับ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white font-semibold text-[14px] shadow-sm transition-colors cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

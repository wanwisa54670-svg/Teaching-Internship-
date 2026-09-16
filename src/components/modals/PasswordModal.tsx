import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  isDark?: boolean;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isDark = false,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    onSuccess('เปลี่ยนรหัสผ่านและอัปเดตความปลอดภัยสำเร็จแล้ว');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl ${
          isDark
            ? 'bg-[#18233c] text-white border border-slate-700'
            : 'bg-white text-[#131b2e]'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]">
              lock_reset
            </span>
            <h4 className="text-[17px] font-bold">เปลี่ยนรหัสผ่านและความปลอดภัย</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              รหัสผ่านปัจจุบัน
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          {/* 2FA Toggle */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex flex-col pr-2">
              <span className="text-[13px] font-semibold">การยืนยันตัวตนแบบ 2 ขั้นตอน (2FA)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                ส่งรหัส OTP ทาง SMS / อีเมล
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]" />
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] shadow-sm transition-all cursor-pointer"
            >
              บันทึกรหัสผ่านใหม่
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

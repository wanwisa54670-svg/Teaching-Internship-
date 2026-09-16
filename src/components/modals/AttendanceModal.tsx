import React, { useState } from 'react';
import { AttendanceRecord } from '../../types';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: AttendanceRecord[];
  onUpdateRecords: (updated: AttendanceRecord[]) => void;
  isDark?: boolean;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  records,
  onUpdateRecords,
  isDark = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AttendanceRecord>({
    date: 'วันนี้',
    checkIn: '07:30 น.',
    checkOut: '16:30 น.',
    status: 'ตรงเวลา',
  });

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRecords([formData, ...records]);
    setIsAdding(false);
  };

  const handleDelete = (index: number) => {
    const updated = [...records];
    updated.splice(index, 1);
    onUpdateRecords(updated);
  };

  const onTimeCount = records.filter((r) => r.status === 'ตรงเวลา').length;
  const leaveCount = records.filter(
    (r) => r.status === 'ลากิจ' || r.status === 'ลาป่วย'
  ).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto ${
          isDark
            ? 'bg-[#18233c] text-white border border-slate-700'
            : 'bg-white text-[#131b2e]'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]">
              fact_check
            </span>
            <h4 className="text-[17px] font-bold">ใบลงเวลาปฏิบัติราชการ (Attendance)</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              วันปฏิบัติงาน
            </span>
            <span className="text-[20px] font-bold text-[#1e3a8a] dark:text-blue-300">
              {records.length}
            </span>
            <span className="text-[10px] text-slate-400 block">รายการบันทึก</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              มาตรงเวลา
            </span>
            <span className="text-[20px] font-bold text-emerald-600 dark:text-emerald-400">
              {onTimeCount}
            </span>
            <span className="text-[10px] text-emerald-500 block">วัน</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-100 dark:border-slate-700">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              วันลาสะสม
            </span>
            <span className="text-[20px] font-bold text-amber-600 dark:text-amber-400">
              {leaveCount}
            </span>
            <span className="text-[10px] text-slate-400 block">วัน</span>
          </div>
        </div>

        {/* Add Record Form toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            ประวัติการสแกนลงเวลา
          </span>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdding ? 'remove' : 'add'}
            </span>
            <span>{isAdding ? 'ซ่อนแบบฟอร์ม' : '+ บันทึกเวลาใหม่'}</span>
          </button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col gap-2.5 animate-in fade-in"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">วันที่</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="เช่น 16 ก.ย. 2567"
                  required
                  className="h-8 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[12px] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as AttendanceRecord['status'],
                    })
                  }
                  className="h-8 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[12px] outline-none"
                >
                  <option value="ตรงเวลา">ตรงเวลา</option>
                  <option value="สาย">สาย</option>
                  <option value="ลากิจ">ลากิจ</option>
                  <option value="ลาป่วย">ลาป่วย</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">เวลาเข้า</label>
                <input
                  type="text"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="h-8 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[12px] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">เวลาออก</label>
                <input
                  type="text"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="h-8 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[12px] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 h-8 rounded-lg bg-[#1e3a8a] text-white text-[11px] font-semibold cursor-pointer"
              >
                บันทึกการลงเวลา
              </button>
            </div>
          </form>
        )}

        {/* Attendance Log Table */}
        <div className="flex flex-col gap-1.5">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
            {records.map((r, i) => (
              <div
                key={i}
                className="p-3 flex items-center justify-between text-[12px] bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{r.date}</span>
                  <span className="text-slate-500 text-[11px]">
                    เข้า: {r.checkIn} • ออก: {r.checkOut}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                      r.status === 'ตรงเวลา'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : r.status === 'สาย'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(i)}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    title="ลบรายการนี้"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] transition-colors cursor-pointer"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};

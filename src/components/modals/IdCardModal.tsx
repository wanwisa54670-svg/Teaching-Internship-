import React from 'react';
import { TraineeProfile } from '../../types';

interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TraineeProfile;
  isDark?: boolean;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  isOpen,
  onClose,
  profile,
  isDark = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="idCardModal"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-md rounded-3xl p-6 flex flex-col gap-4 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#18233c] text-white border border-slate-700'
            : 'bg-white text-[#131b2e]'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1e3a8a] text-[24px]">
              badge
            </span>
            <h4 className="text-[17px] font-bold">บัตรประจำตัวครูฝึกปฏิบัติการสอน</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Physical ID Card Simulation */}
        <div className="relative rounded-2xl overflow-hidden p-5 bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0f172a] text-white shadow-xl border border-blue-400/20">
          {/* Watermark Emblem */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <img
              alt="watermark"
              className="w-48 h-48 object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VdlbsRjovBR-L3yNXPkaZ2z7jfGR4oGWcIE1EReLLlYHTIHs82WaL5uphJsPcFvWLnjbb_fH0phiR_DcfeobKywoL0mjGGzGzHH0tsxsKKuUKjGf7dZl8Osl_PwIYLSC8KA2lB1FOo7la4HITYbSFPMKCajcFyhubNTB-LT7hQfxYHipu3f1jfgeQkbItmGiiWiLmkU9maUNrk7wcvd1y4H8MLr9IT8uqKPSn6bUvTpXrwJutBvAb0TBKm"
            />
          </div>

          {/* Card Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/15">
            <img
              alt="Emblem"
              className="h-9 w-auto object-contain brightness-110"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VdlbsRjovBR-L3yNXPkaZ2z7jfGR4oGWcIE1EReLLlYHTIHs82WaL5uphJsPcFvWLnjbb_fH0phiR_DcfeobKywoL0mjGGzGzHH0tsxsKKuUKjGf7dZl8Osl_PwIYLSC8KA2lB1FOo7la4HITYbSFPMKCajcFyhubNTB-LT7hQfxYHipu3f1jfgeQkbItmGiiWiLmkU9maUNrk7wcvd1y4H8MLr9IT8uqKPSn6bUvTpXrwJutBvAb0TBKm"
            />
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-blue-200 uppercase tracking-wide">
                คณะครุศาสตร์ มหาวิทยาลัยราชภัฏ
              </span>
              <span className="text-[15px] font-bold leading-tight">
                บัตรประจำตัวครูฝึกปฏิบัติการสอน
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="flex items-center gap-4 pt-4">
            <div className="relative shrink-0">
              <img
                alt={profile.name}
                className="w-20 h-24 rounded-xl object-cover ring-2 ring-blue-300/40 shadow-md"
                src={profile.avatarUrl}
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                <span className="material-symbols-outlined text-[12px] block">verified</span>
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1 text-[12px]">
              <span className="text-blue-200 font-medium">ชื่อ-สกุล</span>
              <span className="text-[14px] font-bold text-white truncate">{profile.name}</span>

              <div className="grid grid-cols-2 gap-1 mt-1.5">
                <div>
                  <span className="text-blue-200 text-[11px] block">รหัสนักศึกษา</span>
                  <span className="font-mono font-bold text-white text-[12px]">{profile.studentId}</span>
                </div>
                <div>
                  <span className="text-blue-200 text-[11px] block">ปีการศึกษา</span>
                  <span className="font-bold text-white text-[12px]">2567 (ภาค 1)</span>
                </div>
              </div>

              <div className="mt-1.5">
                <span className="text-blue-200 text-[11px] block">สถานศึกษาฝึกปฏิบัติ</span>
                <span className="text-[11px] font-medium text-blue-100 truncate block">
                  {profile.schoolName}
                </span>
              </div>
            </div>
          </div>

          {/* Card Barcode Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-blue-200">
            <div>
              <span className="block font-mono tracking-widest text-slate-300">
                |||| | |||||| || |||||| |
              </span>
              <span className="text-[9px]">VALID THROUGH: 31 MAR 2025</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-semibold">
              สถานะ: ใช้งานได้
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 font-semibold text-[13px] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>พิมพ์บัตร</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white flex items-center justify-center gap-1.5 font-semibold text-[13px] shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>เสร็จสิ้น</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TraineeProfile } from '../types';

interface ProfileHeroProps {
  profile: TraineeProfile;
  onEditProfile: () => void;
  onViewIdCard: () => void;
  isDark?: boolean;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  onEditProfile,
  onViewIdCard,
  isDark = false,
}) => {
  return (
    <section
      id="profileHeroCard"
      className={`relative w-full rounded-2xl shadow-sm overflow-hidden p-4 flex flex-col gap-3.5 transition-colors duration-200 border ${
        isDark
          ? 'bg-[#18233c] border-slate-800'
          : 'bg-[#f2f3ff] border-[#e2e7ff]'
      }`}
    >
      {/* Subtle Ambient Accent blur */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 w-40 h-40 bg-[#dce1ff]/50 rounded-full blur-2xl pointer-events-none"
      />

      <div className="flex items-center gap-3.5 relative z-10">
        {/* Avatar with status ring and direct change photo action */}
        <div className="relative shrink-0 group">
          <button
            type="button"
            onClick={onEditProfile}
            title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
            className="block relative rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          >
            <img
              alt={profile.name}
              className="w-20 h-20 object-cover shadow-sm bg-[#eaedff] transition-transform duration-200 group-hover:scale-105"
              src={profile.avatarUrl}
            />
            {/* Camera Overlay on Hover / Focus */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              <span className="text-[10px] font-medium leading-none mt-0.5">เปลี่ยนรูป</span>
            </div>
          </button>
          {/* Quick mini camera badge indicator */}
          <button
            type="button"
            onClick={onEditProfile}
            title="เปลี่ยนรูปโปรไฟล์"
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#18233c] cursor-pointer transition-transform hover:scale-110"
          >
            <span className="material-symbols-outlined text-[13px]">photo_camera</span>
          </button>
          {/* Verified status checkmark badge */}
          <span
            title="ยืนยันตัวตนแล้ว"
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs pointer-events-none"
          >
            <span className="w-4 h-4 rounded-full bg-[#004a31] flex items-center justify-center">
              <span className="material-symbols-outlined text-[11px] text-white font-bold">
                check
              </span>
            </span>
          </span>
        </div>

        {/* Identity & Status */}
        <div className="flex flex-col min-w-0 flex-1">
          <h2
            className={`text-[18px] font-bold leading-snug truncate ${
              isDark ? 'text-white' : 'text-[#131b2e]'
            }`}
          >
            {profile.name}
          </h2>
          <p
            className={`text-[13px] font-mono mt-0.5 ${
              isDark ? 'text-slate-300' : 'text-[#444651]'
            }`}
          >
            รหัส {profile.studentId}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                isDark
                  ? 'bg-blue-950 text-blue-200 border border-blue-800/60'
                  : 'bg-[#cce5ff] text-[#001d31]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#006398] animate-pulse" />
              {profile.status}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Profile Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
        <button
          id="editProfileModalTrigger"
          type="button"
          onClick={onEditProfile}
          className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[14px] font-semibold shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          <span>แก้ไขโปรไฟล์</span>
        </button>
        <button
          id="viewIdCardBtn"
          type="button"
          onClick={onViewIdCard}
          className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-[14px] font-semibold active:scale-[0.98] transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-blue-200'
              : 'bg-[#eaedff] hover:bg-[#dae2fd] text-[#1e3a8a]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>บัตรประจำตัวครูฝึก</span>
        </button>
      </div>

      {/* Mini Banner: Practicum Quick Summary */}
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
          isDark
            ? 'bg-slate-800/80 text-slate-200'
            : 'bg-[#dae2fd]/60 text-[#444651]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="material-symbols-outlined text-[#006398] text-[20px] shrink-0">
            school
          </span>
          <span className="text-[12px] font-semibold truncate">
            {profile.schoolName}
          </span>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
            isDark
              ? 'bg-slate-900 text-blue-300'
              : 'bg-white text-[#1e3a8a] shadow-xs'
          }`}
        >
          {profile.educationLevel}
        </span>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  TraineeProfile,
  DashboardStats,
  TaskItem,
  AnnouncementItem,
} from '../../types';

interface HomeViewProps {
  profile: TraineeProfile;
  stats: DashboardStats;
  tasks?: TaskItem[];
  announcements?: AnnouncementItem[];
  onUpdateStats: (stats: DashboardStats) => void;
  onUpdateTasks?: (tasks: TaskItem[]) => void;
  onUpdateAnnouncements?: (announcements: AnnouncementItem[]) => void;
  onNavigateToSettings: () => void;
  onNavigateToWeekly: () => void;
  onNavigateToSchool: () => void;
  onNavigateToAcademics: () => void;
  onShowToast: (msg: string) => void;
  isDark?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  stats,
  onUpdateStats,
  onNavigateToSettings,
  onNavigateToWeekly,
  onNavigateToSchool,
  onNavigateToAcademics,
  onShowToast,
  isDark = false,
}) => {
  // Modal states
  const [isEditStatsOpen, setIsEditStatsOpen] = useState(false);

  // Form state for editing stats
  const [statsForm, setStatsForm] = useState<DashboardStats>(stats);

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStats(statsForm);
    setIsEditStatsOpen(false);
    onShowToast('✓ อัปเดตสถิติภาพรวมเรียบร้อยแล้ว');
  };

  const weekPercent = Math.min(100, Math.round((stats.currentWeek / stats.totalWeeks) * 100));
  const hoursPercent = Math.min(
    100,
    Math.round((stats.teachingHoursDone / stats.teachingHoursTarget) * 100)
  );
  const plansPercent = Math.min(
    100,
    Math.round((stats.plansSubmitted / stats.plansTotal) * 100)
  );

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Welcome banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between shadow-xs ${
          isDark
            ? 'bg-[#18233c] border-slate-800 text-white'
            : 'bg-white border-slate-100 text-[#131b2e]'
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            alt={profile.name}
            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#cce5ff] shadow-xs cursor-pointer"
            src={profile.avatarUrl}
            onClick={onNavigateToSettings}
            title="คลิกเพื่อจัดการโปรไฟล์"
          />
          <div className="flex flex-col">
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              ยินดีต้อนรับคุณครูฝึกสอน
            </span>
            <span className="text-[16px] font-bold">{profile.name}</span>
            <span className="text-[11px] text-[#006398] dark:text-sky-300 font-medium mt-0.5">
              สัปดาห์ที่ {stats.currentWeek} / {stats.totalWeeks} • {profile.schoolName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setStatsForm(stats);
              setIsEditStatsOpen(true);
            }}
            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 hover:bg-blue-100 cursor-pointer transition-colors"
            title="แก้ไขสถิติภาพรวม"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToSettings}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer transition-colors"
            title="ไปที่การตั้งค่าโปรไฟล์"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>

      {/* Progress Cards Grid with Edit trigger */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Weekly Progress */}
        <div
          onClick={onNavigateToWeekly}
          className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:border-[#1e3a8a]/40 hover:shadow-sm ${
            isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              ความก้าวหน้าบันทึก
            </span>
            <span className="material-symbols-outlined text-[#1e3a8a] text-[20px]">
              edit_calendar
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[22px] font-bold text-[#1e3a8a] dark:text-blue-300">
                {stats.currentWeek}{' '}
                <span className="text-[13px] font-normal text-slate-400">
                  / {stats.totalWeeks} สัปดาห์
                </span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {weekPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#1e3a8a] rounded-full transition-all duration-500"
                style={{ width: `${weekPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Teaching Hours */}
        <div
          onClick={() => {
            setStatsForm(stats);
            setIsEditStatsOpen(true);
          }}
          className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:border-[#006398]/40 hover:shadow-sm ${
            isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              ชั่วโมงปฏิบัติการสอน
            </span>
            <span className="material-symbols-outlined text-[#006398] text-[20px]">
              schedule
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[22px] font-bold text-[#006398] dark:text-sky-300">
                {stats.teachingHoursDone}{' '}
                <span className="text-[13px] font-normal text-slate-400">
                  / {stats.teachingHoursTarget} ชม.
                </span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {hoursPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#006398] rounded-full transition-all duration-500"
                style={{ width: `${hoursPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Lesson Plans */}
        <div
          onClick={onNavigateToAcademics}
          className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:border-amber-500/40 hover:shadow-sm ${
            isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              แผนการจัดการเรียนรู้
            </span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">
              description
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[22px] font-bold text-amber-600 dark:text-amber-400">
                {stats.plansSubmitted}{' '}
                <span className="text-[13px] font-normal text-slate-400">
                  / {stats.plansTotal} แผน
                </span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {plansPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${plansPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Evaluation & Practicum Status */}
        <div
          onClick={onNavigateToSettings}
          className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:border-emerald-500/40 hover:shadow-sm ${
            isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              สถานะการประเมินผล
            </span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              verified
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-[19px] sm:text-[20px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                ผ่านเกณฑ์มาตรฐาน
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                100%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[12px]">
        <button
          type="button"
          onClick={onNavigateToWeekly}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all hover:shadow-xs cursor-pointer ${
            isDark
              ? 'bg-[#18233c] border-slate-800 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-100 text-[#1e3a8a] hover:bg-blue-50/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-emerald-600">
            assignment_turned_in
          </span>
          <span className="text-[11px]">บันทึก 18 สัปดาห์</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToAcademics}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all hover:shadow-xs cursor-pointer ${
            isDark
              ? 'bg-[#18233c] border-slate-800 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-100 text-[#1e3a8a] hover:bg-blue-50/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-[#1e3a8a]">menu_book</span>
          <span className="text-[11px]">งานวิชาการ ({stats.plansSubmitted} แผน)</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToSchool}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all hover:shadow-xs cursor-pointer ${
            isDark
              ? 'bg-[#18233c] border-slate-800 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-100 text-[#1e3a8a] hover:bg-blue-50/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-[#006398]">domain</span>
          <span className="text-[11px]">สถานศึกษา & รูป</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToSettings}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all hover:shadow-xs cursor-pointer ${
            isDark
              ? 'bg-[#18233c] border-slate-800 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-100 text-[#1e3a8a] hover:bg-blue-50/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-purple-600">badge</span>
          <span className="text-[11px]">บัตรประจำตัวครู</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatsForm(stats);
            setIsEditStatsOpen(true);
          }}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition-all hover:shadow-xs cursor-pointer col-span-2 sm:col-span-1 ${
            isDark
              ? 'bg-[#18233c] border-slate-800 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-100 text-[#1e3a8a] hover:bg-blue-50/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-blue-600">tune</span>
          <span className="text-[11px]">ปรับแก้สถิติ</span>
        </button>
      </div>

      {/* Website Desktop Bento Grid: Left (8 cols) & Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Overview of Teacher Practicum Report */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-3.5 ${
              isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[22px]">
                  menu_book
                </span>
                <h4 className="text-[15px] font-bold">
                  รายงานการฝึกสอนประสบการณ์วิชาชีพครู
                </h4>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-[#1e3a8a] dark:bg-blue-950/60 dark:text-blue-300">
                {profile.term}
              </span>
            </div>

            {/* Practicum Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12.5px]">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#1e3a8a] dark:text-blue-300 shrink-0 mt-0.5">
                  school
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium">สถานศึกษาที่ปฏิบัติการสอน</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {profile.schoolName}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#006398] dark:text-sky-300 shrink-0 mt-0.5">
                  class
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium">สาขาวิชา / กลุ่มสาระ</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {profile.major} • {profile.department}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                  event_available
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium">ความคืบหน้ารวม</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    สัปดาห์ที่ {stats.currentWeek} จากทั้งหมด {stats.totalWeeks} สัปดาห์ ({weekPercent}%)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">
                  description
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium">แผนการจัดการเรียนรู้</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    บันทึกแล้ว {stats.plansSubmitted} จาก {stats.plansTotal} แผน ({plansPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Action button to weekly log */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={onNavigateToWeekly}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>เปิดสมุดบันทึก 18 สัปดาห์</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToSchool}
                className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="ดูข้อมูลสถานศึกษาและคลังรูปภาพ"
              >
                <span className="material-symbols-outlined text-[18px]">photo_library</span>
                <span>รูปสถานศึกษา</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Faculty standards & Quick Info Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-3 ${
              isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[20px]">
                verified
              </span>
              <h4 className="text-[14px] font-bold">ข้อมูลการนิเทศและมาตรฐาน</h4>
            </div>

            <div className="flex flex-col gap-2.5 text-[12px]">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10.5px]">อาจารย์นิเทศก์ประจำกลุ่ม</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {profile.supervisorName || 'ผศ.ดร.สมเกียรติ สว่างวงศ์'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10.5px]">ครูพี่เลี้ยงประจำโรงเรียน</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {profile.mentorName || 'อาจารย์ศิริพร บุญยืน'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold text-[11.5px]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>สถานะบันทึกออนไลน์</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  ข้อมูลทั้งหมดบันทึกในเครื่องอัตโนมัติ พร้อมส่งออกไฟล์สำรองได้ตลอดเวลา
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL: EDIT DASHBOARD STATS
         ======================================================== */}
      {isEditStatsOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
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
                  tune
                </span>
                <h4 className="text-[17px] font-bold">แก้ไขสถิติความก้าวหน้า</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditStatsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveStats} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    สัปดาห์ปัจจุบัน
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={statsForm.currentWeek}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        currentWeek: parseInt(e.target.value) || 1,
                      })
                    }
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    จำนวนสัปดาห์ทั้งหมด
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={statsForm.totalWeeks}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        totalWeeks: parseInt(e.target.value) || 18,
                      })
                    }
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ชั่วโมงสอนสะสม (ชม.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={statsForm.teachingHoursDone}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        teachingHoursDone: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    เป้าหมายชั่วโมง (ชม.)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={statsForm.teachingHoursTarget}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        teachingHoursTarget: parseInt(e.target.value) || 200,
                      })
                    }
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    แผนการสอนที่ส่งแล้ว
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={statsForm.plansSubmitted}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        plansSubmitted: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    จำนวนแผนทั้งหมด
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={statsForm.plansTotal}
                    onChange={(e) =>
                      setStatsForm({
                        ...statsForm,
                        plansTotal: parseInt(e.target.value) || 18,
                      })
                    }
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditStatsOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] shadow-xs cursor-pointer"
                >
                  บันทึกสถิติ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';

interface PracticumSectionProps {
  onOpenDocs: () => void;
  onOpenSchool: () => void;
  onOpenMentors: () => void;
  termString?: string;
  isDark?: boolean;
}

export const PracticumSection: React.FC<PracticumSectionProps> = ({
  onOpenDocs,
  onOpenSchool,
  onOpenMentors,
  termString = 'ภาคเรียนที่ 1/2569',
  isDark = false,
}) => {
  return (
    <section className="flex flex-col gap-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]" />
          <h3
            className={`text-[17px] font-bold ${
              isDark ? 'text-blue-300' : 'text-[#1e3a8a]'
            }`}
          >
            ข้อมูลการฝึกสอนและสถานศึกษา
          </h3>
        </div>
        <span
          className={`text-[12px] font-medium ${
            isDark ? 'text-slate-400' : 'text-[#444651]'
          }`}
        >
          หมวดที่ 1
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
        {/* Item 1: Personal & Documents */}
        <button
          type="button"
          onClick={onOpenDocs}
          className={`w-full flex items-center justify-between p-4 text-left transition-colors group cursor-pointer ${
            isDark ? 'hover:bg-slate-800/60' : 'hover:bg-[#f2f3ff]'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#1e3a8a] shrink-0">
              <span className="material-symbols-outlined text-[22px]">assignment_ind</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[14px] font-semibold transition-colors group-hover:text-[#1e3a8a] ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                ข้อมูลส่วนตัวและเอกสารประจำตัว
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                ประวัติย่อ, สำเนาบัตรนักศึกษา, หนังสือส่งตัว
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-[11px] font-semibold text-[#004a31] bg-[#6ffbbe]/40 px-2 py-0.5 rounded-full">
              สมบูรณ์
            </span>
            <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>

        <div className={`h-[1px] mx-4 ${isDark ? 'bg-slate-800' : 'bg-[#e2e7ff]'}`} />

        {/* Item 2: School info */}
        <button
          type="button"
          onClick={onOpenSchool}
          className={`w-full flex items-center justify-between p-4 text-left transition-colors group cursor-pointer ${
            isDark ? 'hover:bg-slate-800/60' : 'hover:bg-[#f2f3ff]'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#cce5ff] flex items-center justify-center text-[#006398] shrink-0">
              <span className="material-symbols-outlined text-[22px]">apartment</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[14px] font-semibold transition-colors group-hover:text-[#006398] ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                จัดการข้อมูลโรงเรียนฝึกสอน
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                แผนผังโรงเรียน, กลุ่มสาระการเรียนรู้, ที่ตั้ง
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

        {/* Item 3: Mentors & Supervisors */}
        <button
          type="button"
          onClick={onOpenMentors}
          className={`w-full flex items-center justify-between p-4 text-left transition-colors group cursor-pointer ${
            isDark ? 'hover:bg-slate-800/60' : 'hover:bg-[#f2f3ff]'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#1e3a8a] shrink-0">
              <span className="material-symbols-outlined text-[22px]">supervisor_account</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[14px] font-semibold transition-colors group-hover:text-[#1e3a8a] ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                ครูพี่เลี้ยงและอาจารย์นิเทศก์
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                อ.วิชัย เกียรติสกุล, ผศ.ดร.พรพิมล (2 ท่าน)
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

        {/* Item 4: Term & Academic Year */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-[#eaedff] text-[#444651]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[14px] font-semibold ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                ภาคเรียน / ปีการศึกษา
              </span>
              <span
                className={`text-[13px] ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                หลักสูตรฝึกประสบการณ์ 1 ปี
              </span>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            <span
              className={`px-2.5 py-1 rounded-lg font-bold text-[13px] ${
                isDark
                  ? 'bg-blue-950 text-blue-300 border border-blue-900'
                  : 'bg-[#e2e7ff] text-[#1e3a8a]'
              }`}
            >
              {termString}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

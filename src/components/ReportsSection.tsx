import React, { useState } from 'react';

interface ReportsSectionProps {
  onOpenAttendance: () => void;
  showToast: (msg: string) => void;
  backupEmail?: string;
  isDark?: boolean;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  onOpenAttendance,
  showToast,
  backupEmail = 'siriporn.b@edu.ac.th',
  isDark = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [backupSync, setBackupSync] = useState(true);

  const handleExport = () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportDone(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportDone(true);
      showToast('ระบบสร้างและดาวน์โหลดไฟล์ E-Portfolio (PDF) เรียบร้อยแล้ว');
      setTimeout(() => {
        setExportDone(false);
      }, 3000);
    }, 1600);
  };

  const handleToggleBackup = (checked: boolean) => {
    setBackupSync(checked);
    showToast(
      checked
        ? 'เปิดการสำรองข้อมูลอัตโนมัติบน Google Drive แล้ว'
        : 'ปิดการสำรองข้อมูลอัตโนมัติชั่วคราว'
    );
  };

  return (
    <section className="flex flex-col gap-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#006398]" />
          <h3
            className={`text-[17px] font-bold ${
              isDark ? 'text-sky-300' : 'text-[#006398]'
            }`}
          >
            ระบบรายงานและเอกสาร
          </h3>
        </div>
        <span
          className={`text-[12px] font-medium ${
            isDark ? 'text-slate-400' : 'text-[#444651]'
          }`}
        >
          หมวดที่ 2
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
        {/* Item 1: Full E-Portfolio Export */}
        <div
          className={`p-4 flex flex-col gap-3 transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-[#18233c] via-slate-800/40 to-slate-800/80'
              : 'bg-gradient-to-br from-white via-[#f2f3ff]/40 to-[#f2f3ff]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[14px] font-bold ${
                    isDark ? 'text-white' : 'text-[#131b2e]'
                  }`}
                >
                  ส่งออกเล่มรายงานการฝึกสอนฉบับสมบูรณ์
                </span>
                <span
                  className={`text-[13px] mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-[#444651]'
                  }`}
                >
                  รวมแผนการสอน 18 สัปดาห์ บันทึก และลายเซ็นรับรอง
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span
              className={`text-[11px] ${
                isDark ? 'text-slate-400' : 'text-[#444651]'
              }`}
            >
              รูปแบบ E-Portfolio (PDF) พร้อมสารบัญ
            </span>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-[12px] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer ${
                exportDone
                  ? 'bg-[#004a31] text-white'
                  : 'bg-[#1e3a8a] hover:bg-[#1e40af] text-white'
              }`}
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>กำลังประมวลผล...</span>
                </>
              ) : exportDone ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>ดาวน์โหลดสำเร็จ</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className={`h-[1px] mx-4 ${isDark ? 'bg-slate-800' : 'bg-[#e2e7ff]'}`} />

        {/* Item 2: Cloud Backup & Firebase Sync */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDark ? 'bg-slate-800 text-sky-400' : 'bg-[#e2e7ff] text-[#006398]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <span
                className={`text-[14px] font-semibold ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                สำรองข้อมูลบันทึก 18 สัปดาห์ & งานวิชาการ
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                เชื่อมต่อฐานข้อมูล Firebase: Teaching-Internship
              </span>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={backupSync}
                onChange={(e) => handleToggleBackup(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00236f]" />
            </label>
          </div>
        </div>

        <div className={`h-[1px] mx-4 ${isDark ? 'bg-slate-800' : 'bg-[#e2e7ff]'}`} />

        {/* Item 3: Attendance Sheets */}
        <button
          type="button"
          onClick={onOpenAttendance}
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
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[14px] font-semibold transition-colors group-hover:text-[#1e3a8a] ${
                  isDark ? 'text-white' : 'text-[#131b2e]'
                }`}
              >
                ใบลงเวลาปฏิบัติราชการ (Attendance)
              </span>
              <span
                className={`text-[13px] truncate ${
                  isDark ? 'text-slate-400' : 'text-[#444651]'
                }`}
              >
                ประวัติเวลาเข้า-ออกงาน และสรุปวันลา 92 วันทำการ
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        </button>
      </div>
    </section>
  );
};

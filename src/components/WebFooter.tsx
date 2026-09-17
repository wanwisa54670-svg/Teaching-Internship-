import React from 'react';
import { ActiveTab } from '../types';

interface WebFooterProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onSaveAll?: () => void;
  isDark?: boolean;
}

export const WebFooter: React.FC<WebFooterProps> = ({
  activeTab,
  onChangeTab,
  onSaveAll,
  isDark = false,
}) => {
  return (
    <footer
      id="mainWebFooter"
      className={`w-full mt-12 border-t transition-colors duration-200 ${
        isDark
          ? 'bg-[#10172a] border-slate-800 text-slate-400'
          : 'bg-white border-slate-200/80 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Faculty info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                alt="Teacher Practicum Emblem"
                className="h-10 w-auto object-contain drop-shadow-xs"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VdlbsRjovBR-L3yNXPkaZ2z7jfGR4oGWcIE1EReLLlYHTIHs82WaL5uphJsPcFvWLnjbb_fH0phiR_DcfeobKywoL0mjGGzGzHH0tsxsKKuUKjGf7dZl8Osl_PwIYLSC8KA2lB1FOo7la4HITYbSFPMKCajcFyhubNTB-LT7hQfxYHipu3f1jfgeQkbItmGiiWiLmkU9maUNrk7wcvd1y4H8MLr9IT8uqKPSn6bUvTpXrwJutBvAb0TBKm"
              />
              <div className="flex flex-col">
                <span
                  className={`text-[15px] font-bold ${
                    isDark ? 'text-white' : 'text-[#1e3a8a]'
                  }`}
                >
                  ระบบรายงานการฝึกสอนประสบการณ์วิชาชีพครู
                </span>
                <span className="text-[12px] text-slate-400">
                  Teacher Practicum Management System (v2.4.0)
                </span>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed max-w-lg mt-1 text-slate-500 dark:text-slate-400">
              เว็บไซต์สารสนเทศเพื่อการบันทึกรายงานการฝึกประสบการณ์วิชาชีพครู บันทึกรายวัน 18 สัปดาห์
              แผนการจัดการเรียนรู้ วิจัยในชั้นเรียน และคลังภาพกิจกรรม คณะครุศาสตร์ มหาวิทยาลัยราชภัฏ
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                เชื่อมต่อ Firebase: Teaching-Internship • คลาวด์เรียลไทม์
              </span>
              {onSaveAll && (
                <button
                  type="button"
                  onClick={onSaveAll}
                  className="text-[11.5px] text-[#1e3a8a] dark:text-blue-300 hover:underline font-semibold cursor-pointer"
                >
                  กดเพื่อบันทึกข้อมูลเดี๋ยวนี้
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <span
              className={`text-[13px] font-bold tracking-wider uppercase ${
                isDark ? 'text-slate-200' : 'text-[#1e3a8a]'
              }`}
            >
              เมนูหลักเว็บไซต์
            </span>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li>
                <button
                  type="button"
                  onClick={() => onChangeTab('home')}
                  className={`hover:underline cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'home'
                      ? 'text-[#1e3a8a] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  <span>หน้าแรก (แดชบอร์ด)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onChangeTab('weekly-log')}
                  className={`hover:underline cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'weekly-log'
                      ? 'text-[#1e3a8a] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                  <span>สมุดบันทึก 18 สัปดาห์</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onChangeTab('academics')}
                  className={`hover:underline cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'academics'
                      ? 'text-[#1e3a8a] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>งานวิชาการ & แผนการสอน</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onChangeTab('school')}
                  className={`hover:underline cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'school'
                      ? 'text-[#1e3a8a] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">domain</span>
                  <span>ข้อมูลสถานศึกษา & รูปถ่าย</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onChangeTab('settings')}
                  className={`hover:underline cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'text-[#1e3a8a] dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                  <span>ข้อมูลนักศึกษา & ตั้งค่า</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional & Standards */}
          <div className="flex flex-col gap-2.5">
            <span
              className={`text-[13px] font-bold tracking-wider uppercase ${
                isDark ? 'text-slate-200' : 'text-[#1e3a8a]'
              }`}
            >
              มาตรฐานการฝึกสอน
            </span>
            <div className="flex flex-col gap-2 text-[12.5px] text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5 shrink-0">
                  check_circle
                </span>
                <span>เกณฑ์ชั่วโมงสอนขั้นต่ำ 180 ชม./ภาคเรียน</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5 shrink-0">
                  check_circle
                </span>
                <span>บันทึกการปฏิบัติงานครบถ้วน 18 สัปดาห์</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5 shrink-0">
                  check_circle
                </span>
                <span>แผนการสอนและงานวิจัยในชั้นเรียน</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5 shrink-0">
                  check_circle
                </span>
                <span>การประเมินจากอาจารย์นิเทศก์ & ครูพี่เลี้ยง</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-400">
          <div>
            © 2026 ระบบสารสนเทศรายงานการฝึกประสบการณ์วิชาชีพครู • คณะครุศาสตร์ มหาวิทยาลัยราชภัฏ
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>ความปลอดภัยของข้อมูลในเครื่อง</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>ภาคเรียนที่ 1/2569</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

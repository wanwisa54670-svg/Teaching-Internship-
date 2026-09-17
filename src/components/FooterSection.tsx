import React from 'react';

interface FooterSectionProps {
  isDark?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ isDark = false }) => {
  return (
    <section className="pt-2 flex flex-col gap-4 pb-2">
      {/* App Version & Institutional Credit Footer */}
      <div className="flex flex-col items-center justify-center text-center gap-1 py-1">
        <div
          className={`flex items-center gap-1.5 text-[12px] font-medium ${
            isDark ? 'text-slate-400' : 'text-[#444651]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[16px] ${
              isDark ? 'text-blue-400' : 'text-[#1e3a8a]'
            }`}
          >
            verified
          </span>
          <span>ระบบรายงานการฝึกประสบการณ์วิชาชีพครู v2.4.0</span>
        </div>
        <p
          className={`text-[11px] max-w-sm ${
            isDark ? 'text-slate-500' : 'text-[#444651]/80'
          }`}
        >
          ข้อมูลทั้งหมดถูกจัดเก็บและประมวลผลอย่างปลอดภัย •
          คณะครุศาสตร์-ศึกษาศาสตร์
        </p>
      </div>
    </section>
  );
};

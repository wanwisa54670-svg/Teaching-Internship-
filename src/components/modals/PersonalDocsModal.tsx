import React from 'react';

interface PersonalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const PersonalDocsModal: React.FC<PersonalDocsModalProps> = ({
  isOpen,
  onClose,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const docs = [
    { name: 'ประวัติย่อและแฟ้มสะสมงาน (Resume)', status: 'อนุมัติแล้ว', date: '15 พ.ค. 2567', icon: 'badge' },
    { name: 'สำเนาบัตรประจำตัวนักศึกษา', status: 'อนุมัติแล้ว', date: '15 พ.ค. 2567', icon: 'credit_card' },
    { name: 'หนังสือส่งตัวจากมหาวิทยาลัย', status: 'อนุมัติแล้ว', date: '20 พ.ค. 2567', icon: 'forward_to_inbox' },
    { name: 'ใบรับรองแพทย์ตรวจสุขภาพ', status: 'อนุมัติแล้ว', date: '18 พ.ค. 2567', icon: 'medical_services' },
    { name: 'บันทึกการปฐมนิเทศก่อนฝึกสอน', status: 'อนุมัติแล้ว', date: '25 พ.ค. 2567', icon: 'school' },
  ];

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
              assignment_ind
            </span>
            <h4 className="text-[17px] font-bold">ข้อมูลส่วนตัวและเอกสารประจำตัว</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[13px]">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>เอกสารทั้งหมดได้รับการตรวจรับรองจากฝ่ายฝึกประสบการณ์วิชาชีพแล้ว</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {docs.map((doc, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDark
                  ? 'bg-slate-800/60 border-slate-700'
                  : 'bg-[#faf8ff] border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-lg bg-[#dce1ff] text-[#1e3a8a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{doc.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold truncate">{doc.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    อัปโหลด: {doc.date}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                {doc.status}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-1 w-full h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] transition-colors cursor-pointer"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

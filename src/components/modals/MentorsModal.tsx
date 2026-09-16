import React, { useState } from 'react';

export interface MentorsData {
  schoolMentor: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  universitySupervisor: {
    name: string;
    position: string;
    phone: string;
    email: string;
    visitsDone: number;
    visitsTotal: number;
  };
}

interface MentorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentors: MentorsData;
  onUpdateMentors: (updated: MentorsData) => void;
  isDark?: boolean;
}

export const MentorsModal: React.FC<MentorsModalProps> = ({
  isOpen,
  onClose,
  mentors,
  onUpdateMentors,
  isDark = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MentorsData>(mentors);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMentors(formData);
    setIsEditing(false);
  };

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
              supervisor_account
            </span>
            <h4 className="text-[17px] font-bold">ครูพี่เลี้ยงและอาจารย์นิเทศก์</h4>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setFormData(mentors);
                setIsEditing(!isEditing);
              }}
              className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isEditing ? 'visibility' : 'edit'}
              </span>
              <span>{isEditing ? 'ดูข้อมูล' : 'แก้ไข'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-3.5">
            <h5 className="text-[13px] font-bold text-[#1e3a8a] dark:text-blue-300">
              1. ข้อมูลครูพี่เลี้ยงประจำสถานศึกษา
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={formData.schoolMentor.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schoolMentor: { ...formData.schoolMentor, name: e.target.value },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">ตำแหน่ง / สาระ</label>
                <input
                  type="text"
                  value={formData.schoolMentor.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schoolMentor: { ...formData.schoolMentor, position: e.target.value },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={formData.schoolMentor.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schoolMentor: { ...formData.schoolMentor, phone: e.target.value },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">อีเมล</label>
                <input
                  type="email"
                  value={formData.schoolMentor.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schoolMentor: { ...formData.schoolMentor, email: e.target.value },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <h5 className="text-[13px] font-bold text-indigo-700 dark:text-indigo-300 pt-2 border-t border-slate-200/60">
              2. ข้อมูลอาจารย์นิเทศก์ประจำมหาวิทยาลัย
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={formData.universitySupervisor.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      universitySupervisor: {
                        ...formData.universitySupervisor,
                        name: e.target.value,
                      },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">ภาควิชา / คณะ</label>
                <input
                  type="text"
                  value={formData.universitySupervisor.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      universitySupervisor: {
                        ...formData.universitySupervisor,
                        position: e.target.value,
                      },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={formData.universitySupervisor.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      universitySupervisor: {
                        ...formData.universitySupervisor,
                        phone: e.target.value,
                      },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">อีเมล</label>
                <input
                  type="email"
                  value={formData.universitySupervisor.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      universitySupervisor: {
                        ...formData.universitySupervisor,
                        email: e.target.value,
                      },
                    })
                  }
                  required
                  className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] shadow-xs cursor-pointer"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Mentor 1: School Mentor */}
            <div
              className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-[#faf8ff] border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  ครูพี่เลี้ยงประจำสถานศึกษา
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ให้คำปรึกษาประจำ
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#1e3a8a] dark:text-blue-300 flex items-center justify-center font-bold text-[16px] shrink-0">
                  {mentors.schoolMentor.name.slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[15px]">{mentors.schoolMentor.name}</span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400">
                    {mentors.schoolMentor.position}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                    โทร: {mentors.schoolMentor.phone} • อีเมล: {mentors.schoolMentor.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Mentor 2: University Supervisor */}
            <div
              className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-[#faf8ff] border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                  อาจารย์นิเทศก์ประจำมหาวิทยาลัย
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  นิเทศแล้ว {mentors.universitySupervisor.visitsDone}/
                  {mentors.universitySupervisor.visitsTotal} ครั้ง
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[16px] shrink-0">
                  {mentors.universitySupervisor.name.slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[15px]">
                    {mentors.universitySupervisor.name}
                  </span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400">
                    {mentors.universitySupervisor.position}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                    โทร: {mentors.universitySupervisor.phone} • อีเมล:{' '}
                    {mentors.universitySupervisor.email}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-1 w-full h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </>
        )}
      </div>
    </div>
  );
};

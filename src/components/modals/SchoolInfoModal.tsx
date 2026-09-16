import React, { useState } from 'react';
import { SchoolDetails } from '../../types';

interface SchoolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolDetails;
  onUpdateSchoolInfo: (updated: SchoolDetails) => void;
  onGoToSchoolTab: () => void;
  isDark?: boolean;
}

export const SchoolInfoModal: React.FC<SchoolInfoModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  onUpdateSchoolInfo,
  onGoToSchoolTab,
  isDark = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SchoolDetails>(schoolInfo);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(formData);
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
            <span className="material-symbols-outlined text-[#006398] text-[24px]">
              apartment
            </span>
            <h4 className="text-[17px] font-bold">ข้อมูลโรงเรียนฝึกสอน</h4>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setFormData(schoolInfo);
                setIsEditing(!isEditing);
              }}
              className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isEditing ? 'visibility' : 'edit'}
              </span>
              <span>{isEditing ? 'ดูข้อมูล' : 'แก้ไขข้อมูล'}</span>
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
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                ชื่อโรงเรียน
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                สังกัด
              </label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                required
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ผู้อำนวยการ
                </label>
                <input
                  type="text"
                  value={formData.directorName}
                  onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ครูพี่เลี้ยง
                </label>
                <input
                  type="text"
                  value={formData.mentorName}
                  onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ตำแหน่งหน้าที่ครูพี่เลี้ยง
                </label>
                <input
                  type="text"
                  placeholder="เช่น ครูชำนาญการพิเศษ"
                  value={formData.mentorPosition || ''}
                  onChange={(e) => setFormData({ ...formData, mentorPosition: e.target.value })}
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  รูปภาพครูพี่เลี้ยง (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.mentorPhotoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, mentorPhotoUrl: e.target.value })}
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ภาระงานสอน
                </label>
                <input
                  type="text"
                  value={formData.teachingLoad}
                  onChange={(e) => setFormData({ ...formData, teachingLoad: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ห้องพักครู
                </label>
                <input
                  type="text"
                  value={formData.staffRoom}
                  onChange={(e) => setFormData({ ...formData, staffRoom: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                ที่อยู่โรงเรียน
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
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
            <div className="rounded-2xl p-4 bg-gradient-to-br from-[#cce5ff]/40 to-[#e2e7ff]/30 dark:from-slate-800 dark:to-slate-800/50 border border-blue-100 dark:border-slate-700 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006398] text-[22px]">
                  school
                </span>
                <h5 className="text-[16px] font-bold text-[#1e3a8a] dark:text-blue-300">
                  {schoolInfo.name}
                </h5>
              </div>
              <p className="text-[13px] text-slate-600 dark:text-slate-300">
                {schoolInfo.affiliation} ({schoolInfo.levels})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  ผู้อำนวยการสถานศึกษา
                </span>
                <span className="font-semibold mt-0.5 block">{schoolInfo.directorName}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  ครูพี่เลี้ยงประจำสถานศึกษา
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {schoolInfo.mentorPhotoUrl && (
                    <img
                      src={schoolInfo.mentorPhotoUrl}
                      alt={schoolInfo.mentorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-400 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold block text-[12.5px] truncate">
                      {schoolInfo.mentorName}
                    </span>
                    {schoolInfo.mentorPosition && (
                      <span className="text-[10px] text-slate-400 block truncate">
                        {schoolInfo.mentorPosition}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  ภาระงานสอน
                </span>
                <span className="font-semibold mt-0.5 block">{schoolInfo.teachingLoad}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  ห้องพักครูฝึกสอน
                </span>
                <span className="font-semibold mt-0.5 block">{schoolInfo.staffRoom}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-start gap-2.5 text-[12px]">
              <span className="material-symbols-outlined text-slate-500 shrink-0">location_on</span>
              <div>
                <span className="font-semibold block text-slate-700 dark:text-slate-300">
                  ที่ตั้งสถานศึกษา:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {schoolInfo.address} • โทร: {schoolInfo.phone}
                </span>
              </div>
            </div>

            {/* School Photos preview banner */}
            <div
              onClick={() => {
                onClose();
                onGoToSchoolTab();
              }}
              className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[22px]">
                  photo_library
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#1e3a8a] dark:text-blue-300">
                    อัลบั้มรูปภาพสถานศึกษา ({schoolInfo.photos.length} รูป)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    กดที่นี่เพื่อไปยังหน้าใส่รูปและดูรูปภาพสถานศึกษา
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                chevron_right
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToSchoolTab();
                }}
                className="flex-1 h-11 rounded-xl bg-[#004a31] hover:bg-[#005f3f] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                <span>ไปหน้าใส่รูปสถานศึกษา</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] transition-colors cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

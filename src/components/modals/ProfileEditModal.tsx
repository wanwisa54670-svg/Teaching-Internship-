import React, { useState, useEffect, useRef } from 'react';
import { TraineeProfile } from '../../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TraineeProfile;
  onSave: (updated: TraineeProfile) => void;
  isDark?: boolean;
}

const PRESET_AVATARS = [
  {
    label: 'ชุดนักศึกษา (ปัจจุบัน)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvAaCO8VzSaXFEfdx7noVJ0CkGU2lWWkJaoDGraTJpt8q0BL_dB332T9_D5CGA1-rIWN5gtlfdRR33Rgm-vJ6pP6U8EjNtfjbc3pfGYHg5yrMP23-ldx0UGAlSea-rIDDFwMhoYQpriDu45_A7WPZNjSmWPeyyNBd77FrNBYfGgLGh8rwmDF7QexqD-qMTkUztjcUH5pgl8PWvbvWZ6AY4ueOVSjSL_90dixxzwsLFXIyhUbJUnDwjSw',
  },
  {
    label: 'ภาพถ่ายทางการ 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'ภาพถ่ายทางการ 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'ครูฝึกชาย',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  isDark = false,
}) => {
  const [formData, setFormData] = useState<TraineeProfile>(profile);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setShowUrlInput(false);
      setCustomUrl('');
      setUploadError(null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์ใหญ่เกิน 8 MB กรุณาเลือกไฟล์รูปภาพที่มีขนาดเล็กลง');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: event.target!.result as string,
        }));
      }
    };
    reader.onerror = () => {
      setUploadError('เกิดข้อผิดพลาดในการโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      avatarUrl: customUrl.trim(),
    }));
    setShowUrlInput(false);
    setCustomUrl('');
    setUploadError(null);
  };

  const handleResetToDefault = () => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: profile.avatarUrl,
    }));
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="profileEditModal"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:items-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto transition-all ${
          isDark
            ? 'bg-[#18233c] text-white border border-slate-700'
            : 'bg-white text-[#131b2e]'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1e3a8a] text-[26px]">
              manage_accounts
            </span>
            <h4 className="text-[18px] font-bold">แก้ไขข้อมูลและรูปโปรไฟล์</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Section 1: Profile Photo Editing */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-800/60 border-slate-700'
              : 'bg-[#f8faff] border-[#e2e7ff]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold flex items-center gap-1.5 text-[#1e3a8a] dark:text-blue-300">
              <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
              รูปประจำตัวครูฝึกสอน (Profile Picture)
            </span>
            {formData.avatarUrl !== profile.avatarUrl && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                คืนค่ารูปเดิม
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Avatar Preview with Drag & Drop target */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              title="คลิกหรือลากไฟล์ภาพมาวางเพื่อเปลี่ยนรูป"
              className={`relative group w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                isDragging
                  ? 'border-blue-500 scale-105 shadow-md ring-4 ring-blue-300/40'
                  : 'border-[#1e3a8a]/40 hover:border-[#1e3a8a] shadow-sm'
              }`}
            >
              <img
                src={formData.avatarUrl}
                alt="รูปตัวอย่างโปรไฟล์"
                className="w-full h-full object-cover bg-slate-100 dark:bg-slate-800"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[24px]">upload</span>
                <span className="text-[10px] font-semibold">อัปโหลด</span>
              </div>
            </div>

            {/* Upload Buttons & Options */}
            <div className="flex-1 flex flex-col gap-2 w-full">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="avatarFileInput"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 min-w-[130px] h-9 px-3 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">file_upload</span>
                  <span>เลือกรูปจากเครื่อง</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className={`h-9 px-3 rounded-xl border text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">link</span>
                  <span>ใส่ลิงก์รูปภาพ</span>
                </button>
              </div>

              {/* URL Input Bar */}
              {showUrlInput && (
                <div className="flex gap-2 animate-in fade-in duration-150">
                  <input
                    type="url"
                    placeholder="วาง URL รูปภาพ (https://...)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 h-8 px-2.5 rounded-lg text-[12px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    disabled={!customUrl.trim()}
                    className="h-8 px-3 rounded-lg bg-[#1e3a8a] disabled:opacity-50 text-white text-[11px] font-semibold cursor-pointer"
                  >
                    ใช้รูปนี้
                  </button>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {uploadError}
                </p>
              )}

              {/* Preset Avatars Selection */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 shrink-0">ภาพตัวอย่าง:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, avatarUrl: preset.url }));
                        setUploadError(null);
                      }}
                      title={preset.label}
                      className={`w-7 h-7 rounded-lg overflow-hidden border transition-transform hover:scale-110 cursor-pointer ${
                        formData.avatarUrl === preset.url
                          ? 'border-2 border-[#1e3a8a] ring-2 ring-blue-400'
                          : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Form Details */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              รหัสนักศึกษา
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                เบอร์โทรศัพท์ติดต่อ
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                ระดับการศึกษา
              </label>
              <input
                type="text"
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                required
                className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              อีเมลสำหรับเอกสารทางการ
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
              กลุ่มสาระการเรียนรู้
            </label>
            <input
              type="text"
              value={formData.subjectGroup}
              onChange={(e) => setFormData({ ...formData, subjectGroup: e.target.value })}
              required
              className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                สถานศึกษาฝึกสอน
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                required
                className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                ภาคเรียน / ปีการศึกษา
              </label>
              <input
                type="text"
                value={formData.term}
                placeholder="เช่น ภาคเรียนที่ 1/2569"
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                required
                className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[14px] focus:ring-2 focus:ring-[#1e3a8a] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[14px] transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[14px] shadow-sm transition-all cursor-pointer"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

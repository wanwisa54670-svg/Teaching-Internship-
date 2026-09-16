import React, { useState, useRef } from 'react';
import { SchoolDetails, SchoolPhoto } from '../../types';

interface SchoolViewProps {
  schoolInfo: SchoolDetails;
  onUpdateSchoolInfo: (updated: SchoolDetails) => void;
  onShowToast: (msg: string) => void;
  isDark?: boolean;
}

export const SchoolView: React.FC<SchoolViewProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  onShowToast,
  isDark = false,
}) => {
  // Category filter for photos
  const [activeCategory, setActiveCategory] = useState<string>('ทั้งหมด');

  // Modals state
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SchoolPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<SchoolPhoto | null>(null);

  // Form state for school details
  const [infoForm, setInfoForm] = useState<SchoolDetails>(schoolInfo);

  // Dedicated Mentor Edit Modal state
  const [isEditMentorOpen, setIsEditMentorOpen] = useState(false);
  const [mentorForm, setMentorForm] = useState<{
    name: string;
    position: string;
    photoUrl: string;
    phone: string;
    email: string;
  }>({
    name: schoolInfo.mentorName || 'อาจารย์วิชัย เกียรติสกุล',
    position: schoolInfo.mentorPosition || 'ครูชำนาญการพิเศษ • กลุ่มสาระการเรียนรู้ภาษาไทย',
    photoUrl:
      schoolInfo.mentorPhotoUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phone: schoolInfo.mentorPhone || '081-445-6789',
    email: schoolInfo.mentorEmail || 'wichai.k@satit.edu',
  });
  const mentorPhotoFileRef = useRef<HTMLInputElement>(null);

  const handleOpenEditMentor = () => {
    setMentorForm({
      name: schoolInfo.mentorName || 'อาจารย์วิชัย เกียรติสกุล',
      position: schoolInfo.mentorPosition || 'ครูชำนาญการพิเศษ • กลุ่มสาระการเรียนรู้ภาษาไทย',
      photoUrl:
        schoolInfo.mentorPhotoUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      phone: schoolInfo.mentorPhone || '081-445-6789',
      email: schoolInfo.mentorEmail || 'wichai.k@satit.edu',
    });
    setIsEditMentorOpen(true);
  };

  const handleMentorPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setMentorForm((prev) => ({
            ...prev,
            photoUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMentor = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolDetails = {
      ...schoolInfo,
      mentorName: mentorForm.name.trim(),
      mentorPosition: mentorForm.position.trim(),
      mentorPhotoUrl: mentorForm.photoUrl.trim(),
      mentorPhone: mentorForm.phone.trim(),
      mentorEmail: mentorForm.email.trim(),
    };
    onUpdateSchoolInfo(updated);
    setIsEditMentorOpen(false);
    onShowToast('✓ บันทึกข้อมูลครูพี่เลี้ยงเรียบร้อยแล้ว');
  };

  // Form state for new / edit photo
  const [photoForm, setPhotoForm] = useState<{
    title: string;
    url: string;
    category: SchoolPhoto['category'];
    caption: string;
  }>({
    title: '',
    url: '',
    category: 'อาคารสถานที่',
    caption: '',
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync infoForm when modal opens
  const handleOpenEditInfo = () => {
    setInfoForm(schoolInfo);
    setIsEditInfoOpen(true);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(infoForm);
    setIsEditInfoOpen(false);
    onShowToast('บันทึกข้อมูลสถานศึกษาเรียบร้อยแล้ว');
  };

  // Photo handlers
  const handleOpenAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: '',
      url: '',
      category: 'อาคารสถานที่',
      caption: '',
    });
    setUploadError(null);
    setIsAddPhotoOpen(true);
  };

  const handleOpenEditPhoto = (photo: SchoolPhoto) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title,
      url: photo.url,
      category: photo.category,
      caption: photo.caption || '',
    });
    setUploadError(null);
    setIsAddPhotoOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('กรุณาเลือกไฟล์ภาพเท่านั้น');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('ไฟล์มีขนาดเกิน 10MB กรุณาเลือกไฟล์ที่เล็กลง');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setPhotoForm((prev) => ({
            ...prev,
            url: event.target!.result as string,
            title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
          }));
          setUploadError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.url.trim()) {
      setUploadError('กรุณาเลือกหรือใส่ลิงก์รูปภาพ');
      return;
    }

    if (editingPhoto) {
      // Update existing photo
      const updatedPhotos = schoolInfo.photos.map((p) =>
        p.id === editingPhoto.id
          ? {
              ...p,
              title: photoForm.title.trim() || 'รูปถ่ายสถานศึกษา',
              url: photoForm.url,
              category: photoForm.category,
              caption: photoForm.caption,
            }
          : p
      );
      onUpdateSchoolInfo({ ...schoolInfo, photos: updatedPhotos });
      onShowToast('แก้ไขข้อมูลรูปภาพสำเร็จ');
    } else {
      // Add new photo
      const newPhoto: SchoolPhoto = {
        id: Date.now().toString(),
        title: photoForm.title.trim() || 'รูปถ่ายสถานศึกษาใหม่',
        url: photoForm.url,
        category: photoForm.category,
        caption: photoForm.caption,
        uploadedAt: 'วันนี้',
      };
      onUpdateSchoolInfo({
        ...schoolInfo,
        photos: [newPhoto, ...schoolInfo.photos],
      });
      onShowToast('เพิ่มรูปสถานศึกษาเรียบร้อยแล้ว');
    }

    setIsAddPhotoOpen(false);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = schoolInfo.photos.filter((p) => p.id !== id);
    onUpdateSchoolInfo({ ...schoolInfo, photos: updated });
    onShowToast('ลบรูปภาพเรียบร้อยแล้ว');
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
  };

  // Filtered photos
  const filteredPhotos =
    activeCategory === 'ทั้งหมด'
      ? schoolInfo.photos
      : schoolInfo.photos.filter((p) => p.category === activeCategory);

  const categories = [
    'ทั้งหมด',
    'อาคารสถานที่',
    'บรรยากาศการสอน',
    'กิจกรรมโรงเรียน',
    'สิ่งอำนวยความสะดวก',
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* School Main Profile Card */}
      <div
        className={`p-5 rounded-2xl border shadow-xs flex flex-col gap-3.5 ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#cce5ff] dark:bg-blue-950 text-[#006398] dark:text-blue-300 flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[30px]">domain</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[18px] font-bold text-[#1e3a8a] dark:text-blue-300">
                {schoolInfo.name}
              </h3>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">
                {schoolInfo.affiliation}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenEditInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>แก้ไขข้อมูล</span>
          </button>
        </div>

        {/* Quick info badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[12px]">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">ระดับที่เปิดสอน</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {schoolInfo.levels}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">กลุ่มสาระฯ</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {schoolInfo.subjectGroup}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">ภาระงานสอน</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {schoolInfo.teachingLoad}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">ห้องพักครู</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {schoolInfo.staffRoom}
            </span>
          </div>
        </div>

        {/* Key personnel & contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] pt-1">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[18px]">
              person
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-slate-400 block">ผู้อำนวยการสถานศึกษา</span>
              <span className="font-semibold truncate block">{schoolInfo.directorName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[18px]">
              supervisor_account
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-slate-400 block">ครูพี่เลี้ยง / หัวหน้ากลุ่มสาระ</span>
              <span className="font-semibold truncate block">{schoolInfo.mentorName}</span>
            </div>
          </div>
        </div>

        {/* Address and telephone */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[12px] flex items-start gap-2">
          <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0 mt-0.5">
            location_on
          </span>
          <div className="flex flex-col">
            <span className="text-slate-700 dark:text-slate-300 leading-snug">
              {schoolInfo.address}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              โทรศัพท์: {schoolInfo.phone}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MENTOR PROFILE CARD (ข้อมูลครูพี่เลี้ยงประจำสถานศึกษา)
         ======================================================== */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-3.5 transition-colors ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">supervisor_account</span>
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                ข้อมูลครูพี่เลี้ยงประจำสถานศึกษา
              </h4>
              <p className="text-[11px] text-slate-400">
                ผู้ควบคุมดูแลและให้คำปรึกษาตลอดการฝึกประสบการณ์วิชาชีพครู
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenEditMentor}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>แก้ไขข้อมูลครูพี่เลี้ยง</span>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-blue-100/70 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Mentor Photo */}
          <div className="relative group shrink-0">
            <img
              src={
                schoolInfo.mentorPhotoUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
              }
              alt={schoolInfo.mentorName}
              className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl object-cover ring-3 ring-blue-200 dark:ring-blue-900 shadow-md"
            />
            <button
              type="button"
              onClick={handleOpenEditMentor}
              className="absolute bottom-1 right-1 w-7 h-7 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
              title="เปลี่ยนรูปครูพี่เลี้ยง"
            >
              <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            </button>
          </div>

          {/* Mentor Details */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-[17px] font-bold text-[#1e3a8a] dark:text-blue-300">
                {schoolInfo.mentorName || 'อาจารย์วิชัย เกียรติสกุล'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-semibold">
                ครูพี่เลี้ยงประจำ
              </span>
            </div>

            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 mt-1">
              {schoolInfo.mentorPosition || 'ครูชำนาญการพิเศษ • กลุ่มสาระการเรียนรู้ภาษาไทย'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 w-full text-[12px]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <span className="material-symbols-outlined text-blue-600 text-[16px] shrink-0">
                  call
                </span>
                <span className="text-slate-600 dark:text-slate-300 truncate">
                  {schoolInfo.mentorPhone || '081-445-6789'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <span className="material-symbols-outlined text-indigo-600 text-[16px] shrink-0">
                  mail
                </span>
                <span className="text-slate-600 dark:text-slate-300 truncate">
                  {schoolInfo.mentorEmail || 'wichai.k@satit.edu'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routine & Schedule Card */}
      <div
        className={`p-4 rounded-2xl border shadow-xs flex flex-col gap-3 ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <h4 className="text-[14px] font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006398] text-[20px]">
              calendar_month
            </span>
            ตารางและหน้าที่การปฏิบัติงาน
          </h4>
          <button
            type="button"
            onClick={handleOpenEditInfo}
            className="text-[11px] font-semibold text-[#1e3a8a] dark:text-blue-300 hover:underline cursor-pointer"
          >
            ปรับตาราง
          </button>
        </div>
        <div className="flex flex-col gap-2 text-[12px]">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              จันทร์ - ศุกร์
            </span>
            <span className="text-slate-500">{schoolInfo.workHours}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              เวรประจำวัน
            </span>
            <span className="text-slate-500">{schoolInfo.dutyDay}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              กิจกรรมชุมนุม
            </span>
            <span className="text-slate-500">{schoolInfo.clubActivity}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          SCHOOL PHOTO GALLERY & UPLOAD SECTION (ภาพถ่ายสถานศึกษา)
         ======================================================== */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-4 ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <h4 className="text-[16px] font-bold flex items-center gap-2 text-[#1e3a8a] dark:text-blue-300">
              <span className="material-symbols-outlined text-[22px]">photo_library</span>
              รูปภาพสถานศึกษาและบรรยากาศ ({schoolInfo.photos.length} รูป)
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              รวมภาพถ่ายอาคารสถานที่ ห้องเรียน และกิจกรรมในโรงเรียนฝึกสอน
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddPhoto}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#004a31] hover:bg-[#005f3f] text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
            <span>+ เพิ่มรูปสถานศึกษา</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="material-symbols-outlined text-[36px] text-slate-300 dark:text-slate-600">
              photo_camera
            </span>
            <p className="text-[13px] text-slate-500">
              ยังไม่มีรูปภาพในหมวดหมู่นี้
            </p>
            <button
              type="button"
              onClick={handleOpenAddPhoto}
              className="mt-1 text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 underline cursor-pointer"
            >
              กดที่นี่เพื่อเพิ่มรูปแรก
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-4/3 bg-slate-100 dark:bg-slate-800/80 shadow-xs transition-all hover:shadow-md"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Category badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium">
                  {photo.category}
                </span>

                {/* Quick actions top-right */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditPhoto(photo);
                    }}
                    title="แก้ไขชื่อ/หมวดหมู่"
                    className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(photo.id);
                    }}
                    title="ลบรูปนี้"
                    className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>

                {/* Bottom caption & click to view */}
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="absolute bottom-0 inset-x-0 p-2.5 text-left text-white flex flex-col justify-end cursor-pointer"
                >
                  <span className="text-[12px] font-bold leading-tight truncate">
                    {photo.title}
                  </span>
                  {photo.caption && (
                    <span className="text-[10px] text-white/80 truncate mt-0.5">
                      {photo.caption}
                    </span>
                  )}
                  <span className="text-[9px] text-white/60 mt-0.5">
                    แตะเพื่อดูภาพขนาดเต็ม
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL 1: EDIT SCHOOL DETAILS MODAL
         ======================================================== */}
      {isEditInfoOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
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
                  edit_note
                </span>
                <h4 className="text-[17px] font-bold">แก้ไขข้อมูลสถานศึกษาฝึกสอน</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditInfoOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveInfo} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ชื่อโรงเรียน / สถานศึกษา
                </label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  สังกัดหน่วยงาน
                </label>
                <input
                  type="text"
                  value={infoForm.affiliation}
                  onChange={(e) => setInfoForm({ ...infoForm, affiliation: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ระดับที่เปิดสอน
                  </label>
                  <input
                    type="text"
                    value={infoForm.levels}
                    onChange={(e) => setInfoForm({ ...infoForm, levels: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    กลุ่มสาระการเรียนรู้
                  </label>
                  <input
                    type="text"
                    value={infoForm.subjectGroup}
                    onChange={(e) => setInfoForm({ ...infoForm, subjectGroup: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ผู้อำนวยการโรงเรียน
                  </label>
                  <input
                    type="text"
                    value={infoForm.directorName}
                    onChange={(e) => setInfoForm({ ...infoForm, directorName: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ครูพี่เลี้ยง / หัวหน้ากลุ่มสาระ
                  </label>
                  <input
                    type="text"
                    value={infoForm.mentorName}
                    onChange={(e) => setInfoForm({ ...infoForm, mentorName: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              {/* Mentor Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ตำแหน่งหน้าที่ครูพี่เลี้ยง
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ครูชำนาญการพิเศษ • กลุ่มสาระภาษาไทย"
                    value={infoForm.mentorPosition || ''}
                    onChange={(e) => setInfoForm({ ...infoForm, mentorPosition: e.target.value })}
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    รูปภาพครูพี่เลี้ยง (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="ลิงก์รูปภาพของครูพี่เลี้ยง..."
                    value={infoForm.mentorPhotoUrl || ''}
                    onChange={(e) => setInfoForm({ ...infoForm, mentorPhotoUrl: e.target.value })}
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    เบอร์โทรศัพท์ครูพี่เลี้ยง
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 081-445-6789"
                    value={infoForm.mentorPhone || ''}
                    onChange={(e) => setInfoForm({ ...infoForm, mentorPhone: e.target.value })}
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    อีเมลครูพี่เลี้ยง
                  </label>
                  <input
                    type="email"
                    placeholder="เช่น wichai.k@satit.edu"
                    value={infoForm.mentorEmail || ''}
                    onChange={(e) => setInfoForm({ ...infoForm, mentorEmail: e.target.value })}
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ภาระงานสอน
                  </label>
                  <input
                    type="text"
                    value={infoForm.teachingLoad}
                    onChange={(e) => setInfoForm({ ...infoForm, teachingLoad: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    ห้องพักครูฝึกสอน
                  </label>
                  <input
                    type="text"
                    value={infoForm.staffRoom}
                    onChange={(e) => setInfoForm({ ...infoForm, staffRoom: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ที่อยู่สถานศึกษา
                </label>
                <input
                  type="text"
                  value={infoForm.address}
                  onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    เวลาปฏิบัติงาน
                  </label>
                  <input
                    type="text"
                    value={infoForm.workHours}
                    onChange={(e) => setInfoForm({ ...infoForm, workHours: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    เวรประจำวัน
                  </label>
                  <input
                    type="text"
                    value={infoForm.dutyDay}
                    onChange={(e) => setInfoForm({ ...infoForm, dutyDay: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  กิจกรรมชุมนุม / ภาระพิเศษ
                </label>
                <input
                  type="text"
                  value={infoForm.clubActivity}
                  onChange={(e) => setInfoForm({ ...infoForm, clubActivity: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditInfoOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] shadow-xs cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD / EDIT PHOTO MODAL
         ======================================================== */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto ${
              isDark
                ? 'bg-[#18233c] text-white border border-slate-700'
                : 'bg-white text-[#131b2e]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004a31] text-[24px]">
                  {editingPhoto ? 'edit_square' : 'add_photo_alternate'}
                </span>
                <h4 className="text-[17px] font-bold">
                  {editingPhoto ? 'แก้ไขรูปภาพสถานศึกษา' : 'เพิ่มรูปภาพสถานศึกษา'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPhotoOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="flex flex-col gap-3.5">
              {/* Photo Preview & Upload Box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ไฟล์รูปภาพ หรือ ลิงก์ URL
                </label>

                {photoForm.url ? (
                  <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 group">
                    <img
                      src={photoForm.url}
                      alt="ตัวอย่างรูปภาพ"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoForm((prev) => ({ ...prev, url: '' }))}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">cached</span>
                      <span>เปลี่ยนรูป</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-16/9 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#004a31] bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors p-4 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#004a31] dark:text-emerald-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold block text-[#004a31] dark:text-emerald-300">
                        กดเพื่อเลือกรูปภาพจากเครื่อง
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        รองรับ PNG, JPG, WebP สูงสุด 10MB
                      </span>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Paste URL option */}
                <div className="flex gap-2 mt-1">
                  <input
                    type="url"
                    placeholder="หรือวางลิงก์รูปภาพ https://..."
                    value={photoForm.url}
                    onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                    className="flex-1 h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-[#004a31]"
                  />
                </div>

                {uploadError && (
                  <span className="text-[11px] text-red-500 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {uploadError}
                  </span>
                )}
              </div>

              {/* Photo Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ชื่อรูปภาพ / สถานที่
                </label>
                <input
                  type="text"
                  placeholder="เช่น อาคารเรียนเฉลิมพระเกียรติ, บรรยากาศห้องเรียนภาษาไทย"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#004a31]"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  หมวดหมู่รูปภาพ
                </label>
                <select
                  value={photoForm.category}
                  onChange={(e) =>
                    setPhotoForm({
                      ...photoForm,
                      category: e.target.value as SchoolPhoto['category'],
                    })
                  }
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#004a31]"
                >
                  <option value="อาคารสถานที่">อาคารสถานที่</option>
                  <option value="บรรยากาศการสอน">บรรยากาศการสอน</option>
                  <option value="กิจกรรมโรงเรียน">กิจกรรมโรงเรียน</option>
                  <option value="สิ่งอำนวยความสะดวก">สิ่งอำนวยความสะดวก</option>
                </select>
              </div>

              {/* Caption */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  คำบรรยายเพิ่มเติม (ระบุหรือไม่ก็ได้)
                </label>
                <input
                  type="text"
                  placeholder="เช่น สถานที่จัดกิจกรรมสัปดาห์วันภาษาไทย"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#004a31]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#004a31] hover:bg-[#005f3f] text-white font-semibold text-[13px] shadow-xs cursor-pointer"
                >
                  {editingPhoto ? 'บันทึกการแก้ไข' : 'เพิ่มรูปภาพ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: FULL PHOTO LIGHTBOX PREVIEW
         ======================================================== */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-[12px] font-medium">
                {selectedPhoto.category}
              </span>
              <span className="text-[14px] font-semibold">{selectedPhoto.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Photo Center */}
          <div className="flex-1 flex items-center justify-center p-2 min-h-0">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom Bar Details */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-4 text-white flex items-center justify-between gap-4 z-10"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-bold truncate">{selectedPhoto.title}</span>
              {selectedPhoto.caption && (
                <span className="text-[12px] text-white/80 mt-0.5 truncate">
                  {selectedPhoto.caption}
                </span>
              )}
              <span className="text-[10px] text-white/60 mt-1">
                สถานศึกษา: {schoolInfo.name}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleOpenEditPhoto(selectedPhoto);
                  setSelectedPhoto(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>แก้ไข</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeletePhoto(selectedPhoto.id)}
                className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                <span>ลบ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT MENTOR INFORMATION (แก้ไขข้อมูลครูพี่เลี้ยง)
         ======================================================== */}
      {isEditMentorOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto ${
              isDark
                ? 'bg-[#18233c] text-white border border-slate-700'
                : 'bg-white text-[#131b2e]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[24px]">
                  supervisor_account
                </span>
                <h4 className="text-[17px] font-bold">แก้ไขข้อมูลครูพี่เลี้ยง</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditMentorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveMentor} className="flex flex-col gap-3.5">
              {/* Photo preview & upload */}
              <div className="flex flex-col items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="relative group">
                  <img
                    src={mentorForm.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                    alt="ครูพี่เลี้ยง"
                    className="w-24 h-24 rounded-2xl object-cover ring-2 ring-[#1e3a8a] shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => mentorPhotoFileRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                    <span className="text-[10px] font-semibold">เปลี่ยนรูป</span>
                  </button>
                </div>

                <input
                  ref={mentorPhotoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMentorPhotoFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => mentorPhotoFileRef.current?.click()}
                  className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>เลือกรูปภาพจากเครื่อง</span>
                </button>

                {/* Or enter photo URL */}
                <div className="w-full flex flex-col gap-1 mt-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    หรือระบุลิงก์รูปภาพ (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={mentorForm.photoUrl}
                    onChange={(e) => setMentorForm({ ...mentorForm, photoUrl: e.target.value })}
                    className="h-8 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] outline-none"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ชื่อ - นามสกุล ครูพี่เลี้ยง
                </label>
                <input
                  type="text"
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  required
                  placeholder="เช่น อาจารย์วิชัย เกียรติสกุล"
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              {/* Position */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ตำแหน่งหน้าที่
                </label>
                <input
                  type="text"
                  value={mentorForm.position}
                  onChange={(e) => setMentorForm({ ...mentorForm, position: e.target.value })}
                  required
                  placeholder="เช่น ครูชำนาญการพิเศษ • กลุ่มสาระการเรียนรู้ภาษาไทย"
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    value={mentorForm.phone}
                    onChange={(e) => setMentorForm({ ...mentorForm, phone: e.target.value })}
                    placeholder="081-445-6789"
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    อีเมลติดต่อ
                  </label>
                  <input
                    type="email"
                    value={mentorForm.email}
                    onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                    placeholder="wichai.k@satit.edu"
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditMentorOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

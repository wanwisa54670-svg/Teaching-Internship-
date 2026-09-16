import React, { useState, useRef } from 'react';
import { AcademicItem } from '../../types';
import { PdfViewerModal } from '../modals/PdfViewerModal';
import { ScheduleImageModal } from '../modals/ScheduleImageModal';

interface AcademicsViewProps {
  items: AcademicItem[];
  onUpdateItems: (items: AcademicItem[]) => void;
  onShowToast: (msg: string) => void;
  isDark?: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'calendar_month', label: 'ตารางสอน' },
  { name: 'menu_book', label: 'แผนการสอน' },
  { name: 'psychology', label: 'วิจัยในชั้นเรียน' },
  { name: 'supervisor_account', label: 'การนิเทศ' },
  { name: 'assignment', label: 'เอกสารวิชาการ' },
  { name: 'verified', label: 'รับรอง / ผ่านเกณฑ์' },
  { name: 'rate_review', label: 'ประเมินผล' },
];

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  items,
  onUpdateItems,
  onShowToast,
  isDark = false,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicItem | null>(null);

  // PDF Viewer Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [activePdfItem, setActivePdfItem] = useState<AcademicItem | null>(null);

  // Schedule Image Viewer Modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [activeScheduleItem, setActiveScheduleItem] = useState<AcademicItem | null>(null);

  // Photo preview modal for supervision
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // File input refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const scheduleImageInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<AcademicItem, 'id'>>({
    title: '',
    desc: '',
    count: '1 รายการ',
    icon: 'menu_book',
    category: 'แผนการสอน',
    status: 'สมบูรณ์',
    fileName: '',
    fileUrl: '',
    fileSize: '',
    scheduleImageUrl: '',
    scheduleImageName: '',
    supervisionDate: '',
    supervisorName: '',
    supervisionDetails: '',
    supervisionPhotos: [],
    scoreOrFeedback: '',
  });

  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');

  const categories = [
    'ทั้งหมด',
    'ตารางสอน',
    'แผนการสอน',
    'วิจัยในชั้นเรียน',
    'รายงานการนิเทศ',
  ];

  const handleOpenAdd = (defaultCat?: AcademicItem['category']) => {
    setEditingItem(null);
    const cat = defaultCat || (filterCategory !== 'ทั้งหมด' ? (filterCategory as AcademicItem['category']) : 'ตารางสอน');
    setFormData({
      title:
        cat === 'ตารางสอน'
          ? 'ตารางสอนประจำภาคเรียนที่ 1/2569'
          : cat === 'วิจัยในชั้นเรียน'
          ? 'วิจัยในชั้นเรียน: การพัฒนาทักษะการเขียนสะกดคำภาษาไทย'
          : cat === 'แผนการสอน'
          ? 'แผนการจัดการเรียนรู้ รายวิชาภาษาไทยพื้นฐาน ม.2'
          : '',
      desc:
        cat === 'ตารางสอน'
          ? 'ตารางสอนรายวิชาภาษาไทยพื้นฐาน ม.2/1 - ม.2/4 และกิจกรรมพัฒนาผู้เรียน รวม 18 คาบ/สัปดาห์'
          : cat === 'วิจัยในชั้นเรียน'
          ? 'การศึกษาผลการจัดการเรียนรู้แบบ Active Learning ร่วมกับแบบฝึกทักษะ เพื่อพัฒนาการเขียนสะกดคำ'
          : '',
      count:
        cat === 'ตารางสอน'
          ? '18 คาบ/สัปดาห์'
          : cat === 'แผนการสอน'
          ? '18 แผน'
          : cat === 'รายงานการนิเทศ'
          ? 'ครั้งที่ 1'
          : '1 ฉบับ',
      icon:
        cat === 'ตารางสอน'
          ? 'calendar_month'
          : cat === 'แผนการสอน'
          ? 'menu_book'
          : cat === 'วิจัยในชั้นเรียน'
          ? 'psychology'
          : 'supervisor_account',
      category: cat,
      status: 'สมบูรณ์',
      fileName:
        cat === 'แผนการสอน'
          ? 'แผนการจัดการเรียนรู้_ม2_ภาษาไทย.pdf'
          : cat === 'วิจัยในชั้นเรียน'
          ? 'รายงานการวิจัยในชั้นเรียน_การเขียนสะกดคำ_ม2.pdf'
          : '',
      fileUrl: '',
      fileSize: cat === 'วิจัยในชั้นเรียน' ? '3.2 MB' : cat === 'แผนการสอน' ? '2.4 MB' : '',
      scheduleImageUrl:
        cat === 'ตารางสอน'
          ? 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop&q=80'
          : '',
      scheduleImageName: cat === 'ตารางสอน' ? 'ตารางสอน_ภาคเรียนที่1_2569.jpg' : '',
      supervisionDate: cat === 'รายงานการนิเทศ' ? '15 ก.ค. 2569' : '',
      supervisorName: cat === 'รายงานการนิเทศ' ? 'ผศ.ดร.พรพิมล รัตนโกสินทร์ และ อ.วิชัย เกียรติสกุล' : '',
      supervisionDetails: '',
      supervisionPhotos: [],
      scoreOrFeedback: 'ดีเด่น (4.85/5.00)',
    });
    setNewPhotoUrlInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AcademicItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      desc: item.desc,
      count: item.count,
      icon: item.icon,
      category: item.category,
      status: item.status,
      fileName: item.fileName || '',
      fileUrl: item.fileUrl || '',
      fileSize: item.fileSize || '',
      scheduleImageUrl: item.scheduleImageUrl || '',
      scheduleImageName: item.scheduleImageName || '',
      supervisionDate: item.supervisionDate || '',
      supervisorName: item.supervisorName || '',
      supervisionDetails: item.supervisionDetails || '',
      supervisionPhotos: item.supervisionPhotos ? [...item.supervisionPhotos] : [],
      scoreOrFeedback: item.scoreOrFeedback || '',
    });
    setNewPhotoUrlInput('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบรายการ "${title}" ใช่หรือไม่?`)) {
      const updated = items.filter((it) => it.id !== id);
      onUpdateItems(updated);
      onShowToast(`ลบรายการ "${title}" เรียบร้อยแล้ว`);
    }
  };

  // PDF File upload handler (Used for แผนการสอน & วิจัยในชั้นเรียน)
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        setFormData((prev) => ({
          ...prev,
          fileName: file.name,
          fileSize: sizeMb,
          fileUrl: event.target!.result as string,
        }));
        onShowToast(`แนบไฟล์ ${file.name} เรียบร้อยแล้ว`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Schedule Image upload handler
  const handleScheduleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          scheduleImageUrl: event.target!.result as string,
          scheduleImageName: file.name,
        }));
        onShowToast(`แนบภาพตารางสอน ${file.name} เรียบร้อยแล้ว`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Supervision photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const url = event.target!.result as string;
        setFormData((prev) => ({
          ...prev,
          supervisionPhotos: [...(prev.supervisionPhotos || []), url],
        }));
        onShowToast('เพิ่มรูปภาพการนิเทศเรียบร้อยแล้ว');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      supervisionPhotos: [...(prev.supervisionPhotos || []), newPhotoUrlInput.trim()],
    }));
    setNewPhotoUrlInput('');
    onShowToast('เพิ่มลิงก์รูปภาพเรียบร้อยแล้ว');
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      supervisionPhotos: (prev.supervisionPhotos || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              title: formData.title.trim(),
              desc: formData.desc.trim(),
              count: formData.count.trim(),
              icon: formData.icon,
              category: formData.category,
              status: formData.status,
              fileName: formData.fileName,
              fileUrl: formData.fileUrl,
              fileSize: formData.fileSize,
              scheduleImageUrl: formData.scheduleImageUrl,
              scheduleImageName: formData.scheduleImageName,
              supervisionDate: formData.supervisionDate,
              supervisorName: formData.supervisorName,
              supervisionDetails: formData.supervisionDetails,
              supervisionPhotos: formData.supervisionPhotos,
              scoreOrFeedback: formData.scoreOrFeedback,
            }
          : it
      );
      onUpdateItems(updated);
      onShowToast(`✓ บันทึกการแก้ไข "${formData.title}" เรียบร้อยแล้ว`);
    } else {
      const newItem: AcademicItem = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        count: formData.count.trim() || '1 รายการ',
        icon: formData.icon,
        category: formData.category,
        status: formData.status,
        fileName: formData.fileName,
        fileUrl: formData.fileUrl,
        fileSize: formData.fileSize,
        scheduleImageUrl: formData.scheduleImageUrl,
        scheduleImageName: formData.scheduleImageName,
        supervisionDate: formData.supervisionDate,
        supervisorName: formData.supervisorName,
        supervisionDetails: formData.supervisionDetails,
        supervisionPhotos: formData.supervisionPhotos,
        scoreOrFeedback: formData.scoreOrFeedback,
      };
      onUpdateItems([newItem, ...items]);
      onShowToast(`✓ เพิ่มเอกสาร "${formData.title}" เรียบร้อยแล้ว`);
    }

    setIsModalOpen(false);
  };

  const handleViewPdf = (item: AcademicItem) => {
    setActivePdfItem(item);
    setPdfModalOpen(true);
  };

  const handleViewScheduleImage = (item: AcademicItem) => {
    setActiveScheduleItem(item);
    setScheduleModalOpen(true);
  };

  const filteredItems = items
    .filter((it) => {
      if (filterCategory === 'ทั้งหมด') return true;
      return it.category === filterCategory;
    })
    .filter((it) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        (it.supervisorName && it.supervisorName.toLowerCase().includes(q))
      );
    });

  return (
    <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <div>
          <h3 className="text-[17px] font-bold text-[#1e3a8a] dark:text-blue-300">
            งานวิชาการและการจัดการเรียนรู้
          </h3>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">
            ตารางสอน • แผนการสอน • วิจัยในชั้นเรียน • รายงานการนิเทศ ({items.length} รายการ)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[12px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ เพิ่มเอกสารวิชาการ</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="ค้นหาตารางสอน, แผนการสอน, วิจัยในชั้นเรียน, รายงานการนิเทศ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-10 pl-9 pr-3 rounded-xl border text-[13px] outline-none transition-all ${
              isDark
                ? 'bg-[#18233c] border-slate-800 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Academic Items List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredItems.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="material-symbols-outlined text-[36px] text-slate-300">
              folder_open
            </span>
            <p className="text-[13px] text-slate-500">ไม่พบรายการผลงานในหมวดหมู่นี้</p>
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 underline cursor-pointer"
            >
              กดที่นี่เพื่อเพิ่มผลงานแรก
            </button>
          </div>
        ) : (
          filteredItems.map((it) => (
            <div
              key={it.id}
              className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-3 transition-all hover:border-[#1e3a8a]/40 ${
                isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0 pr-2">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      it.category === 'ตารางสอน'
                        ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300'
                        : it.category === 'แผนการสอน'
                        ? 'bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300'
                        : it.category === 'วิจัยในชั้นเรียน'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{it.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {it.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          it.category === 'ตารางสอน'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300'
                            : it.category === 'แผนการสอน'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                            : it.category === 'วิจัยในชั้นเรียน'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                        }`}
                      >
                        {it.category}
                      </span>
                    </div>
                    <span className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {it.desc}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-[#e2e7ff] dark:bg-blue-950/80 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-bold">
                    {it.count}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      it.status === 'สมบูรณ์'
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300'
                        : it.status === 'กำลังดำเนินการ'
                        ? 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-slate-600 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {it.status}
                  </span>
                </div>
              </div>

              {/* SPECIFIC VIEW: ตารางสอน (Class Schedule) with Image Attachment */}
              {it.category === 'ตารางสอน' && (
                <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {it.scheduleImageUrl ? (
                      <div
                        onClick={() => handleViewScheduleImage(it)}
                        className="relative w-16 h-14 rounded-xl overflow-hidden border border-sky-200 dark:border-sky-800 shrink-0 cursor-pointer group shadow-2xs"
                      >
                        <img
                          src={it.scheduleImageUrl}
                          alt="ตารางสอน"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {it.scheduleImageName || 'ภาพตารางสอน_ภาคเรียนที่1_2569.jpg'}
                      </span>
                      <span className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                        {it.count} • ไฟล์ภาพตารางสอนประจำสัปดาห์
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewScheduleImage(it)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">image</span>
                      <span>เปิดดูภาพตารางสอน</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(it)}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                      title="แนบรูปใหม่หรือแก้ไข"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>เปลี่ยนรูป</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SPECIFIC VIEW: แผนการสอน และ วิจัยในชั้นเรียน with PDF attachment */}
              {(it.category === 'แผนการสอน' || it.category === 'วิจัยในชั้นเรียน') && (
                <div
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    it.category === 'วิจัยในชั้นเรียน'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40'
                      : 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {it.fileName ||
                          (it.category === 'วิจัยในชั้นเรียน'
                            ? 'รายงานการวิจัยในชั้นเรียน_การเขียนสะกดคำ_ม2.pdf'
                            : 'แผนการจัดการเรียนรู้_ม2_ภาษาไทย.pdf')}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {it.fileSize || (it.category === 'วิจัยในชั้นเรียน' ? '3.2 MB' : '2.4 MB')} •{' '}
                        {it.category === 'วิจัยในชั้นเรียน'
                          ? 'เอกสารงานวิจัยในชั้นเรียน (พร้อมตรวจ)'
                          : 'เอกสารประกอบการสอน (พร้อมตรวจ)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewPdf(it)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>กดดูไฟล์ที่แนบ (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(it)}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                      title="แนบไฟล์ใหม่หรือแก้ไข"
                    >
                      <span className="material-symbols-outlined text-[14px]">attach_file</span>
                      <span>เปลี่ยนไฟล์</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SPECIFIC VIEW: รายงานการนิเทศ (Supervision Report) with details and photos */}
              {it.category === 'รายงานการนิเทศ' && (
                <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex flex-col gap-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[16px] text-purple-600 shrink-0">
                        calendar_today
                      </span>
                      <span>
                        <strong>วันที่นิเทศ:</strong> {it.supervisionDate || '15 ก.ค. 2569'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[16px] text-purple-600 shrink-0">
                        verified
                      </span>
                      <span>
                        <strong>ผลการประเมิน:</strong> {it.scoreOrFeedback || 'ดีเด่น'}
                      </span>
                    </div>
                  </div>

                  {it.supervisorName && (
                    <div className="text-[11.5px] text-slate-600 dark:text-slate-300">
                      <strong>ผู้นิเทศ:</strong> {it.supervisorName}
                    </div>
                  )}

                  {it.supervisionDetails && (
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-purple-100/60 dark:border-purple-900/30 text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-purple-900 dark:text-purple-300 block mb-0.5">
                        บันทึกข้อเสนอแนะจากการนิเทศ:
                      </span>
                      {it.supervisionDetails}
                    </div>
                  )}

                  {/* Supervision Photos Gallery */}
                  {it.supervisionPhotos && it.supervisionPhotos.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                        ภาพถ่ายการนิเทศการสอน ({it.supervisionPhotos.length} ภาพ):
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {it.supervisionPhotos.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPreviewPhotoUrl(imgUrl)}
                            className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer group hover:ring-2 hover:ring-purple-500 transition-all"
                          >
                            <img
                              src={imgUrl}
                              alt={`การนิเทศรูปที่ ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] text-slate-400">
                  รหัสเอกสาร: {it.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(it)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    <span>แก้ไข</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(it.id, it.title)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 text-[11px] font-semibold hover:bg-red-100 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    <span>ลบ</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================
          MODAL: ADD / EDIT ACADEMIC ITEM (WITH FILE & SUPERVISION)
         ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto ${
              isDark
                ? 'bg-[#18233c] text-white border border-slate-700'
                : 'bg-white text-[#131b2e]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[24px]">
                  {editingItem ? 'edit_document' : 'add_circle'}
                </span>
                <h4 className="text-[17px] font-bold">
                  {editingItem ? 'แก้ไขเอกสาร/ผลงานวิชาการ' : 'เพิ่มผลงานวิชาการใหม่'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Category Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  หมวดหมู่ผลงานวิชาการ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['ตารางสอน', 'แผนการสอน', 'วิจัยในชั้นเรียน', 'รายงานการนิเทศ'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          category: cat,
                          icon:
                            cat === 'ตารางสอน'
                              ? 'calendar_month'
                              : cat === 'แผนการสอน'
                              ? 'menu_book'
                              : cat === 'วิจัยในชั้นเรียน'
                              ? 'psychology'
                              : 'supervisor_account',
                          count:
                            cat === 'ตารางสอน'
                              ? '18 คาบ/สัปดาห์'
                              : cat === 'แผนการสอน'
                              ? '18 แผน'
                              : cat === 'รายงานการนิเทศ'
                              ? 'ครั้งที่ 1'
                              : '1 ฉบับ',
                        })
                      }
                      className={`py-2 px-1 text-center rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                        formData.category === cat
                          ? 'border-[#1e3a8a] bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  ชื่อผลงาน / หัวข้อเอกสาร
                </label>
                <input
                  type="text"
                  placeholder={
                    formData.category === 'ตารางสอน'
                      ? 'เช่น ตารางสอนประจำภาคเรียนที่ 1/2569'
                      : formData.category === 'แผนการสอน'
                      ? 'เช่น แผนการจัดการเรียนรู้รายวิชาภาษาไทย ม.2'
                      : formData.category === 'วิจัยในชั้นเรียน'
                      ? 'เช่น การพัฒนาทักษะการเขียนสะกดคำภาษาไทย ม.2'
                      : 'เช่น รายงานการนิเทศการสอน ครั้งที่ 1'
                  }
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  รายละเอียด / สรุปสาระสำคัญ
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    formData.category === 'ตารางสอน'
                      ? 'เช่น ตารางสอน ม.2/1 - ม.2/4 วิชาภาษาไทยพื้นฐาน และกิจกรรมโฮมรูม...'
                      : 'คำอธิบายรายละเอียด เช่น รูปแบบการสอน Active Learning, วัตถุประสงค์...'
                  }
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  required
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none"
                />
              </div>

              {/* SECTION: ตารางสอน (Image Attachment) */}
              {formData.category === 'ตารางสอน' && (
                <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      แนบไฟล์ภาพตารางสอน (รูปภาพ JPG, PNG, WebP)
                    </span>
                    {formData.scheduleImageUrl && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        มีภาพตารางสอนแล้ว
                      </span>
                    )}
                  </div>

                  <input
                    ref={scheduleImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScheduleImageUpload}
                    className="hidden"
                  />

                  {formData.scheduleImageUrl ? (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={formData.scheduleImageUrl}
                          alt="ตารางสอน"
                          className="w-12 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-medium truncate">
                            {formData.scheduleImageName || 'ภาพตารางสอน.jpg'}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            พร้อมเปิดดูภาพเต็ม
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => scheduleImageInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-semibold cursor-pointer"
                        >
                          เปลี่ยนรูปภาพ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => scheduleImageInputRef.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed border-sky-300 dark:border-sky-800 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-sky-50/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[28px] text-sky-600">
                        add_photo_alternate
                      </span>
                      <span className="text-[12px] font-semibold text-sky-800 dark:text-sky-300">
                        คลิกเพื่อเลือกไฟล์ภาพตารางสอนจากเครื่อง
                      </span>
                      <span className="text-[10px] text-slate-400">
                        รองรับไฟล์ JPG, PNG, WebP
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: แผนการสอน และ วิจัยในชั้นเรียน (PDF attachment) */}
              {(formData.category === 'แผนการสอน' || formData.category === 'วิจัยในชั้นเรียน') && (
                <div
                  className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 ${
                    formData.category === 'วิจัยในชั้นเรียน'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60'
                      : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[12px] font-bold flex items-center gap-1.5 ${
                        formData.category === 'วิจัยในชั้นเรียน'
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-[#1e3a8a] dark:text-blue-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                      {formData.category === 'วิจัยในชั้นเรียน'
                        ? 'แนบไฟล์รายงานวิจัยในชั้นเรียน (PDF)'
                        : 'แนบไฟล์แผนการสอน (PDF)'}
                    </span>
                    {formData.fileUrl && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        มีไฟล์แนบแล้ว
                      </span>
                    )}
                  </div>

                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />

                  {formData.fileName ? (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="material-symbols-outlined text-red-500 text-[20px]">
                          picture_as_pdf
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-medium truncate">
                            {formData.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formData.fileSize || '2.4 MB'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => pdfInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-semibold cursor-pointer"
                        >
                          เปลี่ยนไฟล์
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => pdfInputRef.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-50/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[28px] text-blue-500">
                        upload_file
                      </span>
                      <span className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300">
                        คลิกเพื่อเลือกไฟล์ PDF จากเครื่อง
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formData.category === 'วิจัยในชั้นเรียน'
                          ? 'รองรับไฟล์รายงานวิจัยในชั้นเรียน (PDF)'
                          : 'รองรับไฟล์ PDF แผนการสอนทุกรูปแบบ'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: รายงานการนิเทศ (Supervision details & photos) */}
              {formData.category === 'รายงานการนิเทศ' && (
                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col gap-3">
                  <span className="text-[12px] font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">supervisor_account</span>
                    ข้อมูลการนิเทศการสอน
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        วันที่นิเทศ
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น 15 กรกฎาคม 2569"
                        value={formData.supervisionDate || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, supervisionDate: e.target.value })
                        }
                        className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        ผลการประเมิน / คะแนน
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น ดีเด่น (4.85/5.00)"
                        value={formData.scoreOrFeedback || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, scoreOrFeedback: e.target.value })
                        }
                        className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      ผู้นิเทศ (อาจารย์นิเทศก์ / ครูพี่เลี้ยง)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ผศ.ดร.พรพิมล รัตนโกสินทร์ และ อ.วิชัย เกียรติสกุล"
                      value={formData.supervisorName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, supervisorName: e.target.value })
                      }
                      className="h-9 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      รายละเอียดการนิเทศ / ข้อเสนอแนะ
                    </label>
                    <textarea
                      rows={3}
                      placeholder="บันทึกรายละเอียดคำแนะนำ ข้อคิดเห็น จุดเด่น และข้อที่ต้องปรับปรุง..."
                      value={formData.supervisionDetails || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, supervisionDetails: e.target.value })
                      }
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                    />
                  </div>

                  {/* Supervision Photos */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        รูปภาพการนิเทศ ({(formData.supervisionPhotos || []).length} รูป)
                      </label>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">add_photo_alternate</span>
                        <span>อัปโหลดรูปจากเครื่อง</span>
                      </button>
                    </div>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {/* URL input fallback */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="หรือวางลิงก์รูปภาพ (URL)..."
                        value={newPhotoUrlInput}
                        onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                        className="flex-1 h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoUrl}
                        className="px-3 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold cursor-pointer"
                      >
                        เพิ่ม
                      </button>
                    </div>

                    {/* Photos list preview */}
                    {formData.supervisionPhotos && formData.supervisionPhotos.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {formData.supervisionPhotos.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-14 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0 group"
                          >
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] cursor-pointer"
                              title="ลบรูปนี้"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status and Count */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    จำนวน / ปริมาณ
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 18 คาบ/สัปดาห์, 18 แผน"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                    required
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                    สถานะเอกสาร
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as AcademicItem['status'],
                      })
                    }
                    className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  >
                    <option value="สมบูรณ์">สมบูรณ์</option>
                    <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                    <option value="รออนุมัติ">รออนุมัติ</option>
                  </select>
                </div>
              </div>

              {/* Icon Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  สัญลักษณ์ไอคอน
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: ic.name })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        formData.icon === ic.name
                          ? 'border-[#1e3a8a] bg-blue-50 dark:bg-blue-950 text-[#1e3a8a] dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{ic.name}</span>
                      <span className="text-[9px] truncate w-full text-center">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[13px] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-[13px] shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{editingItem ? 'บันทึกการแก้ไข' : 'บันทึกผลงาน'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE IMAGE VIEWER MODAL */}
      <ScheduleImageModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        imageUrl={
          activeScheduleItem?.scheduleImageUrl ||
          'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&auto=format&fit=crop&q=80'
        }
        title={activeScheduleItem?.title || 'ตารางสอนประจำภาคเรียน'}
        subtitle={`${activeScheduleItem?.count || '18 คาบ/สัปดาห์'} • ${activeScheduleItem?.desc || ''}`}
        onUpdateImage={(newUrl, newName) => {
          if (!activeScheduleItem) return;
          const updated = items.map((it) =>
            it.id === activeScheduleItem.id
              ? { ...it, scheduleImageUrl: newUrl, scheduleImageName: newName }
              : it
          );
          onUpdateItems(updated);
          setActiveScheduleItem((prev) =>
            prev ? { ...prev, scheduleImageUrl: newUrl, scheduleImageName: newName } : null
          );
          onShowToast('✓ อัปเดตรูปภาพตารางสอนเรียบร้อยแล้ว');
        }}
        isDark={isDark}
      />

      {/* PDF VIEWER MODAL */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={activePdfItem?.title || 'เอกสารวิชาการ'}
        fileName={
          activePdfItem?.fileName ||
          (activePdfItem?.category === 'วิจัยในชั้นเรียน'
            ? 'รายงานการวิจัยในชั้นเรียน_การเขียนสะกดคำ_ม2.pdf'
            : 'แผนการจัดการเรียนรู้_ม2_ภาษาไทย.pdf')
        }
        fileUrl={activePdfItem?.fileUrl}
        fileSize={activePdfItem?.fileSize || '2.4 MB'}
        isDark={isDark}
      />

      {/* PHOTO PREVIEW MODAL */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={previewPhotoUrl} alt="การนิเทศภาพใหญ่" className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

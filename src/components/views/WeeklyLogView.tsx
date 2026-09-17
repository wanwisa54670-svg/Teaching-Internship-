import React, { useState, useRef } from 'react';
import { WeeklyLogItem, DailyWorkRecord, WeekPhoto } from '../../types';
import { formatThaiDate, getDayOfWeekFromDate, getTodayDateString } from '../../utils/dateUtils';
import { INITIAL_18_WEEKS } from '../../data/initialWeeklyLogs';
import { processUploadedFile, triggerCelebration } from '../../lib/fileHelper';

interface WeeklyLogViewProps {
  logs: WeeklyLogItem[];
  onUpdateLogs: (logs: WeeklyLogItem[]) => void;
  onShowToast: (msg: string) => void;
  onPreviewFile?: (url: string, name: string, type?: string, size?: string) => void;
  isDark?: boolean;
}

export const WeeklyLogView: React.FC<WeeklyLogViewProps> = ({
  logs,
  onUpdateLogs,
  onShowToast,
  onPreviewFile,
  isDark = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeekNum, setSelectedWeekNum] = useState<number | null>(null);

  // Modal states
  // 1. Week Edit/Add Modal
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
  const [editingWeek, setEditingWeek] = useState<WeeklyLogItem | null>(null);
  const [weekForm, setWeekForm] = useState({
    week: 1,
    title: '',
    hours: 12,
    dateRange: '',
    reflection: '',
    mentorFeedback: '',
  });

  // 2. Week Detail View Modal (เมื่อกดเข้าไปดูสัปดาห์)
  const [detailWeek, setDetailWeek] = useState<WeeklyLogItem | null>(null);

  // 3. Daily Log Add/Edit Modal
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [targetWeekForDaily, setTargetWeekForDaily] = useState<WeeklyLogItem | null>(null);
  const [editingDaily, setEditingDaily] = useState<DailyWorkRecord | null>(null);
  const [dailyForm, setDailyForm] = useState({
    date: getTodayDateString(),
    workHours: '07:30 - 16:30 น.',
    activities: '',
    notes: '',
    photoUrl: '',
  });

  // 4. Photo Add Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [targetWeekForPhoto, setTargetWeekForPhoto] = useState<WeeklyLogItem | null>(null);
  const [photoForm, setPhotoForm] = useState({
    url: '',
    caption: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dailyPhotoInputRef = useRef<HTMLInputElement>(null);

  // 5. Lightbox for images
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Keep detailWeek synchronized with latest logs state
  const currentDetailWeek = detailWeek
    ? logs.find((l) => l.id === detailWeek.id) || detailWeek
    : null;

  // Statistics calculation
  const totalWeeks = logs.length;
  const totalDailyLogs = logs.reduce((sum, w) => sum + (w.dailyLogs?.length || 0), 0);
  const totalPhotos = logs.reduce((sum, w) => sum + (w.photos?.length || 0), 0);
  const totalHours = logs.reduce((sum, w) => sum + (w.hours || 0), 0);

  // Open Week Detail Modal
  const handleOpenWeekDetail = (item: WeeklyLogItem) => {
    setDetailWeek(item);
  };

  // Switch week within Detail Modal
  const handleNavigateWeek = (direction: 'prev' | 'next') => {
    if (!currentDetailWeek) return;
    const sorted = [...logs].sort((a, b) => a.week - b.week);
    const currentIndex = sorted.findIndex((l) => l.id === currentDetailWeek.id);
    if (currentIndex === -1) return;

    if (direction === 'prev' && currentIndex > 0) {
      setDetailWeek(sorted[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < sorted.length - 1) {
      setDetailWeek(sorted[currentIndex + 1]);
    }
  };

  // Week Add / Edit Handlers
  const handleOpenAddWeek = () => {
    const nextWeek = logs.length > 0 ? Math.max(...logs.map((l) => l.week)) + 1 : 1;
    setEditingWeek(null);
    setWeekForm({
      week: nextWeek,
      title: '',
      hours: 12,
      dateRange: `สัปดาห์ที่ ${nextWeek}`,
      reflection: '',
      mentorFeedback: '',
    });
    setIsWeekModalOpen(true);
  };

  const handleOpenEditWeek = (item: WeeklyLogItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingWeek(item);
    setWeekForm({
      week: item.week,
      title: item.title,
      hours: item.hours,
      dateRange: item.dateRange,
      reflection: item.reflection || '',
      mentorFeedback: item.mentorFeedback || '',
    });
    setIsWeekModalOpen(true);
  };

  const handleDeleteWeek = (id: string, weekNum: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`คุณต้องการลบบันทึกสัปดาห์ที่ ${weekNum} ใช่หรือไม่?`)) {
      const updated = logs.filter((l) => l.id !== id);
      onUpdateLogs(updated);
      if (detailWeek?.id === id) {
        setDetailWeek(null);
      }
      onShowToast(`ลบบันทึกสัปดาห์ที่ ${weekNum} เรียบร้อยแล้ว`);
    }
  };

  const handleSaveWeek = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWeek) {
      const updated = logs.map((l) =>
        l.id === editingWeek.id
          ? {
              ...l,
              week: Number(weekForm.week),
              title: weekForm.title.trim(),
              hours: Number(weekForm.hours),
              dateRange: weekForm.dateRange.trim(),
              reflection: weekForm.reflection,
              mentorFeedback: weekForm.mentorFeedback,
            }
          : l
      );
      onUpdateLogs(updated);
      onShowToast(`แก้ไขข้อมูลสัปดาห์ที่ ${weekForm.week} เรียบร้อยแล้ว`);
    } else {
      const newWeek: WeeklyLogItem = {
        id: `w-${Date.now()}`,
        week: Number(weekForm.week),
        title: weekForm.title.trim() || `สัปดาห์ที่ ${weekForm.week}`,
        hours: Number(weekForm.hours) || 12,
        dateRange: weekForm.dateRange.trim(),
        reflection: weekForm.reflection,
        mentorFeedback: weekForm.mentorFeedback,
        photos: [],
        dailyLogs: [],
      };
      const updated = [...logs, newWeek].sort((a, b) => a.week - b.week);
      onUpdateLogs(updated);
      onShowToast(`เพิ่มสัปดาห์ที่ ${weekForm.week} เรียบร้อยแล้ว`);
    }
    setIsWeekModalOpen(false);
  };

  // Daily Log Handlers
  const handleOpenAddDaily = (weekItem?: WeeklyLogItem) => {
    const target = weekItem || currentDetailWeek;
    if (!target) return;
    setTargetWeekForDaily(target);
    setEditingDaily(null);
    setDailyForm({
      date: getTodayDateString(),
      workHours: '07:30 - 16:30 น.',
      activities: '',
      notes: '',
      photoUrl: '',
    });
    setIsDailyModalOpen(true);
  };

  const handleOpenEditDaily = (daily: DailyWorkRecord, weekItem?: WeeklyLogItem) => {
    const target = weekItem || currentDetailWeek;
    if (target) {
      setTargetWeekForDaily(target);
    }
    setEditingDaily(daily);
    setDailyForm({
      date: daily.date,
      workHours: daily.workHours || '07:30 - 16:30 น.',
      activities: daily.activities || '',
      notes: daily.notes || '',
      photoUrl: daily.photoUrl || '',
    });
    setIsDailyModalOpen(true);
  };

  const handleDeleteDaily = (dailyId: string, targetWeekId?: string) => {
    const targetId = targetWeekId || currentDetailWeek?.id || targetWeekForDaily?.id;
    if (!targetId) return;
    if (confirm('คุณต้องการลบบันทึกการทำงานของวันนี้ใช่หรือไม่?')) {
      const updatedLogs = logs.map((l) =>
        l.id === targetId
          ? { ...l, dailyLogs: (l.dailyLogs || []).filter((d) => d.id !== dailyId) }
          : l
      );
      onUpdateLogs(updatedLogs);
      onShowToast('✓ ลบบันทึกการทำงานประจำวันเรียบร้อย');
    }
  };

  const handleSaveDaily = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWeek = targetWeekForDaily || currentDetailWeek;
    if (!targetWeek) return;

    const formattedDate = formatThaiDate(dailyForm.date);
    const dayOfWeek = getDayOfWeekFromDate(dailyForm.date);

    if (editingDaily) {
      const updatedDailyList = (targetWeek.dailyLogs || []).map((d) =>
        d.id === editingDaily.id
          ? {
              ...d,
              date: dailyForm.date,
              formattedDate,
              dayOfWeek,
              workHours: dailyForm.workHours.trim(),
              activities: dailyForm.activities.trim(),
              notes: dailyForm.notes.trim(),
              photoUrl: dailyForm.photoUrl.trim(),
              fileName: (dailyForm as any).fileName || d.fileName,
              fileType: (dailyForm as any).fileType || d.fileType,
              fileSize: (dailyForm as any).fileSize || d.fileSize,
            }
          : d
      );

      const updatedLogs = logs.map((l) =>
        l.id === targetWeek.id ? { ...l, dailyLogs: updatedDailyList } : l
      );
      onUpdateLogs(updatedLogs);
      triggerCelebration({ count: 40, spread: 60 });
      onShowToast('✓ แก้ไขบันทึกการทำงานประจำวันสำเร็จ');
    } else {
      const newDailyRecord: DailyWorkRecord = {
        id: `d-${Date.now()}`,
        date: dailyForm.date,
        formattedDate,
        dayOfWeek,
        workHours: dailyForm.workHours.trim() || '07:30 - 16:30 น.',
        activities: dailyForm.activities.trim(),
        notes: dailyForm.notes.trim(),
        photoUrl: dailyForm.photoUrl.trim(),
        fileName: (dailyForm as any).fileName || undefined,
        fileType: (dailyForm as any).fileType || undefined,
        fileSize: (dailyForm as any).fileSize || undefined,
      };

      const updatedDailyList = [...(targetWeek.dailyLogs || []), newDailyRecord].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const updatedLogs = logs.map((l) =>
        l.id === targetWeek.id ? { ...l, dailyLogs: updatedDailyList } : l
      );
      onUpdateLogs(updatedLogs);
      triggerCelebration({ count: 50, spread: 70 });
      onShowToast('✓ เพิ่มบันทึกการทำงานประจำวันสำเร็จ');
    }

    setIsDailyModalOpen(false);
  };

  const handleResetTo18Weeks = () => {
    if (
      confirm(
        'คุณต้องการคืนค่าสมุดบันทึกเป็นค่าเริ่มต้นทั้ง 18 สัปดาห์ใช่หรือไม่? (ข้อมูลที่บันทึกจะถูกแทนที่ด้วยข้อมูลตั้งต้น 18 สัปดาห์)'
      )
    ) {
      onUpdateLogs(INITIAL_18_WEEKS);
      onShowToast('✓ โหลดข้อมูลเริ่มต้นสมุดบันทึก 18 สัปดาห์เรียบร้อยแล้ว');
    }
  };

  // Photo Handlers for Weeks
  const handleOpenAddPhoto = (weekItem: WeeklyLogItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTargetWeekForPhoto(weekItem);
    setPhotoForm({
      url: '',
      caption: '',
    });
    setIsPhotoModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'week' | 'daily') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const processed = await processUploadedFile(file);
        if (target === 'week') {
          setPhotoForm((prev) => ({
            ...prev,
            url: processed.dataUrl,
            caption: prev.caption || processed.name,
            fileName: processed.name,
            fileType: processed.type,
            fileSize: processed.size,
          }));
        } else {
          setDailyForm((prev) => ({
            ...prev,
            photoUrl: processed.dataUrl,
            fileName: processed.name,
            fileType: processed.type,
            fileSize: processed.size,
          }));
        }
        onShowToast(`แนบไฟล์ ${processed.name} (${processed.size}) เรียบร้อยแล้ว`);
      } catch (err) {
        console.error('File process error:', err);
      }
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWeekForPhoto || !photoForm.url.trim()) return;

    const newPhoto: WeekPhoto = {
      id: `p-${Date.now()}`,
      url: photoForm.url.trim(),
      caption: photoForm.caption.trim() || `ภาพกิจกรรมสัปดาห์ที่ ${targetWeekForPhoto.week}`,
      uploadedAt: formatThaiDate(getTodayDateString()),
      fileName: (photoForm as any).fileName || undefined,
      fileType: (photoForm as any).fileType || undefined,
      fileSize: (photoForm as any).fileSize || undefined,
    };

    const updatedLogs = logs.map((l) =>
      l.id === targetWeekForPhoto.id
        ? { ...l, photos: [...(l.photos || []), newPhoto] }
        : l
    );

    onUpdateLogs(updatedLogs);
    triggerCelebration({ count: 40, spread: 60 });
    onShowToast(`เพิ่มรูปภาพ/ไฟล์ในสัปดาห์ที่ ${targetWeekForPhoto.week} สำเร็จ`);
    setIsPhotoModalOpen(false);
  };

  const handleDeletePhoto = (weekId: string, photoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('คุณต้องการลบรูปภาพนี้ใช่หรือไม่?')) {
      const updatedLogs = logs.map((l) =>
        l.id === weekId
          ? { ...l, photos: (l.photos || []).filter((p) => p.id !== photoId) }
          : l
      );
      onUpdateLogs(updatedLogs);
      onShowToast('ลบรูปภาพเรียบร้อยแล้ว');
    }
  };

  // Filter logs by search query and optional week number
  const filteredLogs = logs.filter((l) => {
    if (selectedWeekNum !== null && l.week !== selectedWeekNum) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesWeek = l.week.toString().includes(q);
    const matchesTitle = l.title.toLowerCase().includes(q);
    const matchesDate = (l.dateRange || '').toLowerCase().includes(q);
    const matchesDaily = (l.dailyLogs || []).some(
      (d) =>
        d.activities.toLowerCase().includes(q) ||
        (d.formattedDate || '').toLowerCase().includes(q)
    );
    return matchesWeek || matchesTitle || matchesDate || matchesDaily;
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* 1. Header Banner with 18 Weeks Overview Stats */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-4 ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[24px]">
                auto_stories
              </span>
              <h3 className="text-[18px] font-bold text-[#1e3a8a] dark:text-blue-300">
                สมุดบันทึกการฝึกประสบการณ์ (18 สัปดาห์)
              </h3>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
              บันทึกกิจกรรมประจำวัน เวลาปฏิบัติงาน และรูปภาพกิจกรรมตลอดภาคเรียน
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleResetTo18Weeks}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[13px] font-semibold transition-all cursor-pointer active:scale-95"
              title="คืนค่าข้อมูลสมุดบันทึกเป็น 18 สัปดาห์เริ่มต้น"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>คืนค่า 18 สัปดาห์</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateLogs([...logs]);
                onShowToast('✓ บันทึกข้อมูลสมุดบันทึก 18 สัปดาห์เรียบร้อยแล้ว');
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              title="บันทึกข้อมูลสมุดบันทึกทั้งหมด"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>บันทึกข้อมูลทั้งหมด</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddWeek}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              title="เพิ่มสัปดาห์ใหม่"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ เพิ่มสัปดาห์</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Cards (No Status Tracking) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">สัปดาห์ทั้งหมด</span>
            <span className="text-[18px] font-bold text-[#1e3a8a] dark:text-blue-300">
              {totalWeeks} <span className="text-[12px] text-slate-400 font-normal">สัปดาห์</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">บันทึกรายวันรวม</span>
            <span className="text-[18px] font-bold text-emerald-600 dark:text-emerald-400">
              {totalDailyLogs} <span className="text-[12px] text-slate-400 font-normal">วันทำงาน</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">รูปภาพกิจกรรม</span>
            <span className="text-[18px] font-bold text-amber-600 dark:text-amber-400">
              {totalPhotos} <span className="text-[12px] text-slate-400 font-normal">รูป</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">ชั่วโมงสอนรวม</span>
            <span className="text-[18px] font-bold text-[#006398] dark:text-sky-300">
              {totalHours} <span className="text-[12px] text-slate-400 font-normal">ชม.</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. 18-Week Quick Navigation Strip */}
      <div
        className={`p-3 rounded-2xl border shadow-xs flex flex-col gap-2 ${
          isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#1e3a8a] dark:text-blue-300">
              calendar_view_week
            </span>
            <span>ทางลัดเลือกดูสัปดาห์ (1 - 18):</span>
          </span>
          {selectedWeekNum !== null && (
            <button
              type="button"
              onClick={() => setSelectedWeekNum(null)}
              className="text-[11px] text-[#1e3a8a] dark:text-blue-300 hover:underline font-medium cursor-pointer"
            >
              แสดงทั้งหมด (18 สัปดาห์)
            </button>
          )}
        </div>

        {/* Horizontal scrollable week pill list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedWeekNum(null)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedWeekNum === null
                ? 'bg-[#1e3a8a] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด (18)
          </button>
          {Array.from({ length: 18 }, (_, i) => i + 1).map((wNum) => {
            const weekItem = logs.find((l) => l.week === wNum);
            const dailyCount = weekItem?.dailyLogs?.length || 0;
            const photoCount = weekItem?.photos?.length || 0;
            const isSelected = selectedWeekNum === wNum;

            return (
              <button
                key={wNum}
                type="button"
                onClick={() => {
                  if (weekItem) {
                    handleOpenWeekDetail(weekItem);
                  } else {
                    setSelectedWeekNum(wNum);
                  }
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1e3a8a]/50'
                }`}
                title={`คลิกเพื่อเปิดรายละเอียดสัปดาห์ที่ ${wNum}`}
              >
                <span>สัปดาห์ {wNum}</span>
                {dailyCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                    {dailyCount}ว
                  </span>
                )}
                {photoCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    {photoCount}รูป
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[20px] text-slate-400">
          search
        </span>
        <input
          type="text"
          placeholder="ค้นหาตามสัปดาห์ หัวข้อ วันที่ หรือรายละเอียดการทำงานที่ทำในแต่ละวัน..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full h-11 pl-10 pr-4 rounded-xl border text-[13px] outline-none transition-all ${
            isDark
              ? 'bg-[#18233c] border-slate-800 text-white placeholder-slate-500 focus:border-blue-400'
              : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#1e3a8a]'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* 4. Weekly Log Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLogs.length === 0 ? (
          <div className="lg:col-span-2 py-14 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="material-symbols-outlined text-[40px] text-slate-300">
              edit_calendar
            </span>
            <p className="text-[14px] text-slate-500 font-medium">ไม่พบบันทึกตามคำค้นหา</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedWeekNum(null);
              }}
              className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 underline cursor-pointer"
            >
              แสดงบันทึกทั้งหมด
            </button>
          </div>
        ) : (
          filteredLogs.map((item) => {
            const dailyLogs = item.dailyLogs || [];
            const photos = item.photos || [];

            return (
              <div
                key={item.id}
                onClick={() => handleOpenWeekDetail(item)}
                className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-3.5 transition-all cursor-pointer hover:shadow-md hover:border-[#1e3a8a]/50 group ${
                  isDark ? 'bg-[#18233c] border-slate-800' : 'bg-white border-slate-100'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold bg-[#1e3a8a]/10 text-[#1e3a8a] dark:bg-blue-900/30 dark:text-blue-300 shrink-0 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">สัปดาห์</span>
                      <span className="text-[17px] leading-none">{item.week}</span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h4 className="text-[15px] font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#1e3a8a] dark:group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2.5 text-[12px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        {item.dateRange && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            <span>{item.dateRange}</span>
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>{item.hours} ชั่วโมงสอน</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="material-symbols-outlined text-[14px]">checklist</span>
                          <span>บันทึก {dailyLogs.length} วัน</span>
                        </span>
                        {photos.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                              <span className="material-symbols-outlined text-[14px]">photo_library</span>
                              <span>{photos.length} รูปภาพ</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit week, Add photo, View detail) */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleOpenAddPhoto(item, e)}
                      title="เพิ่มรูปภาพประจำสัปดาห์"
                      className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditWeek(item, e)}
                      title="แก้ไขข้อมูลสัปดาห์"
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteWeek(item.id, item.week, e)}
                      title="ลบสัปดาห์"
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Photos Thumbnail Gallery (If any) */}
                {photos.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImageUrl(photo.url);
                        }}
                        className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 group/img cursor-pointer"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'ภาพกิจกรรม'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[16px]">visibility</span>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => handleOpenAddPhoto(item, e)}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#1e3a8a] text-slate-400 hover:text-[#1e3a8a] dark:hover:text-blue-300 flex flex-col items-center justify-center shrink-0 text-[10px] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>เพิ่มรูป</span>
                    </button>
                  </div>
                )}

                {/* Daily Logs Preview Strip */}
                {dailyLogs.length > 0 ? (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>ตัวอย่างบันทึกรายวัน ({dailyLogs.length} วัน):</span>
                      <span className="text-[#1e3a8a] dark:text-blue-300 font-normal">
                        กดเพื่อดูรายละเอียดทั้งหมด &gt;
                      </span>
                    </span>
                    <div className="flex flex-col gap-1">
                      {dailyLogs.slice(0, 3).map((daily) => (
                        <div
                          key={daily.id}
                          className="flex items-start gap-2 text-[12px] text-slate-700 dark:text-slate-300"
                        >
                          <span className="font-semibold text-[#1e3a8a] dark:text-blue-300 shrink-0">
                            {daily.dayOfWeek || 'รายวัน'}:
                          </span>
                          <span className="truncate text-slate-600 dark:text-slate-300">
                            {daily.activities}
                          </span>
                        </div>
                      ))}
                      {dailyLogs.length > 3 && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          + อีก {dailyLogs.length - 3} วัน...
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                    <span className="text-[12px] text-amber-700 dark:text-amber-300">
                      ยังไม่มีบันทึกการทำงานรายวันในสัปดาห์นี้
                    </span>
                    <span className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 underline">
                      กดเข้าไปเพื่อเริ่มบันทึก
                    </span>
                  </div>
                )}

                {/* Bottom Action Bar: เพิ่ม, แก้ไข, ลบ, บันทึก, เปิดดูรายละเอียด */}
                <div
                  className="pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleOpenAddDaily(item)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#1e3a8a] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      title="เพิ่มบันทึกการปฏิบัติงานรายวันสำหรับสัปดาห์นี้"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>+ เพิ่มรายวัน</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenAddPhoto(item, e)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      title="เพิ่มรูปภาพกิจกรรมสำหรับสัปดาห์นี้"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                      <span>+ รูปภาพ</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditWeek(item, e)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      title="แก้ไขข้อมูลสัปดาห์นี้"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>แก้ไข</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteWeek(item.id, item.week, e)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      title="ลบสัปดาห์นี้"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>ลบ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateLogs([...logs]);
                        onShowToast(`✓ บันทึกข้อมูลสัปดาห์ที่ ${item.week} เรียบร้อยแล้ว`);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs active:scale-95"
                      title="บันทึกข้อมูลสัปดาห์นี้"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>บันทึก</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenWeekDetail(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1e3a8a] text-white hover:bg-[#1e40af] text-[12px] font-semibold transition-all ml-auto shadow-2xs cursor-pointer active:scale-95"
                    title="เปิดดูรายละเอียดสัปดาห์นี้"
                  >
                    <span>เปิดดูรายละเอียด</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. WEEK DETAIL MODAL (กดเข้าไปสัปดาห์ที่ 1 หรือสัปดาห์ใดๆ) */}
      {/* ========================================================================= */}
      {currentDetailWeek && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setDetailWeek(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-[#18233c] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold bg-[#1e3a8a] text-white shrink-0 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider font-medium opacity-90">สัปดาห์ที่</span>
                  <span className="text-[18px] leading-none">{currentDetailWeek.week}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-900 dark:text-white leading-snug truncate">
                      {currentDetailWeek.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                    {currentDetailWeek.dateRange && (
                      <span>ช่วงวันที่: {currentDetailWeek.dateRange}</span>
                    )}
                    <span>•</span>
                    <span>{currentDetailWeek.hours} ชั่วโมงสอน</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      บันทึกแล้ว {currentDetailWeek.dailyLogs?.length || 0} วัน
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {currentDetailWeek.photos?.length || 0} รูปภาพ
                    </span>
                  </p>
                </div>
              </div>

              {/* Top actions & Prev/Next */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleOpenEditWeek(currentDetailWeek)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[12px] font-semibold transition-colors cursor-pointer"
                  title="แก้ไขข้อมูลสัปดาห์นี้"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>แก้ไขสัปดาห์</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteWeek(currentDetailWeek.id, currentDetailWeek.week, e)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[12px] font-semibold transition-colors cursor-pointer"
                  title="ลบสัปดาห์นี้"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>ลบสัปดาห์</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateLogs([...logs]);
                    onShowToast(`✓ บันทึกข้อมูลสัปดาห์ที่ ${currentDetailWeek.week} เรียบร้อยแล้ว`);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-2xs"
                  title="บันทึกข้อมูลสัปดาห์นี้"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>บันทึก</span>
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => handleNavigateWeek('prev')}
                  title="สัปดาห์ก่อนหน้า"
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateWeek('next')}
                  title="สัปดาห์ถัดไป"
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailWeek(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6 scrollbar-thin">
              {/* ------------------------------------------------------------- */}
              {/* SECTION A: PHOTOS GALLERY FOR THIS WEEK */}
              {/* ------------------------------------------------------------- */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]">
                      photo_library
                    </span>
                    <span>รูปภาพกิจกรรมประจำสัปดาห์ที่ {currentDetailWeek.week}</span>
                    <span className="text-[12px] font-normal text-slate-400">
                      ({currentDetailWeek.photos?.length || 0} รูป)
                    </span>
                  </h4>

                  <button
                    type="button"
                    onClick={(e) => handleOpenAddPhoto(currentDetailWeek, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[12px] font-semibold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                    <span>+ เพิ่มรูปภาพสัปดาห์นี้</span>
                  </button>
                </div>

                {currentDetailWeek.photos && currentDetailWeek.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentDetailWeek.photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setPreviewImageUrl(photo.url)}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video cursor-pointer shadow-2xs"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'รูปกิจกรรม'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={(e) => handleDeletePhoto(currentDetailWeek.id, photo.id, e)}
                            title="ลบรูปภาพนี้"
                            className="self-end p-1 rounded-md bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                          <p className="text-[11px] text-white leading-tight line-clamp-2">
                            {photo.caption || 'รูปภาพกิจกรรม'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={(e) => handleOpenAddPhoto(currentDetailWeek, e)}
                    className="p-5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-amber-400 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[28px] text-slate-300">
                      add_photo_alternate
                    </span>
                    <span className="text-[13px] text-slate-500 font-medium">
                      ยังไม่มีรูปภาพในสัปดาห์นี้ กดเพื่อเพิ่มรูปภาพกิจกรรม
                    </span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">
                      สามารถอัปโหลดไฟล์จากเครื่อง หรือระบุ URL ได้
                    </span>
                  </div>
                )}
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* ------------------------------------------------------------- */}
              {/* SECTION B: DAILY WORK LOGS (วัน เวลาทำงาน รายละเอียดว่าวันนี้ทำอะไร) */}
              {/* ------------------------------------------------------------- */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-[15px] font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[20px]">
                        calendar_month
                      </span>
                      <span>บันทึกการปฏิบัติงานรายวัน (เลือกวันที่ เวลาทำงาน รายละเอียด)</span>
                    </h4>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                      บันทึกว่าแต่ละวันเริ่มงานกี่โมง เลิกงานกี่โมง และปฏิบัติภารกิจอะไรบ้าง
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAddDaily(currentDetailWeek)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[12px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>+ บันทึกการทำงานรายวัน</span>
                  </button>
                </div>

                {/* Daily logs list */}
                {currentDetailWeek.dailyLogs && currentDetailWeek.dailyLogs.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {currentDetailWeek.dailyLogs.map((daily) => (
                      <div
                        key={daily.id}
                        className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all ${
                          isDark
                            ? 'bg-slate-800/60 border-slate-700/80 hover:border-blue-500/40'
                            : 'bg-slate-50/70 border-slate-200/80 hover:border-[#1e3a8a]/40'
                        }`}
                      >
                        {/* Daily Header: Date & Time */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a] dark:bg-blue-900/40 dark:text-blue-300 font-bold text-[12px] flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">event</span>
                              <span>{daily.formattedDate || formatThaiDate(daily.date)}</span>
                            </span>

                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium text-[12px] flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              <span>เวลาทำงาน: {daily.workHours || '07:30 - 16:30 น.'}</span>
                            </span>
                          </div>

                          {/* Daily action buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDaily(daily, currentDetailWeek)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-[#1e3a8a] dark:text-blue-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              title="แก้ไขบันทึกประจำวันนี้"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit_note</span>
                              <span>แก้ไข</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDaily(daily.id, currentDetailWeek.id)}
                              title="ลบบันทึกวันนี้"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                              <span>ลบ</span>
                            </button>
                          </div>
                        </div>

                        {/* Activities Description (รายละเอียดว่าวันนี้ทำอะไร) */}
                        <div className="text-[13px] text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed pl-1">
                          {daily.activities}
                        </div>

                        {/* Daily Notes (if any) */}
                        {daily.notes && (
                          <div className="text-[12px] text-slate-500 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <strong>หมายเหตุ / ข้อสังเกต:</strong> {daily.notes}
                          </div>
                        )}

                        {/* Daily Photo (if any) */}
                        {daily.photoUrl && (
                          <div className="mt-1">
                            <img
                              src={daily.photoUrl}
                              alt="รูปกิจกรรมประจำวัน"
                              referrerPolicy="no-referrer"
                              onClick={() => setPreviewImageUrl(daily.photoUrl!)}
                              className="w-32 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[36px] text-slate-300">
                      calendar_today
                    </span>
                    <p className="text-[13px] text-slate-500 font-medium">
                      ยังไม่มีรายการบันทึกการทำงานรายวันในสัปดาห์ที่ {currentDetailWeek.week}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddDaily(currentDetailWeek)}
                      className="text-[12px] font-semibold text-[#1e3a8a] dark:text-blue-300 underline cursor-pointer"
                    >
                      กดที่นี่เพื่อเพิ่มบันทึกรายวัน (เลือกวันที่, เวลาทำงาน, รายละเอียด)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Bar: เพิ่ม, แก้ไข, ลบ, บันทึก, ปิด */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleOpenAddDaily(currentDetailWeek)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>+ เพิ่มบันทึกรายวัน</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddPhoto(currentDetailWeek)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                  <span>+ เพิ่มรูปภาพ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEditWeek(currentDetailWeek)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[12px] font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>แก้ไขสัปดาห์</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteWeek(currentDetailWeek.id, currentDetailWeek.week, e)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[12px] font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>ลบสัปดาห์</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateLogs([...logs]);
                    onShowToast(`✓ บันทึกข้อมูลสัปดาห์ที่ ${currentDetailWeek.week} เรียบร้อยแล้ว`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>บันทึกข้อมูลสัปดาห์</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailWeek(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[12px] font-semibold transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DAILY LOG ADD/EDIT MODAL (เลือกวันที่ได้ด้วย, เวลาทำงาน, รายละเอียดว่าวันนี้ทำอะไร) */}
      {/* ========================================================================= */}
      {isDailyModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsDailyModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-[#18233c] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[22px]">
                  edit_calendar
                </span>
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {editingDaily ? 'แก้ไขบันทึกการทำงานรายวัน' : 'เพิ่มบันทึกการทำงานรายวัน'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  form="dailyLogForm"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                  title="กดเพื่อบันทึกข้อมูลรายวันนี้"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>บันทึก</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDailyModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form id="dailyLogForm" onSubmit={handleSaveDaily} className="p-4 sm:p-5 flex flex-col gap-4">
              {/* Field 1: วันที่ (เลือกวันที่ได้ด้วย!) */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เลือกวันที่ปฏิบัติงาน <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    required
                    value={dailyForm.date}
                    onChange={(e) => setDailyForm({ ...dailyForm, date: e.target.value })}
                    className={`flex-1 h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setDailyForm({ ...dailyForm, date: getTodayDateString() })}
                    className="px-3 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[12px] font-medium transition-colors"
                  >
                    วันนี้
                  </button>
                </div>
                {dailyForm.date && (
                  <p className="text-[11px] text-[#1e3a8a] dark:text-blue-300 mt-1 font-medium">
                    {formatThaiDate(dailyForm.date)}
                  </p>
                )}
              </div>

              {/* Field 2: เวลาทำงาน */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เวลาทำงาน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น 07:30 - 16:30 น."
                  value={dailyForm.workHours}
                  onChange={(e) => setDailyForm({ ...dailyForm, workHours: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                  }`}
                />
                {/* Quick select presets */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-medium">ปุ่มด่วน:</span>
                  {['07:30 - 16:30 น.', '07:15 - 16:30 น.', '08:00 - 16:30 น.', '08:00 - 12:00 น.'].map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDailyForm({ ...dailyForm, workHours: t })}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Field 3: รายละเอียดว่าวันนี้ทำอะไร */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รายละเอียดว่าวันนี้ทำอะไร <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="เช่น สอนวิชาภาษาไทยพื้นฐาน ม.2/1 เรื่องการอ่านจับใจความสำคัญ, ปฏิบัติหน้าที่ครูเวรประตูโรงเรียนตอนเช้า, ตรวจการบ้านสมุดคำศัพท์..."
                  value={dailyForm.activities}
                  onChange={(e) => setDailyForm({ ...dailyForm, activities: e.target.value })}
                  className={`w-full p-3 rounded-xl border text-[13px] outline-none transition-all resize-none ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                  }`}
                />
              </div>

              {/* Field 4: หมายเหตุ / ข้อสังเกต (Optional) */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  หมายเหตุ / ข้อสังเกตเพิ่มเติม (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น นักเรียนกลุ่ม ม.2/2 มีความกระตือรือร้นในการตอบคำถามเป็นพิเศษ"
                  value={dailyForm.notes}
                  onChange={(e) => setDailyForm({ ...dailyForm, notes: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                  }`}
                />
              </div>

              {/* Field 5: แนบรูปภาพประจำวัน (Optional) */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  แนบรูปภาพกิจกรรมประจำวัน (ไม่บังคับ)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="วาง URL รูปภาพ หรือคลิกปุ่มอัปโหลดไฟล์..."
                    value={dailyForm.photoUrl}
                    onChange={(e) => setDailyForm({ ...dailyForm, photoUrl: e.target.value })}
                    className={`flex-1 h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                    }`}
                  />
                  <input
                    type="file"
                    ref={dailyPhotoInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, 'daily')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => dailyPhotoInputRef.current?.click()}
                    className="px-3 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-[12px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>เลือกไฟล์</span>
                  </button>
                </div>
                {dailyForm.photoUrl && (
                  <div className="mt-2 relative w-24 h-20 rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={dailyForm.photoUrl}
                      alt="ตัวอย่างรูป"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setDailyForm({ ...dailyForm, photoUrl: '' })}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {editingDaily ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteDaily(editingDaily.id, targetWeekForDaily?.id || currentDetailWeek?.id);
                      setIsDailyModalOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>ลบบันทึกนี้</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDailyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>บันทึกข้อมูลรายวัน</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PHOTO ADD MODAL (เพิ่มรูปภาพประจำสัปดาห์) */}
      {/* ========================================================================= */}
      {isPhotoModalOpen && targetWeekForPhoto && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-[#18233c] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[22px]">
                  add_photo_alternate
                </span>
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  เพิ่มรูปภาพสัปดาห์ที่ {targetWeekForPhoto.week}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePhoto} className="p-4 sm:p-5 flex flex-col gap-4">
              {/* Image Input Options */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เลือกรูปภาพจากเครื่อง หรือระบุ URL <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="วาง Image URL (https://...)"
                    value={photoForm.url}
                    onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                    className={`flex-1 h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                    }`}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, 'week')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>เลือกไฟล์</span>
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              {photoForm.url && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={photoForm.url}
                    alt="ตัวอย่างรูปภาพ"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, url: '' })}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-md"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              )}

              {/* Photo Caption */}
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  คำบรรยายภาพ (Caption)
                </label>
                <input
                  type="text"
                  placeholder="เช่น กิจกรรมประกวดอ่านทำนองเสนาะในคาบเรียนภาษาไทย"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                  }`}
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!photoForm.url.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  เพิ่มรูปภาพ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. WEEK ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isWeekModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsWeekModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
              isDark ? 'bg-[#18233c] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1e3a8a] dark:text-blue-300 text-[22px]">
                  edit_note
                </span>
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {editingWeek ? `แก้ไขข้อมูลสัปดาห์ที่ ${editingWeek.week}` : 'เพิ่มสัปดาห์ใหม่'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWeekModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveWeek} className="p-4 sm:p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    สัปดาห์ที่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    required
                    value={weekForm.week}
                    onChange={(e) => setWeekForm({ ...weekForm, week: Number(e.target.value) })}
                    className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ชั่วโมงสอนรวม (ชม.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={weekForm.hours}
                    onChange={(e) => setWeekForm({ ...weekForm, hours: Number(e.target.value) })}
                    className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  หัวข้อกิจกรรมการเรียนรู้ / งานมอบหมายประจำสัปดาห์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การสร้างสื่อดิจิทัล Canva และเกมตอบคำถาม Kahoot"
                  value={weekForm.title}
                  onChange={(e) => setWeekForm({ ...weekForm, title: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ช่วงวันที่ (Date Range)
                </label>
                <input
                  type="text"
                  placeholder="เช่น 3 - 7 มิ.ย. 2567"
                  value={weekForm.dateRange}
                  onChange={(e) => setWeekForm({ ...weekForm, dateRange: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl border text-[13px] outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#1e3a8a]'
                  }`}
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {editingWeek ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      handleDeleteWeek(editingWeek.id, editingWeek.week, e);
                      setIsWeekModalOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>ลบสัปดาห์นี้</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWeekModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>บันทึกข้อมูลสัปดาห์</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. LIGHTBOX IMAGE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <img
              src={previewImageUrl}
              alt="ดูภาพขนาดเต็ม"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

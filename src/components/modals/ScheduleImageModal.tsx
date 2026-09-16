import React, { useState, useRef } from 'react';

interface ScheduleImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  onUpdateImage?: (newImageUrl: string, newImageName: string) => void;
  isDark?: boolean;
}

export const ScheduleImageModal: React.FC<ScheduleImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title = 'ตารางสอนประจำภาคเรียน',
  subtitle = 'ตารางสอนรายวิชาภาษาไทยพื้นฐาน ม.2 • 18 คาบ/สัปดาห์',
  onUpdateImage,
  isDark = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์ภาพเท่านั้น (JPG, PNG, WebP)');
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onUpdateImage?.(event.target.result, file.name);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="scheduleImageModal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="w-full px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[15px] font-bold truncate leading-tight">{title}</h3>
            <span className="text-[12px] text-slate-400 truncate">{subtitle}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <div className="hidden xs:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              title="ย่อรูป"
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="ขนาดปกติ"
              className="px-2 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              title="ขยายรูป"
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Change photo button */}
          {onUpdateImage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="เปลี่ยนรูปตารางสอน"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span className="hidden sm:inline">เปลี่ยนรูป</span>
              </button>
            </>
          )}

          {/* Download button */}
          {imageUrl && (
            <button
              type="button"
              onClick={handleDownload}
              title="ดาวน์โหลดภาพตารางสอน"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            title="ปิดหน้าต่าง"
            className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 cursor-pointer transition-colors ml-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Image View Area */}
      <div className="flex-1 w-full overflow-auto p-4 flex items-center justify-center relative">
        {imageUrl ? (
          <div
            className="transition-transform duration-200 ease-out origin-center max-w-full flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={imageUrl}
              alt="ตารางสอน"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-700/60 bg-white"
            />
          </div>
        ) : (
          <div className="max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center gap-4 text-white">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">add_photo_alternate</span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-[16px] font-bold">ยังไม่ได้แนบรูปตารางสอน</h4>
              <p className="text-[13px] text-slate-400">
                คุณสามารถอัปโหลดภาพตารางสอน (JPG, PNG) เพื่อดูและใช้งานได้อย่างสะดวก
              </p>
            </div>
            {onUpdateImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">upload</span>
                <span>แนบไฟล์ภาพตารางสอนตอนนี้</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom info helper */}
      <div className="w-full px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>สามารถใช้ปุ่มย่อ-ขยาย หรือซูมดูรายละเอียดวิชาและห้องเรียนได้</span>
        <button
          type="button"
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
        >
          ปิดหน้านี้
        </button>
      </div>
    </div>
  );
};

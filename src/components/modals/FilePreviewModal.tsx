import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { openOrDownloadFile } from '../../lib/fileHelper';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName: string;
  fileType?: string;
  fileSize?: string;
  isDark?: boolean;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
  fileSize,
  isDark = false,
}) => {
  if (!isOpen || !fileUrl) return null;

  const isPdf =
    fileType === 'application/pdf' ||
    fileName.toLowerCase().endsWith('.pdf') ||
    fileUrl.startsWith('data:application/pdf');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
            isDark ? 'bg-[#131b2e] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${
              isDark ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isPdf
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-blue-100 text-[#1e3a8a] dark:bg-blue-950/60 dark:text-blue-300'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPdf ? 'picture_as_pdf' : 'image'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold truncate max-w-md">
                  {fileName || 'ไฟล์เอกสารแนบ'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isPdf ? 'เอกสาร PDF' : 'ไฟล์รูปภาพ'}{fileSize ? ` • ${fileSize}` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openOrDownloadFile(fileUrl, fileName)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-800 text-white text-[12px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span className="hidden sm:inline">ดาวน์โหลด</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="ปิดหน้าต่าง"
                className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Body Viewer */}
          <div className="flex-1 w-full min-h-[400px] max-h-[75vh] p-2 sm:p-4 overflow-auto flex items-center justify-center bg-slate-900/10 dark:bg-slate-950/40">
            {isPdf ? (
              <iframe
                title={fileName}
                src={fileUrl}
                className="w-full h-[68vh] rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
              />
            ) : (
              <div className="max-w-full max-h-full flex items-center justify-center p-2">
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Footer info */}
          <div
            className={`px-5 py-2.5 border-t text-[11.5px] flex items-center justify-between text-slate-400 ${
              isDark ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <span>ระบบตรวจดูเอกสารแบบตอบสนอง (Responsive Viewer)</span>
            <span className="font-mono text-[11px]">{isPdf ? 'PDF / Document' : 'Raster Image'}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

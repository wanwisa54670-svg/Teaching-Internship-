import React, { useState } from 'react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  isDark?: boolean;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  fileName = 'แผนการจัดการเรียนรู้_ม2_ภาษาไทย.pdf',
  fileUrl,
  fileSize = '2.4 MB',
  isDark = false,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 4;

  if (!isOpen) return null;

  const isDataPdf = fileUrl && fileUrl.startsWith('data:application/pdf');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl h-[92vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#141d31] text-white border border-slate-700'
            : 'bg-slate-100 text-[#131b2e]'
        }`}
      >
        {/* PDF Viewer Header Toolbar */}
        <div className="h-14 px-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold truncate leading-tight">
                {fileName || title}
              </span>
              <span className="text-[11px] text-slate-400">
                {fileSize} • เอกสารแผนการจัดการเรียนรู้ (PDF)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl text-[12px]">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(70, z - 15))}
                disabled={zoom <= 70}
                className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40 cursor-pointer"
                title="ย่อ"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="w-12 text-center font-mono text-[11px] text-slate-200">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(150, z + 15))}
                disabled={zoom >= 150}
                className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40 cursor-pointer"
                title="ขยาย"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl text-[12px]">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <span className="text-[11px] text-slate-200 px-1 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {fileUrl && (
              <a
                href={fileUrl}
                download={fileName || 'lesson-plan.pdf'}
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>ดาวน์โหลด</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              title="ปิด"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* PDF Body Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex justify-center items-start bg-slate-200/80 dark:bg-slate-950/80">
          {isDataPdf ? (
            /* Render embedded PDF Data */
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white">
              <iframe
                src={fileUrl}
                title={fileName}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            /* Authentic Thai Official Lesson Plan Document Preview */
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[760px] bg-white text-slate-900 rounded-lg shadow-xl p-8 sm:p-12 border border-slate-300 transition-transform duration-150 relative select-text"
            >
              {/* Document Header */}
              <div className="text-center pb-6 border-b border-slate-300">
                <div className="flex justify-center mb-2">
                  <span className="material-symbols-outlined text-amber-700 text-[40px]">
                    school
                  </span>
                </div>
                <h2 className="text-[19px] font-bold text-slate-900 leading-snug">
                  แผนการจัดการเรียนรู้รายวิชาภาษาไทยพื้นฐาน
                </h2>
                <h3 className="text-[15px] font-semibold text-slate-700 mt-1">
                  รหัสวิชา ท22101 ระดับชั้นมัธยมศึกษาปีที่ 2 • ภาคเรียนที่ 1/2569
                </h3>
                <p className="text-[13px] text-slate-500 mt-1">
                  หน่วยการเรียนรู้ที่ {currentPage}: การอ่านจับใจความและการคิดวิเคราะห์วรรณคดี
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ผ่านการตรวจประเมินโดยครูพี่เลี้ยงแล้ว (อนุมัติใช้สอนได้)
                </div>
              </div>

              {/* Document Content according to page */}
              {currentPage === 1 && (
                <div className="flex flex-col gap-5 pt-6 text-[13px] leading-relaxed text-slate-800">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#1e3a8a]">
                        verified
                      </span>
                      1. มาตรฐานการเรียนรู้และตัวชี้วัด (Learning Standards & Indicators)
                    </h4>
                    <p className="text-slate-700 text-[12.5px]">
                      <strong>มาตรฐาน ท 1.1:</strong> ใช้กระบวนการอ่านสร้างความรู้และความคิดเพื่อนำไปใช้ตัดสินใจ แก้ปัญหาในการดำเนินชีวิต และมีนิสัยรักการอ่าน<br />
                      <strong>ตัวชี้วัด ม.2/2:</strong> จับใจความสำคัญ สรุปความ และอธิบายรายละเอียดจากเรื่องที่อ่าน<br />
                      <strong>ตัวชี้วัด ม.2/7:</strong> อ่านหนังสือ บทความ หรือคำประพันธ์อย่างหลากหลาย และประเมินคุณค่าเพื่อนำไปใช้แก้ปัญหาในชีวิต
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5 text-[14px]">
                      2. สาระสำคัญ / ความคิดรวบยอด (Key Concept)
                    </h4>
                    <p className="text-slate-700 text-[12.5px]">
                      การอ่านจับใจความสำคัญของวรรณคดีเรื่องราชาธิราช ตอน สมิงพระรามอาสา เป็นการฝึกทักษะการสกัดประเด็นหลักและเจตนาของเรื่อง ทำให้ผู้เรียนเข้าใจลำดับเหตุการณ์ คุณลักษณะของตัวละคร และข้อคิดเชิงจริยธรรมที่สามารถเชื่อมโยงกับสถานการณ์ในชีวิตปัจจุบันได้อย่างมีวิจารณญาณ
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5 text-[14px]">
                      3. จุดประสงค์การเรียนรู้ (Learning Objectives)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[12.5px]">
                      <li><strong>ด้านความรู้ (K):</strong> นักเรียนสามารถอธิบายหลักการและขั้นตอนการอ่านจับใจความสำคัญของเรื่องราชาธิราชได้อย่างถูกต้อง</li>
                      <li><strong>ด้านทักษะ/กระบวนการ (P):</strong> นักเรียนสามารถเขียนสรุปแผนภาพโครงเรื่อง (Story Mapping) และระบุใจความสำคัญได้</li>
                      <li><strong>ด้านคุณลักษณะอันพึงประสงค์ (A):</strong> มีความซื่อสัตย์สุจริต ใฝ่เรียนรู้ และมุ่งมั่นในการทำงานร่วมกับผู้อื่น</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="flex flex-col gap-5 pt-6 text-[13px] leading-relaxed text-slate-800">
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                    <h4 className="font-bold text-[#1e3a8a] mb-1 text-[14px]">
                      4. กิจกรรมการจัดการเรียนรู้ (Active Learning 5 ขั้นตอน)
                    </h4>
                    <span className="text-[11.5px] text-slate-500">
                      เวลาที่ใช้: 2 คาบเรียน (100 นาที) • รูปแบบ: สืบเสาะหาความรู้และกลุ่มร่วมมือ
                    </span>
                  </div>

                  <div className="space-y-3 text-[12.5px]">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">
                        ขั้นที่ 1: กระตุ้นความสนใจ (Engagement - 10 นาที)
                      </span>
                      <p className="text-slate-700 mt-1">
                        ครูผู้สอนเปิดคลิปภาพเหตุการณ์จำลองบทสนทนาระหว่างพระเจ้าฝรั่งมังฆ้องกับสมิงพระราม และตั้งคำถามท้าทายให้นักเรียนร่วมแสดงความคิดเห็นผ่านแอปพลิเคชันตอบคำถาม
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">
                        ขั้นที่ 2: สำรวจและค้นหา (Exploration - 25 นาที)
                      </span>
                      <p className="text-slate-700 mt-1">
                        ผู้เรียนแบ่งกลุ่ม 4-5 คน ศึกษาบทอ่านในหนังสือเรียนและใบความรู้ดิจิทัล ร่วมกันสกัดเหตุการณ์สำคัญ 5 เหตุการณ์ลงในใบงานผังมโนทัศน์
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">
                        ขั้นที่ 3: อธิบายและลงข้อสรุป (Explanation - 25 นาที)
                      </span>
                      <p className="text-slate-700 mt-1">
                        ตัวแทนแต่ละกลุ่มนำเสนอผังโครงเรื่อง ครูเชื่อมโยงข้อคิดและอภิปรายประเด็นความกล้าหาญและความเสียสละเพื่อชาติบ้านเมือง
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">
                        ขั้นที่ 4: ขยายความรู้ (Elaboration - 20 นาที)
                      </span>
                      <p className="text-slate-700 mt-1">
                        นักเรียนทำกิจกรรมจับคู่เหตุการณ์ในวรรณคดีกับข่าวสารเหตุการณ์จริงในปัจจุบัน เพื่อสะท้อนการตัดสินใจเชิงคุณธรรม
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block">
                        ขั้นที่ 5: ประเมินผล (Evaluation - 20 นาที)
                      </span>
                      <p className="text-slate-700 mt-1">
                        ประเมินผลสัมฤทธิ์ผ่านแบบทดสอบย่อย 5 ข้อ และให้นักเรียนเขียนสะท้อนการเรียนรู้ (Exit Ticket) 3 บรรทัดก่อนหมดคาบ
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 3 && (
                <div className="flex flex-col gap-5 pt-6 text-[13px] leading-relaxed text-slate-800">
                  <h4 className="font-bold text-slate-900 text-[14px]">
                    5. สื่อ แหล่งการเรียนรู้ และเทคโนโลยีประกอบการสอน
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">สื่อการเรียนรู้</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        <li>หนังสือเรียนวิวิธภาษา ชั้น ม.2</li>
                        <li>ชุดใบงานผังมโนทัศน์วิเคราะห์ตัวละคร</li>
                        <li>สไลด์การสอนดิจิทัล Active Learning</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">แหล่งเรียนรู้</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        <li>ห้องสมุดเฉลิมพระเกียรติของโรงเรียน</li>
                        <li>คลังสื่อการสอนออนไลน์ สพฐ. (OBEC Content Center)</li>
                        <li>บทความวรรณคดีวิจักษ์ กรมวิชาการ</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-[14px] mt-2">
                    6. การวัดและประเมินผลการเรียนรู้ (Measurement & Evaluation)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[12px] border-collapse border border-slate-200">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="p-2 border border-slate-200">เป้าหมายการประเมิน</th>
                          <th className="p-2 border border-slate-200">เครื่องมือวัดผล</th>
                          <th className="p-2 border border-slate-200">เกณฑ์การผ่าน</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        <tr>
                          <td className="p-2 border border-slate-200">ความรู้ความเข้าใจ (K)</td>
                          <td className="p-2 border border-slate-200">แบบทดสอบย่อย 5 ข้อ</td>
                          <td className="p-2 border border-slate-200">ได้คะแนนร้อยละ 70 ขึ้นไป</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">ทักษะการจับใจความ (P)</td>
                          <td className="p-2 border border-slate-200">ใบงานผังมโนทัศน์สรุปความ</td>
                          <td className="p-2 border border-slate-200">ระดับคุณภาพ "ดี" ขึ้นไป</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">คุณลักษณะใฝ่เรียนรู้ (A)</td>
                          <td className="p-2 border border-slate-200">แบบสังเกตพฤติกรรมกลุ่ม</td>
                          <td className="p-2 border border-slate-200">ระดับคุณภาพ "ผ่าน"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentPage === 4 && (
                <div className="flex flex-col gap-5 pt-6 text-[13px] leading-relaxed text-slate-800">
                  <h4 className="font-bold text-slate-900 text-[14px]">
                    7. บันทึกผลหลังการจัดการเรียนรู้และความคิดเห็นของผู้ประเมิน
                  </h4>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-[12.5px]">
                    <div>
                      <span className="font-bold text-slate-900 block">ผลการจัดกิจกรรม:</span>
                      <p className="text-slate-700 mt-0.5">
                        นักเรียนชั้น ม.2 ทั้งหมด 35 คน มีส่วนร่วมในกิจกรรมอย่างกระตือรือร้น สามารถเขียนสรุปผังมโนทัศน์ได้ถูกต้องคิดเป็นร้อยละ 88.5 ของห้องเรียน
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">ปัญหา / อุปสรรค:</span>
                      <p className="text-slate-700 mt-0.5">
                        นักเรียนประมาณ 4 คน ใช้เวลานานในการเขียนเรียบเรียงภาษาให้สละสลวย
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">แนวทางแก้ไข / พัฒนา:</span>
                      <p className="text-slate-700 mt-0.5">
                        จัดกิจกรรมเสริมทักษะการสะกดคำและเทคนิคการเขียนจับใจความย่อในชั่วโมงสอนซ่อมเสริม
                      </p>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-6 pt-8 mt-4 border-t border-slate-300 text-center text-[12px]">
                    <div className="flex flex-col items-center">
                      <span className="font-script text-[18px] text-blue-900 mb-1">
                        ศิริพร บุญเจริญ
                      </span>
                      <span className="text-slate-800 font-medium">
                        (นางสาวศิริพร บุญเจริญ)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        นักศึกษาฝึกประสบการณ์วิชาชีพครูผู้สอน
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="font-script text-[18px] text-emerald-900 mb-1">
                        วิชัย เกียรติสกุล
                      </span>
                      <span className="text-slate-800 font-medium">
                        (อาจารย์วิชัย เกียรติสกุล)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        ครูพี่เลี้ยง / หัวหน้ากลุ่มสาระการเรียนรู้
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
                <span>หลักสูตรสถานศึกษา โรงเรียนสาธิตมหาวิทยาลัยราชภัฏ</span>
                <span>หน้า {currentPage} จาก {totalPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

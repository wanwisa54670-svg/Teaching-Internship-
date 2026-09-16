/**
 * Helper utility for Thai date and calendar handling
 */

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const THAI_DAYS = [
  'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'
];

export function formatThaiDate(dateStr: string): string {
  if (!dateStr) return '';
  // Check if it's already Thai text
  if (
    dateStr.includes('วัน') ||
    THAI_MONTHS_SHORT.some((m) => dateStr.includes(m)) ||
    THAI_MONTHS_FULL.some((m) => dateStr.includes(m))
  ) {
    return dateStr;
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const dayOfWeek = THAI_DAYS[d.getDay()];
  const dayNum = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear() + 543;

  return `${dayOfWeek}ที่ ${dayNum} ${month} ${year}`;
}

export function getDayOfWeekFromDate(dateStr: string): string {
  if (!dateStr) return 'วันจันทร์';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'วันปฏิบัติงาน';
  return THAI_DAYS[d.getDay()];
}

export function getTodayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

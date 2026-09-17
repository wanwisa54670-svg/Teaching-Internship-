export interface TraineeProfile {
  name: string;
  studentId: string;
  status: string;
  phone: string;
  email: string;
  subjectGroup: string;
  schoolName: string;
  educationLevel: string;
  term: string;
  avatarUrl: string;
}

export type ActiveTab = 'home' | 'school' | 'weekly-log' | 'academics' | 'settings';

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'urgent' | 'info' | 'success';
  read: boolean;
}

export interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'ตรงเวลา' | 'สาย' | 'ลากิจ' | 'ลาป่วย';
}

export interface SchoolPhoto {
  id: string;
  url: string;
  title: string;
  category: 'อาคารสถานที่' | 'บรรยากาศการสอน' | 'กิจกรรมโรงเรียน' | 'สิ่งอำนวยความสะดวก';
  uploadedAt: string;
  caption?: string;
  fileType?: string; // 'application/pdf' or image mime
  fileName?: string;
  fileSize?: string;
}

export interface SchoolDetails {
  name: string;
  affiliation: string;
  levels: string;
  subjectGroup: string;
  directorName: string;
  mentorName: string;
  mentorPosition?: string;
  mentorPhotoUrl?: string;
  mentorPhone?: string;
  mentorEmail?: string;
  phone: string;
  address: string;
  workHours: string;
  dutyDay: string;
  clubActivity: string;
  teachingLoad: string;
  staffRoom: string;
  photos: SchoolPhoto[];
}

export interface DailyWorkRecord {
  id: string;
  date: string; // YYYY-MM-DD or readable string
  formattedDate?: string; // e.g. "วันจันทร์ที่ 3 มิ.ย. 2567"
  dayOfWeek?: string; // e.g. "วันจันทร์"
  workHours: string; // e.g. "07:30 - 16:30 น."
  activities: string; // รายละเอียดว่าวันนี้ทำอะไร
  notes?: string; // บันทึกเพิ่มเติม / ปัญหา / ข้อสังเกต
  photoUrl?: string; // รูปถ่ายกิจกรรมประจำวัน
  fileName?: string;
  fileType?: string;
  fileSize?: string;
}

export interface WeekPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
}

export interface WeeklyLogItem {
  id: string;
  week: number;
  title: string;
  hours: number;
  dateRange: string;
  reflection?: string;
  mentorFeedback?: string;
  photos: WeekPhoto[];
  dailyLogs: DailyWorkRecord[];
}

export interface AcademicItem {
  id: string;
  title: string;
  desc: string;
  count: string;
  icon: string;
  category: 'ตารางสอน' | 'แผนการสอน' | 'วิจัยในชั้นเรียน' | 'รายงานการนิเทศ' | 'สื่อนวัตกรรม' | 'วิจัย CAR' | 'บันทึกหลังสอน' | 'ทั่วไป';
  status: 'สมบูรณ์' | 'กำลังดำเนินการ' | 'รออนุมัติ';
  // แผนการสอน และ วิจัยในชั้นเรียน (PDF attachment)
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  fileType?: string;
  // ตารางสอน (Image attachment)
  scheduleImageUrl?: string;
  scheduleImageName?: string;
  // รายงานการนิเทศ
  supervisionDate?: string;
  supervisorName?: string;
  supervisionDetails?: string;
  supervisionPhotos?: string[];
  scoreOrFeedback?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  priority: 'urgent' | 'normal';
  completed: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  sender: string;
  content: string;
}

export interface DashboardStats {
  teachingHoursDone: number;
  teachingHoursTarget: number;
  plansSubmitted: number;
  plansTotal: number;
  currentWeek: number;
  totalWeeks: number;
}

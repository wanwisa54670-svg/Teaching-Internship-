/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  NotificationItem,
  TraineeProfile,
  SchoolDetails,
  WeeklyLogItem,
  AcademicItem,
  DashboardStats,
  TaskItem,
  AnnouncementItem,
  AttendanceRecord,
} from './types';
import { INITIAL_18_WEEKS } from './data/initialWeeklyLogs';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { Header } from './components/Header';
import { ProfileHero } from './components/ProfileHero';
import { PracticumSection } from './components/PracticumSection';
import { ReportsSection } from './components/ReportsSection';
import { SecuritySection } from './components/SecuritySection';
import { FooterSection } from './components/FooterSection';
import { WebFooter } from './components/WebFooter';
import { BottomNav } from './components/BottomNav';

// Modals
import { ProfileEditModal } from './components/modals/ProfileEditModal';
import { IdCardModal } from './components/modals/IdCardModal';
import { PersonalDocsModal } from './components/modals/PersonalDocsModal';
import { SchoolInfoModal } from './components/modals/SchoolInfoModal';
import { MentorsModal, MentorsData } from './components/modals/MentorsModal';
import { AttendanceModal } from './components/modals/AttendanceModal';
import { PasswordModal } from './components/modals/PasswordModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { FilePreviewModal } from './components/modals/FilePreviewModal';

// Firebase & Firestore
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, getActiveUserId, signInAnonymously, FIREBASE_PROJECT_NAME } from './lib/firebase';
import {
  fetchFullUserDataFromFirestore,
  syncUserProfileToFirestore,
  syncAllWeeklyLogsToFirestore,
  syncAllAcademicItemsToFirestore,
  saveSchoolPhotoToFirestore,
  deleteSchoolPhotoFromFirestore,
} from './lib/firestoreService';

// Views
import { HomeView } from './components/views/HomeView';
import { SchoolView } from './components/views/SchoolView';
import { WeeklyLogView } from './components/views/WeeklyLogView';
import { AcademicsView } from './components/views/AcademicsView';

const INITIAL_PROFILE: TraineeProfile = {
  name: 'นางสาววรรวิษา พันธุ์สาย',
  studentId: '6702041510156',
  status: 'กำลังฝึกประสบการณ์วิชาชีพครู 1',
  phone: '089-765-4321',
  email: 'wanwisa54670@gmail.com',
  subjectGroup: 'ภาษาไทย (ระดับมัธยมศึกษาตอนต้น)',
  schoolName: 'ร.ร. สาธิตมหาวิทยาลัยราชภัฏ',
  educationLevel: 'มัธยมศึกษา',
  term: 'ภาคเรียนที่ 1/2569',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDvAaCO8VzSaXFEfdx7noVJ0CkGU2lWWkJaoDGraTJpt8q0BL_dB332T9_D5CGA1-rIWN5gtlfdRR33Rgm-vJ6pP6U8EjNtfjbc3pfGYHg5yrMP23-ldx0UGAlSea-rIDDFwMhoYQpriDu45_A7WPZNjSmWPeyyNBd77FrNBYfGgLGh8rwmDF7QexqD-qMTkUztjcUH5pgl8PWvbvWZ6AY4ueOVSjSL_90dixxzwsLFXIyhUbJUnDwjSw',
};

const INITIAL_SCHOOL_INFO: SchoolDetails = {
  name: 'ร.ร. สาธิตมหาวิทยาลัยราชภัฏ',
  affiliation: 'สังกัดสำนักงานคณะกรรมการการอุดมศึกษา',
  levels: 'มัธยมศึกษาตอนต้น - ตอนปลาย',
  subjectGroup: 'กลุ่มสาระการเรียนรู้ภาษาไทย',
  directorName: 'ดร.เกียรติศักดิ์ เจริญรัตน์',
  mentorName: 'อาจารย์วิชัย เกียรติสกุล',
  mentorPosition: 'ครูชำนาญการพิเศษ • กลุ่มสาระการเรียนรู้ภาษาไทย',
  mentorPhotoUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  mentorPhone: '081-445-6789',
  mentorEmail: 'wichai.k@satit.edu',
  phone: '02-258-4000',
  address: 'ถนนประสานมิตร แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
  workHours: '07:30 - 16:30 น.',
  dutyDay: 'เวรดูแลนักเรียนประตูหน้า (วันพุธ)',
  clubActivity: 'ที่ปรึกษาชุมนุมวรรณศิลป์และวรรณกรรมร่วมสมัย',
  teachingLoad: '12 คาบ / สัปดาห์ (ม.2/1 - ม.2/3)',
  staffRoom: 'อาคาร 3 ชั้น 2 ห้องวิชาการกลุ่มสาระภาษาไทย',
  photos: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      title: 'อาคารเรียนเฉลิมพระเกียรติ 7 รอบ',
      category: 'อาคารสถานที่',
      uploadedAt: '1 มิ.ย. 2567',
      caption: 'อาคารเรียนหลักของนักเรียนระดับชั้นมัธยมศึกษาตอนต้น',
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      title: 'บรรยากาศการจัดกิจกรรมการเรียนรู้ ม.2/1',
      category: 'บรรยากาศการสอน',
      uploadedAt: '12 มิ.ย. 2567',
      caption: 'การจัดการเรียนรู้แบบ Active Learning เรื่อง ราชาธิราช',
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      title: 'ห้องสมุดและศูนย์วิทยบริการโรงเรียน',
      category: 'สิ่งอำนวยความสะดวก',
      uploadedAt: '18 มิ.ย. 2567',
      caption: 'พื้นที่ศึกษาค้นคว้าข้อมูลและสืบค้นงานวิจัยในชั้นเรียน',
    },
    {
      id: 'photo-4',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      title: 'กิจกรรมสัปดาห์ส่งเสริมวันภาษาไทยแห่งชาติ',
      category: 'กิจกรรมโรงเรียน',
      uploadedAt: '25 ก.ค. 2567',
      caption: 'เวทีประกวดอ่านทำนองเสนาะและการแสดงละครวรรณคดี',
    },
  ],
};

const INITIAL_WEEKLY_LOGS: WeeklyLogItem[] = INITIAL_18_WEEKS;

const INITIAL_ACADEMICS: AcademicItem[] = [
  {
    id: 'ac-1',
    title: 'แผนการจัดการเรียนรู้รายวิชาภาษาไทยพื้นฐาน ม.2',
    desc: 'แผนการสอนตามแนวคิด Active Learning จำนวน 4 หน่วยการเรียนรู้ 18 สัปดาห์',
    count: '18 แผน',
    icon: 'menu_book',
    category: 'แผนการสอน',
    status: 'สมบูรณ์',
    fileName: 'แผนการจัดการเรียนรู้_ภาษาไทย_ม2.pdf',
    fileSize: '2.4 MB',
    fileUrl: '',
  },
  {
    id: 'ac-2',
    title: 'งานวิจัยในชั้นเรียน (Classroom Action Research)',
    desc: 'การพัฒนาทักษะการเขียนสะกดคำภาษาไทยโดยใช้ชุดแบบฝึกประยุกต์สำหรับนักเรียนชั้น ม.2',
    count: 'ฉบับสมบูรณ์ 1 เล่ม',
    icon: 'psychology',
    category: 'วิจัยในชั้นเรียน',
    status: 'กำลังดำเนินการ',
  },
  {
    id: 'ac-3',
    title: 'รายงานการนิเทศการสอน ครั้งที่ 1',
    desc: 'การนิเทศสังเกตการสอนในชั้นเรียน เรื่อง การอ่านจับใจความสำคัญ โดยอาจารย์นิเทศก์และครูพี่เลี้ยง',
    count: 'ครั้งที่ 1/3',
    icon: 'supervisor_account',
    category: 'รายงานการนิเทศ',
    status: 'สมบูรณ์',
    supervisionDate: '15 กรกฎาคม 2569',
    supervisorName: 'ผศ.ดร.พรพิมล รัตนโกสินทร์ (อาจารย์นิเทศก์) และ อ.วิชัย เกียรติสกุล (ครูพี่เลี้ยง)',
    supervisionDetails:
      'การจัดการชั้นเรียนทำได้ดีมาก มีการจัดกิจกรรมกลุ่ม Active Learning และใช้สื่อเทคโนโลยีกระตุ้นการมีส่วนร่วม ข้อเสนอแนะ: เพิ่มเวลาในการสรุปบทเรียนและเชื่อมโยงกับชีวิตประจำวันของผู้เรียน',
    scoreOrFeedback: 'ระดับดีเด่น (4.85/5.00)',
    supervisionPhotos: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    ],
  },
];

const INITIAL_STATS: DashboardStats = {
  teachingHoursDone: 74,
  teachingHoursTarget: 180,
  plansSubmitted: 8,
  plansTotal: 18,
  currentWeek: 8,
  totalWeeks: 18,
};

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'ส่งแผนการจัดการเรียนรู้หน่วยที่ 4 เรื่อง ราชาธิราช',
    dueDate: 'ศุกร์นี้ 16:00 น.',
    priority: 'urgent',
    completed: false,
  },
  {
    id: 't-2',
    title: 'บันทึกสะท้อนคิดประจำสัปดาห์ที่ 8 เข้าสู่ระบบ',
    dueDate: 'วันจันทร์หน้า 08:30 น.',
    priority: 'normal',
    completed: false,
  },
  {
    id: 't-3',
    title: 'เตรียมชุดข้อสอบปลายภาคและเกณฑ์รูบริกส์ (Rubrics)',
    dueDate: '20 ส.ค. 2567',
    priority: 'normal',
    completed: false,
  },
  {
    id: 't-4',
    title: 'ส่งแบบประเมินพฤติกรรมการสอนรอบกลางภาค',
    dueDate: 'เสร็จสิ้นแล้ว',
    priority: 'normal',
    completed: true,
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'a-1',
    title: 'กำหนดการนิเทศก์การสอนรอบที่ 2 โดยอาจารย์นิเทศก์ มรภ.',
    date: '14 ส.ค. 2567',
    sender: 'ฝ่ายฝึกประสบการณ์วิชาชีพครู',
    content:
      'ขอให้นักศึกษาฝึกสอนทุกคนเตรียมแฟ้มสะสมงาน แผนการจัดการเรียนรู้ และร่องรอยผลงานนักเรียนให้พร้อมรับการตรวจเยี่ยมในสัปดาห์หน้า',
  },
  {
    id: 'a-2',
    title: 'แจ้งการจัดกิจกรรมวันแม่แห่งชาติและวันรักภาษาไทย',
    date: '10 ส.ค. 2567',
    sender: 'งานกิจกรรมนักเรียน ร.ร.สาธิตฯ',
    content:
      'ขอเชิญครูฝึกสอนกลุ่มสาระภาษาไทยร่วมเป็นคณะกรรมการตัดสินการประกวดเรียงความและการเขียนกลอนสุภาพ',
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { date: '15 ก.ย. 2567 (วันนี้)', checkIn: '07:28 น.', checkOut: '16:45 น.', status: 'ตรงเวลา' },
  { date: '12 ก.ย. 2567 (ศุกร์)', checkIn: '07:22 น.', checkOut: '16:35 น.', status: 'ตรงเวลา' },
  { date: '11 ก.ย. 2567 (พฤหัส)', checkIn: '07:30 น.', checkOut: '17:10 น.', status: 'ตรงเวลา' },
  { date: '10 ก.ย. 2567 (พุธ)', checkIn: '07:15 น.', checkOut: '16:30 น.', status: 'ตรงเวลา' },
  { date: '09 ก.ย. 2567 (อังคาร)', checkIn: '-', checkOut: '-', status: 'ลากิจ' },
];

const INITIAL_MENTORS: MentorsData = {
  schoolMentor: {
    name: 'อาจารย์วิชัย เกียรติสกุล',
    position: 'ครูชำนาญการพิเศษ • กลุ่มสาระการเรียนรู้ภาษาไทย',
    phone: '081-445-6789',
    email: 'wichai.k@satit.edu',
  },
  universitySupervisor: {
    name: 'ผศ.ดร.พรพิมล รัตนโกสินทร์',
    position: 'ภาควิชาหลักสูตรและการสอน • คณะครุศาสตร์',
    phone: '02-218-2000 ต่อ 412',
    email: 'pornpimon.r@rajabhat.ac.th',
    visitsDone: 1,
    visitsTotal: 3,
  },
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'ครูพี่เลี้ยง อ.วิชัย บันทึกข้อเสนอแนะกิจกรรมสัปดาห์ที่ 7 เรียบร้อยแล้ว',
    time: '2 ชั่วโมงที่แล้ว',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'เตือนส่งแผนการจัดการเรียนรู้หน่วยที่ 4 ภายในวันศุกร์นี้ 16:00 น.',
    time: 'วันนี้ 09:30 น.',
    type: 'urgent',
    read: false,
  },
  {
    id: '3',
    title: 'ระบบสำรองไฟล์รายงานเล่มสมบูรณ์เข้า Google Drive สำเร็จ',
    time: 'เมื่อวาน 18:20 น.',
    type: 'info',
    read: true,
  },
];

export default function App() {
  const [profile, setProfile] = useState<TraineeProfile>(() => {
    const loaded = loadFromStorage('tp_profile_data', INITIAL_PROFILE);
    if (!loaded.term || loaded.term === '1 / 2567') {
      loaded.term = 'ภาคเรียนที่ 1/2569';
    }
    return loaded;
  });

  const [schoolInfo, setSchoolInfo] = useState<SchoolDetails>(() => {
    const loaded = loadFromStorage('tp_school_data', INITIAL_SCHOOL_INFO);
    return {
      ...INITIAL_SCHOOL_INFO,
      ...loaded,
      mentorPosition: loaded.mentorPosition || INITIAL_SCHOOL_INFO.mentorPosition,
      mentorPhotoUrl: loaded.mentorPhotoUrl || INITIAL_SCHOOL_INFO.mentorPhotoUrl,
      mentorPhone: loaded.mentorPhone || INITIAL_SCHOOL_INFO.mentorPhone,
      mentorEmail: loaded.mentorEmail || INITIAL_SCHOOL_INFO.mentorEmail,
    };
  });

  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogItem[]>(() =>
    loadFromStorage('tp_weekly_logs_data', INITIAL_WEEKLY_LOGS)
  );

  const [academicItems, setAcademicItems] = useState<AcademicItem[]>(() => {
    const loaded = loadFromStorage<AcademicItem[]>('tp_academics_data', INITIAL_ACADEMICS);
    // Filter out removed categories: สื่อนวัตกรรม, บันทึกหลังสอน, ทั่วไป
    const cleaned = (loaded || [])
      .filter((item) => !['สื่อนวัตกรรม', 'บันทึกหลังสอน', 'ทั่วไป'].includes(item.category))
      .map((item) => {
        if ((item.category as string) === 'วิจัย CAR') {
          return {
            ...item,
            category: 'วิจัยในชั้นเรียน' as const,
            title: item.title.includes('วิจัย')
              ? item.title.replace('วิจัยปฏิบัติการในชั้นเรียน (Classroom Action Research)', 'งานวิจัยในชั้นเรียน (Classroom Action Research)')
              : item.title,
          };
        }
        if (item.category === 'แผนการสอน' && !item.fileName) {
          return {
            ...item,
            fileName: 'แผนการจัดการเรียนรู้_ภาษาไทย_ม2.pdf',
            fileSize: '2.4 MB',
          };
        }
        return item;
      });

    // Ensure we have at least one supervision report
    if (!cleaned.some((item) => item.category === 'รายงานการนิเทศ')) {
      const supervisionSample = INITIAL_ACADEMICS.find((a) => a.category === 'รายงานการนิเทศ');
      if (supervisionSample) {
        cleaned.push(supervisionSample);
      }
    }

    return cleaned.length > 0 ? cleaned : INITIAL_ACADEMICS;
  });

  const [stats, setStats] = useState<DashboardStats>(() =>
    loadFromStorage('tp_stats_data', INITIAL_STATS)
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    loadFromStorage('tp_tasks_data', INITIAL_TASKS)
  );
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() =>
    loadFromStorage('tp_announcements_data', INITIAL_ANNOUNCEMENTS)
  );
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadFromStorage('tp_attendance_data', INITIAL_ATTENDANCE)
  );
  const [mentors, setMentors] = useState<MentorsData>(() =>
    loadFromStorage('tp_mentors_data', INITIAL_MENTORS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('tp_notifications_data', INITIAL_NOTIFICATIONS)
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isDark, setIsDark] = useState<boolean>(() =>
    loadFromStorage('tp_is_dark_theme', false)
  );

  // Auto-save effects to localStorage
  useEffect(() => {
    saveToStorage('tp_profile_data', profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage('tp_school_data', schoolInfo);
  }, [schoolInfo]);

  useEffect(() => {
    saveToStorage('tp_weekly_logs_data', weeklyLogs);
  }, [weeklyLogs]);

  useEffect(() => {
    saveToStorage('tp_academics_data', academicItems);
  }, [academicItems]);

  useEffect(() => {
    saveToStorage('tp_stats_data', stats);
  }, [stats]);

  useEffect(() => {
    saveToStorage('tp_tasks_data', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('tp_announcements_data', announcements);
  }, [announcements]);

  useEffect(() => {
    saveToStorage('tp_attendance_data', attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    saveToStorage('tp_mentors_data', mentors);
  }, [mentors]);

  useEffect(() => {
    saveToStorage('tp_notifications_data', notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage('tp_is_dark_theme', isDark);
  }, [isDark]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase Auth and Cloud Sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() =>
    loadFromStorage('tp_last_synced_at', null)
  );

  // File preview modal state
  const [previewFile, setPreviewFile] = useState<{
    isOpen: boolean;
    url: string;
    name: string;
    type?: string;
    size?: string;
  }>({
    isOpen: false,
    url: '',
    name: '',
  });

  const handleOpenPreview = (url: string, name: string, type?: string, size?: string) => {
    setPreviewFile({
      isOpen: true,
      url,
      name,
      type,
      size,
    });
  };

  // Listen to Firebase Auth state changes and sync with project Teaching-Internship
  useEffect(() => {
    let isMounted = true;

    const initFirebaseData = async () => {
      setIsSyncing(true);
      const uid = getActiveUserId();
      try {
        const remoteData = await fetchFullUserDataFromFirestore(uid);
        if (!isMounted) return;

        if (remoteData && remoteData.exists) {
          if (remoteData.profile) {
            setProfile(remoteData.profile);
            saveToStorage('tp_profile_data', remoteData.profile);
          }
          if (remoteData.schoolInfo) {
            setSchoolInfo(remoteData.schoolInfo);
            saveToStorage('tp_school_data', remoteData.schoolInfo);
          }
          if (remoteData.weeklyLogs && remoteData.weeklyLogs.length > 0) {
            setWeeklyLogs(remoteData.weeklyLogs);
            saveToStorage('tp_weekly_logs_data', remoteData.weeklyLogs);
          }
          if (remoteData.academicItems && remoteData.academicItems.length > 0) {
            setAcademicItems(remoteData.academicItems);
            saveToStorage('tp_academics_data', remoteData.academicItems);
          }
          if (remoteData.stats) {
            setStats(remoteData.stats);
            saveToStorage('tp_stats_data', remoteData.stats);
          }
          if (remoteData.tasks && remoteData.tasks.length > 0) {
            setTasks(remoteData.tasks);
            saveToStorage('tp_tasks_data', remoteData.tasks);
          }
          if (remoteData.announcements && remoteData.announcements.length > 0) {
            setAnnouncements(remoteData.announcements);
            saveToStorage('tp_announcements_data', remoteData.announcements);
          }
          if (remoteData.attendanceRecords && remoteData.attendanceRecords.length > 0) {
            setAttendanceRecords(remoteData.attendanceRecords);
            saveToStorage('tp_attendance_data', remoteData.attendanceRecords);
          }
          if (remoteData.mentors) {
            setMentors(remoteData.mentors);
            saveToStorage('tp_mentors_data', remoteData.mentors);
          }
          showToast(`✓ ดึงข้อมูลล่าสุดจาก Firebase (${FIREBASE_PROJECT_NAME}) เรียบร้อย`);
        }
        const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        setLastSyncedAt(nowStr);
        saveToStorage('tp_last_synced_at', nowStr);
      } catch (error) {
        console.warn('Error syncing with Firestore:', error);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    initFirebaseData();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Modal visibility states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [isMentorsOpen, setIsMentorsOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSaveAll = async () => {
    // 1. Save locally in browser
    saveToStorage('tp_profile_data', profile);
    saveToStorage('tp_school_data', schoolInfo);
    saveToStorage('tp_weekly_logs_data', weeklyLogs);
    saveToStorage('tp_academics_data', academicItems);
    saveToStorage('tp_stats_data', stats);
    saveToStorage('tp_tasks_data', tasks);
    saveToStorage('tp_announcements_data', announcements);
    saveToStorage('tp_attendance_data', attendanceRecords);
    saveToStorage('tp_mentors_data', mentors);
    saveToStorage('tp_notifications_data', notifications);
    saveToStorage('tp_is_dark_theme', isDark);

    // 2. Save directly to Firebase Project Teaching-Internship
    setIsSyncing(true);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    try {
      await syncUserProfileToFirestore(uid, profile, schoolInfo, stats, {
        tasks,
        announcements,
        attendanceRecords,
        mentors,
      });
      await syncAllWeeklyLogsToFirestore(uid, weeklyLogs);
      await syncAllAcademicItemsToFirestore(uid, academicItems);
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      setLastSyncedAt(nowStr);
      saveToStorage('tp_last_synced_at', nowStr);
      showToast(`✓ บันทึกข้อมูลทั้งหมดลง Firebase (${FIREBASE_PROJECT_NAME}) สำเร็จ`);
    } catch (err) {
      console.warn('Firebase save warning:', err);
      showToast(`✓ บันทึกข้อมูลในเครื่องเรียบร้อยแล้ว (เชื่อมต่อ Firebase: ${FIREBASE_PROJECT_NAME})`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      profile,
      schoolInfo,
      weeklyLogs,
      academicItems,
      stats,
      tasks,
      announcements,
      attendanceRecords,
      mentors,
      isDark,
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `บันทึกฝึกสอน_18สัปดาห์_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('✓ ดาวน์โหลดไฟล์สำรองข้อมูล (JSON) สำเร็จ');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.profile) setProfile(data.profile);
        if (data.schoolInfo) setSchoolInfo(data.schoolInfo);
        if (data.weeklyLogs) setWeeklyLogs(data.weeklyLogs);
        if (data.academicItems) setAcademicItems(data.academicItems);
        if (data.stats) setStats(data.stats);
        if (data.tasks) setTasks(data.tasks);
        if (data.announcements) setAnnouncements(data.announcements);
        if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
        if (data.mentors) setMentors(data.mentors);
        if (typeof data.isDark === 'boolean') setIsDark(data.isDark);

        showToast('✓ นำเข้าและกู้คืนข้อมูลสำรองเรียบร้อยแล้ว');
      } catch (err) {
        showToast('❌ ไม่สามารถอ่านไฟล์สำรองได้ กรุณาใช้ไฟล์ JSON ที่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่? (ข้อมูลที่บันทึกไว้จะถูกลบ)')) {
      setProfile(INITIAL_PROFILE);
      setSchoolInfo(INITIAL_SCHOOL_INFO);
      setWeeklyLogs(INITIAL_WEEKLY_LOGS);
      setAcademicItems(INITIAL_ACADEMICS);
      setStats(INITIAL_STATS);
      setTasks(INITIAL_TASKS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setAttendanceRecords(INITIAL_ATTENDANCE);
      setMentors(INITIAL_MENTORS);
      showToast('คืนค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('ทำเครื่องหมายอ่านการแจ้งเตือนทั้งหมดแล้ว');
  };

  const handleProfileSave = (updated: TraineeProfile) => {
    setProfile(updated);
    // Keep school name synced if changed in profile
    if (updated.schoolName !== schoolInfo.name) {
      setSchoolInfo((prev) => ({ ...prev, name: updated.schoolName }));
    }
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncUserProfileToFirestore(uid, updated, schoolInfo, stats, {
      tasks,
      announcements,
      attendanceRecords,
      mentors,
    }).catch((e) => console.warn('Firestore profile sync error:', e));
    showToast('✓ อัปเดตข้อมูลโปรไฟล์และบันทึกลง Firebase เรียบร้อย');
  };

  const handleUpdateSchoolInfo = (updated: SchoolDetails) => {
    setSchoolInfo(updated);
    // Keep profile schoolName synced
    if (updated.name !== profile.schoolName) {
      setProfile((prev) => ({ ...prev, schoolName: updated.name }));
    }
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncUserProfileToFirestore(uid, profile, updated, stats, {
      tasks,
      announcements,
      attendanceRecords,
      mentors,
    }).catch((e) => console.warn('Firestore school info sync error:', e));
    showToast('✓ อัปเดตข้อมูลสถานศึกษาและบันทึกลง Firebase เรียบร้อย');
  };

  const handleUpdateWeeklyLogs = (updatedLogs: WeeklyLogItem[]) => {
    setWeeklyLogs(updatedLogs);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncAllWeeklyLogsToFirestore(uid, updatedLogs).catch((e) =>
      console.warn('Firestore weeklyLogs sync error:', e)
    );
  };

  const handleUpdateAcademicItems = (updatedItems: AcademicItem[]) => {
    setAcademicItems(updatedItems);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncAllAcademicItemsToFirestore(uid, updatedItems).catch((e) =>
      console.warn('Firestore academic items sync error:', e)
    );
  };

  const handleUpdateTasks = (updatedTasks: TaskItem[]) => {
    setTasks(updatedTasks);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncUserProfileToFirestore(uid, profile, schoolInfo, stats, {
      tasks: updatedTasks,
      announcements,
      attendanceRecords,
      mentors,
    }).catch((e) => console.warn('Firestore tasks sync error:', e));
  };

  const handleUpdateMentors = (updatedMentors: MentorsData) => {
    setMentors(updatedMentors);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncUserProfileToFirestore(uid, profile, schoolInfo, stats, {
      tasks,
      announcements,
      attendanceRecords,
      mentors: updatedMentors,
    }).catch((e) => console.warn('Firestore mentors sync error:', e));
    showToast('✓ อัปเดตข้อมูลอาจารย์นิเทศและบันทึกลง Firebase เรียบร้อย');
  };

  const handleUpdateAttendance = (updatedAttendance: AttendanceRecord[]) => {
    setAttendanceRecords(updatedAttendance);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    syncUserProfileToFirestore(uid, profile, schoolInfo, stats, {
      tasks,
      announcements,
      attendanceRecords: updatedAttendance,
      mentors,
    }).catch((e) => console.warn('Firestore attendance sync error:', e));
    showToast('✓ อัปเดตข้อมูลการลงเวลาและบันทึกลง Firebase เรียบร้อย');
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const uid = currentUser?.uid || auth.currentUser?.uid || getActiveUserId();
    try {
      await syncUserProfileToFirestore(uid, profile, schoolInfo, stats, {
        tasks,
        announcements,
        attendanceRecords,
        mentors,
      });
      await syncAllWeeklyLogsToFirestore(uid, weeklyLogs);
      await syncAllAcademicItemsToFirestore(uid, academicItems);
      const syncTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      setLastSyncedAt(syncTime);
      saveToStorage('tp_last_synced_at', syncTime);
      showToast(`✓ ซิงค์ข้อมูลทั้งหมดขึ้น Firebase (${FIREBASE_PROJECT_NAME}) สำเร็จ`);
    } catch (err: unknown) {
      console.error('Manual sync error:', err);
      showToast('❌ ไม่สามารถซิงค์ขึ้น Firebase ได้: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-[#faf8ff] text-[#131b2e]'
      }`}
    >
      {/* Fixed Top Website Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsEditProfileOpen(true)}
        onSaveAll={handleSaveAll}
        onToggleDark={() => setIsDark(!isDark)}
        unreadCount={unreadCount}
        avatarUrl={profile.avatarUrl}
        profileName={profile.name}
        isDark={isDark}
      />

      {/* Main Website Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 sm:pt-24 pb-20 md:pb-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        {/* Dynamic Interactive Toast Notification */}
        {toastMessage && (
          <div
            id="saveToast"
            role="status"
            className="w-full px-4 py-3 rounded-xl bg-[#004a31] text-white shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 z-30"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
              <span className="text-[13px] font-semibold">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white cursor-pointer ml-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Tab-driven Content Views */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            {/* Left Column (Desktop 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Profile Hero Card */}
              <ProfileHero
                profile={profile}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onViewIdCard={() => setIsIdCardOpen(true)}
                isDark={isDark}
              />

              {/* Section 1: ข้อมูลการฝึกสอนและสถานศึกษา */}
              <PracticumSection
                onOpenDocs={() => setIsDocsOpen(true)}
                onOpenSchool={() => setIsSchoolOpen(true)}
                onOpenMentors={() => setIsMentorsOpen(true)}
                termString={profile.term}
                isDark={isDark}
              />
            </div>

            {/* Right Column (Desktop 5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Section 2: ระบบรายงานและเอกสาร */}
              <ReportsSection
                onOpenAttendance={() => setIsAttendanceOpen(true)}
                showToast={showToast}
                backupEmail={profile.email}
                isDark={isDark}
              />

              {/* Section 3: การแจ้งเตือนและความปลอดภัย */}
              <SecuritySection
                onOpenPassword={() => setIsPasswordOpen(true)}
                showToast={showToast}
                isDark={isDark}
                onToggleTheme={(dark) => setIsDark(dark)}
                onSaveAll={handleSaveAll}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetData={handleResetData}
              />

              {/* Institutional Footer */}
              <FooterSection isDark={isDark} />
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            stats={stats}
            tasks={tasks}
            announcements={announcements}
            onUpdateStats={setStats}
            onUpdateTasks={handleUpdateTasks}
            onUpdateAnnouncements={setAnnouncements}
            onNavigateToSettings={() => setActiveTab('settings')}
            onNavigateToWeekly={() => setActiveTab('weekly-log')}
            onNavigateToSchool={() => setActiveTab('school')}
            onNavigateToAcademics={() => setActiveTab('academics')}
            onShowToast={showToast}
            isDark={isDark}
          />
        )}

        {activeTab === 'school' && (
          <SchoolView
            schoolInfo={schoolInfo}
            onUpdateSchoolInfo={handleUpdateSchoolInfo}
            onPreviewFile={handleOpenPreview}
            onShowToast={showToast}
            isDark={isDark}
          />
        )}

        {activeTab === 'weekly-log' && (
          <WeeklyLogView
            logs={weeklyLogs}
            onUpdateLogs={handleUpdateWeeklyLogs}
            onPreviewFile={handleOpenPreview}
            onShowToast={showToast}
            isDark={isDark}
          />
        )}

        {activeTab === 'academics' && (
          <AcademicsView
            items={academicItems}
            onUpdateItems={handleUpdateAcademicItems}
            onPreviewFile={handleOpenPreview}
            onShowToast={showToast}
            isDark={isDark}
          />
        )}
      </main>

      {/* Full Website Footer */}
      <WebFooter
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onSaveAll={handleSaveAll}
        isDark={isDark}
      />

      {/* Fixed Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} isDark={isDark} />

      {/* Interactive Modals */}
      <FilePreviewModal
        isOpen={previewFile.isOpen}
        onClose={() => setPreviewFile((prev) => ({ ...prev, isOpen: false }))}
        fileUrl={previewFile.url}
        fileName={previewFile.name}
        fileType={previewFile.type}
        fileSize={previewFile.size}
        isDark={isDark}
      />
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={handleProfileSave}
        isDark={isDark}
      />

      <IdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        profile={profile}
        isDark={isDark}
      />

      <PersonalDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        isDark={isDark}
      />

      <SchoolInfoModal
        isOpen={isSchoolOpen}
        onClose={() => setIsSchoolOpen(false)}
        schoolInfo={schoolInfo}
        onUpdateSchoolInfo={handleUpdateSchoolInfo}
        onGoToSchoolTab={() => setActiveTab('school')}
        isDark={isDark}
      />

      <MentorsModal
        isOpen={isMentorsOpen}
        onClose={() => setIsMentorsOpen(false)}
        mentors={mentors}
        onUpdateMentors={handleUpdateMentors}
        isDark={isDark}
      />

      <AttendanceModal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        records={attendanceRecords}
        onUpdateRecords={handleUpdateAttendance}
        isDark={isDark}
      />

      <PasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSuccess={showToast}
        isDark={isDark}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        isDark={isDark}
      />
    </div>
  );
}

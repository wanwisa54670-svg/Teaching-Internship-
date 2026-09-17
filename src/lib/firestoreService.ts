import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, testConnection } from './firebase';
import {
  TraineeProfile,
  SchoolDetails,
  WeeklyLogItem,
  AcademicItem,
  SchoolPhoto,
  DashboardStats,
  TaskItem,
  AnnouncementItem,
  AttendanceRecord,
} from '../types';
import { MentorsData } from '../components/modals/MentorsModal';

/**
 * Saves or updates student user profile and general school details to Cloud Firestore
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profile: TraineeProfile,
  schoolInfo: SchoolDetails,
  stats?: DashboardStats,
  extra?: {
    tasks?: TaskItem[];
    announcements?: AnnouncementItem[];
    attendanceRecords?: AttendanceRecord[];
    mentors?: MentorsData;
  }
) {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        userId,
        name: profile.name || '',
        email: profile.email || '',
        studentId: profile.studentId || '',
        status: profile.status || '',
        phone: profile.phone || '',
        subjectGroup: profile.subjectGroup || '',
        schoolName: profile.schoolName || '',
        educationLevel: profile.educationLevel || '',
        term: profile.term || '',
        avatarUrl: profile.avatarUrl || '',
        schoolInfo: {
          name: schoolInfo.name || '',
          affiliation: schoolInfo.affiliation || '',
          levels: schoolInfo.levels || '',
          subjectGroup: schoolInfo.subjectGroup || '',
          directorName: schoolInfo.directorName || '',
          mentorName: schoolInfo.mentorName || '',
          mentorPosition: schoolInfo.mentorPosition || '',
          mentorPhone: schoolInfo.mentorPhone || '',
          mentorEmail: schoolInfo.mentorEmail || '',
          mentorPhotoUrl: schoolInfo.mentorPhotoUrl || '',
          phone: schoolInfo.phone || '',
          address: schoolInfo.address || '',
          workHours: schoolInfo.workHours || '',
          dutyDay: schoolInfo.dutyDay || '',
          clubActivity: schoolInfo.clubActivity || '',
          teachingLoad: schoolInfo.teachingLoad || '',
          staffRoom: schoolInfo.staffRoom || '',
        },
        stats: stats || null,
        tasks: extra?.tasks || null,
        announcements: extra?.announcements || null,
        attendanceRecords: extra?.attendanceRecords || null,
        mentors: extra?.mentors || null,
        firebaseProject: 'teaching-internship',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves a weekly log entry to Cloud Firestore
 */
export async function saveWeeklyLogToFirestore(userId: string, log: WeeklyLogItem) {
  const safeId = log.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/weekly_logs/${safeId}`;
  try {
    const logDocRef = doc(db, 'users', userId, 'weekly_logs', safeId);
    await setDoc(
      logDocRef,
      {
        ...log,
        id: safeId,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves all 18 weekly logs to Cloud Firestore in parallel
 */
export async function syncAllWeeklyLogsToFirestore(userId: string, logs: WeeklyLogItem[]) {
  const promises = logs.map((log) => saveWeeklyLogToFirestore(userId, log));
  await Promise.all(promises);
}

/**
 * Deletes a weekly log entry from Cloud Firestore
 */
export async function deleteWeeklyLogFromFirestore(userId: string, logId: string) {
  const safeId = logId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/weekly_logs/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'weekly_logs', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Saves or updates an academic item to Cloud Firestore
 */
export async function saveAcademicItemToFirestore(userId: string, item: AcademicItem) {
  const safeId = item.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/academic_items/${safeId}`;
  try {
    const itemRef = doc(db, 'users', userId, 'academic_items', safeId);
    await setDoc(
      itemRef,
      {
        ...item,
        id: safeId,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves all academic items to Cloud Firestore
 */
export async function syncAllAcademicItemsToFirestore(userId: string, items: AcademicItem[]) {
  const promises = items.map((item) => saveAcademicItemToFirestore(userId, item));
  await Promise.all(promises);
}

/**
 * Deletes an academic item from Cloud Firestore
 */
export async function deleteAcademicItemFromFirestore(userId: string, itemId: string) {
  const safeId = itemId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/academic_items/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'academic_items', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Saves a school photo to Cloud Firestore
 */
export async function saveSchoolPhotoToFirestore(userId: string, photo: SchoolPhoto) {
  const safeId = photo.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/school_photos/${safeId}`;
  try {
    const photoRef = doc(db, 'users', userId, 'school_photos', safeId);
    await setDoc(
      photoRef,
      {
        ...photo,
        id: safeId,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a school photo from Cloud Firestore
 */
export async function deleteSchoolPhotoFromFirestore(userId: string, photoId: string) {
  const safeId = photoId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/school_photos/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'school_photos', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetches all user data from Cloud Firestore
 */
export async function fetchFullUserDataFromFirestore(userId: string) {
  const userPath = `users/${userId}`;
  try {
    await testConnection();
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    let profile: TraineeProfile | null = null;
    let schoolInfo: SchoolDetails | null = null;
    let stats: DashboardStats | null = null;
    let tasks: TaskItem[] | null = null;
    let announcements: AnnouncementItem[] | null = null;
    let attendanceRecords: AttendanceRecord[] | null = null;
    let mentors: MentorsData | null = null;

    if (userSnap.exists()) {
      const data = userSnap.data();
      profile = {
        name: data.name || '',
        studentId: data.studentId || '',
        status: data.status || '',
        phone: data.phone || '',
        email: data.email || '',
        subjectGroup: data.subjectGroup || '',
        schoolName: data.schoolName || '',
        educationLevel: data.educationLevel || '',
        term: data.term || 'ภาคเรียนที่ 1/2569',
        avatarUrl: data.avatarUrl || '',
      };
      if (data.schoolInfo) {
        schoolInfo = {
          ...data.schoolInfo,
          photos: [],
        };
      }
      if (data.stats) {
        stats = data.stats;
      }
      if (data.tasks) {
        tasks = data.tasks;
      }
      if (data.announcements) {
        announcements = data.announcements;
      }
      if (data.attendanceRecords) {
        attendanceRecords = data.attendanceRecords;
      }
      if (data.mentors) {
        mentors = data.mentors;
      }
    }

    // Fetch weekly logs
    const logs: WeeklyLogItem[] = [];
    try {
      const logsSnap = await getDocs(collection(db, 'users', userId, 'weekly_logs'));
      logsSnap.forEach((docItem) => {
        logs.push(docItem.data() as WeeklyLogItem);
      });
      logs.sort((a, b) => a.week - b.week);
    } catch (e) {
      console.warn('Could not fetch weekly_logs subcollection:', e);
    }

    // Fetch academic items
    const academicItems: AcademicItem[] = [];
    try {
      const academicsSnap = await getDocs(collection(db, 'users', userId, 'academic_items'));
      academicsSnap.forEach((docItem) => {
        academicItems.push(docItem.data() as AcademicItem);
      });
    } catch (e) {
      console.warn('Could not fetch academic_items subcollection:', e);
    }

    // Fetch school photos
    const photos: SchoolPhoto[] = [];
    try {
      const photosSnap = await getDocs(collection(db, 'users', userId, 'school_photos'));
      photosSnap.forEach((docItem) => {
        photos.push(docItem.data() as SchoolPhoto);
      });
    } catch (e) {
      console.warn('Could not fetch school_photos subcollection:', e);
    }

    if (schoolInfo) {
      schoolInfo.photos = photos;
    }

    return {
      exists: userSnap.exists(),
      profile,
      schoolInfo,
      stats,
      tasks,
      announcements,
      attendanceRecords,
      mentors,
      weeklyLogs: logs.length > 0 ? logs : null,
      academicItems: academicItems.length > 0 ? academicItems : null,
      photos: photos.length > 0 ? photos : null,
    };
  } catch (error) {
    console.error('fetchFullUserDataFromFirestore error:', error);
    try {
      handleFirestoreError(error, OperationType.GET, userPath);
    } catch {
      // prevent crash
    }
    return null;
  }
}

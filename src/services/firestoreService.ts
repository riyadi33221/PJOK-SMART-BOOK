import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  AppSettings,
  Student,
  Teacher,
  ClassRoom,
  Semester,
  MaterialItem,
  QuizItem,
  CompetencyTestItem,
  AttendanceRecord,
  GradeRecord,
  BadgeItem,
  AnnouncementItem,
  ReflectionItem,
  AttitudeAssessment,
  StudentListItem,
  DigitalBookItem,
  StudentBookProgress,
  MaterialVideo,
  QuizAttempt,
  CompetencySubmission,
  AssignmentItem,
  AssignmentSubmission,
} from '../types';
import {
  initialSettings,
  classList,
  dummyMaterials,
  dummyQuizzes,
  dummyCompetencyTests,
  dummyAttendance,
  dummyGrades,
  dummyBadges,
  dummyAnnouncements,
  dummyStudentsTable,
} from '../data/dummyData';
import { initialDigitalBooks } from '../data/digitalBooksData';
import {
  initialQuizzes,
  initialCompetencyTests,
  initialAssignments,
  initialSubmissions,
} from '../data/phase4InitialData';

// Initial Semesters
export const defaultSemesters: Semester[] = [
  { id: 'sem-1', name: 'Semester 1', academicYear: '2024/2025', isActive: true },
  { id: 'sem-2', name: 'Semester 2', academicYear: '2024/2025', isActive: false },
];

export const defaultTeachers: Teacher[] = [
  {
    id: 't-01',
    teacherId: 't-01',
    nip: '19780512 200501 1 008',
    name: 'Purwanto, S.Pd.',
    email: 'purwanto.pjok@smpn2kutasari.sch.id',
    phone: '081234567890',
    assignedClasses: 'Kelas VII & VIII',
    status: 'active',
    roleTitle: 'Guru PJOK & Creator Platform',
  },
  {
    id: 't-02',
    teacherId: 't-02',
    nip: '19820315 200801 1 012',
    name: 'Bambang Triyono, S.Pd.',
    email: 'bambang.pjok@smpn2kutasari.sch.id',
    phone: '081234567891',
    assignedClasses: 'Kelas VIII',
    status: 'active',
    roleTitle: 'Guru PJOK',
  },
  {
    id: 't-03',
    teacherId: 't-03',
    nip: '19850920 201001 2 018',
    name: 'Siti Maryam, S.Pd.',
    email: 'siti.maryam@smpn2kutasari.sch.id',
    phone: '081234567892',
    assignedClasses: 'Kelas IX',
    status: 'active',
    roleTitle: 'Guru PJOK',
  },
  {
    id: 't-04',
    teacherId: 't-04',
    nip: '19910408 201502 1 004',
    name: 'Hendra Gunawan, S.Pd.',
    email: 'hendra.gunawan@smpn2kutasari.sch.id',
    phone: '081234567893',
    assignedClasses: 'Kelas IX & Ekstrakurikuler',
    status: 'active',
    roleTitle: 'Guru PJOK',
  },
];

// Helper to convert dummyStudentsTable to Student objects
export const defaultStudents: Student[] = dummyStudentsTable.map((s, idx) => ({
  id: s.id || `std-${idx + 1}`,
  studentId: s.id || `std-${idx + 1}`,
  nisn: s.nisn,
  nis: `2425${(idx + 1).toString().padStart(4, '0')}`,
  name: s.name,
  gender: s.gender,
  classId: s.kelas,
  academicYear: '2024/2025',
  email: `${s.name.toLowerCase().replace(/\s+/g, '.')}.vii@smpn2kutasari.sch.id`,
  status: 'active',
  xp: 450 - idx * 20,
  attendanceRate: s.attendanceRate,
  avgScore: s.avgScore,
  attitude: s.attitude,
  lastActive: s.lastActive,
}));

// ==========================================
// 1. SEED INITIAL DATA IF EMPTY
// ==========================================
export async function seedInitialDataIfEmpty(): Promise<boolean> {
  const path = 'settings';
  try {
    const settingRef = doc(db, 'settings', 'app_config');
    const settingSnap = await getDoc(settingRef);

    if (settingSnap.exists()) {
      return false; // Already seeded
    }

    // Seed App Settings
    await setDoc(settingRef, {
      ...initialSettings,
      id: 'app_config',
      updatedAt: new Date().toISOString(),
    });

    // Seed Classes
    for (const c of classList) {
      await setDoc(doc(db, 'classes', c.id), {
        ...c,
        academicYear: '2024/2025',
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Semesters
    for (const sem of defaultSemesters) {
      await setDoc(doc(db, 'semesters', sem.id), {
        ...sem,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Teachers
    for (const tea of defaultTeachers) {
      await setDoc(doc(db, 'teachers', tea.id), {
        ...tea,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Students
    for (const stu of defaultStudents) {
      await setDoc(doc(db, 'students', stu.id), {
        ...stu,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Materials
    for (const mat of dummyMaterials) {
      await setDoc(doc(db, 'materials', mat.id), {
        ...mat,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Quizzes
    for (const qz of dummyQuizzes) {
      await setDoc(doc(db, 'quizzes', qz.id), {
        ...qz,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Competency Tests
    for (const ct of dummyCompetencyTests) {
      await setDoc(doc(db, 'competency_tests', ct.id), {
        ...ct,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Badges
    for (const bg of dummyBadges) {
      await setDoc(doc(db, 'badges', bg.id), {
        ...bg,
        createdAt: new Date().toISOString(),
      });
    }

    // Seed Announcements
    for (const ann of dummyAnnouncements) {
      await setDoc(doc(db, 'announcements', ann.id), {
        ...ann,
        createdAt: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    // If not permitted due to rules during unauthenticated initial check, silently return false
    console.warn('Initial seed check:', error);
    return false;
  }
}

// ==========================================
// 2. APP SETTINGS SERVICE
// ==========================================
export async function getAppSettings(): Promise<AppSettings> {
  const path = 'settings';
  try {
    const docRef = doc(db, 'settings', 'app_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AppSettings;
    }
    return initialSettings;
  } catch (error) {
    console.warn('Firestore getAppSettings fallback to default:', error);
    const saved = localStorage.getItem('pjok_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  }
}

export async function saveAppSettings(newSettings: Partial<AppSettings>): Promise<void> {
  const path = 'settings';
  try {
    const docRef = doc(db, 'settings', 'app_config');
    await setDoc(
      docRef,
      {
        ...newSettings,
        id: 'app_config',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/app_config`);
  }
}

// ==========================================
// 3. STUDENTS SERVICE
// ==========================================
export async function getStudents(): Promise<Student[]> {
  const path = 'students';
  try {
    const q = query(collection(db, path));
    const snap = await getDocs(q);
    if (snap.empty) {
      return defaultStudents;
    }
    return snap.docs.map((d) => d.data() as Student);
  } catch (error) {
    console.warn('Firestore getStudents fallback:', error);
    return defaultStudents;
  }
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<Student> {
  const path = 'students';
  const newId = `std-${Date.now()}`;
  const newStudent: Student = {
    ...student,
    id: newId,
    studentId: newId,
  };
  try {
    await setDoc(doc(db, path, newId), {
      ...newStudent,
      createdAt: new Date().toISOString(),
    });
    return newStudent;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newId}`);
  }
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<void> {
  const path = 'students';
  try {
    await updateDoc(doc(db, path, id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

export async function deactivateStudent(id: string): Promise<void> {
  const path = 'students';
  try {
    await updateDoc(doc(db, path, id), {
      status: 'inactive',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

export async function importStudentsBatch(studentsList: Omit<Student, 'id'>[]): Promise<number> {
  const path = 'students';
  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const item of studentsList) {
      const newId = `std-${Date.now()}-${count}`;
      const docRef = doc(db, path, newId);
      batch.set(docRef, {
        ...item,
        id: newId,
        studentId: newId,
        status: item.status || 'active',
        createdAt: new Date().toISOString(),
      });
      count++;
    }
    await batch.commit();
    return count;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==========================================
// 4. TEACHERS SERVICE
// ==========================================
export async function getTeachers(): Promise<Teacher[]> {
  const path = 'teachers';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return defaultTeachers;
    }
    return snap.docs.map((d) => d.data() as Teacher);
  } catch (error) {
    console.warn('Firestore getTeachers fallback:', error);
    return defaultTeachers;
  }
}

export async function addTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
  const path = 'teachers';
  const newId = `tea-${Date.now()}`;
  const newTeacher: Teacher = {
    ...teacher,
    id: newId,
    teacherId: newId,
  };
  try {
    await setDoc(doc(db, path, newId), {
      ...newTeacher,
      createdAt: new Date().toISOString(),
    });
    return newTeacher;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newId}`);
  }
}

export async function updateTeacher(id: string, updates: Partial<Teacher>): Promise<void> {
  const path = 'teachers';
  try {
    await updateDoc(doc(db, path, id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

// ==========================================
// 5. CLASSES & SEMESTERS SERVICE
// ==========================================
export async function getClasses(): Promise<ClassRoom[]> {
  const path = 'classes';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return classList;
    }
    return snap.docs.map((d) => d.data() as ClassRoom);
  } catch (error) {
    console.warn('Firestore getClasses fallback:', error);
    return classList;
  }
}

export async function addClass(cls: ClassRoom): Promise<void> {
  const path = 'classes';
  try {
    await setDoc(doc(db, path, cls.id), {
      ...cls,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${cls.id}`);
  }
}

export async function updateClass(id: string, updates: Partial<ClassRoom>): Promise<void> {
  const path = 'classes';
  try {
    await updateDoc(doc(db, path, id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

export async function getSemesters(): Promise<Semester[]> {
  const path = 'semesters';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return defaultSemesters;
    }
    return snap.docs.map((d) => d.data() as Semester);
  } catch (error) {
    console.warn('Firestore getSemesters fallback:', error);
    return defaultSemesters;
  }
}

export async function updateSemester(id: string, updates: Partial<Semester>): Promise<void> {
  const path = 'semesters';
  try {
    await updateDoc(doc(db, path, id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
  }
}

// ==========================================
// 6. MATERIALS & QUIZZES SERVICE
// ==========================================
export async function getMaterials(): Promise<MaterialItem[]> {
  const path = 'materials';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return dummyMaterials;
    }
    return snap.docs.map((d) => d.data() as MaterialItem);
  } catch (error) {
    console.warn('Firestore getMaterials fallback:', error);
    return dummyMaterials;
  }
}

export async function addMaterial(material: MaterialItem): Promise<void> {
  const path = 'materials';
  try {
    await setDoc(doc(db, path, material.id), {
      ...material,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${material.id}`);
  }
}

// ==========================================
// 7. ATTENDANCE & GRADES SERVICE
// ==========================================
export async function getAttendanceList(studentId?: string): Promise<AttendanceRecord[]> {
  const path = 'attendance';
  try {
    let q = query(collection(db, path));
    if (studentId) {
      q = query(collection(db, path), where('studentId', '==', studentId));
    }
    const snap = await getDocs(q);
    if (snap.empty) {
      return dummyAttendance;
    }
    return snap.docs.map((d) => d.data() as AttendanceRecord);
  } catch (error) {
    console.warn('Firestore getAttendanceList fallback:', error);
    return dummyAttendance;
  }
}

export async function addAttendanceRecord(record: AttendanceRecord): Promise<void> {
  const path = 'attendance';
  const newId = record.id || `att-${Date.now()}`;
  try {
    await setDoc(doc(db, path, newId), {
      ...record,
      id: newId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newId}`);
  }
}

export async function getGradesList(studentId?: string): Promise<GradeRecord[]> {
  const path = 'grades';
  try {
    let q = query(collection(db, path));
    if (studentId) {
      q = query(collection(db, path), where('studentId', '==', studentId));
    }
    const snap = await getDocs(q);
    if (snap.empty) {
      return dummyGrades;
    }
    return snap.docs.map((d) => d.data() as GradeRecord);
  } catch (error) {
    console.warn('Firestore getGradesList fallback:', error);
    return dummyGrades;
  }
}

export async function addGradeRecord(grade: GradeRecord): Promise<void> {
  const path = 'grades';
  const newId = grade.id || `grd-${Date.now()}`;
  try {
    await setDoc(doc(db, path, newId), {
      ...grade,
      id: newId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newId}`);
  }
}

export async function addAttitudeAssessment(assessment: AttitudeAssessment): Promise<void> {
  const path = 'attitude_assessments';
  const newId = assessment.id || `attd-${Date.now()}`;
  try {
    await setDoc(doc(db, path, newId), {
      ...assessment,
      id: newId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newId}`);
  }
}

// ==========================================
// 8. REFLECTIONS & ANNOUNCEMENTS
// ==========================================
export async function addReflection(reflection: Omit<ReflectionItem, 'id'>): Promise<void> {
  const path = 'reflections';
  const newId = `refl-${Date.now()}`;
  try {
    await setDoc(doc(db, path, newId), {
      ...reflection,
      id: newId,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newId}`);
  }
}

export async function addAnnouncement(announcement: AnnouncementItem): Promise<void> {
  const path = 'announcements';
  try {
    await setDoc(doc(db, path, announcement.id), {
      ...announcement,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${announcement.id}`);
  }
}

// ==========================================
// 9. DIGITAL BOOKS & AI MATERIAL TRANSFORMER
// ==========================================

function getLocalDigitalBooks(): DigitalBookItem[] {
  try {
    const raw = localStorage.getItem('pjok_digital_books');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalDigitalBooks(books: DigitalBookItem[]): void {
  try {
    localStorage.setItem('pjok_digital_books', JSON.stringify(books));
  } catch (e) {
    console.warn('Failed to write local digital books:', e);
  }
}

export async function getDigitalBooks(options?: {
  grade?: string;
  semester?: string;
  onlyPublished?: boolean;
}): Promise<DigitalBookItem[]> {
  const path = 'digital_books';
  let mergedBooks: DigitalBookItem[] = [];

  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      mergedBooks = snap.docs.map((d) => d.data() as DigitalBookItem);
    } else {
      // Seed default initial digital books
      mergedBooks = [...initialDigitalBooks];
      try {
        const batch = writeBatch(db);
        initialDigitalBooks.forEach((book) => {
          const ref = doc(db, path, book.id);
          batch.set(ref, book);
        });
        await batch.commit();
      } catch (seedErr) {
        console.warn('Initial digital books seed failed, serving memory copy:', seedErr);
      }
    }
  } catch (error) {
    console.warn('Firestore getDigitalBooks fallback to memory & local:', error);
    mergedBooks = [...initialDigitalBooks];
  }

  // Merge with locally stored or edited books
  const localBooks = getLocalDigitalBooks();
  localBooks.forEach((local) => {
    const idx = mergedBooks.findIndex((b) => b.id === local.id);
    if (idx >= 0) {
      mergedBooks[idx] = local;
    } else {
      mergedBooks.unshift(local);
    }
  });

  return filterBooks(mergedBooks, options);
}

function filterBooks(
  books: DigitalBookItem[],
  options?: { grade?: string; semester?: string; onlyPublished?: boolean }
): DigitalBookItem[] {
  let result = [...books];
  if (options?.grade && options.grade !== 'Semua') {
    result = result.filter((b) => b.targetGrade === options.grade);
  }
  if (options?.semester && options.semester !== 'Semua') {
    result = result.filter((b) => b.semester === options.semester);
  }
  if (options?.onlyPublished) {
    result = result.filter((b) => b.status === 'PUBLISHED');
  }
  return result.sort((a, b) => a.chapter - b.chapter);
}

export async function getDigitalBookById(id: string): Promise<DigitalBookItem | null> {
  const path = 'digital_books';
  try {
    const snap = await getDoc(doc(db, path, id));
    if (snap.exists()) {
      return snap.data() as DigitalBookItem;
    }
  } catch (error) {
    console.warn('Firestore getDigitalBookById fallback:', error);
  }
  const local = getLocalDigitalBooks().find((b) => b.id === id);
  if (local) return local;

  const found = initialDigitalBooks.find((b) => b.id === id);
  return found || null;
}

export async function saveDigitalBook(book: DigitalBookItem): Promise<DigitalBookItem> {
  const path = 'digital_books';
  const bookToSave: DigitalBookItem = {
    ...book,
    id: book.id || `book-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };

  // 1. Immediately persist to localStorage
  const localList = getLocalDigitalBooks();
  const existingIdx = localList.findIndex((b) => b.id === bookToSave.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = bookToSave;
  } else {
    localList.unshift(bookToSave);
  }
  saveLocalDigitalBooks(localList);

  // 2. Persist to Firestore
  try {
    await setDoc(doc(db, path, bookToSave.id), bookToSave);
  } catch (error) {
    console.warn('Firestore setDoc digital_books warning, relying on local backup:', error);
  }

  return bookToSave;
}

export async function updateDigitalBook(
  id: string,
  updates: Partial<DigitalBookItem>
): Promise<void> {
  const path = 'digital_books';
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Local update
  const localList = getLocalDigitalBooks();
  const idx = localList.findIndex((b) => b.id === id);
  if (idx >= 0) {
    localList[idx] = { ...localList[idx], ...updatedData };
    saveLocalDigitalBooks(localList);
  }

  try {
    await updateDoc(doc(db, path, id), updatedData);
  } catch (error) {
    console.warn('Firestore updateDoc digital_books warning:', error);
  }
}

export async function publishDigitalBook(id: string): Promise<void> {
  const path = 'digital_books';
  const patch = {
    status: 'PUBLISHED' as const,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Local update
  const localList = getLocalDigitalBooks();
  const idx = localList.findIndex((b) => b.id === id);
  if (idx >= 0) {
    localList[idx] = { ...localList[idx], ...patch };
    saveLocalDigitalBooks(localList);
  }

  try {
    await updateDoc(doc(db, path, id), patch);
  } catch (error) {
    console.warn('Firestore publishDigitalBook warning:', error);
  }
}

export async function unpublishDigitalBook(id: string): Promise<void> {
  const path = 'digital_books';
  const patch = {
    status: 'DRAFT' as const,
    updatedAt: new Date().toISOString(),
  };

  // Local update
  const localList = getLocalDigitalBooks();
  const idx = localList.findIndex((b) => b.id === id);
  if (idx >= 0) {
    localList[idx] = { ...localList[idx], ...patch };
    saveLocalDigitalBooks(localList);
  }

  try {
    await updateDoc(doc(db, path, id), patch);
  } catch (error) {
    console.warn('Firestore unpublishDigitalBook warning:', error);
  }
}

export async function deleteDigitalBook(id: string): Promise<void> {
  const path = 'digital_books';

  // Local remove
  const localList = getLocalDigitalBooks().filter((b) => b.id !== id);
  saveLocalDigitalBooks(localList);

  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn('Firestore deleteDigitalBook warning:', error);
  }
}

// ==========================================
// 10. STUDENT BOOK PROGRESS & TRACKING
// ==========================================

export async function getStudentBookProgressList(
  studentId: string
): Promise<Record<string, StudentBookProgress>> {
  const path = 'book_progress';
  const progressMap: Record<string, StudentBookProgress> = {};

  try {
    const q = query(collection(db, path), where('studentId', '==', studentId));
    const snap = await getDocs(q);
    snap.docs.forEach((d) => {
      const data = d.data() as StudentBookProgress;
      progressMap[data.bookId] = data;
    });
    return progressMap;
  } catch (error) {
    console.warn('Firestore getStudentBookProgressList fallback to local:', error);
    const local = localStorage.getItem(`pjok_progress_${studentId}`);
    return local ? JSON.parse(local) : {};
  }
}

export async function saveStudentBookProgress(
  progress: StudentBookProgress
): Promise<void> {
  const path = 'book_progress';
  const progressId = progress.id || `${progress.studentId}_${progress.bookId}`;
  const dataToSave = {
    ...progress,
    id: progressId,
  };

  // Keep local backup
  try {
    const local = localStorage.getItem(`pjok_progress_${progress.studentId}`);
    const map = local ? JSON.parse(local) : {};
    map[progress.bookId] = dataToSave;
    localStorage.setItem(`pjok_progress_${progress.studentId}`, JSON.stringify(map));
  } catch (e) {
    console.warn('Local progress save error:', e);
  }

  try {
    await setDoc(doc(db, path, progressId), dataToSave, { merge: true });
  } catch (error) {
    console.warn('Firestore saveStudentBookProgress warn:', error);
  }
}

export async function toggleBookBookmark(
  studentId: string,
  bookId: string,
  currentStatus: boolean
): Promise<boolean> {
  const newStatus = !currentStatus;
  const progressId = `${studentId}_${bookId}`;
  const data: StudentBookProgress = {
    id: progressId,
    studentId,
    bookId,
    status: newStatus ? 'Sedang Dipelajari' : 'Belum Dipelajari',
    isBookmarked: newStatus,
    lastOpenedAt: new Date().toISOString(),
  };

  await saveStudentBookProgress(data);
  return newStatus;
}

export async function markBookAsCompleted(
  studentId: string,
  bookId: string
): Promise<void> {
  const progressId = `${studentId}_${bookId}`;
  const data: StudentBookProgress = {
    id: progressId,
    studentId,
    bookId,
    status: 'Selesai',
    isBookmarked: false,
    completedAt: new Date().toISOString(),
    lastOpenedAt: new Date().toISOString(),
  };

  await saveStudentBookProgress(data);
}

export async function markBookAsStarted(
  studentId: string,
  bookId: string
): Promise<void> {
  const progressId = `${studentId}_${bookId}`;
  const data: StudentBookProgress = {
    id: progressId,
    studentId,
    bookId,
    status: 'Sedang Dipelajari',
    isBookmarked: false,
    lastOpenedAt: new Date().toISOString(),
  };

  await saveStudentBookProgress(data);
}

// ==========================================
// 11. QUIZZES & HASIL KUIS SERVICE (Phase 4)
// ==========================================

const LOCAL_QUIZZES_KEY = 'pjok_quizzes_cache';
const LOCAL_QUIZ_ATTEMPTS_KEY = 'pjok_quiz_attempts_cache';

export function getLocalQuizzes(): QuizItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_QUIZZES_KEY);
    return saved ? JSON.parse(saved) : initialQuizzes;
  } catch (e) {
    return initialQuizzes;
  }
}

export function saveLocalQuizzes(quizzes: QuizItem[]): void {
  try {
    localStorage.setItem(LOCAL_QUIZZES_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.warn('Failed to save quizzes to localStorage:', e);
  }
}

export async function getQuizzes(): Promise<QuizItem[]> {
  const path = 'quizzes';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as QuizItem);
      saveLocalQuizzes(items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore getQuizzes fallback to local:', err);
  }
  return getLocalQuizzes();
}

export async function saveQuiz(quiz: QuizItem): Promise<void> {
  const path = 'quizzes';
  const id = quiz.id || `quiz-${Date.now()}`;
  const dataToSave: QuizItem = {
    ...quiz,
    id,
    questionsCount: quiz.questions?.length || quiz.questionsCount || 0,
    updatedAt: new Date().toISOString(),
    createdAt: quiz.createdAt || new Date().toISOString(),
  };

  // Update local cache
  const localList = getLocalQuizzes();
  const existingIdx = localList.findIndex((q) => q.id === id);
  if (existingIdx >= 0) {
    localList[existingIdx] = dataToSave;
  } else {
    localList.unshift(dataToSave);
  }
  saveLocalQuizzes(localList);

  try {
    await setDoc(doc(db, path, id), dataToSave, { merge: true });
  } catch (error) {
    console.warn('Firestore saveQuiz error:', error);
  }
}

export async function deleteQuiz(id: string): Promise<void> {
  const path = 'quizzes';
  const localList = getLocalQuizzes().filter((q) => q.id !== id);
  saveLocalQuizzes(localList);

  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn('Firestore deleteQuiz error:', error);
  }
}

export async function getQuizAttempts(studentId?: string): Promise<QuizAttempt[]> {
  const path = 'quiz_results';
  try {
    let q = query(collection(db, path));
    if (studentId) {
      q = query(collection(db, path), where('studentId', '==', studentId));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as QuizAttempt);
    }
  } catch (err) {
    console.warn('Firestore getQuizAttempts fallback to local:', err);
  }

  try {
    const saved = localStorage.getItem(LOCAL_QUIZ_ATTEMPTS_KEY);
    const list: QuizAttempt[] = saved ? JSON.parse(saved) : [];
    return studentId ? list.filter((a) => a.studentId === studentId) : list;
  } catch {
    return [];
  }
}

export async function submitQuizAttempt(attempt: QuizAttempt): Promise<void> {
  const path = 'quiz_results';
  const id = attempt.id || `att-${Date.now()}-${attempt.studentId}`;
  const dataToSave: QuizAttempt = {
    ...attempt,
    id,
  };

  // Local storage cache
  try {
    const saved = localStorage.getItem(LOCAL_QUIZ_ATTEMPTS_KEY);
    const list: QuizAttempt[] = saved ? JSON.parse(saved) : [];
    list.unshift(dataToSave);
    localStorage.setItem(LOCAL_QUIZ_ATTEMPTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Local quiz attempt error:', e);
  }

  try {
    await setDoc(doc(db, path, id), dataToSave);
  } catch (error) {
    console.warn('Firestore submitQuizAttempt error:', error);
  }
}

// ==========================================
// 12. UJI KOMPETENSI TAUTAN SERVICE (Phase 4)
// ==========================================

const LOCAL_CBT_KEY = 'pjok_cbt_cache';
const LOCAL_CBT_SUBMISSIONS_KEY = 'pjok_cbt_submissions_cache';

export function getLocalCompetencyTests(): CompetencyTestItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_CBT_KEY);
    return saved ? JSON.parse(saved) : initialCompetencyTests;
  } catch {
    return initialCompetencyTests;
  }
}

export function saveLocalCompetencyTests(tests: CompetencyTestItem[]): void {
  try {
    localStorage.setItem(LOCAL_CBT_KEY, JSON.stringify(tests));
  } catch (e) {
    console.warn('Failed to save CBT tests to local:', e);
  }
}

export async function getCompetencyTests(): Promise<CompetencyTestItem[]> {
  const path = 'competency_tests';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as CompetencyTestItem);
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      saveLocalCompetencyTests(items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore getCompetencyTests fallback to local:', err);
  }
  const local = getLocalCompetencyTests();
  local.sort((a, b) => (a.order || 0) - (b.order || 0));
  return local;
}

export async function saveCompetencyTest(test: CompetencyTestItem): Promise<void> {
  const path = 'competency_tests';
  const id = test.id || `cbt-${Date.now()}`;
  const dataToSave: CompetencyTestItem = {
    ...test,
    id,
    title: test.name || test.title,
    cbtLink: test.url || test.cbtLink,
    topic: test.material || test.topic,
    updatedAt: new Date().toISOString(),
    createdAt: test.createdAt || new Date().toISOString(),
  };

  const localList = getLocalCompetencyTests();
  const existingIdx = localList.findIndex((t) => t.id === id);
  if (existingIdx >= 0) {
    localList[existingIdx] = dataToSave;
  } else {
    localList.push(dataToSave);
  }
  saveLocalCompetencyTests(localList);

  try {
    await setDoc(doc(db, path, id), dataToSave, { merge: true });
  } catch (error) {
    console.warn('Firestore saveCompetencyTest error:', error);
  }
}

export async function deleteCompetencyTest(id: string): Promise<void> {
  const path = 'competency_tests';
  const localList = getLocalCompetencyTests().filter((t) => t.id !== id);
  saveLocalCompetencyTests(localList);

  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn('Firestore deleteCompetencyTest error:', error);
  }
}

export async function reorderCompetencyTests(items: CompetencyTestItem[]): Promise<void> {
  const updated = items.map((item, idx) => ({ ...item, order: idx + 1 }));
  saveLocalCompetencyTests(updated);

  try {
    const batch = writeBatch(db);
    updated.forEach((item) => {
      const ref = doc(db, 'competency_tests', item.id);
      batch.set(ref, item, { merge: true });
    });
    await batch.commit();
  } catch (e) {
    console.warn('Firestore reorder batch failed:', e);
  }
}

export async function getCompetencySubmissions(studentId?: string): Promise<CompetencySubmission[]> {
  const path = 'competency_submissions';
  try {
    let q = query(collection(db, path));
    if (studentId) {
      q = query(collection(db, path), where('studentId', '==', studentId));
    }
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as CompetencySubmission);
    }
  } catch (err) {
    console.warn('Firestore getCompetencySubmissions fallback:', err);
  }

  try {
    const saved = localStorage.getItem(LOCAL_CBT_SUBMISSIONS_KEY);
    const list: CompetencySubmission[] = saved ? JSON.parse(saved) : [];
    return studentId ? list.filter((s) => s.studentId === studentId) : list;
  } catch {
    return [];
  }
}

export async function submitCompetencyConfirmation(submission: CompetencySubmission): Promise<void> {
  const path = 'competency_submissions';
  const id = submission.id || `cbt-sub-${submission.testId}_${submission.studentId}`;
  const dataToSave: CompetencySubmission = {
    ...submission,
    id,
    completedAt: submission.completedAt || new Date().toISOString(),
    status: 'Sudah Dikerjakan',
  };

  try {
    const saved = localStorage.getItem(LOCAL_CBT_SUBMISSIONS_KEY);
    const list: CompetencySubmission[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((s) => s.testId === submission.testId && s.studentId === submission.studentId);
    if (idx >= 0) {
      list[idx] = dataToSave;
    } else {
      list.push(dataToSave);
    }
    localStorage.setItem(LOCAL_CBT_SUBMISSIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Local competency submission error:', e);
  }

  try {
    await setDoc(doc(db, path, id), dataToSave, { merge: true });
  } catch (error) {
    console.warn('Firestore submitCompetencyConfirmation error:', error);
  }
}

export const confirmCompetencySubmission = submitCompetencyConfirmation;

// ==========================================
// 13. TUGAS & PENILAIAN SERVICE (Phase 4)
// ==========================================

const LOCAL_ASSIGNMENTS_KEY = 'pjok_assignments_cache';
const LOCAL_SUBMISSIONS_KEY = 'pjok_submissions_cache';

export function getLocalAssignments(): AssignmentItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
    return saved ? JSON.parse(saved) : initialAssignments;
  } catch {
    return initialAssignments;
  }
}

export function saveLocalAssignments(assignments: AssignmentItem[]): void {
  try {
    localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (e) {
    console.warn('Failed to save assignments to local:', e);
  }
}

export async function getAssignments(): Promise<AssignmentItem[]> {
  const path = 'assignments';
  try {
    const snap = await getDocs(collection(db, path));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as AssignmentItem);
      saveLocalAssignments(items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore getAssignments fallback to local:', err);
  }
  return getLocalAssignments();
}

export async function saveAssignment(assignment: AssignmentItem): Promise<void> {
  const path = 'assignments';
  const id = assignment.id || `asg-${Date.now()}`;
  const dataToSave: AssignmentItem = {
    ...assignment,
    id,
    updatedAt: new Date().toISOString(),
    createdAt: assignment.createdAt || new Date().toISOString(),
  };

  const localList = getLocalAssignments();
  const existingIdx = localList.findIndex((a) => a.id === id);
  if (existingIdx >= 0) {
    localList[existingIdx] = dataToSave;
  } else {
    localList.unshift(dataToSave);
  }
  saveLocalAssignments(localList);

  try {
    await setDoc(doc(db, path, id), dataToSave, { merge: true });
  } catch (error) {
    console.warn('Firestore saveAssignment error:', error);
  }
}

export async function deleteAssignment(id: string): Promise<void> {
  const path = 'assignments';
  const localList = getLocalAssignments().filter((a) => a.id !== id);
  saveLocalAssignments(localList);

  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn('Firestore deleteAssignment error:', error);
  }
}

export async function getAssignmentSubmissions(assignmentId?: string, studentId?: string): Promise<AssignmentSubmission[]> {
  const path = 'assignment_submissions';
  try {
    let q = query(collection(db, path));
    if (assignmentId && studentId) {
      q = query(collection(db, path), where('assignmentId', '==', assignmentId), where('studentId', '==', studentId));
    } else if (assignmentId) {
      q = query(collection(db, path), where('assignmentId', '==', assignmentId));
    } else if (studentId) {
      q = query(collection(db, path), where('studentId', '==', studentId));
    }

    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as AssignmentSubmission);
    }
  } catch (err) {
    console.warn('Firestore getAssignmentSubmissions fallback:', err);
  }

  try {
    const saved = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    let list: AssignmentSubmission[] = saved ? JSON.parse(saved) : initialSubmissions;
    if (assignmentId) list = list.filter((s) => s.assignmentId === assignmentId);
    if (studentId) list = list.filter((s) => s.studentId === studentId);
    return list;
  } catch {
    return [];
  }
}

export async function submitAssignment(submission: AssignmentSubmission): Promise<void> {
  const path = 'assignment_submissions';
  const id = submission.id || `sub-${submission.assignmentId}_${submission.studentId}`;
  const dataToSave: AssignmentSubmission = {
    ...submission,
    id,
    submittedAt: submission.submittedAt || new Date().toISOString(),
    status: submission.status || 'Sudah dikumpulkan',
  };

  try {
    const saved = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    const list: AssignmentSubmission[] = saved ? JSON.parse(saved) : initialSubmissions;
    const existingIdx = list.findIndex((s) => s.id === id || (s.assignmentId === submission.assignmentId && s.studentId === submission.studentId));
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...dataToSave };
    } else {
      list.unshift(dataToSave);
    }
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Local save assignment submission error:', e);
  }

  try {
    await setDoc(doc(db, path, id), dataToSave, { merge: true });
  } catch (error) {
    console.warn('Firestore submitAssignment error:', error);
  }
}

export async function gradeAssignmentSubmission(
  submissionId: string,
  grade: number,
  feedback: string,
  teacherName: string = 'Purwanto, S.Pd.'
): Promise<void> {
  const path = 'assignment_submissions';
  const updates = {
    grade,
    feedback,
    gradedBy: teacherName,
    gradedAt: new Date().toISOString(),
    status: 'Dinilai' as const,
  };

  try {
    const saved = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    const list: AssignmentSubmission[] = saved ? JSON.parse(saved) : initialSubmissions;
    const idx = list.findIndex((s) => s.id === submissionId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Local grade update error:', e);
  }

  try {
    await updateDoc(doc(db, path, submissionId), updates);
  } catch (error) {
    console.warn('Firestore gradeAssignmentSubmission error:', error);
  }
}


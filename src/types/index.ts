export type UserRole = 'SISWA' | 'GURU' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  nisn?: string;
  nip?: string;
  kelas?: string;
  class?: string;
  semester?: number;
  xp?: number;
  level?: string;
  status?: 'active' | 'inactive';
}

export interface Student {
  id: string;
  studentId: string;
  nisn: string;
  nis?: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  kelas?: string;
  academicYear: string;
  email?: string;
  status: 'active' | 'inactive';
  xp?: number;
  avatar?: string;
  attendanceRate?: number;
  avgScore?: number;
  attitude?: string;
  lastActive?: string;
}

export interface Teacher {
  id: string;
  teacherId: string;
  nip: string;
  name: string;
  email: string;
  phone?: string;
  assignedClasses: string;
  status: 'active' | 'inactive';
  roleTitle?: string;
}

export interface AppSettings {
  schoolName: string;
  appName: string;
  creatorName: string;
  academicYear: string;
  activeSemester: 'Semester 1' | 'Semester 2';
  tagline: string;
  updatedAt?: string;
}

export interface ClassRoom {
  id: string;
  grade: 'VII' | 'VIII' | 'IX';
  name: string; // e.g. "VII-A"
  totalStudents: number;
  homeroomTeacher: string;
  academicYear?: string;
}

export interface Semester {
  id: string;
  name: 'Semester 1' | 'Semester 2';
  academicYear: string;
  isActive: boolean;
}

export interface StudentStats {
  completedMaterials: number;
  totalMaterials: number;
  completedQuizzes: number;
  totalQuizzes: number;
  xp: number;
  averageScore: number;
  attendancePercent: number;
  attitudeRating: 'Sangat Baik' | 'Baik' | 'Cukup';
  progressSemester: number; // e.g. 75%
}

export interface TeacherStats {
  totalStudents: number;
  activeStudentsToday: number;
  totalMaterials: number;
  totalQuizzes: number;
  totalCompetencyTests: number;
  averageScore: number;
  attendancePercent: number;
}

export interface MaterialItem {
  id: string;
  title: string;
  category: 'Permainan Bola Besar' | 'Permainan Bola Kecil' | 'Atletik' | 'Kebugaran Jasmani' | 'Senam Lantai' | 'Kesehatan';
  targetGrade: 'VII' | 'VIII' | 'IX';
  chapter: number;
  durationMin: number;
  readPages: number;
  status: 'Selesai' | 'Sedang Belajar' | 'Belum Mulai';
  summary: string;
  pdfUrl?: string;
  videoUrl?: string;
  teacherId?: string;
  createdAt?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  durationMin: number;
  targetGrade: 'VII' | 'VIII' | 'IX';
  chapter: number;
  description: string;
  teacherId?: string;
  createdAt?: string;
}

export type QuizQuestionType = 'pilihan_ganda' | 'benar_salah' | 'pilihan_gambar';

export interface QuizQuestionOption {
  text: string;
  imageUrl?: string;
  label?: string; // 'A' | 'B' | 'C' | 'D'
}

export type QuizOptionItem = QuizQuestionOption;

export interface QuizQuestionItem {
  id: string;
  type: QuizQuestionType;
  questionText: string;
  imageUrl?: string;
  options: (string | QuizQuestionOption)[];
  correctAnswerIndex: number;
  explanation: string;
  points: number;
}

export interface QuizItem {
  id: string;
  title: string;
  topic: string;
  materialId?: string;
  targetGrade: 'VII' | 'VIII' | 'IX' | 'Semua';
  semester: 'Semester 1' | 'Semester 2';
  questionsCount: number;
  durationMinutes: number;
  kktp: number; // batas ketuntasan (misal 75)
  status: 'DRAFT' | 'PUBLISHED' | 'Tersedia' | 'Sudah Dikerjakan' | 'Belum Dikerjakan';
  showExplanation: boolean; // Tampilkan pembahasan jika guru mengaktifkannya
  difficulty?: 'Mudah' | 'Sedang' | 'Sukar' | 'Campuran';
  questions?: QuizQuestionItem[];
  dueDate?: string;
  score?: number; // legacy display helper
  classId?: string;
  teacherId?: string;
  teacherName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionItem {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle?: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  score: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  percentage: number;
  durationSeconds: number; // waktu pengerjaan
  durationTakenSeconds?: number;
  isPassed: boolean; // score >= kktp
  answers: { [questionIndex: number]: number };
  studentAnswers?: { [questionIndex: number]: number };
  completedAt: string;
  xpEarned: number;
}

export interface QuizResultItem {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  completedAt: string;
  status: 'Selesai' | 'Sedang Dikerjakan';
}

export interface CompetencyTestItem {
  id: string;
  name: string; // Nama asesmen
  title?: string; // compatibility
  material: string; // Materi
  topic?: string; // compatibility
  targetGrade: 'VII' | 'VIII' | 'IX' | 'Semua';
  semester: 'Semester 1' | 'Semester 2';
  description: string;
  url: string; // URL ke Google Forms, Quizizz, Wordwall, dsb
  cbtLink?: string; // compatibility
  platform: 'Google Forms' | 'Quizizz' | 'Wordwall' | 'Microsoft Forms' | 'Website lainnya';
  startDate: string;
  endDate: string;
  deadline?: string; // compatibility
  points: number;
  status: 'Aktif' | 'Nonaktif' | 'Selesai' | 'Buka' | 'Mendatang';
  order: number; // untuk fitur urutkan
  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompetencySubmission {
  id: string;
  testId: string;
  testTitle?: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  completedAt: string;
  status: 'Sudah Dikerjakan' | 'Selesai';
  notes?: string;
  xpEarned: number;
}

export interface AssignmentItem {
  id: string;
  title: string; // Judul
  description: string; // Deskripsi
  material: string; // Materi
  targetGrade: 'VII' | 'VIII' | 'IX' | 'Semua';
  semester: 'Semester 1' | 'Semester 2';
  deadline: string; // Deadline YYYY-MM-DD
  attachmentUrl?: string; // Lampiran
  attachmentName?: string;
  points: number; // Poin maksimal (default 100)
  teacherId?: string;
  teacherName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  submissionType: 'text' | 'file' | 'photo' | 'video' | 'mixed';
  textContent?: string; // Jawaban teks
  fileUrl?: string; // File
  fileName?: string;
  photoUrl?: string; // Foto
  videoUrl?: string; // Video
  submittedAt: string;
  status: 'Belum dikumpulkan' | 'Sudah dikumpulkan' | 'Dinilai' | 'Menunggu Penilaian';
  grade?: number; // Nilai dari guru (0-100)
  feedback?: string; // Catatan dari guru
  gradedAt?: string;
  gradedBy?: string;
}

export interface AttendanceRecord {
  id?: string;
  studentId?: string;
  classId?: string;
  meetingNo: number;
  date: string;
  topic: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
}

export interface AttitudeAssessment {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  aspect: string;
  rating: 'Sangat Baik' | 'Baik' | 'Cukup';
  notes: string;
  teacherId?: string;
}

export interface GradeRecord {
  id: string;
  studentId?: string;
  component: string;
  category: 'Pengetahuan (K3)' | 'Keterampilan (K4)' | 'Sikap (K1/K2)';
  score: number;
  predikat: 'A' | 'B' | 'C';
  note: string;
  semesterId?: string;
  academicYear?: string;
}

export interface ActivityItem {
  id: string;
  studentId: string;
  title: string;
  type: string;
  xpEarned: number;
  timestamp: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  unlockedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  sender: string;
  date: string;
  content: string;
  isUrgent?: boolean;
  targetRole?: 'ALL' | 'SISWA' | 'GURU';
}

export interface ReflectionItem {
  id: string;
  studentId: string;
  materialId?: string;
  date: string;
  mood: string;
  understandingRating: number;
  textFeedback: string;
}

export interface StudentListItem {
  id: string;
  nisn: string;
  nis?: string;
  name: string;
  gender: 'L' | 'P';
  kelas: string;
  attendanceRate: number;
  avgScore: number;
  attitude: string;
  lastActive: string;
  status?: 'active' | 'inactive';
  email?: string;
}

// ==========================================
// BUKU DIGITAL & AI PDF TRANSFORMER TYPES
// ==========================================

export interface DigitalBookSection {
  id: string;
  title: string;
  content: string;
  subsections?: {
    title: string;
    body: string;
  }[];
}

export interface TechniqueStep {
  stepNumber: number;
  title: string; // e.g. "Sikap Awalan", "Pelaksanaan Gerak", "Sikap Akhir"
  description: string;
  keyPoints: string[];
  commonMistakes?: string[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface DidYouKnowItem {
  fact: string;
  category?: string;
}

export interface SafetyTip {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MaterialVideo {
  id: string;
  title: string;
  videoUrl: string;
  duration?: string;
  description?: string;
  addedAt?: string;
}

export interface DigitalBookContent {
  cover: {
    title: string;
    subtitle?: string;
    targetGrade: 'VII' | 'VIII' | 'IX';
    semester: 'Semester 1' | 'Semester 2';
    chapter: number;
    topic: string;
    schoolName: string;
    author: string;
    learningObjectives: string[];
    description: string;
  };
  summary: string;
  keyPoints: string[]; // Poin Penting
  safetyTips: SafetyTip[]; // ⚠️ Tips Keselamatan
  techniques: TechniqueStep[]; // 🏃 Langkah Teknik Gerak
  infographics?: {
    title: string;
    data: { label: string; value: string; desc?: string }[];
  };
  sections: DigitalBookSection[]; // 📚 Chapter & Materi Utama
  glossary: GlossaryItem[]; // Glosarium PJOK
  didYouKnow: DidYouKnowItem[]; // "Tahukah Kamu?"
  reflection: {
    prompt: string;
    guidelines: string[];
  }; // 💭 Refleksi Siswa
  comprehensionQuestions: ComprehensionQuestion[]; // Pertanyaan Pemahaman
  videos: MaterialVideo[]; // Link Video Terintegrasi
}

export interface DigitalBookItem {
  id: string;
  title: string;
  targetGrade: 'VII' | 'VIII' | 'IX';
  semester: 'Semester 1' | 'Semester 2';
  chapter: number;
  topic: string;
  category: 'Permainan Bola Besar' | 'Permainan Bola Kecil' | 'Atletik' | 'Kebugaran Jasmani' | 'Senam Lantai' | 'Kesehatan';
  learningObjectives: string[];
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  readDurationMin: number;
  readPages: number;
  pdfFileName?: string;
  pdfFileSize?: string;
  content: DigitalBookContent;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StudentBookProgress {
  id: string;
  studentId: string;
  bookId: string;
  status: 'Belum Dipelajari' | 'Sedang Dipelajari' | 'Selesai';
  isBookmarked: boolean;
  lastOpenedAt?: string;
  completedAt?: string;
  lastSectionIndex?: number;
  reflectionAnswer?: string;
  quizScore?: number;
}


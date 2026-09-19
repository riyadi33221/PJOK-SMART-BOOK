import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  BookOpen,
  FileText,
  PlaySquare,
  CheckSquare,
  FileCheck2,
  Heart,
  CalendarCheck,
  Award,
  Activity,
  Gift,
  Bell,
  Settings,
  Edit2,
  ExternalLink,
  CheckCircle,
  Save,
} from 'lucide-react';
import {
  User,
  MaterialItem,
  QuizItem,
  CompetencyTestItem,
  StudentListItem,
  ClassRoom,
  AppSettings,
  AnnouncementItem,
  BadgeItem,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Table, Column } from '../common/Table';
import { Modal } from '../common/Modal';
import { TeacherBookManager } from '../books/TeacherBookManager';
import { QuizManager } from './QuizManager';
import { CompetencyTestManager } from './CompetencyTestManager';
import { AssignmentManager } from './AssignmentManager';

interface TeacherViewsProps {
  activeMenu: string;
  currentUser: User;
  students: StudentListItem[];
  classes: ClassRoom[];
  materials: MaterialItem[];
  quizzes: QuizItem[];
  competencyTests: CompetencyTestItem[];
  announcements: AnnouncementItem[];
  badges: BadgeItem[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onAddMaterial?: (item: MaterialItem) => void;
}

export const TeacherViews: React.FC<TeacherViewsProps> = ({
  activeMenu,
  currentUser,
  students,
  classes,
  materials,
  quizzes,
  competencyTests,
  announcements,
  badges,
  settings,
  onUpdateSettings,
}) => {
  // Filter states
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settings local state
  const [academicYearInput, setAcademicYearInput] = useState(settings.academicYear);
  const [semesterInput, setSemesterInput] = useState(settings.activeSemester);
  const [schoolNameInput, setSchoolNameInput] = useState(settings.schoolName);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // New material modal state
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialCategory, setNewMaterialCategory] = useState('Permainan Bola Besar');

  // Filter students based on class and search
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'Semua' || s.kelas === selectedClass;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);
    return matchClass && matchSearch;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      academicYear: academicYearInput,
      activeSemester: semesterInput,
      schoolName: schoolNameInput,
    });
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // 0. Buku PJOK Digital & AI PDF Material Transformer (Tahap 3)
  if (activeMenu === 'buku') {
    return (
      <TeacherBookManager
        teacherName={currentUser.name || 'Purwanto, S.Pd.'}
        teacherId={currentUser.id || 'guru-001'}
      />
    );
  }

  // 1. Data Siswa View
  if (activeMenu === 'data_siswa') {
    const columns: Column<StudentListItem>[] = [
      { key: 'nisn', header: 'NISN', width: '130px' },
      {
        key: 'name',
        header: 'Nama Siswa',
        render: (row) => (
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-400">
              Jenis Kelamin: {row.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
            </span>
          </div>
        ),
      },
      {
        key: 'kelas',
        header: 'Kelas',
        align: 'center',
        width: '90px',
        render: (row) => <Badge variant="slate" size="sm">{row.kelas}</Badge>,
      },
      {
        key: 'attendanceRate',
        header: 'Presensi',
        align: 'center',
        render: (row) => (
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {row.attendanceRate}%
          </span>
        ),
      },
      {
        key: 'avgScore',
        header: 'Rata-rata Nilai',
        align: 'center',
        render: (row) => (
          <span className="font-bold text-slate-900 dark:text-white">
            {row.avgScore}
          </span>
        ),
      },
      {
        key: 'attitude',
        header: 'Sikap',
        align: 'center',
        render: (row) => (
          <Badge
            variant={row.attitude === 'Sangat Baik' ? 'emerald' : 'blue'}
            size="sm"
          >
            {row.attitude}
          </Badge>
        ),
      },
      {
        key: 'lastActive',
        header: 'Keaktifan Terakhir',
        render: (row) => (
          <span className="text-xs text-slate-500">{row.lastActive}</span>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <span>Data Siswa PJOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manajemen 216 siswa terdaftar di seluruh rombongan belajar Kelas VII, VIII, dan IX
            </p>
          </div>
          <Badge variant="blue" size="lg">
            Total {filteredStudents.length} Siswa Ditampilkan
          </Badge>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Kelas (VII, VIII, IX)</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  Kelas {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <Table
          columns={columns}
          data={filteredStudents}
          keyExtractor={(row) => row.id}
          emptyMessage="Tidak ada data siswa yang cocok dengan filter."
        />
      </div>
    );
  }

  // 2. Buku PJOK Digital & AI PDF Transformer View
  if (activeMenu === 'buku') {
    return <TeacherBookManager teacherName={currentUser.name} teacherId={currentUser.id} />;
  }

  // 2b. Materi Ajar View (24 Materi)
  if (activeMenu === 'materi') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-500" />
              <span>Daftar Materi & Modul Ajar PJOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Total 24 modul e-book digital yang siap diakses dan dipelajari oleh siswa
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddMaterialModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Tambah Materi Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((mat) => (
            <Card key={mat.id} className="p-5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" size="sm">
                    {mat.category}
                  </Badge>
                  <span className="text-xs font-bold text-slate-400">
                    Bab {mat.chapter}
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {mat.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {mat.summary}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{mat.readPages} Halaman • {mat.durationMin} mnt</span>
                <span className="font-bold text-emerald-600 hover:underline cursor-pointer">
                  Sunting Modul
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Material Modal */}
        <Modal
          isOpen={showAddMaterialModal}
          onClose={() => setShowAddMaterialModal(false)}
          title="Tambah Materi PJOK Baru"
          subtitle="Tambahkan topik atau bab e-book digital baru untuk siswa"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Judul Materi:</label>
              <input
                type="text"
                placeholder="Contoh: Senam Irama: Langkah Kaki Dinamis"
                value={newMaterialTitle}
                onChange={(e) => setNewMaterialTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Kategori:</label>
              <select
                value={newMaterialCategory}
                onChange={(e) => setNewMaterialCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Permainan Bola Besar">Permainan Bola Besar</option>
                <option value="Permainan Bola Kecil">Permainan Bola Kecil</option>
                <option value="Atletik">Atletik</option>
                <option value="Kebugaran Jasmani">Kebugaran Jasmani</option>
                <option value="Senam Lantai">Senam Lantai</option>
                <option value="Kesehatan">Kesehatan</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddMaterialModal(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Materi "${newMaterialTitle || 'Materi Baru'}" berhasil disimpan!`);
                  setShowAddMaterialModal(false);
                }}
              >
                Simpan Materi
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // 3. Kuis & Latihan View (Bank Soal, Generator AI, Hasil Kuis)
  if (activeMenu === 'kuis') {
    return <QuizManager teacherName={currentUser.name} teacherId={currentUser.id} classes={classes} />;
  }

  // 4. Uji Kompetensi Berbasis Tautan View (Google Forms, Quizizz, Wordwall, MS Forms)
  if (activeMenu === 'cbt') {
    return <CompetencyTestManager teacherName={currentUser.name} teacherId={currentUser.id} />;
  }

  // 4b. Kelola Tugas & Praktik Mandiri
  if (activeMenu === 'tugas') {
    return <AssignmentManager teacherName={currentUser.name} teacherId={currentUser.id} />;
  }

  // 5. Monitoring Siswa Live
  if (activeMenu === 'monitoring') {
    const liveFeeds = [
      { id: 'lf-01', student: 'Ahmad (VII-A)', action: 'Menyelesaikan Kuis 6: Analisis Sikap Roll Depan', score: 'Skor: 84', time: '5 menit lalu' },
      { id: 'lf-02', student: 'Anisa Putri Maharani (VII-A)', action: 'Membaca Bab 9: Senam Lantai Roll Belakang', score: 'Halaman 12/15', time: '12 menit lalu' },
      { id: 'lf-03', student: 'Bagus Tri Prakoso (VII-A)', action: 'Mencapai target presensi 90% (Lencana Bintang)', score: '+125 XP', time: '25 menit lalu' },
      { id: 'lf-04', student: 'Cantika Dewi Lestari (VII-A)', action: 'Mengunggah refleksi gerak passing bawah bola voli', score: 'Terkirim', time: '40 menit lalu' },
      { id: 'lf-05', student: 'Kevin Pratama (IX-A)', action: 'Menuntaskan Uji Kompetensi Bab Atletik', score: 'Skor: 92', time: '1 jam lalu' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            <span>Monitoring Aktivitas Siswa Live</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Log interaksi siswa secara real-time pada materi e-book, video, dan asesmen
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                182 Siswa Aktif Terpantau
              </span>
            </div>
            <Badge variant="emerald" size="sm">
              Sistem Online
            </Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {liveFeeds.map((feed) => (
              <div key={feed.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {feed.student}
                  </p>
                  <p className="text-xs text-slate-500">{feed.action}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="slate" size="sm">
                    {feed.score}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1">{feed.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 6. Asesmen Sikap View
  if (activeMenu === 'sikap') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              <span>Asesmen Sikap & Karakter Siswa</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Rubrik penilaian sportivitas, disiplin, gotong royong, dan kejujuran olahraga
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Input Nilai Sikap Masal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-l-4 border-l-emerald-500">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Sportivitas & Fair Play
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              98% siswa memiliki catatan sportivitas Sangat Baik pada kegiatan bertanding.
            </p>
          </Card>
          <Card className="p-5 border-l-4 border-l-blue-500">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Kedisiplinan & Seragam
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Kepatuhan pemakaian kaos olahraga resmi dan ketepatan waktu hadir di lapangan.
            </p>
          </Card>
          <Card className="p-5 border-l-4 border-l-purple-500">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Tanggung Jawab Alat
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Kepedulian siswa merapikan bola, matras, dan sarana olahraga sekolah.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // 7. Pengaturan View (Tahun Ajaran, Semester, Sekolah)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          <span>Pengaturan Pembelajaran & Sistem</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Kelola tahun pelajaran, semester aktif, identitas sekolah, dan standar KKM
        </p>
      </div>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
          {settingsSavedMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Pengaturan berhasil diperbarui!</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Sekolah:
            </label>
            <input
              type="text"
              value={schoolNameInput}
              onChange={(e) => setSchoolNameInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tahun Pelajaran:
              </label>
              <input
                type="text"
                value={academicYearInput}
                onChange={(e) => setAcademicYearInput(e.target.value)}
                placeholder="2024/2025"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Semester Aktif:
              </label>
              <select
                value={semesterInput}
                onChange={(e) => setSemesterInput(e.target.value as 'Semester 1' | 'Semester 2')}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Semester 1">Semester 1 (Gasal)</option>
                <option value="Semester 2">Semester 2 (Genap)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Guru Pengampu Utama:
            </label>
            <input
              type="text"
              disabled
              value={settings.creatorName}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-semibold"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4" />}
            >
              Simpan Perubahan Pengaturan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

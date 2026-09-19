import React, { useState } from 'react';
import {
  BookOpen,
  PlaySquare,
  Activity,
  CheckSquare,
  FileCheck2,
  Heart,
  CalendarCheck,
  Award,
  TrendingUp,
  Gift,
  Bell,
  User as UserIcon,
  ExternalLink,
  CheckCircle2,
  Clock,
  Zap,
  Search,
  Filter,
  Flame,
  Star,
  Download,
  Share2,
} from 'lucide-react';
import {
  User,
  MaterialItem,
  QuizItem,
  CompetencyTestItem,
  AttendanceRecord,
  GradeRecord,
  BadgeItem,
  AnnouncementItem,
  StudentStats,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Table, Column } from '../common/Table';
import { Modal } from '../common/Modal';
import { ScoreTrendChart } from '../common/Chart';
import { StudentBookList } from '../books/StudentBookList';
import { StudentQuizRunner } from './StudentQuizRunner';
import { StudentCompetencyTestView } from './StudentCompetencyTestView';
import { StudentAssignmentView } from './StudentAssignmentView';

interface StudentViewsProps {
  activeMenu: string;
  currentUser: User;
  stats: StudentStats;
  materials: MaterialItem[];
  quizzes: QuizItem[];
  competencyTests: CompetencyTestItem[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  badges: BadgeItem[];
  announcements: AnnouncementItem[];
  onNavigate: (menuKey: string) => void;
}

export const StudentViews: React.FC<StudentViewsProps> = ({
  activeMenu,
  currentUser,
  stats,
  materials,
  quizzes,
  competencyTests,
  attendance,
  grades,
  badges,
  announcements,
  onNavigate,
}) => {
  // Modal state for reading a chapter
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  // Filter for materials
  const [materialFilter, setMaterialFilter] = useState<string>('Semua');

  // 1. Buku PJOK Digital & Interaktif View (Tahap 3)
  if (activeMenu === 'buku') {
    return (
      <StudentBookList
        studentId={currentUser.id}
        studentName={currentUser.name}
        studentGrade={(currentUser.kelas?.replace(/[^VIIX]/g, '') as any) || 'VII'}
      />
    );
  }

  // 2. Video Pembelajaran View
  if (activeMenu === 'video') {
    const videoList = [
      { id: 'v-01', title: 'Tutorial Gerak Passing Kaki Dalam Sepak Bola', category: 'Sepak Bola', duration: '08:45', teacher: 'Purwanto, S.Pd.', views: '210x' },
      { id: 'v-02', title: 'Passing Bawah Voli: Posisi Lengan & Lutut Tepat', category: 'Bola Voli', duration: '06:30', teacher: 'Purwanto, S.Pd.', views: '195x' },
      { id: 'v-03', title: 'Start Jongkok & Akselerasi Lari 100m', category: 'Atletik', duration: '09:15', teacher: 'Purwanto, S.Pd.', views: '240x' },
      { id: 'v-04', title: 'Rangkaian Roll Depan Aman di Atas Matras', category: 'Senam Lantai', duration: '07:20', teacher: 'Purwanto, S.Pd.', views: '188x' },
      { id: 'v-05', title: 'Chest Pass & Bounce Pass Bola Basket', category: 'Bola Basket', duration: '05:50', teacher: 'Purwanto, S.Pd.', views: '172x' },
      { id: 'v-06', title: 'Pengukuran Kebugaran Jasmani Mandiri', category: 'Kebugaran', duration: '11:10', teacher: 'Purwanto, S.Pd.', views: '225x' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <PlaySquare className="w-6 h-6 text-blue-500" />
            <span>Video Pembelajaran PJOK</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Koleksi video gerak spesifik, biomekanik, dan tutorial teknik resmi guru PJOK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videoList.map((vid) => (
            <Card key={vid.id} hoverEffect className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
              <div className="relative aspect-video bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center text-white group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlaySquare className="w-6 h-6 ml-0.5" />
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold">
                  {vid.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="emerald" size="sm">
                    {vid.category}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {vid.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{vid.teacher}</span>
                  <span>{vid.views}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 3. Aktivitas Pembelajaran View
  if (activeMenu === 'aktivitas') {
    const activities = [
      { id: 'act-01', title: 'Lembar Catatan Gerak Harian (Push-up & Sit-up)', target: '3x Seminggu', status: 'Selesai', points: '+25 XP' },
      { id: 'act-02', title: 'Praktik Mandiri: Sikap Lilin di Rumah', target: 'Dokumentasi Foto/Catatan', status: 'Selesai', points: '+30 XP' },
      { id: 'act-03', title: 'Pengukuran Denyut Nadi Istirahat vs Latihan', target: 'Tabel Heart Rate', status: 'Sedang Berjalan', points: '+20 XP' },
      { id: 'act-04', title: 'Refleksi Video Passing Voli SMPN 2 Kutasari', target: 'Analisis 3 Kesalahan', status: 'Belum Mulai', points: '+25 XP' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            <span>Aktivitas & Tugas Gerak Mandiri</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Log aktivitas gerak, lembar kerja siswa, dan pemantauan kebiasaan hidup bugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act) => (
            <Card key={act.id} className="p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      act.status === 'Selesai'
                        ? 'emerald'
                        : act.status === 'Sedang Berjalan'
                        ? 'amber'
                        : 'slate'
                    }
                    size="sm"
                  >
                    {act.status}
                  </Badge>
                  <span className="font-bold text-xs text-amber-500">{act.points}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instruksi: {act.target}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="outline" size="sm">
                  Buka Lembar Tugas
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 4. Kuis & Latihan View (Interaktif, Timer, Pilihan Ganda/Benar-Salah/Gambar, Hasil Kuis & Pembahasan)
  if (activeMenu === 'kuis') {
    return <StudentQuizRunner currentUser={currentUser} />;
  }

  // 5. Uji Kompetensi Berbasis Tautan View (Google Forms, Quizizz, Wordwall, MS Forms)
  if (activeMenu === 'cbt') {
    return <StudentCompetencyTestView currentUser={currentUser} />;
  }

  // 5b. Tugas & Praktik Mandiri PJOK (Video, Portofolio, Foto, Teks & Penilaian)
  if (activeMenu === 'tugas') {
    return <StudentAssignmentView currentUser={currentUser} />;
  }

  // 6. Asesmen Sikap View
  if (activeMenu === 'sikap') {
    const attitudeAspects = [
      { aspect: 'Sportivitas', score: 'Sangat Baik', note: 'Menghargai keputusan wasit/guru saat mini match sepak bola.' },
      { aspect: 'Kedisiplinan', score: 'Sangat Baik', note: 'Selalu hadir tepat waktu dan memakai seragam olahraga lengkap.' },
      { aspect: 'Kerjasama Tim', score: 'Baik', note: 'Mendukung rekan satu regu pada pembelajaran passing bola voli.' },
      { aspect: 'Tanggung Jawab', score: 'Sangat Baik', note: 'Mengembalikan dan merapikan alat olahraga setelah selesai digunakan.' },
      { aspect: 'Kejujuran', score: 'Sangat Baik', note: 'Jujur mengakui sentuhan bola atau pelanggaran out saat bertanding.' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              <span>Asesmen Sikap PJOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluasi sikap spiritual dan sosial selama pembelajaran praktik dan teori
            </p>
          </div>
          <Badge variant="rose" size="lg">
            Predikat: {stats.attitudeRating}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attitudeAspects.map((att, idx) => (
            <Card key={idx} className="p-5 space-y-2 border-l-4 border-l-rose-500">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {att.aspect}
                </h4>
                <Badge variant="emerald" size="sm">
                  {att.score}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Catatan Guru: "{att.note}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 7. Kehadiran View
  if (activeMenu === 'kehadiran') {
    const columns: Column<AttendanceRecord>[] = [
      { key: 'meetingNo', header: 'Pertemuan', align: 'center', width: '90px' },
      { key: 'date', header: 'Tanggal', width: '140px' },
      { key: 'topic', header: 'Materi / Aktivitas Pembelajaran' },
      {
        key: 'status',
        header: 'Status Presensi',
        align: 'center',
        width: '120px',
        render: (row) => (
          <Badge
            variant={
              row.status === 'Hadir'
                ? 'emerald'
                : row.status === 'Sakit'
                ? 'amber'
                : row.status === 'Izin'
                ? 'blue'
                : 'rose'
            }
            size="sm"
          >
            {row.status}
          </Badge>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-500" />
              <span>Rekap Kehadiran PJOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Presensi 12 pertemuan pembelajaran teori & lapangan Semester 1
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald" size="lg">
              Tingkat Kehadiran: {stats.attendancePercent}%
            </Badge>
          </div>
        </div>

        <Table
          columns={columns}
          data={attendance}
          keyExtractor={(row) => String(row.meetingNo)}
        />
      </div>
    );
  }

  // 8. Nilai Pembelajaran View
  if (activeMenu === 'nilai') {
    const columns: Column<GradeRecord>[] = [
      { key: 'component', header: 'Komponen Penilaian' },
      { key: 'category', header: 'Kategori Kompetensi' },
      {
        key: 'score',
        header: 'Nilai',
        align: 'center',
        render: (row) => (
          <span className="font-black text-slate-900 dark:text-white">
            {row.score}
          </span>
        ),
      },
      {
        key: 'predikat',
        header: 'Predikat',
        align: 'center',
        render: (row) => (
          <Badge
            variant={row.predikat === 'A' ? 'emerald' : row.predikat === 'B' ? 'blue' : 'amber'}
            size="sm"
          >
            {row.predikat}
          </Badge>
        ),
      },
      { key: 'note', header: 'Catatan Guru' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-500" />
              <span>Transkrip Nilai PJOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Rekapitulasi nilai pengetahuan, keterampilan gerak, dan sikap
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Rata-rata Nilai:
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.averageScore}
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          data={grades}
          keyExtractor={(row) => row.id}
        />
      </div>
    );
  }

  // 9. Progres Belajar View
  if (activeMenu === 'progres') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <span>Progres Belajar PJOK</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Perkembangan kompetensi semester, riwayat nilai, dan ketuntasan materi
          </p>
        </div>

        <Card variant="athletic" className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Pencapaian Kurikulum Semester 1: 75%
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Kamu berada di jalur yang sangat baik untuk menyelesaikan seluruh capaian pembelajaran PJOK.
          </p>
          <ProgressBar
            value={stats.progressSemester}
            max={100}
            size="lg"
            color="athletic"
            milestones={[
              { label: 'Sprint', at: 25 },
              { label: 'Voli', at: 50 },
              { label: 'Senam Matras', at: 75 },
              { label: 'Finis PAS', at: 100 },
            ]}
          />
        </Card>

        {/* Score Trend Chart */}
        <Card className="p-6">
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
            Grafik Perkembangan Nilai Siswa
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Tren nilai kuis dan tes praktik PJOK dari awal semester hingga saat ini
          </p>
          <ScoreTrendChart />
        </Card>
      </div>
    );
  }

  // 10. Reward & XP View
  if (activeMenu === 'reward') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-500" />
              <span>Reward, Poin & Badge PJOK</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Koleksi lencana prestasi olahraga, poin keaktifan, dan apresiasi kebugaran
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-600">Saldo Poin</p>
              <p className="text-lg font-black text-amber-700 dark:text-amber-400">{stats.xp} XP</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((bdg) => (
            <Card
              key={bdg.id}
              className={`p-5 flex flex-col justify-between ${
                bdg.isUnlocked
                  ? 'border-amber-400/50 bg-gradient-to-br from-amber-50/40 via-white to-transparent dark:from-amber-950/20 dark:to-slate-900'
                  : 'opacity-60 bg-slate-50 dark:bg-slate-900/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                      bdg.isUnlocked
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {bdg.isUnlocked ? '🏅' : '🔒'}
                  </div>
                  <Badge variant={bdg.isUnlocked ? 'gold' : 'slate'} size="sm">
                    +{bdg.xpValue} XP
                  </Badge>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {bdg.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {bdg.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                {bdg.isUnlocked ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Terbuka pada {bdg.unlockedAt}</span>
                  </span>
                ) : (
                  <span>Belum Terbuka • Selesaikan misi</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 11. Pengumuman View
  if (activeMenu === 'pengumuman') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-500" />
            <span>Pengumuman Pembelajaran PJOK</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Informasi resmi jadwal praktik, seragam, dan ujian dari Bapak Purwanto, S.Pd.
          </p>
        </div>

        <div className="space-y-4">
          {announcements.map((anc) => (
            <Card key={anc.id} className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {anc.title}
                  </h3>
                  {anc.isUrgent && (
                    <Badge variant="rose" size="sm">
                      Penting
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-slate-400">{anc.date}</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {anc.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                <span>Pengirim: <strong>{anc.sender}</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SMP Negeri 2 Kutasari</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 12. Profil View
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-emerald-500" />
          <span>Profil Siswa</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Data identitas siswa, kelas, NISN, dan statistik olahraga
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Card className="p-6 text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-md">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {currentUser.level || 'Atlet Muda Tingkat II'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <Badge variant="emerald" size="md">
                Kelas {currentUser.kelas || 'VII-A'}
              </Badge>
              <Badge variant="gold" size="md">
                {stats.xp} XP
              </Badge>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Informasi Akademik Siswa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 text-xs">Nama Lengkap:</span>
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">NISN:</span>
                <p className="font-bold text-slate-900 dark:text-white">{currentUser.nisn || '0098471203'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Sekolah:</span>
                <p className="font-bold text-slate-900 dark:text-white">SMP Negeri 2 Kutasari</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Kelas & Semester:</span>
                <p className="font-bold text-slate-900 dark:text-white">
                  Kelas {currentUser.kelas || 'VII-A'} • Semester {currentUser.semester || 1}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Guru Pengampu PJOK:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Purwanto, S.Pd.</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Status Akun:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Aktif & Terverifikasi</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

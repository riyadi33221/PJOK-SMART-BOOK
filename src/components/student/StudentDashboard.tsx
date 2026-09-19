import React from 'react';
import {
  BookOpen,
  CheckSquare,
  Trophy,
  Award,
  CalendarCheck,
  Heart,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  PlaySquare,
  AlertCircle,
} from 'lucide-react';
import { User, StudentStats, MaterialItem, QuizItem, AnnouncementItem } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';

interface StudentDashboardProps {
  currentUser: User;
  stats: StudentStats;
  materials: MaterialItem[];
  quizzes: QuizItem[];
  announcements: AnnouncementItem[];
  onNavigate: (menuKey: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  stats,
  materials,
  quizzes,
  announcements,
  onNavigate,
}) => {
  // Currently ongoing material
  const currentLearning = materials.find((m) => m.status === 'Sedang Belajar') || materials[8];
  // Next available quiz
  const nextQuiz = quizzes.find((q) => q.status === 'PUBLISHED' || q.status === 'Tersedia') || quizzes[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Student Greeting & Class/Semester Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="athletic-pattern h-full w-full" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-emerald-100">
                Siswa Aktif PJOK
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                {currentUser.level || 'Tingkat II'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Halo, {currentUser.name}! 👋
            </h2>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-emerald-100">
              <span className="bg-emerald-800/60 px-3 py-1 rounded-full font-bold">
                Kelas: {currentUser.kelas || 'VII-A'}
              </span>
              <span className="bg-emerald-800/60 px-3 py-1 rounded-full font-bold">
                Semester: {currentUser.semester || 1}
              </span>
              <span className="bg-emerald-800/60 px-3 py-1 rounded-full">
                NISN: {currentUser.nisn || '0098471203'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              🏆
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Total Perolehan
              </p>
              <p className="text-2xl font-black text-white">{stats.xp} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Grid (Exactly matching prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Materi Selesai */}
        <Card
          hoverEffect
          className="cursor-pointer"
          onClick={() => onNavigate('buku')}
          padding="sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📚</span>
            <Badge variant="emerald" size="sm">
              Aktif
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Materi Selesai</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.completedMaterials} / {stats.totalMaterials}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Buka Buku</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </Card>

        {/* Card 2: Kuis */}
        <Card
          hoverEffect
          className="cursor-pointer"
          onClick={() => onNavigate('kuis')}
          padding="sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📝</span>
            <Badge variant="blue" size="sm">
              Tuntas
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Kuis</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.completedQuizzes}
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Lihat Kuis</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </Card>

        {/* Card 3: XP */}
        <Card
          hoverEffect
          className="cursor-pointer"
          onClick={() => onNavigate('reward')}
          padding="sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🏆</span>
            <Badge variant="gold" size="sm">
              Level 2
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">XP</p>
          <p className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
            {stats.xp}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Lencana Reward</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </Card>

        {/* Card 4: Rata-rata Nilai */}
        <Card
          hoverEffect
          className="cursor-pointer"
          onClick={() => onNavigate('nilai')}
          padding="sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📊</span>
            <Badge variant="purple" size="sm">
              Grade A
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Rata-rata Nilai</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.averageScore}
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Transkrip Nilai</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </Card>

        {/* Card 5: Kehadiran */}
        <Card
          hoverEffect
          className="cursor-pointer"
          onClick={() => onNavigate('kehadiran')}
          padding="sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📅</span>
            <Badge variant="emerald" size="sm">
              Disiplin
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Kehadiran</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.attendancePercent}%
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Rekap Presensi</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </Card>

        {/* Card 6: Sikap */}
        <Card
          hoverEffect
          className="cursor-pointer"
          onClick={() => onNavigate('sikap')}
          padding="sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">❤️</span>
            <Badge variant="rose" size="sm">
              Sportif
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Sikap</p>
          <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {stats.attitudeRating}
          </p>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1 flex items-center gap-0.5">
            <span>Rubrik Sikap</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </Card>
      </div>

      {/* 3. Progress Bar Semester: 75% */}
      <Card variant="athletic" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <span>Progres Belajar Semester: 75%</span>
              <Badge variant="emerald" size="sm">
                Target Terlampaui
              </Badge>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kamu telah menyelesaikan 8 dari 12 bab materi PJOK Semester 1. Terus pertahankan semangat bergerak!
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('progres')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            Rincian Capaian
          </Button>
        </div>

        <ProgressBar
          value={stats.progressSemester}
          max={100}
          size="md"
          color="athletic"
          milestones={[
            { label: 'Sprint 100m', at: 25 },
            { label: 'Bola Voli', at: 50 },
            { label: 'Senam Matras', at: 75 },
            { label: 'PAS Akhir', at: 100 },
          ]}
        />
      </Card>

      {/* 4. Active Tasks & Quick Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sedang Dipelajari & Kuis Menunggu */}
        <div className="lg:col-span-8 space-y-5">
          {/* Current Material Card */}
          <Card className="p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="amber" size="sm">
                    Lanjutkan Belajar
                  </Badge>
                  <span className="text-xs text-slate-400">Bab {currentLearning.chapter} • {currentLearning.category}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {currentLearning.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {currentLearning.summary}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('buku')}
                icon={<BookOpen className="w-4 h-4" />}
                className="shrink-0"
              >
                Baca Modul
              </Button>
            </div>
          </Card>

          {/* Next Available Quiz */}
          <Card className="p-5 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="sm">
                    Kuis Tersedia
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Batas Waktu: {nextQuiz.dueDate}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {nextQuiz.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{nextQuiz.questionsCount} Butir Soal</span>
                  <span>•</span>
                  <span>Waktu {nextQuiz.durationMinutes} Menit</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">+50 XP</span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigate('kuis')}
                icon={<CheckSquare className="w-4 h-4" />}
                className="shrink-0"
              >
                Mulai Kuis
              </Button>
            </div>
          </Card>

          {/* Quick Action Navigation Grid for Student */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Akses Cepat Fitur Belajar PJOK
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigate('video')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <PlaySquare className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Video Gerak</p>
                <p className="text-[11px] text-slate-400">Tutorial praktik</p>
              </button>

              <button
                onClick={() => onNavigate('aktivitas')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Aktivitas Gerak</p>
                <p className="text-[11px] text-slate-400">Log latihan mandiri</p>
              </button>

              <button
                onClick={() => onNavigate('cbt')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Uji Kompetensi</p>
                <p className="text-[11px] text-slate-400">Portal CBT ujian</p>
              </button>

              <button
                onClick={() => onNavigate('reward')}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Lencana & XP</p>
                <p className="text-[11px] text-slate-400">6 Penghargaan</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Pengumuman Terkini & Agenda */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-500" />
                <span>Pengumuman Guru PJOK</span>
              </h4>
              <button
                onClick={() => onNavigate('pengumuman')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Semua
              </button>
            </div>

            <div className="space-y-3.5">
              {announcements.slice(0, 2).map((anc) => (
                <div
                  key={anc.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {anc.title}
                    </span>
                    {anc.isUrgent && (
                      <Badge variant="rose" size="sm">
                        Penting
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {anc.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{anc.sender}</span>
                    <span>{anc.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Agenda Pertemuan PJOK Minggu Ini */}
          <Card className="p-5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Jadwal PJOK Berikutnya</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Kamis, 07:15 - 09:30 WIB
                </span>
                <Badge variant="emerald" size="sm">
                  Lapangan
                </Badge>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Praktik Senam Lantai: Rangkaian Gerak Roll Depan & Belakang
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pengampu: Purwanto, S.Pd. • Matras Aula Utama
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

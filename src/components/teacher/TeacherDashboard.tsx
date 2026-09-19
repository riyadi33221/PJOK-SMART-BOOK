import React from 'react';
import {
  Users,
  UserCheck,
  BookOpen,
  CheckSquare,
  FileCheck2,
  Award,
  CalendarCheck,
  PlusCircle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { User, TeacherStats, AppSettings } from '../../types';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ActivityBarChart, ScoreTrendChart, AttendanceDonutChart } from '../common/Chart';
import { dummyTeacherActivityChart, dummyGradeDistribution } from '../../data/dummyData';

interface TeacherDashboardProps {
  currentUser: User;
  stats: TeacherStats;
  settings: AppSettings;
  onNavigate: (menuKey: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  stats,
  settings,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Teacher Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-blue-100">
                Panel Pendidik PJOK
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                {settings.schoolName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Selamat Datang, {currentUser.name}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Monitoring keaktifan gerak, asesmen kurikulum, modul buku digital, dan capaian siswa
              kelas VII, VIII, dan IX secara terintegrasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="athletic"
              size="md"
              onClick={() => onNavigate('kehadiran')}
              icon={<CalendarCheck className="w-4 h-4 text-emerald-400" />}
            >
              Presensi Hari Ini
            </Button>
            <Button
              variant="amber"
              size="md"
              onClick={() => onNavigate('materi')}
              icon={<PlusCircle className="w-4 h-4 text-slate-900" />}
            >
              Materi Baru
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Dummy Statistics Cards (Exactly matching prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5 sm:gap-4">
        {/* Total Siswa: 216 */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('data_siswa')}>
          <div className="flex items-center justify-between mb-1">
            <Users className="w-5 h-5 text-blue-500" />
            <Badge variant="blue" size="sm">
              19 Kelas
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Siswa</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalStudents}
          </p>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
            Data Terdaftar &rarr;
          </p>
        </Card>

        {/* Siswa Aktif Hari Ini: 182 */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('monitoring')}>
          <div className="flex items-center justify-between mb-1">
            <UserCheck className="w-5 h-5 text-emerald-500" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Aktif Hari Ini</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.activeStudentsToday}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            84.2% Keaktifan &rarr;
          </p>
        </Card>

        {/* Materi: 24 */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('materi')}>
          <div className="flex items-center justify-between mb-1">
            <FileText className="w-5 h-5 text-indigo-500" />
            <Badge variant="purple" size="sm">
              Modul
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Materi</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalMaterials}
          </p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Kelola Modul &rarr;
          </p>
        </Card>

        {/* Kuis: 18 */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('kuis')}>
          <div className="flex items-center justify-between mb-1">
            <CheckSquare className="w-5 h-5 text-amber-500" />
            <Badge variant="amber" size="sm">
              Kuis
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Kuis</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalQuizzes}
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Bank Soal &rarr;
          </p>
        </Card>

        {/* Uji Kompetensi: 12 */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('cbt')}>
          <div className="flex items-center justify-between mb-1">
            <FileCheck2 className="w-5 h-5 text-rose-500" />
            <Badge variant="rose" size="sm">
              CBT
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Uji Kompetensi</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalCompetencyTests}
          </p>
          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
            Tautan Ujian &rarr;
          </p>
        </Card>

        {/* Rata-rata Nilai: 84 */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('nilai')}>
          <div className="flex items-center justify-between mb-1">
            <Award className="w-5 h-5 text-purple-500" />
            <Badge variant="purple" size="sm">
              KKM 75
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Rata-rata Nilai</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.averageScore}
          </p>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
            Rekap Nilai &rarr;
          </p>
        </Card>

        {/* Kehadiran: 94% */}
        <Card hoverEffect padding="sm" className="cursor-pointer" onClick={() => onNavigate('kehadiran')}>
          <div className="flex items-center justify-between mb-1">
            <CalendarCheck className="w-5 h-5 text-emerald-500" />
            <Badge variant="emerald" size="sm">
              Target 90%
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Kehadiran</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.attendancePercent}%
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Rekap Presensi &rarr;
          </p>
        </Card>
      </div>

      {/* 3. Dummy Charts Section (Aktivitas siswa, Perkembangan nilai, Kehadiran) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grafik 1: Aktivitas Siswa Mingguan */}
        <div className="lg:col-span-5">
          <Card className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Aktivitas Siswa Minggu Ini</span>
                </h4>
                <Badge variant="emerald" size="sm">
                  182 Aktif
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Jumlah siswa SMPN 2 Kutasari mengakses buku dan latihan PJOK
              </p>
            </div>

            <div className="py-2">
              <ActivityBarChart data={dummyTeacherActivityChart} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Puncak Aktivitas: Rabu (182 siswa)</span>
              <button
                onClick={() => onNavigate('monitoring')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Log Live &rarr;
              </button>
            </div>
          </Card>
        </div>

        {/* Grafik 2: Perkembangan Nilai Siswa */}
        <div className="lg:col-span-4">
          <Card className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  <span>Perkembangan Nilai PJOK</span>
                </h4>
                <Badge variant="blue" size="sm">
                  Tren Naik
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Rata-rata penilaian kuis dan tes praktik antar kompetensi dasar
              </p>
            </div>

            <div className="py-2">
              <ScoreTrendChart />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Rata-rata Saat Ini: 84 / 100</span>
              <button
                onClick={() => onNavigate('nilai')}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
              >
                Rincian &rarr;
              </button>
            </div>
          </Card>
        </div>

        {/* Grafik 3: Kehadiran Siswa */}
        <div className="lg:col-span-3">
          <Card className="p-5 h-full flex flex-col justify-between items-center text-center">
            <div className="w-full text-left">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                <span>Rasio Kehadiran</span>
              </h4>
              <p className="text-xs text-slate-500">Semester 1 Gasal</p>
            </div>

            <div className="py-4">
              <AttendanceDonutChart percent={stats.attendancePercent} label="216 Siswa Terdata" />
            </div>

            <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-around text-xs text-slate-500">
              <div className="text-center">
                <span className="block font-bold text-emerald-600">94%</span>
                <span className="text-[10px]">Hadir</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-amber-500">3%</span>
                <span className="text-[10px]">Sakit</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-blue-500">2%</span>
                <span className="text-[10px]">Izin</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-rose-500">1%</span>
                <span className="text-[10px]">Alpa</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

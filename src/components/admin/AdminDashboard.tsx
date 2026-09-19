import React from 'react';
import {
  Shield,
  Users,
  GraduationCap,
  Sliders,
  Settings,
  ShieldCheck,
  Server,
  Layers,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { User, AppSettings, ClassRoom } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface AdminDashboardProps {
  currentUser: User;
  settings: AppSettings;
  classes: ClassRoom[];
  onNavigate: (menuKey: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  settings,
  classes,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Administrator Utama
              </span>
              <span className="text-xs text-slate-300">{settings.schoolName}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Dashboard Administrasi Sistem
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pusat kendali master data siswa, guru pengampu, struktur rombel kelas VII–IX, dan
              pengaturan tahun ajaran aplikasi PJOK SMART BOOK.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Status Platform</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Normal / Siap Pakai</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Admin Stat Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect padding="md" className="cursor-pointer" onClick={() => onNavigate('data_siswa')}>
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-500" />
            <Badge variant="blue" size="sm">
              Siswa
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Siswa Terdaftar</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">216</p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
            Lihat Semua Siswa &rarr;
          </p>
        </Card>

        <Card hoverEffect padding="md" className="cursor-pointer" onClick={() => onNavigate('data_guru')}>
          <div className="flex items-center justify-between mb-2">
            <GraduationCap className="w-6 h-6 text-emerald-500" />
            <Badge variant="emerald" size="sm">
              Pendidik
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Guru Pengampu PJOK</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">4</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Data Pendidik &rarr;
          </p>
        </Card>

        <Card hoverEffect padding="md" className="cursor-pointer" onClick={() => onNavigate('data_kelas')}>
          <div className="flex items-center justify-between mb-2">
            <Sliders className="w-6 h-6 text-amber-500" />
            <Badge variant="amber" size="sm">
              Rombel
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Struktur Rombel Kelas</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">19</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Kelas VII, VIII, IX &rarr;
          </p>
        </Card>

        <Card hoverEffect padding="md" className="cursor-pointer" onClick={() => onNavigate('pengaturan')}>
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 text-purple-500" />
            <Badge variant="purple" size="sm">
              Aktif
            </Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Tahun Pelajaran</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {settings.academicYear}
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
            {settings.activeSemester} &rarr;
          </p>
        </Card>
      </div>

      {/* 3. Class Structure Distribution at a Glance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Struktur Kelas SMP Negeri 2 Kutasari
            </h3>
            <p className="text-xs text-slate-500">
              Pembagian rombongan belajar aktif Tahun Pelajaran {settings.academicYear}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('data_kelas')}>
            Kelola Rombel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kelas VII */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                Kelas VII (6 Rombel)
              </span>
              <Badge variant="emerald" size="sm">
                Tingkat 1
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['VII-A', 'VII-B', 'VII-C', 'VII-D', 'VII-E', 'VII-F'].map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-800"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Kelas VIII */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-blue-900 dark:text-blue-200">
                Kelas VIII (7 Rombel)
              </span>
              <Badge variant="blue" size="sm">
                Tingkat 2
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['VIII-A', 'VIII-B', 'VIII-C', 'VIII-D', 'VIII-E', 'VIII-F', 'VIII-G'].map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-800"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Kelas IX */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-amber-900 dark:text-amber-200">
                Kelas IX (6 Rombel)
              </span>
              <Badge variant="amber" size="sm">
                Tingkat 3
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E', 'IX-F'].map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-800"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

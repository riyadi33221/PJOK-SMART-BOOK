import React from 'react';
import {
  UserCheck,
  GraduationCap,
  Shield,
  BookOpen,
  PlaySquare,
  CheckSquare,
  Award,
  Heart,
  Trophy,
  Activity,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserRole, AppSettings } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface LandingPageProps {
  settings: AppSettings;
  onOpenLogin: (role?: UserRole) => void;
  onFastLogin: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  settings,
  onOpenLogin,
  onFastLogin,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Bar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-600/30">
              🏃
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  PJOK SMART BOOK
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  SMPN 2 Kutasari
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Buku Belajar Digital, Aktivitas, Asesmen & Reward
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenLogin('ADMIN')}
              icon={<Shield className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex"
            >
              Admin
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenLogin('GURU')}
              icon={<GraduationCap className="w-4 h-4" />}
            >
              Login Guru
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenLogin('SISWA')}
              icon={<UserCheck className="w-4 h-4" />}
            >
              Login Siswa
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Text & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Platform Pembelajaran Digital PJOK SMP Terpadu</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                🏃 PJOK <span className="text-emerald-600 dark:text-emerald-400">SMART BOOK</span>
              </h2>
              <p className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200">
                “Belajar PJOK lebih aktif, interaktif, dan menyenangkan.”
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Solusi pembelajaran Pendidikan Jasmani, Olahraga, dan Kesehatan modern untuk siswa
                <strong> {settings.schoolName}</strong>. Terintegrasi dengan buku materi digital,
                video gerak, kuis interaktif, monitoring aktivitas, asesmen sikap, presensi, dan
                sistem reward poin/XP.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onFastLogin('SISWA')}
                icon={<UserCheck className="w-5 h-5" />}
                className="text-base font-bold shadow-lg shadow-emerald-600/30"
              >
                Masuk Siswa (Demo Ahmad)
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onFastLogin('GURU')}
                icon={<GraduationCap className="w-5 h-5" />}
                className="text-base font-bold shadow-lg shadow-blue-600/30"
              >
                Masuk Guru (Purwanto, S.Pd.)
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onFastLogin('ADMIN')}
                icon={<Shield className="w-5 h-5" />}
              >
                Admin
              </Button>
            </div>

            {/* Creator Badge info */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Created by:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {settings.creatorName}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Sekolah:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {settings.schoolName}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Kurikulum:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Merdeka / 2013 Terpadu
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sportive Preview Card / Athletic Board */}
          <div className="lg:col-span-5">
            <Card variant="athletic" className="relative p-6 sm:p-8 bg-white dark:bg-slate-900">
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Sistem Belajar Aktif
                  </span>
                </div>
                <Badge variant="gold" size="sm" icon={<Trophy className="w-3 h-3" />}>
                  Juara PJOK 2024
                </Badge>
              </div>

              {/* Athletic Track Highlights */}
              <div className="py-5 space-y-3.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Buku Belajar Digital
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      12 Bab materi PJOK lengkap untuk kelas VII, VIII, dan IX
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <PlaySquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Video Tutorial Gerak
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Visualisasi gerak spesifik passing, start sprint, senam lantai
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Reward, Poin & XP
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Lencana kebugaran jasmani & sertifikat digital prestasi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Asesmen Sikap & Presensi
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pemantauan sportivitas, disiplin, kerjasama, dan kehadiran
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  19 Rombel Kelas VII-A s.d IX-F
                </span>
                <button
                  onClick={() => onOpenLogin('SISWA')}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature Grid Summary */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Fondasi Ekosistem Pembelajaran PJOK
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Didesain khusus untuk meningkatkan kebugaran jasmani dan literasi gerak siswa SMP
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">Buku PJOK</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                E-book interaktif
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <PlaySquare className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">Video Gerak</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Panduan praktik
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">Kuis Online</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Evaluasi kognitif
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">Asesmen Sikap</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Sportif & disiplin
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">Presensi</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Rekap kehadiran
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">XP & Reward</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Lencana prestasi
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">
              {settings.appName}
            </span>
            <span>•</span>
            <span>{settings.schoolName}</span>
          </div>

          <div className="font-medium text-center">
            Created by: <span className="font-bold text-emerald-600 dark:text-emerald-400">{settings.creatorName}</span>
          </div>

          <div className="text-slate-400">
            Fondasi Aplikasi Tahap 1 • Prototype Web
          </div>
        </div>
      </footer>
    </div>
  );
};

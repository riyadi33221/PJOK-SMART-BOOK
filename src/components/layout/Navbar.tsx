import React from 'react';
import {
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Sparkles,
  Trophy,
  Menu,
} from 'lucide-react';
import { User, UserRole, AppSettings } from '../../types';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentUser: User | null;
  currentRole: UserRole;
  settings: AppSettings;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  settings,
  darkMode,
  onToggleDarkMode,
  onSwitchRole,
  onLogout,
  onOpenMobileSidebar,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 font-black text-xl tracking-tight">
              🏃
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">
                  PJOK SMART BOOK
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {settings.schoolName}
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right Info: Semester & Academic Year Badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            TP {settings.academicYear}
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {settings.activeSemester}
          </span>
        </div>

        {/* Right Actions: Role Switcher, Dark Mode, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher for seamless testing */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold transition-all cursor-pointer"
              title="Ganti Peran Pengguna (Demo Switcher)"
            >
              <span className="text-slate-400 hidden xs:inline">Mode:</span>
              <Badge
                variant={
                  currentRole === 'SISWA'
                    ? 'emerald'
                    : currentRole === 'GURU'
                    ? 'blue'
                    : 'amber'
                }
                size="sm"
              >
                {currentRole}
              </Badge>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs animate-in fade-in"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Pilih Role Demonstrasi
                </div>
                <button
                  onClick={() => onSwitchRole('SISWA')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 font-medium ${
                    currentRole === 'SISWA' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
                  }`}
                >
                  <span>Siswa (Ahmad, VII-A)</span>
                  {currentRole === 'SISWA' && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
                </button>
                <button
                  onClick={() => onSwitchRole('GURU')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 font-medium ${
                    currentRole === 'GURU' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  <span>Guru (Purwanto, S.Pd.)</span>
                  {currentRole === 'GURU' && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                </button>
                <button
                  onClick={() => onSwitchRole('ADMIN')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 font-medium ${
                    currentRole === 'ADMIN' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
                  }`}
                >
                  <span>Admin Sekolah</span>
                  {currentRole === 'ADMIN' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Student XP Pill (if SISWA) */}
          {currentRole === 'SISWA' && currentUser?.xp && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentUser.xp} XP</span>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Beralih ke Terang' : 'Beralih ke Gelap'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentUser?.name.charAt(0) || 'U'
                )}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || 'Pengguna'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {currentRole === 'SISWA'
                    ? `Kelas ${currentUser?.kelas || 'VII-A'}`
                    : currentRole === 'GURU'
                    ? 'Guru PJOK'
                    : 'Administrator'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Keluar / Ke Halaman Awal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

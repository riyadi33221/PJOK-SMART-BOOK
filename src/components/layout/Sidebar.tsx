import React from 'react';
import {
  LayoutDashboard,
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
  User,
  Users,
  Settings,
  ShieldAlert,
  FileText,
  Sliders,
  GraduationCap,
  X,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentRole: UserRole;
  activeMenu: string;
  onSelectMenu: (menuKey: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeMenu,
  onSelectMenu,
  isMobileOpen,
  onCloseMobile,
}) => {
  // Student menus
  const studentMenus = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'buku', label: '📚 Buku PJOK Digital', icon: <BookOpen className="w-4 h-4" />, badge: 'Interaktif' },
    { key: 'video', label: 'Video', icon: <PlaySquare className="w-4 h-4" /> },
    { key: 'aktivitas', label: 'Aktivitas', icon: <Activity className="w-4 h-4" /> },
    { key: 'kuis', label: '📝 Kuis & Latihan', icon: <CheckSquare className="w-4 h-4" />, badge: 'Interaktif' },
    { key: 'cbt', label: '🎯 Uji Kompetensi', icon: <FileCheck2 className="w-4 h-4" /> },
    { key: 'tugas', label: '📋 Tugas Mandiri', icon: <FileText className="w-4 h-4" /> },
    { key: 'sikap', label: 'Sikap', icon: <Heart className="w-4 h-4" /> },
    { key: 'kehadiran', label: 'Kehadiran', icon: <CalendarCheck className="w-4 h-4" />, badge: '95%' },
    { key: 'nilai', label: 'Nilai', icon: <Award className="w-4 h-4" />, badge: '87' },
    { key: 'progres', label: 'Progres', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'reward', label: 'Reward', icon: <Gift className="w-4 h-4" />, badge: '450 XP' },
    { key: 'pengumuman', label: 'Pengumuman', icon: <Bell className="w-4 h-4" />, badge: 'Baru' },
    { key: 'profil', label: 'Profil', icon: <User className="w-4 h-4" /> },
  ];

  // Teacher menus
  const teacherMenus = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'data_siswa', label: 'Data Siswa', icon: <Users className="w-4 h-4" />, badge: '216' },
    { key: 'buku', label: '📚 Kelola Buku PJOK', icon: <BookOpen className="w-4 h-4" />, badge: 'AI Transformer' },
    { key: 'materi', label: 'Materi', icon: <FileText className="w-4 h-4" />, badge: '24' },
    { key: 'video', label: 'Video', icon: <PlaySquare className="w-4 h-4" /> },
    { key: 'kuis', label: '📝 Kuis & Latihan', icon: <CheckSquare className="w-4 h-4" />, badge: 'AI Gen' },
    { key: 'cbt', label: '🎯 Uji Kompetensi', icon: <FileCheck2 className="w-4 h-4" />, badge: 'Tautan CBT' },
    { key: 'tugas', label: '📋 Kelola Tugas', icon: <FileText className="w-4 h-4" />, badge: 'Rubrik' },
    { key: 'sikap', label: 'Asesmen Sikap', icon: <Heart className="w-4 h-4" /> },
    { key: 'kehadiran', label: 'Kehadiran', icon: <CalendarCheck className="w-4 h-4" />, badge: '94%' },
    { key: 'nilai', label: 'Nilai', icon: <Award className="w-4 h-4" /> },
    { key: 'monitoring', label: 'Monitoring', icon: <Activity className="w-4 h-4" />, badge: '182 Aktif' },
    { key: 'reward', label: 'Reward', icon: <Gift className="w-4 h-4" /> },
    { key: 'pengumuman', label: 'Pengumuman', icon: <Bell className="w-4 h-4" /> },
    { key: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  // Admin menus
  const adminMenus = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'data_siswa', label: 'Data Siswa', icon: <Users className="w-4 h-4" />, badge: '216' },
    { key: 'data_guru', label: 'Data Guru', icon: <GraduationCap className="w-4 h-4" />, badge: '4' },
    { key: 'data_kelas', label: 'Data Kelas', icon: <Sliders className="w-4 h-4" />, badge: '19 Rombel' },
    { key: 'user_mgmt', label: 'User Management', icon: <ShieldAlert className="w-4 h-4" /> },
    { key: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentMenus =
    currentRole === 'SISWA'
      ? studentMenus
      : currentRole === 'GURU'
      ? teacherMenus
      : adminMenus;

  const content = (
    <div className="flex flex-col h-full">
      {/* Mobile Drawer Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏃</span>
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
            PJOK SMART BOOK
          </span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Indicator Banner inside Sidebar */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <div className="truncate">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Portal {currentRole}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {currentRole === 'SISWA' ? 'Kelas VII-A • Gasal' : 'SMPN 2 Kutasari'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {currentMenus.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                onSelectMenu(item.key);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info in sidebar */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
        <p className="font-semibold text-slate-600 dark:text-slate-300">PJOK Smart Book</p>
        <p className="truncate">Created by Purwanto, S.Pd.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

import React from 'react';
import { LayoutDashboard, BookOpen, CheckSquare, Gift, Users, FileText, Award, Menu } from 'lucide-react';
import { UserRole } from '../../types';

interface MobileNavProps {
  currentRole: UserRole;
  activeMenu: string;
  onSelectMenu: (menuKey: string) => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentRole,
  activeMenu,
  onSelectMenu,
  onOpenMore,
}) => {
  const getNavItems = () => {
    if (currentRole === 'SISWA') {
      return [
        { key: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
        { key: 'buku', label: 'Buku', icon: <BookOpen className="w-5 h-5" /> },
        { key: 'kuis', label: 'Kuis', icon: <CheckSquare className="w-5 h-5" /> },
        { key: 'reward', label: 'Reward', icon: <Gift className="w-5 h-5" /> },
      ];
    } else if (currentRole === 'GURU') {
      return [
        { key: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
        { key: 'data_siswa', label: 'Siswa', icon: <Users className="w-5 h-5" /> },
        { key: 'materi', label: 'Materi', icon: <FileText className="w-5 h-5" /> },
        { key: 'nilai', label: 'Nilai', icon: <Award className="w-5 h-5" /> },
      ];
    } else {
      return [
        { key: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
        { key: 'data_siswa', label: 'Siswa', icon: <Users className="w-5 h-5" /> },
        { key: 'data_guru', label: 'Guru', icon: <Award className="w-5 h-5" /> },
        { key: 'data_kelas', label: 'Kelas', icon: <BookOpen className="w-5 h-5" /> },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = activeMenu === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelectMenu(item.key)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-transform ${
                isActive ? 'bg-emerald-50 dark:bg-emerald-950/60 scale-110' : ''
              }`}
            >
              {item.icon}
            </div>
            <span className="mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* "Lainnya" button to open drawer */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <div className="p-1 rounded-xl">
          <Menu className="w-5 h-5" />
        </div>
        <span className="mt-0.5">Menu</span>
      </button>
    </div>
  );
};

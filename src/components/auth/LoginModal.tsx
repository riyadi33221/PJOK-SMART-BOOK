import React, { useState } from 'react';
import {
  Shield,
  GraduationCap,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Database,
  Globe,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (role: UserRole, username?: string) => void;
  defaultRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'SISWA',
}) => {
  const { loginWithGoogle, loginWithSchoolAccount, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [identifier, setIdentifier] = useState(
    defaultRole === 'SISWA'
      ? '0098471203'
      : defaultRole === 'GURU'
      ? '19780512 200501 1 008'
      : 'admin@smpn2kutasari.sch.id'
  );
  const [password, setPassword] = useState('******');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'SISWA') {
      setIdentifier('0098471203');
    } else if (role === 'GURU') {
      setIdentifier('19780512 200501 1 008');
    } else {
      setIdentifier('admin@smpn2kutasari.sch.id');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithSchoolAccount(selectedRole, identifier, password);
      onClose();
    } catch (err) {
      setErrorMessage('Gagal masuk. Silakan periksa kredensial Anda.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setErrorMessage(
        err.message?.includes('popup')
          ? 'Popup login ditutup atau diblokir. Silakan coba lagi atau gunakan login akun sekolah.'
          : 'Login Google gagal. Anda dapat menggunakan akun sekolah terdaftar.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFastDemo = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Masuk ke Portal PJOK"
      subtitle="Pilih peran Anda untuk mengakses sistem pembelajaran digital terintegrasi Cloud Firestore"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Firebase Live Cloud Status Indicator */}
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
            <Database className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Firebase Authentication & Cloud Firestore Aktif</span>
          </div>
          <Badge variant="emerald" size="sm">
            Tersambung
          </Badge>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => handleRoleChange('SISWA')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'SISWA'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-1" />
            <span>Siswa</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('GURU')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'GURU'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 mb-1" />
            <span>Guru PJOK</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('ADMIN')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRole === 'ADMIN'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 mb-1" />
            <span>Admin</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Globe className="w-4 h-4 text-blue-500" />
          <span>
            {isGoogleLoading
              ? 'Menghubungkan ke Google...'
              : 'Masuk dengan Akun Google (Firebase Auth)'}
          </span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span>atau gunakan akun sekolah</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {selectedRole === 'SISWA'
                ? 'NISN / Nama Siswa'
                : selectedRole === 'GURU'
                ? 'NIP / Email Guru'
                : 'Username / Email Admin'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Keamanan: Kata sandi terenkripsi & tidak ditampilkan secara publik
            </p>
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              variant={
                selectedRole === 'SISWA'
                  ? 'primary'
                  : selectedRole === 'GURU'
                  ? 'secondary'
                  : 'amber'
              }
              className="w-full"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Masuk sebagai {selectedRole}
            </Button>
          </div>
        </form>

        {/* 1-Click Fast Test Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">
            Peralihan Akun Cepat untuk Pengujian Role:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <Badge
              variant="emerald"
              size="sm"
              className="cursor-pointer hover:opacity-80 active:scale-95 transition-transform"
              onClick={() => handleFastDemo('SISWA')}
            >
              1-Klik: Siswa Ahmad
            </Badge>
            <Badge
              variant="blue"
              size="sm"
              className="cursor-pointer hover:opacity-80 active:scale-95 transition-transform"
              onClick={() => handleFastDemo('GURU')}
            >
              1-Klik: Guru Purwanto
            </Badge>
            <Badge
              variant="amber"
              size="sm"
              className="cursor-pointer hover:opacity-80 active:scale-95 transition-transform"
              onClick={() => handleFastDemo('ADMIN')}
            >
              1-Klik: Admin Sekolah
            </Badge>
          </div>
        </div>
      </div>
    </Modal>
  );
};

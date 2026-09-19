import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Lightbulb,
  HelpCircle,
  PlaySquare,
  FileText,
  Share2,
  Type,
  ZoomIn,
  ZoomOut,
  X,
  Menu,
  Sparkles,
  Award,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DigitalBookItem, StudentBookProgress } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface DigitalBookReaderProps {
  book: DigitalBookItem;
  studentId?: string;
  initialProgress?: StudentBookProgress;
  onClose: () => void;
  onToggleBookmark?: (bookId: string, currentStatus: boolean) => Promise<boolean>;
  onMarkCompleted?: (bookId: string) => Promise<void>;
  onMarkStarted?: (bookId: string) => Promise<void>;
  isPreviewMode?: boolean;
}

export const DigitalBookReader: React.FC<DigitalBookReaderProps> = ({
  book,
  studentId,
  initialProgress,
  onClose,
  onToggleBookmark,
  onMarkCompleted,
  onMarkStarted,
  isPreviewMode = false,
}) => {
  // Navigation active tab / section
  const [activeTab, setActiveTab] = useState<string>('cover');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    initialProgress?.isBookmarked || false
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    initialProgress?.status === 'Selesai'
  );
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  // Comprehension question interaction state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Student reflection note
  const [reflectionText, setReflectionText] = useState<string>(
    initialProgress?.reflectionAnswer || ''
  );
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  // Mark started when opened
  useEffect(() => {
    if (studentId && onMarkStarted && !isPreviewMode) {
      onMarkStarted(book.id);
    }
  }, [book.id, studentId, onMarkStarted, isPreviewMode]);

  // Handle bookmark
  const handleBookmarkToggle = async () => {
    if (onToggleBookmark) {
      const updated = await onToggleBookmark(book.id, isBookmarked);
      setIsBookmarked(updated);
    } else {
      setIsBookmarked(!isBookmarked);
    }
  };

  // Handle mark completed
  const handleCompleteToggle = async () => {
    if (onMarkCompleted) {
      await onMarkCompleted(book.id);
      setIsCompleted(true);
    } else {
      setIsCompleted(true);
    }
  };

  const navItems = [
    { key: 'cover', label: '📖 Cover & Pengantar', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'ringkasan', label: '💡 Ringkasan & Poin Penting', icon: <Lightbulb className="w-4 h-4" /> },
    { key: 'keselamatan', label: '⚠️ Keselamatan (SOP)', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'teknik', label: '🏃 Langkah Teknik Gerak', icon: <Activity className="w-4 h-4" /> },
    ...(book.content.infographics ? [{ key: 'infografis', label: '📊 Infografis & Data', icon: <Flame className="w-4 h-4" /> }] : []),
    { key: 'materi', label: '📚 Chapter & Materi Lengkap', icon: <FileText className="w-4 h-4" /> },
    ...(book.content.videos?.length ? [{ key: 'video', label: '🎥 Video Pembelajaran', icon: <PlaySquare className="w-4 h-4" /> }] : []),
    { key: 'glosarium', label: '📖 Glosarium Istilah', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'tahukah_kamu', label: '💡 Tahukah Kamu?', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'refleksi', label: '💭 Refleksi Siswa', icon: <HelpCircle className="w-4 h-4" /> },
    { key: 'pemahaman', label: '❓ Pertanyaan Pemahaman', icon: <Award className="w-4 h-4" /> },
  ];

  const currentNavIndex = navItems.findIndex((item) => item.key === activeTab);

  const handleNext = () => {
    if (currentNavIndex < navItems.length - 1) {
      setActiveTab(navItems[currentNavIndex + 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentNavIndex > 0) {
      setActiveTab(navItems[currentNavIndex - 1].key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fontClass =
    fontSize === 'normal'
      ? 'text-sm sm:text-base leading-relaxed'
      : fontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : 'text-lg sm:text-xl leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3 truncate">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Bab {book.chapter}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Kelas {book.targetGrade} • {book.semester}
              </span>
              {isPreviewMode && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Guru Preview
                </span>
              )}
            </div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {book.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                fontSize === 'normal'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 text-sm font-bold rounded-lg transition-colors ${
                fontSize === 'large'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 text-base font-bold rounded-lg transition-colors ${
                fontSize === 'xlarge'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              A++
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/30'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Hapus Bookmark' : 'Tandai Halaman Ini (Bookmark)'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Tandai Sudah Dipelajari */}
          <Button
            variant={isCompleted ? 'primary' : 'outline'}
            size="sm"
            onClick={handleCompleteToggle}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            {isCompleted ? 'Sudah Dipelajari' : 'Tandai Selesai'}
          </Button>

          {/* Mobile TOC Drawer Toggle */}
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Reader Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents - Left Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
            isTocOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
              Daftar Isi Buku
            </span>
            <button
              onClick={() => setIsTocOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsTocOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Progress Mini Widget in Sidebar */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-slate-500">Status Belajar:</span>
              <span
                className={
                  isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    : 'text-blue-600 dark:text-blue-400 font-extrabold'
                }
              >
                {isCompleted ? '🟢 Selesai' : '🔵 Sedang Dipelajari'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estimasi: {book.readDurationMin} menit • {book.readPages} halaman
            </p>
          </div>
        </aside>

        {/* Central Reading Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex justify-center">
          <div className="max-w-3xl w-full space-y-8">
            {/* 1. COVER PAGE */}
            {activeTab === 'cover' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Book Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white p-6 sm:p-10 shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <BookOpen className="w-64 h-64" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider">
                        {book.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
                        Bab {book.chapter}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-xs">
                        Kelas {book.targetGrade} • {book.semester}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                      {book.content.cover.title}
                    </h1>

                    {book.content.cover.subtitle && (
                      <p className="text-sm sm:text-lg text-emerald-100 font-medium leading-relaxed">
                        {book.content.cover.subtitle}
                      </p>
                    )}

                    <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-emerald-100">
                      <div>
                        <p className="font-bold text-white text-sm">
                          {book.content.cover.schoolName}
                        </p>
                        <p className="text-emerald-200">
                          Guru Penyusun: {book.content.cover.author}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs font-bold text-white">
                          ⏱️ {book.readDurationMin} Menit Baca
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs font-bold text-white">
                          📄 {book.readPages} Halaman
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tujuan Pembelajaran Card */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
                      🎯
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Tujuan Pembelajaran (Fase D)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Capaian kompetensi yang diharapkan setelah menuntaskan bab ini
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {book.content.cover.learningObjectives.map((obj, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className={`text-slate-700 dark:text-slate-300 ${fontClass}`}>
                          {obj}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Start Button */}
                <div className="flex justify-center pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setActiveTab('ringkasan')}
                    icon={<ChevronRight className="w-5 h-5" />}
                  >
                    Mulai Belajar Bab Ini
                  </Button>
                </div>
              </div>
            )}

            {/* 2. RINGKASAN & POIN PENTING */}
            {activeTab === 'ringkasan' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
                      💡
                    </div>
                    <div>
                      <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                        Ringkasan Inti Materi
                      </h2>
                      <p className="text-xs text-slate-400">
                        Peta konsep dan ringkasan substansi pokok
                      </p>
                    </div>
                  </div>

                  <p className={`text-slate-700 dark:text-slate-300 leading-relaxed ${fontClass}`}>
                    {book.content.summary}
                  </p>
                </div>

                {/* Poin Penting Cards */}
                <div className="space-y-3">
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-emerald-500">✨</span>
                    <span>Poin-Poin Penting untuk Diingat:</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {book.content.keyPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </div>
                        <p className={`font-semibold text-emerald-950 dark:text-emerald-200 ${fontClass}`}>
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. TIPS KESELAMATAN (⚠️ SOP) */}
            {activeTab === 'keselamatan' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-black text-amber-900 dark:text-amber-300">
                      Standard Operasional Prosedur (SOP) Keselamatan PJOK
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-400 mt-1">
                      Pencegahan cedera dan perlindungan diri adalah prioritas nomor 1 sebelum mempraktikkan keterampilan olahraga apa pun.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {book.content.safetyTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-3xl border ${
                        tip.severity === 'high'
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                          : tip.severity === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                          : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            tip.severity === 'high'
                              ? 'bg-rose-500 text-white'
                              : tip.severity === 'medium'
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {tip.severity === 'high' ? 'Kritis' : tip.severity === 'medium' ? 'Penting' : 'Perhatian'}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {tip.title}
                        </h4>
                      </div>
                      <p className={`text-slate-700 dark:text-slate-300 ${fontClass}`}>
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LANGKAH TEKNIK GERAK (🏃) */}
            {activeTab === 'teknik' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-500" />
                    <span>Langkah-Langkah Teknik Gerak Biomekanik</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Pelajari urutan gerak secara metodis dari sikap awalan, pelaksanaan, hingga sikap akhir.
                  </p>
                </div>

                <div className="space-y-6">
                  {book.content.techniques.map((tech) => (
                    <div
                      key={tech.stepNumber}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shrink-0">
                          {tech.stepNumber}
                        </span>
                        <div>
                          <h3 className="font-black text-lg text-slate-900 dark:text-white">
                            {tech.title}
                          </h3>
                          <p className="text-xs text-slate-500">{tech.description}</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Kunci Gerakan:
                        </p>
                        <ul className="space-y-2">
                          {tech.keyPoints.map((kp, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2 text-slate-700 dark:text-slate-300 ${fontClass}`}
                            >
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {tech.commonMistakes && tech.commonMistakes.length > 0 && (
                        <div className="mt-4 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1 text-xs">
                          <p className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                            <span>⚠️ Kesalahan yang Sering Terjadi:</span>
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                            {tech.commonMistakes.map((mistake, i) => (
                              <li key={i}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. INFOGRAFIS & DATA (📊) */}
            {activeTab === 'infografis' && book.content.infographics && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Flame className="w-6 h-6 text-amber-500" />
                      <span>{book.content.infographics.title}</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Rangkuman visual berbasis proporsi dan data biomekanika olahraga
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {book.content.infographics.data.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
                      >
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          {item.label}
                        </span>
                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          {item.value}
                        </div>
                        {item.desc && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. MATERI LENGKAP / CHAPTERS (📚) */}
            {activeTab === 'materi' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {book.content.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {sec.title}
                    </h3>
                    <p className={`text-slate-700 dark:text-slate-300 ${fontClass}`}>
                      {sec.content}
                    </p>

                    {sec.subsections && (
                      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {sec.subsections.map((sub, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2"
                          >
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {sub.title}
                            </h4>
                            <p className={`text-slate-600 dark:text-slate-300 ${fontClass}`}>
                              {sub.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 7. VIDEO PEMBELAJARAN (🎥) */}
            {activeTab === 'video' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <PlaySquare className="w-6 h-6 text-blue-500" />
                    <span>Video Tutorial Pembelajaran Terintegrasi</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Tonton gerakan gerak spesifik secara nyata untuk memperjelas visualisasi teknik
                  </p>
                </div>

                {book.content.videos?.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-6"
                  >
                    <div className="aspect-video w-full rounded-2xl bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                      {vid.videoUrl.includes('youtube.com') || vid.videoUrl.includes('youtu.be') ? (
                        <iframe
                          className="w-full h-full rounded-2xl"
                          src={vid.videoUrl.replace('watch?v=', 'embed/')}
                          title={vid.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                          <PlaySquare className="w-16 h-16 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <p className="font-bold text-base">{vid.title}</p>
                          <a
                            href={vid.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            Buka Tautan Video Eksternal
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {vid.title}
                      </h4>
                      {vid.description && (
                        <p className="text-xs text-slate-500 mt-1">{vid.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. GLOSARIUM (📖) */}
            {activeTab === 'glosarium' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <span>Glosarium Istilah Penting PJOK</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {book.content.glossary.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                      >
                        <h4 className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                          {item.term}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 9. TAHUKAH KAMU? (💡) */}
            {activeTab === 'tahukah_kamu' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4">
                  {book.content.didYouKnow.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/20 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          Tahukah Kamu? {item.category && `• ${item.category}`}
                        </span>
                      </div>
                      <p className={`font-semibold text-slate-800 dark:text-slate-100 ${fontClass}`}>
                        "{item.fact}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. REFLEKSI SISWA (💭) */}
            {activeTab === 'refleksi' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-black">
                      💭
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        Refleksi Diri Siswa
                      </h2>
                      <p className="text-xs text-slate-400">
                        Evaluasi pemahaman dan komitmen disiplin berolahraga
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {book.content.reflection.prompt}
                  </p>

                  <ul className="space-y-2 list-disc list-inside text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
                    {book.content.reflection.guidelines.map((guide, i) => (
                      <li key={i}>{guide}</li>
                    ))}
                  </ul>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                      Tuliskan tanggapan dan refleksi belajarmu di bawah ini:
                    </label>
                    <textarea
                      rows={5}
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Tuliskan pengalamanmu, kesulitan yang kamu atasi, dan pesan positif untuk dirimu..."
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {reflectionSaved ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Refleksi tersimpan!
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Catatan refleksi akan tersimpan di portofolio belajarmu
                      </span>
                    )}

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setReflectionSaved(true);
                        setTimeout(() => setReflectionSaved(false), 3000);
                      }}
                    >
                      Simpan Refleksi
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 11. PERTANYAAN PEMAHAMAN (❓) */}
            {activeTab === 'pemahaman' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-emerald-500" />
                    <span>Uji Pemahaman Mandiri Bab Ini</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Jawab pertanyaan pemahaman berikut untuk menguji pemahaman konsep biomekanika dan keselamatan.
                  </p>
                </div>

                <div className="space-y-4">
                  {book.content.comprehensionQuestions.map((q, qIndex) => {
                    const selected = selectedAnswers[q.id];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === q.correctAnswerIndex;
                    const showExp = showExplanation[q.id];

                    return (
                      <div
                        key={q.id}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-extrabold text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                            {qIndex + 1}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {q.question}
                          </h4>
                        </div>

                        <div className="space-y-2 pt-1">
                          {q.options.map((opt, optIndex) => {
                            const isThisOptionSelected = selected === optIndex;
                            let btnStyle =
                              'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-emerald-500';

                            if (isAnswered) {
                              if (optIndex === q.correctAnswerIndex) {
                                btnStyle =
                                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                              } else if (isThisOptionSelected && !isCorrect) {
                                btnStyle =
                                  'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                              }
                            }

                            return (
                              <button
                                key={optIndex}
                                onClick={() => {
                                  setSelectedAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: optIndex,
                                  }));
                                  setShowExplanation((prev) => ({
                                    ...prev,
                                    [q.id]: true,
                                  }));
                                }}
                                className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && optIndex === q.correctAnswerIndex && (
                                  <span className="text-emerald-600 font-black">✓ Benar</span>
                                )}
                                {isAnswered && isThisOptionSelected && !isCorrect && (
                                  <span className="text-rose-600 font-black">✗ Salah</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {showExp && (
                          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 animate-in fade-in duration-150">
                            <span className="font-bold block mb-1">💡 Penjelasan:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mark Finished CTA */}
                <div className="p-6 rounded-3xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black">Hebat! Kamu telah menuntaskan Bab ini</h3>
                    <p className="text-xs text-emerald-100">
                      Klik tombol untuk mencatat penyelesaian dan menambahkan progres belajar PJOK
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleCompleteToggle}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  >
                    {isCompleted ? 'Sudah Ditandai Selesai' : 'Tandai Selesai Belajar'}
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Stepper: Previous / Next Navigation */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrev}
                disabled={currentNavIndex === 0}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Sebelumnya
              </Button>

              <span className="text-xs font-bold text-slate-400">
                Bagian {currentNavIndex + 1} dari {navItems.length}
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={currentNavIndex === navItems.length - 1}
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Flame,
  ArrowRight,
  PlaySquare,
  Sparkles,
  AlertCircle,
  Award,
} from 'lucide-react';
import { DigitalBookItem, StudentBookProgress } from '../../types';
import {
  getDigitalBooks,
  getStudentBookProgressList,
  toggleBookBookmark,
  markBookAsCompleted,
  markBookAsStarted,
} from '../../services/firestoreService';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DigitalBookReader } from './DigitalBookReader';

interface StudentBookListProps {
  studentId: string;
  studentName?: string;
  studentGrade?: 'VII' | 'VIII' | 'IX';
}

export const StudentBookList: React.FC<StudentBookListProps> = ({
  studentId,
  studentName = 'Siswa PJOK',
  studentGrade = 'VII',
}) => {
  const [books, setBooks] = useState<DigitalBookItem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentBookProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedGrade, setSelectedGrade] = useState<string>(studentGrade || 'VII');
  const [selectedSemester, setSelectedSemester] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'Belum' | 'Sedang' | 'Selesai' | 'Bookmark'>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Reader
  const [activeReadingBook, setActiveReadingBook] = useState<DigitalBookItem | null>(null);

  // Load books and progress
  const loadData = async () => {
    setLoading(true);
    try {
      const [allBooks, progressData] = await Promise.all([
        getDigitalBooks({ onlyPublished: true }),
        getStudentBookProgressList(studentId),
      ]);
      setBooks(allBooks);
      setProgressMap(progressData);
    } catch (err) {
      console.error('Error loading student books data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  // Handle bookmark
  const handleToggleBookmark = async (bookId: string, currentStatus: boolean): Promise<boolean> => {
    const updated = await toggleBookBookmark(studentId, bookId, currentStatus);
    setProgressMap((prev) => ({
      ...prev,
      [bookId]: {
        ...(prev[bookId] || { studentId, bookId }),
        id: `${studentId}_${bookId}`,
        status: prev[bookId]?.status || 'Sedang Dipelajari',
        isBookmarked: updated,
      },
    }));
    return updated;
  };

  // Handle mark completed
  const handleMarkCompleted = async (bookId: string): Promise<void> => {
    await markBookAsCompleted(studentId, bookId);
    setProgressMap((prev) => ({
      ...prev,
      [bookId]: {
        ...(prev[bookId] || { studentId, bookId }),
        id: `${studentId}_${bookId}`,
        status: 'Selesai',
        isBookmarked: false,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  // Handle mark started
  const handleMarkStarted = async (bookId: string): Promise<void> => {
    if (progressMap[bookId]?.status !== 'Selesai') {
      await markBookAsStarted(studentId, bookId);
      setProgressMap((prev) => ({
        ...prev,
        [bookId]: {
          ...(prev[bookId] || { studentId, bookId }),
          id: `${studentId}_${bookId}`,
          status: 'Sedang Dipelajari',
          lastOpenedAt: new Date().toISOString(),
        },
      }));
    }
  };

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const prog = progressMap[book.id];
    const status = prog?.status || 'Belum Dipelajari';
    const isBookmarked = prog?.isBookmarked || false;

    // Filter Grade
    if (selectedGrade !== 'Semua' && book.targetGrade !== selectedGrade) {
      return false;
    }

    // Filter Semester
    if (selectedSemester !== 'Semua' && book.semester !== selectedSemester) {
      return false;
    }

    // Filter Status
    if (selectedStatus === 'Belum' && status !== 'Belum Dipelajari') {
      return false;
    }
    if (selectedStatus === 'Sedang' && status !== 'Sedang Dipelajari') {
      return false;
    }
    if (selectedStatus === 'Selesai' && status !== 'Selesai') {
      return false;
    }
    if (selectedStatus === 'Bookmark' && !isBookmarked) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchTopic = book.topic.toLowerCase().includes(q);
      const matchCategory = book.category.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchCategory) return false;
    }

    return true;
  });

  // Calculate Overall Progress
  const totalBooksCount = books.filter((b) => selectedGrade === 'Semua' || b.targetGrade === selectedGrade).length;
  const completedBooksCount = books.filter((b) => {
    if (selectedGrade !== 'Semua' && b.targetGrade !== selectedGrade) return false;
    return progressMap[b.id]?.status === 'Selesai';
  }).length;
  const overallPercentage = totalBooksCount > 0 ? Math.round((completedBooksCount / totalBooksCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Student Progress Overview Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase">
                Buku PJOK Digital
              </span>
              <span className="text-xs text-emerald-200">
                Kelas {studentGrade} • SMP Negeri 2 Kutasari
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Halo, {studentName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Tingkatkan wawasan gerak olahraga, pahami SOP keselamatan sebelum praktik lapangan, dan selesaikan bab belajar mandirimu!
            </p>
          </div>

          {/* Progress Circle & Stat */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 shrink-0">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {completedBooksCount} / {totalBooksCount}
              </span>
              <p className="text-[11px] text-emerald-200 uppercase font-bold">
                Bab Selesai
              </p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                {overallPercentage}%
              </span>
              <p className="text-[11px] text-emerald-200 uppercase font-bold">
                Capaian
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-black/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-300 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari materi PJOK, teknik, bab, atau cabang olahraga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Grade & Semester Selectors */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="VII">Kelas VII</option>
              <option value="VIII">Kelas VIII</option>
              <option value="IX">Kelas IX</option>
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="Semua">Semua Semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>
        </div>

        {/* Status Chips Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status Belajar:
          </span>

          {[
            { key: 'Semua', label: 'Semua' },
            { key: 'Belum', label: '⚪ Belum Dipelajari' },
            { key: 'Sedang', label: '🔵 Sedang Dipelajari' },
            { key: 'Selesai', label: '🟢 Selesai' },
            { key: 'Bookmark', label: '🔖 Ditandai (Bookmark)' },
          ].map((item) => {
            const isActive = selectedStatus === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSelectedStatus(item.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold">Memuat modul Buku PJOK Digital...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-200">
            Tidak Ada Materi PJOK yang Sesuai Filter
          </h3>
          <p className="text-xs text-slate-400">
            Coba ubah kata kunci pencarian atau ganti filter status belajar di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const progress = progressMap[book.id];
            const status = progress?.status || 'Belum Dipelajari';
            const isBookmarked = progress?.isBookmarked || false;

            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all hover:border-emerald-500/40 relative group"
              >
                <div>
                  {/* Top Bar: Chapter, Status & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                      Bab {book.chapter} • {book.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : status === 'Sedang Dipelajari'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {status === 'Selesai'
                          ? '🟢 Selesai'
                          : status === 'Sedang Dipelajari'
                          ? '🔵 Sedang Dipelajari'
                          : '⚪ Belum Dipelajari'}
                      </span>

                      {/* Bookmark Icon Button */}
                      <button
                        onClick={() => handleToggleBookmark(book.id, isBookmarked)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={isBookmarked ? 'Ditandai Bookmark' : 'Tandai Buku'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Topic */}
                  <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {book.topic}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {book.description || book.content.summary}
                  </p>

                  {/* Highlights Bar */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{book.readDurationMin} Menit</span>
                    </span>
                    <span>•</span>
                    <span>{book.readPages} Halaman</span>
                    {book.content.videos?.length ? (
                      <>
                        <span>•</span>
                        <span className="text-blue-500 font-bold flex items-center gap-1">
                          <PlaySquare className="w-3 h-3" /> Ada Video
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant={status === 'Selesai' ? 'outline' : 'primary'}
                    size="md"
                    className="w-full justify-between"
                    onClick={() => setActiveReadingBook(book)}
                  >
                    <span>
                      {status === 'Selesai'
                        ? 'Baca Ulang Materi'
                        : status === 'Sedang Dipelajari'
                        ? 'Lanjutkan Membaca'
                        : 'Mulai Pelajari Bab Ini'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Interactive Digital Book Reader */}
      {activeReadingBook && (
        <DigitalBookReader
          book={activeReadingBook}
          studentId={studentId}
          initialProgress={progressMap[activeReadingBook.id]}
          onClose={() => {
            setActiveReadingBook(null);
            loadData();
          }}
          onToggleBookmark={handleToggleBookmark}
          onMarkCompleted={handleMarkCompleted}
          onMarkStarted={handleMarkStarted}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  Users,
  Image as ImageIcon,
  HelpCircle,
  Check,
  X,
  RefreshCw,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import {
  QuizItem,
  QuizQuestionItem,
  QuizOptionItem,
  QuizAttempt,
  ClassRoom,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  getQuizzes,
  saveQuiz,
  deleteQuiz,
  getQuizAttempts,
} from '../../services/firestoreService';
import {
  generateAiQuizQuestions,
  GenerateAiQuizParams,
} from '../../services/aiService';

interface QuizManagerProps {
  teacherName?: string;
  teacherId?: string;
  classes?: ClassRoom[];
}

export const QuizManager: React.FC<QuizManagerProps> = ({
  teacherName = 'Purwanto, S.Pd.',
  teacherId = 'guru-001',
  classes = [],
}) => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<'Semua' | 'VII' | 'VIII' | 'IX'>('Semua');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'PUBLISHED' | 'DRAFT'>('Semua');

  // Modals & Active State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiParams, setAiParams] = useState<GenerateAiQuizParams>({
    topic: 'Sepak Bola: Gerak Spesifik Passing & Dribbling',
    targetGrade: 'VII',
    semester: 'Semester 1',
    questionsCount: 5,
    difficulty: 'Sedang',
    questionType: 'campuran',
  });

  // Edit / Create Quiz Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);

  // Student Results Modal
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState<QuizItem | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // Preview Quiz Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState<QuizItem | null>(null);

  // Question editing sub-state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAiModal = () => {
    setAiParams({
      topic: 'Sepak Bola: Gerak Spesifik Passing & Dribbling',
      targetGrade: 'VII',
      semester: 'Semester 1',
      questionsCount: 5,
      difficulty: 'Sedang',
      questionType: 'campuran',
    });
    setShowAiModal(true);
  };

  const handleRunAiGeneration = async () => {
    setAiGenerating(true);
    try {
      const generatedQuestions = await generateAiQuizQuestions(aiParams);

      const newDraftQuiz: QuizItem = {
        id: `quiz-ai-${Date.now()}`,
        title: `Kuis: ${aiParams.topic}`,
        topic: aiParams.topic,
        targetGrade: (aiParams.targetGrade === 'Semua' ? 'VII' : aiParams.targetGrade) as 'VII' | 'VIII' | 'IX',
        semester: aiParams.semester || 'Semester 1',
        questionsCount: generatedQuestions.length,
        durationMinutes: generatedQuestions.length * 4,
        kktp: 75,
        status: 'DRAFT', // Mandatory: Hasil AI harus masuk ke DRAFT
        showExplanation: true,
        difficulty: aiParams.difficulty || 'Sedang',
        teacherId,
        teacherName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: generatedQuestions,
      };

      // Save to local & db immediately as DRAFT
      await saveQuiz(newDraftQuiz);
      await loadQuizzes();

      setShowAiModal(false);
      // Immediately open editor for teacher inspection
      setEditingQuiz(newDraftQuiz);
      setActiveQuestionIdx(0);
      setShowEditModal(true);
    } catch (err) {
      console.error('AI generation error:', err);
      alert('Gagal menghasilkan soal dengan AI. Silakan coba lagi.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateManual = () => {
    const defaultQuestion: QuizQuestionItem = {
      id: `q-${Date.now()}-1`,
      type: 'pilihan_ganda',
      questionText: 'Tuliskan pertanyaan materi PJOK di sini...',
      options: [
        'Pilihan Jawaban A',
        'Pilihan Jawaban B',
        'Pilihan Jawaban C',
        'Pilihan Jawaban D',
      ],
      correctAnswerIndex: 0,
      explanation: 'Penjelasan biomekanika / teori gerak terkait jawaban benar.',
      points: 20,
    };

    const newQuiz: QuizItem = {
      id: `quiz-${Date.now()}`,
      title: 'Kuis Baru PJOK',
      topic: 'Keterampilan Gerak Spesifik',
      targetGrade: 'VII',
      semester: 'Semester 1',
      questionsCount: 1,
      durationMinutes: 15,
      kktp: 75,
      status: 'DRAFT',
      showExplanation: true,
      difficulty: 'Sedang',
      teacherId,
      teacherName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: [defaultQuestion],
    };

    setEditingQuiz(newQuiz);
    setActiveQuestionIdx(0);
    setShowEditModal(true);
  };

  const handleEditQuiz = (q: QuizItem) => {
    // Ensure questions array exists
    const questions = q.questions && q.questions.length > 0 ? q.questions : [
      {
        id: `q-${Date.now()}-1`,
        type: 'pilihan_ganda' as const,
        questionText: 'Pertanyaan materi PJOK...',
        options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
        correctAnswerIndex: 0,
        explanation: 'Penjelasan jawaban.',
        points: 20,
      }
    ];

    setEditingQuiz({
      ...q,
      questions,
    });
    setActiveQuestionIdx(0);
    setShowEditModal(true);
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz) return;
    const questionsCount = editingQuiz.questions?.length || 0;
    const toSave: QuizItem = {
      ...editingQuiz,
      questionsCount,
      updatedAt: new Date().toISOString(),
    };
    await saveQuiz(toSave);
    await loadQuizzes();
    setShowEditModal(false);
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kuis "${title}"?`)) {
      await deleteQuiz(id);
      await loadQuizzes();
    }
  };

  const handleTogglePublish = async (q: QuizItem) => {
    const nextStatus = q.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const updated: QuizItem = {
      ...q,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };
    await saveQuiz(updated);
    await loadQuizzes();
  };

  const handleViewResults = async (q: QuizItem) => {
    setSelectedQuizForResults(q);
    setLoadingAttempts(true);
    setShowResultsModal(true);
    try {
      const attempts = await getQuizAttempts();
      const filtered = attempts.filter((a) => a.quizId === q.id);
      setQuizAttempts(filtered);
    } catch (err) {
      console.error('Error fetching quiz attempts:', err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const handleAddQuestion = () => {
    if (!editingQuiz) return;
    const newQ: QuizQuestionItem = {
      id: `q-${Date.now()}-${(editingQuiz.questions?.length || 0) + 1}`,
      type: 'pilihan_ganda',
      questionText: 'Pertanyaan baru...',
      options: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
      correctAnswerIndex: 0,
      explanation: 'Penjelasan analisis gerak.',
      points: 20,
    };
    const updated = [...(editingQuiz.questions || []), newQ];
    setEditingQuiz({
      ...editingQuiz,
      questions: updated,
      questionsCount: updated.length,
    });
    setActiveQuestionIdx(updated.length - 1);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (!editingQuiz || !editingQuiz.questions || editingQuiz.questions.length <= 1) {
      alert('Kuis minimal harus memiliki 1 butir soal.');
      return;
    }
    const updated = editingQuiz.questions.filter((_, i) => i !== idx);
    setEditingQuiz({
      ...editingQuiz,
      questions: updated,
      questionsCount: updated.length,
    });
    setActiveQuestionIdx(Math.max(0, idx - 1));
  };

  // Filtered quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchGrade = filterGrade === 'Semua' || q.targetGrade === filterGrade;
    const matchStatus = filterStatus === 'Semua' || q.status === filterStatus;
    return matchSearch && matchGrade && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-500" />
            <span>📝 Kelola Kuis & Latihan PJOK</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Bank soal pilihan ganda, benar/salah, pilihan gambar, dan generator soal otomatis berbasis AI
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="amber"
            size="sm"
            onClick={handleOpenAiModal}
            className="shadow-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
            icon={<Sparkles className="w-4 h-4" />}
          >
            ✨ Generate Soal dengan AI
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateManual}
            icon={<Plus className="w-4 h-4" />}
          >
            Buat Kuis Manual
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul kuis atau materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Kelas (VII, VIII, IX)</option>
            <option value="VII">Kelas VII</option>
            <option value="VIII">Kelas VIII</option>
            <option value="IX">Kelas IX</option>
          </select>
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Status (Draft & Publikasi)</option>
            <option value="PUBLISHED">🟢 Terpublikasi (Siswa Bisa Mengerjakan)</option>
            <option value="DRAFT">🟡 Draf (Belum Dirilis ke Siswa)</option>
          </select>
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Memuat daftar kuis PJOK...</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Belum Ada Kuis</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Gunakan tombol <strong>✨ Generate Soal dengan AI</strong> untuk membuat kuis instan atau buat secara manual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => {
            const isPublished = quiz.status === 'PUBLISHED';
            const qCount = quiz.questions?.length || quiz.questionsCount || 0;

            return (
              <Card
                key={quiz.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Top badge line */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {isPublished ? 'Terpublikasi' : 'Draf AI / Guru'}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                        Kelas {quiz.targetGrade}
                      </span>
                      <span className="text-[11px]">{quiz.semester}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-2">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      Materi: {quiz.topic}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Jumlah Soal</span>
                      <span className="font-bold">{qCount} Butir</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Durasi</span>
                      <span className="font-bold">{quiz.durationMinutes || 15} Mnt</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Batas KKTP</span>
                      <span className="font-bold text-emerald-600">{quiz.kktp || 75}</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      {quiz.showExplanation ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      Pembahasan {quiz.showExplanation ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span>•</span>
                    <span>Level: {quiz.difficulty || 'Sedang'}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => handleTogglePublish(quiz)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                        isPublished
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isPublished ? 'Jadikan Draf' : 'Publikasikan'}
                    </button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPreviewQuiz(quiz);
                          setShowPreviewModal(true);
                        }}
                        title="Pratinjau Soal"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewResults(quiz)}
                        title="Lihat Hasil Siswa"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuiz(quiz)}
                        title="Sunting Soal"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                        title="Hapus Kuis"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MODAL: ✨ GENERATE SOAL DENGAN AI                     */}
      {/* ======================================================== */}
      <Modal
        isOpen={showAiModal}
        onClose={() => !aiGenerating && setShowAiModal(false)}
        title="✨ Generate Soal PJOK dengan AI"
        subtitle="AI membuat bank soal pedagogis PJOK terstruktur dan menyimpannya ke status DRAF"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-amber-800 dark:text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Aturan Pembuatan AI:</strong> Hasil pembuatan AI otomatis masuk ke status <strong>DRAF</strong>.
              Bapak/Ibu Guru dapat memeriksa dan menyunting teks soal, kunci jawaban, dan pembahasan sebelum dipublikasikan ke siswa.
            </p>
          </div>

          <div>
            <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
              Topik / Materi PJOK:
            </label>
            <input
              type="text"
              value={aiParams.topic}
              onChange={(e) => setAiParams({ ...aiParams, topic: e.target.value })}
              placeholder="Contoh: Senam Lantai: Roll Depan & Sikap Lilin"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Target Kelas:
              </label>
              <select
                value={aiParams.targetGrade}
                onChange={(e) => setAiParams({ ...aiParams, targetGrade: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="VII">Kelas VII (Fase D)</option>
                <option value="VIII">Kelas VIII (Fase D)</option>
                <option value="IX">Kelas IX (Fase D)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Semester:
              </label>
              <select
                value={aiParams.semester}
                onChange={(e) => setAiParams({ ...aiParams, semester: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Semester 1">Semester 1 (Gasal)</option>
                <option value="Semester 2">Semester 2 (Genap)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Jumlah Soal:
              </label>
              <select
                value={aiParams.questionsCount}
                onChange={(e) => setAiParams({ ...aiParams, questionsCount: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value={3}>3 Butir Soal (Kuis Singkat)</option>
                <option value={5}>5 Butir Soal (Standar)</option>
                <option value={10}>10 Butir Soal (Latihan Mendalam)</option>
                <option value={15}>15 Butir Soal (Uji Formatif)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Tingkat Kesulitan:
              </label>
              <select
                value={aiParams.difficulty}
                onChange={(e) => setAiParams({ ...aiParams, difficulty: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Mudah">Mudah (LOTS)</option>
                <option value="Sedang">Sedang (MOTS)</option>
                <option value="Sukar">Sukar (HOTS)</option>
                <option value="Campuran">Campuran (Seimbang)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Jenis Soal:
              </label>
              <select
                value={aiParams.questionType}
                onChange={(e) => setAiParams({ ...aiParams, questionType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="campuran">Campuran Semua Jenis</option>
                <option value="pilihan_ganda">Pilihan Ganda (A-D)</option>
                <option value="benar_salah">Benar / Salah</option>
                <option value="pilihan_gambar">Pilihan Gambar</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAiModal(false)}
              disabled={aiGenerating}
            >
              Batal
            </Button>
            <Button
              variant="amber"
              size="sm"
              onClick={handleRunAiGeneration}
              disabled={aiGenerating || !aiParams.topic.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              icon={aiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              {aiGenerating ? 'AI Sedang Merumuskan Soal...' : 'Buat Soal Sekarang'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* 2. MODAL: SUNTING / EDIT KUIS & BUTIR SOAL                */}
      {/* ======================================================== */}
      {editingQuiz && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Sunting Kuis: ${editingQuiz.title}`}
          subtitle="Atur parameter kuis, edit butir soal, kunci jawaban, dan pembahasan"
        >
          <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Master Quiz Info */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Data Pokok Kuis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Judul Kuis:</label>
                  <input
                    type="text"
                    value={editingQuiz.title}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Materi / Topik:</label>
                  <input
                    type="text"
                    value={editingQuiz.topic}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, topic: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold block mb-1">Kelas:</label>
                  <select
                    value={editingQuiz.targetGrade}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, targetGrade: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Semester:</label>
                  <select
                    value={editingQuiz.semester}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, semester: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Durasi (Menit):</label>
                  <input
                    type="number"
                    value={editingQuiz.durationMinutes || 15}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">KKTP / Kelulusan:</label>
                  <input
                    type="number"
                    value={editingQuiz.kktp || 75}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, kktp: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold block mb-1">Status Kuis:</label>
                  <select
                    value={editingQuiz.status}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="DRAFT">🟡 DRAFT (Hanya terlihat oleh guru)</option>
                    <option value="PUBLISHED">🟢 PUBLISHED (Dapat dikerjakan oleh siswa)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingQuiz.showExplanation ?? true}
                      onChange={(e) => setEditingQuiz({ ...editingQuiz, showExplanation: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 font-bold text-slate-700 dark:text-slate-300">
                      Tampilkan Pembahasan Setelah Siswa Mengerjakan
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Questions Tab Navigation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Daftar Butir Soal</span>
                  <Badge variant="blue" size="sm">
                    {editingQuiz.questions?.length || 0} Soal
                  </Badge>
                </h4>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Tambah Butir Soal
                </Button>
              </div>

              {/* Number tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {editingQuiz.questions?.map((q, idx) => {
                  const isActive = idx === activeQuestionIdx;
                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => setActiveQuestionIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      Soal {idx + 1}
                      <span className="ml-1 text-[10px] opacity-75">
                        ({q.type === 'pilihan_ganda' ? 'PG' : q.type === 'benar_salah' ? 'B/S' : 'Gambar'})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Question Editor */}
              {editingQuiz.questions && editingQuiz.questions[activeQuestionIdx] && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-amber-600 text-xs">
                      Mengedit Butir Soal #{activeQuestionIdx + 1}
                    </span>

                    <button
                      onClick={() => handleRemoveQuestion(activeQuestionIdx)}
                      className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Soal Ini
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">Jenis Soal:</label>
                      <select
                        value={editingQuiz.questions[activeQuestionIdx].type}
                        onChange={(e) => {
                          const newType = e.target.value as any;
                          const currentQ = editingQuiz.questions![activeQuestionIdx];
                          let newOpts: any = currentQ.options;

                          if (newType === 'benar_salah') {
                            newOpts = ['Benar', 'Salah'];
                          } else if (newType === 'pilihan_gambar') {
                            newOpts = [
                              { text: 'Fase A: Kuda-kuda sempurna', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60', label: 'A' },
                              { text: 'Fase B: Tumpuan salah', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=60', label: 'B' },
                            ];
                          } else if (newType === 'pilihan_ganda' && Array.isArray(newOpts) && typeof newOpts[0] === 'object') {
                            newOpts = ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'];
                          }

                          const updatedQ: QuizQuestionItem = {
                            ...currentQ,
                            type: newType,
                            options: newOpts,
                            correctAnswerIndex: 0,
                          };

                          const qList = [...editingQuiz.questions!];
                          qList[activeQuestionIdx] = updatedQ;
                          setEditingQuiz({ ...editingQuiz, questions: qList });
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <option value="pilihan_ganda">Pilihan Ganda (A-D)</option>
                        <option value="benar_salah">Benar / Salah</option>
                        <option value="pilihan_gambar">Pilihan Gambar</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Bobot Poin Soal:</label>
                      <input
                        type="number"
                        value={editingQuiz.questions[activeQuestionIdx].points || 20}
                        onChange={(e) => {
                          const qList = [...editingQuiz.questions!];
                          qList[activeQuestionIdx].points = Number(e.target.value);
                          setEditingQuiz({ ...editingQuiz, questions: qList });
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Teks Pertanyaan:</label>
                    <textarea
                      rows={3}
                      value={editingQuiz.questions[activeQuestionIdx].questionText}
                      onChange={(e) => {
                        const qList = [...editingQuiz.questions!];
                        qList[activeQuestionIdx].questionText = e.target.value;
                        setEditingQuiz({ ...editingQuiz, questions: qList });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                    />
                  </div>

                  {/* Options Editor based on type */}
                  <div className="space-y-2 pt-2">
                    <label className="font-bold block text-slate-800 dark:text-slate-200">
                      Pilihan Jawaban & Kunci Jawaban Benar (Pilih Radio Kunci):
                    </label>

                    {editingQuiz.questions[activeQuestionIdx].type === 'benar_salah' ? (
                      <div className="grid grid-cols-2 gap-3">
                        {['Benar', 'Salah'].map((val, optIdx) => {
                          const isCorrect = editingQuiz.questions![activeQuestionIdx].correctAnswerIndex === optIdx;
                          return (
                            <div
                              key={val}
                              onClick={() => {
                                const qList = [...editingQuiz.questions!];
                                qList[activeQuestionIdx].correctAnswerIndex = optIdx;
                                setEditingQuiz({ ...editingQuiz, questions: qList });
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <span className="font-bold text-sm">{val}</span>
                              {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            </div>
                          );
                        })}
                      </div>
                    ) : editingQuiz.questions[activeQuestionIdx].type === 'pilihan_gambar' ? (
                      <div className="space-y-3">
                        {(editingQuiz.questions[activeQuestionIdx].options as QuizOptionItem[]).map((opt, optIdx) => {
                          const isCorrect = editingQuiz.questions![activeQuestionIdx].correctAnswerIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border space-y-2 transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer font-bold">
                                  <input
                                    type="radio"
                                    name="correct-option"
                                    checked={isCorrect}
                                    onChange={() => {
                                      const qList = [...editingQuiz.questions!];
                                      qList[activeQuestionIdx].correctAnswerIndex = optIdx;
                                      setEditingQuiz({ ...editingQuiz, questions: qList });
                                    }}
                                  />
                                  <span>Opsi {String.fromCharCode(65 + optIdx)} (Kunci Benar)</span>
                                </label>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Keterangan teks opsi..."
                                  value={typeof opt === 'string' ? opt : opt.text}
                                  onChange={(e) => {
                                    const qList = [...editingQuiz.questions!];
                                    const opts = [...(qList[activeQuestionIdx].options as any[])];
                                    if (typeof opts[optIdx] === 'object') {
                                      opts[optIdx] = { ...opts[optIdx], text: e.target.value };
                                    } else {
                                      opts[optIdx] = e.target.value;
                                    }
                                    qList[activeQuestionIdx].options = opts;
                                    setEditingQuiz({ ...editingQuiz, questions: qList });
                                  }}
                                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                />

                                <input
                                  type="text"
                                  placeholder="URL Gambar ilustrasi..."
                                  value={typeof opt === 'object' ? opt.imageUrl : ''}
                                  onChange={(e) => {
                                    const qList = [...editingQuiz.questions!];
                                    const opts = [...(qList[activeQuestionIdx].options as any[])];
                                    if (typeof opts[optIdx] === 'object') {
                                      opts[optIdx] = { ...opts[optIdx], imageUrl: e.target.value };
                                    }
                                    qList[activeQuestionIdx].options = opts;
                                    setEditingQuiz({ ...editingQuiz, questions: qList });
                                  }}
                                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(editingQuiz.questions[activeQuestionIdx].options as string[]).map((opt, optIdx) => {
                          const isCorrect = editingQuiz.questions![activeQuestionIdx].correctAnswerIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name="correct-option"
                                checked={isCorrect}
                                onChange={() => {
                                  const qList = [...editingQuiz.questions!];
                                  qList[activeQuestionIdx].correctAnswerIndex = optIdx;
                                  setEditingQuiz({ ...editingQuiz, questions: qList });
                                }}
                                className="cursor-pointer"
                              />

                              <span className="font-bold text-slate-500 w-5">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>

                              <input
                                type="text"
                                value={typeof opt === 'string' ? opt : (opt as any).text}
                                onChange={(e) => {
                                  const qList = [...editingQuiz.questions!];
                                  const opts = [...(qList[activeQuestionIdx].options as any[])];
                                  opts[optIdx] = e.target.value;
                                  qList[activeQuestionIdx].options = opts;
                                  setEditingQuiz({ ...editingQuiz, questions: qList });
                                }}
                                className="flex-1 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                      Pembahasan / Analisis Gerak (Akan ditampilkan ke siswa jika pembahasan diaktifkan):
                    </label>
                    <textarea
                      rows={2}
                      value={editingQuiz.questions[activeQuestionIdx].explanation || ''}
                      onChange={(e) => {
                        const qList = [...editingQuiz.questions!];
                        qList[activeQuestionIdx].explanation = e.target.value;
                        setEditingQuiz({ ...editingQuiz, questions: qList });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                icon={<Check className="w-4 h-4" />}
              >
                Simpan Perubahan Kuis
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL: PRATINJAU KUIS                                 */}
      {/* ======================================================== */}
      {previewQuiz && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={`Pratinjau: ${previewQuiz.title}`}
          subtitle={`Kelas ${previewQuiz.targetGrade} • ${previewQuiz.questions?.length || 0} Soal • Durasi ${previewQuiz.durationMinutes || 15} Menit • KKTP ${previewQuiz.kktp || 75}`}
        >
          <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
            {previewQuiz.questions?.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold text-amber-600">Nomor {idx + 1}</span>
                  <span>Bobot: {q.points || 20} Poin</span>
                </div>

                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {q.questionText}
                </p>

                <div className="space-y-2">
                  {q.type === 'pilihan_gambar' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q.options as QuizOptionItem[]).map((opt, oIdx) => {
                        const isCorrect = q.correctAnswerIndex === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border text-[11px] ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {opt.imageUrl && (
                              <img
                                src={opt.imageUrl}
                                alt={opt.text}
                                className="w-full h-24 object-cover rounded-lg mb-1.5"
                              />
                            )}
                            <div className="flex items-center gap-1.5 font-semibold">
                              <span>{String.fromCharCode(65 + oIdx)}.</span>
                              <span>{opt.text}</span>
                              {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {(q.options as string[]).map((opt, oIdx) => {
                        const isCorrect = q.correctAnswerIndex === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 font-bold text-emerald-800 dark:text-emerald-300'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + oIdx)}. {typeof opt === 'string' ? opt : (opt as any).text}
                            </span>
                            {isCorrect && <Badge variant="emerald" size="sm">Kunci Benar</Badge>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {q.explanation && (
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-blue-900 dark:text-blue-300 text-[11px]">
                    <strong>Pembahasan Guru:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>
                Tutup Pratinjau
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: HASIL & REKAP NILAI PENGERJAAN SISWA           */}
      {/* ======================================================== */}
      {selectedQuizForResults && (
        <Modal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          title={`Rekap Hasil Siswa: ${selectedQuizForResults.title}`}
          subtitle={`KKTP: ${selectedQuizForResults.kktp || 75} • Total Butir: ${selectedQuizForResults.questionsCount} Soal`}
        >
          <div className="space-y-4 text-xs">
            {loadingAttempts ? (
              <div className="p-8 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                <p>Memuat rekap nilai siswa...</p>
              </div>
            ) : quizAttempts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Belum Ada Siswa yang Mengerjakan</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Pastikan status kuis sudah <strong>PUBLISHED</strong> agar siswa dapat mengakses di dashboard mereka.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Total Partisipan</span>
                    <span className="font-black text-lg text-slate-800 dark:text-white">
                      {quizAttempts.length} Siswa
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] block">Tuntas KKTP</span>
                    <span className="font-black text-lg text-emerald-700 dark:text-emerald-300">
                      {quizAttempts.filter((a) => a.isPassed).length} Siswa
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                    <span className="text-amber-600 dark:text-amber-400 text-[10px] block">Rata-rata Nilai</span>
                    <span className="font-black text-lg text-amber-700 dark:text-amber-300">
                      {Math.round(
                        quizAttempts.reduce((acc, cur) => acc + (cur.score || 0), 0) /
                          Math.max(1, quizAttempts.length)
                      )}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3 text-center">Nilai</th>
                        <th className="p-3 text-center">Benar / Salah</th>
                        <th className="p-3 text-center">Waktu</th>
                        <th className="p-3 text-center">Ketuntasan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {quizAttempts.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                            {att.studentName}
                          </td>
                          <td className="p-3 text-slate-500">
                            {att.studentClass || 'VII-A'}
                          </td>
                          <td className="p-3 text-center font-black text-sm text-slate-900 dark:text-white">
                            {att.score}
                          </td>
                          <td className="p-3 text-center text-[11px]">
                            <span className="text-emerald-600 font-bold">{att.correctCount ?? att.correctAnswers ?? 0}</span> /{' '}
                            <span className="text-rose-500 font-bold">{att.wrongCount ?? att.wrongAnswers ?? 0}</span>
                          </td>
                          <td className="p-3 text-center text-slate-400 text-[11px]">
                            {(att.durationSeconds || att.durationTakenSeconds)
                              ? `${Math.floor((att.durationSeconds || att.durationTakenSeconds || 0) / 60)}m ${(att.durationSeconds || att.durationTakenSeconds || 0) % 60}s`
                              : '-'}
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={att.isPassed ? 'emerald' : 'amber'} size="sm">
                              {att.isPassed ? 'Tuntas KKTP' : 'Perlu Remedial'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowResultsModal(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

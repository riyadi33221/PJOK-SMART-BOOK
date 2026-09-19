import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  PlaySquare,
  Edit3,
  Trash2,
  Eye,
  Save,
  Globe,
  RefreshCw,
  HelpCircle,
  Activity,
  Award,
  ChevronRight,
  Layers,
  FileUp,
  X,
  ExternalLink,
} from 'lucide-react';
import { DigitalBookItem, DigitalBookContent, MaterialVideo, TechniqueStep, SafetyTip, ComprehensionQuestion } from '../../types';
import { presetPdfSamples, PresetPdfSample } from '../../data/samplePdfs';
import {
  transformPdfMaterialWithAi,
  regenerateSummary,
  regenerateComprehensionQuestions,
  regenerateQuiz,
} from '../../services/aiService';
import {
  getDigitalBooks,
  saveDigitalBook,
  deleteDigitalBook,
  publishDigitalBook,
  unpublishDigitalBook,
} from '../../services/firestoreService';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { DigitalBookReader } from './DigitalBookReader';

interface TeacherBookManagerProps {
  teacherName?: string;
  teacherId?: string;
}

export const TeacherBookManager: React.FC<TeacherBookManagerProps> = ({
  teacherName = 'Purwanto, S.Pd.',
  teacherId = 'guru-001',
}) => {
  // Books list state
  const [books, setBooks] = useState<DigitalBookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilterGrade, setActiveFilterGrade] = useState<string>('Semua');
  const [activeFilterSemester, setActiveFilterSemester] = useState<string>('Semua');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [previewBook, setPreviewBook] = useState<DigitalBookItem | null>(null);

  // Upload PDF Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    targetGrade: 'VII' as 'VII' | 'VIII' | 'IX',
    semester: 'Semester 1' as 'Semester 1' | 'Semester 2',
    chapter: 1,
    topic: '',
    category: 'Permainan Bola Besar' as DigitalBookItem['category'],
    learningObjectives: '',
    description: '',
    pdfFileName: '',
    pdfFileSize: '',
    pdfText: '',
  });

  // Selected sample preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // AI Processing status
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiProcessingStep, setAiProcessingStep] = useState<string>('');

  // Currently editing book in Review & Edit Modal
  const [editingBook, setEditingBook] = useState<DigitalBookItem | null>(null);
  const [editorActiveTab, setEditorActiveTab] = useState<'info' | 'ringkasan' | 'teknik' | 'keselamatan' | 'video' | 'soal'>('info');

  // Video form in editor
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  // Load books
  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getDigitalBooks({
        grade: activeFilterGrade,
        semester: activeFilterSemester,
      });
      setBooks(data);
    } catch (err) {
      console.error('Failed to load digital books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [activeFilterGrade, activeFilterSemester]);

  // Handle Preset PDF selection
  const handleSelectPreset = (preset: PresetPdfSample) => {
    setSelectedPresetId(preset.id);
    setUploadForm({
      title: preset.name,
      targetGrade: preset.grade,
      semester: preset.semester,
      chapter: preset.chapter,
      topic: preset.topic,
      category: preset.category,
      learningObjectives: preset.learningObjectives,
      description: preset.description,
      pdfFileName: preset.fileName,
      pdfFileSize: preset.fileSize,
      pdfText: preset.extractedText,
    });
  };

  // Handle real file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setUploadForm((prev) => ({
        ...prev,
        pdfFileName: file.name,
        pdfFileSize: fileSizeMb,
        title: prev.title || file.name.replace(/\.pdf$/i, '').replace(/_/g, ' '),
      }));

      // Read text if text/plain or sample extraction
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setUploadForm((prev) => ({ ...prev, pdfText: text.slice(0, 50000) }));
        }
      };
      reader.readAsText(file);
    }
  };

  // Process PDF with AI
  const handleStartAiTransformation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.topic) {
      alert('Mohon isi Judul Materi dan Topik!');
      return;
    }

    setIsAiProcessing(true);
    setAiProcessingStep('Membaca dan memvalidasi file PDF...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setAiProcessingStep('AI menganalisis struktur & mengekstrak capaian pembelajaran...');
      await new Promise((r) => setTimeout(r, 800));
      setAiProcessingStep('Menyusun biomekanika teknik, SOP keselamatan, dan glosarium...');

      const result = await transformPdfMaterialWithAi({
        title: uploadForm.title,
        targetGrade: uploadForm.targetGrade,
        semester: uploadForm.semester,
        chapter: Number(uploadForm.chapter),
        topic: uploadForm.topic,
        category: uploadForm.category,
        learningObjectives: uploadForm.learningObjectives,
        description: uploadForm.description,
        pdfFileName: uploadForm.pdfFileName || 'Materi_PJOK.pdf',
        pdfText: uploadForm.pdfText,
        teacherName,
      });

      setAiProcessingStep('Menyiapkan format Digital Book Interaktif untuk Guru...');
      await new Promise((r) => setTimeout(r, 500));

      const newBook: DigitalBookItem = {
        id: `book-${Date.now()}`,
        title: uploadForm.title,
        targetGrade: uploadForm.targetGrade,
        semester: uploadForm.semester,
        chapter: Number(uploadForm.chapter),
        topic: uploadForm.topic,
        category: uploadForm.category,
        learningObjectives: result.content.cover.learningObjectives,
        description: uploadForm.description || result.content.summary,
        status: 'DRAFT',
        readDurationMin: Math.max(10, result.content.techniques.length * 4),
        readPages: Math.max(6, result.content.sections.length * 3),
        pdfFileName: uploadForm.pdfFileName || 'Dokumen_PJOK.pdf',
        pdfFileSize: uploadForm.pdfFileSize || '2.1 MB',
        teacherId,
        teacherName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: result.content,
      };

      // Auto-save as DRAFT in database
      await saveDigitalBook(newBook);

      setIsUploadModalOpen(false);
      setIsAiProcessing(false);

      // Open Editor for Teacher Review
      setEditingBook(newBook);
      setIsEditorModalOpen(true);
      loadBooks();
    } catch (err) {
      console.error('AI Transformation error:', err);
      setIsAiProcessing(false);
      alert('Terjadi kesalahan saat memproses PDF. Silakan coba lagi.');
    }
  };

  // Publish / Unpublish Actions
  const handleTogglePublish = async (book: DigitalBookItem) => {
    if (book.status === 'PUBLISHED') {
      await unpublishDigitalBook(book.id);
    } else {
      await publishDigitalBook(book.id);
    }
    loadBooks();
  };

  // Delete Book
  const handleDeleteBook = async (bookId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus buku digital ini?')) {
      await deleteDigitalBook(bookId);
      loadBooks();
    }
  };

  // AI Content Generators in Editor
  const handleRegenerateSummary = async () => {
    if (!editingBook) return;
    const res = await regenerateSummary(
      editingBook.title,
      editingBook.topic,
      editingBook.content.summary
    );
    setEditingBook({
      ...editingBook,
      content: {
        ...editingBook.content,
        summary: res.summary,
        keyPoints: res.keyPoints,
      },
    });
    alert('Ringkasan dan poin penting berhasil diperbarui oleh AI! (Status: DRAFT)');
  };

  const handleRegenerateQuestions = async () => {
    if (!editingBook) return;
    const questions = await regenerateComprehensionQuestions(
      editingBook.title,
      editingBook.topic
    );
    setEditingBook({
      ...editingBook,
      content: {
        ...editingBook.content,
        comprehensionQuestions: questions,
      },
    });
    alert('Pertanyaan pemahaman baru berhasil dibuat oleh AI! (Status: DRAFT)');
  };

  const handleRegenerateQuiz = async () => {
    if (!editingBook) return;
    const quiz = await regenerateQuiz(editingBook.title, editingBook.topic);
    setEditingBook({
      ...editingBook,
      content: {
        ...editingBook.content,
        comprehensionQuestions: quiz.questions,
      },
    });
    alert(`Kuis Interaktif "${quiz.title}" berhasil di-generate! (Status: DRAFT)`);
  };

  // Add Video
  const handleAddVideo = () => {
    if (!editingBook || !newVideoTitle || !newVideoUrl) return;
    const videoItem: MaterialVideo = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle,
      videoUrl: newVideoUrl,
      duration: newVideoDuration || '05:00',
      description: newVideoDesc,
    };
    const updatedVideos = [...(editingBook.content.videos || []), videoItem];
    setEditingBook({
      ...editingBook,
      content: {
        ...editingBook.content,
        videos: updatedVideos,
      },
    });
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDuration('');
    setNewVideoDesc('');
  };

  // Remove Video
  const handleRemoveVideo = (vidId: string) => {
    if (!editingBook) return;
    const updatedVideos = (editingBook.content.videos || []).filter((v) => v.id !== vidId);
    setEditingBook({
      ...editingBook,
      content: {
        ...editingBook.content,
        videos: updatedVideos,
      },
    });
  };

  // Save Book changes from Editor
  const handleSaveEditor = async (andPublish: boolean = false) => {
    if (!editingBook) return;
    const bookToSave: DigitalBookItem = {
      ...editingBook,
      status: andPublish ? 'PUBLISHED' : editingBook.status,
      publishedAt: andPublish ? new Date().toISOString() : editingBook.publishedAt,
      updatedAt: new Date().toISOString(),
    };
    await saveDigitalBook(bookToSave);
    setIsEditorModalOpen(false);
    setEditingBook(null);
    loadBooks();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md">
              Tahap 3 • Guru PJOK
            </span>
            <span className="text-xs text-slate-400">SMP Negeri 2 Kutasari</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>Kelola Buku PJOK Digital</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unggah modul ajar PDF dan ubah menjadi materi digital interaktif berkualitas menggunakan AI Transformer.
          </p>
        </div>

        {/* Action Button: + Upload PDF */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setSelectedPresetId('');
            setUploadForm({
              title: '',
              targetGrade: 'VII',
              semester: 'Semester 1',
              chapter: 1,
              topic: '',
              category: 'Permainan Bola Besar',
              learningObjectives: '',
              description: '',
              pdfFileName: '',
              pdfFileSize: '',
              pdfText: '',
            });
            setIsUploadModalOpen(true);
          }}
          icon={<Plus className="w-5 h-5" />}
        >
          + Upload PDF
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Kelas:</span>
          {['Semua', 'VII', 'VIII', 'IX'].map((g) => (
            <button
              key={g}
              onClick={() => setActiveFilterGrade(g)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterGrade === g
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {g === 'Semua' ? 'Semua Kelas' : `Kelas ${g}`}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Semester:</span>
          {['Semua', 'Semester 1', 'Semester 2'].map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilterSemester(s)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterSemester === s
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Books Table / Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" />
          <p className="text-sm font-semibold">Memuat koleksi Buku PJOK Digital...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-lg text-slate-700 dark:text-slate-200">
            Belum Ada Buku PJOK Digital
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Klik tombol "+ Upload PDF" di atas untuk mentransformasi materi ajar PDF menjadi buku digital interaktif.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUploadModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            + Upload PDF Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const isDraft = book.status === 'DRAFT';
            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative group"
              >
                <div>
                  {/* Status & Chapter Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                      Bab {book.chapter} • Kelas {book.targetGrade}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        isDraft
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isDraft ? '🟡 DRAFT (Perlu Review)' : '🟢 PUBLISHED'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {book.topic}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {book.description || book.content.summary}
                  </p>

                  {/* Components mini chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      🏃 {book.content.techniques.length} Teknik
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      ⚠️ {book.content.safetyTips.length} SOP
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      ❓ {book.content.comprehensionQuestions.length} Soal
                    </span>
                    {book.content.videos?.length ? (
                      <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                        🎥 {book.content.videos.length} Video
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Lihat Tampilan Siswa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit / Review Button */}
                    <button
                      onClick={() => {
                        setEditingBook(book);
                        setIsEditorModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Review & Edit Konten AI"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Hapus Buku"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Publish / Unpublish Toggle */}
                  <Button
                    variant={isDraft ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleTogglePublish(book)}
                    icon={isDraft ? <Globe className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  >
                    {isDraft ? 'Publish ke Siswa' : 'Batalkan Publish'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MODAL: + UPLOAD PDF & AI MATERIAL TRANSFORMER          */}
      {/* ======================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => {
                if (!isAiProcessing) setIsUploadModalOpen(false);
              }}
              disabled={isAiProcessing}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Upload PDF Modul Ajar PJOK
                </h2>
                <p className="text-xs text-slate-500">
                  AI PDF Material Transformer • Membaca, menganalisis, dan menyusun buku digital
                </p>
              </div>
            </div>

            {isAiProcessing ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Sedang Mentransformasi PDF...
                </h3>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">
                  {aiProcessingStep}
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto pt-2">
                  AI menyusun struktur buku, membagi poin gerak, SOP keselamatan, glosarium, dan pertanyaan pemahaman berbasis isi dokumen (Strict Zero-Hallucination).
                </p>
              </div>
            ) : (
              <form onSubmit={handleStartAiTransformation} className="space-y-5">
                {/* Preset Fast Picker for Instant Testing */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Atau Pilih Contoh Modul Ajar PJOK SMP:</span>
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold">1-Klik Siap Uji</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {presetPdfSamples.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-extrabold block truncate">
                            Bab {preset.chapter}: {preset.category}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {preset.topic}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* File Upload Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Pilih File PDF Modul PJOK:
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center hover:border-emerald-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      id="pdf-input"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="pdf-input" className="cursor-pointer block space-y-2">
                      <FileUp className="w-10 h-10 text-emerald-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {uploadForm.pdfFileName ? (
                          <span className="text-emerald-600 font-black">
                            📄 {uploadForm.pdfFileName} ({uploadForm.pdfFileSize})
                          </span>
                        ) : (
                          'Klik di sini untuk memilih file PDF dari komputer atau seret file ke sini'
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Format didukung: PDF, Dokumen Teks Kurikulum Merdeka (Maks 15MB)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Form Fields: Judul & Topik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Judul Materi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Permainan Bola Voli"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Topik Gerak Spesifik *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Passing Bawah & Servis Bawah"
                      value={uploadForm.topic}
                      onChange={(e) => setUploadForm({ ...uploadForm, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Form Fields: Kelas, Semester, Bab, Kategori */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Kelas
                    </label>
                    <select
                      value={uploadForm.targetGrade}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, targetGrade: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="VII">Kelas VII</option>
                      <option value="VIII">Kelas VIII</option>
                      <option value="IX">Kelas IX</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Semester
                    </label>
                    <select
                      value={uploadForm.semester}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, semester: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Bab Ke-
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={uploadForm.chapter}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, chapter: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Kategori
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, category: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="Permainan Bola Besar">Bola Besar</option>
                      <option value="Permainan Bola Kecil">Bola Kecil</option>
                      <option value="Atletik">Atletik</option>
                      <option value="Kebugaran Jasmani">Kebugaran</option>
                      <option value="Senam Lantai">Senam Lantai</option>
                      <option value="Kesehatan">Kesehatan</option>
                    </select>
                  </div>
                </div>

                {/* Form Fields: Tujuan Pembelajaran & Deskripsi */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tujuan Pembelajaran (Opsional, dipisahkan enter):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Siswa mampu mempraktikkan passing bawah bola voli..."
                    value={uploadForm.learningObjectives}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, learningObjectives: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Form Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsUploadModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Proses dengan AI
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MODAL: TEACHER REVIEW & EDIT WORKFLOW                  */}
      {/* ======================================================== */}
      {isEditorModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Status: {editingBook.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Guru Memiliki Kontrol Penuh • Review Sebelum Publish
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Review & Edit Materi Digital: {editingBook.title}
                </h2>
              </div>

              <button
                onClick={() => setIsEditorModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Generator Action Bar */}
            <div className="py-3 px-4 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Tools (Draft):</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateSummary}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Generate Ringkasan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateQuestions}
                  icon={<HelpCircle className="w-3.5 h-3.5" />}
                >
                  Generate Pertanyaan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateQuiz}
                  icon={<Award className="w-3.5 h-3.5" />}
                >
                  Generate Kuis
                </Button>
              </div>
            </div>

            {/* Editor Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto py-2 border-b border-slate-100 dark:border-slate-800 shrink-0 text-xs">
              {[
                { key: 'info', label: 'Informasi Dasar' },
                { key: 'ringkasan', label: 'Ringkasan & Poin' },
                { key: 'teknik', label: 'Langkah Gerak' },
                { key: 'keselamatan', label: 'SOP Keselamatan' },
                { key: 'video', label: `Video (${editingBook.content.videos?.length || 0})` },
                { key: 'soal', label: `Soal Pemahaman (${editingBook.content.comprehensionQuestions.length})` },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setEditorActiveTab(t.key as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                    editorActiveTab === t.key
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* TAB 1: INFORMASI DASAR */}
              {editorActiveTab === 'info' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Judul Buku Digital:
                    </label>
                    <input
                      type="text"
                      value={editingBook.title}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          title: e.target.value,
                          content: {
                            ...editingBook.content,
                            cover: { ...editingBook.content.cover, title: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Topik Gerak:
                    </label>
                    <input
                      type="text"
                      value={editingBook.topic}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          topic: e.target.value,
                          content: {
                            ...editingBook.content,
                            cover: { ...editingBook.content.cover, topic: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Subjudul / Deskripsi Singkat Cover:
                    </label>
                    <input
                      type="text"
                      value={editingBook.content.cover.subtitle || ''}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          content: {
                            ...editingBook.content,
                            cover: { ...editingBook.content.cover, subtitle: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: RINGKASAN & POIN */}
              {editorActiveTab === 'ringkasan' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ringkasan Materi (Hasil AI):
                    </label>
                    <textarea
                      rows={5}
                      value={editingBook.content.summary}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          content: { ...editingBook.content, summary: e.target.value },
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Poin-Poin Penting:
                    </label>
                    {editingBook.content.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const updated = [...editingBook.content.keyPoints];
                            updated[idx] = e.target.value;
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, keyPoints: updated },
                            });
                          }}
                          className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBook.content.keyPoints.filter((_, i) => i !== idx);
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, keyPoints: updated },
                            });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBook({
                          ...editingBook,
                          content: {
                            ...editingBook.content,
                            keyPoints: [...editingBook.content.keyPoints, 'Poin penting baru...'],
                          },
                        });
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline pt-1 block"
                    >
                      + Tambah Poin Penting
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: LANGKAH TEKNIK */}
              {editorActiveTab === 'teknik' && (
                <div className="space-y-4">
                  {editingBook.content.techniques.map((tech, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-emerald-600">
                          Langkah {tech.stepNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBook.content.techniques.filter((_, i) => i !== idx);
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, techniques: updated },
                            });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={tech.title}
                        onChange={(e) => {
                          const updated = [...editingBook.content.techniques];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setEditingBook({
                            ...editingBook,
                            content: { ...editingBook.content, techniques: updated },
                          });
                        }}
                        className="w-full p-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        placeholder="Nama Teknik"
                      />

                      <textarea
                        rows={2}
                        value={tech.description}
                        onChange={(e) => {
                          const updated = [...editingBook.content.techniques];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setEditingBook({
                            ...editingBook,
                            content: { ...editingBook.content, techniques: updated },
                          });
                        }}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        placeholder="Deskripsi Gerak"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SOP KESELAMATAN */}
              {editorActiveTab === 'keselamatan' && (
                <div className="space-y-4">
                  {editingBook.content.safetyTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-center justify-between">
                        <select
                          value={tip.severity}
                          onChange={(e) => {
                            const updated = [...editingBook.content.safetyTips];
                            updated[idx] = { ...updated[idx], severity: e.target.value as any };
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, safetyTips: updated },
                            });
                          }}
                          className="px-2 py-1 rounded text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                        >
                          <option value="high">Kritis (Tinggi)</option>
                          <option value="medium">Penting (Sedang)</option>
                          <option value="low">Perhatian (Rendah)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBook.content.safetyTips.filter((_, i) => i !== idx);
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, safetyTips: updated },
                            });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={tip.title}
                        onChange={(e) => {
                          const updated = [...editingBook.content.safetyTips];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setEditingBook({
                            ...editingBook,
                            content: { ...editingBook.content, safetyTips: updated },
                          });
                        }}
                        className="w-full p-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        placeholder="Judul SOP Keselamatan"
                      />

                      <textarea
                        rows={2}
                        value={tip.description}
                        onChange={(e) => {
                          const updated = [...editingBook.content.safetyTips];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setEditingBook({
                            ...editingBook,
                            content: { ...editingBook.content, safetyTips: updated },
                          });
                        }}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        placeholder="Penjelasan SOP dan mitigasi risiko cedera"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBook({
                        ...editingBook,
                        content: {
                          ...editingBook.content,
                          safetyTips: [
                            ...editingBook.content.safetyTips,
                            { title: 'SOP Keselamatan Baru', description: 'Deskripsi prosedur...', severity: 'medium' },
                          ],
                        },
                      });
                    }}
                    className="text-xs font-bold text-emerald-600 hover:underline pt-1 block"
                  >
                    + Tambah SOP Keselamatan
                  </button>
                </div>
              )}

              {/* TAB 5: VIDEO INTEGRASI */}
              {editorActiveTab === 'video' && (
                <div className="space-y-6">
                  {/* List of existing videos */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Video yang Tertaut pada Materi:
                    </label>
                    {editingBook.content.videos?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Belum ada video ditautkan.</p>
                    ) : (
                      editingBook.content.videos?.map((vid) => (
                        <div
                          key={vid.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <div className="truncate pr-2">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {vid.title}
                            </h4>
                            <a
                              href={vid.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-blue-500 hover:underline truncate block"
                            >
                              {vid.videoUrl} ({vid.duration})
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(vid.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Video Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <PlaySquare className="w-4 h-4 text-blue-500" />
                      <span>+ Tautkan Video Pembelajaran Baru:</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Judul Video (contoh: Tutorial Passing)"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        placeholder="URL Video (YouTube / MP4)"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Durasi (contoh: 06:30)"
                        value={newVideoDuration}
                        onChange={(e) => setNewVideoDuration(e.target.value)}
                        className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        placeholder="Keterangan singkat"
                        value={newVideoDesc}
                        onChange={(e) => setNewVideoDesc(e.target.value)}
                        className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddVideo}
                        disabled={!newVideoTitle || !newVideoUrl}
                      >
                        Simpan Video
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SOAL PEMAHAMAN */}
              {editorActiveTab === 'soal' && (
                <div className="space-y-4">
                  {editingBook.content.comprehensionQuestions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          Pertanyaan #{qIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingBook.content.comprehensionQuestions.filter((_, i) => i !== qIndex);
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, comprehensionQuestions: updated },
                            });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...editingBook.content.comprehensionQuestions];
                          updated[qIndex] = { ...updated[qIndex], question: e.target.value };
                          setEditingBook({
                            ...editingBook,
                            content: { ...editingBook.content, comprehensionQuestions: updated },
                          });
                        }}
                        className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400">Pilihan Jawaban (Pilih radio untuk jawaban benar):</span>
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${q.id}`}
                              checked={q.correctAnswerIndex === optIndex}
                              onChange={() => {
                                const updated = [...editingBook.content.comprehensionQuestions];
                                updated[qIndex] = { ...updated[qIndex], correctAnswerIndex: optIndex };
                                setEditingBook({
                                  ...editingBook,
                                  content: { ...editingBook.content, comprehensionQuestions: updated },
                                });
                              }}
                              className="accent-emerald-600"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updated = [...editingBook.content.comprehensionQuestions];
                                const newOpts = [...updated[qIndex].options];
                                newOpts[optIndex] = e.target.value;
                                updated[qIndex] = { ...updated[qIndex], options: newOpts };
                                setEditingBook({
                                  ...editingBook,
                                  content: { ...editingBook.content, comprehensionQuestions: updated },
                                });
                              }}
                              className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-bold text-slate-400">Penjelasan Jawaban:</span>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => {
                            const updated = [...editingBook.content.comprehensionQuestions];
                            updated[qIndex] = { ...updated[qIndex], explanation: e.target.value };
                            setEditingBook({
                              ...editingBook,
                              content: { ...editingBook.content, comprehensionQuestions: updated },
                            });
                          }}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <Button
                variant="outline"
                size="md"
                onClick={() => setPreviewBook(editingBook)}
                icon={<Eye className="w-4 h-4" />}
              >
                Pratinjau Tampilan Siswa
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => handleSaveEditor(false)}
                  icon={<Save className="w-4 h-4" />}
                >
                  Simpan Draft
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSaveEditor(true)}
                  icon={<Globe className="w-4 h-4" />}
                >
                  Publish ke Siswa Sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FULLSCREEN DIGITAL BOOK READER PREVIEW                 */}
      {/* ======================================================== */}
      {previewBook && (
        <DigitalBookReader
          book={previewBook}
          onClose={() => setPreviewBook(null)}
          isPreviewMode={true}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  FileCheck,
  Eye,
  Trash2,
  Edit2,
  Paperclip,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Award,
  Users,
  RefreshCw,
  ExternalLink,
  Check,
} from 'lucide-react';
import { AssignmentItem, AssignmentSubmission } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  getAssignments,
  saveAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  gradeAssignmentSubmission,
} from '../../services/firestoreService';

interface AssignmentManagerProps {
  teacherId?: string;
  teacherName?: string;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({
  teacherId = 'guru-001',
  teacherName = 'Purwanto, S.Pd.',
}) => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<'Semua' | 'VII' | 'VIII' | 'IX'>('Semua');

  // Modal Create/Edit Assignment
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentItem | null>(null);

  // Submissions & Grading Modal
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [activeAssignmentForGrading, setActiveAssignmentForGrading] = useState<AssignmentItem | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [asgList, subList] = await Promise.all([
        getAssignments(),
        getAssignmentSubmissions(),
      ]);
      setAssignments(asgList);
      setSubmissions(subList);
    } catch (e) {
      console.error('Error loading assignments data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    const newAsg: AssignmentItem = {
      id: `asg-${Date.now()}`,
      title: '',
      description: '',
      material: '',
      targetGrade: 'VII',
      semester: 'Semester 1',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      points: 100,
      attachmentName: '',
      attachmentUrl: '',
      teacherId,
      teacherName,
    };
    setEditingAssignment(newAsg);
    setShowFormModal(true);
  };

  const handleOpenEdit = (asg: AssignmentItem) => {
    setEditingAssignment({ ...asg });
    setShowFormModal(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    if (!editingAssignment.title.trim() || !editingAssignment.material.trim()) {
      alert('Judul tugas dan materi wajib diisi.');
      return;
    }

    await saveAssignment(editingAssignment);
    await loadData();
    setShowFormModal(false);
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = async (id: string, title: string) => {
    if (confirm(`Hapus tugas "${title}"?`)) {
      await deleteAssignment(id);
      await loadData();
    }
  };

  const handleOpenSubmissions = (asg: AssignmentItem) => {
    setActiveAssignmentForGrading(asg);
    setShowGradingModal(true);
  };

  const handleGradeSubmission = async () => {
    if (!gradingSubmission) return;
    await gradeAssignmentSubmission(
      gradingSubmission.id,
      gradeInput,
      feedbackInput,
      teacherName
    );
    await loadData();
    setGradingSubmission(null);
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = filterGrade === 'Semua' || a.targetGrade === filterGrade;
    return matchSearch && matchGrade;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>📋 Kelola Tugas & Praktik Siswa</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Penugasan gerak mandiri, portofolio analisis teknik, video praktik, dan rubrik penilaian guru
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
          icon={<Plus className="w-4 h-4" />}
        >
          Buat Tugas Baru
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul tugas, materi, atau instruksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="VII">Kelas VII</option>
            <option value="VIII">Kelas VIII</option>
            <option value="IX">Kelas IX</option>
          </select>
        </div>
      </div>

      {/* Assignments list */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-xs">Memuat daftar tugas...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Belum Ada Tugas</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Klik tombol <strong>Buat Tugas Baru</strong> untuk memberikan instruksi praktik atau portofolio PJOK kepada siswa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((asg) => {
            const asgSubs = submissions.filter((s) => s.assignmentId === asg.id);
            const gradedCount = asgSubs.filter((s) => s.status === 'Dinilai').length;

            return (
              <Card
                key={asg.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="blue" size="sm">
                      {asg.material}
                    </Badge>
                    <span className="text-xs text-slate-500 font-bold">
                      Kelas {asg.targetGrade} • {asg.semester}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-3">
                      {asg.description}
                    </p>
                  </div>

                  {asg.attachmentName && (
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Paperclip className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{asg.attachmentName}</span>
                      </div>
                      {asg.attachmentUrl && (
                        <a
                          href={asg.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline shrink-0 ml-2 font-bold"
                        >
                          Buka
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      Batas: {asg.deadline}
                    </span>
                    <span>Poin Maks: <strong>{asg.points || 100}</strong></span>
                  </div>
                </div>

                {/* Submissions indicator and actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenSubmissions(asg)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{asgSubs.length} Terkumpul ({gradedCount} Dinilai)</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenSubmissions(asg)}
                    >
                      Periksa & Nilai
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(asg)}
                      title="Edit Tugas"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT TUGAS                               */}
      {/* ======================================================== */}
      {editingAssignment && (
        <Modal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title={editingAssignment.title ? 'Sunting Tugas PJOK' : 'Buat Tugas PJOK Baru'}
          subtitle="Tentukan judul, deskripsi instruksi, batas waktu, dan lampiran panduan rubrik"
        >
          <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Judul Tugas:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Video Praktik Mandiri Passing Bawah Bola Voli"
                value={editingAssignment.title}
                onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Materi / Topik PJOK:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bola Voli: Gerak Spesifik"
                  value={editingAssignment.material}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, material: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Target Kelas:</label>
                <select
                  value={editingAssignment.targetGrade}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, targetGrade: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="VII">Kelas VII (Fase D)</option>
                  <option value="VIII">Kelas VIII (Fase D)</option>
                  <option value="IX">Kelas IX (Fase D)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold block mb-1">Semester:</label>
                <select
                  value={editingAssignment.semester}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, semester: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Batas Waktu (Deadline):</label>
                <input
                  type="date"
                  value={editingAssignment.deadline}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, deadline: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Maksimal Poin:</label>
                <input
                  type="number"
                  value={editingAssignment.points || 100}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, points: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Petunjuk & Rincian Tugas:</label>
              <textarea
                rows={4}
                required
                placeholder="Jelaskan tahapan yang harus dipraktikkan siswa, durasi video jika ada, format penulisan dokumen, atau sikap yang dinilai..."
                value={editingAssignment.description}
                onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Nama Lampiran Dokumen/Rubrik (Opsional):</label>
                <input
                  type="text"
                  placeholder="Contoh: Rubrik_Penilaian_Passing_Bawah.pdf"
                  value={editingAssignment.attachmentName || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, attachmentName: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Tautan URL Lampiran (Opsional):</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={editingAssignment.attachmentUrl || ''}
                  onChange={(e) => setEditingAssignment({ ...editingAssignment, attachmentUrl: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowFormModal(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Simpan Tugas
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL: DAFTAR PENGUMPULAN & PENILAIAN TUGAS SISWA        */}
      {/* ======================================================== */}
      {activeAssignmentForGrading && (
        <Modal
          isOpen={showGradingModal}
          onClose={() => {
            setShowGradingModal(false);
            setGradingSubmission(null);
          }}
          title={`Pengumpulan: ${activeAssignmentForGrading.title}`}
          subtitle={`Batas: ${activeAssignmentForGrading.deadline} • Maks: ${activeAssignmentForGrading.points || 100} Poin`}
        >
          <div className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* If currently grading a specific submission */}
            {gradingSubmission ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Form Penilaian: {gradingSubmission.studentName} ({gradingSubmission.studentClass || 'VII-A'})
                  </h4>
                  <button
                    onClick={() => setGradingSubmission(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Kembali ke Daftar
                  </button>
                </div>

                {/* Submission Content Review */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-500 block">Isi Kiriman Siswa:</span>
                  {gradingSubmission.textContent && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 whitespace-pre-line">
                      {gradingSubmission.textContent}
                    </div>
                  )}

                  {gradingSubmission.videoUrl && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-500" />
                        <span className="font-bold">Video Praktik Mandiri</span>
                      </div>
                      <a
                        href={gradingSubmission.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                      >
                        Buka Video <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {gradingSubmission.fileUrl && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-blue-500" />
                        <span className="font-bold">Dokumen Portofolio</span>
                      </div>
                      <a
                        href={gradingSubmission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                      >
                        Unduh Berkas <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {gradingSubmission.photoUrl && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold">Foto Lembar Kerja / Praktik</span>
                      </div>
                      <a
                        href={gradingSubmission.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                      >
                        Lihat Foto <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Score & Feedback Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="font-bold block mb-1">Nilai (0–100):</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradeInput}
                      onChange={(e) => setGradeInput(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-black text-base text-blue-600 text-center"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold block mb-1">Catatan Umpan Balik Guru (Feedback):</label>
                    <textarea
                      rows={2}
                      placeholder="Berikan apresiasi, koreksi sikap gerak spesifik, atau saran peningkatan..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setGradingSubmission(null)}>
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGradeSubmission}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    icon={<Check className="w-4 h-4" />}
                  >
                    Simpan Nilai & Umpan Balik
                  </Button>
                </div>
              </div>
            ) : (
              /* List of submissions for this assignment */
              <div className="space-y-3">
                {submissions.filter((s) => s.assignmentId === activeAssignmentForGrading.id).length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">Belum Ada Siswa yang Mengumpulkan</p>
                    <p className="text-slate-500 text-[11px]">
                      Siswa dapat mengumpulkan tugas melalui menu 📋 Tugas di dashboard siswa masing-masing.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Nama Siswa</th>
                          <th className="p-3">Jenis Kiriman</th>
                          <th className="p-3">Waktu Kirim</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Nilai</th>
                          <th className="p-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {submissions
                          .filter((s) => s.assignmentId === activeAssignmentForGrading.id)
                          .map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                              <td className="p-3 font-bold text-slate-800 dark:text-white">
                                {sub.studentName}
                                <span className="text-[10px] text-slate-400 block">
                                  {sub.studentClass || 'VII-A'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 dark:text-slate-300">
                                <span className="inline-flex items-center gap-1">
                                  {sub.submissionType === 'video' && <Video className="w-3.5 h-3.5 text-rose-500" />}
                                  {sub.submissionType === 'file' && <Paperclip className="w-3.5 h-3.5 text-blue-500" />}
                                  {sub.submissionType === 'photo' && <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />}
                                  {sub.submissionType === 'text' && <FileText className="w-3.5 h-3.5 text-amber-500" />}
                                  <span className="capitalize">{sub.submissionType || 'Teks'}</span>
                                </span>
                              </td>
                              <td className="p-3 text-slate-400 text-[11px]">
                                {new Date(sub.submittedAt).toLocaleDateString('id-ID')}
                              </td>
                              <td className="p-3 text-center">
                                <Badge variant={sub.status === 'Dinilai' ? 'emerald' : 'amber'} size="sm">
                                  {sub.status}
                                </Badge>
                              </td>
                              <td className="p-3 text-center font-black text-sm">
                                {sub.grade !== undefined ? (
                                  <span className="text-emerald-600">{sub.grade}</span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    setGradingSubmission(sub);
                                    setGradeInput(sub.grade ?? 85);
                                    setFeedbackInput(sub.feedback || '');
                                  }}
                                >
                                  {sub.status === 'Dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowGradingModal(false);
                  setGradingSubmission(null);
                }}
              >
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

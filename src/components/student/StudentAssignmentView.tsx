import React, { useState, useEffect } from 'react';
import {
  FileText,
  Paperclip,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  Upload,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  User,
  AssignmentItem,
  AssignmentSubmission,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  getAssignments,
  getAssignmentSubmissions,
  submitAssignment,
} from '../../services/firestoreService';

interface StudentAssignmentViewProps {
  currentUser: User;
  onUpdateStats?: (xpToAdd: number) => void;
}

export const StudentAssignmentView: React.FC<StudentAssignmentViewProps> = ({
  currentUser,
  onUpdateStats,
}) => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<AssignmentItem | null>(null);
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'video' | 'photo' | 'mixed'>('video');
  const [textContent, setTextContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allAsg, allSubs] = await Promise.all([
        getAssignments(),
        getAssignmentSubmissions(),
      ]);
      setAssignments(allAsg);
      const mySubs = allSubs.filter((s) => s.studentId === currentUser.id);
      setSubmissions(mySubs);
    } catch (e) {
      console.error('Error loading assignments:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (asg: AssignmentItem) => {
    setActiveAssignment(asg);
    // Pre-fill if already submitted
    const existing = submissions.find((s) => s.assignmentId === asg.id);
    if (existing) {
      setSubmissionType(existing.submissionType || 'text');
      setTextContent(existing.textContent || '');
      setFileUrl(existing.fileUrl || '');
      setFileName(existing.fileName || '');
      setVideoUrl(existing.videoUrl || '');
      setPhotoUrl(existing.photoUrl || '');
    } else {
      setSubmissionType('video');
      setTextContent('');
      setFileUrl('');
      setFileName('');
      setVideoUrl('');
      setPhotoUrl('');
    }
    setShowSubmitModal(true);
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setSubmitting(true);
    try {
      const existing = submissions.find((s) => s.assignmentId === activeAssignment.id);
      const payload: AssignmentSubmission = {
        id: existing?.id || `sub-${Date.now()}`,
        assignmentId: activeAssignment.id,
        assignmentTitle: activeAssignment.title,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentClass: currentUser.class || currentUser.kelas || 'VII-A',
        submittedAt: new Date().toISOString(),
        submissionType,
        textContent: textContent.trim() ? textContent : undefined,
        fileUrl: fileUrl.trim() ? fileUrl : undefined,
        fileName: fileName.trim() ? fileName : undefined,
        videoUrl: videoUrl.trim() ? videoUrl : undefined,
        photoUrl: photoUrl.trim() ? photoUrl : undefined,
        status: existing?.status === 'Dinilai' ? 'Dinilai' : 'Menunggu Penilaian',
        grade: existing?.grade,
        feedback: existing?.feedback,
      };

      await submitAssignment(payload);

      // Award XP for initial submission
      if (!existing && onUpdateStats) {
        onUpdateStats(50);
      }

      await loadData();
      setShowSubmitModal(false);
      setActiveAssignment(null);
    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Gagal mengirim tugas. Silakan periksa kembali tautan berkas Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>📋 Tugas & Praktik Mandiri PJOK</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Kirimkan dokumentasi video gerak spesifik, portofolio analisis, atau lembar kerja praktik mandiri
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-xs">Memuat tugas siswa...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-white">Belum Ada Tugas</h4>
          <p className="text-xs text-slate-500 mt-1">
            Belum ada tugas atau penugasan praktik mandiri yang diberikan oleh guru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asg) => {
            const mySub = submissions.find((s) => s.assignmentId === asg.id);
            const isSubmitted = !!mySub;
            const isGraded = mySub?.status === 'Dinilai';

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
                    <span className="text-xs font-bold text-slate-400">
                      Batas: {asg.deadline}
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
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Paperclip className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{asg.attachmentName}</span>
                      </div>
                      {asg.attachmentUrl && (
                        <a
                          href={asg.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-bold shrink-0 ml-2"
                        >
                          Buka Rubrik
                        </a>
                      )}
                    </div>
                  )}

                  {/* Submission Status Pill */}
                  <div className="pt-2">
                    {isGraded ? (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                            Telah Dinilai Guru:
                          </span>
                          <span className="text-lg font-black text-emerald-800 dark:text-emerald-200">
                            {mySub.grade} / {asg.points || 100}
                          </span>
                        </div>
                        {mySub.feedback && (
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] italic bg-white dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
                            💬 "{mySub.feedback}"
                          </p>
                        )}
                      </div>
                    ) : isSubmitted ? (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>Sudah Dikirim • Menunggu Penilaian</span>
                        </div>
                        <Badge variant="amber" size="sm">Terkirim</Badge>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 flex items-center justify-between">
                        <span>Status: Belum Mengumpulkan</span>
                        <span className="text-rose-500 font-bold">Segera Selesaikan</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  <Button
                    variant={isSubmitted ? 'outline' : 'primary'}
                    size="sm"
                    className={!isSubmitted ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold' : ''}
                    onClick={() => handleOpenSubmit(asg)}
                    icon={<Upload className="w-4 h-4" />}
                  >
                    {isSubmitted ? 'Perbarui Kiriman' : 'Kumpulkan Tugas'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PENGUMPULAN TUGAS OLEH SISWA                      */}
      {/* ======================================================== */}
      {activeAssignment && (
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title={`Kumpulkan Tugas: ${activeAssignment.title}`}
          subtitle={`Materi: ${activeAssignment.material} • Batas: ${activeAssignment.deadline}`}
        >
          <form onSubmit={handleSubmitAssignment} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-blue-900 dark:text-blue-300">
              <p className="font-bold mb-1">Instruksi Tugas:</p>
              <p className="text-[11px] leading-relaxed">{activeAssignment.description}</p>
            </div>

            {/* Type Selector (Teks, Berkas, Foto, Video) */}
            <div>
              <label className="font-bold block mb-2 text-slate-800 dark:text-slate-200">
                Pilih Bentuk Pengumpulan:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'video', label: 'Video Praktik', icon: <Video className="w-4 h-4" /> },
                  { key: 'photo', label: 'Foto Bukti', icon: <ImageIcon className="w-4 h-4" /> },
                  { key: 'file', label: 'Dokumen / File', icon: <Paperclip className="w-4 h-4" /> },
                  { key: 'text', label: 'Laporan Teks', icon: <FileText className="w-4 h-4" /> },
                ].map((item) => {
                  const isSelected = submissionType === item.key;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setSubmissionType(item.key as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-bold transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs based on type */}
            {submissionType === 'video' && (
              <div className="space-y-2">
                <label className="font-bold block">Tautan Video Praktik (YouTube / Google Drive / Cloud Link):</label>
                <input
                  type="url"
                  required
                  placeholder="https://youtu.be/... atau https://drive.google.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  *Pastikan akses link Google Drive telah diatur ke "Siapa saja dengan link" (Viewer).
                </p>
              </div>
            )}

            {submissionType === 'photo' && (
              <div className="space-y-2">
                <label className="font-bold block">Tautan Foto / Dokumentasi Gerak:</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... atau URL foto"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            )}

            {submissionType === 'file' && (
              <div className="space-y-2">
                <label className="font-bold block">Nama Berkas & Tautan File Portofolio:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Laporan_Analisis_Siswa.pdf"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="url"
                    required
                    placeholder="Tautan URL Berkas Google Drive / Cloud"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Always provide Text field for notes/explanations */}
            <div>
              <label className="font-bold block mb-1">
                Catatan / Refleksi Pengerjaan Siswa (Teks):
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan catatan gerakan yang dirasa sulit, refleksi kemandirian gerak, atau pesan untuk guru..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                icon={submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              >
                {submitting ? 'Mengirim Tugas...' : 'Kirim Tugas Sekarang'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

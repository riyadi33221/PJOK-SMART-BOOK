import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Copy,
  Search,
  Users,
  Calendar,
  Layers,
  Globe,
  RefreshCw,
  Clock,
  Check,
} from 'lucide-react';
import { CompetencyTestItem, CompetencySubmission } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  getCompetencyTests,
  saveCompetencyTest,
  deleteCompetencyTest,
  reorderCompetencyTests,
  getCompetencySubmissions,
} from '../../services/firestoreService';

interface CompetencyTestManagerProps {
  teacherId?: string;
  teacherName?: string;
}

export const CompetencyTestManager: React.FC<CompetencyTestManagerProps> = ({
  teacherId = 'guru-001',
  teacherName = 'Purwanto, S.Pd.',
}) => {
  const [tests, setTests] = useState<CompetencyTestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('Semua');

  // Modal create/edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CompetencyTestItem | null>(null);

  // Submissions review modal
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedTestForReview, setSelectedTestForReview] = useState<CompetencyTestItem | null>(null);
  const [submissions, setSubmissions] = useState<CompetencySubmission[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      const data = await getCompetencyTests();
      setTests(data);
    } catch (err) {
      console.error('Error loading tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    const newItem: CompetencyTestItem = {
      id: `cbt-${Date.now()}`,
      name: '',
      title: '',
      material: '',
      topic: '',
      targetGrade: 'VII',
      semester: 'Semester 1',
      description: '',
      url: '',
      cbtLink: '',
      platform: 'Google Forms',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      points: 100,
      status: 'Aktif',
      order: tests.length + 1,
      teacherId,
    };
    setEditingItem(newItem);
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: CompetencyTestItem) => {
    setEditingItem({ ...item });
    setShowFormModal(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.name.trim() || !editingItem.url.trim()) {
      alert('Nama asesmen dan URL wajib diisi.');
      return;
    }

    const payload: CompetencyTestItem = {
      ...editingItem,
      title: editingItem.name,
      cbtLink: editingItem.url,
      topic: editingItem.material,
      deadline: editingItem.endDate,
    };

    await saveCompetencyTest(payload);
    await loadTests();
    setShowFormModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus tautan uji kompetensi "${name}"?`)) {
      await deleteCompetencyTest(id);
      await loadTests();
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= tests.length) return;

    const list = [...tests];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    setTests(list);
    await reorderCompetencyTests(list);
  };

  const handleCopyLink = (item: CompetencyTestItem) => {
    const url = item.url || item.cbtLink || '';
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (item: CompetencyTestItem) => {
    const newStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const updated = { ...item, status: newStatus as any };
    await saveCompetencyTest(updated);
    await loadTests();
  };

  const handleViewSubmissions = async (item: CompetencyTestItem) => {
    setSelectedTestForReview(item);
    setShowSubmissionsModal(true);
    try {
      const subs = await getCompetencySubmissions();
      setSubmissions(subs.filter((s) => s.testId === item.id));
    } catch (e) {
      console.error('Error fetching submissions:', e);
    }
  };

  const filteredTests = tests.filter((t) => {
    const matchSearch =
      (t.name || t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.material || t.topic || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlatform = filterPlatform === 'Semua' || t.platform === filterPlatform;
    return matchSearch && matchPlatform;
  });

  const getPlatformBadge = (platform?: string) => {
    switch (platform) {
      case 'Google Forms':
        return <Badge variant="purple" size="sm">Google Forms</Badge>;
      case 'Quizizz':
        return <Badge variant="rose" size="sm">Quizizz Live</Badge>;
      case 'Wordwall':
        return <Badge variant="blue" size="sm">Wordwall</Badge>;
      case 'Microsoft Forms':
        return <Badge variant="emerald" size="sm">MS Forms</Badge>;
      default:
        return <Badge variant="slate" size="sm">{platform || 'Link CBT'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-purple-600" />
            <span>🎯 Uji Kompetensi Berbasis Tautan</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Integrasi asesmen sumatif/formatif eksternal (Google Forms, Quizizz, Wordwall, MS Forms) dengan urutan interaktif
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          icon={<Plus className="w-4 h-4" />}
        >
          Tambah Tautan Asesmen
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama asesmen, materi, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Semua">Semua Platform Asesmen</option>
            <option value="Google Forms">Google Forms</option>
            <option value="Quizizz">Quizizz</option>
            <option value="Wordwall">Wordwall</option>
            <option value="Microsoft Forms">Microsoft Forms</option>
          </select>
        </div>
      </div>

      {/* Tests List with Reorder Controls */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-xs">Memuat tautan uji kompetensi...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Belum Ada Tautan Asesmen</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Klik tombol <strong>Tambah Tautan Asesmen</strong> untuk menautkan Google Forms, Quizizz, atau Wordwall.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredTests.map((item, idx) => {
            const isActive = item.status === 'Aktif';
            const url = item.url || item.cbtLink;

            return (
              <Card
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Left reorder buttons + content */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 hover:text-purple-600 disabled:opacity-20 disabled:hover:text-slate-400"
                      title="Urutkan Naik"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-slate-500">{idx + 1}</span>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === tests.length - 1}
                      className="p-1 hover:text-purple-600 disabled:opacity-20 disabled:hover:text-slate-400"
                      title="Urutkan Turun"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getPlatformBadge(item.platform)}

                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {isActive ? '● Status: Aktif' : '○ Status: Nonaktif'}
                      </button>

                      <span className="text-xs text-slate-500 font-semibold">
                        Kelas {item.targetGrade} • {item.semester}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {item.name || item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Materi:</strong> {item.material || item.topic}
                    </p>

                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Periode: {item.startDate} s/d {item.endDate || item.deadline}
                      </span>
                      <span>•</span>
                      <span>Maks: <strong>{item.points || 100} Poin</strong></span>
                    </div>

                    <div className="pt-1 text-xs">
                      <span className="text-slate-400">URL Tautan: </span>
                      <code className="text-purple-600 dark:text-purple-400 break-all font-mono text-[11px]">
                        {url}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 flex-wrap md:flex-col lg:flex-row shrink-0 self-end md:self-center">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  >
                    <span>Buka Tautan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(item)}
                    icon={copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedId === item.id ? 'Tersalin!' : 'Salin URL'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewSubmissions(item)}
                    title="Lihat Konfirmasi Siswa"
                  >
                    <Users className="w-4 h-4 text-blue-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Asesmen"
                  >
                    <Edit2 className="w-4 h-4 text-amber-500" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.name || item.title || 'Asesmen')}
                    title="Hapus Asesmen"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT ASESMEN TAUTAN                      */}
      {/* ======================================================== */}
      {editingItem && (
        <Modal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title={editingItem.title ? 'Sunting Uji Kompetensi' : 'Tambah Tautan Uji Kompetensi'}
          subtitle="Form data asesmen eksternal Google Forms, Quizizz, Wordwall, dll."
        >
          <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Nama Asesmen:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Penilaian Tengah Semester (PTS) Gasal PJOK"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Materi / Bab PJOK:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bola Besar & Atletik"
                  value={editingItem.material}
                  onChange={(e) => setEditingItem({ ...editingItem, material: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Platform Asesmen:</label>
                <select
                  value={editingItem.platform}
                  onChange={(e) => setEditingItem({ ...editingItem, platform: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="Google Forms">Google Forms</option>
                  <option value="Quizizz">Quizizz</option>
                  <option value="Wordwall">Wordwall</option>
                  <option value="Microsoft Forms">Microsoft Forms</option>
                  <option value="Lainnya">Platform CBT Lainnya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold block mb-1">Kelas:</label>
                <select
                  value={editingItem.targetGrade}
                  onChange={(e) => setEditingItem({ ...editingItem, targetGrade: e.target.value as any })}
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
                  value={editingItem.semester}
                  onChange={(e) => setEditingItem({ ...editingItem, semester: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Maks Poin:</label>
                <input
                  type="number"
                  value={editingItem.points || 100}
                  onChange={(e) => setEditingItem({ ...editingItem, points: Number(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Status:</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">URL / Link Eksternal CBT:</label>
              <input
                type="url"
                required
                placeholder="https://forms.google.com/..."
                value={editingItem.url}
                onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Tanggal Mulai:</label>
                <input
                  type="date"
                  value={editingItem.startDate}
                  onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Tanggal Selesai (Deadline):</label>
                <input
                  type="date"
                  value={editingItem.endDate}
                  onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Deskripsi / Petunjuk untuk Siswa:</label>
              <textarea
                rows={3}
                placeholder="Petunjuk pengerjaan asesmen, jumlah butir soal, dan tata tertib pengerjaan..."
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowFormModal(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Simpan Asesmen
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL: LIHAT KONFIRMASI SISWA                            */}
      {/* ======================================================== */}
      {selectedTestForReview && (
        <Modal
          isOpen={showSubmissionsModal}
          onClose={() => setShowSubmissionsModal(false)}
          title={`Konfirmasi Pengerjaan Siswa: ${selectedTestForReview.name || selectedTestForReview.title}`}
          subtitle={`Platform: ${selectedTestForReview.platform} • Batas: ${selectedTestForReview.endDate}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-300">
              <p>
                <strong>Catatan Integrasi:</strong> Karena platform CBT eksternal ({selectedTestForReview.platform}) bersifat terpisah tanpa API langsung ke sistem sekolah, status berikut dicatat berdasarkan konfirmasi mandiri siswa setelah menyelesaikan soal di tautan eksternal.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-bold">Belum ada konfirmasi dari siswa</p>
                <p className="text-[11px] text-slate-500">
                  Siswa akan muncul di sini setelah menekan tombol "Saya Sudah Selesai Mengerjakan" di dashboard mereka.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">Waktu Konfirmasi</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">XP Didapat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="p-3 font-bold text-slate-800 dark:text-white">
                          {sub.studentName}
                        </td>
                        <td className="p-3 text-slate-500">
                          {new Date(sub.completedAt).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="emerald" size="sm">
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-center font-bold text-purple-600">
                          +{sub.xpEarned || 50} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowSubmissionsModal(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Users,
  GraduationCap,
  Sliders,
  Settings,
  ShieldAlert,
  Plus,
  Edit3,
  CheckCircle2,
  Save,
  Trash2,
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  Database,
  RefreshCw,
  UserX,
  UserCheck,
} from 'lucide-react';
import {
  Student,
  Teacher,
  ClassRoom,
  Semester,
  AppSettings,
  StudentListItem,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Table, Column } from '../common/Table';

interface AdminViewsProps {
  activeMenu: string;
  students: Student[];
  teachers?: Teacher[];
  classes: ClassRoom[];
  semesters?: Semester[];
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onAddStudent?: (student: Omit<Student, 'id'>) => Promise<void>;
  onUpdateStudent?: (id: string, updates: Partial<Student>) => Promise<void>;
  onDeactivateStudent?: (id: string) => Promise<void>;
  onBatchImportStudents?: (studentsList: Omit<Student, 'id'>[]) => Promise<number>;
  onAddTeacher?: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  onUpdateTeacher?: (id: string, updates: Partial<Teacher>) => Promise<void>;
  onAddClass?: (cls: ClassRoom) => Promise<void>;
  onUpdateClass?: (id: string, updates: Partial<ClassRoom>) => Promise<void>;
  onUpdateSemester?: (id: string, updates: Partial<Semester>) => Promise<void>;
}

export const AdminViews: React.FC<AdminViewsProps> = ({
  activeMenu,
  students,
  teachers = [],
  classes,
  semesters = [],
  settings,
  onUpdateSettings,
  onAddStudent,
  onUpdateStudent,
  onDeactivateStudent,
  onBatchImportStudents,
  onAddTeacher,
  onUpdateTeacher,
  onAddClass,
  onUpdateClass,
  onUpdateSemester,
}) => {
  // Settings state
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [semester, setSemester] = useState(settings.activeSemester);
  const [creatorName, setCreatorName] = useState(settings.creatorName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Student Modals & Form State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({
    nisn: '',
    nis: '',
    name: '',
    gender: 'L' as 'L' | 'P',
    classId: 'VII-A',
    academicYear: settings.academicYear || '2024/2025',
    email: '',
    status: 'active' as 'active' | 'inactive',
  });

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedRows, setImportedRows] = useState<Omit<Student, 'id'>[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Teacher Modals State
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    nip: '',
    name: '',
    email: '',
    phone: '',
    assignedClasses: 'Kelas VII & VIII',
    status: 'active' as 'active' | 'inactive',
    roleTitle: 'Guru PJOK',
  });

  // Class Grade filter
  const [gradeFilter, setGradeFilter] = useState<'Semua' | 'VII' | 'VIII' | 'IX'>('Semua');
  const filteredClasses =
    gradeFilter === 'Semua' ? classes : classes.filter((c) => c.grade === gradeFilter);

  // Save General Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      schoolName,
      academicYear,
      activeSemester: semester,
      creatorName,
      tagline,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Open Add Student Modal
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({
      nisn: '',
      nis: '',
      name: '',
      gender: 'L',
      classId: classes[0]?.name || 'VII-A',
      academicYear: settings.academicYear || '2024/2025',
      email: '',
      status: 'active',
    });
    setIsStudentModalOpen(true);
  };

  // Open Edit Student Modal
  const handleOpenEditStudent = (s: Student) => {
    setEditingStudent(s);
    setStudentForm({
      nisn: s.nisn,
      nis: s.nis || '',
      name: s.name,
      gender: s.gender,
      classId: s.classId || s.kelas || 'VII-A',
      academicYear: s.academicYear || settings.academicYear || '2024/2025',
      email: s.email || '',
      status: s.status || 'active',
    });
    setIsStudentModalOpen(true);
  };

  // Submit Student Form
  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      if (onUpdateStudent) {
        await onUpdateStudent(editingStudent.id, {
          ...studentForm,
          kelas: studentForm.classId,
        });
      }
    } else {
      if (onAddStudent) {
        await onAddStudent({
          studentId: `std-${Date.now()}`,
          ...studentForm,
          xp: 200,
          attendanceRate: 100,
          avgScore: 85,
          attitude: 'Baik',
          lastActive: 'Hari ini',
        });
      }
    }
    setIsStudentModalOpen(false);
  };

  // Download CSV Import Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'nisn,nis,name,gender,classId,academicYear,email\n' +
      '0098471201,24250001,Andi Pratama,L,VII-A,2024/2025,andi.pratama@smpn2kutasari.sch.id\n' +
      '0098471202,24250002,Bunga Citra,P,VII-A,2024/2025,bunga.citra@smpn2kutasari.sch.id\n' +
      '0098471203,24250003,Candra Wijaya,L,VII-B,2024/2025,candra.wijaya@smpn2kutasari.sch.id\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Template_Import_Siswa_PJOK_SMPN2Kutasari.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Current Students to CSV (Backup)
  const handleExportStudents = () => {
    let csvContent = 'nisn,nis,name,gender,classId,academicYear,email,status,attendanceRate,avgScore\n';
    students.forEach((s) => {
      csvContent += `${s.nisn},${s.nis || ''},"${s.name}",${s.gender},${s.classId || s.kelas || ''},${s.academicYear || ''},${s.email || ''},${s.status || 'active'},${s.attendanceRate || 0},${s.avgScore || 0}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Backup_Siswa_PJOK_${settings.academicYear.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse & Validate CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setImportErrors(['File CSV kosong atau tidak memiliki baris data.']);
        return;
      }

      const errors: string[] = [];
      const validRows: Omit<Student, 'id'>[] = [];

      // Line 0 is header
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((item) => item.trim().replace(/^"|"$/g, ''));
        if (row.length < 5) {
          errors.push(`Baris ${i + 1}: Kolom tidak lengkap.`);
          continue;
        }

        const [nisn, nis, name, gender, classId, academicYear, email] = row;

        // Validation rules
        if (!nisn || nisn.length < 8) {
          errors.push(`Baris ${i + 1}: NISN '${nisn}' tidak valid (minimal 8-10 digit).`);
          continue;
        }

        if (!name || name.length < 2) {
          errors.push(`Baris ${i + 1}: Nama siswa tidak boleh kosong.`);
          continue;
        }

        const parsedGender = gender?.toUpperCase() === 'P' ? 'P' : 'L';

        validRows.push({
          studentId: `std-imp-${Date.now()}-${i}`,
          nisn,
          nis: nis || `2425${i.toString().padStart(4, '0')}`,
          name,
          gender: parsedGender,
          classId: classId || 'VII-A',
          academicYear: academicYear || settings.academicYear || '2024/2025',
          email: email || `${name.toLowerCase().replace(/\s+/g, '.')}.vii@smpn2kutasari.sch.id`,
          status: 'active',
          xp: 150,
          attendanceRate: 100,
          avgScore: 80,
          attitude: 'Baik',
          lastActive: 'Belum pernah',
        });
      }

      setImportErrors(errors);
      setImportedRows(validRows);
    };

    reader.readAsText(file);
  };

  // Commit batch import to Firestore
  const handleExecuteImport = async () => {
    if (importedRows.length === 0) return;
    setIsImporting(true);
    try {
      if (onBatchImportStudents) {
        await onBatchImportStudents(importedRows);
      }
      setIsImportModalOpen(false);
      setImportedRows([]);
      setImportErrors([]);
    } catch (error) {
      console.error('Import error:', error);
      setImportErrors(['Terjadi kesalahan saat menyimpan data ke Firestore.']);
    } finally {
      setIsImporting(false);
    }
  };

  // Open Add Teacher Modal
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherForm({
      nip: '',
      name: '',
      email: '',
      phone: '',
      assignedClasses: 'Kelas VII & VIII',
      status: 'active',
      roleTitle: 'Guru PJOK',
    });
    setIsTeacherModalOpen(true);
  };

  // Open Edit Teacher Modal
  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setTeacherForm({
      nip: t.nip,
      name: t.name,
      email: t.email,
      phone: t.phone || '',
      assignedClasses: t.assignedClasses || 'Kelas VII',
      status: t.status || 'active',
      roleTitle: t.roleTitle || 'Guru PJOK',
    });
    setIsTeacherModalOpen(true);
  };

  const handleSubmitTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      if (onUpdateTeacher) {
        await onUpdateTeacher(editingTeacher.id, teacherForm);
      }
    } else {
      if (onAddTeacher) {
        await onAddTeacher({
          teacherId: `tea-${Date.now()}`,
          ...teacherForm,
        });
      }
    }
    setIsTeacherModalOpen(false);
  };

  // 1. VIEW: DATA SISWA
  if (activeMenu === 'data_siswa') {
    const columns: Column<Student>[] = [
      { key: 'nisn', header: 'NISN', width: '120px' },
      {
        key: 'name',
        header: 'Nama Siswa',
        render: (row) => (
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{row.name}</span>
            <span className="text-[11px] text-slate-400">{row.email || row.nis || '-'}</span>
          </div>
        ),
      },
      {
        key: 'classId',
        header: 'Kelas',
        align: 'center',
        width: '90px',
        render: (row) => row.classId || row.kelas || 'VII-A',
      },
      {
        key: 'gender',
        header: 'JK',
        align: 'center',
        width: '60px',
        render: (row) => (
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold ${
              row.gender === 'L'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                : 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300'
            }`}
          >
            {row.gender}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
        width: '90px',
        render: (row) => (
          <Badge variant={row.status === 'inactive' ? 'slate' : 'emerald'} size="sm">
            {row.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
          </Badge>
        ),
      },
      {
        key: 'attendanceRate',
        header: 'Presensi',
        align: 'center',
        render: (row) => `${row.attendanceRate || 95}%`,
      },
      {
        key: 'avgScore',
        header: 'Nilai Rata-rata',
        align: 'center',
        render: (row) => row.avgScore || 85,
      },
      {
        key: 'id',
        header: 'Aksi',
        align: 'right',
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => handleOpenEditStudent(row)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Data Siswa"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeactivateStudent && onDeactivateStudent(row.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title={row.status === 'inactive' ? 'Aktifkan Siswa' : 'Nonaktifkan Siswa'}
            >
              {row.status === 'inactive' ? (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <UserX className="w-4 h-4 text-rose-500" />
              )}
            </button>
          </div>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <span>Manajemen Siswa SMPN 2 Kutasari</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Total {students.length} siswa tersimpan di Cloud Firestore
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportStudents}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Import CSV / Excel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddStudent}
            >
              Tambah Siswa
            </Button>
          </div>
        </div>

        <Table columns={columns} data={students} keyExtractor={(r) => r.id} />

        {/* Modal: Tambah/Edit Siswa */}
        <Modal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          title={editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
          subtitle="Simpan data profil siswa ke database Cloud Firestore"
          maxWidth="md"
        >
          <form onSubmit={handleSubmitStudent} className="space-y-3.5 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NISN (10 Digit):
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.nisn}
                  onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="0098471203"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NIS Lokal:
                </label>
                <input
                  type="text"
                  value={studentForm.nis}
                  onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="24250001"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Siswa:
              </label>
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Ahmad Pratama"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jenis Kelamin:
                </label>
                <select
                  value={studentForm.gender}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, gender: e.target.value as 'L' | 'P' })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Rombel / Kelas:
                </label>
                <select
                  value={studentForm.classId}
                  onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      Kelas {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tahun Pelajaran:
                </label>
                <input
                  type="text"
                  value={studentForm.academicYear}
                  onChange={(e) => setStudentForm({ ...studentForm, academicYear: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status Siswa:
                </label>
                <select
                  value={studentForm.status}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      status: e.target.value as 'active' | 'inactive',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Sekolah:
              </label>
              <input
                type="email"
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="nama.siswa@smpn2kutasari.sch.id"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsStudentModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
                {editingStudent ? 'Perbarui Data' : 'Simpan Siswa'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Import Data Siswa dari CSV/Excel */}
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Import Data Siswa (CSV / Excel)"
          subtitle="Unggah berkas CSV untuk menambahkan siswa secara massal ke Cloud Firestore"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-200">
                  Petunjuk Format Berkas CSV
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Kolom wajib: <code>nisn, nis, name, gender, classId, academicYear, email</code>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDownloadTemplate}
              >
                Unduh Template CSV
              </Button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-850/50"
            >
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Pilih atau seret berkas CSV ke sini
              </p>
              <p className="text-xs text-slate-400 mt-1">Mendukung format .csv UTF-8</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Error logs */}
            {importErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1 text-xs text-rose-700 dark:text-rose-300">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Ditemukan {importErrors.length} Catatan Validasi:</span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 max-h-28 overflow-y-auto">
                  {importErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview valid rows */}
            {importedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Preview Data Valid ({importedRows.length} Siswa Siap Diimport)
                  </span>
                  <Badge variant="emerald" size="sm">
                    Validasi Lolos
                  </Badge>
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sticky top-0">
                      <tr>
                        <th className="p-2">NISN</th>
                        <th className="p-2">Nama</th>
                        <th className="p-2">JK</th>
                        <th className="p-2">Kelas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {importedRows.slice(0, 10).map((r, i) => (
                        <tr key={i}>
                          <td className="p-2 font-mono">{r.nisn}</td>
                          <td className="p-2 font-bold">{r.name}</td>
                          <td className="p-2">{r.gender}</td>
                          <td className="p-2">{r.classId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {importedRows.length > 10 && (
                  <p className="text-[11px] text-slate-400">
                    ...dan {importedRows.length - 10} siswa lainnya.
                  </p>
                )}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportedRows([]);
                  setImportErrors([]);
                }}
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={importedRows.length === 0 || isImporting}
                onClick={handleExecuteImport}
                icon={
                  isImporting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )
                }
              >
                {isImporting
                  ? 'Menyimpan ke Firestore...'
                  : `Import ${importedRows.length} Siswa`}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // 2. VIEW: DATA GURU
  if (activeMenu === 'data_guru') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-500" />
              <span>Data Guru PJOK SMPN 2 Kutasari</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pendidik Pendidikan Jasmani, Olahraga, dan Kesehatan terdaftar ({teachers.length} Guru)
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddTeacher}
          >
            Tambah Guru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map((tea) => (
            <Card key={tea.id} className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{tea.name}</h4>
                  <Badge variant={tea.status === 'active' ? 'emerald' : 'slate'} size="sm">
                    {tea.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono">NIP: {tea.nip}</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {tea.roleTitle || 'Guru PJOK'}
                </p>
                <p className="text-xs text-slate-500">Email: {tea.email}</p>
                <p className="text-xs text-slate-400">Tugas: {tea.assignedClasses}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => handleOpenEditTeacher(tea)}
              >
                Edit
              </Button>
            </Card>
          ))}
        </div>

        {/* Modal: Tambah/Edit Guru */}
        <Modal
          isOpen={isTeacherModalOpen}
          onClose={() => setIsTeacherModalOpen(false)}
          title={editingTeacher ? 'Edit Data Guru' : 'Tambah Guru PJOK'}
          subtitle="Kelola profil pendidik olahraga pada sistem PJOK SMART BOOK"
          maxWidth="md"
        >
          <form onSubmit={handleSubmitTeacher} className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP Pendidik:
              </label>
              <input
                type="text"
                required
                value={teacherForm.nip}
                onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="19780512 200501 1 008"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar:
              </label>
              <input
                type="text"
                required
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Purwanto, S.Pd."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  required
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  No. Telepon / WhatsApp:
                </label>
                <input
                  type="text"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kelas yang Diampu:
              </label>
              <input
                type="text"
                value={teacherForm.assignedClasses}
                onChange={(e) => setTeacherForm({ ...teacherForm, assignedClasses: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Kelas VII (A-F), Kelas VIII (A-C)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Peran / Jabatan:
                </label>
                <input
                  type="text"
                  value={teacherForm.roleTitle}
                  onChange={(e) => setTeacherForm({ ...teacherForm, roleTitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status:
                </label>
                <select
                  value={teacherForm.status}
                  onChange={(e) =>
                    setTeacherForm({
                      ...teacherForm,
                      status: e.target.value as 'active' | 'inactive',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="active">Aktif Mengajar</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsTeacherModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
                {editingTeacher ? 'Perbarui Data Guru' : 'Simpan Guru'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 3. VIEW: DATA KELAS & SEMESTER
  if (activeMenu === 'data_kelas') {
    const columns: Column<ClassRoom>[] = [
      {
        key: 'name',
        header: 'Rombongan Belajar',
        render: (row) => (
          <span className="font-black text-slate-900 dark:text-white text-base">
            Kelas {row.name}
          </span>
        ),
      },
      {
        key: 'grade',
        header: 'Tingkat',
        align: 'center',
        render: (row) => (
          <Badge
            variant={
              row.grade === 'VII'
                ? 'emerald'
                : row.grade === 'VIII'
                ? 'blue'
                : 'amber'
            }
            size="sm"
          >
            Tingkat {row.grade}
          </Badge>
        ),
      },
      {
        key: 'totalStudents',
        header: 'Kapasitas Siswa',
        align: 'center',
        render: (row) => `${row.totalStudents} Siswa`,
      },
      {
        key: 'homeroomTeacher',
        header: 'Wali Kelas',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-amber-500" />
              <span>Data Rombel & Semester</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pengaturan rombongan belajar VII-A sampai IX-F dan Semester Aktif
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['Semua', 'VII', 'VIII', 'IX'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  gradeFilter === g
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {g === 'Semua' ? 'Semua Tingkat' : `Kelas ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* Semester quick switch card */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500/10 border-amber-500/30">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Status Semester Pembelajaran Aktif
            </h4>
            <p className="text-xs text-slate-500">
              Tahun Ajaran {settings.academicYear} • Saat ini:{' '}
              <strong className="text-amber-600 dark:text-amber-400">
                {settings.activeSemester}
              </strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['Semester 1', 'Semester 2'] as const).map((sem) => (
              <Button
                key={sem}
                size="sm"
                variant={settings.activeSemester === sem ? 'primary' : 'outline'}
                onClick={() => {
                  onUpdateSettings({ activeSemester: sem });
                  if (onUpdateSemester) {
                    onUpdateSemester(sem === 'Semester 1' ? 'sem-1' : 'sem-2', { isActive: true });
                  }
                }}
              >
                {sem}
              </Button>
            ))}
          </div>
        </Card>

        <Table columns={columns} data={filteredClasses} keyExtractor={(c) => c.id} />
      </div>
    );
  }

  // 4. VIEW: USER MANAGEMENT & HAK AKSES
  if (activeMenu === 'user_mgmt') {
    const rolesSummary = [
      {
        role: 'ADMIN',
        desc: 'Akses penuh sistem, manajemen pengguna, pengaturan aplikasi, dan ekspor data',
        count: 1,
        color: 'amber',
      },
      {
        role: 'GURU',
        desc: 'Pengelolaan materi, kuis, asesmen sikap, presensi kelas, dan penginputan nilai',
        count: teachers.length || 4,
        color: 'blue',
      },
      {
        role: 'SISWA',
        desc: 'Membaca modul digital, mengerjakan kuis sendiri, melihat nilai pribadi, absensi, dan lencana XP',
        count: students.length || 10,
        color: 'emerald',
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <span>User Management & Hak Akses (RBAC)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Prinsip Least Privilege dengan autentikasi Firebase & Cloud Firestore Security Rules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rolesSummary.map((item) => (
            <Card key={item.role} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    item.color === 'emerald'
                      ? 'emerald'
                      : item.color === 'blue'
                      ? 'blue'
                      : 'amber'
                  }
                  size="md"
                >
                  ROLE {item.role}
                </Badge>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {item.count} Akun
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Security Rules Terpasang</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Database security checklist */}
        <Card className="p-5 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Kebijakan Keamanan Data (Cloud Firestore)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                1. Kerahasiaan Nilai & Data Siswa
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Siswa hanya dapat melihat data nilai dan presensi miliknya sendiri. Akses ke data
                siswa lain diblokir pada level Firestore Rules.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                2. Larangan Modifikasi Siswa
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Siswa tidak diizinkan mengubah nilai, menghapus materi, atau memanipulasi presensi.
                Operasi tulis hanya terbuka untuk Guru & Admin.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                3. Proteksi Kredensial
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Kata sandi tidak pernah disimpan dalam teks terbuka (plaintext) dan tidak ditampilkan
                pada antarmuka manapun.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 5. VIEW: PENGATURAN UMUM
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          <span>Pengaturan Sistem PJOK SMART BOOK</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Kelola Konfigurasi Sekolah, Tahun Pelajaran, dan Sinkronisasi Cloud Firestore
        </p>
      </div>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pengaturan berhasil disimpan ke Cloud Firestore!</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Aplikasi:
            </label>
            <input
              type="text"
              disabled
              value={settings.appName}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Sekolah:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tahun Pelajaran:
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024/2025"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Semester Aktif:
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as 'Semester 1' | 'Semester 2')}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Semester 1">Semester 1 (Gasal)</option>
                <option value="Semester 2">Semester 2 (Genap)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Pencipta / Pengembang:
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tagline Aplikasi:
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4" />}
            >
              Simpan Pengaturan ke Firestore
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

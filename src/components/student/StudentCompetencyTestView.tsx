import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  Globe,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  User,
  CompetencyTestItem,
  CompetencySubmission,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  getCompetencyTests,
  getCompetencySubmissions,
  confirmCompetencySubmission,
} from '../../services/firestoreService';

interface StudentCompetencyTestViewProps {
  currentUser: User;
  onUpdateStats?: (xpToAdd: number) => void;
}

export const StudentCompetencyTestView: React.FC<StudentCompetencyTestViewProps> = ({
  currentUser,
  onUpdateStats,
}) => {
  const [tests, setTests] = useState<CompetencyTestItem[]>([]);
  const [submissions, setSubmissions] = useState<CompetencySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allTests, allSubs] = await Promise.all([
        getCompetencyTests(),
        getCompetencySubmissions(),
      ]);
      // Active tests
      const active = allTests.filter((t) => t.status !== 'Nonaktif');
      setTests(active);

      // Student's own submissions
      const mySubs = allSubs.filter((s) => s.studentId === currentUser.id);
      setSubmissions(mySubs);
    } catch (e) {
      console.error('Error loading student CBT tests:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompletion = async (test: CompetencyTestItem) => {
    if (confirm(`Konfirmasi bahwa kamu sudah menyelesaikan asesmen "${test.name || test.title}" di platform eksternal?`)) {
      const payload: CompetencySubmission = {
        id: `cbt-sub-${Date.now()}`,
        testId: test.id,
        testTitle: test.name || test.title,
        studentId: currentUser.id,
        studentName: currentUser.name,
        completedAt: new Date().toISOString(),
        status: 'Sudah Dikerjakan',
        xpEarned: 50,
      };

      await confirmCompetencySubmission(payload);
      if (onUpdateStats) {
        onUpdateStats(50);
      }
      await loadData();
    }
  };

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
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-purple-600" />
          <span>🎯 Uji Kompetensi Berbasis Tautan</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Penilaian Tengah Semester (PTS), PAS, CBT Google Forms, Quizizz, dan asesmen resmi lainnya
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          <p className="text-xs">Memuat tautan uji kompetensi...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-white">Belum Ada Uji Kompetensi Tautan</h4>
          <p className="text-xs text-slate-500 mt-1">
            Saat ini belum ada tautan CBT yang dibagikan oleh guru untuk kelas kamu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => {
            const mySub = submissions.find((s) => s.testId === test.id);
            const isCompleted = !!mySub;
            const linkUrl = test.url || test.cbtLink;

            return (
              <Card
                key={test.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getPlatformBadge(test.platform)}
                    <span className="text-xs text-slate-500 font-bold">
                      Kelas {test.targetGrade} • {test.semester}
                    </span>
                    {isCompleted ? (
                      <Badge variant="emerald" size="sm">
                        ✓ Sudah Dikerjakan (+50 XP)
                      </Badge>
                    ) : (
                      <Badge variant="purple" size="sm">
                        Tersedia
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    {test.name || test.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Materi:</strong> {test.material || test.topic}
                  </p>

                  {test.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Batas Pengerjaan: {test.endDate || test.deadline}
                    </span>
                    <span>•</span>
                    <span>Maksimal: {test.points || 100} Poin</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  >
                    <span>Buka Ujian CBT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {!isCompleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfirmCompletion(test)}
                      className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold"
                      icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    >
                      Konfirmasi Selesai
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                      <CheckCircle2 className="w-4 h-4" />
                      Tercatat di Sistem
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

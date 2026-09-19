import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  HelpCircle,
  BookOpen,
  ChevronRight,
  Zap,
} from 'lucide-react';
import {
  User,
  QuizItem,
  QuizQuestionItem,
  QuizOptionItem,
  QuizAttempt,
} from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ProgressBar } from '../common/ProgressBar';
import {
  getQuizzes,
  getQuizAttempts,
  submitQuizAttempt,
} from '../../services/firestoreService';

interface StudentQuizRunnerProps {
  currentUser: User;
  onUpdateStats?: (xpToAdd: number) => void;
}

export const StudentQuizRunner: React.FC<StudentQuizRunnerProps> = ({
  currentUser,
  onUpdateStats,
}) => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Result state
  const [resultQuiz, setResultQuiz] = useState<QuizItem | null>(null);
  const [activeResult, setActiveResult] = useState<QuizAttempt | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || activeResult) return;

    if (secondsRemaining <= 0) {
      handleFinishQuiz(true); // Auto-submit when time expires
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, secondsRemaining, activeResult]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allQuizzes, allAttempts] = await Promise.all([
        getQuizzes(),
        getQuizAttempts(),
      ]);

      // Only published quizzes or matching student's grade
      const published = allQuizzes.filter((q) => q.status === 'PUBLISHED');
      setQuizzes(published);

      // Student's own attempts
      const myAttempts = allAttempts.filter((a) => a.studentId === currentUser.id);
      setAttempts(myAttempts);
    } catch (e) {
      console.error('Error loading quiz runner data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quiz: QuizItem) => {
    const questions = quiz.questions && quiz.questions.length > 0 ? quiz.questions : [];
    if (questions.length === 0) {
      alert('Kuis ini belum memiliki butir soal.');
      return;
    }

    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setSecondsRemaining((quiz.durationMinutes || 15) * 60);
    setQuizStartTime(Date.now());
    setActiveResult(null);
  };

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optIndex,
    });
  };

  const handleFinishQuiz = async (isTimeUp = false) => {
    if (!activeQuiz) return;
    const questions = activeQuiz.questions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    let wrongCount = 0;
    const studentAnswersArr: number[] = [];

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      studentAnswersArr.push(chosen ?? -1);
      if (chosen !== undefined && chosen === q.correctAnswerIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const score = percentage;
    const durationTaken = Math.round((Date.now() - quizStartTime) / 1000);
    const kktp = activeQuiz.kktp || 75;
    const isPassed = score >= kktp;

    const attemptPayload: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentClass: currentUser.class || currentUser.kelas || 'VII-A',
      score,
      correctCount,
      wrongCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      percentage,
      durationSeconds: durationTaken,
      durationTakenSeconds: durationTaken,
      completedAt: new Date().toISOString(),
      isPassed,
      answers: selectedAnswers,
      studentAnswers: studentAnswersArr,
      xpEarned: isPassed ? 100 : 50,
    };

    // Save to Firestore & local storage
    await submitQuizAttempt(attemptPayload);

    // Reward XP (+50 XP for doing quiz, +50 XP bonus for passing KKTP)
    const earnedXp = isPassed ? 100 : 50;
    if (onUpdateStats) {
      onUpdateStats(earnedXp);
    }

    setResultQuiz(activeQuiz);
    setActiveResult(attemptPayload);
    setActiveQuiz(null);
    setShowResultModal(true);
    await loadData();
  };

  const handleCloseActiveQuiz = () => {
    setActiveQuiz(null);
    setResultQuiz(null);
    setActiveResult(null);
    setShowResultModal(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If in active quiz mode
  if (activeQuiz) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQIndex];
    const totalQ = questions.length;
    const hasChosen = selectedAnswers[currentQIndex] !== undefined;

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Floating Quiz Navigation Header */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">
              {activeQuiz.title}
            </h3>
            <span className="text-xs text-slate-400">
              Materi: {activeQuiz.topic} • KKTP: {activeQuiz.kktp || 75}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
              secondsRemaining < 120
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Yakin ingin membatalkan pengerjaan kuis ini? Jawaban Anda tidak akan tersimpan.')) {
                  handleCloseActiveQuiz();
                }
              }}
            >
              Keluar
            </Button>
          </div>
        </div>

        {/* Progress Bar & Question Jump Map */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Nomor {currentQIndex + 1} dari {totalQ} Soal</span>
            <span>Terjawab: {Object.keys(selectedAnswers).length} / {totalQ}</span>
          </div>
          <ProgressBar value={Object.keys(selectedAnswers).length} max={totalQ} color="amber" />

          {/* Quick numbers */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = idx === currentQIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                      : isAnswered
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Display Card */}
        {currentQ && (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                SOAL NOMOR {currentQIndex + 1}
              </span>
              <Badge variant="slate" size="sm">
                {currentQ.type === 'benar_salah'
                  ? 'Benar / Salah'
                  : currentQ.type === 'pilihan_gambar'
                  ? 'Pilihan Gambar'
                  : 'Pilihan Ganda'}
              </Badge>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.questionText}
            </p>

            {/* Render options according to question type */}
            {currentQ.type === 'benar_salah' ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {['Benar', 'Salah'].map((val, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={val}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border-2 font-black text-base transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{val}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            ) : currentQ.type === 'pilihan_gambar' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {(currentQ.options as QuizOptionItem[]).map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {opt.imageUrl && (
                        <img
                          src={opt.imageUrl}
                          alt={opt.text}
                          className="w-full h-36 object-cover rounded-xl mb-2"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {opt.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Pilihan Ganda */
              <div className="space-y-3 pt-2">
                {(currentQ.options as string[]).map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  const textVal = typeof opt === 'string' ? opt : (opt as any).text;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm font-semibold">{textVal}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Sebelumnya
              </Button>

              {currentQIndex < totalQ - 1 ? (
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => setCurrentQIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleFinishQuiz(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Kirim & Selesaikan Kuis
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Quiz Catalog / List View
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-amber-500" />
          <span>📝 Kuis & Latihan Soal PJOK</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Uji pemahaman gerak spesifik, biomekanika, keselamatan olahraga, dan ketuntasan KKTP
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Memuat daftar kuis PJOK...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-white">Belum Ada Kuis Aktif</h4>
          <p className="text-xs text-slate-500 mt-1">
            Bapak/Ibu Guru belum merilis kuis untuk kelas kamu saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => {
            const myAttempt = attempts.find((a) => a.quizId === quiz.id);
            const isCompleted = !!myAttempt;
            const qCount = quiz.questions?.length || quiz.questionsCount || 0;

            return (
              <Card
                key={quiz.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="blue" size="sm">
                      {quiz.topic}
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-400">
                      Kelas {quiz.targetGrade}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Guru: {quiz.teacherName || 'Purwanto, S.Pd.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Soal</span>
                      <span className="font-bold">{qCount} Butir</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Waktu</span>
                      <span className="font-bold">{quiz.durationMinutes || 15} Mnt</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">KKTP</span>
                      <span className="font-bold text-emerald-600">{quiz.kktp || 75}</span>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold block">
                          Nilai Kamu:
                        </span>
                        <span className="text-xl font-black text-emerald-800 dark:text-emerald-200">
                          {myAttempt.score} / 100
                        </span>
                      </div>
                      <Badge variant={myAttempt.isPassed ? 'emerald' : 'amber'} size="sm">
                        {myAttempt.isPassed ? 'TUNTAS KKTP' : 'REMEDIAL'}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {isCompleted ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveResult(myAttempt);
                          setResultQuiz(quiz);
                          setShowResultModal(true);
                        }}
                      >
                        Lihat Pembahasan
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        Ulangi Kuis
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="amber"
                      size="sm"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
                      onClick={() => handleStartQuiz(quiz)}
                      icon={<Zap className="w-4 h-4" />}
                    >
                      Mulai Kerjakan Kuis
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL HASIL KUIS & PEMBAHASAN LENGKAP                    */}
      {/* ======================================================== */}
      {activeResult && resultQuiz && (
        <Modal
          isOpen={showResultModal}
          onClose={handleCloseActiveQuiz}
          title={`Hasil Pengerjaan Kuis: ${resultQuiz.title}`}
          subtitle={`KKTP: ${resultQuiz.kktp || 75} • ${activeResult.isPassed ? 'Selamat, kamu tuntas!' : 'Belum mencapai batas KKTP'}`}
        >
          <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Scorecard Hero */}
            <div className={`p-5 rounded-2xl border text-center space-y-2 ${
              activeResult.isPassed
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
            }`}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nilai Akhir
              </span>
              <div className="text-4xl font-black text-slate-900 dark:text-white">
                {activeResult.score} <span className="text-lg font-bold text-slate-400">/ 100</span>
              </div>
              <Badge variant={activeResult.isPassed ? 'emerald' : 'amber'} size="md">
                {activeResult.isPassed ? '🎉 LULUS & TUNTAS KKTP' : '⚠️ PERLU TINJAUAN & REMEDIAL'}
              </Badge>
            </div>

            {/* 4 Detail Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Benar</span>
                <span className="font-black text-base text-emerald-600">
                  {activeResult.correctCount ?? activeResult.correctAnswers ?? 0}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Salah</span>
                <span className="font-black text-base text-rose-500">
                  {activeResult.wrongCount ?? activeResult.wrongAnswers ?? 0}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Persentase</span>
                <span className="font-black text-base text-blue-600">
                  {activeResult.percentage}%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">Durasi</span>
                <span className="font-black text-base text-slate-700 dark:text-slate-200">
                  {Math.floor((activeResult.durationSeconds || activeResult.durationTakenSeconds || 0) / 60)}m {(activeResult.durationSeconds || activeResult.durationTakenSeconds || 0) % 60}s
                </span>
              </div>
            </div>

            {/* Pembahasan Soal (Jika diaktifkan oleh guru) */}
            {resultQuiz.showExplanation ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>Pembahasan Butir Soal</span>
                  </h4>
                  <Badge variant="blue" size="sm">Penjelasan Guru Aktif</Badge>
                </div>

                {resultQuiz.questions?.map((q: any, qIdx: number) => {
                  const studentAns = activeResult.answers?.[qIdx] ?? activeResult.studentAnswers?.[qIdx] ?? -1;
                  const isCorrect = studentAns === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id || qIdx}
                      className={`p-4 rounded-2xl border space-y-2.5 ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900 dark:bg-emerald-950/20'
                          : 'border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-500">
                          Soal {qIdx + 1}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Jawabanmu Benar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                            <XCircle className="w-3.5 h-3.5" /> Jawabanmu Salah
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white">
                        {q.questionText}
                      </p>

                      <div className="text-[11px] space-y-1">
                        <p className="text-slate-600 dark:text-slate-300">
                          <strong>Jawabanmu: </strong>
                          {studentAns >= 0
                            ? typeof q.options[studentAns] === 'string'
                              ? `${String.fromCharCode(65 + studentAns)}. ${q.options[studentAns]}`
                              : `${String.fromCharCode(65 + studentAns)}. ${(q.options[studentAns] as any).text}`
                            : 'Tidak dijawab'}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                          <strong>Kunci Jawaban Benar: </strong>
                          {typeof q.options[q.correctAnswerIndex] === 'string'
                            ? `${String.fromCharCode(65 + q.correctAnswerIndex)}. ${q.options[q.correctAnswerIndex]}`
                            : `${String.fromCharCode(65 + q.correctAnswerIndex)}. ${(q.options[q.correctAnswerIndex] as any).text}`}
                        </p>
                      </div>

                      {q.explanation && (
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-blue-950 dark:text-blue-200 text-[11px] leading-relaxed">
                          <strong>💡 Penjelasan Biomekanika / Gerak:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 text-xs">
                <HelpCircle className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="font-bold">Pembahasan Ditutup oleh Guru</p>
                <p className="text-[11px] mt-0.5">
                  Bapak/Ibu Guru menonaktifkan tampilan pembahasan untuk menjaga kerahasiaan evaluasi.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={handleCloseActiveQuiz}>
                Selesai & Kembali
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

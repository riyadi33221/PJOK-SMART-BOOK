import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AppSettings,
  MaterialItem,
  Student,
  Teacher,
  ClassRoom,
  Semester,
  StudentListItem,
} from './types';
import {
  initialSettings,
  classList,
  studentDummyStats,
  teacherDummyStats,
  dummyMaterials,
  dummyQuizzes,
  dummyCompetencyTests,
  dummyAttendance,
  dummyGrades,
  dummyBadges,
  dummyAnnouncements,
  dummyStudentsTable,
} from './data/dummyData';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { useAuth } from './context/AuthContext';

import {
  seedInitialDataIfEmpty,
  getAppSettings,
  saveAppSettings,
  getStudents,
  addStudent,
  updateStudent,
  deactivateStudent,
  importStudentsBatch,
  getTeachers,
  addTeacher,
  updateTeacher,
  getClasses,
  addClass,
  updateClass,
  getSemesters,
  updateSemester,
  getMaterials,
  addMaterial,
  getAttendanceList,
  getGradesList,
} from './services/firestoreService';

import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentViews } from './components/student/StudentViews';

import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherViews } from './components/teacher/TeacherViews';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminViews } from './components/admin/AdminViews';

export default function App() {
  const { currentUser, currentRole, switchRole, logout, loginWithSchoolAccount } = useAuth();

  // Settings & Theme State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pjok_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pjok_theme') === 'dark';
  });

  // Navigation State
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalDefaultRole, setLoginModalDefaultRole] = useState<UserRole>('SISWA');

  // Firestore Synchronized Data States
  const [materials, setMaterials] = useState<MaterialItem[]>(dummyMaterials);
  const [students, setStudents] = useState<Student[]>(() =>
    dummyStudentsTable.map((s, idx) => ({
      id: s.id || `std-${idx + 1}`,
      studentId: s.id || `std-${idx + 1}`,
      nisn: s.nisn,
      nis: `2425${(idx + 1).toString().padStart(4, '0')}`,
      name: s.name,
      gender: s.gender,
      classId: s.kelas,
      academicYear: '2024/2025',
      email: `${s.name.toLowerCase().replace(/\s+/g, '.')}.vii@smpn2kutasari.sch.id`,
      status: 'active',
      xp: 450 - idx * 20,
      attendanceRate: s.attendanceRate,
      avgScore: s.avgScore,
      attitude: s.attitude,
      lastActive: s.lastActive,
    }))
  );
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>(classList);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [quizzes] = useState(dummyQuizzes);
  const [competencyTests] = useState(dummyCompetencyTests);
  const [attendance, setAttendance] = useState(dummyAttendance);
  const [grades, setGrades] = useState(dummyGrades);
  const [badges] = useState(dummyBadges);
  const [announcements] = useState(dummyAnnouncements);

  // Sync dark mode class with <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pjok_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pjok_theme', 'light');
    }
  }, [darkMode]);

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem('pjok_settings', JSON.stringify(settings));
  }, [settings]);

  // Initialize Firestore Data & Seed on App Mount
  useEffect(() => {
    const initFirebaseData = async () => {
      try {
        // Attempt initial database seeding only when signed in as admin
        if (currentUser?.role === 'ADMIN') {
          await seedInitialDataIfEmpty();
        }

        // Publicly readable collections (Settings, Classes, Semesters, Materials)
        const [loadedSettings, loadedClasses, loadedSemesters, loadedMaterials] =
          await Promise.allSettled([
            getAppSettings(),
            getClasses(),
            getSemesters(),
            getMaterials(),
          ]);

        if (loadedSettings.status === 'fulfilled' && loadedSettings.value) {
          setSettings(loadedSettings.value);
        }
        if (loadedClasses.status === 'fulfilled' && loadedClasses.value?.length) {
          setClasses(loadedClasses.value);
        }
        if (loadedSemesters.status === 'fulfilled' && loadedSemesters.value?.length) {
          setSemesters(loadedSemesters.value);
        }
        if (loadedMaterials.status === 'fulfilled' && loadedMaterials.value?.length) {
          setMaterials(loadedMaterials.value);
        }

        // Role-dependent / authenticated data
        if (currentUser) {
          if (currentUser.role === 'ADMIN' || currentUser.role === 'GURU') {
            const [loadedStudents, loadedTeachers] = await Promise.allSettled([
              getStudents(),
              getTeachers(),
            ]);
            if (loadedStudents.status === 'fulfilled' && loadedStudents.value?.length) {
              setStudents(loadedStudents.value);
            }
            if (loadedTeachers.status === 'fulfilled' && loadedTeachers.value?.length) {
              setTeachers(loadedTeachers.value);
            }
          }

          const [loadedAttendance, loadedGrades] = await Promise.allSettled([
            getAttendanceList(currentUser.role === 'SISWA' ? currentUser.id : undefined),
            getGradesList(currentUser.role === 'SISWA' ? currentUser.id : undefined),
          ]);
          if (loadedAttendance.status === 'fulfilled' && loadedAttendance.value?.length) {
            setAttendance(loadedAttendance.value);
          }
          if (loadedGrades.status === 'fulfilled' && loadedGrades.value?.length) {
            setGrades(loadedGrades.value);
          }
        }
      } catch (err) {
        console.warn('Init Firebase data warning:', err);
      }
    };

    initFirebaseData();
  }, [currentUser]);

  // Login handler
  const handleLogin = async (role: UserRole) => {
    await loginWithSchoolAccount(role, role === 'SISWA' ? '0098471203' : role === 'GURU' ? '19780512 200501 1 008' : 'admin');
    setActiveMenu('dashboard');
    setIsLoginModalOpen(false);
  };

  // Switch role handler (available via navbar quick dropdown for testing all perspectives)
  const handleSwitchRole = (role: UserRole) => {
    switchRole(role);
    setActiveMenu('dashboard');
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
    setActiveMenu('dashboard');
  };

  // Open login modal with specific default tab
  const handleOpenLoginModal = (role: UserRole = 'SISWA') => {
    setLoginModalDefaultRole(role);
    setIsLoginModalOpen(true);
  };

  // Update application settings
  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      await saveAppSettings(newSettings);
    } catch (e) {
      console.warn('Save settings error:', e);
    }
  };

  // Add material handler
  const handleAddMaterial = async (item: MaterialItem) => {
    setMaterials((prev) => [item, ...prev]);
    try {
      await addMaterial(item);
    } catch (e) {
      console.warn('Add material error:', e);
    }
  };

  // Student Handlers
  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const added = await addStudent(studentData);
      setStudents((prev) => [added, ...prev]);
    } catch (e) {
      console.warn('Add student error:', e);
      const fallbackStudent: Student = {
        ...studentData,
        id: `std-${Date.now()}`,
      };
      setStudents((prev) => [fallbackStudent, ...prev]);
    }
  };

  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    try {
      await updateStudent(id, updates);
    } catch (e) {
      console.warn('Update student error:', e);
    }
  };

  const handleDeactivateStudent = async (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'inactive' ? 'active' : 'inactive' }
          : s
      )
    );
    try {
      await deactivateStudent(id);
    } catch (e) {
      console.warn('Deactivate student error:', e);
    }
  };

  const handleBatchImportStudents = async (studentsList: Omit<Student, 'id'>[]) => {
    try {
      const count = await importStudentsBatch(studentsList);
      // Refresh students
      const refreshed = await getStudents();
      setStudents(refreshed);
      return count;
    } catch (e) {
      console.warn('Batch import error:', e);
      // Fallback local append
      const mapped = studentsList.map((s, i) => ({
        ...s,
        id: `std-loc-${Date.now()}-${i}`,
      }));
      setStudents((prev) => [...mapped, ...prev]);
      return studentsList.length;
    }
  };

  // Teacher Handlers
  const handleAddTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    try {
      const added = await addTeacher(teacherData);
      setTeachers((prev) => [added, ...prev]);
    } catch (e) {
      console.warn('Add teacher error:', e);
      const fallback: Teacher = {
        ...teacherData,
        id: `tea-${Date.now()}`,
      };
      setTeachers((prev) => [fallback, ...prev]);
    }
  };

  const handleUpdateTeacher = async (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    try {
      await updateTeacher(id, updates);
    } catch (e) {
      console.warn('Update teacher error:', e);
    }
  };

  // Class & Semester Handlers
  const handleAddClass = async (cls: ClassRoom) => {
    setClasses((prev) => [...prev, cls]);
    try {
      await addClass(cls);
    } catch (e) {
      console.warn('Add class error:', e);
    }
  };

  const handleUpdateClass = async (id: string, updates: Partial<ClassRoom>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    try {
      await updateClass(id, updates);
    } catch (e) {
      console.warn('Update class error:', e);
    }
  };

  const handleUpdateSemester = async (id: string, updates: Partial<Semester>) => {
    setSemesters((prev) =>
      prev.map((sem) => (sem.id === id ? { ...sem, ...updates } : sem))
    );
    try {
      await updateSemester(id, updates);
    } catch (e) {
      console.warn('Update semester error:', e);
    }
  };

  // Convert students to StudentListItem format for TeacherViews compatibility
  const studentListItems: StudentListItem[] = students.map((s) => ({
    id: s.id,
    nisn: s.nisn,
    nis: s.nis,
    name: s.name,
    gender: s.gender,
    kelas: s.classId || (s as any).kelas || 'VII-A',
    attendanceRate: s.attendanceRate || 95,
    avgScore: s.avgScore || 85,
    attitude: s.attitude || 'Baik',
    lastActive: s.lastActive || 'Hari ini',
    status: s.status || 'active',
    email: s.email,
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 1. If not logged in, show Landing Page */}
      {!currentUser ? (
        <>
          <LandingPage
            settings={settings}
            onOpenLogin={handleOpenLoginModal}
            onFastLogin={handleLogin}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            defaultRole={loginModalDefaultRole}
          />
        </>
      ) : (
        /* 2. Main Authenticated Application Layout */
        <div className="min-h-screen flex flex-col">
          {/* Top Navbar */}
          <Navbar
            currentUser={currentUser}
            currentRole={currentRole}
            settings={settings}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onSwitchRole={handleSwitchRole}
            onLogout={handleLogout}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          <div className="flex-1 flex pb-16 lg:pb-0">
            {/* Desktop & Mobile Drawer Sidebar */}
            <Sidebar
              currentRole={currentRole}
              activeMenu={activeMenu}
              onSelectMenu={(menuKey) => setActiveMenu(menuKey)}
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Workspace */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
              {/* Role: SISWA */}
              {currentRole === 'SISWA' && (
                <>
                  {activeMenu === 'dashboard' ? (
                    <StudentDashboard
                      currentUser={currentUser}
                      stats={studentDummyStats}
                      materials={materials}
                      quizzes={quizzes}
                      announcements={announcements}
                      onNavigate={(menu) => setActiveMenu(menu)}
                    />
                  ) : (
                    <StudentViews
                      activeMenu={activeMenu}
                      currentUser={currentUser}
                      stats={studentDummyStats}
                      materials={materials}
                      quizzes={quizzes}
                      competencyTests={competencyTests}
                      attendance={attendance}
                      grades={grades}
                      badges={badges}
                      announcements={announcements}
                      onNavigate={(menu) => setActiveMenu(menu)}
                    />
                  )}
                </>
              )}

              {/* Role: GURU */}
              {currentRole === 'GURU' && (
                <>
                  {activeMenu === 'dashboard' ? (
                    <TeacherDashboard
                      currentUser={currentUser}
                      stats={teacherDummyStats}
                      settings={settings}
                      onNavigate={(menu) => setActiveMenu(menu)}
                    />
                  ) : (
                    <TeacherViews
                      activeMenu={activeMenu}
                      currentUser={currentUser}
                      students={studentListItems}
                      classes={classes}
                      materials={materials}
                      quizzes={quizzes}
                      competencyTests={competencyTests}
                      announcements={announcements}
                      badges={badges}
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                      onAddMaterial={handleAddMaterial}
                    />
                  )}
                </>
              )}

              {/* Role: ADMIN */}
              {currentRole === 'ADMIN' && (
                <>
                  {activeMenu === 'dashboard' ? (
                    <AdminDashboard
                      currentUser={currentUser}
                      settings={settings}
                      classes={classes}
                      onNavigate={(menu) => setActiveMenu(menu)}
                    />
                  ) : (
                    <AdminViews
                      activeMenu={activeMenu}
                      students={students}
                      teachers={teachers}
                      classes={classes}
                      semesters={semesters}
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                      onAddStudent={handleAddStudent}
                      onUpdateStudent={handleUpdateStudent}
                      onDeactivateStudent={handleDeactivateStudent}
                      onBatchImportStudents={handleBatchImportStudents}
                      onAddTeacher={handleAddTeacher}
                      onUpdateTeacher={handleUpdateTeacher}
                      onAddClass={handleAddClass}
                      onUpdateClass={handleUpdateClass}
                      onUpdateSemester={handleUpdateSemester}
                    />
                  )}
                </>
              )}
            </main>
          </div>

          {/* Bottom Mobile Navigation for Phone/Tablet screens */}
          <MobileNav
            currentRole={currentRole}
            activeMenu={activeMenu}
            onSelectMenu={(menuKey) => setActiveMenu(menuKey)}
            onOpenMore={() => setIsMobileSidebarOpen(true)}
          />

          {/* Login modal in case user wants to switch through modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            defaultRole={loginModalDefaultRole}
          />
        </div>
      )}
    </div>
  );
}

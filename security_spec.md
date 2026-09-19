# Security Specification: PJOK SMART BOOK

## 1. Data Invariants & Least Privilege Rules
1. **Student Privacy**: Siswa hanya dapat membaca dan menulis data yang menjadi miliknya (grades, attendance, reflections, student_badges, quiz_results). Siswa dilarang membaca data siswa lain.
2. **Grade Integrity**: Nilai (`grades`), presensi (`attendance`), dan penilaian sikap (`attitude_assessments`) hanya dapat dibuat, diubah, atau dihapus oleh Guru (`GURU`) atau Admin (`ADMIN`). Siswa tidak diizinkan mengubah nilai.
3. **Curriculum Management**: Materi (`materials`), video (`videos`), kuis (`quizzes`), dan soal (`questions`) hanya dapat dibuat atau diedit oleh Guru atau Admin. Siswa hanya memiliki hak baca (`get` dan `list`).
4. **Master Data & Users**: Koleksi `users`, `students`, `teachers`, `classes`, `semesters`, dan `settings` dikelola secara eksklusif oleh Admin (`ADMIN`) dengan verifikasi identitas.
5. **Reflection & Student Submissions**: Siswa dapat mengunggah refleksi (`reflections`) dan jawaban kuis (`quiz_results`) hanya untuk dirinya sendiri (`studentId == request.auth.uid`).

## 2. The "Dirty Dozen" Payloads
1. **Payload 1 (Student Elevating Role to Admin)**: Siswa mencoba membuat dokumen di `/users/{uid}` dengan `role: "ADMIN"`.
2. **Payload 2 (Student Forging Grades)**: Siswa mencoba menulis dokumen ke `/grades/{gradeId}` untuk mengubah nilainya menjadi 100 dengan predikat 'A'.
3. **Payload 3 (Cross-Student Grade Read)**: Siswa A mencoba membaca query nilai milik Siswa B di `/grades`.
4. **Payload 4 (Student Modifying Attendance)**: Siswa mencoba mengubah status kehadiran menjadi 'Hadir' pada `/attendance/{id}`.
5. **Payload 5 (Unauthenticated User Access)**: Pengguna tanpa login mencoba mengakses `/students/{id}` atau `/settings/app_config`.
6. **Payload 6 (Shadow Field Injection)**: Penyerang mencoba mengirimkan payload materi ke `/materials/{id}` dengan field tambahan `isAdmin: true` atau `secretBackdoor: true`.
7. **Payload 7 (ID Poisoning / Denial of Wallet)**: Penyerang mencoba menyisipkan Document ID sepanjang 2000 karakter karakter acak ke `/reflections`.
8. **Payload 8 (Student Deleting Curriculum Material)**: Siswa mengirimkan perintah `delete` ke `/materials/{materialId}`.
9. **Payload 9 (Teacher Modifying App Settings)**: Pengguna berstatus Guru mencoba mengubah nama sekolah atau menghapus data admin di `/settings`.
10. **Payload 10 (Student Spoofing Reflection Author)**: Siswa A mengirim refleksi dengan menyetel `studentId: "studentB_uid"`.
11. **Payload 11 (Oversized Payload Attack)**: Penyerang mencoba menyimpan teks refleksi melebihi batas panjang karakter (>1024 karakter).
12. **Payload 12 (Student Modifying Teacher Record)**: Siswa mencoba mengubah daftar kelas yang diampu oleh Guru pada `/teachers/{teacherId}`.

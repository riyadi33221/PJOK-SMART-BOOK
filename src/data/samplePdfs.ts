export interface PresetPdfSample {
  id: string;
  name: string;
  grade: 'VII' | 'VIII' | 'IX';
  semester: 'Semester 1' | 'Semester 2';
  chapter: number;
  category: 'Permainan Bola Besar' | 'Permainan Bola Kecil' | 'Atletik' | 'Kebugaran Jasmani' | 'Senam Lantai' | 'Kesehatan';
  topic: string;
  learningObjectives: string;
  description: string;
  fileName: string;
  fileSize: string;
  extractedText: string;
}

export const presetPdfSamples: PresetPdfSample[] = [
  {
    id: 'sample-pdf-01',
    name: 'Buku Siswa PJOK Kelas VII - Bab 5 Senam Lantai (Roll Depan & Roll Belakang)',
    grade: 'VII',
    semester: 'Semester 2',
    chapter: 5,
    category: 'Senam Lantai',
    topic: 'Guling Depan (Forward Roll) & Guling Belakang (Backward Roll)',
    learningObjectives: 'Siswa mampu memahami, menganalisis, dan mempraktikkan keterampilan gerak spesifik guling depan dan guling belakang di atas matras dengan memperhatikan keselamatan leher dan tulang belakang.',
    description: 'Buku teks resmi kurikulum PJOK SMP Bab Senam Lantai tanpa alat. Membahas sikap awalan jongkok, penempatan tengkuk di matras, dan pendaratan jongkok seimbang.',
    fileName: 'Buku_PJOK_VII_Bab5_SenamLantai_SMPN2Kutasari.pdf',
    fileSize: '3.1 MB',
    extractedText: `KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
SMP NEGERI 2 KUTASARI - PURBALINGGA
MODUL AJAR PJOK KELAS VII SEMESTER 2
BAB 5: AKTIVITAS GERAK SPESIFIK SENAM LANTAI

A. IDENTITAS MODUL
Mata Pelajaran: Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)
Penyusun: Purwanto, S.Pd.
Satuan Pendidikan: SMP Negeri 2 Kutasari
Alokasi Waktu: 3 x 40 Menit (2 Pertemuan)
Fase/Kelas: D / Kelas VII

B. TUJUAN PEMBELAJARAN
1. Peserta didik dapat menganalisis variasi gerak spesifik guling depan (forward roll) dengan sikap awalan jongkok secara runtut dan benar.
2. Peserta didik dapat mempraktikkan gerak guling depan di atas matras dengan penempatan tengkuk kepala yang aman.
3. Peserta didik dapat mengidentifikasi potensi bahaya cedera leher dan menerapkan prosedur keselamatan senam lantai.
4. Menumbuhkan rasa percaya diri, keberanian, dan saling membantu (safety spotter) antar teman.

C. MATERI POKOK: GULING DEPAN (FORWARD ROLL)
1. Pengertian Senam Lantai:
Senam lantai adalah cabang olahraga senam yang gerakannya dilakukan di atas lantai beralaskan matras berukuran standar. Matras berfungsi sebagai peredam benturan dan pelindung keselamatan tubuh pesenam.

2. Rangkaian Teknik Gerak Spesifik Guling Depan Awalan Jongkok:
a. Sikap Awalan:
- Berdiri menghadap matras lalu jongkok dengan kedua kaki rapat.
- Kedua tumit diangkat sedikit (berjinjit).
- Letakkan kedua telapak tangan di atas matras selebar bahu, jarak dari ujung kaki sekitar 30 cm.
- Pandangan diarahkan ke depan bawah.

b. Pelaksanaan Gerak:
- Luruskan kedua tungkai kaki, angkat pinggul ke atas, dan tekuk kedua siku tangan ke samping luar.
- Masukkan kepala di antara kedua lengan hingga dagu menempel rapat di dada (ini kunci terpenting agar tengkuk, bukan ubun-ubun, yang menyentuh matras).
- Tempelkan bagian tengkuk leher belakang ke matras.
- Lakukan dorongan (tolakan) kedua kaki ke depan hingga badan berguling bulat meluncur di atas matras.

c. Sikap Akhir:
- Saat punggung dan pinggul menyentuh matras, segera peluk kedua tulang kering kaki dengan kedua tangan.
- Tarik badan ke depan hingga kembali ke posisi jongkok seimbang.
- Berdiri tegak dengan kedua lengan direntangkan lurus ke depan atau ke atas sebagai tanda penyelesaian gerak yang sempurna.

3. KESELAMATAN DAN PENCEGAHAN CEDERA:
- PENTING: Dagu wajib menempel di dada! Jangan sekali-kali membiarkan ubun-ubun kepala menabrak matras karena berisiko fatal mencederai ruas tulang leher (cervical spine).
- Pastikan matras senam bebas dari kerikil, debu licin, dan tidak ada celah antar matras.
- Wajib didampingi guru atau rekan penjaga (spotter) yang berdiri di samping matras memegang tengkuk dan mendorong pinggul.

4. KESALAHAN YANG SERING TERJADI:
- Tumpuan tangan kurang kuat sehingga kepala membentur matras.
- Tengkuk tidak menyentuh matras melainkan kepala bagian atas/dahi.
- Tolakan kaki kurang bertenaga sehingga gerakan berhenti di tengah punggung.
- Kaki tidak ditekuk rapat saat berguling sehingga badan melebar dan tidak bisa kembali jongkok.

5. TAHUKAH KAMU?
Senam lantai disebut juga senam artistik tumbling. Senam lantai pertama kali diperkenalkan di Indonesia pada masa penjajahan Belanda melalui sistem senam Swedia dan Jerman.

6. GLOSARIUM:
- Matras: Bantalan busa tebal berlapis kulit sintetis untuk latihan senam.
- Tengkuk: Bagian belakang leher tempat perkenaan yang tepat saat roll depan.
- Spotter: Teman atau guru yang bertugas menjaga dan membantu keselamatan pesenam saat mempraktikkan gerakan sulit.`,
  },
  {
    id: 'sample-pdf-02',
    name: 'Buku Siswa PJOK Kelas VII - Bab 6 Aktivitas Gerak Berirama (Senam Ritmik)',
    grade: 'VII',
    semester: 'Semester 2',
    chapter: 6,
    category: 'Senam Lantai',
    topic: 'Langkah Kaki Dasar & Ayunan Lengan Senam Irama',
    learningObjectives: 'Siswa mampu merancang dan mempraktikkan variasi langkah kaki (biasa, rapat, depan) dan ayunan satu/dua lengan mengikuti ketukan musik berirama 4/4.',
    description: 'Panduan kurikulum gerak ritmik untuk melatih keluwesan, koordinasi motorik, dan kebugaran aerobik yang menyenangkan.',
    fileName: 'Buku_PJOK_VII_Bab6_SenamIrama_SMPN2Kutasari.pdf',
    fileSize: '2.5 MB',
    extractedText: `KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
SMP NEGERI 2 KUTASARI - PURBALINGGA
MODUL AJAR PJOK KELAS VII SEMESTER 2
BAB 6: AKTIVITAS GERAK BERIRAMA (SENAM IRAMA / RITMIK)

A. PENDAHULUAN
Senam irama atau gerak ritmik adalah aktivitas fisik yang memadukan gerakan tubuh yang luwes dengan irama ketukan, musik, atau tepukan tangan. Melalui senam irama, siswa melatih kelenturan tubuh, keluwesan (fleksibilitas), kontinuitas gerak, dan kepekaan rasa terhadap ritme musik.

B. TUJUAN PEMBELAJARAN
1. Peserta didik memahami konsep langkah kaki dasar: march, v-step, side-to-side, dan single step.
2. Peserta didik mempraktikkan ayunan lengan: bicep curl, chest press, dan butterfly.
3. Peserta didik menyelaraskan koordinasi ayunan lengan dan langkah kaki dalam hitungan 1-8 ketukan musik.

C. MATERI POKOK
1. Unsur-Unsur Utama Senam Irama:
a. Keluwesan (fleksibilitas): Kemampuan otot dan sendi bergerak tanpa rasa kaku.
b. Ketepatan Irama: Kemampuan menyesuaikan tempo langkah dengan birama musik (misalnya 4/4 atau 3/4).
c. Kontinuitas Gerak: Rangkaian gerakan mengalir tanpa henti dari pemanasan, inti, hingga pendinginan.

2. Gerak Spesifik Langkah Kaki (Footwork):
- Langkah Biasa (Loppas): Melangkah santai dengan perkenaan tumit lalu telapak kaki.
- Langkah Rapat (Bijtrekpas): Melangkahkan kaki kanan ke depan, disusul kaki kiri merapat di samping kaki kanan.
- Langkah Keseimbangan (Balanspas): Langkah disertai ayunan tumit terangkat seimbang.

3. Gerak Spesifik Ayunan Lengan (Arm Movement):
- Ayunan satu lengan ke depan dan belakang.
- Ayunan dua lengan silang di depan dada.
- Ayunan dua lengan melingkar di atas kepala.

D. TIPS KESELAMATAN:
- Gunakan sepatu olahraga yang memiliki bantalan tumit empuk untuk meredam hentakan saat mendarat.
- Jangan memaksakan gerakan lompat tinggi jika belum menguasai koordinasi langkah dasar.`,
  },
  {
    id: 'sample-pdf-03',
    name: 'Buku Siswa PJOK Kelas VII - Bab 8 Pola Makan Sehat, Bergizi, dan Seimbang',
    grade: 'VII',
    semester: 'Semester 2',
    chapter: 8,
    category: 'Kesehatan',
    topic: 'Pedoman Gizi Seimbang & Pencegahan Penyakit Degeneratif Remaja',
    learningObjectives: 'Siswa mampu menganalisis zat gizi makanan (karbohidrat, protein, lemak, vitamin, mineral, air) dan menyusun piring makan bergizi seimbang "Isi Piringku".',
    description: 'Modul edukasi kesehatan fisik dan gizi remaja untuk menunjang performa olahraga dan konsentrasi belajar optimal.',
    fileName: 'Buku_PJOK_VII_Bab8_PolaMakanSehat_SMPN2Kutasari.pdf',
    fileSize: '1.8 MB',
    extractedText: `KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
SMP NEGERI 2 KUTASARI - PURBALINGGA
MODUL AJAR PJOK KELAS VII SEMESTER 2
BAB 8: POLA MAKAN SEHAT, BERGIZI, DAN SEIMBANG

A. HAKIKAT MAKANAN SEHAT DAN BERGIZI
Makanan sehat adalah makanan yang mengandung zat gizi yang dibutuhkan oleh tubuh dalam jumlah yang cukup dan seimbang, serta bebas dari bibit penyakit dan zat kimia berbahaya. Pada masa remaja (usia 12-15 tahun), tubuh mengalami masa pertumbuhan cepat (growth spurt) yang memerlukan asupan gizi optimal.

B. FUNGSI ZAT GIZI BAGI TUBUH REMAJA
1. Karbohidrat: Sumber energi utama untuk berolahraga dan berpikir. Terdapat pada nasi merah, ubi, singkong, jagung, dan gandum.
2. Protein: Zat pembangun dan pemelihara sel otot yang rusak saat aktivitas jasmani. Terdapat pada telur, tempe, tahu, ikan tongkol, dan daging tanpa lemak.
3. Lemak Baik: Sumber cadangan energi dan pelarut vitamin A, D, E, K.
4. Vitamin dan Mineral: Mengatur metabolisme dan meningkatkan daya tahan tubuh terhadap flu dan infeksi.
5. Air Putih: Mencegah dehidrasi dan menjaga volume darah. Konsumsi minimal 8 gelas (2 liter) per hari.

C. PEDOMAN "ISI PIRINGKU" DARI KEMENKES RI:
- 1/3 bagian piring berisi makanan pokok (karbohidrat).
- 1/3 bagian piring berisi sayur-mayur aneka warna.
- 1/6 bagian piring berisi lauk-pauk sumber protein.
- 1/6 bagian piring berisi buah-buahan segar.
- Cuci tangan pakai sabun sebelum makan dan lakukan aktivitas fisik minimal 30 menit setiap hari.

D. DAMPAK MAKANAN TIDAK SEHAT:
Konsumsi berlebihan junk food, gorengan berulang, dan minuman tinggi pemanis buatan memicu obesitas dini, diabetes melitus tipe 2, dan penurunan stamina saat pelajaran olahraga.`,
  },
];

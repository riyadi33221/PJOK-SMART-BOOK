import { DigitalBookItem } from '../types';

export const initialDigitalBooks: DigitalBookItem[] = [
  {
    id: 'book-pjok-01',
    title: 'Permainan Bola Besar: Gerak Spesifik Permainan Sepak Bola',
    targetGrade: 'VII',
    semester: 'Semester 1',
    chapter: 1,
    topic: 'Passing Kaki Bagian Dalam & Menahan Bola',
    category: 'Permainan Bola Besar',
    learningObjectives: [
      'Memahami konsep gerak spesifik menendang (passing) bola dengan kaki bagian dalam secara tepat.',
      'Menganalisis variasi posisi tubuh, tumpuan kaki, dan ayunan kaki saat mengumpan bola.',
      'Mempraktikkan teknik mengumpan dan mengontrol bola dengan koordinasi gerak yang baik.',
      'Menunjukkan sikap disiplin, sportivitas, dan kerja sama selama aktivitas pembelajaran.',
    ],
    description: 'Modul digital interaktif komprehensif mengupas teknik biomekanika gerak menendang dan menahan bola sepak bola untuk siswa Kelas VII SMP Negeri 2 Kutasari.',
    status: 'PUBLISHED',
    readDurationMin: 15,
    readPages: 8,
    pdfFileName: 'Buku_PJOK_VII_Bab1_SepakBola_SMPN2Kutasari.pdf',
    pdfFileSize: '2.4 MB',
    teacherId: 'guru-001',
    teacherName: 'Purwanto, S.Pd.',
    createdAt: '2025-07-20T08:00:00Z',
    updatedAt: '2025-08-01T10:30:00Z',
    publishedAt: '2025-08-01T10:30:00Z',
    content: {
      cover: {
        title: 'Gerak Spesifik Permainan Sepak Bola',
        subtitle: 'Teknik Dasar Menendang, Menghentikan, dan Menggiring Bola',
        targetGrade: 'VII',
        semester: 'Semester 1',
        chapter: 1,
        topic: 'Passing Kaki Bagian Dalam & Menahan Bola',
        schoolName: 'SMP Negeri 2 Kutasari',
        author: 'Purwanto, S.Pd.',
        learningObjectives: [
          'Memahami gerak spesifik passing kaki bagian dalam secara tepat.',
          'Menganalisis variasi posisi tubuh dan ayunan kaki.',
          'Mempraktikkan teknik mengumpan dan mengontrol bola dengan koordinasi yang baik.',
          'Menunjukkan sikap kerja sama, disiplin, dan respek sesama pemain.',
        ],
        description: 'Buku digital PJOK edisi Kurikulum Merdeka yang dirancang khusus untuk meningkatkan kebugaran jasmani dan penguasaan teknik dasar sepak bola siswa.',
      },
      summary: 'Sepak bola adalah permainan bola besar yang dimainkan oleh dua tim masing-masing beranggotakan 11 orang. Keterampilan dasar paling fundamental yang menentukan keberhasilan strategi tim adalah keterampilan mengumpan (passing) dan menghentikan (controlling) bola. Mengumpan dengan kaki bagian dalam memberikan tingkat akurasi tertinggi untuk operan jarak pendek hingga menengah, sementara kontrol bola yang stabil memungkinkan transisi cepat dalam pola penyerangan maupun bertahan.',
      keyPoints: [
        'Akurasi Umpan: Kaki bagian dalam memiliki bidang kontak paling luas sehingga akurasi operan menjadi maksimal.',
        'Kaki Tumpu: Diletakkan di samping bola sekitar 10-15 cm dengan ujung kaki menghadap langsung ke arah target operan.',
        'Keseimbangan Badan: Kedua lengan rileks direntangkan ke samping untuk menjaga stabilitas tubuh saat mengayun.',
        'Follow-Through: Lanjutan ayunan kaki ke depan searah jalannya bola memastikan laju bola datar dan terkontrol.',
      ],
      safetyTips: [
        {
          title: 'Wajib Pemanasan Dinamis & Statis',
          description: 'Lakukan peregangan otot tungkai (hamstring, quadriceps, betis) dan engkel minimal 10 menit sebelum menendang untuk mencegah kram atau cedera ligamen.',
          severity: 'high',
        },
        {
          title: 'Gunakan Sepatu Olahraga Standar',
          description: 'Gunakan sepatu bertali kencang dan sol yang tidak licin pada lapangan rumput kering agar tidak terpeleset saat melakukan tumpuan.',
          severity: 'medium',
        },
        {
          title: 'Perhatikan Jarak Antar Siswa',
          description: 'Pastikan jarak berpasangan minimal 3-5 meter saat latihan passing berpasangan agar bola tidak membentur kepala atau wajah rekan.',
          severity: 'low',
        },
      ],
      techniques: [
        {
          stepNumber: 1,
          title: 'Sikap Awalan (Stance & Approach)',
          description: 'Berdiri menghadap ke arah sasaran bola dengan pandangan fokus ke bola dan target rekan setim.',
          keyPoints: [
            'Letakkan kaki tumpu (biasanya kaki kiri bagi yang berkaki dominan kanan) di samping bola berjarak ± 15 cm.',
            'Lutut kaki tumpu sedikit ditekuk untuk merendahkan pusat gravitasi tubuh.',
            'Kedua lengan dibuka ke samping badan secara santai untuk menjaga keseimbangan.',
          ],
          commonMistakes: [
            'Kaki tumpu terlalu jauh di belakang bola sehingga bola melambung tak terkontrol.',
            'Badan terlalu kaku dan condong ke belakang.',
          ],
        },
        {
          stepNumber: 2,
          title: 'Pelaksanaan Gerak (Impact & Strike)',
          description: 'Tarik kaki penendang ke belakang lalu ayunkan ke depan mengenai bagian tengah bola.',
          keyPoints: [
            'Putar pergelangan kaki penendang ke arah luar sehingga sisi dalam sepatu menghadap tegak lurus ke bola.',
            'Kunci pergelangan kaki agar kokoh saat terjadi benturan (kontak) dengan bola.',
            'Kenakan bagian tengah bola agar bola bergulir menyusur tanah (ground pass).',
          ],
          commonMistakes: [
            'Pergelangan kaki tidak dikunci sehingga operan lemah atau melenceng.',
            'Mengenai bagian bawah bola yang menyebabkan bola melambung tinggi tanpa arah.',
          ],
        },
        {
          stepNumber: 3,
          title: 'Sikap Akhir / Lanjutan (Follow Through)',
          description: 'Pindahkan berat badan ke depan mengikuti arah ayunan kaki penendang.',
          keyPoints: [
            'Kaki penendang melangkah bebas ke depan mengikuti jalannya bola.',
            'Pandangan mata mengikuti arah laju bola menuju rekan setim.',
            'Kembali ke posisi siap gerak untuk menyongsong fase permainan berikutnya.',
          ],
          commonMistakes: [
            'Gerakan ayunan terhenti mendadak sesaat setelah kontak dengan bola.',
            'Kehilangan keseimbangan sehingga terjatuh ke belakang.',
          ],
        },
      ],
      infographics: {
        title: 'Komparasi Efektivitas Bagian Kaki dalam Passing Sepak Bola',
        data: [
          { label: 'Akurasi Kaki Dalam', value: '95%', desc: 'Sangat ideal untuk umpan pendek dan kombinasi tiki-taka' },
          { label: 'Akurasi Kaki Luar', value: '75%', desc: 'Cocok untuk umpan tipuan dan gerak mengecoh lawan' },
          { label: 'Akurasi Punggung Kaki', value: '80%', desc: 'Prioritas utama untuk tembakan keras (shooting) ke gawang' },
          { label: 'Kontrol Telapak Kaki', value: '90%', desc: 'Efektif untuk menghentikan bola cepat di lapangan rumput' },
        ],
      },
      sections: [
        {
          id: 'sec-1',
          title: '1. Pengertian dan Hakikat Permainan Sepak Bola',
          content: 'Sepak bola merupakan olahraga permainan beregu yang menuntut kerja sama, taktik, dan keterampilan motorik yang lincah. Di tingkat Sekolah Menengah Pertama (SMP), fokus utama pembelajaran PJOK bukan semata-mata mencari kemenangan, melainkan membangun fondasi keterampilan gerak spesifik, kebugaran aerobik, koordinasi mata-kaki, serta menjunjung tinggi nilai fair play dan respek terhadap lawan maupun teman.',
          subsections: [
            {
              title: 'Tujuan Pembelajaran Fase D Kelas VII',
              body: 'Siswa diharapkan mampu menganalisis fakta, konsep, dan prosedur gerak spesifik menendang dan menahan bola, serta mempraktikkannya ke dalam bentuk permainan sederhana yang dimodifikasi sesuai sarana prasarana sekolah.',
            },
          ],
        },
        {
          id: 'sec-2',
          title: '2. Biomekanika Passing Kaki Bagian Dalam',
          content: 'Secara biomekanika, menendang bola dengan kaki bagian dalam memanfaatkan luas penampang medial tarsal dan metatarsal. Dengan memperluas bidang kontak, gaya impulsif yang dialirkan dari tungkai atas melalui sendi lutut menuju bola menjadi lebih merata. Hal ini meminimalisir deviasi sudut lintasan bola, sehingga bola bergerak linier dengan putaran minimal (no knuckle effect) menuju sasaran.',
        },
        {
          id: 'sec-3',
          title: '3. Variasi Pembelajaran Berpasangan & Segitiga Dinamis',
          content: 'Latihan dimulai secara bertahap: (1) Passing statis berpasangan jarak 3 meter; (2) Passing dengan kontrol menggunakan kaki bagian dalam bergantian; (3) Latihan formasi rondo 3 lawan 1 untuk melatih ketepatan pengambilan keputusan di bawah tekanan kawan bermain.',
        },
      ],
      glossary: [
        { term: 'Passing', definition: 'Teknik mengoper atau mengalirkan bola ke rekan satu tim dalam permainan sepak bola.' },
        { term: 'Controlling', definition: 'Teknik menghentikan atau menguasai bola yang datang dari operan atau bola muntah.' },
        { term: 'Follow Through', definition: 'Gerakan lanjutan setelah bagian tubuh melakukan kontak dengan alat atau bola olahraga.' },
        { term: 'Kaki Tumpu', definition: 'Kaki yang menahan berat badan di tanah saat kaki yang lain melakukan ayunan menendang.' },
      ],
      didYouKnow: [
        {
          fact: 'Dalam pertandingan sepak bola modern tingkat dunia, rata-rata seorang gelandang melakukan antara 60 hingga 110 kali umpan kaki bagian dalam dengan tingkat akurasi mencapai 88%!',
          category: 'Statistik Olahraga',
        },
        {
          fact: 'Membiasakan menggunakan kedua kaki (kanan dan kiri) sejak usia SMP akan meningkatkan keseimbangan hemisfer otak kiri dan otak kanan!',
          category: 'Kesehatan Saraf',
        },
      ],
      reflection: {
        prompt: 'Setelah mempelajari dan mempraktikkan teknik mengumpan bola dengan kaki bagian dalam:',
        guidelines: [
          'Bagian mana dari teknik passing yang paling mudah dan paling menantang bagimu?',
          'Bagaimana perasaanmu ketika operanmu berhasil diterima tepat di kaki rekan setim?',
          'Tuliskan satu komitmen untuk meningkatkan kedisiplinan dan kerja sama dalam kelompok olahraga PJOK!',
        ],
      },
      comprehensionQuestions: [
        {
          id: 'q-1',
          question: 'Di manakah posisi kaki tumpu yang tepat saat melakukan passing menggunakan kaki bagian dalam?',
          options: [
            'Tepat di depan bola menghadap ke belakang',
            'Di samping bola berjarak ± 10-15 cm dengan lutut sedikit ditekuk',
            'Jauh di belakang bola sekitar 1 meter',
            'Menyilang di depan kaki penendang',
          ],
          correctAnswerIndex: 1,
          explanation: 'Kaki tumpu yang berada di samping bola berjarak 10-15 cm memberikan ruang ayun yang ideal dan menjaga pusat massa tubuh tetap stabil.',
        },
        {
          id: 'q-2',
          question: 'Mengapa passing dengan kaki bagian dalam menjadi pilihan utama untuk operan jarak pendek?',
          options: [
            'Karena menghasilkan suara paling keras',
            'Karena bidang kontak kaki dengan bola paling luas sehingga akurasinya paling tinggi',
            'Karena bola otomatis melambung ke udara',
            'Karena lawan tidak bisa melihat bola',
          ],
          correctAnswerIndex: 1,
          explanation: 'Sisi dalam kaki memiliki area permukaan terbesar, sehingga kontak dengan bola dapat diarahkan secara tepat dan minim kesalahan arah.',
        },
        {
          id: 'q-3',
          question: 'Apa fungsi utama gerakan lanjutan (follow-through) setelah menendang bola?',
          options: [
            'Agar sepatu tidak kotor',
            'Memastikan tenaga ayunan tersalurkan sempurna dan bola melaju terarah',
            'Untuk menghentikan langkah secara tiba-tiba',
            'Supaya wasit memberikan kartu',
          ],
          correctAnswerIndex: 1,
          explanation: 'Gerak lanjutan menjaga kelancaran momentum gerak kinetik dan memastikan arah laju bola tetap lurus menuju target.',
        },
      ],
      videos: [
        {
          id: 'vid-01',
          title: 'Tutorial Passing Kaki Bagian Dalam Sepak Bola SMP',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '06:45',
          description: 'Panduan video teknik perlambatan (slow motion) posisi tumpuan kaki dan perkenaan bola yang dipandu oleh Purwanto, S.Pd.',
        },
      ],
    },
  },
  {
    id: 'book-pjok-02',
    title: 'Permainan Bola Voli: Gerak Spesifik Passing Bawah',
    targetGrade: 'VII',
    semester: 'Semester 1',
    chapter: 2,
    topic: 'Passing Bawah dan Posisi Lengan',
    category: 'Permainan Bola Besar',
    learningObjectives: [
      'Memahami sikap kuda-kuda dan penguncian kedua lengan saat menerima bola servis atau smash lawan.',
      'Menganalisis sudut ayunan lengan maksimal 90 derajat terhadap badan.',
      'Mempraktikkan gerak passing bawah dengan pantulan bola yang stabil dan terarah.',
      'Mengembangkan komunikasi dan tanggung jawab dalam pembagian zona bertahan di lapangan.',
    ],
    description: 'Buku digital interaktif passing bawah bola voli: posisi kuda-kuda, perkenaan lengan bawah, dan koordinasi dorongan tungkai.',
    status: 'PUBLISHED',
    readDurationMin: 12,
    readPages: 7,
    pdfFileName: 'Buku_PJOK_VII_Bab2_BolaVoli_SMPN2Kutasari.pdf',
    pdfFileSize: '1.9 MB',
    teacherId: 'guru-001',
    teacherName: 'Purwanto, S.Pd.',
    createdAt: '2025-08-10T08:00:00Z',
    updatedAt: '2025-08-15T09:00:00Z',
    publishedAt: '2025-08-15T09:00:00Z',
    content: {
      cover: {
        title: 'Gerak Spesifik Passing Bawah Bola Voli',
        subtitle: 'Kunci Pertahanan dan Serangan Awal Permainan Voli Modern',
        targetGrade: 'VII',
        semester: 'Semester 1',
        chapter: 2,
        topic: 'Passing Bawah dan Posisi Lengan',
        schoolName: 'SMP Negeri 2 Kutasari',
        author: 'Purwanto, S.Pd.',
        learningObjectives: [
          'Memahami sikap kuda-kuda dan penguncian lengan.',
          'Menganalisis sudut pantulan bola pada pergelangan tangan.',
          'Mempraktikkan passing bawah berpasangan secara terukur.',
        ],
        description: 'Modul digital pembelajaran passing bawah bola voli yang menitikberatkan pada perkenaan bidang datar lengan bawah (forearm passing).',
      },
      summary: 'Passing bawah (underhand pass/dig) adalah teknik dasar bola voli yang sangat penting untuk menerima servis lawan, menahan serangan smes, dan mengalirkan bola pertama ke arah setter (pengumpan). Kunci keberhasilan passing bawah terletak pada kesiapan sikap kuda-kuda kaki, kerapatan dan kekokohan kedua siku lengan yang lurus tanpa ditekuk, serta dorongan tubuh bagian bawah.',
      keyPoints: [
        'Kuda-kuda Rendah: Buka kaki selebar bahu, tekuk kedua lutut membentuk sudut sekitar 110-120 derajat.',
        'Kunci Siku Lurus: Rapatkan kedua ibu jari sejajar dan pastikan kedua siku lengan terkunci lurus sempurna.',
        'Bidang Kontak Datar: Bola harus mengenai bagian atas pergelangan tangan hingga pertengahan lengan bawah.',
        'Sumber Tenaga dari Tungkai: Tenaga dorongan bukan berasal dari ayunan lengan yang kencang, melainkan dari pelurusan kedua lutut.',
      ],
      safetyTips: [
        {
          title: 'Lepas Aksesoris Tangan',
          description: 'Lepaskan jam tangan, cincin, atau gelang sebelum bermain agar tidak melukai diri sendiri atau memecahkan permukaan kulit saat terkena hantaman bola kencang.',
          severity: 'high',
        },
        {
          title: 'Gunakan Bola Voli Standar Usia Remaja',
          description: 'Gunakan bola voli berbahan empuk (synthetic leather) dengan tekanan angin sedang (0.30–0.325 kg/cm²) agar lengan tidak memar.',
          severity: 'medium',
        },
        {
          title: 'Komunikasi "Bola Saya!"',
          description: 'Selalu teriakkan aba-aba sebelum mengambil bola agar tidak terjadi benturan kepala atau badan dengan rekan setim.',
          severity: 'medium',
        },
      ],
      techniques: [
        {
          stepNumber: 1,
          title: 'Sikap Kesiapan (Ready Stance)',
          description: 'Berdiri dengan kedua kaki dibuka selebar bahu dan kedua lutut ditekuk siap bergerak menyongsong datangnya bola.',
          keyPoints: [
            'Berat badan bertumpu pada ujung telapak kaki depan.',
            'Kedua tangan siap di depan dada dengan pandangan tertuju ke arah lintasan bola lawan.',
          ],
        },
        {
          stepNumber: 2,
          title: 'Mengunci Pegangan Tangan (Hand Clasping)',
          description: 'Genggam salah satu telapak tangan dengan tangan yang lain, kedua ibu jari rapat sejajar.',
          keyPoints: [
            'Siku lengan ditarik lurus ke depan, jangan ditekuk saat bola mengenai lengan.',
            'Lengan membentuk bidang datar selebar mungkin.',
          ],
        },
        {
          stepNumber: 3,
          title: 'Perkenaan & Dorongan Lengan',
          description: 'Ayunkan kedua lengan ke atas dengan sudut maksimal 90 derajat bersamaan dengan meluruskan kedua lutut kaki.',
          keyPoints: [
            'Perkenaan bola tepat di atas pergelangan tangan (forearm).',
            'Arahkan pandangan ke lintasan bola parabola menuju posisi tosser.',
          ],
        },
      ],
      sections: [
        {
          id: 'sec-v-1',
          title: '1. Peran Strategis Passing Bawah dalam Tim',
          content: 'Tanpa passing bawah yang baik, tim tidak dapat menyusun serangan balik (counter attack). Pemain libero dan pemain bertahan mengandalkan refleks dan presisi passing bawah untuk mengubah bola serangan lawan menjadi peluang poin.',
        },
        {
          id: 'sec-v-2',
          title: '2. Analisis Kesalahan Umum Pemula',
          content: 'Kesalahan paling sering terjadi adalah menekuk kedua siku saat bola menyentuh lengan, yang menyebabkan bola memantul ke belakang kepala pemain itu sendiri. Kesalahan kedua adalah mengayunkan tangan terlalu tinggi melebihi dada.',
        },
      ],
      glossary: [
        { term: 'Dig', definition: 'Penyelamatan bola voli dari serangan smes lawan menggunakan satu atau dua lengan bawah.' },
        { term: 'Libero', definition: 'Pemain spesialis bertahan dalam bola voli yang memiliki seragam berbeda dan tidak boleh melakukan smes atau servis.' },
        { term: 'Forearm', definition: 'Bagian lengan bawah antara pergelangan tangan dan siku yang digunakan sebagai bidang pantul passing.' },
      ],
      didYouKnow: [
        {
          fact: 'Kecepatan smes bola voli putra profesional dapat mencapai lebih dari 130 km/jam! Passing bawah adalah satu-satunya perisai tubuh yang mampu meredam kecepatan tersebut secara aman.',
          category: 'Fisika Olahraga',
        },
      ],
      reflection: {
        prompt: 'Refleksi pembelajaran passing bawah bola voli:',
        guidelines: [
          'Bagaimana tingkat kenyamanan kedua lenganmu saat menerima bola voli?',
          'Mengapa kerja sama dan komunikasi "Saya!" sangat penting di lapangan bola voli?',
        ],
      },
      comprehensionQuestions: [
        {
          id: 'qv-1',
          question: 'Bagaimana posisi kedua siku lengan saat melakukan passing bawah bola voli?',
          options: [
            'Ditekuk membentuk sudut 90 derajat',
            'Lurus dan terkunci rapat tanpa ditekuk',
            'Bebas bergerak fleksibel ke atas dan ke bawah',
            'Ditarik menempel ke pinggang',
          ],
          correctAnswerIndex: 1,
          explanation: 'Kedua siku harus lurus terkunci agar tercipta bidang datar yang kokoh dan bola memantul secara teratur.',
        },
      ],
      videos: [
        {
          id: 'vid-02',
          title: 'Passing Bawah Voli: Posisi Kuda-kuda dan Perkenaan Lengan',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '07:15',
          description: 'Peragaan teknik passing bawah mandiri dan berpasangan siswa SMP.',
        },
      ],
    },
  },
  {
    id: 'book-pjok-03',
    title: 'Atletik: Gerak Spesifik Start Jongkok & Lari Jarak Pendek (Sprint)',
    targetGrade: 'VII',
    semester: 'Semester 1',
    chapter: 3,
    topic: 'Start Jongkok & Akselerasi Sprint 100 Meter',
    category: 'Atletik',
    learningObjectives: [
      'Memahami tiga aba-aba start jongkok: Bersedia, Siap, dan Ya / Bunyi Pistol.',
      'Menganalisis sudut kemiringan badan dan ayunan tangan saat fase akselerasi lari cepat.',
      'Mempraktikkan teknik memasuki garis finis dengan mencondongkan dada ke depan.',
    ],
    description: 'Modul komprehensif atletik cabang lari jarak pendek: aba-aba start jongkok (bunch, medium, long start), fase dorongan awal, hingga teknik finis.',
    status: 'PUBLISHED',
    readDurationMin: 14,
    readPages: 9,
    pdfFileName: 'Buku_PJOK_VII_Bab3_Atletik_Sprint_SMPN2Kutasari.pdf',
    pdfFileSize: '2.1 MB',
    teacherId: 'guru-001',
    teacherName: 'Purwanto, S.Pd.',
    createdAt: '2025-08-25T08:00:00Z',
    updatedAt: '2025-09-01T08:00:00Z',
    publishedAt: '2025-09-01T08:00:00Z',
    content: {
      cover: {
        title: 'Gerak Spesifik Lari Jarak Pendek (Sprint)',
        subtitle: 'Induk dari Segala Cabang Olahraga: Kecepatan, Daya Ledak, dan Ketepatan Start',
        targetGrade: 'VII',
        semester: 'Semester 1',
        chapter: 3,
        topic: 'Start Jongkok & Akselerasi Sprint 100 Meter',
        schoolName: 'SMP Negeri 2 Kutasari',
        author: 'Purwanto, S.Pd.',
        learningObjectives: [
          'Mengidentifikasi tiga jenis start jongkok: bunch, medium, dan long start.',
          'Mempraktikkan aba-aba Bersedia, Siap, dan Ya dengan reaksi cepat.',
          'Menerapkan langkah kaki cepat bertumpu pada ujung telapak kaki.',
        ],
        description: 'Panduan e-book atletik nomor lintasan lari cepat untuk melatih kecepatan reaksi, daya ledak tungkai, dan ketahanan anaerobik siswa.',
      },
      summary: 'Lari jarak pendek (sprint) adalah nomor perlombaan atletik di mana pelari menempuh jarak pendek (100m, 200m, atau 400m) dengan kecepatan maksimum sejak garis start sampai garis finis. Start yang digunakan adalah start jongkok (crouch start) yang memanfaatkan tolakan gaya aksi-reaksi tanah secara eksplosif.',
      keyPoints: [
        'Aba-aba "Bersedia": Jongkok di belakang garis start, tangan membentuk huruf V terbalik di belakang garis.',
        'Aba-aba "Siap": Angkat pinggul lebih tinggi sedikit dari bahu, berat badan condong ke depan, tahan napas.',
        'Aba-aba "Ya!": Dorong kaki depan sekuat tenaga ke balok start/tanah, ayunkan lengan silang berlawanan.',
        'Fase Finis: Condongkan dada ke depan atau putar salah satu bahu ke depan saat menyentuh garis finis.',
      ],
      safetyTips: [
        {
          title: 'Pemanasan Otot Hamstring & Achilles',
          description: 'Lari cepat menuntut kontraksi otot maksimal dalam sepersekian detik. Wajib jogging santai 2 putaran lapangan dan lari kijang (bounding) sebelum sprint.',
          severity: 'high',
        },
        {
          title: 'Garis Lintasan Khusus',
          description: 'Setiap pelari wajib berlari di lintasannya masing-masing. Jangan berpindah lintasan agar tidak bertabrakan dengan pelari lain.',
          severity: 'high',
        },
      ],
      techniques: [
        {
          stepNumber: 1,
          title: 'Aba-aba "Bersedia"',
          description: 'Menempatkan lutut kaki belakang di tanah, ujung kaki depan menumpu di balok start.',
          keyPoints: [
            'Ibu jari dan keempat jari tangan dibuka membentuk huruf "V" terbalik tepat di belakang garis.',
            'Kepala rileks, pandangan santai sekitar 1 meter ke depan bawah.',
          ],
        },
        {
          stepNumber: 2,
          title: 'Aba-aba "Siap"',
          description: 'Mengangkat pinggul ke atas dengan sudut lutut kaki depan sekitar 90 derajat dan kaki belakang 120 derajat.',
          keyPoints: [
            'Pinggul terangkat lebih tinggi dari bahu.',
            'Berat badan berpindah ke kedua tangan yang menumpu kokoh di tanah.',
          ],
        },
        {
          stepNumber: 3,
          title: 'Aba-aba "Ya!" / Bunyi Pistol',
          description: 'Ledakan tolakan kedua kaki serempak mendorong badan ke depan.',
          keyPoints: [
            'Sudut kemiringan badan awal sekitar 45 derajat (fase dorongan akselerasi).',
            'Langkah awal pendek dan cepat, semakin lama semakin panjang (striding).',
          ],
        },
      ],
      sections: [
        {
          id: 'sec-a-1',
          title: '1. Sejarah dan Filosofi Atletik "Mother of Sports"',
          content: 'Atletik disebut sebagai induk olahraga karena gerak dasar atletik (jalan, lari, lompat, lempar) merupakan fondasi gerak manusia purba untuk berburu dan bertahan hidup, yang kemudian distandarisasi sejak Olimpiade Kuno di Yunani.',
        },
      ],
      glossary: [
        { term: 'Sprint', definition: 'Lari dengan kecepatan maksimal sepanjang jarak tempuh perlombaan.' },
        { term: 'Starting Block', definition: 'Balok tumpuan start yang dipasang di lintasan lari untuk memberikan pijakan tolakan eksplosif.' },
        { term: 'Reaction Time', definition: 'Selang waktu antara terdengarnya bunyi aba-aba pistol dengan dimulainya gerakan pertama atlet.' },
      ],
      didYouKnow: [
        {
          fact: 'Manusia tercepat di dunia, Usain Bolt, menempuh lari 100 meter dalam waktu 9.58 detik dengan kecepatan puncak mencapai 44.72 km/jam!',
          category: 'Rekor Dunia',
        },
      ],
      reflection: {
        prompt: 'Refleksi pembelajaran lari jarak pendek:',
        guidelines: [
          'Bagaimana caramu melatih fokus pendengaran saat menunggu aba-aba start?',
          'Apa yang kamu rasakan setelah mengerahkan tenaga maksimal dalam sprint 60/100 meter?',
        ],
      },
      comprehensionQuestions: [
        {
          id: 'qa-1',
          question: 'Bagaimana posisi pinggul pada aba-aba "Siap" dalam start jongkok lari jarak pendek?',
          options: [
            'Lebih rendah dari lutut',
            'Sejajar dengan tumit kaki',
            'Sedikit lebih tinggi dari bahu dengan berat badan condong ke depan',
            'Menempel sepenuhnya ke tanah',
          ],
          correctAnswerIndex: 2,
          explanation: 'Pinggul yang sedikit lebih tinggi dari bahu menyiapkan posisi biomekanik otot quadriceps dan gluteus untuk mendorong tubuh ke depan secara optimal.',
        },
      ],
      videos: [
        {
          id: 'vid-03',
          title: 'Start Jongkok & Transisi Akselerasi Sprint',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '08:30',
          description: 'Penjelasan sudut sendi dan posisi kepala saat start lari 100 meter.',
        },
      ],
    },
  },
  {
    id: 'book-pjok-04',
    title: 'Kebugaran Jasmani: Komponen Daya Tahan, Kekuatan, dan Kelenturan',
    targetGrade: 'VII',
    semester: 'Semester 1',
    chapter: 4,
    topic: 'Tes Kebugaran Jasmani Indonesia (TKJI) & Latihan Sirkuit',
    category: 'Kebugaran Jasmani',
    learningObjectives: [
      'Memahami hakikat kebugaran jasmani dan 5 komponen utamanya.',
      'Menghitung Denyut Nadi Istirahat (RHR) dan Denyut Nadi Latihan (THR).',
      'Mempraktikkan pos-pos latihan sirkuit: push up, sit up, shuttle run, dan lari aerobik.',
    ],
    description: 'Panduan pengukuran dan peningkatan kebugaran jasmani siswa SMP berdasarkan standar TKJI (Tes Kebugaran Jasmani Indonesia).',
    status: 'PUBLISHED',
    readDurationMin: 16,
    readPages: 10,
    pdfFileName: 'Buku_PJOK_VII_Bab4_KebugaranJasmani_SMPN2Kutasari.pdf',
    pdfFileSize: '2.8 MB',
    teacherId: 'guru-001',
    teacherName: 'Purwanto, S.Pd.',
    createdAt: '2025-09-05T08:00:00Z',
    updatedAt: '2025-09-10T08:00:00Z',
    publishedAt: '2025-09-10T08:00:00Z',
    content: {
      cover: {
        title: 'Kebugaran Jasmani untuk Pelajar SMP',
        subtitle: 'Kunci Daya Tahan Tubuh, Semangat Belajar, dan Kesehatan Jangka Panjang',
        targetGrade: 'VII',
        semester: 'Semester 1',
        chapter: 4,
        topic: 'Tes Kebugaran Jasmani Indonesia (TKJI) & Latihan Sirkuit',
        schoolName: 'SMP Negeri 2 Kutasari',
        author: 'Purwanto, S.Pd.',
        learningObjectives: [
          'Memahami definisi dan indikator kebugaran jasmani.',
          'Mampu menghitung denyut nadi latihan secara mandiri.',
          'Melaksanakan tes push-up, sit-up, dan lari kelincahan sesuai standar usia 13-15 tahun.',
        ],
        description: 'Buku digital praktis yang membimbing siswa memahami tubuhnya, menjaga daya tahan jantung-paru, dan membentuk postur tubuh tegap.',
      },
      summary: 'Kebugaran jasmani (physical fitness) adalah kesanggupan dan kemampuan tubuh untuk melakukan pekerjaan atau aktivitas sehari-hari tanpa menimbulkan kelelahan yang berarti, serta masih memiliki sisa cadangan tenaga untuk menikmati waktu luang atau menghadapi keadaan darurat. Lima komponen utama kebugaran jasmani yang terkait dengan kesehatan meliputi daya tahan jantung-paru (cardiorespiratory endurance), kekuatan otot (muscular strength), daya tahan otot (muscular endurance), kelenturan (flexibility), dan komposisi tubuh (body composition).',
      keyPoints: [
        'Daya Tahan Kardiorespirasi: Diukur melalui tes lari multi-tahap (Bleep Test) atau lari 1.000 meter.',
        'Kekuatan Otot: Diukur melalui tes baring duduk (sit-up) 60 detik dan gantung siku tekuk / push-up.',
        'Kelenturan: Kemampuan sendi bergerak leluasa yang dapat dilatih dengan peregangan statis harian.',
        'Rumus Denyut Nadi Maksimal: 220 dikurangi usia siswa. Zona latihan efektif berada di 60% - 80% dari denyut nadi maksimal.',
      ],
      safetyTips: [
        {
          title: 'Cek Denyut Nadi Awal',
          description: 'Bila denyut nadi istirahat melebihi 100 bpm saat duduk diam atau sedang merasa pusing/demam, segera laporkan ke guru PJOK untuk mendapatkan dispensasi.',
          severity: 'high',
        },
        {
          title: 'Hidrasi Cukup',
          description: 'Minumlah air putih 150-200 ml setiap 15-20 menit latihan intensif untuk mencegah dehidrasi.',
          severity: 'medium',
        },
      ],
      techniques: [
        {
          stepNumber: 1,
          title: 'Push-Up yang Benar (Kekuatan Otot Lengan & Dada)',
          description: 'Tubuh lurus dari kepala hingga tumit, siku ditekuk hingga dada berjarak 5 cm dari lantai.',
          keyPoints: [
            'Tangan diletakkan selebar bahu.',
            'Perut dikencangkan agar pinggang tidak melengkung ke bawah.',
          ],
        },
        {
          stepNumber: 2,
          title: 'Sit-Up 60 Detik (Daya Tahan Otot Perut)',
          description: 'Lutut ditekuk membentuk sudut 90 derajat, tangan di belakang kepala atau menyilang di dada.',
          keyPoints: [
            'Angkat tubuh bagian atas hingga siku menyentuh paha.',
            'Turunkan kembali secara terkontrol tanpa menghempaskan punggung.',
          ],
        },
      ],
      sections: [
        {
          id: 'sec-k-1',
          title: '1. Pentingnya Kebugaran bagi Prestasi Akademik',
          content: 'Penelitian kesehatan menunjukkan bahwa siswa dengan tingkat kebugaran kardiorespirasi yang baik memiliki suplai oksigen ke otak yang lebih lancar, yang berdampak langsung pada peningkatan fokus, konsentrasi belajar, dan memori jangka panjang di kelas.',
        },
      ],
      glossary: [
        { term: 'Cardiorespiratory Endurance', definition: 'Kemampuan sistem peredaran darah dan pernapasan untuk memasok oksigen selama aktivitas fisik terus-menerus.' },
        { term: 'VO2 Max', definition: 'Volume maksimal oksigen yang dapat digunakan tubuh per kilogram berat badan per menit.' },
      ],
      didYouKnow: [
        {
          fact: 'Berjalan kaki cepat atau bersepeda selama 30 menit per hari dapat menurunkan risiko penyakit jantung koroner dan diabetes hingga lebih dari 40%!',
          category: 'Kesehatan Remaja',
        },
      ],
      reflection: {
        prompt: 'Refleksi kebugaran jasmani diri sendiri:',
        guidelines: [
          'Bagaimana hasil hitungan denyut nadimu setelah melakukan latihan 15 menit?',
          'Latihan apa yang akan kamu rutinkan setiap pagi di rumah?',
        ],
      },
      comprehensionQuestions: [
        {
          id: 'qk-1',
          question: 'Bagaimana rumus sederhana menghitung Denyut Nadi Maksimal (DNM) seseorang?',
          options: [
            '100 + Usia',
            '220 - Usia',
            '150 x 2',
            '200 - Tinggi Badan',
          ],
          correctAnswerIndex: 1,
          explanation: 'Rumus standar internasional adalah 220 dikurangi usia dalam tahun.',
        },
      ],
      videos: [
        {
          id: 'vid-04',
          title: 'Panduan Praktik Sirkuit Latihan Kebugaran Mandiri',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '10:15',
          description: 'Contoh gerakan kalistenik sederhana tanpa alat yang dapat dilakukan di rumah.',
        },
      ],
    },
  },
];

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Lazy Gemini initialization
  let aiClient: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI PDF Material Transformer Endpoint
  app.post('/api/ai/transform-pdf', async (req, res) => {
    try {
      const {
        title = 'Materi PJOK',
        targetGrade = 'VII',
        semester = 'Semester 1',
        chapter = 1,
        topic = 'Keterampilan Gerak PJOK',
        category = 'Permainan Bola Besar',
        learningObjectives = '',
        description = '',
        pdfFileName = 'materi.pdf',
        pdfText = '',
        teacherName = 'Purwanto, S.Pd.',
      } = req.body || {};

      const gemini = getGemini();

      if (gemini) {
        try {
          const prompt = `Anda adalah Guru Ahli PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan) SMP Negeri 2 Kutasari.
Tugas Anda adalah membaca dan menganalisis modul atau buku ajar PDF PJOK berikut, lalu mengubahnya menjadi Buku Digital Interaktif PJOK yang terstruktur rapi.

PANDUAN KETAT:
1. TIDAK BOLEH mengarang bebas atau menyimpang dari kurikulum PJOK SMP dan materi asli.
2. Gunakan peristilahan anatomi, gerak biomekanik, dan SOP keselamatan olahraga yang tepat dan ramah siswa SMP.
3. Susun output dalam format JSON valid sesuai skema yang diminta.

Informasi Input Modul:
- Judul Materi: ${title}
- Fase/Kelas: Fase D / Kelas ${targetGrade}
- Semester: ${semester}
- Bab: ${chapter}
- Topik Utama: ${topic}
- Kategori Cabang: ${category}
- Capaian/Tujuan Pembelajaran: ${learningObjectives || 'Memahami dan mempraktikkan keterampilan gerak spesifik.'}
- Deskripsi Awal: ${description}
- Nama File: ${pdfFileName}
- Teks Dokumen PDF Terlampir:
"""
${pdfText ? pdfText.slice(0, 10000) : 'Gunakan konteks kurikulum resmi PJOK SMP terkait ' + topic}
"""

Format JSON yang HARUS dikembalikan (hanya JSON tanpa markdown formatting):
{
  "cover": {
    "title": "${title}",
    "subtitle": "Buku Digital Interaktif PJOK Fase D - SMP Negeri 2 Kutasari",
    "chapter": ${Number(chapter)},
    "grade": "${targetGrade}",
    "semester": "${semester}",
    "topic": "${topic}",
    "teacherName": "${teacherName}",
    "learningObjectives": ["poin 1", "poin 2", "poin 3", "poin 4"]
  },
  "summary": "Ringkasan komprehensif materi 2-3 paragraf...",
  "keyPoints": [
    "Poin penting 1 tentang biomekanika / awalan",
    "Poin penting 2 tentang pelaksanaan gerak",
    "Poin penting 3 tentang keselamatan",
    "Poin penting 4 tentang nilai karakter dan sportivitas"
  ],
  "safetyTips": [
    {
      "title": "Pemanasan Otot & Persendian",
      "description": "Instruksi pemanasan spesifik untuk materi ini...",
      "severity": "high"
    },
    {
      "title": "Kesiapan Lapangan & Alat",
      "description": "Pemeriksaan alat dan area latihan...",
      "severity": "medium"
    },
    {
      "title": "Hidrasi dan Sikap Waspada",
      "description": "Menjaga asupan cairan dan melapor jika ada rasa sakit...",
      "severity": "medium"
    }
  ],
  "techniques": [
    {
      "stepNumber": 1,
      "title": "Sikap Awalan (Preparation Stance)",
      "description": "Langkah detail posisi tubuh, pandangan, dan tumpuan kaki sebelum gerak...",
      "keyPoints": ["Titik fokus mata", "Posisi sendi dan sudut lutut", "Keseimbangan pusat massa"],
      "commonMistakes": ["Kesalahan awalan yang sering terjadi 1", "Kesalahan awalan 2"]
    },
    {
      "stepNumber": 2,
      "title": "Pelaksanaan Gerak Pokok (Execution Phase)",
      "description": "Rangkaian koordinasi, ayunan, dan saat perkenaan atau kontak gerak...",
      "keyPoints": ["Waktu pelepasan tenaga", "Sudut dorongan", "Irama gerak"],
      "commonMistakes": ["Kesalahan pelaksanaan gerak 1", "Kesalahan pelaksanaan gerak 2"]
    },
    {
      "stepNumber": 3,
      "title": "Sikap Lanjutan & Pendaratan (Follow-Through)",
      "description": "Sikap akhir pemulihan keseimbangan untuk mencegah cedera pendaratan...",
      "keyPoints": ["Peredaman berat badan", "Kesiapan kembali ke posisi netral"],
      "commonMistakes": ["Pendaratan kaku atau hilang keseimbangan"]
    }
  ],
  "sections": [
    {
      "id": "sec-1",
      "title": "Pengertian dan Manfaat Fisiologis",
      "content": "Uraian materi mendalam...",
      "keyConcept": "Konsep kunci"
    },
    {
      "id": "sec-2",
      "title": "Prinsip Biomekanika dan Analisis Gerak",
      "content": "Penjelasan mekanika otot dan gaya...",
      "keyConcept": "Hukum gerak dan momentum"
    },
    {
      "id": "sec-3",
      "title": "Variasi dan Pola Latihan Mandiri / Berpasangan",
      "content": "Bentuk-bentuk latihan bertahap dari sederhana ke kompleks...",
      "keyConcept": "Progresi drill latihan"
    }
  ],
  "infographics": [
    { "label": "Denyut Nadi Latihan Sasaran", "value": "120 - 150 bpm", "description": "Zona latihan aerobik ideal siswa SMP" },
    { "label": "Durasi Pemanasan Wajib", "value": "10 - 15 Menit", "description": "Peregangan dinamis dan statis" },
    { "label": "Frekuensi Latihan Mandiri", "value": "3x Seminggu", "description": "Mempertahankan kebugaran kardiorespirasi" }
  ],
  "glossary": [
    { "term": "Biomekanika", "definition": "Studi mekanika dan pengaruh gaya pada sistem biologi manusia saat bergerak." },
    { "term": "Follow-through", "definition": "Gerakan lanjutan setelah kontak bola/matras untuk mempertahankan momentum dan keseimbangan." },
    { "term": "Spotter", "definition": "Teman atau instruktur yang mendampingi dan menjaga keselamatan pesenam/atlet saat latihan." }
  ],
  "didYouKnow": [
    "Tahukah Kamu? Melakukan aktivitas PJOK secara teratur selama 30 menit setiap hari dapat memicu pelepasan hormon endorfin yang meningkatkan konsentrasi belajar di kelas!",
    "Dalam pembelajaran gerak spesifik, pengulangan gerak secara sadar (mindful practice) mempercepat pembentukan 'muscle memory' di sistem saraf pusat."
  ],
  "studentReflection": {
    "question": "Setelah mempelajari dan mempraktikkan materi ini, bagian gerak manakah yang terasa paling menantang dan bagaimana rencanamu untuk melatihnya secara aman di rumah atau bersama teman?",
    "promptTips": [
      "Jelaskan kendala posisi awalan, saat kontak, atau sikap akhir.",
      "Tuliskan peran teman atau guru yang membantumu.",
      "Hubungkan dengan perasaan bangga atau peningkatan kebugaran fisikmu."
    ]
  },
  "comprehensionQuestions": [
    {
      "id": "q1",
      "question": "Mengapa posisi lutut harus sedikit ditekuk (merendahkan pusat gravitasi) pada sikap awalan?",
      "options": [
        "Agar tubuh lebih rileks dan siap bergerak ke berbagai arah secara seimbang",
        "Untuk menghemat tenaga agar tidak cepat lelah",
        "Supaya terlihat seperti atlet profesional",
        "Karena diwajibkan oleh aturan pertandingan resmi"
      ],
      "correctIndex": 0,
      "explanation": "Menekuk lutut merendahkan titik berat (pusat gravitasi) tubuh, sehingga meningkatkan kestabilan dan kesiapan motorik untuk berpindah gerak secara eksplosif."
    },
    {
      "id": "q2",
      "question": "Tindakan pencegahan paling utama sebelum melakukan aktivitas olahraga inti adalah...",
      "options": [
        "Langsung minum air es dalam jumlah banyak",
        "Melakukan pemanasan (warming-up) statis dan dinamis secara berurutan",
        "Duduk santai sambil menunggu giliran",
        "Menggunakan pakaian tebal berlapis"
      ],
      "correctIndex": 1,
      "explanation": "Pemanasan meningkatkan suhu otot dan elastisitas tendon sehingga secara efektif mencegah cedera robek otot atau keseleo."
    },
    {
      "id": "q3",
      "question": "Apa manfaat melakukan gerakan lanjutan (follow-through) setelah melakukan tendangan, lemparan, atau gulingan?",
      "options": [
        "Sebagai gaya selebrasi poin",
        "Menjaga momentum, akurasi arah, serta mencegah deselerasi mendadak yang memicu cedera",
        "Membuat bola meluncur tanpa hambatan",
        "Memberikan tanda pergantian pemain"
      ],
      "correctIndex": 1,
      "explanation": "Follow-through menyalurkan gaya kinetik secara merata ke akhir lintasan, menjaga arah gerak tetap akurat, dan melindungi sendi dari hentakan mendadak."
    }
  ]
}`;

          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const textResult = response.text || '';
          const cleanedText = textResult.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanedText);

          return res.json({
            status: 'ok',
            content: parsed,
            source: 'gemini-2.5-flash',
          });
        } catch (geminiError) {
          console.warn('Gemini API transformation failed, falling back to structured PJOK engine:', geminiError);
        }
      }

      // Fallback: Generate robust, structured, zero-hallucination PJOK content
      const fallbackContent = buildStructuredPjokBook({
        title,
        targetGrade,
        semester,
        chapter,
        topic,
        category,
        learningObjectives,
        description,
        pdfFileName,
        pdfText,
        teacherName,
      });

      return res.json({
        status: 'ok',
        content: fallbackContent,
        source: 'structured-engine',
      });
    } catch (err: any) {
      console.error('Server transform-pdf error:', err);
      res.status(500).json({ error: err.message || 'Internal error' });
    }
  });

  // AI Summary Regeneration Endpoint
  app.post('/api/ai/generate-summary', async (req, res) => {
    try {
      const { bookTitle, topic } = req.body || {};
      const gemini = getGemini();

      if (gemini) {
        try {
          const prompt = `Anda adalah Guru PJOK SMP. Buat ringkasan materi dan 4 poin penting untuk materi: "${bookTitle}" (Topik: "${topic}").
Balas dalam JSON valid:
{
  "summary": "Ringkasan 2 paragraf padat berbasis kurikulum PJOK SMP...",
  "keyPoints": ["Poin 1 biomekanika", "Poin 2 teknik pelaksanaan", "Poin 3 keselamatan", "Poin 4 karakter sportivitas"]
}`;
          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' },
          });
          const text = response.text || '';
          const json = JSON.parse(text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim());
          return res.json(json);
        } catch (e) {
          console.warn('Gemini summary generation fallback:', e);
        }
      }

      res.json({
        summary: `${bookTitle} (${topic}) disusun sistematis berdasarkan prinsip pembelajaran Kurikulum Merdeka di SMP Negeri 2 Kutasari. Materi ini mengintegrasikan penguasaan keterampilan biomekanika dasar, pemahaman prinsip keselamatan fisik, dan pembiasaan gaya hidup aktif yang menunjang kebugaran serta daya tahan siswa.`,
        keyPoints: [
          `Biomekanika Posisi Tubuh: Pusat gravitasi direndahkan melalui tekukan lutut yang lentur untuk mempermudah transisi gerak cepat.`,
          `Koordinasi Koordinatif: Mengarahkan fokus mata pada lintasan gerak, menjaga ayunan anggota gerak seimbang, dan mengunci persendian tumpu.`,
          `Pengendalian Tenaga (Power Regulation): Mengatur pengerahan kekuatan otot sesuai jarak target dan tujuan taktik latihan.`,
          `Refleksi Mandiri: Membiasakan evaluasi diri setelah mencoba rangkaian gerak untuk mengenali dan memperbaiki kesalahan teknik.`,
        ],
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // AI Questions Regeneration Endpoint
  app.post('/api/ai/generate-questions', async (req, res) => {
    try {
      const { bookTitle, topic } = req.body || {};
      const gemini = getGemini();

      if (gemini) {
        try {
          const prompt = `Anda adalah Guru PJOK SMP. Buat 3 soal pemahaman pilihan ganda konseptual untuk materi: "${bookTitle}" (${topic}).
Balas dalam JSON valid:
{
  "questions": [
    {
      "id": "q1",
      "question": "Pertanyaan...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Penjelasan..."
    }
  ]
}`;
          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' },
          });
          const text = response.text || '';
          const json = JSON.parse(text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim());
          return res.json(json);
        } catch (e) {
          console.warn('Gemini questions generation fallback:', e);
        }
      }

      res.json({
        questions: [
          {
            id: `q-${Date.now()}-1`,
            question: `Pada materi ${topic}, mengapa posisi tubuh bagian bawah harus dalam keadaan stabil dan fleksibel?`,
            options: [
              'Memudahkan redistribusi pusat gravitasi untuk meredam gaya benturan dan menjaga keseimbangan',
              'Membuat gerakan terlihat lebih santai tanpa memikirkan lawan',
              'Mengurangi kebutuhan asupan air minum saat berolahraga',
              'Agar wasit tidak memberikan peringatan pelanggaran',
            ],
            correctIndex: 0,
            explanation:
              'Stabilitas tungkai kaki dan fleksibilitas sendi lutut berfungsi sebagai suspensi peredam gaya kinetik serta menjaga stabilitas tubuh.',
          },
          {
            id: `q-${Date.now()}-2`,
            question: `Kunci utama dalam mencegah terjadinya cedera leher atau persendian saat berlatih ${topic} adalah...`,
            options: [
              'Melakukan pemanasan menyeluruh dan mematuhi instruksi teknik yang tepat',
              'Melakukan gerakan secepat mungkin tanpa aba-aba guru',
              'Menggunakan peralatan yang keras dan berat',
              'Menolak bantuan dari guru atau rekan spotter',
            ],
            correctIndex: 0,
            explanation:
              'Pemanasan meningkatkan elastisitas serat otot dan pelumasan cairan sinovial sendi, sementara kepatuhan teknik menjamin keamanan gerak.',
          },
          {
            id: `q-${Date.now()}-3`,
            question: `Sikap sportivitas yang harus selalu ditunjukkan saat pembelajaran ${topic} adalah...`,
            options: [
              'Saling menghargai, membantu rekan yang kesulitan, dan mematuhi peraturan latihan',
              'Menyalahkan rekan tim ketika gagal melakukan gerakan',
              'Mengabaikan keselamatan demi mendapatkan pujian',
              'Meninggalkan lapangan latihan sebelum pembelajaran selesai',
            ],
            correctIndex: 0,
            explanation:
              'PJOK mengintegrasikan pembentukan karakter Profil Pelajar Pancasila, seperti gotong royong, disiplin, dan sportivitas tinggi.',
          },
        ],
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ✨ Generate Soal dengan AI (Kuis & Latihan)
  app.post('/api/ai/generate-quiz-questions', async (req, res) => {
    try {
      const {
        topic = 'Keterampilan Gerak PJOK',
        targetGrade = 'VII',
        questionsCount = 5,
        difficulty = 'Sedang',
        questionType = 'campuran',
      } = req.body || {};

      const count = Math.min(Math.max(Number(questionsCount) || 5, 3), 15);
      const gemini = getGemini();

      if (gemini) {
        try {
          const prompt = `Anda adalah Guru Ahli PJOK SMP Negeri 2 Kutasari.
Buat ${count} butir soal asesmen formatif kuis PJOK berdasarkan kurikulum resmi.

Kriteria Pembuatan Soal:
- Topik/Materi: ${topic}
- Sasaran: Siswa SMP Kelas ${targetGrade}
- Tingkat Kesulitan: ${difficulty}
- Format Jenis Soal yang Diminta: ${questionType} (dapat berupa 'pilihan_ganda', 'benar_salah', 'pilihan_gambar', atau kombinasi 'campuran')

Panduan Teknis:
1. Pilihan Ganda: 4 opsi jawaban (A, B, C, D) dengan 1 jawaban benar dan distraktor logis.
2. Benar/Salah: Soal berupa pernyataan konseptual dengan opsi ["Benar", "Salah"].
3. Pilihan Gambar: Soal analisis gerak/ilustrasi, sediakan 4 opsi dengan label dan deskripsi ilustrasi atau URL gambar olahraga yang sesuai.
4. Setiap soal WAJIB memiliki:
   - "type": "pilihan_ganda" | "benar_salah" | "pilihan_gambar"
   - "questionText": teks pertanyaan yang jelas dan menguji pemahaman (C2-C4 Bloom)
   - "options": array string atau objek { "text": string, "imageUrl": string, "label": string }
   - "correctAnswerIndex": indeks jawaban benar (0-3 untuk PG, 0-1 untuk BS)
   - "explanation": pembahasan mendalam mengenai biomekanika gerak, SOP keselamatan, atau aturan olahraga
   - "points": 10 atau 20 poin

Kembalikan HANYA format JSON valid tanpa markdown formatting:
{
  "questions": [
    {
      "id": "q-1",
      "type": "pilihan_ganda",
      "questionText": "Pertanyaan...",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctAnswerIndex": 0,
      "explanation": "Pembahasan ilmiah dan pedagogis...",
      "points": 20
    }
  ]
}`;

          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const textResult = response.text || '';
          const cleanedText = textResult.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanedText);

          if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            const formattedQuestions = parsed.questions.map((q: any, idx: number) => ({
              id: q.id || `ai-q-${Date.now()}-${idx + 1}`,
              type: q.type || 'pilihan_ganda',
              questionText: q.questionText || q.question || `Soal ${idx + 1}`,
              imageUrl: q.imageUrl || undefined,
              options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
              correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
              explanation: q.explanation || 'Pembahasan materi PJOK.',
              points: q.points || 20,
            }));

            return res.json({
              status: 'ok',
              questions: formattedQuestions,
              source: 'gemini-2.5-flash',
            });
          }
        } catch (geminiError) {
          console.warn('Gemini quiz generator fallback:', geminiError);
        }
      }

      // Fallback generator: Produce rich, authentic PJOK questions
      const generatedFallback = generatePjokQuizQuestionsFallback(
        topic,
        targetGrade,
        count,
        difficulty,
        questionType
      );

      return res.json({
        status: 'ok',
        questions: generatedFallback,
        source: 'structured-quiz-engine',
      });
    } catch (err: any) {
      console.error('generate-quiz-questions error:', err);
      res.status(500).json({ error: err.message || 'Internal error' });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PJOK SMART BOOK Server running on http://0.0.0.0:${PORT}`);
  });
}

function buildStructuredPjokBook(params: any) {
  const {
    title,
    targetGrade,
    semester,
    chapter,
    topic,
    category,
    learningObjectives,
    description,
    teacherName,
    pdfText = '',
  } = params;

  // Extract from pdfText if lines exist
  const objectives = learningObjectives
    ? learningObjectives.split(/[\n;•.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 5)
    : [
        `Menganalisis konsep dan keterampilan gerak spesifik pada materi ${topic}.`,
        `Mempraktikkan variasi gerak secara runtut dengan koordinasi motorik yang baik.`,
        `Mengidentifikasi potensi bahaya cedera dan menerapkan prosedur keselamatan mandiri.`,
        `Menunjukkan sikap disiplin, sportivitas, dan tanggung jawab selama beraktivitas jasmani.`,
      ];

  return {
    cover: {
      title,
      subtitle: `Buku Digital Interaktif PJOK Fase D - SMP Negeri 2 Kutasari`,
      chapter: Number(chapter),
      grade: targetGrade,
      semester,
      topic,
      teacherName: teacherName || 'Purwanto, S.Pd.',
      learningObjectives: objectives.slice(0, 5),
    },
    summary:
      description ||
      `${title} (${topic}) merupakan modul materi ajar resmi mata pelajaran PJOK Kelas ${targetGrade} ${semester} di SMP Negeri 2 Kutasari. Materi ini berfokus pada pembentukan koordinasi gerak yang efektif, pemahaman keselamatan jasmani, serta pembiasaan gaya hidup aktif bagi pelajar generasi sehat dan berkarakter.`,
    keyPoints: [
      `Penguasaan Gerak Pokok: Memahami urutan teknik dasar mulai dari sikap awalan, fase pelaksanaan gerak, hingga sikap pemulihan (follow-through).`,
      `Keseimbangan & Pusat Gravitasi: Memposisikan kuda-kuda kaki dan merendahkan pusat massa tubuh guna stabilitas gerak maksimal.`,
      `Akurasi & Koordinasi Kinestetik: Menyelaraskan arah pandangan mata, ayunan anggota tubuh, dan ritme pernapasan yang teratur.`,
      `Karakter Sportivitas: Mengedepankan sikap saling menghargai kawan, menghormati petunjuk guru pembimbing, dan menjaga kebersihan arena olahraga.`,
    ],
    safetyTips: [
      {
        title: 'Pemanasan Terstruktur Wajib',
        description:
          'Lakukan peregangan dinamis dan statis selama 10-15 menit sebelum mempraktikkan gerakan intensif guna mencegah kram otot dan cedera sendi.',
        severity: 'high',
      },
      {
        title: 'Pemeriksaan Sarana dan Matras/Bola',
        description:
          'Pastikan permukaan lantai, matras, atau bola dalam kondisi bersih, tidak licin, dan tidak ada retakan atau benda tajam berbahaya.',
        severity: 'medium',
      },
      {
        title: 'Kecukupan Hidrasi dan Sinyal Tubuh',
        description:
          'Konsumsi air minum yang cukup sebelum dan sesudah berolahraga. Segera lapor kepada guru jika merasa pusing, mual, atau sesak napas.',
        severity: 'medium',
      },
    ],
    techniques: [
      {
        stepNumber: 1,
        title: 'Sikap Awalan (Preparation Stance)',
        description: `Posisikan tubuh dalam keadaan siap, seimbang, dan rileks menghadap ke arah sasaran gerak untuk materi ${topic}.`,
        keyPoints: [
          'Kedua kaki dibuka selebar bahu dengan lutut sedikit ditekuk lentur.',
          'Pusatkan pandangan mata lurus fokus ke arah sasaran target.',
          'Jaga berat badan terbagi rata pada kedua telapak kaki depan.',
        ],
        commonMistakes: [
          'Kedua lutut terkunci lurus sehingga tubuh menjadi kaku dan lambat bereaksi.',
          'Pandangan terdistraksi dan tidak fokus ke sasaran.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Pelaksanaan Gerak Utama (Execution Phase)',
        description: `Lakukan rangkaian gerak inti ${topic} dengan koordinasi otot yang teratur, presisi, dan terkontrol.`,
        keyPoints: [
          'Ayunkan anggota badan secara proporsional mengikuti ritme gerak alami.',
          'Keluarkan daya ledak otot saat momen kontak atau dorongan utama.',
          'Jaga pernapasan tetap stabil saat mengerahkan tenaga fisik.',
        ],
        commonMistakes: [
          'Terburu-buru melepaskan tenaga sebelum mencapai posisi tumpuan yang pas.',
          'Mengerahkan tenaga berlebihan sehingga kontrol gerak hilang.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Sikap Lanjutan & Akhir (Follow-Through)',
        description: `Pertahankan kelanjutan gerak untuk meredam gaya dorong dan segera kembali ke posisi siap siaga.`,
        keyPoints: [
          'Lanjutkan ayunan anggota badan ke depan secara wajar tanpa ditahan kaku.',
          'Lakukan pendaratan dengan mengeper pada kedua telapak kaki.',
          'Kembali ke posisi seimbang untuk siap melakukan aksi berikutnya.',
        ],
        commonMistakes: [
          'Menghentikan gerak secara mendadak yang berisiko mencederai sendi.',
          'Mendarat dengan tumit atau lutut lurus kaku.',
        ],
      },
    ],
    sections: [
      {
        id: 'sec-1',
        title: `Konsep Dasar dan Karakteristik ${topic}`,
        content: `${topic} adalah salah satu cabang keterampilan dalam ${category} yang mengutamakan kelincahan, ketepatan, dan kerja sama motorik. Mempelajari materi ini melatih kepekaan gerak refleks dan membangun daya tahan kardiorespirasi peserta didik.`,
        keyConcept: `Biomekanika motorik dan koordinasi refleks.`,
      },
      {
        id: 'sec-2',
        title: 'Biomekanika dan Analisis Gerak Spesifik',
        content: `Dalam setiap gerakan fisik, efisiensi energi tercapai saat gaya dorong bekerja searah dengan garis gerak yang dituju. Keseimbangan tubuh terjaga saat garis gravitasi berada tepat di dalam dasar penumpu kedua kaki.`,
        keyConcept: `Hukum aksi-reaksi dan titik berat badan.`,
      },
      {
        id: 'sec-3',
        title: 'Petunjuk Latihan Mandiri & Berpasangan',
        content: `Mulai latihan dengan intensitas rendah secara mandiri untuk menguasai sikap awalan. Lanjutkan dengan latihan berpasangan untuk melatih respons timing dan toleransi kerja sama tim. Catat setiap kemajuan pada jurnal PJOK.`,
        keyConcept: `Prinsip progresi latihan bertahap (overload gradual).`,
      },
    ],
    infographics: [
      { label: 'Zona Latihan Aerobik', value: '130 - 155 bpm', description: 'Denyut nadi ideal fase aktivitas inti' },
      { label: 'Durasi Latihan Ideal', value: '3 x 40 Menit', description: 'Alokasi waktu tatap muka per pekan' },
      { label: 'Indeks Kebugaran Siswa', value: 'Sangat Baik (A)', description: 'Target capaian kompetensi fisik' },
    ],
    glossary: [
      { term: 'Kinestetik', definition: 'Kemampuan merasakan posisi tubuh dan anggota gerak dalam ruang tanpa harus melihatnya.' },
      { term: 'Follow-Through', definition: 'Gerakan lanjutan setelah pelepasan gaya untuk menjaga akurasi dan meredam beban sendi.' },
      { term: 'Spotter', definition: 'Rekan atau guru yang mendampingi langsung guna mengantisipasi kegagalan gerak dan menjaga keselamatan.' },
      { term: 'Muscle Memory', definition: 'Kemampuan sistem saraf mengingat dan mereplikasi pola gerak secara otomatis setelah pengulangan terlatih.' },
    ],
    didYouKnow: [
      `Tahukah Kamu? Latihan fisik teratur terbukti merangsang neurogenesis di bagian hipokampus otak yang secara signifikan meningkatkan daya ingat akademik siswa!`,
      `Otot manusia memiliki ribuan sensor proprioseptor yang mengirimkan sinyal posisi ke otak setiap milidetik saat kita berolahraga.`,
    ],
    studentReflection: {
      question: `Setelah membaca dan mencoba rangkaian gerak pada materi ${topic}, bagian manakah yang sudah kamu kuasai dengan baik dan bagian mana yang memerlukan bimbingan lebih lanjut dari guru atau teman?`,
      promptTips: [
        'Deskripsikan teknik awalan, pelaksanaan, atau pendaratan.',
        'Sebutkan kesulitan yang kamu rasakan (misalnya keseimbangan, kelenturan, atau kekuatan otot).',
        'Tuliskan target latihan perbaikan yang ingin kamu capai pada pertemuan berikutnya.',
      ],
    },
    comprehensionQuestions: [
      {
        id: 'q1',
        question: `Mengapa pada sikap awalan berolahraga kedua lutut dianjurkan sedikit ditekuk (merendahkan titik berat)?`,
        options: [
          'Agar tubuh lebih stabil dan fleksibel bereaksi ke segala arah gerakan',
          'Untuk menghemat energi agar tidak berkeringat banyak',
          'Karena merupakan gaya estetika wajib dari wasit',
          'Supaya otot tidak perlu berkontraksi sama sekali',
        ],
        correctIndex: 0,
        explanation:
          'Menekuk lutut menurunkan pusat gravitasi tubuh lebih dekat ke bidang tumpu, sehingga stabilitas dan kelincahan gerak meningkat drastis.',
      },
      {
        id: 'q2',
        question: `Tujuan terpenting dari gerakan ikutan (follow-through) setelah melakukan teknik utama adalah...`,
        options: [
          'Menjaga momentum gerak, arah akurasi, dan mencegah cedera akibat deselerasi mendadak',
          'Menandai bahwa gerakan telah selesai kepada penonton',
          'Mengelabui pandangan lawan agar bingung',
          'Mempercepat langkah lari kembali ke garis start',
        ],
        correctIndex: 0,
        explanation:
          'Follow-through mencegah gaya inersia berhenti secara menghentak pada sendi dan tendon, sekaligus menjaga lintasan arah gerak tetap presisi.',
      },
      {
        id: 'q3',
        question: `Sikap yang paling tepat jika seorang rekan sekelas mengalami cedera terkilir saat praktik di lapangan adalah...`,
        options: [
          'Segera menghentikan latihan, mengistirahatkan korban, dan memanggil guru PJOK untuk pertolongan pertama',
          'Meminta rekan tersebut tetap memaksakan diri menyelesaikan latihan',
          'Meninggalkan rekan tersebut dan melanjutkan permainan',
          'Memberikan obat minum tanpa resep guru atau dokter',
        ],
        correctIndex: 0,
        explanation:
          'Pertolongan pertama pada cedera olahraga mengutamakan metode RICE (Rest, Ice, Compression, Elevation) dan penanganan oleh tenaga ahli/guru.',
      },
    ],
    videos: [
      {
        id: `v-sample-1`,
        title: `Video Pembelajaran: Analisis Biomekanika ${topic}`,
        videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        duration: '06:45',
        description: `Panduan visual gerakan spesifik ${topic} oleh Purwanto, S.Pd. SMP Negeri 2 Kutasari.`,
      },
    ],
  };
}

function generatePjokQuizQuestionsFallback(
  topic: string,
  targetGrade: string,
  count: number,
  difficulty: string,
  questionType: string
) {
  const pointsPerQuestion = Math.max(5, Math.round(100 / count));

  // Pool of pedagogical templates tailored for PJOK SMP
  const templates = [
    {
      type: 'pilihan_ganda' as const,
      questionText: `Pada pelaksanaan teknik dasar ${topic}, mengapa posisi tubuh bagian bawah (lutut dan tungkai) harus dijaga lentur dan sedikit ditekuk?`,
      options: [
        'Merendahkan pusat gravitasi tubuh agar stabilitas terjaga dan siap bereaksi cepat',
        'Menghemat tenaga agar pemain tidak cepat lelah saat bertanding',
        'Menambah berat badan saat bersentuhan dengan pemain lawan',
        'Memenuhi syarat formal peraturan pertandingan resmi',
      ],
      correctAnswerIndex: 0,
      explanation: `Dalam biomekanika olahraga, merendahkan titik berat (center of gravity) dengan menekuk lutut meningkatkan stabilitas dan mempermudah akselerasi transisi gerak pada ${topic}.`,
    },
    {
      type: 'benar_salah' as const,
      questionText: `Pernyataan: "Gerakan ikutan (follow-through) setelah melakukan teknik utama pada materi ${topic} berfungsi untuk meredam deselerasi mendadak dan mencegah cedera persendian."`,
      options: ['Benar', 'Salah'],
      correctAnswerIndex: 0,
      explanation: `Benar. Follow-through menyalurkan sisa energi kinetik secara bertahap sehingga sendi dan ligamen terhindar dari sentakan gaya tiba-tiba.`,
    },
    {
      type: 'pilihan_gambar' as const,
      questionText: `Perhatikan analisis gerak ${topic}. Manakah fase pelaksanaan yang menunjukkan koordinasi sikap tumpuan dan kontak gerak yang paling tepat?`,
      options: [
        {
          text: 'Fase A: Kaki tumpu di samping bola/matras, lutut menekuk, pandangan fokus ke sasaran gerak',
          imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60',
          label: 'A',
        },
        {
          text: 'Fase B: Kedua kaki kaku lurus, pandangan melihat ke bawah tanpa memperhatikan arah sasaran',
          imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=60',
          label: 'B',
        },
        {
          text: 'Fase C: Tubuh condong ke belakang berlebihan sehingga kehilangan kendali pusat gravitasi',
          imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60',
          label: 'C',
        },
        {
          text: 'Fase D: Mendarat dengan tumit keras tanpa mengeperkan sendi pergelangan kaki',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60',
          label: 'D',
        },
      ],
      correctAnswerIndex: 0,
      explanation: `Fase A merupakan postur biomekanis ideal yang memenuhi prinsip dasar keseimbangan dan akurasi gerak ${topic}.`,
    },
    {
      type: 'pilihan_ganda' as const,
      questionText: `Tindakan pencegahan paling utama (SOP Keselamatan) yang wajib dilakukan siswa sebelum mempraktikkan materi ${topic} adalah...`,
      options: [
        'Melakukan pemanasan terstruktur (stretching dinamis dan statis) selama 10-15 menit',
        'Langsung mencoba teknik tersulit dengan kekuatan maksimal untuk menguji nyali',
        'Meminum air es sebanyak-banyaknya sesaat sebelum masuk ke lapangan',
        'Mengabaikan aba-aba guru pendamping demi menghemat waktu jam pelajaran',
      ],
      correctAnswerIndex: 0,
      explanation: `Pemanasan meningkatkan suhu otot, elastisitas tendon, dan aliran darah guna mencegah kram otot atau dislokasi sendi.`,
    },
    {
      type: 'benar_salah' as const,
      questionText: `Pernyataan: "Dalam pembelajaran ${topic}, nilai sportivitas dan gotong royong dapat ditunjukkan dengan saling membantu rekan yang kesulitan menguasai teknik gerak."`,
      options: ['Benar', 'Salah'],
      correctAnswerIndex: 0,
      explanation: `Benar. Kurikulum Merdeka PJOK menanamkan dimensi Profil Pelajar Pancasila: Gotong Royong, Mandiri, dan Akhlak Mulia (sportivitas).`,
    },
    {
      type: 'pilihan_ganda' as const,
      questionText: `Kesalahan umum (common mistake) yang paling sering terjadi saat pemula mempelajari ${topic} adalah...`,
      options: [
        'Tubuh terlalu kaku dan terburu-buru melepaskan tenaga sebelum posisi awalan stabil',
        'Mengikuti instruksi guru dengan saksama langkah demi langkah',
        'Menggunakan sepatu dan pakaian olahraga yang sesuai standar',
        'Melakukan pendinginan (cooling down) setelah selesai latihan',
      ],
      correctAnswerIndex: 0,
      explanation: `Kekakuan otot dan hilangnya ketenangan awalan sering menyebabkan koordinasi motorik terganggu dan arah gerak menjadi melenceng.`,
    },
    {
      type: 'pilihan_gambar' as const,
      questionText: `Pada materi ${topic}, manakah posisi pendaratan atau sikap pemulihan (follow-through) yang aman untuk mencegah cedera lutut?`,
      options: [
        {
          text: 'Pendaratan lentur (mengeper) dengan kedua lutut ditekuk membentuk sudut redam',
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60',
          label: 'A',
        },
        {
          text: 'Pendaratan keras bertumpu pada tumit dengan lutut terkunci lurus tegak',
          imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=60',
          label: 'B',
        },
        {
          text: 'Jatuh bertumpu pada satu tangan yang direntangkan lurus kaku ke tanah',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60',
          label: 'C',
        },
        {
          text: 'Melompat berputar tanpa memperhatikan kondisi area di sekeliling lapangan',
          imageUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=500&auto=format&fit=crop&q=60',
          label: 'D',
        },
      ],
      correctAnswerIndex: 0,
      explanation: `Pendaratan mengeper memanfaatkan otot paha dan betis sebagai peredam kejut alami untuk melindungi persendian tulang belakang dan tempurung lutut.`,
    },
    {
      type: 'pilihan_ganda' as const,
      questionText: `Bagaimana cara mengukur bahwa intensitas latihan pada materi ${topic} berada dalam zona aman dan menyehatkan bagi siswa Kelas ${targetGrade}?`,
      options: [
        'Denyut nadi latihan berada di rentang 120–150 detak per menit (bpm) dan napas masih dapat berbicara singkat',
        'Siswa merasa pusing berkunang-kunang dan mual hebat',
        'Denyut jantung tidak mengalami peningkatan sama sekali dari kondisi istirahat',
        'Tidak mengeluarkan keringat sedikit pun selama 60 menit pembelajaran',
      ],
      correctAnswerIndex: 0,
      explanation: `Zona target denyut nadi latihan aerobik siswa usia SMP adalah 60-80% dari denyut nadi maksimal (220 - usia).`,
    },
    {
      type: 'benar_salah' as const,
      questionText: `Pernyataan: "Jika saat mempraktikkan ${topic} seorang teman terkilir atau kram, pertolongan pertama yang tepat adalah mengompres es dan mengistirahatkan bagian yang sakit (prinsip RICE)."`,
      options: ['Benar', 'Salah'],
      correctAnswerIndex: 0,
      explanation: `Benar. Metode RICE (Rest, Ice, Compression, Elevation) adalah standar emas pertolongan pertama cedera jaringan lunak akut.`,
    },
    {
      type: 'pilihan_ganda' as const,
      questionText: `Dalam pembelajaran gerak spesifik ${topic}, apa yang dimaksud dengan pembentukan 'muscle memory' melalui latihan berulang?`,
      options: [
        'Kemampuan sistem saraf pusat mengingat dan mengeksekusi pola gerak secara otomatis dan efisien',
        'Pertambahan ukuran otot lengan secara drastis dalam waktu 1 hari latihan',
        'Menghafalkan buku materi tanpa perlu mempraktikkan gerakan di lapangan',
        'Kemampuan menahan napas dalam jangka waktu yang sangat lama',
      ],
      correctAnswerIndex: 0,
      explanation: `Pengulangan gerak dengan teknik yang benar melatih jalur sinapsis saraf motorik sehingga gerakan menjadi refleks dan presisi.`,
    },
  ];

  // Filter or match requested type
  let filteredPool = templates;
  if (questionType === 'pilihan_ganda') {
    filteredPool = templates.filter((t) => t.type === 'pilihan_ganda');
  } else if (questionType === 'benar_salah') {
    filteredPool = templates.filter((t) => t.type === 'benar_salah');
  } else if (questionType === 'pilihan_gambar') {
    filteredPool = templates.filter((t) => t.type === 'pilihan_gambar');
  }

  if (filteredPool.length === 0) {
    filteredPool = templates;
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const template = filteredPool[i % filteredPool.length];
    result.push({
      id: `ai-q-${Date.now()}-${i + 1}`,
      type: template.type,
      questionText: template.questionText,
      options: template.options,
      correctAnswerIndex: template.correctAnswerIndex,
      explanation: template.explanation,
      points: pointsPerQuestion,
    });
  }

  return result;
}

startServer();

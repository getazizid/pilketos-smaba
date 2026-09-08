/**
 * Data Awal Realistis Pemilihan Ketua & Wakil Ketua OSIS SMAN 1 Batu 2026
 * Menggunakan sistem penomoran kelas reguler: X-1 s/d X-12, XI-1 s/d XI-12, XII-1 s/d XII-12 (Tanpa Jurusan)
 */

export const INITIAL_CANDIDATES = [
  {
    id: 'paslon-1',
    number: 1,
    chairmanName: 'Muhammad Rizky Pratama',
    viceChairmanName: 'Aisyah Putri Maharani',
    chairmanClass: 'XI-1',
    viceChairmanClass: 'X-3',
    photoUrl: '/assets/paslon1.jpg',
    tagline: 'Sinergis, Berkarakter, Unggul dalam IPTEK dan Kebudayaan',
    vision: 'Mewujudkan OSIS SMA Negeri 1 Batu sebagai wadah aspirasi siswa yang inklusif, adaptif terhadap perkembangan teknologi, dan berakar kuat pada nilai luhur budi pekerti serta prestasi berdaya saing global.',
    missions: [
      'Meningkatkan kolaborasi aktif antara seluruh ekstrakurikuler dan organisasi sekolah.',
      'Mengembangkan platform digital SMABA untuk keterbukaan aspirasi dan informasi kegiatan siswa.',
      'Menyelenggarakan festival seni budaya dan inovasi IPTEK tahunan tingkat Malang Raya.',
      'Memperkuat program pembinaan karakter, kedisiplinan, dan kepedulian lingkungan hidup di lingkungan sekolah.'
    ],
    workPrograms: [
      'SMABA Tech & Science Fair 2026',
      'Podcast Suara Siswa & Kotak Aspirasi Digital',
      'Green School SMABA: Gerakan Bebas Sampah Plastik',
      'Bakti Sosial & Pengabdian Masyarakat Kota Batu'
    ],
    voteCount: 0
  },
  {
    id: 'paslon-2',
    number: 2,
    chairmanName: 'Galih Bayu Setyo',
    viceChairmanName: 'Nabila Zahra Khairunnisa',
    chairmanClass: 'XI-4',
    viceChairmanClass: 'XI-7',
    photoUrl: '/assets/paslon2.jpg',
    tagline: 'Bersama Menuju Perubahan: Nyata, Transparan, Berprestasi',
    vision: 'Transformasi OSIS SMAN 1 Batu sebagai motor penggerak siswa yang berintegritas tinggi, berprestasi akademik dan non-akademik, serta peka terhadap dinamika sosial.',
    missions: [
      'Membangun tata kelola OSIS yang transparan, akuntabel, dan responsif terhadap kebutuhan siswa.',
      'Mengoptimalkan program mentoring akademik sebaya dan klinik persiapan UTBK/SNBP.',
      'Memperluas kemitraan dengan perguruan tinggi terkemuka dan industri kreatif untuk bekal masa depan siswa.',
      'Mendukung penuh pengembangan minat bakat di bidang e-sport, olahraga prestasi, dan kepemimpinan.'
    ],
    workPrograms: [
      'SMABA Leadership Camp & Mental Health Corner',
      'Liga Olahraga & E-Sport Antar Kelas (Classmeeting Juara)',
      'Career Day & Expo Perguruan Tinggi Nasional',
      'OSIS Peduli Kasih & Aksi Tanggap Bencana'
    ],
    voteCount: 0
  },
  {
    id: 'paslon-3',
    number: 3,
    chairmanName: 'Kirana Larasati Wijaya',
    viceChairmanName: 'Dimas Arya Pamungkas',
    chairmanClass: 'XI-9',
    viceChairmanClass: 'X-5',
    photoUrl: '/assets/paslon3.jpg',
    tagline: 'Harmoni SMABA: Berbudaya, Berjiwa Pemimpin, Menginspirasi',
    vision: 'Menjadikan OSIS SMAN 1 Batu sebagai pusat peradaban kesiswaan yang harmonis, kreatif, menjunjung tinggi kearifan lokal Kota Wisata Batu, dan berwawasan internasional.',
    missions: [
      'Mempererat persaudaraan dan solidaritas antar angkatan melalui program terpadu berkala.',
      'Menggali dan mempromosikan talenta kesenian khas Jawa Timur dan ekonomi kreatif siswa.',
      'Menciptakan ruang dialog terbuka berkala antara perwakilan kelas, OSIS, MPK, dan pimpinan sekolah.',
      'Membudayakan literasi digital, riset ilmiah remaja, dan bahasa asing aktif.'
    ],
    workPrograms: [
      'SMABA Cultural Night & Art Exhibition 2026',
      'Forum Parlemen Siswa (Diskusi Rutin Bulanan)',
      'English & Foreign Language Conversation Club',
      'SMABA Creative Hub & Kewirausahaan Mandiri'
    ],
    voteCount: 0
  }
];

export const INITIAL_STUDENTS = [
  { id: 'std-1', nisn: '0071234501', name: 'Achmad Fauzi Maulana', class: 'XII-1', gender: 'L', token: 'SB26A1', hasVoted: false, votedAt: null },
  { id: 'std-2', nisn: '0071234502', name: 'Annisa Bella Safitri', class: 'XII-2', gender: 'P', token: 'SB26B2', hasVoted: false, votedAt: null },
  { id: 'std-3', nisn: '0071234503', name: 'Bagas Aditya Nugraha', class: 'XII-4', gender: 'L', token: 'SB26C3', hasVoted: false, votedAt: null },
  { id: 'std-4', nisn: '0071234504', name: 'Cantika Dewi Anggraini', class: 'XII-6', gender: 'P', token: 'SB26D4', hasVoted: false, votedAt: null },
  { id: 'std-5', nisn: '0081234505', name: 'Dimas Rendy Saputra', class: 'XI-3', gender: 'L', token: 'SB26E5', hasVoted: false, votedAt: null },
  { id: 'std-6', nisn: '0081234506', name: 'Fadhilah Nur Rahma', class: 'XI-5', gender: 'P', token: 'SB26F6', hasVoted: false, votedAt: null },
  { id: 'std-7', nisn: '0091234507', name: 'Gibran Arya Sena', class: 'X-1', gender: 'L', token: 'SB26G7', hasVoted: false, votedAt: null },
  { id: 'std-8', nisn: '0091234508', name: 'Hafizhah Aulia Putri', class: 'X-2', gender: 'P', token: 'SB26H8', hasVoted: false, votedAt: null },
  { id: 'std-9', nisn: '0091234509', name: 'Ilham Wahyu Pratama', class: 'X-7', gender: 'L', token: 'SB26J9', hasVoted: false, votedAt: null },
  { id: 'std-10', nisn: '0091234510', name: 'Jessica Aurelia Gunawan', class: 'X-11', gender: 'P', token: 'SB26K0', hasVoted: false, votedAt: null }
];

export const INITIAL_SETTINGS = {
  eventName: 'Pemilihan Ketua & Wakil Ketua OSIS SMA Negeri 1 Batu',
  period: '2026/2027',
  status: 'BUKA', // 'BUKA', 'ISTIRAHAT', 'TUTUP'
  schoolName: 'SMA Negeri 1 Batu',
  schoolAddress: 'Jl. KH. Agus Salim No. 57, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65314',
  schoolLogo: '/assets/logo.png',
  headmasterName: 'Anto Dwi Cahyono., S.Pd., M.M',
  osisAdvisorName: 'Distri Adi Setiawan ., S.Pd., SS',
  committeeLeaderName: 'Kurnia Ramadhan (Ketua MPK)',
  startTime: '2026-09-08T07:30',
  endTime: '2026-09-08T14:30',
  allowLiveCount: true,
  tpsCode: 'TPS-01 Aula Graha SMABA',
  requireTpsCode: true,
  tpsSecurityCode: 'SMABA-TPS-2026',
  blockMobile: true
};

export const INITIAL_USERS = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'Super Admin Pilketos',
    role: 'ADMIN',
    tps: 'Pusat'
  },
  {
    id: 'user-operator1',
    username: 'operator1',
    name: 'Panitia TPS 01 (Aula)',
    role: 'OPERATOR',
    tps: 'TPS-01 Aula'
  },
  {
    id: 'user-saksi',
    username: 'saksi',
    name: 'Saksi Independen MPK',
    role: 'SAKSI',
    tps: 'Semua TPS'
  }
];

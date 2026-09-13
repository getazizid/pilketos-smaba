/**
 * Data Awal Realistis Pemilihan Ketua & Wakil Ketua OSIS SMAN 1 Batu 2026
 * Menggunakan sistem penomoran kelas reguler: X-1 s/d X-12, XI-1 s/d XI-12, XII-1 s/d XII-12 (Tanpa Jurusan)
 */

export const INITIAL_CANDIDATES = [
  {
    id: 'paslon-1',
    number: 1,
    chairmanName: 'Ayasha Ghassani S',
    viceChairmanName: 'Najma Aulia A',
    chairmanClass: 'XI',
    viceChairmanClass: 'X',
    photoUrl: '/assets/paslon1.jpg',
    voteCount: 0
  },
  {
    id: 'paslon-2',
    number: 2,
    chairmanName: 'Aprillia Kusuma D',
    viceChairmanName: 'Rafif Bintang A',
    chairmanClass: 'XI',
    viceChairmanClass: 'X',
    photoUrl: '/assets/paslon2.jpg',
    voteCount: 0
  },
  {
    id: 'paslon-3',
    number: 3,
    chairmanName: 'Fahriafinka Awadullah',
    viceChairmanName: 'Alvaro Axelle A',
    chairmanClass: 'XI',
    viceChairmanClass: 'X',
    photoUrl: '/assets/paslon3.jpg',
    voteCount: 0
  }
];

export const INITIAL_STUDENTS = [
  { id: 'std-1', nisn: '0071234501', name: 'Achmad Fauzi Maulana', class: 'XII-1', gender: 'L', token: 'SB26A1', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-2', nisn: '0071234502', name: 'Annisa Bella Safitri', class: 'XII-2', gender: 'P', token: 'SB26B2', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-3', nisn: '0071234503', name: 'Bagas Aditya Nugraha', class: 'XII-4', gender: 'L', token: 'SB26C3', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-4', nisn: '0071234504', name: 'Cantika Dewi Anggraini', class: 'XII-6', gender: 'P', token: 'SB26D4', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-5', nisn: '0081234505', name: 'Dimas Rendy Saputra', class: 'XI-3', gender: 'L', token: 'SB26E5', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-6', nisn: '0081234506', name: 'Fadhilah Nur Rahma', class: 'XI-5', gender: 'P', token: 'SB26F6', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-7', nisn: '0091234507', name: 'Gibran Arya Sena', class: 'X-1', gender: 'L', token: 'SB26G7', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-8', nisn: '0091234508', name: 'Hafizhah Aulia Putri', class: 'X-2', gender: 'P', token: 'SB26H8', hasVoted: false, votedAt: null, voterType: 'SISWA' },
  { id: 'std-9', nisn: '198104122006041008', name: 'Drs. Hendro Wibowo, M.Pd.', class: 'Guru Bahasa Indonesia', gender: 'L', token: 'GR2601', hasVoted: false, votedAt: null, voterType: 'GURU' },
  { id: 'std-10', nisn: '198602182010012015', name: 'Tri Wahyuni, S.Pd.', class: 'Guru Matematika', gender: 'P', token: 'GR2602', hasVoted: false, votedAt: null, voterType: 'GURU' },
  { id: 'std-11', nisn: '199003252019031005', name: 'Bambang Eko Prasetyo, S.Kom.', class: 'Tendik / Operator IT', gender: 'L', token: 'TK2601', hasVoted: false, votedAt: null, voterType: 'TENDIK' },
  { id: 'std-12', nisn: '198807152014022003', name: 'Dewi Lestari, A.Md.', class: 'Tendik / Staf Tata Usaha', gender: 'P', token: 'TK2602', hasVoted: false, votedAt: null, voterType: 'TENDIK' }
];

export const INITIAL_SETTINGS = {
  eventName: 'Pemilihan Ketua & Wakil Ketua OSIS SMA Negeri 1 Batu',
  period: '2026/2027',
  status: 'BUKA', // 'BUKA', 'ISTIRAHAT', 'TUTUP'
  schoolName: 'SMA Negeri 1 Batu',
  schoolAddress: 'Jl. KH. Agus Salim No. 57, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65314',
  schoolLogo: '/assets/logo.png',
  
  // Format Berita Acara Resmi
  reportTitle: 'BERITA ACARA REKAPITULASI HASIL PENGHITUNGAN SUARA',
  reportSubtitle: 'PEMILIHAN KETUA DAN WAKIL KETUA OSIS TAHUN 2026',
  reportDocNumber: '421.3 / 118 / OSIS-SMABA / IX / 2026',
  reportDay: 'Selasa',
  reportDate: '8 September 2026',
  reportCity: 'Kota Batu',

  // Pejabat & Saksi Penandatangan Berita Acara
  headmasterTitle: 'Kepala SMA Negeri 1 Batu',
  headmasterName: 'Anto Dwi Cahyono., S.Pd., M.M',
  headmasterNip: '19700415 199702 1 003',

  osisAdvisorTitle: 'Pembina OSIS SMAN 1 Batu',
  osisAdvisorName: 'Distri Adi Setiawan ., S.Pd., SS',
  osisAdvisorNip: '19740921 200212 1 005',

  committeeLeaderTitle: 'Ketua Panitia / MPK:',
  committeeLeaderName: 'Kurnia Ramadhan (Ketua MPK)',
  committeeLeaderNis: '20241098',

  witness1Title: 'Saksi Paslon 01:',
  witness1Name: 'Dimas Bagus Pratama',
  witness1Role: 'Saksi Terdaftar',

  witness2Title: 'Saksi Paslon 02 & 03:',
  witness2Name: 'Rizka Amalia Putri',
  witness2Role: 'Saksi Terdaftar',

  witness3Title: 'Saksi Tambahan:',
  witness3Name: '',
  witness3Role: '',

  startTime: '2026-09-08T07:30',
  endTime: '2026-09-08T14:30',
  allowLiveCount: true,
  tpsCode: 'TPS SMAN 1 Batu',
  requireTpsCode: true,
  tpsSecurityCode: 'SMABA-TPS-2026',
  blockMobile: true
};

export const INITIAL_USERS = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'osis2026',
    name: 'Super Admin Pilketos',
    role: 'ADMIN',
    tps: 'Pusat'
  }
];

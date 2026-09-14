/**
 * Utilitas Ekspor & Impor CSV untuk Daftar Pemilih Tetap (DPT)
 * Mendukung kategori: Siswa, Guru, dan Tenaga Kependidikan (Tendik)
 */

export function exportDptToCsv(students, filename = 'DPT_Pilketos_SMAN1Batu_2026.csv') {
  if (!students || students.length === 0) return;

  const headers = [
    'NISN / NIP / ID', 
    'Nama Lengkap', 
    'Kategori Pemilih', 
    'Kelas / Unit / Jabatan', 
    'Jenis Kelamin', 
    'Token Akses', 
    'Status Memilih', 
    'Waktu Memilih'
  ];
  
  const rows = students.map(s => [
    `"${s.nisn}"`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${s.voterType || 'SISWA'}"`,
    `"${s.class || ''}"`,
    `"${s.gender || 'L'}"`,
    `"${s.token || ''}"`,
    `"${s.hasVoted ? 'SUDAH' : 'BELUM'}"`,
    `"${s.votedAt || '-'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
    + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseDptCsv(csvText) {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  // Periksa apakah header mengandung kolom kategori/tipe
  const headerCols = lines[0].split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim().toLowerCase());
  const hasCategoryCol = headerCols.some(h => h.includes('kategori') || h.includes('tipe') || h.includes('jenis'));

  const students = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim());
    if (cols.length >= 2) {
      if (hasCategoryCol && cols.length >= 6) {
        let cat = (cols[2] || 'SISWA').toUpperCase();
        if (!['SISWA', 'GURU', 'TENDIK'].includes(cat)) {
          if (cat.includes('GURU')) cat = 'GURU';
          else if (cat.includes('TENDIK') || cat.includes('STAF') || cat.includes('TU')) cat = 'TENDIK';
          else cat = 'SISWA';
        }

        students.push({
          nisn: (cols[0] || '').replace(/\s+/g, ''),
          name: cols[1],
          voterType: cat,
          class: cols[3] || (cat === 'SISWA' ? 'X-1' : cat === 'GURU' ? 'Guru' : 'Tendik'),
          gender: cols[4] || 'L',
          token: (cols[5] || '').replace(/\s+/g, '').toUpperCase(),
          hasVoted: cols[6] === 'SUDAH' || cols[6] === 'true',
          votedAt: cols[7] || null
        });
      } else {
        // Format legacy (tanpa kolom kategori)
        students.push({
          nisn: (cols[0] || '').replace(/\s+/g, ''),
          name: cols[1],
          voterType: 'SISWA',
          class: cols[2] || 'X-1',
          gender: cols[3] || 'L',
          token: (cols[4] || '').replace(/\s+/g, '').toUpperCase(),
          hasVoted: cols[5] === 'SUDAH' || cols[5] === 'true',
          votedAt: cols[6] || null
        });
      }
    }
  }
  return students;
}

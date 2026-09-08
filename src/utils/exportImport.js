/**
 * Utilitas Ekspor & Impor CSV untuk Daftar Pemilih Tetap (DPT)
 */

export function exportDptToCsv(students, filename = 'DPT_Pilketos_SMAN1Batu_2026.csv') {
  if (!students || students.length === 0) return;

  const headers = ['NISN', 'Nama Lengkap', 'Kelas', 'Jenis Kelamin', 'Token Akses', 'Status Memilih', 'Waktu Memilih'];
  
  const rows = students.map(s => [
    `"${s.nisn}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.class}"`,
    `"${s.gender || 'L'}"`,
    `"${s.token}"`,
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

  // Baris pertama adalah header
  const students = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim());
    if (cols.length >= 2) {
      students.push({
        nisn: cols[0],
        name: cols[1],
        class: cols[2] || 'X-1',
        gender: cols[3] || 'L',
        token: cols[4] || '',
        hasVoted: cols[5] === 'SUDAH' || cols[5] === 'true',
        votedAt: cols[6] || null
      });
    }
  }
  return students;
}

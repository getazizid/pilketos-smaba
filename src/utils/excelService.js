import ExcelJS from 'exceljs';

/**
 * Download Template Excel Resmi DPT Pilketos SMAN 1 Batu 2026
 * Dilengkapi styling header berwarna, panduan kolom, dan contoh data Siswa, Guru, Tendik.
 */
export async function downloadDptTemplateExcel(filename = 'Template_DPT_Pilketos_SMABA_2026.xlsx') {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Pilketos SMAN 1 Batu';
  workbook.lastModifiedBy = 'Panitia Pemilihan OSIS';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet('DPT SMABA 2026', {
    views: [{ showGridLines: true }]
  });

  // 1. Column Definitions & Widths
  sheet.columns = [
    { key: 'no', width: 6 },
    { key: 'nisn', width: 24 },
    { key: 'name', width: 34 },
    { key: 'voterType', width: 20 },
    { key: 'class', width: 28 },
    { key: 'gender', width: 15 },
    { key: 'token', width: 18 },
    { key: 'notes', width: 24 }
  ];

  // 2. Banner Title Header (Row 1 & 2)
  sheet.mergeCells('A1:H1');
  const titleRow1 = sheet.getCell('A1');
  titleRow1.value = 'PEMILIHAN KETUA & WAKIL KETUA OSIS SMA NEGERI 1 BATU 2026';
  titleRow1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleRow1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Deep Navy
  titleRow1.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 32;

  sheet.mergeCells('A2:H2');
  const titleRow2 = sheet.getCell('A2');
  titleRow2.value = 'FORMAT RESMI DAFTAR PEMILIH TETAP (DPT) - SISWA, GURU, & TENAGA KEPENDIDIKAN';
  titleRow2.font = { name: 'Calibri', size: 10, italic: true, bold: true, color: { argb: 'FFFEF08A' } }; // Gold text
  titleRow2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  titleRow2.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(2).height = 22;

  // Row 3 Blank Spacer
  sheet.getRow(3).height = 10;

  // 3. Table Header Row (Row 4)
  const headerRow = sheet.getRow(4);
  headerRow.height = 28;
  headerRow.values = [
    'NO',
    'NISN / NIP / ID*',
    'NAMA LENGKAP*',
    'KATEGORI PEMILIH*',
    'KELAS / MAPEL / UNIT*',
    'JENIS KELAMIN (L/P)',
    'TOKEN (OPSIONAL)',
    'KETERANGAN'
  ];

  // Header Styling (Royal Blue with White Bold Text & Thin Borders)
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Royal Blue
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF1E3A8A' } },
      bottom: { style: 'medium', color: { argb: 'FF1E3A8A' } },
      left: { style: 'thin', color: { argb: 'FF93C5FD' } },
      right: { style: 'thin', color: { argb: 'FF93C5FD' } }
    };
  });

  // 4. Sample Rows
  const sampleData = [
    { no: 1, nisn: '0071234501', name: 'Achmad Fauzi Maulana', voterType: 'SISWA', class: 'XII-1', gender: 'L', token: 'SB26A1', notes: 'Contoh Siswa Kelas 12' },
    { no: 2, nisn: '0071234502', name: 'Annisa Bella Safitri', voterType: 'SISWA', class: 'XII-2', gender: 'P', token: 'SB26B2', notes: 'Contoh Siswi Kelas 12' },
    { no: 3, nisn: '0081234503', name: 'Bagas Aditya Nugraha', voterType: 'SISWA', class: 'XI-4', gender: 'L', token: '', notes: 'Token otomatis digenerate jika kosong' },
    { no: 4, nisn: '0091234504', name: 'Cantika Dewi Anggraini', voterType: 'SISWA', class: 'X-1', gender: 'P', token: '', notes: 'Contoh Siswi Kelas 10' },
    { no: 5, nisn: '198104122006041008', name: 'Drs. Hendro Wibowo, M.Pd.', voterType: 'GURU', class: 'Guru Bahasa Indonesia', gender: 'L', token: 'GR2601', notes: 'Contoh Dewan Guru' },
    { no: 6, nisn: '198602182010012015', name: 'Tri Wahyuni, S.Pd.', voterType: 'GURU', class: 'Guru Matematika', gender: 'P', token: 'GR2602', notes: 'Contoh Dewan Guru' },
    { no: 7, nisn: '199003252019031005', name: 'Bambang Eko Prasetyo, S.Kom.', voterType: 'TENDIK', class: 'Tendik / Operator IT', gender: 'L', token: 'TK2601', notes: 'Contoh Tenaga Kependidikan' },
    { no: 8, nisn: '198807152014022003', name: 'Dewi Lestari, A.Md.', voterType: 'TENDIK', class: 'Tendik / Staf Tata Usaha', gender: 'P', token: 'TK2602', notes: 'Contoh Tenaga Kependidikan' }
  ];

  sampleData.forEach((item, index) => {
    const row = sheet.addRow([
      item.no,
      item.nisn,
      item.name,
      item.voterType,
      item.class,
      item.gender,
      item.token,
      item.notes
    ]);
    row.height = 22;

    const isEven = index % 2 === 0;
    const bgColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC'; // Zebra light slate

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF0F172A' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      // Alignment per kolom
      if (colNumber === 1 || colNumber === 6) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber === 2 || colNumber === 7) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
      } else if (colNumber === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (item.voterType === 'GURU') {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF047857' } }; // Emerald
        } else if (item.voterType === 'TENDIK') {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFB45309' } }; // Amber
        } else {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF2563EB' } }; // Blue
        }
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  // 5. Petunjuk & Catatan Pengisian di Bawah Tabel
  const guideStartRow = sheet.rowCount + 2;
  sheet.mergeCells(`A${guideStartRow}:H${guideStartRow}`);
  const guideTitle = sheet.getCell(`A${guideStartRow}`);
  guideTitle.value = 'PETUNJUK PENGISIAN DATA DPT:';
  guideTitle.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1E3A8A' } };
  guideTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

  const guides = [
    '1. Kolom bertanda bintang (*) WAJIB DIISI.',
    '2. KATEGORI PEMILIH: Wajib diisi salah satu: SISWA, GURU, atau TENDIK.',
    '3. NISN / NIP / ID: Untuk Siswa isi NISN (10 digit). Untuk Guru/Tendik isi NIP, NUPTK, atau NIK.',
    '4. KELAS / MAPEL / UNIT: Siswa isi jenjang kelas (misal: X-1, XI-4). Guru isi mata pelajaran. Tendik isi unit/jabatan.',
    '5. TOKEN AKSES: Boleh diisi sendiri atau dikosongkan. Jika kosong, sistem Pilketos akan otomatis menghasilkan token acak 6 digit unik.',
    '6. Anda dapat menghapus baris contoh sebelum mengisi data sebenarnya, atau biarkan di-replace saat impor.'
  ];

  guides.forEach((text, i) => {
    const rowNum = guideStartRow + 1 + i;
    sheet.mergeCells(`A${rowNum}:H${rowNum}`);
    const cell = sheet.getCell(`A${rowNum}`);
    cell.value = text;
    cell.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF475569' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
  });

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  triggerBrowserDownload(buffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

/**
 * Ekspor Seluruh DPT Aktif ke Berkas Excel (.xlsx) dengan Desain Header Berwarna
 */
export async function exportDptToExcel(students, filename = 'DPT_Pilketos_SMAN1Batu_2026.xlsx') {
  if (!students || students.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Pilketos SMAN 1 Batu';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Daftar Pemilih Tetap', {
    views: [{ showGridLines: true }]
  });

  // Column Setup
  sheet.columns = [
    { key: 'no', width: 6 },
    { key: 'nisn', width: 24 },
    { key: 'name', width: 34 },
    { key: 'voterType', width: 18 },
    { key: 'class', width: 26 },
    { key: 'gender', width: 14 },
    { key: 'token', width: 18 },
    { key: 'status', width: 18 },
    { key: 'votedAt', width: 22 }
  ];

  // Header Title Banner
  sheet.mergeCells('A1:I1');
  const title1 = sheet.getCell('A1');
  title1.value = 'DAFTAR PEMILIH TETAP (DPT) & TOKEN SUARA - PILKETOS SMABA 2026';
  title1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  title1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  title1.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 32;

  sheet.mergeCells('A2:I2');
  const title2 = sheet.getCell('A2');
  const totalSiswa = students.filter(s => (s.voterType || 'SISWA') === 'SISWA').length;
  const totalGuru = students.filter(s => s.voterType === 'GURU').length;
  const totalTendik = students.filter(s => s.voterType === 'TENDIK').length;
  const totalSudah = students.filter(s => s.hasVoted).length;

  title2.value = `Total Pemilih: ${students.length} Orang (Siswa: ${totalSiswa} | Guru: ${totalGuru} | Tendik: ${totalTendik}) • Sudah Memilih: ${totalSudah}`;
  title2.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFEF08A' } };
  title2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  title2.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(2).height = 22;

  sheet.getRow(3).height = 10;

  // Header Row
  const headerRow = sheet.getRow(4);
  headerRow.height = 28;
  headerRow.values = [
    'NO',
    'NISN / NIP / ID',
    'NAMA LENGKAP',
    'KATEGORI',
    'KELAS / MAPEL / JABATAN',
    'L/P',
    'TOKEN AKSES',
    'STATUS SUARA',
    'WAKTU MEMILIH'
  ];

  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } }; // Cobalt Blue
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF1E3A8A' } },
      bottom: { style: 'medium', color: { argb: 'FF1E3A8A' } },
      left: { style: 'thin', color: { argb: 'FF93C5FD' } },
      right: { style: 'thin', color: { argb: 'FF93C5FD' } }
    };
  });

  // Data Rows
  students.forEach((s, idx) => {
    const isVoted = Boolean(s.hasVoted);
    const row = sheet.addRow([
      idx + 1,
      s.nisn,
      s.name,
      s.voterType || 'SISWA',
      s.class,
      s.gender || 'L',
      s.token,
      isVoted ? 'SUDAH MEMILIH' : 'BELUM MEMILIH',
      s.votedAt ? new Date(s.votedAt).toLocaleString('id-ID') : '-'
    ]);
    row.height = 21;

    const isEven = idx % 2 === 0;
    const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF0F172A' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if (colNumber === 1 || colNumber === 6) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber === 2 || colNumber === 7) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
      } else if (colNumber === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber === 8) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: isVoted ? 'FF15803D' : 'FFB45309' } };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  triggerBrowserDownload(buffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

/**
 * Parser Fleksibel untuk Mengimpor File Excel (.xlsx / .xls) maupun CSV
 */
export async function parseDptExcelFile(file) {
  const isCsv = file.name.endsWith('.csv');

  if (isCsv) {
    const text = await file.text();
    return parseCsvFallback(text);
  }

  // Parse Excel (.xlsx / .xls)
  const arrayBuffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  let headerRowIndex = -1;
  let colIndexes = {
    nisn: -1,
    name: -1,
    voterType: -1,
    class: -1,
    gender: -1,
    token: -1
  };

  // Cari baris header yang memuat "NISN" atau "NAMA" menggunakan eachCell
  sheet.eachRow((row, rowNumber) => {
    if (headerRowIndex !== -1) return;
    
    let foundHeader = false;
    row.eachCell((cell, colNumber) => {
      let val = '';
      if (cell.value !== null && cell.value !== undefined) {
        if (typeof cell.value === 'object' && cell.value.text) val = String(cell.value.text).toLowerCase();
        else val = String(cell.value).toLowerCase();
      }

      if (val.includes('nisn') || val.includes('nip') || val.includes('identitas')) {
        colIndexes.nisn = colNumber;
        foundHeader = true;
      } else if (val.includes('nama')) {
        colIndexes.name = colNumber;
        foundHeader = true;
      } else if (val.includes('kategori') || val.includes('jenis pemilih') || val.includes('tipe')) {
        colIndexes.voterType = colNumber;
      } else if (val.includes('kelas') || val.includes('mapel') || val.includes('unit') || val.includes('jabatan')) {
        colIndexes.class = colNumber;
      } else if (val.includes('kelamin') || val === 'l/p' || val === 'jk') {
        colIndexes.gender = colNumber;
      } else if (val.includes('token')) {
        colIndexes.token = colNumber;
      }
    });

    if (foundHeader) {
      headerRowIndex = rowNumber;
    }
  });

  // Jika tidak terdeteksi via pencocokan teks nama/nisn, gunakan fallback kolom standar (1: No, 2: NISN, 3: Nama, 4: Kategori, 5: Kelas, 6: L/P, 7: Token)
  if (headerRowIndex === -1) {
    headerRowIndex = 4; // Berdasarkan template resmi
  }
  if (colIndexes.nisn === -1) colIndexes.nisn = 2;
  if (colIndexes.name === -1) colIndexes.name = 3;
  if (colIndexes.voterType === -1) colIndexes.voterType = 4;
  if (colIndexes.class === -1) colIndexes.class = 5;
  if (colIndexes.gender === -1) colIndexes.gender = 6;
  if (colIndexes.token === -1) colIndexes.token = 7;

  const result = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) return;

    // Lewati baris catatan / petunjuk di bawah tabel
    const firstCellVal = String(row.getCell(1).value || '').toLowerCase();
    if (firstCellVal.includes('petunjuk') || firstCellVal.includes('catatan') || firstCellVal.includes('keterangan:') || firstCellVal.includes('1. kolom')) {
      return;
    }

    const getVal = (colNum) => {
      if (!colNum || colNum <= 0) return '';
      const cell = row.getCell(colNum);
      if (!cell || cell.value === null || cell.value === undefined) return '';
      if (typeof cell.value === 'object') {
        if (cell.value.text) return String(cell.value.text).trim();
        if (cell.value.result) return String(cell.value.result).trim();
        if (cell.value.richText) return cell.value.richText.map(t => t.text).join('').trim();
      }
      return String(cell.value).trim();
    };

    const nisn = getVal(colIndexes.nisn).replace(/\s+/g, '');
    const name = getVal(colIndexes.name);

    // Minimal harus ada NISN atau Nama
    if (!nisn && !name) return;

    let voterType = getVal(colIndexes.voterType).toUpperCase();
    if (!['SISWA', 'GURU', 'TENDIK'].includes(voterType)) {
      if (voterType.includes('GURU')) voterType = 'GURU';
      else if (voterType.includes('TENDIK') || voterType.includes('STAF') || voterType.includes('TU')) voterType = 'TENDIK';
      else voterType = 'SISWA';
    }

    const studentClass = getVal(colIndexes.class) || (voterType === 'SISWA' ? 'X-1' : voterType === 'GURU' ? 'Guru' : 'Tendik');
    const rawGender = getVal(colIndexes.gender).toUpperCase();
    const gender = (rawGender === 'P' || rawGender.startsWith('PEREMPUAN')) ? 'P' : 'L';
    const token = getVal(colIndexes.token).replace(/\s+/g, '').toUpperCase();

    result.push({
      nisn: nisn || ('00' + Math.floor(10000000 + Math.random() * 90000000)),
      name: name || 'Pemilih Tanpa Nama',
      voterType,
      class: studentClass,
      gender,
      token,
      hasVoted: false,
      votedAt: null
    });
  });

  return result;
}

// Fallback CSV Parser
function parseCsvFallback(csvText) {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headerCols = lines[0].split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim().toLowerCase());
  const hasCategory = headerCols.some(h => h.includes('kategori') || h.includes('tipe') || h.includes('jenis'));

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim());
    if (cols.length >= 2) {
      if (hasCategory && cols.length >= 6) {
        let cat = (cols[2] || 'SISWA').toUpperCase();
        if (!['SISWA', 'GURU', 'TENDIK'].includes(cat)) {
          if (cat.includes('GURU')) cat = 'GURU';
          else if (cat.includes('TENDIK') || cat.includes('STAF')) cat = 'TENDIK';
          else cat = 'SISWA';
        }
        result.push({
          nisn: (cols[0] || '').replace(/\s+/g, ''),
          name: cols[1],
          voterType: cat,
          class: cols[3] || 'X-1',
          gender: cols[4] || 'L',
          token: (cols[5] || '').replace(/\s+/g, '').toUpperCase(),
          hasVoted: cols[6] === 'SUDAH' || cols[6] === 'true',
          votedAt: cols[7] || null
        });
      } else {
        result.push({
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
  return result;
}

function triggerBrowserDownload(buffer, filename, mimeType) {
  const blob = new Blob([buffer], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

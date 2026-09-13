import React, { useState, useMemo } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Printer, 
  PlusCircle, 
  Filter, 
  CheckCircle2, 
  XCircle,
  Edit2,
  GraduationCap,
  Briefcase,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { generateVoterToken } from '../../utils/tokenGenerator';
import { downloadDptTemplateExcel, exportDptToExcel, parseDptExcelFile } from '../../utils/excelService';
import { Modal } from '../common/Modal';

export function StudentManager({ onNavigateToPrint, onAddToast }) {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    addBulkStudents, 
    deleteStudent, 
    deleteBulkStudents, 
    deleteAllStudents,
    resetStudentVote,
    dptBreakdown,
    totalSiswa,
    totalGuru,
    totalTendik
  } = useElection();
  const { userRole } = useAuth();

  const isSuperAdmin = userRole === 'ADMIN';
  const isReadOnly = userRole === 'SAKSI';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL', 'SISWA', 'GURU', 'TENDIK'
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'VOTED', 'NOT_VOTED'
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal Add / Edit Single Voter
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    voterType: 'SISWA',
    nisn: '',
    name: '',
    class: 'X-1',
    gender: 'L',
    token: ''
  });

  // Filtered list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nisn || '').includes(searchTerm) ||
        (s.class || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.token && s.token.toLowerCase().includes(searchTerm.toLowerCase()));

      const sCategory = s.voterType || 'SISWA';
      const matchCategory = filterCategory === 'ALL' || sCategory === filterCategory;

      let matchClass = true;
      if (filterClass !== 'ALL') {
        if (filterClass === 'X') matchClass = (s.class || '').startsWith('X-') || s.class === 'X';
        else if (filterClass === 'XI') matchClass = (s.class || '').startsWith('XI-') || s.class === 'XI';
        else if (filterClass === 'XII') matchClass = (s.class || '').startsWith('XII-') || s.class === 'XII';
      }

      let matchStatus = true;
      if (filterStatus === 'VOTED') matchStatus = s.hasVoted === true;
      if (filterStatus === 'NOT_VOTED') matchStatus = s.hasVoted === false;

      return matchSearch && matchCategory && matchClass && matchStatus;
    });
  }, [students, searchTerm, filterCategory, filterClass, filterStatus]);

  const openAddModal = (defaultType = 'SISWA') => {
    setEditingStudent(null);
    const isSiswa = defaultType === 'SISWA';
    setFormData({
      voterType: defaultType,
      nisn: isSiswa 
        ? '00' + Math.floor(10000000 + Math.random() * 90000000)
        : '19' + Math.floor(75000000 + Math.random() * 20000000) + '20' + Math.floor(10 + Math.random() * 89) + '01' + Math.floor(1000 + Math.random() * 8999),
      name: '',
      class: isSiswa ? 'X-1' : defaultType === 'GURU' ? 'Guru Mata Pelajaran' : 'Staf Tata Usaha',
      gender: 'L',
      token: generateVoterToken()
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      voterType: student.voterType || 'SISWA',
      nisn: student.nisn || '',
      name: student.name || '',
      class: student.class || 'X-1',
      gender: student.gender || 'L',
      token: student.token || generateVoterToken()
    });
    setIsAddModalOpen(true);
  };

  const handleSaveSingle = (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!formData.name.trim() || !formData.nisn.trim()) {
      alert('Nama dan Nomor Identitas (NISN/NIP) wajib diisi!');
      return;
    }

    const payload = {
      voterType: formData.voterType || 'SISWA',
      name: formData.name.trim(),
      nisn: formData.nisn.trim(),
      class: formData.class.trim(),
      gender: formData.gender,
      token: formData.token.trim().toUpperCase() || generateVoterToken()
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, payload);
      if (onAddToast) onAddToast(`Data pemilih ${formData.name} berhasil diperbarui di Firestore.`, 'success');
    } else {
      addStudent(payload);
      if (onAddToast) onAddToast(`Pemilih ${formData.name} (${payload.voterType}) berhasil ditambahkan ke DPT.`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingStudent(null);
  };

  // Quick Bulk Generator simulasi (10 Siswa, 3 Guru, 2 Tendik)
  const handleGenerateSampleStudents = () => {
    if (isReadOnly) return;

    const sampleStudents = [
      { name: 'Alifia Rahmadani', class: 'X-1', gender: 'P', type: 'SISWA' },
      { name: 'Bima Sakti Kusuma', class: 'X-4', gender: 'L', type: 'SISWA' },
      { name: 'Citra Kirana', class: 'X-8', gender: 'P', type: 'SISWA' },
      { name: 'Danang Wicaksono', class: 'XI-2', gender: 'L', type: 'SISWA' },
      { name: 'Elsa Novita', class: 'XI-6', gender: 'P', type: 'SISWA' },
      { name: 'Farhan Maulana', class: 'XI-9', gender: 'L', type: 'SISWA' },
      { name: 'Gita Gutawa', class: 'XII-1', gender: 'P', type: 'SISWA' },
      { name: 'Hendra Setiawan', class: 'XII-3', gender: 'L', type: 'SISWA' },
      { name: 'Intan Permatasari', class: 'XII-7', gender: 'P', type: 'SISWA' },
      { name: 'Joko Susanto', class: 'XII-12', gender: 'L', type: 'SISWA' },
      { name: 'Drs. Supriyanto, M.Pd.', class: 'Guru Sejarah', gender: 'L', type: 'GURU' },
      { name: 'Nurul Hidayati, S.Si.', class: 'Guru Biologi', gender: 'P', type: 'GURU' },
      { name: 'Ahmad Zaki, S.Pd.', class: 'Guru Olahraga (PJOK)', gender: 'L', type: 'GURU' },
      { name: 'Rudi Hartono, S.Sos.', class: 'Tendik / Tata Usaha', gender: 'L', type: 'TENDIK' },
      { name: 'Siti Rohmah, A.Md.', class: 'Tendik / Laboran IPA', gender: 'P', type: 'TENDIK' }
    ];

    const bulk = sampleStudents.map((item, idx) => ({
      voterType: item.type,
      nisn: item.type === 'SISWA' 
        ? '00' + (80000000 + Math.floor(Math.random() * 9999999))
        : '19' + (75000000 + Math.floor(Math.random() * 20000000)) + '20' + (10 + idx) + '01' + Math.floor(1000 + Math.random() * 8999),
      name: item.name,
      class: item.class,
      gender: item.gender,
      token: generateVoterToken()
    }));

    addBulkStudents(bulk);
    if (onAddToast) onAddToast(`Berhasil men-generate 15 DPT (10 Siswa, 3 Guru, 2 Tendik) dengan token acak.`, 'success');
  };

  // Excel / CSV Import handler
  const handleExcelImport = async (e) => {
    if (isReadOnly) return;
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (onAddToast) onAddToast(`Membaca berkas ${file.name}...`, 'info');
      const parsed = await parseDptExcelFile(file);
      if (parsed && parsed.length > 0) {
        const withTokens = parsed.map(s => ({
          ...s,
          voterType: s.voterType || 'SISWA',
          token: s.token || generateVoterToken()
        }));
        await addBulkStudents(withTokens);
        if (onAddToast) onAddToast(`Berhasil mengimpor ${withTokens.length} data pemilih DPT dari file Excel.`, 'success');
      } else {
        alert('Tidak ada data valid yang ditemukan di berkas Excel. Pastikan berkas memiliki kolom NISN/NIP dan Nama.');
      }
    } catch (err) {
      console.error('Gagal impor Excel:', err);
      alert('Gagal memproses berkas Excel: ' + err.message);
    } finally {
      e.target.value = '';
    }
  };

  const handleResetVote = (student) => {
    if (isReadOnly) return;
    if (window.confirm(`Reset hak pilih untuk ${student.name} (${student.nisn})? Pemilih ini akan dapat memilih kembali.`)) {
      resetStudentVote(student.id);
      if (onAddToast) onAddToast(`Hak pilih untuk ${student.name} berhasil di-reset.`, 'info');
    }
  };

  const handleDelete = (student) => {
    if (!isSuperAdmin) return;
    if (window.confirm(`Hapus ${student.name} dari DPT?`)) {
      deleteStudent(student.id);
      setSelectedIds(prev => prev.filter(id => id !== student.id));
      if (onAddToast) onAddToast(`Pemilih ${student.name} telah dihapus dari DPT.`, 'info');
    }
  };

  // Helper Seleksi & Hapus Terpilih Centang
  const isAllSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const filteredIdSet = new Set(filteredStudents.map(s => s.id));
      setSelectedIds(prev => prev.filter(id => !filteredIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedIds, ...filteredStudents.map(s => s.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!isSuperAdmin || selectedIds.length === 0) return;

    const count = selectedIds.length;
    if (window.confirm(`PERINGATAN HAPUS MASSAL:\n\nApakah Anda yakin ingin menghapus ${count} pemilih terpilih dari DPT dan database Cloud Firestore? Tindakan ini tidak dapat dibatalkan.`)) {
      await deleteBulkStudents(selectedIds);
      setSelectedIds([]);
      if (onAddToast) onAddToast(`${count} pemilih DPT terpilih berhasil dihapus dari sistem & cloud.`, 'warning');
    }
  };

  const handleDeleteAll = async () => {
    if (!isSuperAdmin || students.length === 0) return;

    if (window.confirm(`PERINGATAN KOSONGKAN DPT:\n\nApakah Anda yakin ingin MENGHAPUS SEMUA ${students.length} data pemilih DPT dari sistem dan database Cloud Firestore?\n\nTindakan ini akan mengosongkan seluruh daftar pemilih agar Anda dapat memasukkan data DPT baru.`)) {
      await deleteAllStudents();
      setSelectedIds([]);
      if (onAddToast) onAddToast('Seluruh data DPT berhasil dikosongkan dari sistem & cloud.', 'warning');
    }
  };

  // Helper badge kategori
  const renderCategoryBadge = (type) => {
    const t = type || 'SISWA';
    if (t === 'GURU') {
      return (
        <span className="badge badge-emerald" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
          Guru
        </span>
      );
    }
    if (t === 'TENDIK') {
      return (
        <span className="badge badge-gold" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
          Tendik
        </span>
      );
    }
    return (
      <span className="badge badge-purple" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
        Siswa
      </span>
    );
  };

  return (
    <div>
      {/* Header & Main Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Daftar Pemilih Tetap (DPT) &amp; Token
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Kelola data pemilih siswa, guru, dan tenaga kependidikan (Tendik), token rahasia, impor CSV, dan cetak kartu
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-gold"
            onClick={onNavigateToPrint}
            title="Cetak Kartu Pemilih Format Siap Potong"
          >
            <Printer size={17} />
            <span>Cetak Kartu Pemilih</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => downloadDptTemplateExcel()}
            title="Unduh Format Template Excel (.xlsx) Resmi & Berwarna"
            style={{ borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
          >
            <FileSpreadsheet size={17} />
            <span>Template Excel</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => exportDptToExcel(students)}
            title="Ekspor Seluruh DPT ke Berkas Excel (.xlsx)"
            disabled={students.length === 0}
          >
            <Download size={17} />
            <span>Ekspor Excel</span>
          </button>

          {!isReadOnly && (
            <>
              <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0 }} title="Impor Berkas Excel (.xlsx, .xls) atau CSV">
                <Upload size={17} />
                <span>Impor Excel</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  style={{ display: 'none' }}
                  onChange={handleExcelImport}
                />
              </label>

              {isSuperAdmin && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleGenerateSampleStudents}
                  title="Generate 15 Pemilih Otomatis (Siswa, Guru, Tendik)"
                >
                  <PlusCircle size={16} />
                  <span>+15 DPT Otomatis</span>
                </button>
              )}

              {isSuperAdmin && students.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleDeleteAll}
                  style={{ borderColor: '#fca5a5', color: '#dc2626' }}
                  title="Kosongkan seluruh data DPT dari sistem & database cloud"
                >
                  <Trash2 size={16} />
                  <span>Kosongkan DPT</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAddModal('SISWA')}
              >
                <UserPlus size={17} />
                <span>Tambah Pemilih</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ringkasan Statistik Kategori Pemilih */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #2563eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Total Seluruh DPT
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '0.2rem' }}>
            {students.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.15rem' }}>
            Hak Suara Terdaftar
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #3b82f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Pemilih Siswa
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1d4ed8', marginTop: '0.2rem' }}>
            {totalSiswa ?? students.filter(s => (s.voterType || 'SISWA') === 'SISWA').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
            Kelas X, XI, dan XII
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #059669',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Pemilih Guru
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#047857', marginTop: '0.2rem' }}>
            {totalGuru ?? students.filter(s => s.voterType === 'GURU').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
            Dewan Guru / Tenaga Pendidik
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #d97706',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Tenaga Kependidikan
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#b45309', marginTop: '0.2rem' }}>
            {totalTendik ?? students.filter(s => s.voterType === 'TENDIK').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
            Staf TU &amp; Tenaga Kependidikan
          </div>
        </div>
      </div>

      {isReadOnly && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span>Mode Pantau Saksi: Anda memiliki akses membaca data DPT untuk verifikasi transparansi. Perubahan dan penghapusan data dinonaktifkan.</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.8rem' }}
              placeholder="Cari Nama, NISN/NIP, Token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Kategori Pemilih */}
          <div>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">Semua Jenis Pemilih</option>
              <option value="SISWA">Hanya Siswa ({totalSiswa ?? students.filter(s => (s.voterType || 'SISWA') === 'SISWA').length})</option>
              <option value="GURU">Hanya Guru ({totalGuru ?? students.filter(s => s.voterType === 'GURU').length})</option>
              <option value="TENDIK">Hanya Tenaga Kependidikan ({totalTendik ?? students.filter(s => s.voterType === 'TENDIK').length})</option>
            </select>
          </div>

          {/* Filter Jenjang Kelas (Khusus Siswa / Semua) */}
          <div>
            <select
              className="form-select"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              disabled={filterCategory === 'GURU' || filterCategory === 'TENDIK'}
            >
              <option value="ALL">Semua Kelas</option>
              <option value="X">Kelas X (X-1 s/d X-12)</option>
              <option value="XI">Kelas XI (XI-1 s/d XI-12)</option>
              <option value="XII">Kelas XII (XII-1 s/d XII-12)</option>
            </select>
          </div>

          {/* Filter Status Memilih */}
          <div>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Semua Status Memilih</option>
              <option value="NOT_VOTED">Belum Memilih (Aktif)</option>
              <option value="VOTED">Sudah Memilih (Selesai)</option>
            </select>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filteredStudents.length}</strong> dari {students.length} data DPT
        </div>
      </div>

      {/* Action Bar Hapus Terpilih Centang */}
      {selectedIds.length > 0 && isSuperAdmin && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 2px 10px rgba(239, 68, 68, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: '700', color: '#b91c1c', fontSize: '0.95rem' }}>
              ✓ {selectedIds.length} Pemilih Terpilih (Centang)
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setSelectedIds([])}
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
            >
              Batalkan Centang
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={handleDeleteSelected}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}
            >
              <Trash2 size={16} />
              <span>Hapus Terpilih ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* DPT Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {isSuperAdmin && (
                <th style={{ width: '42px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    title="Pilih / Batalkan Semua di Halaman Ini"
                  />
                </th>
              )}
              <th style={{ width: '50px' }}>No</th>
              <th>NISN / NIP / ID</th>
              <th>Nama Lengkap</th>
              <th>Kategori</th>
              <th>Kelas / Jabatan</th>
              <th>Token Akses</th>
              <th>Status Memilih</th>
              <th>Waktu Pencoblosan</th>
              {!isReadOnly && <th style={{ textAlign: 'center' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 8 : 10} style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                  {students.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)'
                      }}>
                        <Trash2 size={26} />
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        Daftar Pemilih Tetap (DPT) Kosong
                      </div>
                      <div style={{ fontSize: '0.88rem', maxWidth: '480px', lineHeight: '1.5' }}>
                        Seluruh data pemilih telah dikosongkan. Silakan tambah data pemilih (Siswa, Guru, Tendik), unduh template &amp; impor berkas Excel, atau generate otomatis.
                      </div>
                      {!isReadOnly && (
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button type="button" className="btn btn-primary" onClick={() => openAddModal('SISWA')}>
                            <UserPlus size={16} />
                            <span>Tambah Siswa</span>
                          </button>
                          <button type="button" className="btn btn-emerald" onClick={() => openAddModal('GURU')}>
                            <GraduationCap size={16} />
                            <span>Tambah Guru</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => downloadDptTemplateExcel()}
                            style={{ borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
                          >
                            <FileSpreadsheet size={16} />
                            <span>Unduh Template Excel</span>
                          </button>
                          <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                            <Upload size={16} />
                            <span>Impor Berkas Excel</span>
                            <input type="file" accept=".xlsx, .xls, .csv" style={{ display: 'none' }} onChange={handleExcelImport} />
                          </label>
                        </div>
                      )}
                    </div>
                  ) : (
                    'Tidak ada data pemilih DPT yang cocok dengan pencarian / filter.'
                  )}
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => (
                <tr key={s.id} style={{ background: selectedIds.includes(s.id) ? 'rgba(59, 130, 246, 0.05)' : undefined }}>
                  {isSuperAdmin && (
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => handleToggleSelectOne(s.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                    </td>
                  )}
                  <td>{idx + 1}</td>
                  <td>
                    <code style={{ color: 'var(--primary-light)', fontWeight: '600' }}>{s.nisn}</code>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.name}</td>
                  <td>
                    {renderCategoryBadge(s.voterType)}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{s.class}</span>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '800',
                      letterSpacing: '0.1em',
                      color: 'var(--gold)',
                      background: 'var(--gold-subtle)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {s.token}
                    </span>
                  </td>
                  <td>
                    {s.hasVoted ? (
                      <span className="badge badge-green">
                        <CheckCircle2 size={13} />
                        <span>SUDAH MEMILIH</span>
                      </span>
                    ) : (
                      <span className="badge badge-gold">
                        <XCircle size={13} />
                        <span>BELUM MEMILIH</span>
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {s.votedAt ? new Date(s.votedAt).toLocaleTimeString('id-ID') + ' WIB' : '-'}
                  </td>
                  {!isReadOnly && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        {s.hasVoted && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => handleResetVote(s)}
                            title="Reset Hak Pilih (Bisa Memilih Ulang)"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <RotateCcw size={14} color="var(--gold)" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => openEditModal(s)}
                          title="Edit Data Pemilih"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(s)}
                            title="Hapus dari DPT"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit Single Voter */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? `Edit Data Pemilih: ${editingStudent.name}` : "Tambah Pemilih Baru ke DPT"}
        maxWidth="520px"
      >
        <form onSubmit={handleSaveSingle}>
          {/* Pilihan Jenis Pemilih */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700' }}>Jenis / Kategori Pemilih</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { key: 'SISWA', label: 'Siswa', icon: Users },
                { key: 'GURU', label: 'Guru', icon: GraduationCap },
                { key: 'TENDIK', label: 'Tendik', icon: Briefcase }
              ].map(cat => {
                const IconComponent = cat.icon;
                const isSelected = (formData.voterType || 'SISWA') === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        voterType: cat.key,
                        class: cat.key === 'SISWA' ? (prev.class.startsWith('X') ? prev.class : 'X-1') : cat.key === 'GURU' ? 'Guru Mapel' : 'Staf Tata Usaha'
                      }));
                    }}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.6rem', fontSize: '0.85rem', justifyContent: 'center' }}
                  >
                    <IconComponent size={15} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.voterType === 'SISWA' ? 'NISN (10 Digit)' : formData.voterType === 'GURU' ? 'NIP / NUPTK / ID Guru' : 'NIP / NIK / ID Tendik'}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={formData.voterType === 'SISWA' ? 'Misal: 0071234501' : 'Nomor Induk Pegawai / NUPTK'}
              value={formData.nisn}
              onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {formData.voterType === 'SISWA' ? 'Nama Lengkap Siswa' : formData.voterType === 'GURU' ? 'Nama Lengkap & Gelar Guru' : 'Nama Lengkap Tenaga Kependidikan'}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={formData.voterType === 'SISWA' ? 'Contoh: Muhammad Ilham' : formData.voterType === 'GURU' ? 'Contoh: Drs. Hendro Wibowo, M.Pd.' : 'Contoh: Bambang Eko, S.Kom.'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                {formData.voterType === 'SISWA' ? 'Kelas Siswa' : formData.voterType === 'GURU' ? 'Mata Pelajaran / Tugas' : 'Unit / Bagian Kerja'}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={formData.voterType === 'SISWA' ? 'Contoh: X-1 / XII-4' : formData.voterType === 'GURU' ? 'Contoh: Guru Matematika' : 'Contoh: Staf TU / Operator IT'}
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">L / P</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Token Akses Rahasia</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ letterSpacing: '0.15em', fontWeight: '700', color: 'var(--gold)' }}
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value.toUpperCase() })}
                required
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setFormData({ ...formData, token: generateVoterToken() })}
                title="Generate Token Baru"
              >
                Acak
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStudent ? 'Simpan Perubahan' : 'Simpan ke DPT'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

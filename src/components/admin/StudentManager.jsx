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
  XCircle 
} from 'lucide-react';
import { generateVoterToken } from '../../utils/tokenGenerator';
import { exportDptToCsv, parseDptCsv } from '../../utils/exportImport';
import { Modal } from '../common/Modal';

export function StudentManager({ onNavigateToPrint, onAddToast }) {
  const { students, addStudent, addBulkStudents, deleteStudent, resetStudentVote } = useElection();
  const { userRole } = useAuth();

  const isReadOnly = userRole === 'SAKSI';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'VOTED', 'NOT_VOTED'

  // Modal Add Single Student
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
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
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.includes(searchTerm) ||
        (s.token && s.token.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchClass = true;
      if (filterClass === 'X') {
        matchClass = s.class.startsWith('X-') || s.class === 'X';
      } else if (filterClass === 'XI') {
        matchClass = s.class.startsWith('XI-') || s.class === 'XI';
      } else if (filterClass === 'XII') {
        matchClass = s.class.startsWith('XII-') || s.class === 'XII';
      }

      let matchStatus = true;
      if (filterStatus === 'VOTED') matchStatus = s.hasVoted === true;
      if (filterStatus === 'NOT_VOTED') matchStatus = s.hasVoted === false;

      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchTerm, filterClass, filterStatus]);

  const openAddModal = () => {
    setFormData({
      nisn: '00' + Math.floor(10000000 + Math.random() * 90000000),
      name: '',
      class: 'X-1',
      gender: 'L',
      token: generateVoterToken()
    });
    setIsAddModalOpen(true);
  };

  const handleAddSingle = (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    if (!formData.name.trim() || !formData.nisn.trim()) {
      alert('Nama dan NISN wajib diisi!');
      return;
    }

    addStudent({
      ...formData,
      name: formData.name.trim(),
      nisn: formData.nisn.trim(),
      token: formData.token.trim().toUpperCase() || generateVoterToken()
    });

    setIsAddModalOpen(false);
    if (onAddToast) onAddToast(`Siswa ${formData.name} berhasil ditambahkan ke DPT.`, 'success');
  };

  // Quick Bulk Generator (misal generate 15 siswa otomatis untuk simulasi kelas)
  const handleGenerateSampleStudents = () => {
    if (isReadOnly) return;
    const sampleNames = [
      'Alifia Rahmadani', 'Bima Sakti Kusuma', 'Citra Kirana', 'Danang Wicaksono',
      'Elsa Novita', 'Farhan Maulana', 'Gita Gutawa', 'Hendra Setiawan',
      'Intan Permatasari', 'Joko Susanto', 'Kharisma Putri', 'Lukman Hakim',
      'Maulana Malik', 'Nadya Salsabila', 'Oki Setiana'
    ];

    const classes = ['X-1', 'X-4', 'X-8', 'X-12', 'XI-2', 'XI-6', 'XI-9', 'XI-12', 'XII-1', 'XII-3', 'XII-7', 'XII-12'];

    const bulk = sampleNames.map((name, idx) => ({
      nisn: '00' + (80000000 + Math.floor(Math.random() * 9999999)),
      name: name,
      class: classes[idx % classes.length],
      gender: idx % 2 === 0 ? 'P' : 'L',
      token: generateVoterToken()
    }));

    addBulkStudents(bulk);
    if (onAddToast) onAddToast(`Berhasil men-generate ${bulk.length} siswa DPT baru dengan token acak.`, 'success');
  };

  // CSV Import handler
  const handleCsvImport = (e) => {
    if (isReadOnly) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = parseDptCsv(text);
        if (parsed.length > 0) {
          // ensure each has token
          const withTokens = parsed.map(s => ({
            ...s,
            token: s.token || generateVoterToken()
          }));
          addBulkStudents(withTokens);
          if (onAddToast) onAddToast(`Berhasil mengimpor ${withTokens.length} data DPT dari file CSV.`, 'success');
        } else {
          alert('Format CSV tidak valid atau berkas kosong.');
        }
      } catch (err) {
        alert('Gagal memproses berkas CSV: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetVote = (student) => {
    if (isReadOnly) return;
    if (window.confirm(`Reset hak pilih untuk ${student.name} (${student.nisn})? Siswa ini akan dapat memilih kembali.`)) {
      resetStudentVote(student.id);
      if (onAddToast) onAddToast(`Hak pilih untuk ${student.name} berhasil di-reset.`, 'info');
    }
  };

  const handleDelete = (student) => {
    if (isReadOnly) return;
    if (window.confirm(`Hapus ${student.name} dari DPT?`)) {
      deleteStudent(student.id);
      if (onAddToast) onAddToast(`Siswa ${student.name} telah dihapus dari DPT.`, 'info');
    }
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
          <p style={{ fontSize: '0.9rem' }}>
            Kelola data pemilih siswa, generate token rahasia, impor CSV, dan cetak kartu pemilih
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
            onClick={() => exportDptToCsv(students)}
            title="Ekspor Seluruh DPT ke file CSV/Excel"
          >
            <Download size={17} />
            <span>Ekspor CSV</span>
          </button>

          {!isReadOnly && (
            <>
              <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                <Upload size={17} />
                <span>Impor CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={handleCsvImport}
                />
              </label>

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleGenerateSampleStudents}
                title="Generate 15 Siswa Otomatis"
              >
                <PlusCircle size={16} />
                <span>+15 Siswa Otomatis</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddModal}
              >
                <UserPlus size={17} />
                <span>Tambah Siswa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.8rem' }}
              placeholder="Cari Nama, NISN, atau Token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Kelas */}
          <div>
            <select
              className="form-select"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="ALL">Semua Jenjang Kelas</option>
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
              <option value="NOT_VOTED">Belum Memilih (Hak Suara Aktif)</option>
              <option value="VOTED">Sudah Memilih (Selesai)</option>
            </select>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filteredStudents.length}</strong> dari {students.length} DPT
          </div>
        </div>
      </div>

      {/* DPT Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>NISN</th>
              <th>Nama Lengkap Siswa</th>
              <th>Kelas</th>
              <th>Token Akses</th>
              <th>Status Memilih</th>
              <th>Waktu Pencoblosan</th>
              {!isReadOnly && <th style={{ textAlign: 'center' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Tidak ada data siswa DPT yang cocok dengan pencarian / filter.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => (
                <tr key={s.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <code style={{ color: 'var(--primary-light)', fontWeight: '600' }}>{s.nisn}</code>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.name}</td>
                  <td>
                    <span className="badge badge-purple">{s.class}</span>
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
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(s)}
                          title="Hapus dari DPT"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add Single Student */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Siswa Baru ke DPT"
        maxWidth="500px"
      >
        <form onSubmit={handleAddSingle}>
          <div className="form-group">
            <label className="form-label">NISN (10 Digit)</label>
            <input
              type="text"
              className="form-input"
              value={formData.nisn}
              onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Lengkap Siswa</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Muhammad Ilham"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kelas</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: X-1 / XI-3 / XII-7"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">L/P</label>
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
              Simpan ke DPT
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

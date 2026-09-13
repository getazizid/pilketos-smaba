import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  UserCheck, 
  Eye, 
  Trash2, 
  Key, 
  UserPlus, 
  ShieldAlert 
} from 'lucide-react';
import { Modal } from '../common/Modal';

export function RoleManager({ onAddToast }) {
  const { users, addUser, deleteUser } = useElection();
  const { userRole } = useAuth();

  const isSuperAdmin = userRole === 'ADMIN';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'OPERATOR',
    tps: 'TPS SMAN 1 Batu'
  });

  // Jika bukan Super Admin, blokir akses halaman ini
  if (!isSuperAdmin) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <ShieldAlert size={56} color="var(--crimson)" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Akses Khusus Super Admin
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.92rem' }}>
          Halaman Manajemen Hak Akses &amp; Akun Petugas hanya dapat dikelola oleh akun dengan peran <strong>Super Admin</strong> demi menjaga integritas dan kerahasiaan sistem pemilihan.
        </p>
        <div style={{ display: 'inline-block', padding: '0.5rem 1.2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
          Peran aktif Anda: <strong>{userRole || 'Tidak Terautentikasi'}</strong>
        </div>
      </div>
    );
  }

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Hanya Super Admin yang dapat menambahkan akun staf.');
      return;
    }

    if (!formData.username.trim() || !formData.name.trim()) {
      alert('Username dan Nama Lengkap wajib diisi!');
      return;
    }

    const cleanUsername = formData.username.trim().toLowerCase().replace(/\s+/g, '');

    addUser({
      username: cleanUsername,
      password: formData.password.trim() || '123456',
      name: formData.name.trim(),
      role: formData.role,
      tps: formData.tps.trim() || 'TPS SMAN 1 Batu'
    });

    setIsAddModalOpen(false);
    if (onAddToast) onAddToast(`Akun ${formData.name} (${formData.role}) berhasil ditambahkan.`, 'success');
  };

  const handleDelete = (u) => {
    if (!isSuperAdmin) return;
    if (u.username === 'admin') {
      alert('Akun Super Admin utama tidak dapat dihapus.');
      return;
    }
    if (window.confirm(`Hapus akun ${u.name} (${u.username})?`)) {
      deleteUser(u.id);
      if (onAddToast) onAddToast(`Akun ${u.name} telah dihapus.`, 'info');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} />
            <span>Super Admin</span>
          </span>
        );
      case 'OPERATOR':
        return (
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck size={12} />
            <span>Operator TPS</span>
          </span>
        );
      case 'SAKSI':
      default:
        return (
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={12} />
            <span>Saksi Paslon</span>
          </span>
        );
    }
  };

  return (
    <div>
      {/* Header */}
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
            Manajemen Hak Akses &amp; Akun Petugas
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Kelola akun panitia TPS, pengawas bilik, dan saksi pemilihan
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setFormData({
              username: '',
              password: '',
              name: '',
              role: 'OPERATOR',
              tps: 'TPS SMAN 1 Batu'
            });
            setIsAddModalOpen(true);
          }}
        >
          <UserPlus size={17} />
          <span>Tambah Akun Petugas</span>
        </button>
      </div>

      {/* Role Explanations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: '#7c3aed', marginBottom: '0.4rem' }}>
            <Shield size={18} />
            <span>SUPER ADMIN</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Akses tak terbatas: konfigurasi voting, paslon OSIS, DPT siswa, reset suara, berita acara, hak akses, dan pengaturan sistem.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: '#b45309', marginBottom: '0.4rem' }}>
            <Key size={18} />
            <span>OPERATOR TPS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Akses operasional: verifikasi pemilih DPT, cetak kartu pemilih, reset darurat status suara jika terjadi kendala bilik.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--emerald)', marginBottom: '0.4rem' }}>
            <Eye size={18} />
            <span>SAKSI PASLON</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mode pantau (Hanya Lihat): memantau live quick count, memeriksa berita acara perolehan suara sah tanpa wewenang mengubah data.
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>No</th>
              <th>Username</th>
              <th>Nama Lengkap Petugas</th>
              <th>Hak Akses (Role)</th>
              <th>Penugasan TPS</th>
              <th style={{ textAlign: 'center', width: '90px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id}>
                <td>{idx + 1}</td>
                <td>
                  <code style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{u.username}</code>
                </td>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{u.name}</td>
                <td>
                  {getRoleBadge(u.role)}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {u.tps || 'Pusat'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    {u.username !== 'admin' ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u)}
                        title="Hapus Akun"
                        style={{ padding: '0.35rem 0.6rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Akun Utama</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah User */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Akun Petugas Baru"
        maxWidth="500px"
      >
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap Petugas</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Rahmat Hidayat (Saksi Paslon 1)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username Login (Huruf kecil tanpa spasi)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: saksi_paslon1"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi / Password (Opsional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Default: 123456"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Bila dikosongkan, kata sandi bawaan adalah <code>123456</code>.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Tingkat Akses (Role)</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="OPERATOR">Operator TPS (Verifikasi DPT &amp; Cetak Kartu)</option>
              <option value="SAKSI">Saksi Paslon (Mode Pantau Suara &amp; Berita Acara)</option>
              <option value="ADMIN">Super Admin (Akses Penuh Sistem)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi TPS / Penugasan</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: TPS SMAN 1 Batu"
              value={formData.tps}
              onChange={(e) => setFormData({ ...formData, tps: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

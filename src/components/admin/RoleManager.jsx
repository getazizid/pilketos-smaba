import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, UserCheck, Eye, Plus, Trash2, Key, Info } from 'lucide-react';
import { Modal } from '../common/Modal';

export function RoleManager({ onAddToast }) {
  const { users, addUser, deleteUser } = useElection();
  const { userRole } = useAuth();

  const isSuperAdmin = userRole === 'ADMIN';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'OPERATOR',
    tps: 'TPS-01 Aula Graha SMABA'
  });

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

    addUser({
      username: formData.username.trim().toLowerCase(),
      name: formData.name.trim(),
      role: formData.role,
      tps: formData.tps
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
    if (window.confirm(`Hapus akun ${u.name}?`)) {
      deleteUser(u.id);
      if (onAddToast) onAddToast(`Akun ${u.name} telah dihapus.`, 'info');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="badge badge-gold">
            <Shield size={12} />
            <span>SUPER ADMIN</span>
          </span>
        );
      case 'OPERATOR':
        return (
          <span className="badge badge-blue">
            <UserCheck size={12} />
            <span>OPERATOR / PANITIA</span>
          </span>
        );
      case 'SAKSI':
      default:
        return (
          <span className="badge badge-purple">
            <Eye size={12} />
            <span>SAKSI PASLON</span>
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
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Pengaturan Hak Akses &amp; Akun Staf
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            Kelola hak akses Super Admin, Panitia Operator TPS, dan Saksi Pemilihan
          </p>
        </div>

        {isSuperAdmin && (
          <button type="button" className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            <span>Tambah Akun Staf Baru</span>
          </button>
        )}
      </div>

      {/* Penjelasan Peran */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ fontWeight: '700', color: 'var(--gold)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} />
            <span>Super Admin</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Akses tak terbatas: konfigurasi voting, manajemen paslon, DPT siswa, reset suara, berita acara, dan pengaturan server.
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-light)' }}>
          <div style={{ fontWeight: '700', color: 'var(--primary-light)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={18} />
            <span>Operator / Panitia TPS</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Akses operasional: verifikasi pemilih, cetak kartu pemilih, reset hak pilih darurat siswa di bilik TPS.
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--purple)' }}>
          <div style={{ fontWeight: '700', color: '#c4b5fd', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} />
            <span>Saksi Paslon</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Akses transparansi (Read-Only): memantau live quick count, melihat daftar pemilih dan mengunduh Berita Acara.
          </div>
        </div>
      </div>

      {/* Tabel Akun Pengguna */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Staf</th>
              <th>Username</th>
              <th>Hak Akses (Role)</th>
              <th>Penugasan / Lokasi</th>
              {isSuperAdmin && <th style={{ textAlign: 'center' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{u.name}</td>
                <td>
                  <code style={{ color: 'var(--primary-light)' }}>{u.username}</code>
                </td>
                <td>{getRoleBadge(u.role)}</td>
                <td style={{ fontSize: '0.85rem' }}>{u.tps || 'Pusat'}</td>
                {isSuperAdmin && (
                  <td style={{ textAlign: 'center' }}>
                    {u.username !== 'admin' ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u)}
                        title="Hapus Akun"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Akun Utama</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add User */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Akun Staf / Panitia Baru"
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
            <label className="form-label">Username</label>
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
            <label className="form-label">Hak Akses (Role)</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="OPERATOR">Operator / Panitia TPS (Verifikasi & Cetak)</option>
              <option value="SAKSI">Saksi Paslon (Hanya Melihat & Berita Acara)</option>
              <option value="ADMIN">Super Admin (Akses Penuh)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi TPS / Penugasan</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: TPS-01 Aula / TPS-02 Perpustakaan"
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

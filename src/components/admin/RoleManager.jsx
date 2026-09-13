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
    tps: 'TPS SMAN 1 Batu'
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
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Manajemen Hak Akses &amp; Akun Petugas
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            Kelola akun panitia, pengawas bilik, dan saksi pemilihan
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setFormData({
                username: '',
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
        )}
      </div>

      {/* Role Explanations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.4rem' }}>
            <Shield size={18} />
            <span>SUPER ADMIN</span>
          </div>
          <p style={{ fontSize: '0.85rem' }}>
            Akses tak terbatas: konfigurasi voting, manajemen paslon, DPT siswa, reset suara, berita acara, dan pengaturan server.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: '#b45309', marginBottom: '0.4rem' }}>
            <Key size={18} />
            <span>OPERATOR TPS</span>
          </div>
          <p style={{ fontSize: '0.85rem' }}>
            Akses operasional: verifikasi pemilih, cetak kartu pemilih, reset hak pilih darurat siswa di bilik TPS.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--emerald)', marginBottom: '0.4rem' }}>
            <Eye size={18} />
            <span>SAKSI PASLON</span>
          </div>
          <p style={{ fontSize: '0.85rem' }}>
            Mode pantau (Baca Saja): memantau live audit log dan memeriksa perolehan suara tanpa wewenang mengubah data.
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Nama Lengkap Petugas</th>
              <th>Hak Akses (Role)</th>
              <th>Penugasan TPS</th>
              {isSuperAdmin && <th style={{ textAlign: 'center' }}>Aksi</th>}
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
                  {u.role === 'ADMIN' && <span className="badge badge-purple">Super Admin</span>}
                  {u.role === 'OPERATOR' && <span className="badge badge-gold">Operator TPS</span>}
                  {u.role === 'SAKSI' && <span className="badge badge-green">Saksi Paslon</span>}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {u.tps || 'Pusat'}
                </td>
                {isSuperAdmin && (
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                      {u.username !== 'admin' ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(u.id, u.name)}
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
                )}
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
            <label className="form-label">Tingkat Akses (Role)</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="OPERATOR">Operator TPS (Verifikasi &amp; Cetak Kartu)</option>
              <option value="SAKSI">Saksi Paslon (Hanya Melihat &amp; Berita Acara)</option>
              <option value="ADMIN">Super Admin (Akses Penuh)</option>
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

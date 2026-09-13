import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  UserCheck, 
  Eye, 
  EyeOff,
  Trash2, 
  Key, 
  UserPlus, 
  ShieldAlert,
  Pencil,
  Lock,
  User,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { Modal } from '../common/Modal';

export function RoleManager({ onAddToast }) {
  const { users, addUser, updateUser, deleteUser } = useElection();
  const { userRole, adminUser, loginAdmin } = useAuth();

  const isSuperAdmin = userRole === 'ADMIN';

  // Modal Tambah User
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'OPERATOR',
    tps: 'TPS SMAN 1 Batu'
  });
  const [showAddPassword, setShowAddPassword] = useState(false);

  // Modal Ubah / Edit User
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'OPERATOR',
    tps: ''
  });
  const [showEditPassword, setShowEditPassword] = useState(false);

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

    // Cek duplikasi username
    const exists = users.some(u => u.username?.toLowerCase() === cleanUsername);
    if (exists) {
      alert(`Username "${cleanUsername}" sudah digunakan. Silakan pilih username lain.`);
      return;
    }

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

  const handleOpenEditModal = (u) => {
    const isPrimary = u.username === 'admin' || u.id === 'user-admin';
    setEditingUserId(u.id);
    setEditFormData({
      username: u.username || '',
      password: u.password || (isPrimary ? 'osis2026' : '123456'),
      name: u.name || '',
      role: u.role || 'OPERATOR',
      tps: u.tps || ''
    });
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Hanya Super Admin yang dapat mengubah akun.');
      return;
    }

    if (!editFormData.username.trim() || !editFormData.name.trim()) {
      alert('Username dan Nama Lengkap wajib diisi!');
      return;
    }

    const cleanUsername = editFormData.username.trim().toLowerCase().replace(/\s+/g, '');

    // Cek duplikasi username pada akun lain
    const isDuplicate = users.some(
      u => u.id !== editingUserId && u.username?.toLowerCase() === cleanUsername
    );
    if (isDuplicate) {
      alert(`Username "${cleanUsername}" sudah digunakan oleh akun lain. Silakan gunakan username lain.`);
      return;
    }

    const targetUser = users.find(u => u.id === editingUserId);
    const isPrimaryAdmin = targetUser?.username === 'admin' || targetUser?.id === 'user-admin';

    const updatedData = {
      name: editFormData.name.trim(),
      username: cleanUsername,
      password: editFormData.password.trim() || (isPrimaryAdmin ? 'osis2026' : '123456'),
      role: isPrimaryAdmin ? 'ADMIN' : editFormData.role,
      tps: editFormData.tps.trim() || (isPrimaryAdmin ? 'Pusat' : 'TPS SMAN 1 Batu')
    };

    updateUser(editingUserId, updatedData);

    // Sinkronkan sesi admin aktif jika akun yang diubah adalah akun yang sedang login
    if (adminUser && (adminUser.id === editingUserId || adminUser.username === targetUser?.username)) {
      loginAdmin({ ...adminUser, ...updatedData });
    }

    setIsEditModalOpen(false);
    if (onAddToast) onAddToast(`Akun ${updatedData.name} berhasil diperbarui.`, 'success');
  };

  const handleDelete = (u) => {
    if (!isSuperAdmin) return;
    if (u.username === 'admin' || u.id === 'user-admin') {
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

  const currentEditingUser = users.find(u => u.id === editingUserId);
  const isEditingPrimaryAdmin = currentEditingUser?.username === 'admin' || currentEditingUser?.id === 'user-admin';

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
            Kelola akun panitia TPS, pengawas bilik, saksi pemilihan, serta akun Super Admin
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
            setShowAddPassword(false);
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
              <th style={{ textAlign: 'center', width: '150px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => {
              const isPrimary = u.username === 'admin' || u.id === 'user-admin';
              return (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <code style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{u.username}</code>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{u.name}</span>
                      {isPrimary && (
                        <span 
                          className="badge badge-purple" 
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', fontWeight: '700' }}
                          title="Akun Super Admin Utama Sistem"
                        >
                          Akun Utama
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {getRoleBadge(u.role)}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {u.tps || 'Pusat'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenEditModal(u)}
                        title={`Ubah data akun ${u.name}`}
                        style={{ padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Pencil size={13} />
                        <span style={{ fontSize: '0.8rem' }}>Ubah</span>
                      </button>

                      {!isPrimary ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(u)}
                          title="Hapus Akun"
                          style={{ padding: '0.35rem 0.6rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : (
                        <span 
                          style={{ 
                            fontSize: '0.72rem', 
                            color: 'var(--text-muted)', 
                            padding: '0.2rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px dashed var(--border-subtle)'
                          }}
                          title="Akun Super Admin utama tidak dapat dihapus demi keamanan"
                        >
                          Terkunci
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
            <label className="form-label">Kata Sandi / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showAddPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingRight: '2.5rem' }}
                placeholder="Default: 123456"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowAddPassword(!showAddPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showAddPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
              >
                {showAddPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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

      {/* Modal Ubah / Edit User */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={currentEditingUser ? `Ubah Data Akun: ${currentEditingUser.name}` : 'Ubah Akun Petugas'}
        maxWidth="520px"
      >
        <form onSubmit={handleEditUser}>
          {isEditingPrimaryAdmin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              background: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              color: '#ddd6fe',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              <Shield size={22} color="#a78bfa" style={{ flexShrink: 0 }} />
              <div>
                <strong>Akun Super Admin Utama:</strong> Anda dapat mengubah Nama Lengkap, Username Login, Kata Sandi, dan Penugasan TPS. Peran akun ini terkunci sebagai Super Admin demi memastikan sistem selalu dapat diakses.
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nama Lengkap Petugas</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Super Admin Pilketos / Nama Staf"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username Login (Huruf kecil tanpa spasi)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: admin"
              value={editFormData.username}
              onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showEditPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingRight: '2.5rem' }}
                placeholder="Masukkan kata sandi baru"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowEditPassword(!showEditPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showEditPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
              >
                {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Klik ikon mata untuk melihat kata sandi yang sedang aktif atau ubah sesuai kebutuhan.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Tingkat Akses (Role)</label>
            {isEditingPrimaryAdmin ? (
              <div>
                <input
                  type="text"
                  className="form-input"
                  value="Super Admin (Akses Penuh Sistem - Terkunci)"
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255, 255, 255, 0.05)' }}
                />
              </div>
            ) : (
              <select
                className="form-select"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
              >
                <option value="OPERATOR">Operator TPS (Verifikasi DPT &amp; Cetak Kartu)</option>
                <option value="SAKSI">Saksi Paslon (Mode Pantau Suara &amp; Berita Acara)</option>
                <option value="ADMIN">Super Admin (Akses Penuh Sistem)</option>
              </select>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi TPS / Penugasan</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Pusat / TPS SMAN 1 Batu"
              value={editFormData.tps}
              onChange={(e) => setEditFormData({ ...editFormData, tps: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


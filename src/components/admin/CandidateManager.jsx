import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Award, Image, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

export function CandidateManager({ onAddToast }) {
  const { candidates, addCandidate, updateCandidate, deleteCandidate } = useElection();
  const { userRole } = useAuth();

  const isReadOnly = userRole === 'SAKSI';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    number: 1,
    chairmanName: '',
    viceChairmanName: '',
    chairmanClass: '',
    viceChairmanClass: '',
    photoUrl: '',
    tagline: ''
  });

  const openAddModal = () => {
    setEditingCandidate(null);
    setFormData({
      number: candidates.length + 1,
      chairmanName: '',
      viceChairmanName: '',
      chairmanClass: 'XI-1',
      viceChairmanClass: 'X-1',
      photoUrl: '/assets/paslon1.jpg',
      tagline: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCandidate(c);
    setFormData({
      number: c.number,
      chairmanName: c.chairmanName,
      viceChairmanName: c.viceChairmanName,
      chairmanClass: c.chairmanClass,
      viceChairmanClass: c.viceChairmanClass,
      photoUrl: c.photoUrl,
      tagline: c.tagline || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const payload = {
      number: Number(formData.number),
      chairmanName: formData.chairmanName.trim(),
      viceChairmanName: formData.viceChairmanName.trim(),
      chairmanClass: formData.chairmanClass.trim(),
      viceChairmanClass: formData.viceChairmanClass.trim(),
      photoUrl: formData.photoUrl || '/assets/paslon1.jpg',
      tagline: formData.tagline.trim()
    };

    if (editingCandidate) {
      updateCandidate(editingCandidate.id, payload);
      if (onAddToast) onAddToast('Data Paslon berhasil diperbarui.', 'success');
    } else {
      addCandidate(payload);
      if (onAddToast) onAddToast('Pasangan Calon baru berhasil ditambahkan.', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, num) => {
    if (isReadOnly) return;
    if (window.confirm(`Yakin ingin menghapus Paslon No. ${num}? Suara paslon ini juga akan terhapus.`)) {
      deleteCandidate(id);
      if (onAddToast) onAddToast(`Paslon No. ${num} telah dihapus.`, 'info');
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
            Manajemen Pasangan Calon (Paslon)
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            Kelola data calon Ketua OSIS dan Wakil Ketua OSIS SMAN 1 Batu Periode 2026/2027
          </p>
        </div>

        {!isReadOnly && (
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            <span>Tambah Paslon Baru</span>
          </button>
        )}
      </div>

      {isReadOnly && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={18} />
          <span>Anda masuk sebagai Saksi (Mode Baca Saja). Perubahan data kandidat dinonaktifkan.</span>
        </div>
      )}

      {/* Grid Paslon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {candidates.map((cand) => (
          <div key={cand.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Foto Paslon */}
            <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src={cand.photoUrl || '/assets/paslon1.jpg'}
                alt={`Paslon ${cand.number}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'var(--gold)',
                color: '#000',
                fontWeight: '900',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
              }}>
                #{cand.number}
              </div>

              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#eff6ff',
                color: 'var(--primary)',
                fontWeight: '700',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                border: '1px solid #bfdbfe'
              }}>
                {cand.voteCount || 0} Suara
              </div>
            </div>

            {/* Konten */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700' }}>KETUA OSIS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{cand.chairmanName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kelas: {cand.chairmanClass}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700' }}>WAKIL KETUA OSIS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{cand.viceChairmanName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kelas: {cand.viceChairmanClass}</div>
              </div>

              {cand.tagline && (
                <div style={{
                  fontSize: '0.825rem',
                  fontStyle: 'italic',
                  color: 'var(--text-secondary)',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  borderLeft: '3px solid var(--gold)'
                }}>
                  "{cand.tagline}"
                </div>
              )}

              {/* Actions */}
              {!isReadOnly && (
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    style={{ flex: 1 }}
                    onClick={() => openEditModal(cand)}
                  >
                    <Edit2 size={14} />
                    <span>Edit Data</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cand.id, cand.number)}
                    title="Hapus Paslon"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Paslon */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCandidate ? `Edit Paslon No. ${editingCandidate.number}` : 'Tambah Pasangan Calon Baru'}
        maxWidth="700px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nomor Urut</label>
              <input
                type="number"
                className="form-input"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                min={1}
                max={20}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tagline / Motto Singkat</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Bersama Menuju SMABA Juara"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Calon Ketua OSIS</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nama lengkap calon ketua"
                value={formData.chairmanName}
                onChange={(e) => setFormData({ ...formData, chairmanName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kelas Ketua</label>
              <input
                type="text"
                className="form-input"
                placeholder="XI-1"
                value={formData.chairmanClass}
                onChange={(e) => setFormData({ ...formData, chairmanClass: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nama Calon Wakil Ketua OSIS</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nama lengkap calon wakil ketua"
                value={formData.viceChairmanName}
                onChange={(e) => setFormData({ ...formData, viceChairmanName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kelas Wakil</label>
              <input
                type="text"
                className="form-input"
                placeholder="X-3"
                value={formData.viceChairmanClass}
                onChange={(e) => setFormData({ ...formData, viceChairmanClass: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL / File Foto Paslon</label>
            <input
              type="text"
              className="form-input"
              placeholder="/assets/paslon1.jpg atau URL online"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              *Foto bawaan tersedia: /assets/paslon1.jpg, /assets/paslon2.jpg, /assets/paslon3.jpg
            </div>
          </div>


          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>Simpan Data Paslon</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

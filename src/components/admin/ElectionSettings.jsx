import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured, activeConfig, saveFirebaseCustomConfig } from '../../config/firebase';
import { Settings, ShieldAlert, Check, Database, Clock, Building, AlertTriangle, Lock, KeyRound, Smartphone, ShieldCheck } from 'lucide-react';

export function ElectionSettings({ onAddToast }) {
  const { settings, updateSettings, resetAllVotes } = useElection();
  const { userRole } = useAuth();

  const isSuperAdmin = userRole === 'ADMIN';

  // General Settings Form
  const [generalForm, setGeneralForm] = useState({ ...settings });

  // Security Settings Form (TPS Authorization & Mobile Blocking)
  const [securityForm, setSecurityForm] = useState({
    requireTpsCode: settings.requireTpsCode ?? true,
    tpsSecurityCode: settings.tpsSecurityCode || 'SMABA-TPS-2026',
    blockMobile: settings.blockMobile ?? true
  });

  // Firebase Configuration Form
  const [firebaseForm, setFirebaseForm] = useState({
    apiKey: activeConfig.apiKey || '',
    authDomain: activeConfig.authDomain || '',
    projectId: activeConfig.projectId || '',
    storageBucket: activeConfig.storageBucket || '',
    messagingSenderId: activeConfig.messagingSenderId || '',
    appId: activeConfig.appId || ''
  });

  const [resetConfirmText, setResetConfirmText] = useState('');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateSettings(generalForm);
    if (onAddToast) onAddToast('Pengaturan pemilihan berhasil diperbarui.', 'success');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateSettings({
      requireTpsCode: securityForm.requireTpsCode,
      tpsSecurityCode: securityForm.tpsSecurityCode.trim().toUpperCase(),
      blockMobile: securityForm.blockMobile
    });
    if (onAddToast) onAddToast('Pengaturan keamanan TPS & pembatasan perangkat berhasil disimpan.', 'success');
  };

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    saveFirebaseCustomConfig(firebaseForm);
    if (onAddToast) onAddToast('Konfigurasi Firebase diperbarui. Memuat ulang aplikasi...', 'info');
  };

  const handleResetToDemo = () => {
    if (window.confirm('Lepaskan konfigurasi kustom dan kembali ke Mode Demo Lokal?')) {
      saveFirebaseCustomConfig(null);
    }
  };

  const handleResetVotes = () => {
    if (!isSuperAdmin) return;
    if (resetConfirmText !== 'RESET-SMABA-2026') {
      alert('Ketik "RESET-SMABA-2026" untuk mengonfirmasi penghapusan seluruh data suara.');
      return;
    }
    resetAllVotes();
    setResetConfirmText('');
    if (onAddToast) onAddToast('Seluruh suara dan status memilih telah di-reset ke 0.', 'error');
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          Pengaturan Pemilihan &amp; Server
        </h2>
        <p style={{ fontSize: '0.9rem' }}>
          Kelola status TPS, jadwal pemungutan suara, data sekolah, dan integrasi Firebase Cloud
        </p>
      </div>

      {/* Status Bilik Suara Cepat */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="var(--gold)" />
          <span>Status Operasional Bilik Suara TPS</span>
        </h3>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Mengontrol apakah siswa diizinkan login dan mencoblos di bilik suara:
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { key: 'BUKA', label: 'Buka TPS (Voting Aktif)', color: 'btn-emerald', desc: 'Siswa dapat login & memilih' },
            { key: 'ISTIRAHAT', label: 'Istirahat / Jeda TPS', color: 'btn-gold', desc: 'Bilik suara ditangguhkan sementara' },
            { key: 'TUTUP', label: 'Tutup TPS (Pemilu Selesai)', color: 'btn-danger', desc: 'Tidak dapat menambah suara' }
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              className={`btn ${generalForm.status === st.key ? st.color : 'btn-outline'}`}
              style={{ flex: 1, minWidth: '180px', flexDirection: 'column', padding: '1rem' }}
              disabled={!isSuperAdmin}
              onClick={() => {
                setGeneralForm(prev => ({ ...prev, status: st.key }));
                updateSettings({ status: st.key });
                if (onAddToast) onAddToast(`Status TPS diubah menjadi ${st.key}.`, 'info');
              }}
            >
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{st.label}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.2rem' }}>{st.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pengaturan Keamanan Bilik Suara & Pembatasan Akses TPS */}
      <form onSubmit={handleSaveSecurity} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1.5px solid #fed7aa' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Lock size={22} color="#ea580c" />
            <span>Keamanan Bilik Suara &amp; Pembatasan Akses TPS</span>
          </h3>
          <span className="badge badge-gold" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5' }}>
            ANTI-KECURANGAN &amp; RESTRIKSI MOBILE
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Fitur ini mencegah siswa mencoblos mandiri menggunakan smartphone pribadi dari luar TPS. Hanya komputer workstation resmi TPS yang telah diotorisasi dengan <strong>Kode Keamanan TPS</strong> yang dapat membuka bilik pencoblosan siswa.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Toggle 1: Blokir Mobile */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              flexShrink: 0
            }}>
              <Smartphone size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: isSuperAdmin ? 'pointer' : 'default', fontWeight: '700', color: '#0f172a', fontSize: '0.98rem' }}>
                <input
                  type="checkbox"
                  checked={securityForm.blockMobile}
                  onChange={(e) => setSecurityForm({ ...securityForm, blockMobile: e.target.checked })}
                  disabled={!isSuperAdmin}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span>Blokir Akses Smartphone / Layar Sentuh Mobile</span>
              </label>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Jika diaktifkan, siswa yang mengakses sistem via smartphone atau browser mobile akan dicegah mencoblos dan ditampilkan instruksi resmi untuk hadir langsung ke Bilik Suara TPS.
              </p>
            </div>
          </div>

          {/* Toggle 2: Wajibkan Kode TPS */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              flexShrink: 0
            }}>
              <KeyRound size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: isSuperAdmin ? 'pointer' : 'default', fontWeight: '700', color: '#0f172a', fontSize: '0.98rem' }}>
                <input
                  type="checkbox"
                  checked={securityForm.requireTpsCode}
                  onChange={(e) => setSecurityForm({ ...securityForm, requireTpsCode: e.target.checked })}
                  disabled={!isSuperAdmin}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span>Wajibkan Otorisasi Bilik Suara TPS (Kiosk Mode)</span>
              </label>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Setiap workstation bilik suara di ruang TPS wajib diaktifkan oleh operator/panitia menggunakan <strong>Kode Keamanan TPS</strong> di pagi hari. Setelah aktif, siswa hanya perlu login menggunakan NISN &amp; Token fisik.
              </p>
            </div>
          </div>

          {/* Input: Kode Keamanan TPS */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem'
          }}>
            <label className="form-label" style={{ color: '#92400e', fontWeight: '700' }}>
              Kode Keamanan TPS Resmi (Kiosk PIN Rahasia)
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{
                  maxWidth: '300px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#0f172a',
                  background: '#ffffff'
                }}
                value={securityForm.tpsSecurityCode}
                onChange={(e) => setSecurityForm({ ...securityForm, tpsSecurityCode: e.target.value })}
                disabled={!isSuperAdmin}
                placeholder="Misal: SMABA-TPS-2026"
                required
              />
              <span style={{ fontSize: '0.82rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertTriangle size={14} color="#b45309" />
                <span>Simpan dan bagikan kode ini <strong>hanya kepada Petugas / Operator TPS</strong> saat membuka bilik suara.</span>
              </span>
            </div>
          </div>
        </div>

        {isSuperAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <ShieldCheck size={18} />
              <span>Simpan Pengaturan Keamanan TPS</span>
            </button>
          </div>
        )}
      </form>

      {/* Pengaturan Informasi Sekolah & Pemilu */}
      <form onSubmit={handleSaveGeneral} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={20} color="var(--primary-light)" />
          <span>Informasi Sekolah &amp; Pejabat Berita Acara</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nama Kegiatan Pemilihan</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.eventName}
              onChange={(e) => setGeneralForm({ ...generalForm, eventName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Periode Masa Bakti</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.period}
              onChange={(e) => setGeneralForm({ ...generalForm, period: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.schoolName}
              onChange={(e) => setGeneralForm({ ...generalForm, schoolName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kode &amp; Lokasi TPS</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.tpsCode}
              onChange={(e) => setGeneralForm({ ...generalForm, tpsCode: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Kepala Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.headmasterName}
              onChange={(e) => setGeneralForm({ ...generalForm, headmasterName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nama Pembina OSIS</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.osisAdvisorName}
              onChange={(e) => setGeneralForm({ ...generalForm, osisAdvisorName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ketua Panitia / MPK</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.committeeLeaderName}
              onChange={(e) => setGeneralForm({ ...generalForm, committeeLeaderName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Logo Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.schoolLogo}
              onChange={(e) => setGeneralForm({ ...generalForm, schoolLogo: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Alamat Lengkap Sekolah</label>
          <input
            type="text"
            className="form-input"
            value={generalForm.schoolAddress}
            onChange={(e) => setGeneralForm({ ...generalForm, schoolAddress: e.target.value })}
          />
        </div>

        {isSuperAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>Simpan Informasi Pemilihan</span>
            </button>
          </div>
        )}
      </form>

      {/* Konfigurasi Firebase Cloud (Spark Free Plan) */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="var(--primary)" />
            <span>Koneksi Firebase Cloud Firestore (Paket Spark Gratis)</span>
          </h3>

          {isFirebaseConfigured ? (
            <span className="badge badge-green">
              <span className="status-dot"></span> TERHUBUNG KE FIREBASE
            </span>
          ) : (
            <span className="badge badge-gold">
              MODE DEMO / OFFLINE READY
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Aplikasi ini dirancang untuk bekerja dengan <strong>Firebase Spark Plan (100% Gratis Tanpa Kartu Kredit)</strong>. Kuota harian gratis Firebase adalah 50.000 read &amp; 20.000 write, sangat melimpah untuk seluruh siswa SMAN 1 Batu.
        </p>

        <form onSubmit={handleSaveFirebase}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input
                type="text"
                className="form-input"
                placeholder="AIzaSy..."
                value={firebaseForm.apiKey}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, apiKey: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="pilketos-sman1batu"
                value={firebaseForm.projectId}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, projectId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Auth Domain</label>
              <input
                type="text"
                className="form-input"
                placeholder="pilketos-sman1batu.firebaseapp.com"
                value={firebaseForm.authDomain}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, authDomain: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Storage Bucket</label>
              <input
                type="text"
                className="form-input"
                placeholder="pilketos-sman1batu.appspot.com"
                value={firebaseForm.storageBucket}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, storageBucket: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Messaging Sender ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="104928374..."
                value={firebaseForm.messagingSenderId}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, messagingSenderId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">App ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="1:104928374:web:..."
                value={firebaseForm.appId}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, appId: e.target.value })}
              />
            </div>
          </div>

          {isSuperAdmin && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              {isFirebaseConfigured && (
                <button type="button" className="btn btn-outline" onClick={handleResetToDemo}>
                  Gunakan Mode Demo Offline
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                Simpan Konfigurasi Firebase
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone: Reset Perolehan Suara */}
      {isSuperAdmin && (
        <div className="glass-panel" style={{
          padding: '2rem',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          background: 'rgba(239, 68, 68, 0.05)'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fca5a5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={22} color="var(--crimson)" />
            <span>Zona Bahaya: Reset Seluruh Suara Masuk</span>
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Tindakan ini akan mengembalikan seluruh perolehan suara paslon menjadi 0 dan menghapus status "Sudah Memilih" dari seluruh DPT siswa. Gunakan hanya sebelum pemilihan resmi dimulai atau setelah gladi bersih.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '300px' }}
              placeholder="Ketik: RESET-SMABA-2026"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-danger"
              disabled={resetConfirmText !== 'RESET-SMABA-2026'}
              onClick={handleResetVotes}
            >
              Reset Semua Suara ke 0
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

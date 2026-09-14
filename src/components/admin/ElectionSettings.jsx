import React, { useState, useEffect } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  Check, 
  Clock, 
  Building, 
  AlertTriangle, 
  Lock, 
  KeyRound, 
  Smartphone, 
  ShieldCheck,
  Tv
} from 'lucide-react';

export function ElectionSettings({ onAddToast }) {
  const { settings, updateSettings, lockAllMonitoringScreens, resetAllVotes } = useElection();
  const { userRole } = useAuth();

  const isSuperAdmin = userRole === 'ADMIN';

  // General Settings Form
  const [generalForm, setGeneralForm] = useState({ ...settings });

  // Security Settings Form (TPS Authorization, Mobile Blocking & Monitoring Gate)
  const [securityForm, setSecurityForm] = useState({
    requireTpsCode: settings.requireTpsCode ?? true,
    tpsSecurityCode: settings.tpsSecurityCode || 'SMABA-TPS-2026',
    blockMobile: settings.blockMobile ?? true,
    requireMonitoringCode: settings.requireMonitoringCode ?? true,
    monitoringSecurityCode: settings.monitoringSecurityCode || 'SMABA-MONITOR-2026'
  });

  const [resetConfirmText, setResetConfirmText] = useState('');

  // Sinkronkan form jika settings di context diperbarui (misal dari Firestore / modal)
  useEffect(() => {
    setGeneralForm({ ...settings });
    setSecurityForm({
      requireTpsCode: settings.requireTpsCode ?? true,
      tpsSecurityCode: settings.tpsSecurityCode || 'SMABA-TPS-2026',
      blockMobile: settings.blockMobile ?? true,
      requireMonitoringCode: settings.requireMonitoringCode ?? true,
      monitoringSecurityCode: settings.monitoringSecurityCode || 'SMABA-MONITOR-2026'
    });
  }, [settings]);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateSettings(generalForm);
    if (onAddToast) onAddToast('Informasi pemilihan & sekolah berhasil diperbarui.', 'success');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateSettings({
      requireTpsCode: securityForm.requireTpsCode,
      tpsSecurityCode: securityForm.tpsSecurityCode.trim().toUpperCase(),
      blockMobile: securityForm.blockMobile,
      requireMonitoringCode: securityForm.requireMonitoringCode,
      monitoringSecurityCode: securityForm.monitoringSecurityCode.trim().toUpperCase()
    });
    if (onAddToast) onAddToast('Pengaturan keamanan TPS & Layar Monitoring berhasil disimpan.', 'success');
  };

  const handleRemoteLockMonitoring = async () => {
    if (!isSuperAdmin) return;
    if (window.confirm('Kunci seluruh Layar Monitoring sekarang? Seluruh perangkat proyektor dan layar pemantau yang sedang terbuka akan langsung terkunci secara serentak demi menjaga kerahasiaan suara.')) {
      await lockAllMonitoringScreens();
      if (onAddToast) onAddToast('Seluruh Layar Monitoring berhasil dikunci paksa secara real-time!', 'warning');
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

  if (!isSuperAdmin) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <ShieldAlert size={56} color="var(--crimson)" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Akses Khusus Super Admin
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.92rem' }}>
          Halaman Pengaturan Pemilihan, Berita Acara, dan Reset Perolehan Suara hanya dapat diakses oleh <strong>Super Admin</strong> demi menjaga keamanan sistem pemilihan.
        </p>
        <div style={{ display: 'inline-block', padding: '0.5rem 1.2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
          Peran aktif Anda: <strong>{userRole || 'Tidak Terautentikasi'}</strong>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          Pengaturan Pemilihan
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Kelola status operasional TPS, data sekolah, keamanan bilik, dan reset suara
        </p>
      </div>

      {/* 1. Status Bilik Suara Cepat */}
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

      {/* 2. Pengaturan Keamanan Bilik Suara & Pembatasan Akses TPS */}
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

          {/* Bagian Keamanan Khusus Layar Monitoring Quick Count */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px dashed #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Tv size={20} color="#b45309" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Proteksi Akses Layar Monitoring (Quick Count)
              </h4>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>Penting untuk Integritas</span>
            </div>

            {/* Checkbox: Wajibkan Kode Akses Layar Monitoring */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              marginBottom: '1rem'
            }}>
              <input
                type="checkbox"
                id="require-monitoring-code"
                checked={securityForm.requireMonitoringCode}
                onChange={(e) => setSecurityForm({ ...securityForm, requireMonitoringCode: e.target.checked })}
                disabled={!isSuperAdmin}
                style={{ width: '20px', height: '20px', marginTop: '3px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="require-monitoring-code" style={{ cursor: 'pointer', flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
                  Wajibkan Kode Akses untuk Membuka Layar Monitoring (Rekomendasi Aktif)
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                  Mencegah pemilih atau publik melihat perolehan suara sementara di HP/komputer pribadi, 
                  sehingga tidak terjadi penggiringan opini atau mempengaruhi pilihan siswa sebelum pemungutan suara selesai.
                </div>
              </label>
            </div>

            {/* Input: Kode Akses Monitoring */}
            <div style={{
              background: '#fefce8',
              border: '1px solid #fde047',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              marginBottom: '1rem'
            }}>
              <label className="form-label" style={{ color: '#854d0e', fontWeight: '700' }}>
                Kode Akses Layar Monitoring Resmi (PIN Rahasia)
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
                  value={securityForm.monitoringSecurityCode}
                  onChange={(e) => setSecurityForm({ ...securityForm, monitoringSecurityCode: e.target.value })}
                  disabled={!isSuperAdmin || !securityForm.requireMonitoringCode}
                  placeholder="Misal: SMABA-MONITOR-2026"
                  required={securityForm.requireMonitoringCode}
                />
                <span style={{ fontSize: '0.82rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <KeyRound size={14} color="#854d0e" />
                  <span>Berikan kode ini <strong>khusus kepada Petugas Operator Proyektor atau Saksi Resmi</strong>.</span>
                </span>
              </div>
            </div>

            {/* Tombol Kunci Darurat Layar Monitoring (Remote Lock Real-Time) */}
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: '700', color: '#9f1239', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={15} />
                  <span>Penguncian Paksa Seluruh Layar Monitoring (Remote Lock)</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#be123c', marginTop: '0.2rem' }}>
                  Kunci seketika seluruh layar proyektor &amp; perangkat yang saat ini sedang membuka monitoring suara secara serentak.
                </div>
              </div>

              {isSuperAdmin && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={handleRemoteLockMonitoring}
                  title="Kunci paksa seluruh layar monitoring yang terbuka"
                >
                  <Lock size={14} />
                  <span>Kunci Semua Layar Monitoring Sekarang</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {isSuperAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="submit" className="btn btn-primary">
              <ShieldCheck size={18} />
              <span>Simpan Pengaturan Keamanan &amp; Akses</span>
            </button>
          </div>
        )}
      </form>

      {/* 3. Pengaturan Informasi Umum Sekolah & TPS */}
      <form onSubmit={handleSaveGeneral} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building size={20} color="var(--primary-light)" />
          <span>Informasi Umum Sekolah &amp; TPS</span>
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
            <label className="form-label">Pemerintah Provinsi</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.reportProvince || ''}
              onChange={(e) => setGeneralForm({ ...generalForm, reportProvince: e.target.value })}
              placeholder="PEMERINTAH PROVINSI JAWA TIMUR"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dinas Pendidikan / Cabang Dinas</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.reportAgency || ''}
              onChange={(e) => setGeneralForm({ ...generalForm, reportAgency: e.target.value })}
              placeholder="DINAS PENDIDIKAN • CABANG DINAS WILAYAH MALANG"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website Resmi Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.reportWebsite || ''}
              onChange={(e) => setGeneralForm({ ...generalForm, reportWebsite: e.target.value })}
              placeholder="www.sman1batu.sch.id"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pos-el (Email) Resmi Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.reportEmail || ''}
              onChange={(e) => setGeneralForm({ ...generalForm, reportEmail: e.target.value })}
              placeholder="info@sman1batu.sch.id"
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Alamat Lengkap Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.schoolAddress}
              onChange={(e) => setGeneralForm({ ...generalForm, schoolAddress: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">URL Logo Sekolah</label>
            <input
              type="text"
              className="form-input"
              value={generalForm.schoolLogo}
              onChange={(e) => setGeneralForm({ ...generalForm, schoolLogo: e.target.value })}
            />
          </div>
        </div>

        {isSuperAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>Simpan Informasi Sekolah &amp; TPS</span>
            </button>
          </div>
        )}
      </form>

      {/* 4. Danger Zone: Reset Perolehan Suara */}
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
            Tindakan ini akan mengembalikan seluruh perolehan suara paslon menjadi 0 dan menghapus status "Sudah Memilih" dari seluruh DPT (Siswa, Guru, Tendik). Gunakan hanya sebelum pemilihan resmi dimulai atau setelah gladi bersih.
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

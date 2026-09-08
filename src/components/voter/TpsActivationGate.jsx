import React, { useState, useEffect } from 'react';
import { useElection } from '../../context/ElectionContext';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  Building, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function TpsActivationGate({ children }) {
  const { settings } = useElection();

  // 1. Cek apakah perangkat terdeteksi sebagai Smartphone / Mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    if (mobileRegex.test(userAgent) || (hasTouchScreen && isSmallScreen)) {
      setIsMobile(true);
    }
  }, []);

  // 2. Cek status otorisasi bilik TPS pada workstation saat ini
  const [isTpsAuthorized, setIsTpsAuthorized] = useState(() => {
    try {
      return sessionStorage.getItem('pilketos_tps_authorized') === 'true';
    } catch {
      return false;
    }
  });

  const [inputCode, setInputCode] = useState('');
  const [errorCode, setErrorCode] = useState('');

  // Handle verifikasi kode keamanan TPS oleh petugas
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setErrorCode('');

    const cleanInput = inputCode.trim().toUpperCase();
    const expectedCode = (settings.tpsSecurityCode || 'SMABA-TPS-2026').trim().toUpperCase();

    if (cleanInput === expectedCode) {
      setIsTpsAuthorized(true);
      try {
        sessionStorage.setItem('pilketos_tps_authorized', 'true');
      } catch (err) {
        console.warn('SessionStorage warning:', err);
      }
    } else {
      setErrorCode('Kode Keamanan TPS salah! Silakan periksa kembali kode resmi dari Koordinator TPS.');
    }
  };

  // Petugas dapat mengunci kembali bilik ini jika diperlukan (misal saat istirahat)
  const handleLockStation = () => {
    if (window.confirm('Kunci kembali bilik suara ini? Siswa tidak akan dapat memilih sampai panitia memasukkan kode TPS lagi.')) {
      setIsTpsAuthorized(false);
      try {
        sessionStorage.removeItem('pilketos_tps_authorized');
      } catch (err) {
        console.warn('SessionStorage warning:', err);
      }
    }
  };

  // KONDISI 1: Blokir akses smartphone/mobile jika fitur aktif
  if (settings.blockMobile && isMobile) {
    return (
      <div className="container-narrow" style={{ marginTop: '2.5rem' }}>
        <div className="glass-panel" style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          background: '#ffffff',
          border: '1.5px solid #fecaca',
          boxShadow: '0 10px 30px rgba(220, 38, 38, 0.08)'
        }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: '#fef2f2',
            border: '2px solid #ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: '#dc2626'
          }}>
            <Smartphone size={38} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            background: '#fef2f2',
            color: '#b91c1c',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            border: '1px solid #fecaca'
          }}>
            <ShieldAlert size={15} />
            <span>AKSES PERANGKAT SELULER DIBATASI</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.75rem', lineHeight: '1.3' }}>
            Pemilihan Hanya Dapat Dilakukan di Bilik Suara TPS Resmi
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
            Sesuai Tata Tertib Pemilihan Ketua &amp; Wakil Ketua OSIS SMA Negeri 1 Batu Periode 2026/2027, 
            <strong> siswa tidak diizinkan mencoblos secara mandiri melalui smartphone atau dari luar TPS</strong>.
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem' }}>
              📍 Petunjuk Pelaksanaan Hak Suara:
            </div>
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Silakan datang langsung ke <strong>{settings.tpsCode || 'TPS-01 Aula Graha SMABA'}</strong>.</li>
              <li>Tunjukkan Kartu Pelajar di meja registrasi untuk mendapatkan <strong>Kartu Pemilih Fisik</strong>.</li>
              <li>Masuki bilik suara dan gunakan perangkat komputer resmi yang telah diverifikasi Panitia TPS.</li>
            </ol>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Sistem Keamanan Pilketos SMABA 2026 &bull; Asas LUBER JURDIL
          </div>
        </div>
      </div>
    );
  }

  // KONDISI 2: Bilik suara belum diaktivasi dengan Kode Keamanan TPS
  if (settings.requireTpsCode && !isTpsAuthorized) {
    return (
      <div className="container-narrow" style={{ marginTop: '2.5rem' }}>
        <div className="glass-panel" style={{
          padding: '3rem 2.5rem',
          textAlign: 'center',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fffbeb',
            border: '2px solid #f59e0b',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            color: '#d97706'
          }}>
            <Lock size={34} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.9rem',
            borderRadius: 'var(--radius-pill)',
            background: '#fffbeb',
            color: '#b45309',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            border: '1px solid #fde68a'
          }}>
            <KeyRound size={14} />
            <span>BILIK SUARA PERLU DIAKTIVASI PANITIA</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Otorisasi Perangkat Bilik TPS
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Perangkat ini belum diverifikasi sebagai bilik suara sah. 
            Petugas/Panitia TPS silakan masukkan <strong>Kode Keamanan TPS</strong> untuk membuka bilik bagi siswa.
          </p>

          {errorCode && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1.25rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.88rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{errorCode}</span>
            </div>
          )}

          <form onSubmit={handleVerifyCode} style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label" htmlFor="tps-security-code">
                Kode Keamanan TPS (Kiosk PIN)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#b45309' }}>
                  <KeyRound size={18} />
                </span>
                <input
                  id="tps-security-code"
                  type="password"
                  className="form-input"
                  style={{
                    paddingLeft: '2.8rem',
                    letterSpacing: '0.15em',
                    fontWeight: '700',
                    color: '#0f172a'
                  }}
                  placeholder="Ketik Kode Keamanan TPS"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <ShieldCheck size={20} />
              <span>Aktivasi Bilik Suara Sekarang</span>
            </button>
          </form>

          {/* Bantuan Petugas TPS */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px dashed #cbd5e1',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              💡 <em>Petunjuk Panitia: Kode Keamanan default sistem adalah: </em>
              <strong 
                style={{ color: '#b45309', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setInputCode(settings.tpsSecurityCode || 'SMABA-TPS-2026')}
                title="Klik untuk mengisi otomatis"
              >
                {settings.tpsSecurityCode || 'SMABA-TPS-2026'}
              </strong>
            </div>
            <div style={{ marginTop: '0.3rem' }}>
              (Dapat diubah kapan saja oleh Super Admin di Panel Pengaturan &amp; Server)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KONDISI 3: Perangkat telah terotorisasi sebagai bilik resmi TPS!
  return (
    <div>
      {/* Banner status bilik terverifikasi untuk pengawas TPS */}
      {settings.requireTpsCode && isTpsAuthorized && (
        <div className="no-print" style={{
          background: '#ecfdf5',
          borderBottom: '1px solid #a7f3d0',
          padding: '0.45rem 1.5rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#065f46'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>
              <strong>Perangkat Bilik TPS Terverifikasi Resmi</strong> &bull; {settings.tpsCode}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ 
              fontSize: '0.72rem', 
              padding: '0.2rem 0.6rem',
              borderColor: '#6ee7b7',
              color: '#065f46'
            }}
            onClick={handleLockStation}
            title="Kunci kembali bilik suara ini saat istirahat/jeda"
          >
            <Lock size={12} />
            <span>Kunci Bilik Ini</span>
          </button>
        </div>
      )}

      {/* Konten bilik suara normal */}
      {children}
    </div>
  );
}

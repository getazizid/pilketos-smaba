import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, User, AlertCircle, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { formatIndonesianDate } from '../../utils/helpers';

export function VoterLogin({ onLoginSuccess }) {
  const { students, settings } = useElection();
  const { loginVoter } = useAuth();

  const [nisn, setNisn] = useState('');
  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [votedInfo, setVotedInfo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setVotedInfo(null);

    const cleanNisn = nisn.trim();
    const cleanToken = token.trim().toUpperCase();

    if (!cleanNisn || !cleanToken) {
      setErrorMsg('Mohon masukkan NISN dan Token Akses Anda.');
      return;
    }

    // Cek status TPS
    if (settings.status === 'TUTUP') {
      setErrorMsg('Pemungutan suara saat ini DITUTUP oleh Panitia.');
      return;
    }

    if (settings.status === 'ISTIRAHAT') {
      setErrorMsg('Bilik suara sedang masa jeda/istirahat. Silakan tunggu pembukaan kembali oleh Panitia TPS.');
      return;
    }

    // Cari siswa berdasarkan NISN dan Token
    const student = students.find(
      (s) => s.nisn === cleanNisn && s.token?.toUpperCase() === cleanToken
    );

    if (!student) {
      setErrorMsg('NISN atau Token Akses tidak cocok / tidak terdaftar di DPT SMAN 1 Batu. Hubungi Panitia TPS jika ada kendala.');
      return;
    }

    if (student.hasVoted) {
      setVotedInfo({
        name: student.name,
        class: student.class,
        votedAt: student.votedAt
      });
      setErrorMsg(`Hak pilih atas nama ${student.name} telah digunakan.`);
      return;
    }

    // Login Sukses
    loginVoter(student);
    if (onLoginSuccess) onLoginSuccess(student);
  };

  // Demo helper: Isi otomatis salah satu siswa yang belum memilih
  const fillSampleStudent = (sample) => {
    setNisn(sample.nisn);
    setToken(sample.token);
    setErrorMsg('');
    setVotedInfo(null);
  };

  const sampleAvailable = students.filter(s => !s.hasVoted).slice(0, 3);

  return (
    <div className="container-narrow" style={{ marginTop: '1.5rem' }}>
      <div className="glass-panel glass-panel-elevated" style={{ padding: '2.5rem 2rem' }}>
        {/* Header Login */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
            border: '2px solid var(--border-gold)',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={32} color="var(--gold)" />
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Bilik Suara Digital
          </h2>
          <p style={{ fontSize: '0.95rem' }}>
            Masukkan <strong>NISN</strong> dan <strong>Token Akses</strong> yang tertera pada Kartu Pemilih Anda
          </p>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            color: '#fca5a5',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>Perhatian:</div>
              <div>{errorMsg}</div>
              {votedInfo && votedInfo.votedAt && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#f87171' }}>
                  Waktu Memilih: {formatIndonesianDate(votedInfo.votedAt)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="voter-nisn">
              Nomor Induk Siswa Nasional (NISN)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <User size={18} />
              </span>
              <input
                id="voter-nisn"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.8rem', letterSpacing: '0.05em' }}
                placeholder="Contoh: 0071234501"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                maxLength={12}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="voter-token">
              Token Akses Rahasia (6 Karakter)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }}>
                <KeyRound size={18} />
              </span>
              <input
                id="voter-token"
                type="text"
                className="form-input"
                style={{ 
                  paddingLeft: '2.8rem', 
                  letterSpacing: '0.2em', 
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  color: 'var(--gold)'
                }}
                placeholder="Contoh: SB26A1"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                maxLength={8}
                autoComplete="off"
                required
              />
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              *Token tertera pada kartu fisik pemilih yang dibagikan panitia TPS.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Sparkles size={20} />
            <span>Masuk ke Bilik Suara</span>
          </button>
        </form>

        {/* Demo Helper: Quick Filler */}
        {sampleAvailable.length > 0 && (
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px dashed var(--border-glass)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              ⚡ Cepat Uji Coba (Akun Siswa Demo Belum Memilih):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {sampleAvailable.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => fillSampleStudent(s)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {s.name.split(' ')[0]} ({s.class}) &bull; {s.token}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keamanan & Asas */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span>🛡️ Enkripsi Token Aman</span>
          <span>&bull;</span>
          <span>🗳️ 1 Siswa 1 Suara</span>
          <span>&bull;</span>
          <span>🔒 Asas Rahasia Terjamin</span>
        </div>
      </div>
    </div>
  );
}

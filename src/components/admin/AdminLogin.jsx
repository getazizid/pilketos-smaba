import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export function AdminLogin({ onLoginSuccess }) {
  const { loginAdmin } = useAuth();
  const { users } = useElection();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Default credential checks
    let matchedUser = users.find(u => u.username?.toLowerCase() === cleanUser);

    if (!matchedUser) {
      if (cleanUser === 'admin') {
        matchedUser = { id: 'user-admin', username: 'admin', name: 'Super Admin', role: 'ADMIN', password: 'osis2026' };
      }
    }

    // Password validation
    const validPasswords = {
      admin: 'osis2026'
    };

    const expectedPass = matchedUser?.password || validPasswords[cleanUser] || '123456';

    if (!matchedUser || cleanPass !== expectedPass) {
      setErrorMsg('Username atau Password staf salah. Silakan coba kembali.');
      return;
    }

    loginAdmin(matchedUser);
    if (onLoginSuccess) onLoginSuccess(matchedUser);
  };

  return (
    <div className="container-narrow" style={{ marginTop: '2rem' }}>
      <div className="glass-panel glass-panel-elevated" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '2px solid var(--primary-light)',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={32} color="var(--primary-light)" />
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Portal Staf &amp; Panitia TPS
          </h2>
          <p style={{ fontSize: '0.92rem' }}>
            Masuk untuk mengelola DPT Siswa, Paslon OSIS, Hak Akses, dan Rekapitulasi Suara
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#fca5a5',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">
              Username Staf
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <User size={18} />
              </span>
              <input
                id="admin-username"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
                placeholder="Contoh: admin / operator1 / saksi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </span>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <span>Masuk Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { Vote, Shield, LogOut, Tv, UserCheck, HelpCircle } from 'lucide-react';

export function Navbar({ currentView, setCurrentView, onOpenHelp }) {
  const { settings, totalVotes, totalDpt } = useElection();
  const { currentVoter, logoutVoter, adminUser, logoutAdmin } = useAuth();

  const getStatusBadge = () => {
    switch (settings.status) {
      case 'BUKA':
        return (
          <span className="badge badge-green">
            <span className="status-dot"></span> TPS DIBUKA
          </span>
        );
      case 'ISTIRAHAT':
        return (
          <span className="badge badge-gold">
            <span className="status-dot"></span> ISTIRAHAT
          </span>
        );
      case 'TUTUP':
      default:
        return (
          <span className="badge badge-red">
            <span className="status-dot"></span> TPS DITUTUP
          </span>
        );
    }
  };

  return (
    <header className="navbar no-print">
      <div className="container navbar-inner">
        {/* Brand */}
        <div
          className="brand-badge"
          onClick={() => setCurrentView('ballot')}
          title="Kembali ke Beranda"
        >
          <img
            src={settings.schoolLogo || '/assets/logo.png'}
            alt="Logo SMAN 1 Batu"
            className="brand-logo"
            onError={(e) => { e.target.src = '/assets/logo.png'; }}
          />
          <div className="brand-info">
            <div className="brand-title">PILKETOS SMABA 2026</div>
            <div className="brand-sub">SMA NEGERI 1 BATU</div>
          </div>
        </div>

        {/* Center / Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {getStatusBadge()}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="hide-mobile">
            Suara Masuk: <strong style={{ color: 'var(--text-primary)' }}>{totalVotes}</strong> / {totalDpt}
          </span>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Layar Proyektor */}
          <button
            type="button"
            className={`btn btn-sm ${currentView === 'projector' ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setCurrentView('projector')}
            title="Tampilkan Layar Proyektor Aula TPS"
          >
            <Tv size={15} />
            <span className="hide-mobile">Layar Aula</span>
          </button>

          {/* Bantuan / Tata Cara */}
          {onOpenHelp && (
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onOpenHelp}
              title="Panduan Pemilihan"
            >
              <HelpCircle size={15} />
              <span className="hide-mobile">Tata Cara</span>
            </button>
          )}

          {/* Status Login Pemilih */}
          {currentVoter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="badge badge-blue">
                <UserCheck size={13} />
                <span>{currentVoter.name?.split(' ')[0]} ({currentVoter.class})</span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={logoutVoter}
                title="Keluar dari Bilik Suara"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Status Login Admin */}
          {adminUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${currentView === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentView('admin')}
              >
                <Shield size={14} />
                <span>Panel {adminUser.role}</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={logoutAdmin}
                title="Logout Admin"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`btn btn-sm ${currentView === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setCurrentView('admin')}
              title="Login Admin & Panitia"
            >
              <Shield size={14} />
              <span>Admin / Panitia</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

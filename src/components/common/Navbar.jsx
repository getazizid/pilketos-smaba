import React, { useState, useEffect } from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Vote, 
  Shield, 
  LogOut, 
  Tv, 
  UserCheck, 
  HelpCircle, 
  Menu, 
  X, 
  CheckCircle2, 
  User,
  ArrowRight,
  ChevronRight,
  Lock
} from 'lucide-react';

export function Navbar({ currentView, setCurrentView, onOpenHelp }) {
  const { settings, totalVotes, totalDpt, participationPercentage } = useElection();
  const { currentVoter, logoutVoter, adminUser, logoutAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const getStatusBadge = () => {
    switch (settings.status) {
      case 'BUKA':
        return (
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot"></span> TPS DIBUKA
          </span>
        );
      case 'ISTIRAHAT':
        return (
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot"></span> ISTIRAHAT
          </span>
        );
      case 'TUTUP':
      default:
        return (
          <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="status-dot"></span> TPS DITUTUP
          </span>
        );
    }
  };

  return (
    <>
      <header className="navbar no-print">
        <div className="container navbar-inner">
          {/* Brand Logo & Title */}
          <div
            className="brand-badge"
            onClick={() => handleNavigate('ballot')}
            title="Kembali ke Beranda Bilik Suara"
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

          {/* Center Status (Desktop & Tablet) */}
          <div className="nav-center-status hide-mobile">
            {getStatusBadge()}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Suara Masuk: <strong style={{ color: 'var(--text-primary)' }}>{totalVotes}</strong> / {totalDpt}
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions nav-actions-desktop">
            {/* Layar Monitoring Quick Count */}
            <button
              type="button"
              className={`btn btn-sm ${currentView === 'projector' ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => handleNavigate('projector')}
              title="Layar Monitoring Terproteksi PIN (Khusus Panitia / Saksi)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Tv size={15} />
              <span>Layar Monitoring</span>
              {settings.requireMonitoringCode !== false && (
                <Lock size={12} style={{ opacity: 0.65, marginLeft: '2px' }} />
              )}
            </button>

            {/* Bantuan / Tata Cara */}
            {onOpenHelp && (
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={onOpenHelp}
                title="Panduan Tata Cara Pemilihan"
              >
                <HelpCircle size={15} />
                <span>Tata Cara</span>
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
                  onClick={() => handleNavigate('admin')}
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
                onClick={() => handleNavigate('admin')}
                title="Login Admin & Panitia"
              >
                <Shield size={14} />
                <span>Admin / Panitia</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls: Compact Status Dot + Hamburger Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="show-mobile" style={{ alignItems: 'center', marginRight: '0.25rem' }}>
              {getStatusBadge()}
            </div>
            <button
              type="button"
              className="nav-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Buka Menu Navigasi"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Off-Canvas Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-drawer-overlay no-print" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="mobile-drawer" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="brand-badge" onClick={() => handleNavigate('ballot')}>
                <img
                  src={settings.schoolLogo || '/assets/logo.png'}
                  alt="Logo SMAN 1 Batu"
                  className="brand-logo"
                  style={{ width: '38px', height: '38px' }}
                  onError={(e) => { e.target.src = '/assets/logo.png'; }}
                />
                <div className="brand-info">
                  <div className="brand-title" style={{ fontSize: '0.95rem' }}>PILKETOS 2026</div>
                  <div className="brand-sub" style={{ fontSize: '0.65rem' }}>SMAN 1 BATU</div>
                </div>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ position: 'static' }}
                aria-label="Tutup Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="mobile-drawer-body">
              {/* Quick Status Pill in Drawer */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Status Pemilihan
                  </span>
                  {getStatusBadge()}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Suara Masuk:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                    {totalVotes} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {totalDpt} ({participationPercentage}%)</span>
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div
                  className={`mobile-nav-link ${currentView === 'ballot' ? 'active' : ''}`}
                  onClick={() => handleNavigate('ballot')}
                >
                  <Vote size={18} color="var(--primary)" />
                  <span style={{ flex: 1 }}>Bilik Suara (E-Voting)</span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>

                <div
                  className={`mobile-nav-link ${currentView === 'projector' ? 'active' : ''}`}
                  onClick={() => handleNavigate('projector')}
                >
                  <Tv size={18} color="var(--gold)" />
                  <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Layar Monitoring</span>
                    {settings.requireMonitoringCode !== false && (
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <Lock size={9} /> Terkunci
                      </span>
                    )}
                  </span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>

                {onOpenHelp && (
                  <div
                    className="mobile-nav-link"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenHelp();
                    }}
                  >
                    <HelpCircle size={18} color="#059669" />
                    <span style={{ flex: 1 }}>Panduan &amp; Tata Cara</span>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                )}

                <div
                  className={`mobile-nav-link ${currentView === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavigate('admin')}
                >
                  <Shield size={18} color="var(--purple)" />
                  <span style={{ flex: 1 }}>
                    {adminUser ? `Panel ${adminUser.role}` : 'Portal Admin & Panitia'}
                  </span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>

              {/* User Session Info (If logged in) */}
              {currentVoter && (
                <div style={{
                  marginTop: 'auto',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
                        {currentVoter.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        NISN: {currentVoter.nisn} &bull; {currentVoter.class}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      logoutVoter();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ width: '100%' }}
                  >
                    <LogOut size={14} />
                    <span>Keluar dari Bilik Suara</span>
                  </button>
                </div>
              )}

              {adminUser && (
                <div style={{
                  marginTop: 'auto',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--purple)'
                    }}>
                      <Shield size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a' }}>
                        {adminUser.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Peran: <strong style={{ color: 'var(--purple)' }}>{adminUser.role}</strong>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      logoutAdmin();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ width: '100%' }}
                  >
                    <LogOut size={14} />
                    <span>Logout Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="mobile-drawer-footer">
              PILKETOS SMABA 2026 &bull; SMAN 1 BATU
            </div>
          </div>
        </div>
      )}
    </>
  );
}


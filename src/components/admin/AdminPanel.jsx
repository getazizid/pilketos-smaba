import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { CandidateManager } from './CandidateManager';
import { StudentManager } from './StudentManager';
import { VoterCardsPrint } from './VoterCardsPrint';
import { RoleManager } from './RoleManager';
import { OfficialReport } from './OfficialReport';
import { ElectionSettings } from './ElectionSettings';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Settings, 
  Tv, 
  LogOut, 
  ArrowLeft,
  ShieldAlert,
  Shield,
  UserCheck,
  Eye,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-react';

const isTabAllowedForRole = (tab, role) => {
  if (role === 'ADMIN') return true;
  if (role === 'OPERATOR') {
    return ['dashboard', 'students', 'voter-cards', 'report'].includes(tab);
  }
  if (role === 'SAKSI') {
    return ['dashboard', 'candidates', 'report'].includes(tab);
  }
  return false;
};

const TAB_METADATA = {
  'dashboard': { title: 'Dashboard & Suara', category: 'Utama', icon: LayoutDashboard },
  'candidates': { title: 'Paslon OSIS', category: 'Data Pemilihan', icon: UserSquare2 },
  'students': { title: 'DPT & Token Siswa', category: 'Data Pemilihan', icon: Users },
  'voter-cards': { title: 'Cetak Kartu Pemilih', category: 'Data Pemilihan', icon: Printer },
  'report': { title: 'Berita Acara Resmi', category: 'Laporan & Rekap', icon: FileText },
  'roles': { title: 'Hak Akses & Staf', category: 'Sistem', icon: ShieldCheck },
  'settings': { title: 'Pengaturan Pemilihan', category: 'Sistem', icon: Settings }
};

export function AdminPanel({ onNavigateToProjector, onNavigateToBallot, onAddToast }) {
  const { adminUser, logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  const role = adminUser.role || 'OPERATOR';
  const isSuperAdmin = role === 'ADMIN';
  const isOperator = role === 'OPERATOR';
  const isSaksi = role === 'SAKSI';

  const isTabAllowed = (tab) => isTabAllowedForRole(tab, role);
  const currentTab = isTabAllowed(activeTab) ? activeTab : 'dashboard';
  const currentMeta = TAB_METADATA[currentTab] || TAB_METADATA['dashboard'];
  const CurrentIcon = currentMeta.icon;

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const getRoleHeaderBadge = () => {
    if (isSuperAdmin) {
      return (
        <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
          <Shield size={12} />
          <span>SUPER ADMIN</span>
        </span>
      );
    }
    if (isOperator) {
      return (
        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
          <UserCheck size={12} />
          <span>OPERATOR TPS</span>
        </span>
      );
    }
    return (
      <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
        <Eye size={12} />
        <span>SAKSI PASLON</span>
      </span>
    );
  };

  const getRoleDescription = () => {
    if (isSuperAdmin) return 'Akses Penuh Sistem & Konfigurasi';
    if (isOperator) return 'Operasional TPS & Verifikasi DPT';
    return 'Mode Pantau (Hanya Lihat)';
  };

  return (
    <div className="admin-layout">
      {/* Mobile Overlay for Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div 
          className="admin-sidebar-overlay no-print" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      {/* Sidebar (Off-Canvas on Mobile, Collapsible on Desktop) */}
      <aside className={`admin-sidebar no-print ${isMobileSidebarOpen ? 'open-mobile' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Mobile Close Button */}
        <div className="show-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            MENU OPERATOR
          </span>
          <button 
            type="button" 
            className="modal-close-btn" 
            style={{ position: 'static' }} 
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card Profile in Sidebar */}
        <div style={{ padding: isSidebarCollapsed ? '0 0 0.75rem' : '0 0.5rem 1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span className="sidebar-text" style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Portal Pengawas
            </span>
            <div className="sidebar-text">
              {getRoleHeaderBadge()}
            </div>
          </div>
          <div className="sidebar-text" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3' }}>
            {adminUser.name}
          </div>
          <div className="sidebar-user-details" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            {getRoleDescription()}
          </div>
        </div>

        {/* Navigation Section: UTAMA */}
        <div className="admin-nav-section-title">Utama</div>
        <div
          className={`admin-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleSelectTab('dashboard')}
          title="Dashboard & Suara Masuk"
        >
          <LayoutDashboard size={18} style={{ flexShrink: 0 }} />
          <span className="sidebar-text">Dashboard &amp; Suara</span>
        </div>

        {/* Navigation Section: DATA PEMILIHAN */}
        <div className="admin-nav-section-title">Data Pemilihan</div>
        
        {/* Paslon OSIS */}
        {(isSuperAdmin || isSaksi) && (
          <div
            className={`admin-nav-item ${currentTab === 'candidates' ? 'active' : ''}`}
            onClick={() => handleSelectTab('candidates')}
            title={isSaksi ? 'Profil Paslon OSIS' : 'Kelola Paslon OSIS'}
          >
            <UserSquare2 size={18} style={{ flexShrink: 0 }} />
            <span className="sidebar-text">{isSaksi ? 'Profil Paslon OSIS' : 'Paslon OSIS'}</span>
          </div>
        )}

        {/* DPT & Token Siswa */}
        {(isSuperAdmin || isOperator) && (
          <div
            className={`admin-nav-item ${currentTab === 'students' ? 'active' : ''}`}
            onClick={() => handleSelectTab('students')}
            title="Daftar Pemilih Tetap & Token"
          >
            <Users size={18} style={{ flexShrink: 0 }} />
            <span className="sidebar-text">DPT &amp; Token Siswa</span>
          </div>
        )}

        {/* Cetak Kartu Pemilih */}
        {(isSuperAdmin || isOperator) && (
          <div
            className={`admin-nav-item ${currentTab === 'voter-cards' ? 'active' : ''}`}
            onClick={() => handleSelectTab('voter-cards')}
            title="Cetak Kartu Pemilih"
          >
            <Printer size={18} style={{ flexShrink: 0 }} />
            <span className="sidebar-text">Cetak Kartu Pemilih</span>
          </div>
        )}

        {/* Navigation Section: LAPORAN */}
        <div className="admin-nav-section-title">Laporan</div>
        <div
          className={`admin-nav-item ${currentTab === 'report' ? 'active' : ''}`}
          onClick={() => handleSelectTab('report')}
          title="Berita Acara Rekapitulasi Suara Resmi"
        >
          <FileText size={18} style={{ flexShrink: 0 }} />
          <span className="sidebar-text">Berita Acara Resmi</span>
        </div>

        {/* Navigation Section: SISTEM */}
        {isSuperAdmin && (
          <>
            <div className="admin-nav-section-title">Sistem</div>
            <div
              className={`admin-nav-item ${currentTab === 'roles' ? 'active' : ''}`}
              onClick={() => handleSelectTab('roles')}
              title="Manajemen Hak Akses & Akun Staf"
            >
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <span className="sidebar-text">Hak Akses &amp; Staf</span>
            </div>

            <div
              className={`admin-nav-item ${currentTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleSelectTab('settings')}
              title="Pengaturan Pemilihan & Jam Operasional"
            >
              <Settings size={18} style={{ flexShrink: 0 }} />
              <span className="sidebar-text">Pengaturan</span>
            </div>
          </>
        )}

        {/* Sidebar Footer Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <button
            type="button"
            className="btn btn-sm btn-gold"
            onClick={onNavigateToProjector}
            style={{ width: '100%', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            title="Tampilkan Layar Monitoring Quick Count"
          >
            <Tv size={15} style={{ flexShrink: 0 }} />
            <span className="sidebar-text">Layar Monitoring</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onNavigateToBallot}
            style={{ width: '100%', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            title="Kembali ke Bilik Suara"
          >
            <ArrowLeft size={15} style={{ flexShrink: 0 }} />
            <span className="sidebar-text">Ke Bilik Suara</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={logoutAdmin}
            style={{ width: '100%', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
            title="Keluar dari Akun Admin"
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            <span className="sidebar-text">Keluar Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View with Sub-Header Topbar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin Top Bar (Sub-Header) */}
        <header className="admin-topbar no-print">
          <div className="admin-topbar-left">
            {/* Mobile Menu Button to trigger sidebar drawer */}
            <button
              type="button"
              className="btn btn-sm btn-outline show-mobile"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Buka Menu Panel Admin"
              style={{ padding: '0.45rem 0.65rem' }}
            >
              <Menu size={18} />
              <span>Menu</span>
            </button>

            {/* Desktop Collapse Sidebar Toggle */}
            <button
              type="button"
              className="btn btn-sm btn-outline hide-mobile"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
              style={{ padding: '0.45rem 0.6rem' }}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>

            <div>
              <div className="admin-topbar-breadcrumb">
                <span>Admin</span>
                <ChevronRight size={12} />
                <span>{currentMeta.category}</span>
              </div>
              <h1 className="admin-topbar-title">
                <CurrentIcon size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{currentMeta.title}</span>
              </h1>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <div className="hide-mobile">
              {getRoleHeaderBadge()}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline hide-mobile"
              onClick={onNavigateToBallot}
              title="Buka Bilik Suara"
            >
              <ArrowLeft size={14} />
              <span>Bilik Suara</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-gold hide-mobile"
              onClick={onNavigateToProjector}
              title="Layar Monitoring Real-Time"
            >
              <Tv size={14} />
              <span>Monitoring</span>
            </button>
          </div>
        </header>

        {/* Content Area with Guard */}
        <main className="admin-main">
          {!isTabAllowed(activeTab) ? (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '540px', margin: '2rem auto' }}>
              <ShieldAlert size={48} color="var(--crimson)" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Akses Menu Dibatasi
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Peran Anda saat ini ({adminUser.role}) tidak memiliki izin untuk membuka menu ini.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveTab('dashboard')}
              >
                Kembali ke Dashboard
              </button>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <AdminDashboard
                  onNavigate={(dest) => {
                    if (dest === 'projector') onNavigateToProjector();
                    else if (isTabAllowed(dest)) setActiveTab(dest);
                  }}
                  onAddToast={onAddToast}
                />
              )}

              {currentTab === 'candidates' && (
                <CandidateManager onAddToast={onAddToast} />
              )}

              {currentTab === 'students' && (
                <StudentManager
                  onNavigateToPrint={() => setActiveTab('voter-cards')}
                  onAddToast={onAddToast}
                />
              )}

              {currentTab === 'voter-cards' && (
                <VoterCardsPrint onBack={() => setActiveTab('students')} />
              )}

              {currentTab === 'report' && (
                <OfficialReport onBack={() => setActiveTab('dashboard')} onAddToast={onAddToast} />
              )}

              {currentTab === 'roles' && (
                <RoleManager onAddToast={onAddToast} />
              )}

              {currentTab === 'settings' && (
                <ElectionSettings onAddToast={onAddToast} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}


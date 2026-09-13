import React, { useState } from 'react';
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
  Eye
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

export function AdminPanel({ onNavigateToProjector, onNavigateToBallot, onAddToast }) {
  const { adminUser, logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  const role = adminUser.role || 'OPERATOR';
  const isSuperAdmin = role === 'ADMIN';
  const isOperator = role === 'OPERATOR';
  const isSaksi = role === 'SAKSI';

  const isTabAllowed = (tab) => isTabAllowedForRole(tab, role);
  const currentTab = isTabAllowed(activeTab) ? activeTab : 'dashboard';

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
      {/* Sidebar */}
      <aside className="admin-sidebar no-print">
        <div style={{ padding: '0 0.5rem 1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Portal Pengawas
            </span>
            {getRoleHeaderBadge()}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3' }}>
            {adminUser.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            {getRoleDescription()}
          </div>
        </div>

        {/* Navigation Items (Disesuaikan berdasarkan Hak Akses) */}
        <div
          className={`admin-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard &amp; Suara</span>
        </div>

        {/* Paslon OSIS: Hanya Super Admin & Saksi (Saksi Read-Only) */}
        {(isSuperAdmin || isSaksi) && (
          <div
            className={`admin-nav-item ${currentTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            <UserSquare2 size={18} />
            <span>{isSaksi ? 'Profil Paslon OSIS' : 'Paslon OSIS'}</span>
          </div>
        )}

        {/* DPT & Token Siswa: Super Admin & Operator */}
        {(isSuperAdmin || isOperator) && (
          <div
            className={`admin-nav-item ${currentTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={18} />
            <span>DPT &amp; Token Siswa</span>
          </div>
        )}

        {/* Cetak Kartu Pemilih: Super Admin & Operator */}
        {(isSuperAdmin || isOperator) && (
          <div
            className={`admin-nav-item ${currentTab === 'voter-cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('voter-cards')}
          >
            <Printer size={18} />
            <span>Cetak Kartu Pemilih</span>
          </div>
        )}

        {/* Berita Acara Resmi: Semua Role */}
        <div
          className={`admin-nav-item ${currentTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <FileText size={18} />
          <span>Berita Acara Resmi</span>
        </div>

        {/* Hak Akses & Staf: Khusus Super Admin */}
        {isSuperAdmin && (
          <div
            className={`admin-nav-item ${currentTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <ShieldCheck size={18} />
            <span>Hak Akses &amp; Staf</span>
          </div>
        )}

        {/* Pengaturan: Khusus Super Admin */}
        {isSuperAdmin && (
          <div
            className={`admin-nav-item ${currentTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Pengaturan</span>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-sm btn-gold"
            onClick={onNavigateToProjector}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Tv size={15} />
            <span>Layar Monitoring</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={onNavigateToBallot}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <ArrowLeft size={15} />
            <span>Ke Bilik Suara</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={logoutAdmin}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogOut size={15} />
            <span>Keluar Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View Content with Guard */}
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
  );
}

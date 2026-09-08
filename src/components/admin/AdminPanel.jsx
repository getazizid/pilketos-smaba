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
  ArrowLeft 
} from 'lucide-react';

export function AdminPanel({ onNavigateToProjector, onNavigateToBallot, onAddToast }) {
  const { adminUser, logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  const isSuperAdmin = adminUser.role === 'ADMIN';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar no-print">
        <div style={{ padding: '0 0.5rem 1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase' }}>
            Panel Pengawas
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
            {adminUser.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Peran: <strong style={{ color: 'var(--primary-light)' }}>{adminUser.role}</strong>
          </div>
        </div>

        {/* Navigation Items */}
        <div
          className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard &amp; Suara</span>
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <UserSquare2 size={18} />
          <span>Paslon OSIS</span>
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={18} />
          <span>DPT &amp; Token Siswa</span>
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'voter-cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('voter-cards')}
        >
          <Printer size={18} />
          <span>Cetak Kartu Pemilih</span>
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <FileText size={18} />
          <span>Berita Acara Resmi</span>
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <ShieldCheck size={18} />
          <span>Hak Akses &amp; Staf</span>
        </div>

        <div
          className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          <span>Pengaturan &amp; Server</span>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-sm btn-gold"
            onClick={onNavigateToProjector}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Tv size={15} />
            <span>Layar Aula TPS</span>
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

      {/* Main Admin View Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigate={(dest) => {
              if (dest === 'projector') onNavigateToProjector();
              else setActiveTab(dest);
            }}
          />
        )}

        {activeTab === 'candidates' && (
          <CandidateManager onAddToast={onAddToast} />
        )}

        {activeTab === 'students' && (
          <StudentManager
            onNavigateToPrint={() => setActiveTab('voter-cards')}
            onAddToast={onAddToast}
          />
        )}

        {activeTab === 'voter-cards' && (
          <VoterCardsPrint onBack={() => setActiveTab('students')} />
        )}

        {activeTab === 'report' && (
          <OfficialReport onBack={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'roles' && (
          <RoleManager onAddToast={onAddToast} />
        )}

        {activeTab === 'settings' && (
          <ElectionSettings onAddToast={onAddToast} />
        )}
      </main>
    </div>
  );
}

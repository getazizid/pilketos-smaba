import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="no-print" style={{
      borderTop: '1px solid var(--border-subtle)',
      background: '#ffffff',
      padding: '1.75rem 0',
      marginTop: 'auto',
      fontSize: '0.85rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={18} color="var(--emerald)" />
          <span>
            Sistem E-Voting Pilketos SMAN 1 Batu 2026 &bull; Asas <strong>LUBER JURDIL</strong>
          </span>
        </div>

        <div>
          <span>
            Organisasi Siswa Intra Sekolah (OSIS) &amp; MPK SMA Negeri 1 Batu &copy; 2026
          </span>
        </div>
      </div>
    </footer>
  );
}

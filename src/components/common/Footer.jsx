import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="no-print" style={{
      borderTop: '1px solid var(--border-subtle)',
      background: '#ffffff',
      padding: '1.5rem 0',
      marginTop: 'auto',
      fontSize: '0.825rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flex: '1 1 280px' }}>
          <ShieldCheck size={18} color="var(--emerald)" style={{ flexShrink: 0 }} />
          <span>
            E-Voting Pilketos SMAN 1 Batu 2026 &bull; Asas <strong>LUBER JURDIL</strong>
          </span>
        </div>

        <div style={{ flex: '1 1 280px' }}>
          <span>
            OSIS &amp; MPK SMA Negeri 1 Batu &copy; 2026 &bull; Suara Generasi Juara
          </span>
        </div>
      </div>
    </footer>
  );
}


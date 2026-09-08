import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { CheckCircle, Printer, LogOut, ShieldCheck, QrCode } from 'lucide-react';
import { formatIndonesianDate } from '../../utils/helpers';

export function VoteReceipt({ voter, votedTimestamp, onFinish }) {
  const { logoutVoter } = useAuth();
  const { settings } = useElection();

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    logoutVoter();
    if (onFinish) onFinish();
  };

  return (
    <div className="container-narrow" style={{ marginTop: '2rem' }}>
      <div className="glass-panel glass-panel-elevated print-page" style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--emerald-subtle)',
          border: '2px solid var(--emerald)',
          boxShadow: '0 0 30px var(--emerald-glow)',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle size={42} color="var(--emerald)" />
        </div>

        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Suara Anda Berhasil Dicoblos!
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Terima kasih telah berpartisipasi aktif dalam Pemilihan Ketua &amp; Wakil Ketua OSIS SMAN 1 Batu Periode 2026/2027.
        </p>

        {/* Official Digital Certificate Card */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          textAlign: 'left',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)'
        }}>
          {/* Watermark / Digital Stamp */}
          <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem' }}>
            <div className="vote-stamp">
              <ShieldCheck size={28} />
              <span>SUDAH MEMILIH</span>
              <span style={{ fontSize: '0.65rem' }}>SAH &bull; SMABA 2026</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img
              src={settings.schoolLogo || '/assets/logo.png'}
              alt="Logo SMAN 1 Batu"
              style={{ width: '54px', height: '54px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: '700', letterSpacing: '0.05em' }}>
                BUKTI PARTISIPASI DIGITAL RESMI
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                SMA NEGERI 1 BATU
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nama Pemilih</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{voter.name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>NISN / Kelas</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)' }}>
                {voter.nisn} &bull; {voter.class}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Waktu Pencoblosan</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a' }}>
                {formatIndonesianDate(votedTimestamp || voter.votedAt || new Date())}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lokasi TPS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a' }}>
                {settings.tpsCode || 'TPS-01 Aula Graha SMABA'}
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px dashed var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              Token Hash: <code>SMABA-{voter.token}-{Date.now().toString().slice(-6)}</code>
            </div>
            <div>
              Sistem Terverifikasi LUBER JURDIL
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handlePrint}
          >
            <Printer size={18} />
            <span>Cetak / Simpan Bukti PDF</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleFinish}
          >
            <LogOut size={18} />
            <span>Selesai &amp; Keluar Bilik Suara</span>
          </button>
        </div>
      </div>
    </div>
  );
}

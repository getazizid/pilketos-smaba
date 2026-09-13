import React, { useState, useEffect } from 'react';
import { useElection } from '../../context/ElectionContext';
import { Maximize, Minimize, ArrowLeft, Trophy, Users, Vote, Percent, Clock, Radio } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

export function QuickCountDisplay({ onBack }) {
  const { candidates, totalDpt, totalVotes, participationPercentage, totalUnvoted, settings, dptBreakdown, votedBreakdown, unvotedBreakdown } = useElection();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const sortedCandidates = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const leadingCandidateId = sortedCandidates[0]?.voteCount > 0 ? sortedCandidates[0]?.id : null;

  return (
    <div className="projector-view" style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      padding: 'clamp(1rem, 2.5vw, 2.5rem)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '1.5rem'
      }}>
        {/* Logo & School Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={settings.schoolLogo || '/assets/logo.png'}
            alt="Logo SMAN 1 Batu"
            style={{
              width: 'clamp(44px, 5vw, 60px)',
              height: 'clamp(44px, 5vw, 60px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.12))'
            }}
          />
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              color: '#b45309',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              PENGHITUNGAN SUARA RESMI REAL-TIME (QUICK COUNT)
            </div>
            <h1 style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
              fontWeight: '900',
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              PILKETOS SMAN 1 BATU 2026
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              SMA NEGERI 1 BATU &bull; {settings.tpsCode || 'TPS SMAN 1 Batu'}
            </div>
          </div>
        </div>

        {/* Status TPS & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div className="badge badge-green" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            <span className="status-dot"></span> LIVE MONITORING
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={toggleFullscreen}
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span className="hide-mobile">{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onBack}
            title="Kembali ke Beranda"
          >
            <ArrowLeft size={15} />
            <span>Keluar <span className="hide-mobile">Monitoring</span></span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards (Responsive 2x2 on Mobile, 4 Across on Desktop/Projector) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
        gap: 'clamp(0.75rem, 2vw, 1.5rem)',
        marginBottom: 'clamp(1.25rem, 2.5vw, 2.5rem)'
      }}>
        {/* Card 1: Total DPT Terdaftar */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          borderTop: '5px solid #2563eb',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Total DPT Terdaftar
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#0f172a', marginTop: '0.2rem', lineHeight: '1.1' }}>
              {formatNumber(totalDpt)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '600', marginTop: '0.25rem' }}>
              Hak Suara Pemilih Aktif
            </div>
          </div>

          {/* Rincian Jumlah Siswa, Guru, dan Tendik */}
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dbeafe' }}>
              Siswa: {formatNumber(dptBreakdown?.siswa ?? 0)}
            </span>
            <span style={{ background: '#f0fdf4', color: '#15803d', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dcfce7' }}>
              Guru: {formatNumber(dptBreakdown?.guru ?? 0)}
            </span>
            <span style={{ background: '#fefce8', color: '#a16207', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #fef08a' }}>
              Tendik: {formatNumber(dptBreakdown?.tendik ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 2: Suara Sah Masuk */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          borderTop: '5px solid #059669',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Suara Sah Masuk
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#059669', marginTop: '0.2rem', lineHeight: '1.1' }}>
              {formatNumber(totalVotes)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: '600', marginTop: '0.25rem' }}>
              Tercatat di Kotak Suara
            </div>
          </div>

          {/* Rincian Suara Sah Masuk: Siswa, Guru, dan Tendik */}
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dbeafe' }}>
              Siswa: {formatNumber(votedBreakdown?.siswa ?? 0)}
            </span>
            <span style={{ background: '#f0fdf4', color: '#15803d', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dcfce7' }}>
              Guru: {formatNumber(votedBreakdown?.guru ?? 0)}
            </span>
            <span style={{ background: '#fefce8', color: '#a16207', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #fef08a' }}>
              Tendik: {formatNumber(votedBreakdown?.tendik ?? 0)}
            </span>
          </div>
        </div>

        {/* Card 3: Tingkat Partisipasi */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          borderTop: '5px solid #d97706',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Tingkat Partisipasi
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#d97706', marginTop: '0.2rem', lineHeight: '1.1' }}>
              {participationPercentage}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: '600', marginTop: '0.25rem' }}>
              Persentase Pemilih Hadir
            </div>
          </div>

          {/* Rincian Rasio Partisipasi */}
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ background: '#fffbeb', color: '#b45309', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #fde68a' }}>
              Masuk: {formatNumber(totalVotes)} / {formatNumber(totalDpt)} Suara
            </span>
          </div>
        </div>

        {/* Card 4: Belum Menggunakan Hak */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          borderTop: '5px solid #dc2626',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
              Belum Menggunakan Hak
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#dc2626', marginTop: '0.2rem', lineHeight: '1.1' }}>
              {formatNumber(totalUnvoted)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: '600', marginTop: '0.25rem' }}>
              Pemilih Menunggu Giliran
            </div>
          </div>

          {/* Rincian Belum Menggunakan Hak: Siswa, Guru, dan Tendik */}
          <div style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px dashed #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dbeafe' }}>
              Siswa: {formatNumber(unvotedBreakdown?.siswa ?? 0)}
            </span>
            <span style={{ background: '#f0fdf4', color: '#15803d', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dcfce7' }}>
              Guru: {formatNumber(unvotedBreakdown?.guru ?? 0)}
            </span>
            <span style={{ background: '#fefce8', color: '#a16207', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #fef08a' }}>
              Tendik: {formatNumber(unvotedBreakdown?.tendik ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Spectacular Candidate Cards for Projector & Mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(1rem, 2.5vw, 2rem)',
        flex: 1
      }}>
        {candidates.map((cand) => {
          const pct = totalVotes > 0 ? ((cand.voteCount / totalVotes) * 100).toFixed(1) : '0.0';
          const isLeading = cand.id === leadingCandidateId;

          return (
            <div
              key={cand.id}
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-xl)',
                background: '#ffffff',
                border: isLeading ? '2.5px solid #f59e0b' : '1px solid #e2e8f0',
                boxShadow: isLeading
                  ? '0 12px 32px rgba(217, 119, 6, 0.18), 0 2px 6px rgba(0,0,0,0.04)'
                  : '0 6px 20px rgba(15, 23, 42, 0.06)'
              }}
            >
              {isLeading && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  padding: '0.35rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
                }}>
                  <Trophy size={15} />
                  <span>MEMIMPIN SEMENTARA</span>
                </div>
              )}

              {/* Foto Paslon */}
              <div style={{ height: 'clamp(240px, 35vh, 360px)', position: 'relative', overflow: 'hidden', background: '#e2e8f0' }}>
                <img
                  src={cand.photoUrl || '/assets/paslon1.jpg'}
                  alt={`Paslon ${cand.number}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: cand.number === 3 ? 'center 38%' : cand.number === 2 ? 'center 42%' : 'center 48%'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '1.4rem',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  zIndex: 2
                }}>
                  #{cand.number}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.3' }}>
                    {cand.chairmanName}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    &amp; {cand.viceChairmanName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontWeight: '600' }}>
                    Kelas {cand.chairmanClass} &bull; {cand.viceChairmanClass}
                  </div>
                </div>

                {/* Big Vote Counter */}
                <div style={{
                  marginTop: 'auto',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                    Perolehan Suara Sah
                  </div>
                  <div style={{
                    fontSize: '3.4rem',
                    fontWeight: '900',
                    color: isLeading ? '#b45309' : '#0f172a',
                    lineHeight: '1.1',
                    marginTop: '0.2rem'
                  }}>
                    {cand.voteCount || 0}
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#2563eb' }}>
                    {pct}%
                  </div>

                  {/* Percentage Bar */}
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e2e8f0',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden',
                    marginTop: '0.75rem'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isLeading
                        ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: 'var(--radius-pill)',
                      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Running Bottom Ticker */}
      <div style={{
        marginTop: '2rem',
        padding: '0.9rem 1.75rem',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.88rem',
        color: 'var(--text-secondary)',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio size={18} color="#dc2626" />
          <span>
            <strong>PENGUMUMAN PANITIA:</strong> Pemungutan suara berlangsung hingga pukul 13.00 WIB di TPS SMAN 1 Batu.
          </span>
        </div>
        <div style={{ color: '#b45309', fontWeight: '800', letterSpacing: '0.04em' }}>
          SMAN 1 BATU &bull; STUDIUM ET VIRTUS
        </div>
      </div>
    </div>
  );
}

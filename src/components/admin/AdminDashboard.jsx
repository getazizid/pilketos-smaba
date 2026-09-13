import React from 'react';
import { useElection } from '../../context/ElectionContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Vote, 
  Percent, 
  Clock, 
  CheckCircle2, 
  Tv, 
  TrendingUp, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import { formatNumber, calculatePercentage, formatIndonesianDate } from '../../utils/helpers';

export function AdminDashboard({ onNavigate }) {
  const { 
    candidates, 
    students, 
    totalDpt, 
    totalVotes, 
    participationPercentage, 
    totalUnvoted, 
    auditLogs,
    settings,
    dptBreakdown
  } = useElection();
  const { adminUser } = useAuth();

  // Partisipasi per jenjang kelas (X, XI, XII)
  const classStats = {
    x: { total: 0, voted: 0 },
    xi: { total: 0, voted: 0 },
    xii: { total: 0, voted: 0 }
  };

  students.forEach((s) => {
    const cls = (s.class || '').toUpperCase();
    let group = null;
    if (cls.startsWith('XII-') || cls.startsWith('XII ') || cls === 'XII') group = 'xii';
    else if (cls.startsWith('XI-') || cls.startsWith('XI ') || cls === 'XI') group = 'xi';
    else if (cls.startsWith('X-') || cls.startsWith('X ') || cls === 'X') group = 'x';

    if (group && classStats[group]) {
      classStats[group].total += 1;
      if (s.hasVoted) classStats[group].voted += 1;
    }
  });

  // Urutkan paslon berdasarkan perolehan suara tertinggi untuk quick count ranking
  const sortedCandidates = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

  return (
    <div>
      {/* Top Banner / Welcome */}
      <div className="glass-panel" style={{
        padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
        border: '1.5px solid #bfdbfe'
      }}>
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {settings.eventName} &bull; Periode {settings.period}
          </div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', color: '#0f172a', marginTop: '0.2rem' }}>
            Halo, {adminUser?.name || 'Staf Panitia'}!
          </h2>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Hak Akses: <span className="badge badge-purple">{adminUser?.role}</span> &bull; {settings.tpsCode}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-gold btn-sm" 
            onClick={() => onNavigate('projector')}
          >
            <Tv size={16} />
            <span>Mode Layar Monitoring</span>
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            onClick={() => onNavigate('report')}
          >
            <FileText size={16} />
            <span>Berita Acara</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary-light)' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-val">{formatNumber(totalDpt)}</div>
            <div className="stat-title">Daftar Pemilih Tetap</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span>Siswa: {dptBreakdown?.siswa ?? 0}</span> • 
              <span>Guru: {dptBreakdown?.guru ?? 0}</span> • 
              <span>Tendik: {dptBreakdown?.tendik ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--emerald-subtle)', color: 'var(--emerald)' }}>
            <Vote size={26} />
          </div>
          <div>
            <div className="stat-val">{formatNumber(totalVotes)}</div>
            <div className="stat-title">Total Suara Masuk</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gold-subtle)', color: 'var(--gold)' }}>
            <Percent size={26} />
          </div>
          <div>
            <div className="stat-val">{participationPercentage}%</div>
            <div className="stat-title">Partisipasi Pemilih</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5' }}>
            <Clock size={26} />
          </div>
          <div>
            <div className="stat-val">{formatNumber(totalUnvoted)}</div>
            <div className="stat-title">Belum Menggunakan Hak</div>
          </div>
        </div>
      </div>

      {/* Quick Count & Breakdown Grid (Fully Responsive) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', 
        gap: 'clamp(1rem, 2vw, 1.75rem)', 
        marginBottom: '2rem' 
      }}>
        {/* Real-time Quick Count Paslon */}
        <div className="glass-panel" style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.18rem', color: 'var(--text-primary)' }}>Quick Count Suara Paslon</h3>
            </div>
            <span className="badge badge-green">
              <span className="status-dot"></span> LIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {candidates.map((cand) => {
              const votePct = totalVotes > 0 ? ((cand.voteCount / totalVotes) * 100).toFixed(1) : 0;
              const isLeading = sortedCandidates[0]?.id === cand.id && cand.voteCount > 0;

              return (
                <div key={cand.id} style={{
                  background: '#ffffff',
                  border: `1.5px solid ${isLeading ? 'var(--gold)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  position: 'relative',
                  boxShadow: isLeading ? '0 4px 14px rgba(217, 119, 6, 0.15)' : 'none'
                }}>
                  {isLeading && (
                    <div style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '0.85rem',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      color: 'var(--gold)',
                      background: 'var(--gold-subtle)',
                      padding: '0.15rem 0.55rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border-gold)'
                    }}>
                      ⭐ UNGGUL
                    </div>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'var(--primary-subtle)',
                      color: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.05rem',
                      flexShrink: 0
                    }}>
                      #{cand.number}
                    </div>

                    <div style={{ flex: '1 1 180px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.98rem' }}>
                        {cand.chairmanName} &amp; {cand.viceChairmanName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Kelas {cand.chairmanClass} &bull; {cand.viceChairmanClass}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                        {cand.voteCount || 0} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>suara</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                        {votePct}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f1f5f9',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${votePct}%`,
                      height: '100%',
                      background: isLeading 
                        ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' 
                        : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                      borderRadius: 'var(--radius-pill)',
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partisipasi Tingkat Kelas & Log Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Partisipasi Kelas X, XI, XII */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Partisipasi Berdasarkan Tingkatan Kelas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Kelas X (X-1 s/d X-12)', data: classStats.x, color: '#2563eb' },
                { name: 'Kelas XI (XI-1 s/d XI-12)', data: classStats.xi, color: '#059669' },
                { name: 'Kelas XII (XII-1 s/d XII-12)', data: classStats.xii, color: '#7c3aed' }
              ].map((lvl, idx) => {
                const pct = lvl.data.total > 0 ? ((lvl.data.voted / lvl.data.total) * 100).toFixed(1) : 0;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{lvl.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {lvl.data.voted} / {lvl.data.total} siswa ({pct}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-pill)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: lvl.color,
                        borderRadius: 'var(--radius-pill)',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log / Audit Trail */}
          <div className="glass-panel" style={{ padding: '1.75rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldAlert size={20} color="var(--gold)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Log Aktivitas TPS</h3>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {auditLogs.length} Aktivitas
              </span>
            </div>

            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {auditLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Belum ada aktivitas tercatat di TPS.
                </div>
              ) : (
                auditLogs.slice(0, 15).map((log) => (
                  <div
                    key={log.id}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.65rem 0.85rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: `3.5px solid ${
                        log.type === 'SUCCESS' ? 'var(--emerald)' :
                        log.type === 'WARNING' || log.type === 'DANGER' ? 'var(--crimson)' : 'var(--primary)'
                      }`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.85rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500', flex: '1 1 200px' }}>
                      {log.message}
                    </span>
                    <span style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '0.72rem', 
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#f1f5f9',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <Clock size={12} color="#64748b" />
                      {formatIndonesianDate(log.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import React, { useState, useMemo } from 'react';
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
import { formatNumber, calculatePercentage, formatIndonesianDate, sortClassNames, getStandardSchoolClasses } from '../../utils/helpers';

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

  const [activeClassTab, setActiveClassTab] = useState('ALL'); // 'ALL', 'X', 'XI', 'XII'
  const [classSearch, setClassSearch] = useState('');
  const [onlyWithVoters, setOnlyWithVoters] = useState(true);

  // Agregasi partisipasi suara untuk setiap masing-masing kelas individual (X-1..X-12, XI-1..XI-12, XII-1..XII-12, dll)
  const perClassStats = useMemo(() => {
    const std = getStandardSchoolClasses();
    const map = {};

    // Inisialisasi 36 kelas standar
    std.all.forEach((cls) => {
      let level = 'OTHER';
      if (cls.startsWith('X-')) level = 'X';
      else if (cls.startsWith('XI-')) level = 'XI';
      else if (cls.startsWith('XII-')) level = 'XII';
      map[cls] = { className: cls, total: 0, voted: 0, level, isStandard: true };
    });

    // Akumulasi data aktual dari DPT siswa
    students.forEach((s) => {
      if ((s.voterType || 'SISWA') === 'SISWA' && s.class) {
        const cls = s.class.trim();
        if (!map[cls]) {
          let level = 'OTHER';
          const upper = cls.toUpperCase();
          if (upper.startsWith('XII-') || upper.startsWith('XII ') || upper === 'XII') level = 'XII';
          else if (upper.startsWith('XI-') || upper.startsWith('XI ') || upper === 'XI') level = 'XI';
          else if (upper.startsWith('X-') || upper.startsWith('X ') || upper === 'X') level = 'X';
          map[cls] = { className: cls, total: 0, voted: 0, level, isStandard: false };
        }
        map[cls].total += 1;
        if (s.hasVoted) {
          map[cls].voted += 1;
        }
      }
    });

    const sortedKeys = sortClassNames(Object.keys(map));
    return sortedKeys.map((k) => map[k]);
  }, [students]);

  // Filter kelas berdasarkan tab aktif, pencarian, dan opsi hanya kelas ber-DPT
  const filteredClassStats = useMemo(() => {
    return perClassStats.filter((c) => {
      if (activeClassTab !== 'ALL' && c.level !== activeClassTab) return false;
      if (onlyWithVoters && c.total === 0) return false;
      if (classSearch && !c.className.toLowerCase().includes(classSearch.toLowerCase().trim())) return false;
      return true;
    });
  }, [perClassStats, activeClassTab, onlyWithVoters, classSearch]);

  // Hitung jumlah kelas per tingkatan untuk badge tab
  const tabCounts = useMemo(() => {
    const counts = { ALL: 0, X: 0, XI: 0, XII: 0 };
    perClassStats.forEach((c) => {
      if (!onlyWithVoters || c.total > 0) {
        counts.ALL += 1;
        if (counts[c.level] !== undefined) counts[c.level] += 1;
      }
    });
    return counts;
  }, [perClassStats, onlyWithVoters]);

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
          {/* Partisipasi Masing-Masing Kelas */}
          <div className="glass-panel" style={{ padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', color: 'var(--text-primary)' }}>
                  Partisipasi Berdasarkan Kelas
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Monitoring kehadiran pemilih per masing-masing kelas individual
                </div>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                {filteredClassStats.length} Kelas
              </span>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {/* Tab Tingkatan */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'Semua' },
                  { id: 'X', label: 'Kelas X' },
                  { id: 'XI', label: 'Kelas XI' },
                  { id: 'XII', label: 'Kelas XII' }
                ].map((tab) => {
                  const isActive = activeClassTab === tab.id;
                  const count = tabCounts[tab.id] ?? 0;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveClassTab(tab.id)}
                      style={{
                        padding: '0.28rem 0.65rem',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                        background: isActive ? 'var(--primary)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{tab.label}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '0.05rem 0.35rem',
                        borderRadius: 'var(--radius-pill)',
                        background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                        color: isActive ? '#ffffff' : 'var(--text-muted)'
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Toggle Only With Voters */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 160px' }}>
                  <input
                    type="text"
                    placeholder="Cari kelas (misal: X-1)..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.78rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      background: '#ffffff',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={onlyWithVoters}
                    onChange={(e) => setOnlyWithVoters(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Hanya kelas ber-DPT</span>
                </label>
              </div>
            </div>

            {/* List Masing-Masing Kelas (Scrollable) */}
            <div style={{
              maxHeight: '340px',
              overflowY: 'auto',
              paddingRight: '0.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              {filteredClassStats.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed #e2e8f0'
                }}>
                  Tidak ada kelas yang cocok dengan kriteria filter.
                  {onlyWithVoters && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                        onClick={() => setOnlyWithVoters(false)}
                      >
                        Tampilkan Seluruh 36 Kelas Reguler
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                filteredClassStats.map((c) => {
                  const pct = c.total > 0 ? ((c.voted / c.total) * 100).toFixed(1) : '0.0';
                  const isComplete = c.total > 0 && c.voted === c.total;
                  
                  // Warna bar per jenjang kelas
                  let barColor = 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)';
                  let badgeBg = '#eff6ff';
                  let badgeColor = '#1d4ed8';
                  let badgeBorder = '#bfdbfe';

                  if (c.level === 'XI') {
                    barColor = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
                    badgeBg = '#ecfdf5';
                    badgeColor = '#047857';
                    badgeBorder = '#a7f3d0';
                  } else if (c.level === 'XII') {
                    barColor = 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)';
                    badgeBg = '#f5f3ff';
                    badgeColor = '#6d28d9';
                    badgeBorder = '#ddd6fe';
                  } else if (c.level === 'OTHER') {
                    barColor = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
                    badgeBg = '#fffbeb';
                    badgeColor = '#b45309';
                    badgeBorder = '#fde68a';
                  }

                  if (isComplete) {
                    barColor = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
                  }

                  return (
                    <div
                      key={c.className}
                      style={{
                        padding: '0.55rem 0.75rem',
                        background: '#ffffff',
                        border: '1px solid #f1f5f9',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        marginBottom: '0.35rem',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: badgeBg,
                            color: badgeColor,
                            border: `1px solid ${badgeBorder}`,
                            letterSpacing: '0.02em'
                          }}>
                            {c.className}
                          </span>
                          {isComplete && (
                            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--emerald)' }}>
                              ✓ 100% Selesai
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{c.voted}</strong> / {c.total} pemilih
                          </span>
                          <span style={{
                            fontWeight: '700',
                            fontSize: '0.78rem',
                            color: isComplete ? 'var(--emerald)' : parseFloat(pct) > 0 ? badgeColor : 'var(--text-muted)',
                            minWidth: '42px',
                            textAlign: 'right'
                          }}>
                            {pct}%
                          </span>
                        </div>
                      </div>

                      <div style={{
                        width: '100%',
                        height: '7px',
                        background: '#f1f5f9',
                        borderRadius: 'var(--radius-pill)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: c.total === 0 ? '#e2e8f0' : barColor,
                          borderRadius: 'var(--radius-pill)',
                          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                      </div>
                    </div>
                  );
                })
              )}
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

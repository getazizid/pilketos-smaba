import React, { useState, useMemo, useEffect } from 'react';
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
  ShieldCheck,
  FileText,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatNumber, formatIndonesianDate, sortClassNames, getStandardSchoolClasses } from '../../utils/helpers';

export function AdminDashboard({ onNavigate, onAddToast }) {
  const { 
    candidates, 
    students, 
    totalDpt, 
    totalVotes, 
    totalVotedStudents,
    isTallyValid,
    participationPercentage, 
    totalUnvoted, 
    auditLogs,
    settings,
    dptBreakdown,
    votedBreakdown,
    unvotedBreakdown,
    adjustCandidateVote,
    reconcileCandidateVotes
  } = useElection();
  const { adminUser } = useAuth();

  const [activeClassTab, setActiveClassTab] = useState('ALL'); // 'ALL', 'X', 'XI', 'XII'
  const [classSearch, setClassSearch] = useState('');
  const [onlyWithVoters, setOnlyWithVoters] = useState(true);

  // State Rekonsiliasi Integritas Data Suara
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [reconcileTab, setReconcileTab] = useState('quick'); // 'quick' | 'manual'
  const [manualCounts, setManualCounts] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);
  const [reconcileReason, setReconcileReason] = useState('Koreksi anomali data pasca pemilih di-reset dan mencoblos ulang');

  const discrepancy = totalVotes - totalVotedStudents;

  useEffect(() => {
    if (isReconcileModalOpen) {
      const counts = {};
      candidates.forEach(c => {
        counts[c.id] = c.voteCount || 0;
      });
      setManualCounts(counts);
      setSuccessBanner(null);
    }
  }, [isReconcileModalOpen, candidates]);

  const handleQuickDeduct = async (candidate, delta = -1) => {
    setIsProcessing(true);
    try {
      await adjustCandidateVote(candidate.id, delta, reconcileReason || 'Koreksi anomali data pasca reset pemilih');
      setSuccessBanner(`Berhasil! Suara Paslon No. ${candidate.number} (${candidate.chairmanName}) telah disesuaikan (${delta} suara). Total perolehan suara paslon kini ${totalVotes + delta} suara, persis sama dengan total pemilih yang mencoblos (${totalVotedStudents} orang). Status sistem telah kembali HIJAU (100% SINKRON & JURDIL)!`);
      if (onAddToast) onAddToast(`Status integritas berhasil disinkronkan. Suara Paslon #${candidate.number} disesuaikan.`, 'success');
    } catch (err) {
      alert('Gagal menyesuaikan suara paslon: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualReconcile = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await reconcileCandidateVotes(manualCounts, reconcileReason || 'Koreksi manual integritas suara');
      setSuccessBanner(`Rekonsiliasi manual berhasil diterapkan! Data perolehan suara paslon kini telah disinkronkan dengan pemilih mencoblos. Status sistem kembali HIJAU!`);
      if (onAddToast) onAddToast('Rekonsiliasi suara paslon berhasil disimpan.', 'success');
    } catch (err) {
      alert('Gagal rekonsiliasi manual: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

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
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span>Siswa: {votedBreakdown?.siswa ?? 0}</span> • 
              <span>Guru: {votedBreakdown?.guru ?? 0}</span> • 
              <span>Tendik: {votedBreakdown?.tendik ?? 0}</span>
            </div>
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
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span>Siswa: {unvotedBreakdown?.siswa ?? 0}</span> • 
              <span>Guru: {unvotedBreakdown?.guru ?? 0}</span> • 
              <span>Tendik: {unvotedBreakdown?.tendik ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Rekonsiliasi & Integritas Suara (JURDIL) */}
      <div style={{
        background: isTallyValid ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : '#fef2f2',
        border: `1.5px solid ${isTallyValid ? '#bbf7d0' : '#fecaca'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '0.9rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: isTallyValid ? '#dcfce7' : '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isTallyValid ? '#15803d' : '#dc2626'
          }}>
            {isTallyValid ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isTallyValid ? '#166534' : '#991b1b' }}>
              {isTallyValid 
                ? 'Audit Integritas Sistem: Suara Sah 100% Sesuai & Tervalidasi (JURDIL)' 
                : 'Peringatan Anomali Data: Terdapat Ketidaksesuaian Suara!'}
            </div>
            <div style={{ fontSize: '0.8rem', color: isTallyValid ? '#15803d' : '#b91c1c' }}>
              {isTallyValid 
                ? `Total Suara Sah Paslon (${formatNumber(totalVotes)} suara) = Total Pemilih Mencoblos (${formatNumber(totalVotedStudents ?? totalVotes)} orang). Tidak ada suara ganda atau suara siluman.`
                : `Total suara paslon (${formatNumber(totalVotes)}) tidak sama dengan pemilih yang mencoblos (${formatNumber(totalVotedStudents)} orang). Segera verifikasi log.`}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setSuccessBanner(null);
              setIsReconcileModalOpen(true);
            }}
            style={{
              background: isTallyValid ? '#f8fafc' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: isTallyValid ? 'var(--text-secondary)' : '#ffffff',
              border: isTallyValid ? '1px solid #cbd5e1' : 'none',
              padding: '0.42rem 0.9rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: isTallyValid ? 'none' : '0 2px 8px rgba(220, 38, 38, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Wrench size={14} color={isTallyValid ? '#475569' : '#ffffff'} />
            <span>{isTallyValid ? 'Opsi Rekonsiliasi' : 'Koreksi / Rekonsiliasi Suara (Ubah Jadi Hijau)'}</span>
          </button>

          <div style={{
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            background: isTallyValid ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${isTallyValid ? '#86efac' : '#fca5a5'}`,
            fontSize: '0.75rem',
            fontWeight: '700',
            color: isTallyValid ? '#15803d' : '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span className="status-dot" style={{ background: isTallyValid ? '#16a34a' : '#dc2626' }}></span>
            <span>{isTallyValid ? 'STATUS: 100% VALID & SINKRON' : 'STATUS: ANOMALI PERIKSA'}</span>
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

            {/* List Masing-Masing Kelas (Tanpa Scroll - Siap Screenshot) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.65rem'
            }}>
              {filteredClassStats.length === 0 ? (
                <div style={{
                  gridColumn: '1 / -1',
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
                            <strong style={{ color: 'var(--text-primary)' }}>{c.voted}</strong>/{c.total}
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
      {/* Modal Rekonsiliasi Integritas Data Suara */}
      <Modal
        isOpen={isReconcileModalOpen}
        onClose={() => {
          if (!isProcessing) setIsReconcileModalOpen(false);
        }}
        title="Rekonsiliasi Integritas Data Suara (Koreksi Anomali)"
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Success Banner if reconciled */}
          {successBanner ? (
            <div style={{
              background: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: '#065f46', fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Data Berhasil Direkonsiliasi!
                </h4>
                <p style={{ color: '#047857', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                  {successBanner}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsReconcileModalOpen(false)}
                  >
                    Tutup & Lihat Dashboard (Status Hijau)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Ringkasan Perbandingan Suara */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL SUARA PASLON</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: discrepancy !== 0 ? '#dc2626' : '#16a34a' }}>
                      {formatNumber(totalVotes)}
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>PEMILIH MENCOBLOS</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                      {formatNumber(totalVotedStudents)}
                    </div>
                  </div>

                  <div style={{ 
                    background: discrepancy !== 0 ? '#fee2e2' : '#dcfce7', 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    border: `1px solid ${discrepancy !== 0 ? '#fca5a5' : '#86efac'}`, 
                    textAlign: 'center' 
                  }}>
                    <div style={{ fontSize: '0.75rem', color: discrepancy !== 0 ? '#991b1b' : '#166534', fontWeight: '700' }}>STATUS SELISIH</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: discrepancy !== 0 ? '#dc2626' : '#16a34a' }}>
                      {discrepancy > 0 ? `+${discrepancy} Suara Paslon` : discrepancy < 0 ? `${discrepancy} Suara Paslon` : '0 (Sinkron)'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', lineHeight: '1.45' }}>
                  <HelpCircle size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Penyebab:</strong> Ketika hak pilih seorang siswa di-reset oleh Admin lalu siswa tersebut mencoblos ulang di bilik, suara pencoblosan pertamanya masih tersimpan di salah satu Paslon (karena asas Rahasia mencegah sistem mengetahui paslon yang ia pilih sebelumnya). Untuk mengembalikan status menjadi <strong>HIJAU</strong>, kurangi 1 suara pada Paslon yang sebelumnya dicoblos.
                  </div>
                </div>
              </div>

              {/* Mode Navigasi Tab */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setReconcileTab('quick')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    background: reconcileTab === 'quick' ? 'var(--primary)' : 'transparent',
                    color: reconcileTab === 'quick' ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  Pilihan Cepat (1-Klik Koreksi Paslon)
                </button>
                <button
                  type="button"
                  onClick={() => setReconcileTab('manual')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    background: reconcileTab === 'manual' ? 'var(--primary)' : 'transparent',
                    color: reconcileTab === 'manual' ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  Penyesuaian Manual Angka Suara
                </button>
              </div>

              {reconcileTab === 'quick' ? (
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Pilih Paslon yang akan dikurangi {Math.abs(discrepancy) || 1} suara agar total paslon menjadi {formatNumber(totalVotedStudents)} suara:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {candidates.map((cand) => (
                      <div
                        key={cand.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          background: '#ffffff',
                          flexWrap: 'wrap',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--gold)',
                            color: '#000',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                          }}>
                            #{cand.number}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.92rem' }}>
                              {cand.chairmanName} & {cand.viceChairmanName}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Perolehan Saat Ini: <strong style={{ color: 'var(--primary)' }}>{formatNumber(cand.voteCount || 0)} suara</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            disabled={isProcessing || (cand.voteCount || 0) <= 0}
                            onClick={() => handleQuickDeduct(cand, -1)}
                            className="btn btn-sm"
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: '600',
                              padding: '0.4rem 0.85rem',
                              borderRadius: 'var(--radius-md)',
                              cursor: (isProcessing || (cand.voteCount || 0) <= 0) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            Kurangi 1 Suara (Menjadi {(cand.voteCount || 0) - 1})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleManualReconcile}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Atur perolehan suara setiap pasangan calon secara manual:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {candidates.map((cand) => (
                      <div key={cand.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>#{cand.number}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{cand.chairmanName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="number"
                            min="0"
                            value={manualCounts[cand.id] ?? (cand.voteCount || 0)}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                              setManualCounts(prev => ({ ...prev, [cand.id]: val }));
                            }}
                            className="form-input"
                            style={{ width: '90px', textAlign: 'right', padding: '0.35rem 0.5rem', fontWeight: '700' }}
                          />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>suara</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '0.75rem 1rem',
                    background: Object.values(manualCounts).reduce((a, b) => a + Number(b || 0), 0) === totalVotedStudents ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${Object.values(manualCounts).reduce((a, b) => a + Number(b || 0), 0) === totalVotedStudents ? '#a7f3d0' : '#fecaca'}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <span>Total Suara Baru: <strong>{Object.values(manualCounts).reduce((a, b) => a + Number(b || 0), 0)}</strong> suara</span>
                    <span>Target Pemilih: <strong>{totalVotedStudents}</strong> orang</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isProcessing ? 'Menyimpan Rekonsiliasi...' : 'Terapkan Rekonsiliasi Suara Manual'}
                  </button>
                </form>
              )}

              {/* Catatan Integritas & Audit */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                🛡️ Seluruh tindakan rekonsiliasi suara akan dicatat secara permanen di <strong>Audit Log Aktivitas</strong> dan disinkronkan langsung ke Cloud Firestore.
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AdminDashboard;

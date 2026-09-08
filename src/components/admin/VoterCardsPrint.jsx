import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { Printer, ArrowLeft, Filter } from 'lucide-react';

export function VoterCardsPrint({ onBack }) {
  const { students, settings } = useElection();
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Ambil daftar kelas unik
  const uniqueClasses = Array.from(new Set(students.map(s => s.class))).sort();

  const filteredCards = selectedClass === 'ALL'
    ? students
    : students.filter(s => s.class === selectedClass);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Control Bar (Hidden on Print) */}
      <div className="no-print glass-panel" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Kembali ke DPT</span>
          </button>

          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Cetak Kartu Pemilih Massal</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total {filteredCards.length} kartu siap dicetak dalam format kertas A4
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>Kelas {cls}</option>
              ))}
            </select>
          </div>

          <button type="button" className="btn btn-gold btn-lg" onClick={handlePrint}>
            <Printer size={18} />
            <span>Cetak Kartu (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Grid Kartu Pemilih Siap Cetak (A4 Friendly) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredCards.map((student) => (
          <div
            key={student.id}
            className="voter-card-print"
            style={{
              border: '2px dashed #94a3b8',
              borderRadius: '10px',
              padding: '1.25rem',
              background: '#ffffff',
              color: '#0f172a',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {/* Header Kartu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '2px solid #0f172a',
              paddingBottom: '0.65rem',
              marginBottom: '0.85rem'
            }}>
              <img
                src={settings.schoolLogo || '/assets/logo.png'}
                alt="Logo SMAN 1 Batu"
                style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', color: '#b45309', textTransform: 'uppercase' }}>
                  KARTU SUARA PEMILIH OSIS 2026
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>
                  SMA NEGERI 1 BATU
                </div>
              </div>
              <div style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                background: '#0f172a',
                color: '#fff',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                LUBER
              </div>
            </div>

            {/* Data Siswa */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Nama Lengkap Siswa</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {student.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.82rem', fontWeight: '700', color: '#334155' }}>
                <span>NISN: {student.nisn}</span>
                <span>Kelas: {student.class}</span>
              </div>
            </div>

            {/* Kotak Token Rahasia */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.65rem',
              textAlign: 'center',
              marginBottom: '0.75rem'
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TOKEN AKSES RAHASIA BILIK SUARA
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.45rem',
                fontWeight: '900',
                letterSpacing: '0.2em',
                color: '#1e3a8a',
                marginTop: '0.2rem'
              }}>
                {student.token}
              </div>
            </div>

            {/* Footer Kartu & Potong Guide */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.65rem',
              color: '#64748b',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '0.5rem'
            }}>
              <span>Gunakan di Bilik Suara TPS SMABA</span>
              <span>1 Siswa = 1 Suara</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

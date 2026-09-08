import React from 'react';
import { Modal } from '../common/Modal';
import { Target, CheckCircle2, ListChecks, Award, Check } from 'lucide-react';

export function CandidateModal({ candidate, isOpen, onClose, onSelectCandidate }) {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pasangan Calon No. Urut ${candidate.number}`}
      maxWidth="780px"
    >
      <div>
        {/* Header Visual Paslon */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center',
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ width: '160px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={candidate.photoUrl || '/assets/paslon1.jpg'}
              alt={`Paslon ${candidate.number}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ color: 'var(--gold)', fontWeight: '700', fontSize: '0.85rem' }}>
              PASANGAN CALON KETUA &amp; WAKIL KETUA OSIS 2026
            </div>
            <h4 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {candidate.chairmanName} &amp; {candidate.viceChairmanName}
            </h4>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Ketua: {candidate.chairmanClass} &bull; Wakil: {candidate.viceChairmanClass}
            </div>
            {candidate.tagline && (
              <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                "{candidate.tagline}"
              </div>
            )}
          </div>
        </div>

        {/* VISI */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold)', marginBottom: '0.5rem', fontWeight: '700' }}>
            <Target size={20} />
            <span>VISI UTAMA</span>
          </div>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid var(--gold)',
            padding: '1rem 1.25rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            color: 'var(--text-primary)',
            fontSize: '0.98rem',
            lineHeight: '1.6'
          }}>
            {candidate.vision}
          </div>
        </div>

        {/* MISI */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-light)', marginBottom: '0.75rem', fontWeight: '700' }}>
            <ListChecks size={20} />
            <span>MISI &amp; ARAH KEBIJAKAN</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {candidate.missions && candidate.missions.map((misi, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <div style={{
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary-light)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {idx + 1}
                </div>
                <div>{misi}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRAM UNGGULAN */}
        {candidate.workPrograms && candidate.workPrograms.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--emerald)', marginBottom: '0.75rem', fontWeight: '700' }}>
              <Award size={20} />
              <span>PROGRAM KERJA UNGGULAN</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {candidate.workPrograms.map((prog, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    color: '#065f46'
                  }}
                >
                  <Check size={16} color="var(--emerald)" style={{ flexShrink: 0 }} />
                  <span>{prog}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Kembali
          </button>
          <button
            type="button"
            className="btn btn-emerald"
            onClick={() => {
              onClose();
              onSelectCandidate(candidate);
            }}
          >
            <CheckCircle2 size={18} />
            <span>PILIH PASLON #{candidate.number}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

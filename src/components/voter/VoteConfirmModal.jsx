import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export function VoteConfirmModal({ candidate, isOpen, onClose, onConfirmVote }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!candidate) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirmVote(candidate);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Konfirmasi Pencoblosan Suara"
      maxWidth="540px"
    >
      <div style={{ textAlign: 'center' }}>
        {/* Warning Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--gold-subtle)',
          color: 'var(--gold)',
          border: '1px solid var(--border-gold)',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1.25rem'
        }}>
          <AlertTriangle size={16} />
          <span>PASTIKAN PILIHAN ANDA BENAR</span>
        </div>

        <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Anda akan memberikan hak suara Anda kepada pasangan calon berikut:
        </p>

        {/* Selected Candidate Box */}
        <div style={{
          background: '#f8fafc',
          border: '2px solid var(--emerald)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--emerald)',
            color: '#ffffff',
            fontWeight: '900',
            fontSize: '0.85rem',
            padding: '0.2rem 1rem',
            borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.05em'
          }}>
            PASLON #{candidate.number}
          </div>

          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0.75rem auto 1rem',
            border: '3px solid var(--emerald)'
          }}>
            <img
              src={candidate.photoUrl || '/assets/paslon1.jpg'}
              alt={`Paslon ${candidate.number}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h4 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.25rem' }}>
            {candidate.chairmanName} &amp; {candidate.viceChairmanName}
          </h4>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Ketua: {candidate.chairmanClass} &bull; Wakil: {candidate.viceChairmanClass}
          </div>
        </div>

        {/* Asas Rahasia Reminder */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          justifyContent: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: '1.75rem'
        }}>
          <ShieldCheck size={16} color="var(--emerald)" />
          <span>Pilihan Anda dienkripsi secara anonim (Asas Rahasia LUBER).</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal / Ganti
          </button>

          <button
            type="button"
            className="btn btn-emerald"
            onClick={handleConfirm}
            disabled={isSubmitting}
            style={{ fontSize: '1rem' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Memproses Suara...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>YA, COBLOS SEKARANG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

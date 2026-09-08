import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function CandidateCard({ candidate, onSelectCandidate }) {
  return (
    <div 
      className={`candidate-card ${candidate.number === 1 ? 'featured-gold' : ''}`}
      onClick={() => onSelectCandidate(candidate)}
      style={{ cursor: 'pointer' }}
      title={`Klik untuk mencoblos Paslon #${candidate.number}`}
    >
      {/* Nomor Urut Paslon */}
      <div className="candidate-number-badge">
        #{candidate.number}
      </div>

      {/* Foto Pasangan Calon */}
      <div className="candidate-photo-wrap">
        <img
          src={candidate.photoUrl || '/assets/paslon1.jpg'}
          alt={`Paslon ${candidate.number}`}
          className="candidate-photo"
          loading="lazy"
        />
        <div className="candidate-photo-overlay"></div>
      </div>

      {/* Body Card */}
      <div className="candidate-body">
        {/* Calon Ketua */}
        <div className="candidate-pair-names">
          <div className="pair-role">Calon Ketua OSIS</div>
          <div className="pair-name">{candidate.chairmanName}</div>
          <div className="pair-class">Kelas {candidate.chairmanClass}</div>
        </div>

        {/* Calon Wakil Ketua */}
        <div className="candidate-pair-names" style={{ marginTop: '0.4rem' }}>
          <div className="pair-role">Calon Wakil Ketua OSIS</div>
          <div className="pair-name">{candidate.viceChairmanName}</div>
          <div className="pair-class">Kelas {candidate.viceChairmanClass}</div>
        </div>

        {/* Tagline / Motto */}
        {candidate.tagline && (
          <div className="candidate-tagline">
            "{candidate.tagline}"
          </div>
        )}

        {/* Tombol Aksi Langsung Coblos */}
        <div className="candidate-actions" style={{ marginTop: 'auto' }}>
          <button
            type="button"
            className="btn btn-emerald"
            style={{ 
              width: '100%', 
              fontSize: '1.05rem', 
              padding: '0.9rem 1rem',
              fontWeight: '800',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCandidate(candidate);
            }}
          >
            <CheckCircle2 size={20} />
            <span>COBLOS PASLON #{candidate.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


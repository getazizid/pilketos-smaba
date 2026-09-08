import React from 'react';
import { Eye, CheckCircle, Award } from 'lucide-react';

export function CandidateCard({ candidate, onShowDetails, onSelectCandidate }) {
  return (
    <div className={`candidate-card ${candidate.number === 1 ? 'featured-gold' : ''}`}>
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
        <div className="candidate-pair-names" style={{ marginTop: '0.5rem' }}>
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

        {/* Tombol Aksi */}
        <div className="candidate-actions">
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => onShowDetails(candidate)}
          >
            <Eye size={17} />
            <span>Lihat Visi, Misi &amp; Program</span>
          </button>

          <button
            type="button"
            className="btn btn-emerald"
            style={{ width: '100%', fontSize: '1.05rem', padding: '0.85rem 1rem' }}
            onClick={() => onSelectCandidate(candidate)}
          >
            <CheckCircle size={20} />
            <span>COBLOS PASLON #{candidate.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

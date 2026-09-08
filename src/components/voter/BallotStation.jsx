import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useElection } from '../../context/ElectionContext';
import { VoterLogin } from './VoterLogin';
import { CandidateCard } from './CandidateCard';
import { CandidateModal } from './CandidateModal';
import { VoteConfirmModal } from './VoteConfirmModal';
import { VoteReceipt } from './VoteReceipt';
import { TpsActivationGate } from './TpsActivationGate';
import { Shield, Sparkles, User, Info } from 'lucide-react';

export function BallotStation({ onAddToast }) {
  return (
    <TpsActivationGate>
      <BallotStationInner onAddToast={onAddToast} />
    </TpsActivationGate>
  );
}

function BallotStationInner({ onAddToast }) {
  const { currentVoter } = useAuth();
  const { candidates, submitVote, settings } = useElection();

  const [selectedCandidateForDetails, setSelectedCandidateForDetails] = useState(null);
  const [selectedCandidateForVote, setSelectedCandidateForVote] = useState(null);
  const [votedSuccessData, setVotedSuccessData] = useState(null);

  // Jika siswa belum login, tampilkan portal login
  if (!currentVoter) {
    return <VoterLogin />;
  }

  // Jika siswa sudah memilih, tampilkan struk bukti memilih
  if (currentVoter.hasVoted || votedSuccessData) {
    return (
      <VoteReceipt
        voter={currentVoter}
        votedTimestamp={votedSuccessData ? votedSuccessData.timestamp : currentVoter.votedAt}
        onFinish={() => setVotedSuccessData(null)}
      />
    );
  }

  // Handle konfirmasi coblos
  const handleConfirmVote = async (candidate) => {
    try {
      const result = await submitVote(currentVoter.id, candidate.id);
      setSelectedCandidateForVote(null);
      setVotedSuccessData(result);
      if (onAddToast) {
        onAddToast(`Suara Anda untuk Paslon #${candidate.number} berhasil dicoblos!`, 'success');
      }
    } catch (err) {
      console.error('Gagal mencoblos:', err);
      if (onAddToast) {
        onAddToast('Terjadi kesalahan saat mengirim suara. Silakan coba kembali.', 'error');
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '1rem' }}>
      {/* Voter Banner */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        borderLeft: '5px solid var(--primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--primary-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-light)'
          }}>
            <User size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pemilih Terverifikasi
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
              {currentVoter.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '600' }}>
              NISN: {currentVoter.nisn} &bull; Kelas: {currentVoter.class}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            Pilihlah salah satu Paslon dengan menekan tombol <strong>COBLOS</strong>.
          </span>
        </div>
      </div>

      {/* Grid Calon Ketua & Wakil Ketua OSIS */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Surat Suara Elektronik Pilketos 2026
        </h3>
        <p style={{ fontSize: '0.95rem' }}>
          Gunakan hak pilih Anda dengan bijak demi kemajuan SMA Negeri 1 Batu
        </p>
      </div>

      <div className="paslon-grid">
        {candidates.map((cand) => (
          <CandidateCard
            key={cand.id}
            candidate={cand}
            onShowDetails={(c) => setSelectedCandidateForDetails(c)}
            onSelectCandidate={(c) => setSelectedCandidateForVote(c)}
          />
        ))}
      </div>

      {/* Modal Detail Visi & Misi */}
      <CandidateModal
        candidate={selectedCandidateForDetails}
        isOpen={Boolean(selectedCandidateForDetails)}
        onClose={() => setSelectedCandidateForDetails(null)}
        onSelectCandidate={(c) => setSelectedCandidateForVote(c)}
      />

      {/* Modal Konfirmasi Coblos */}
      <VoteConfirmModal
        candidate={selectedCandidateForVote}
        isOpen={Boolean(selectedCandidateForVote)}
        onClose={() => setSelectedCandidateForVote(null)}
        onConfirmVote={handleConfirmVote}
      />
    </div>
  );
}

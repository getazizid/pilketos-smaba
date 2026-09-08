import React from 'react';
import { Modal } from './Modal';
import { HelpCircle, CheckCircle2, ShieldCheck, FileSpreadsheet, Vote, Phone } from 'lucide-react';

export function HelpModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Panduan Tata Cara Pemilihan (Pilketos 2026)"
      maxWidth="700px"
    >
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
        {/* Banner Asas */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#fff'
        }}>
          <ShieldCheck size={28} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800', color: 'var(--gold)', fontSize: '0.95rem' }}>
              ASAS PEMILU: LUBER JURDIL
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil. Hak suara Anda dijamin kerahasiaannya oleh sistem.
            </div>
          </div>
        </div>

        {/* Langkah Memilih */}
        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Vote size={18} color="var(--primary-light)" />
          <span>5 Langkah Mudah Menggunakan Hak Suara</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
          {[
            { num: 1, title: 'Ambil Kartu Pemilih', text: 'Tunjukkan kartu pelajar ke Petugas TPS di meja registrasi untuk memperoleh Kartu Pemilih berisi Token Akses.' },
            { num: 2, title: 'Menuju Bilik Suara', text: 'Masuki komputer bilik suara digital resmi yang telah diotorisasi Panitia di Graha Aula SMABA.' },
            { num: 3, title: 'Input NISN & Token', text: 'Ketik 10 digit NISN Anda dan 6 karakter Token Rahasia yang tertera pada kartu fisik.' },
            { num: 4, title: 'Langsung Coblos Paslon', text: 'Klik foto atau tombol hijau "COBLOS PASLON" pada kandidat pilihan Anda.' },
            { num: 5, title: 'Konfirmasi & Ambil Tinta', text: 'Tekan "YA, COBLOS SEKARANG" untuk konfirmasi suara, simpan bukti digital, dan celupkan jari ke tinta pemilu.' }
          ].map((step) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{
                background: 'var(--primary)',
                color: '#fff',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.8rem',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                {step.num}
              </div>
              <div>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.92rem' }}>{step.title}</div>
                <div style={{ fontSize: '0.85rem' }}>{step.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Kontak Bantuan */}
        <div style={{
          background: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Phone size={24} color="var(--emerald)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Mengalami Kendala Token / Akses?</div>
            <div>Segera hubungi Meja Operator TPS atau Pengawas MPK SMAN 1 Batu di dalam aula.</div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Saya Mengerti
          </button>
        </div>
      </div>
    </Modal>
  );
}

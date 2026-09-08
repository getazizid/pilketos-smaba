import React from 'react';
import { useElection } from '../../context/ElectionContext';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import { formatNumber, calculatePercentage, formatSimpleDate } from '../../utils/helpers';

export function OfficialReport({ onBack }) {
  const { candidates, students, settings, totalDpt, totalVotes, participationPercentage, totalUnvoted } = useElection();

  const handlePrint = () => {
    window.print();
  };

  const sortedCandidates = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const winner = sortedCandidates[0]?.voteCount > 0 ? sortedCandidates[0] : null;

  const today = formatSimpleDate(new Date());

  return (
    <div>
      {/* Action Bar (Hidden on Print) */}
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
            <span>Kembali ke Dashboard</span>
          </button>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Berita Acara Rekapitulasi Resmi</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Format formal siap cetak dan ditandatangani panitia, saksi, dan kepala sekolah
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-gold btn-lg" onClick={handlePrint}>
          <Printer size={18} />
          <span>Cetak Dokumen Resmi (PDF)</span>
        </button>
      </div>

      {/* Dokumen Formal Kertas Berita Acara */}
      <div className="berita-acara-print" style={{
        background: '#ffffff',
        color: '#0f172a',
        padding: '3rem',
        borderRadius: '8px',
        maxWidth: '900px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        fontFamily: "'Times New Roman', Times, serif"
      }}>
        {/* KOP SURAT RESMI SEKOLAH */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          borderBottom: '4px double #000',
          paddingBottom: '1rem',
          marginBottom: '2rem'
        }}>
          <img
            src={settings.schoolLogo || '/assets/logo.png'}
            alt="Logo SMAN 1 Batu"
            style={{ width: '85px', height: '85px', objectFit: 'contain' }}
          />
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
              PEMERINTAH PROVINSI JAWA TIMUR
            </div>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>
              DINAS PENDIDIKAN &bull; CABANG DINAS WILAYAH MALANG
            </div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SMA NEGERI 1 BATU
            </div>
            <div style={{ fontSize: '9pt', fontStyle: 'italic', marginTop: '2px' }}>
              {settings.schoolAddress || 'Jl. KH. Agus Salim No. 57, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65314'}
            </div>
            <div style={{ fontSize: '9pt' }}>
              Website: www.sman1batu.sch.id &bull; Pos-el: info@sman1batu.sch.id
            </div>
          </div>
        </div>

        {/* JUDUL BERITA ACARA */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '14pt', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
            BERITA ACARA REKAPITULASI HASIL PENGHITUNGAN SUARA
          </div>
          <div style={{ fontSize: '11pt', fontWeight: 'bold', marginTop: '4px' }}>
            PEMILIHAN KETUA DAN WAKIL KETUA OSIS TAHUN 2026
          </div>
          <div style={{ fontSize: '10pt', marginTop: '2px' }}>
            Nomor: 421.3 / 118 / OSIS-SMABA / IX / 2026
          </div>
        </div>

        {/* NARASI PEMBUKA */}
        <div style={{ fontSize: '11pt', lineHeight: '1.6', textAlign: 'justify', marginBottom: '1.5rem' }}>
          Pada hari ini, <strong>Selasa</strong> tanggal <strong>8 September 2026</strong>, bertempat di Graha Aula SMA Negeri 1 Batu, telah dilaksanakan Rapat Pleno Terbuka Penghitungan dan Rekapitulasi Suara Pemilihan Ketua dan Wakil Ketua Organisasi Siswa Intra Sekolah (OSIS) SMA Negeri 1 Batu Periode Masa Bakti 2026/2027 secara langsung, umum, bebas, rahasia, jujur, dan adil (LUBER JURDIL) menggunakan sistem E-Voting Digital.
        </div>

        {/* TABEL 1: DATA PEMILIH & PARTISIPASI */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            I. DATA PEMILIH DAN PENGGUNAAN HAK SUARA
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5pt' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '6px', width: '60%' }}>1. Jumlah Siswa Terdaftar dalam Daftar Pemilih Tetap (DPT)</td>
                <td style={{ padding: '6px', fontWeight: 'bold', textAlign: 'right' }}>{formatNumber(totalDpt)} Orang</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '6px' }}>2. Jumlah Pemilih yang Menggunakan Hak Suara (Suara Sah)</td>
                <td style={{ padding: '6px', fontWeight: 'bold', textAlign: 'right' }}>{formatNumber(totalVotes)} Suara</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '6px' }}>3. Jumlah Pemilih yang Tidak Menggunakan Hak Suara (Golput)</td>
                <td style={{ padding: '6px', fontWeight: 'bold', textAlign: 'right' }}>{formatNumber(totalUnvoted)} Orang</td>
              </tr>
              <tr style={{ borderBottom: '2px solid #000', background: '#f8fafc' }}>
                <td style={{ padding: '6px', fontWeight: 'bold' }}>4. Persentase Partisipasi Pemilih</td>
                <td style={{ padding: '6px', fontWeight: 'bold', textAlign: 'right', color: '#1e3a8a' }}>{participationPercentage}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TABEL 2: PEROLEHAN SUARA PASLON */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            II. PEROLEHAN SUARA PASANGAN CALON KETUA &amp; WAKIL KETUA OSIS
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5pt', border: '1px solid #000' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #000' }}>
                <th style={{ border: '1px solid #000', padding: '8px', width: '10%' }}>No. Urut</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Pasangan Calon (Ketua &amp; Wakil)</th>
                <th style={{ border: '1px solid #000', padding: '8px', width: '20%' }}>Kelas</th>
                <th style={{ border: '1px solid #000', padding: '8px', width: '15%', textAlign: 'center' }}>Perolehan Suara</th>
                <th style={{ border: '1px solid #000', padding: '8px', width: '15%', textAlign: 'center' }}>Persentase</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => {
                const pct = totalVotes > 0 ? ((cand.voteCount / totalVotes) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={cand.id} style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                      {cand.number}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>
                      <div style={{ fontWeight: 'bold' }}>{cand.chairmanName}</div>
                      <div>dan {cand.viceChairmanName}</div>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px', fontSize: '9.5pt' }}>
                      <div>{cand.chairmanClass}</div>
                      <div>{cand.viceChairmanClass}</div>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                      {formatNumber(cand.voteCount)}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* KESIMPULAN PENETAPAN */}
        {winner && (
          <div style={{
            border: '2px solid #000',
            padding: '1rem',
            marginBottom: '2rem',
            background: '#fafafa',
            fontSize: '11pt',
            lineHeight: '1.5'
          }}>
            <strong>MENETAPKAN:</strong> Berdasarkan perolehan suara terbanyak, Pasangan Calon Nomor Urut <strong>{winner.number}</strong> atas nama <strong>{winner.chairmanName}</strong> (sebagai Ketua OSIS) dan <strong>{winner.viceChairmanName}</strong> (sebagai Wakil Ketua OSIS) ditetapkan sebagai <strong>Ketua dan Wakil Ketua OSIS SMA Negeri 1 Batu Terpilih Masa Bakti 2026/2027</strong>.
          </div>
        )}

        {/* KOLOM TANDA TANGAN */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ textAlign: 'right', marginBottom: '1.5rem', fontSize: '11pt' }}>
            Kota Batu, 8 September 2026
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'center', fontSize: '10.5pt', marginBottom: '3rem' }}>
            <div>
              <div>Mengetahui,</div>
              <div style={{ fontWeight: 'bold', marginBottom: '4.5rem' }}>Kepala SMA Negeri 1 Batu</div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{settings.headmasterName || 'Anto Dwi Cahyono., S.Pd., M.M'}</div>
              <div>NIP. 19700415 199702 1 003</div>
            </div>

            <div>
              <div>Menyetujui,</div>
              <div style={{ fontWeight: 'bold', marginBottom: '4.5rem' }}>Pembina OSIS SMAN 1 Batu</div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{settings.osisAdvisorName || 'Distri Adi Setiawan ., S.Pd., SS'}</div>
              <div>NIP. 19740921 200212 1 005</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', fontSize: '10pt' }}>
            <div>
              <div style={{ marginBottom: '3.5rem' }}>Ketua Panitia / MPK:</div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{settings.committeeLeaderName || 'Kurnia Ramadhan'}</div>
              <div>NIS. 20241098</div>
            </div>

            <div>
              <div style={{ marginBottom: '3.5rem' }}>Saksi Paslon 01:</div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Dimas Bagus Pratama</div>
              <div>Saksi Terdaftar</div>
            </div>

            <div>
              <div style={{ marginBottom: '3.5rem' }}>Saksi Paslon 02 &amp; 03:</div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Rizka Amalia Putri</div>
              <div>Saksi Terdaftar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

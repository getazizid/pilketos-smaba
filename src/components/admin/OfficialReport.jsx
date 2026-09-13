import React, { useState, useEffect } from 'react';
import { useElection } from '../../context/ElectionContext';
import { Printer, ArrowLeft, Edit3, X, Check, FileText, Award, Users, FileCheck } from 'lucide-react';
import { formatNumber, formatSimpleDate } from '../../utils/helpers';

export function OfficialReport({ onBack, onAddToast }) {
  const { candidates, settings, updateSettings, totalDpt, totalVotes, participationPercentage, totalUnvoted } = useElection();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportTitle: settings.reportTitle || 'BERITA ACARA REKAPITULASI HASIL PENGHITUNGAN SUARA',
    reportSubtitle: settings.reportSubtitle || 'PEMILIHAN KETUA DAN WAKIL KETUA OSIS TAHUN 2026',
    reportDocNumber: settings.reportDocNumber || '421.3 / 118 / OSIS-SMABA / IX / 2026',
    reportDay: settings.reportDay || 'Selasa',
    reportDate: settings.reportDate || '8 September 2026',
    reportCity: settings.reportCity || 'Kota Batu',

    headmasterTitle: settings.headmasterTitle || 'Kepala SMA Negeri 1 Batu',
    headmasterName: settings.headmasterName || 'Anto Dwi Cahyono., S.Pd., M.M',
    headmasterNip: settings.headmasterNip || '19700415 199702 1 003',

    osisAdvisorTitle: settings.osisAdvisorTitle || 'Pembina OSIS SMAN 1 Batu',
    osisAdvisorName: settings.osisAdvisorName || 'Distri Adi Setiawan ., S.Pd., SS',
    osisAdvisorNip: settings.osisAdvisorNip || '19740921 200212 1 005',

    committeeLeaderTitle: settings.committeeLeaderTitle || 'Ketua Panitia / MPK:',
    committeeLeaderName: settings.committeeLeaderName || 'Kurnia Ramadhan (Ketua MPK)',
    committeeLeaderNis: settings.committeeLeaderNis || '20241098',

    witness1Title: settings.witness1Title || 'Saksi Paslon 01:',
    witness1Name: settings.witness1Name || 'Dimas Bagus Pratama',
    witness1Role: settings.witness1Role || 'Saksi Terdaftar',

    witness2Title: settings.witness2Title || 'Saksi Paslon 02 & 03:',
    witness2Name: settings.witness2Name || 'Rizka Amalia Putri',
    witness2Role: settings.witness2Role || 'Saksi Terdaftar',

    witness3Title: settings.witness3Title || 'Saksi Tambahan:',
    witness3Name: settings.witness3Name || '',
    witness3Role: settings.witness3Role || ''
  });

  // Sinkronkan state lokal jika settings berubah dari luar
  useEffect(() => {
    setReportForm({
      reportTitle: settings.reportTitle || 'BERITA ACARA REKAPITULASI HASIL PENGHITUNGAN SUARA',
      reportSubtitle: settings.reportSubtitle || 'PEMILIHAN KETUA DAN WAKIL KETUA OSIS TAHUN 2026',
      reportDocNumber: settings.reportDocNumber || '421.3 / 118 / OSIS-SMABA / IX / 2026',
      reportDay: settings.reportDay || 'Selasa',
      reportDate: settings.reportDate || '8 September 2026',
      reportCity: settings.reportCity || 'Kota Batu',

      headmasterTitle: settings.headmasterTitle || 'Kepala SMA Negeri 1 Batu',
      headmasterName: settings.headmasterName || 'Anto Dwi Cahyono., S.Pd., M.M',
      headmasterNip: settings.headmasterNip || '19700415 199702 1 003',

      osisAdvisorTitle: settings.osisAdvisorTitle || 'Pembina OSIS SMAN 1 Batu',
      osisAdvisorName: settings.osisAdvisorName || 'Distri Adi Setiawan ., S.Pd., SS',
      osisAdvisorNip: settings.osisAdvisorNip || '19740921 200212 1 005',

      committeeLeaderTitle: settings.committeeLeaderTitle || 'Ketua Panitia / MPK:',
      committeeLeaderName: settings.committeeLeaderName || 'Kurnia Ramadhan (Ketua MPK)',
      committeeLeaderNis: settings.committeeLeaderNis || '20241098',

      witness1Title: settings.witness1Title || 'Saksi Paslon 01:',
      witness1Name: settings.witness1Name || 'Dimas Bagus Pratama',
      witness1Role: settings.witness1Role || 'Saksi Terdaftar',

      witness2Title: settings.witness2Title || 'Saksi Paslon 02 & 03:',
      witness2Name: settings.witness2Name || 'Rizka Amalia Putri',
      witness2Role: settings.witness2Role || 'Saksi Terdaftar',

      witness3Title: settings.witness3Title || 'Saksi Tambahan:',
      witness3Name: settings.witness3Name || '',
      witness3Role: settings.witness3Role || ''
    });
  }, [settings]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    updateSettings(reportForm);
    setIsEditModalOpen(false);
    if (onAddToast) onAddToast('Dokumen Berita Acara & Data Penandatangan berhasil diperbarui.', 'success');
  };

  const sortedCandidates = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const winner = sortedCandidates[0]?.voteCount > 0 ? sortedCandidates[0] : null;

  // Format Helper
  const formatDocNumber = (num) => {
    const v = (num || '421.3 / 118 / OSIS-SMABA / IX / 2026').trim();
    if (v.toLowerCase().startsWith('nomor') || v.toLowerCase().startsWith('no.')) return v;
    return `Nomor: ${v}`;
  };

  const formatNip = (val, defaultVal) => {
    const v = (val !== undefined && val !== null && val !== '' ? val : defaultVal).trim();
    if (!v) return '';
    return v.toLowerCase().startsWith('nip') ? v : `NIP. ${v}`;
  };

  const formatNis = (val, defaultVal) => {
    const v = (val !== undefined && val !== null && val !== '' ? val : defaultVal).trim();
    if (!v) return '';
    return v.toLowerCase().startsWith('nis') ? v : `NIS. ${v}`;
  };

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setIsEditModalOpen(true)}
            style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
          >
            <Edit3 size={16} />
            <span>Edit Dokumen &amp; Penandatangan</span>
          </button>

          <button type="button" className="btn btn-gold btn-lg" onClick={handlePrint}>
            <Printer size={18} />
            <span>Cetak Dokumen Resmi (PDF)</span>
          </button>
        </div>
      </div>

      {/* MODAL EDIT BERITA ACARA CEPAT (Hidden on Print) */}
      {isEditModalOpen && (
        <div className="no-print" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>
                  Edit Berita Acara &amp; Penandatangan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveModal} style={{ overflowY: 'auto', padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Grup 1: Judul & Nomor Berita Acara */}
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileCheck size={16} />
                  <span>1. Nomor Surat &amp; Judul Dokumen</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700' }}>Nomor Surat Berita Acara</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reportForm.reportDocNumber}
                      onChange={(e) => setReportForm({ ...reportForm, reportDocNumber: e.target.value })}
                      placeholder="421.3 / 118 / OSIS-SMABA / IX / 2026"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Judul Utama Dokumen</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reportForm.reportTitle}
                      onChange={(e) => setReportForm({ ...reportForm, reportTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Subjudul / Kegiatan</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reportForm.reportSubtitle}
                      onChange={(e) => setReportForm({ ...reportForm, reportSubtitle: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Hari Pleno</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reportForm.reportDay}
                      onChange={(e) => setReportForm({ ...reportForm, reportDay: e.target.value })}
                      placeholder="Selasa"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Tanggal Dokumen</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reportForm.reportDate}
                      onChange={(e) => setReportForm({ ...reportForm, reportDate: e.target.value })}
                      placeholder="8 September 2026"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Kota Penandatanganan</label>
                    <input
                      type="text"
                      className="form-input"
                      value={reportForm.reportCity}
                      onChange={(e) => setReportForm({ ...reportForm, reportCity: e.target.value })}
                      placeholder="Kota Batu"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Grup 2: Mengetahui & Menyetujui */}
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={16} />
                  <span>2. Pengesah (Kepala Sekolah &amp; Pembina OSIS)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {/* Kepala Sekolah */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>Mengetahui: Kepala Sekolah</div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Jabatan</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={reportForm.headmasterTitle}
                        onChange={(e) => setReportForm({ ...reportForm, headmasterTitle: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Nama Lengkap &amp; Gelar</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={reportForm.headmasterName}
                        onChange={(e) => setReportForm({ ...reportForm, headmasterName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>NIP</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={reportForm.headmasterNip}
                        onChange={(e) => setReportForm({ ...reportForm, headmasterNip: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Pembina OSIS */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>Menyetujui: Pembina OSIS</div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Jabatan</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={reportForm.osisAdvisorTitle}
                        onChange={(e) => setReportForm({ ...reportForm, osisAdvisorTitle: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Nama Lengkap &amp; Gelar</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={reportForm.osisAdvisorName}
                        onChange={(e) => setReportForm({ ...reportForm, osisAdvisorName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>NIP</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        value={reportForm.osisAdvisorNip}
                        onChange={(e) => setReportForm({ ...reportForm, osisAdvisorNip: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grup 3: Panitia & Saksi */}
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={16} />
                  <span>3. Ketua Panitia / MPK &amp; Saksi Paslon</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                  {/* Panitia */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#047857', marginBottom: '0.4rem' }}>Ketua Panitia / MPK</div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.committeeLeaderTitle}
                      onChange={(e) => setReportForm({ ...reportForm, committeeLeaderTitle: e.target.value })}
                      placeholder="Label Jabatan"
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.committeeLeaderName}
                      onChange={(e) => setReportForm({ ...reportForm, committeeLeaderName: e.target.value })}
                      placeholder="Nama Lengkap"
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
                      value={reportForm.committeeLeaderNis}
                      onChange={(e) => setReportForm({ ...reportForm, committeeLeaderNis: e.target.value })}
                      placeholder="NIS"
                      required
                    />
                  </div>

                  {/* Saksi 01 */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#b45309', marginBottom: '0.4rem' }}>Saksi Paslon 01</div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.witness1Title}
                      onChange={(e) => setReportForm({ ...reportForm, witness1Title: e.target.value })}
                      placeholder="Label Saksi"
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.witness1Name}
                      onChange={(e) => setReportForm({ ...reportForm, witness1Name: e.target.value })}
                      placeholder="Nama Saksi"
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
                      value={reportForm.witness1Role}
                      onChange={(e) => setReportForm({ ...reportForm, witness1Role: e.target.value })}
                      placeholder="Status Saksi"
                      required
                    />
                  </div>

                  {/* Saksi 02 & 03 */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#b45309', marginBottom: '0.4rem' }}>Saksi Paslon 02 &amp; 03</div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.witness2Title}
                      onChange={(e) => setReportForm({ ...reportForm, witness2Title: e.target.value })}
                      placeholder="Label Saksi"
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.witness2Name}
                      onChange={(e) => setReportForm({ ...reportForm, witness2Name: e.target.value })}
                      placeholder="Nama Saksi"
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
                      value={reportForm.witness2Role}
                      onChange={(e) => setReportForm({ ...reportForm, witness2Role: e.target.value })}
                      placeholder="Status Saksi"
                      required
                    />
                  </div>

                  {/* Saksi Tambahan */}
                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.4rem' }}>Saksi Tambahan (Opsional)</div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.witness3Title}
                      onChange={(e) => setReportForm({ ...reportForm, witness3Title: e.target.value })}
                      placeholder="Label Saksi"
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', marginBottom: '0.4rem' }}
                      value={reportForm.witness3Name}
                      onChange={(e) => setReportForm({ ...reportForm, witness3Name: e.target.value })}
                      placeholder="Nama Saksi (Opsional)"
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
                      value={reportForm.witness3Role}
                      onChange={(e) => setReportForm({ ...reportForm, witness3Role: e.target.value })}
                      placeholder="Status (Opsional)"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {settings.schoolName || 'SMA NEGERI 1 BATU'}
            </div>
            <div style={{ fontSize: '9pt', fontStyle: 'italic', marginTop: '2px' }}>
              {settings.schoolAddress || 'Jl. KH. Agus Salim No. 57, Sisir, Kec. Batu, Kota Batu, Jawa Timur 65314'}
            </div>
            <div style={{ fontSize: '9pt' }}>
              Website: www.sman1batu.sch.id &bull; Pos-el: info@sman1batu.sch.id
            </div>
          </div>
        </div>

        {/* JUDUL BERITA ACARA (DINAMIS & DAPAT DIEDIT) */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '14pt', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
            {settings.reportTitle || 'BERITA ACARA REKAPITULASI HASIL PENGHITUNGAN SUARA'}
          </div>
          <div style={{ fontSize: '11pt', fontWeight: 'bold', marginTop: '4px' }}>
            {settings.reportSubtitle || 'PEMILIHAN KETUA DAN WAKIL KETUA OSIS TAHUN 2026'}
          </div>
          <div style={{ fontSize: '10pt', marginTop: '2px', fontWeight: '500' }}>
            {formatDocNumber(settings.reportDocNumber)}
          </div>
        </div>

        {/* NARASI PEMBUKA */}
        <div style={{ fontSize: '11pt', lineHeight: '1.6', textAlign: 'justify', marginBottom: '1.5rem' }}>
          Pada hari ini, <strong>{settings.reportDay || 'Selasa'}</strong> tanggal <strong>{settings.reportDate || '8 September 2026'}</strong>, bertempat di <strong>{settings.tpsCode || 'TPS SMAN 1 Batu'}</strong>, telah dilaksanakan Rapat Pleno Terbuka Penghitungan dan Rekapitulasi Suara {settings.reportSubtitle || 'Pemilihan Ketua dan Wakil Ketua Organisasi Siswa Intra Sekolah (OSIS)'} {settings.schoolName || 'SMA Negeri 1 Batu'} Periode Masa Bakti {settings.period || '2026/2027'} secara langsung, umum, bebas, rahasia, jujur, dan adil (LUBER JURDIL) menggunakan sistem E-Voting Digital.
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
            <strong>MENETAPKAN:</strong> Berdasarkan perolehan suara terbanyak, Pasangan Calon Nomor Urut <strong>{winner.number}</strong> atas nama <strong>{winner.chairmanName}</strong> (sebagai Ketua OSIS) dan <strong>{winner.viceChairmanName}</strong> (sebagai Wakil Ketua OSIS) ditetapkan sebagai <strong>Ketua dan Wakil Ketua OSIS {settings.schoolName || 'SMA Negeri 1 Batu'} Terpilih Masa Bakti {settings.period || '2026/2027'}</strong>.
          </div>
        )}

        {/* KOLOM TANDA TANGAN RESMI (DINAMIS) */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ textAlign: 'right', marginBottom: '1.5rem', fontSize: '11pt' }}>
            {settings.reportCity || 'Kota Batu'}, {settings.reportDate || '8 September 2026'}
          </div>

          {/* Mengetahui & Menyetujui */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'center', fontSize: '10.5pt', marginBottom: '3rem' }}>
            <div>
              <div>Mengetahui,</div>
              <div style={{ fontWeight: 'bold', marginBottom: '4.5rem' }}>
                {settings.headmasterTitle || 'Kepala SMA Negeri 1 Batu'}
              </div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {settings.headmasterName || 'Anto Dwi Cahyono., S.Pd., M.M'}
              </div>
              <div>{formatNip(settings.headmasterNip, '19700415 199702 1 003')}</div>
            </div>

            <div>
              <div>Menyetujui,</div>
              <div style={{ fontWeight: 'bold', marginBottom: '4.5rem' }}>
                {settings.osisAdvisorTitle || 'Pembina OSIS SMAN 1 Batu'}
              </div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {settings.osisAdvisorName || 'Distri Adi Setiawan ., S.Pd., SS'}
              </div>
              <div>{formatNip(settings.osisAdvisorNip, '19740921 200212 1 005')}</div>
            </div>
          </div>

          {/* Ketua Panitia / MPK & Saksi-Saksi */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: settings.witness3Name ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center',
            fontSize: '10pt'
          }}>
            <div>
              <div style={{ marginBottom: '3.5rem' }}>
                {settings.committeeLeaderTitle || 'Ketua Panitia / MPK:'}
              </div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {settings.committeeLeaderName || 'Kurnia Ramadhan (Ketua MPK)'}
              </div>
              <div>{formatNis(settings.committeeLeaderNis, '20241098')}</div>
            </div>

            <div>
              <div style={{ marginBottom: '3.5rem' }}>
                {settings.witness1Title || 'Saksi Paslon 01:'}
              </div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {settings.witness1Name || 'Dimas Bagus Pratama'}
              </div>
              <div>{settings.witness1Role || 'Saksi Terdaftar'}</div>
            </div>

            <div>
              <div style={{ marginBottom: '3.5rem' }}>
                {settings.witness2Title || 'Saksi Paslon 02 & 03:'}
              </div>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {settings.witness2Name || 'Rizka Amalia Putri'}
              </div>
              <div>{settings.witness2Role || 'Saksi Terdaftar'}</div>
            </div>

            {settings.witness3Name && (
              <div>
                <div style={{ marginBottom: '3.5rem' }}>
                  {settings.witness3Title || 'Saksi Tambahan:'}
                </div>
                <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {settings.witness3Name}
                </div>
                <div>{settings.witness3Role || 'Saksi Terdaftar'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

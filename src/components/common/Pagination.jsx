import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 25,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100, 250],
  itemLabel = 'data'
}) {
  const [jumpPage, setJumpPage] = useState(currentPage);

  useEffect(() => {
    setJumpPage(currentPage);
  }, [currentPage]);

  // Rentang item yang sedang ditampilkan
  const isAll = pageSize === 'ALL';
  const fromItem = totalItems === 0 ? 0 : isAll ? 1 : (currentPage - 1) * pageSize + 1;
  const toItem = isAll ? totalItems : Math.min(currentPage * pageSize, totalItems);

  // Buat array nomor halaman dengan ellipsis pintar
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(jumpPage, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onPageChange(parsed);
    } else {
      setJumpPage(currentPage);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div className="pagination-wrapper">
      {/* Kiri: Info data aktif */}
      <div className="pagination-info">
        <span>
          Menampilkan <strong>{fromItem}</strong> - <strong>{toItem}</strong> dari <strong>{totalItems}</strong> {itemLabel}
        </span>
        {totalPages > 1 && !isAll && (
          <span className="pagination-badge-page">
            Halaman {currentPage} dari {totalPages}
          </span>
        )}
      </div>

      {/* Kanan / Tengah: Kontrol Navigasi & Ukuran Halaman */}
      <div className="pagination-controls-group">
        {/* Pemilih Ukuran Halaman */}
        <div className="pagination-size-selector">
          <label htmlFor="pagination-page-size" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Per hal:
          </label>
          <select
            id="pagination-page-size"
            className="pagination-select"
            value={pageSize}
            onChange={(e) => {
              const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
              onPageSizeChange(val);
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="ALL">Semua</option>
          </select>
        </div>

        {/* Tombol Halaman (Hanya jika bukan opsi 'Semua' dan totalPages > 1) */}
        {!isAll && totalPages > 1 && (
          <div className="pagination-nav">
            {/* Tombol Pertama */}
            <button
              type="button"
              className="pagination-btn pagination-btn-nav"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              title="Halaman Pertama"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Tombol Sebelumnya */}
            <button
              type="button"
              className="pagination-btn pagination-btn-nav"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Tombol Angka Halaman */}
            <div className="pagination-pages-list">
              {getPageNumbers().map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                      ...
                    </span>
                  );
                }

                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`pagination-btn pagination-page-number ${isActive ? 'pagination-btn-active' : ''}`}
                    onClick={() => onPageChange(p)}
                    title={`Pindah ke Halaman ${p}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Tombol Berikutnya */}
            <button
              type="button"
              className="pagination-btn pagination-btn-nav"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              title="Halaman Berikutnya"
            >
              <ChevronRight size={16} />
            </button>

            {/* Tombol Terakhir */}
            <button
              type="button"
              className="pagination-btn pagination-btn-nav"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Halaman Terakhir"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        )}

        {/* Lompat ke Halaman Cepat (Jika halaman > 5) */}
        {!isAll && totalPages > 5 && (
          <form onSubmit={handleJumpSubmit} className="pagination-jump-form">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ke:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              className="pagination-jump-input"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              title={`Ketik 1 - ${totalPages} lalu tekan Enter`}
            />
          </form>
        )}
      </div>
    </div>
  );
}

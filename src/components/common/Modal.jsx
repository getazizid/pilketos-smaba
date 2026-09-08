import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = '650px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Tutup Modal"
        >
          <X size={20} />
        </button>

        {title && (
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>{title}</h3>
          </div>
        )}

        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

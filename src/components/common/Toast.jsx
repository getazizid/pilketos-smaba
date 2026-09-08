import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} color="var(--emerald)" />}
          {toast.type === 'error' && <AlertCircle size={20} color="var(--crimson)" />}
          {toast.type === 'info' && <Info size={20} color="var(--primary)" />}
          
          <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.4' }}>
            {toast.message}
          </div>

          <button 
            type="button"
            onClick={() => removeToast(toast.id)} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer' 
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

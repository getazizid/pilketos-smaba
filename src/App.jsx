import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ElectionProvider } from './context/ElectionContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { HelpModal } from './components/common/HelpModal';
import { BallotStation } from './components/voter/BallotStation';
import { AdminPanel } from './components/admin/AdminPanel';
import { QuickCountDisplay } from './components/public/QuickCountDisplay';

function MainApp() {
  const [currentView, setCurrentView] = useState('ballot'); // 'ballot', 'admin', 'projector'
  const [toasts, setToasts] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toast handler
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fullscreen Projector View (No Navbar/Footer)
  if (currentView === 'projector') {
    return (
      <>
        <QuickCountDisplay onBack={() => setCurrentView('ballot')} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main View Router */}
      <div className="main-content" style={{ padding: currentView === 'admin' ? 0 : '1.5rem 0 3rem' }}>
        {currentView === 'ballot' && (
          <BallotStation onAddToast={addToast} />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            onNavigateToProjector={() => setCurrentView('projector')}
            onNavigateToBallot={() => setCurrentView('ballot')}
            onAddToast={addToast}
          />
        )}
      </div>

      {/* Footer */}
      {currentView !== 'admin' && <Footer />}

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <MainApp />
      </ElectionProvider>
    </AuthProvider>
  );
}

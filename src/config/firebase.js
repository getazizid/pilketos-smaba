import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cek konfigurasi dari localStorage (jika diinput via Admin UI) atau dari .env
const getActiveFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem('pilketos_firebase_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca custom Firebase config dari localStorage:', e);
  }

  // Fallback ke Vite Environment Variables
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
};

export const activeConfig = getActiveFirebaseConfig();
export const isFirebaseConfigured = Boolean(activeConfig.apiKey && activeConfig.projectId);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
    db = getFirestore(app);
    console.log('Firebase Cloud Firestore berhasil diinisialisasi (Spark Free Plan).');
  } catch (error) {
    console.error('Inisialisasi Firebase gagal:', error);
  }
} else {
  console.info('Aplikasi berjalan dalam Mode Data Demo/Lokal (Offline Ready).');
}

export { app, db };

export function saveFirebaseCustomConfig(newConfig) {
  if (!newConfig) {
    localStorage.removeItem('pilketos_firebase_config');
  } else {
    localStorage.setItem('pilketos_firebase_config', JSON.stringify(newConfig));
  }
  window.location.reload();
}

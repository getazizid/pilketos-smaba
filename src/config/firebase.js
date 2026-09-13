import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDPSA8eSDfz2q9dmPlCgVpu549aZGcSMOo",
  authDomain: "pilketos-smaba-2026.firebaseapp.com",
  projectId: "pilketos-smaba-2026",
  storageBucket: "pilketos-smaba-2026.firebasestorage.app",
  messagingSenderId: "605828150570",
  appId: "1:605828150570:web:50c88aab0d8100fd4c9a53",
  measurementId: "G-4PX62G9G89"
};

// Cek konfigurasi dari localStorage (jika diinput via Admin UI) atau dari .env / default
const getActiveFirebaseConfig = () => {
  try {
    const savedConfig = localStorage.getItem('pilketos_firebase_config');
    if (savedConfig) {
      if (savedConfig === 'offline') {
        return { apiKey: '', projectId: '' };
      }
      const parsed = JSON.parse(savedConfig);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal membaca custom Firebase config dari localStorage:', e);
  }

  // Fallback ke Vite Environment Variables atau Project Config Resmi
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId
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
    localStorage.setItem('pilketos_firebase_config', 'offline');
  } else {
    localStorage.setItem('pilketos_firebase_config', JSON.stringify(newConfig));
  }
  window.location.reload();
}

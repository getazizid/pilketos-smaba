import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_STUDENTS, 
  INITIAL_SETTINGS, 
  INITIAL_USERS 
} from '../config/initialData';
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc, 
  increment, 
  setDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

const ElectionContext = createContext();

export function ElectionProvider({ children }) {
  // 1. Candidates State
  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('pilketos_candidates_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('pilketos_candidates');
      return INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  // 2. Students (DPT) State
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('pilketos_students_v2');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('pilketos_students');
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // 3. Election Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('pilketos_settings_v4');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('pilketos_settings_v3');
      localStorage.removeItem('pilketos_settings_v2');
      localStorage.removeItem('pilketos_settings');
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 4. Admin / Operator Users State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('pilketos_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // 5. Activity Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('pilketos_audit_logs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'log-init',
          timestamp: new Date().toISOString(),
          message: 'Sistem Pemilihan OSIS SMAN 1 Batu 2026 siap beroperasi.',
          type: 'INFO'
        }
      ];
    } catch {
      return [];
    }
  });

  // Sinkronisasi lokal ke localStorage jika Firebase tidak aktif
  useEffect(() => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('pilketos_candidates_v2', JSON.stringify(candidates));
    }
  }, [candidates]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('pilketos_students_v2', JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('pilketos_settings_v4', JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('pilketos_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('pilketos_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Firebase Real-time listeners (jika Firebase dikonfigurasi)
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    // Listen to Candidates
    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCandidates(loaded.sort((a, b) => a.number - b.number));
      }
    }, (err) => console.warn('Firestore candidates listener:', err));

    // Listen to Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (err) => console.warn('Firestore settings listener:', err));

    // Listen to Students
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudents(loaded);
      }
    }, (err) => console.warn('Firestore students listener:', err));

    return () => {
      unsubCandidates();
      unsubSettings();
      unsubStudents();
    };
  }, []);

  // Helper untuk menambah log
  const addLog = (message, type = 'INFO') => {
    const newLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      message,
      type
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // PENCATATAN SUARA (VOTING TRANSACTION)
  // Menjaga Asas Kerahasiaan Suara (Secret Ballot)
  const submitVote = async (studentId, candidateId) => {
    const timestamp = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        // 1. Update status siswa (tidak menyimpan siapa yang dipilih)
        await updateDoc(doc(db, 'students', studentId), {
          hasVoted: true,
          votedAt: serverTimestamp()
        });

        // 2. Increment perolehan suara paslon secara atomic
        await updateDoc(doc(db, 'candidates', candidateId), {
          voteCount: increment(1)
        });
      } catch (err) {
        console.error('Error saat submitVote di Firebase:', err);
      }
    }

    // Update state lokal
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, hasVoted: true, votedAt: timestamp };
      }
      return s;
    }));

    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return { ...c, voteCount: (c.voteCount || 0) + 1 };
      }
      return c;
    }));

    addLog(`1 hak suara sah berhasil dicoblos di TPS.`, 'SUCCESS');
    return { success: true, timestamp };
  };

  // Manajemen Kandidat
  const addCandidate = async (newCandidate) => {
    const id = 'paslon-' + Date.now();
    const candidateData = { ...newCandidate, id, voteCount: 0 };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'candidates', id), candidateData);
    }
    setCandidates(prev => [...prev, candidateData]);
    addLog(`Pasangan Calon No. ${candidateData.number} (${candidateData.chairmanName} & ${candidateData.viceChairmanName}) ditambahkan.`, 'INFO');
  };

  const updateCandidate = async (id, updatedFields) => {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'candidates', id), updatedFields);
    }
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    addLog(`Data Paslon berhasil diperbarui.`, 'INFO');
  };

  const deleteCandidate = async (id) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'candidates', id));
    }
    setCandidates(prev => prev.filter(c => c.id !== id));
    addLog(`Pasangan Calon telah dihapus dari sistem.`, 'WARNING');
  };

  // Manajemen Siswa (DPT)
  const addStudent = async (studentData) => {
    const id = 'std-' + Date.now();
    const fullData = { ...studentData, id, hasVoted: false, votedAt: null };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'students', id), fullData);
    }
    setStudents(prev => [fullData, ...prev]);
    addLog(`Siswa DPT baru ditambahkan: ${fullData.name} (${fullData.nisn}).`, 'INFO');
  };

  const addBulkStudents = (bulkList) => {
    const formatted = bulkList.map((s, idx) => ({
      ...s,
      id: s.id || `std-bulk-${Date.now()}-${idx}`,
      hasVoted: false,
      votedAt: null
    }));
    setStudents(prev => [...formatted, ...prev]);
    addLog(`Berhasil mengimpor ${formatted.length} siswa DPT.`, 'SUCCESS');
  };

  const deleteStudent = async (id) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'students', id));
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    addLog(`Data siswa DPT dihapus.`, 'WARNING');
  };

  const resetStudentVote = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, hasVoted: false, votedAt: null } : s));
    addLog(`Hak pilih siswa di-reset oleh Admin.`, 'WARNING');
  };

  // Pengaturan Pemilu
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'main'), merged);
    }
    setSettings(merged);
    addLog(`Pengaturan pemilihan diperbarui (Status: ${merged.status}).`, 'INFO');
  };

  // Reset Semua Suara (Darurat/Simulasi Baru)
  const resetAllVotes = () => {
    setCandidates(prev => prev.map(c => ({ ...c, voteCount: 0 })));
    setStudents(prev => prev.map(s => ({ ...s, hasVoted: false, votedAt: null })));
    addLog('Semua perolehan suara dan status pemilih telah di-reset ke angka 0.', 'DANGER');
  };

  // Manajemen Hak Akses / Users
  const addUser = (userData) => {
    const id = 'user-' + Date.now();
    setUsers(prev => [...prev, { ...userData, id }]);
    addLog(`Akun baru (${userData.username} - ${userData.role}) ditambahkan.`, 'INFO');
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog(`Akun staf dihapus.`, 'WARNING');
  };

  // Statistik Real-time
  const totalDpt = students.length;
  const totalVotes = candidates.reduce((acc, c) => acc + (c.voteCount || 0), 0);
  const participationPercentage = totalDpt > 0 ? ((totalVotes / totalDpt) * 100).toFixed(1) : 0;
  const totalUnvoted = Math.max(0, totalDpt - totalVotes);

  return (
    <ElectionContext.Provider
      value={{
        candidates,
        students,
        settings,
        users,
        auditLogs,
        totalDpt,
        totalVotes,
        participationPercentage,
        totalUnvoted,
        submitVote,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        addStudent,
        addBulkStudents,
        deleteStudent,
        resetStudentVote,
        updateSettings,
        resetAllVotes,
        addUser,
        deleteUser,
        addLog
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(ElectionContext);
}

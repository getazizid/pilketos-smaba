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
  getDocs,
  updateDoc, 
  increment, 
  setDoc, 
  deleteDoc,
  writeBatch,
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
      if (saved !== null) return JSON.parse(saved);
      localStorage.removeItem('pilketos_students');
      if (!isFirebaseConfigured) return INITIAL_STUDENTS;
      return [];
    } catch {
      return [];
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
    localStorage.setItem('pilketos_students_v2', JSON.stringify(students));
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

    // 1. Listen to Candidates
    const unsubCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setCandidates(loaded.sort((a, b) => a.number - b.number));
      }
    }, (err) => console.warn('Firestore candidates listener:', err));

    // 2. Listen to Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    }, (err) => console.warn('Firestore settings listener:', err));

    // 3. Listen to Students
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudents(loaded);
      localStorage.setItem('pilketos_students_v2', JSON.stringify(loaded));
    }, (err) => console.warn('Firestore students listener:', err));

    // 4. Listen to Users (Staff/Operators)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(loaded);
      }
    }, (err) => console.warn('Firestore users listener:', err));

    // 5. Listen to Audit Logs
    const unsubLogs = onSnapshot(collection(db, 'audit_logs'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setAuditLogs(loaded.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100));
      }
    }, (err) => console.warn('Firestore audit_logs listener:', err));

    return () => {
      unsubCandidates();
      unsubSettings();
      unsubStudents();
      unsubUsers();
      unsubLogs();
    };
  }, []);

  // Helper untuk menambah log
  const addLog = async (message, type = 'INFO') => {
    const newLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      message,
      type
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'audit_logs', newLog.id), newLog, { merge: true });
      } catch (err) {
        console.warn('Gagal simpan audit log ke Firestore:', err);
      }
    }

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
    const id = newCandidate.id || 'paslon-' + (newCandidate.number || Date.now());
    const candidateData = { ...newCandidate, id, voteCount: Number(newCandidate.voteCount) || 0 };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'candidates', id), candidateData, { merge: true });
        console.log(`[Firestore] Paslon ${id} berhasil ditambahkan ke cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal tambah paslon di Firestore:', err);
      }
    }
    setCandidates(prev => {
      const exists = prev.some(c => c.id === id);
      if (exists) return prev.map(c => c.id === id ? candidateData : c);
      return [...prev, candidateData];
    });
    addLog(`Pasangan Calon No. ${candidateData.number} (${candidateData.chairmanName} & ${candidateData.viceChairmanName}) ditambahkan.`, 'INFO');
  };

  const updateCandidate = async (id, updatedFields) => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'candidates', id), updatedFields, { merge: true });
        console.log(`[Firestore] Paslon ${id} berhasil diperbarui di cloud:`, updatedFields);
      } catch (err) {
        console.error('[Firestore] Gagal update paslon di Firestore:', err);
      }
    }
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    addLog(`Data Paslon berhasil diperbarui.`, 'INFO');
  };

  const deleteCandidate = async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'candidates', id));
        console.log(`[Firestore] Paslon ${id} berhasil dihapus dari cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal hapus paslon di Firestore:', err);
      }
    }
    setCandidates(prev => prev.filter(c => c.id !== id));
    addLog(`Pasangan Calon telah dihapus dari sistem.`, 'WARNING');
  };

  // Manajemen Siswa (DPT)
  const addStudent = async (studentData) => {
    const id = studentData.id || 'std-' + Date.now();
    const fullData = { ...studentData, id, hasVoted: false, votedAt: null };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', id), fullData, { merge: true });
        console.log(`[Firestore] Siswa ${id} berhasil disimpan ke cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal simpan siswa di Firestore:', err);
      }
    }
    setStudents(prev => [fullData, ...prev]);
    addLog(`Siswa DPT baru ditambahkan: ${fullData.name} (${fullData.nisn}).`, 'INFO');
  };

  const updateStudent = async (id, updatedFields) => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', id), updatedFields, { merge: true });
        console.log(`[Firestore] Siswa ${id} berhasil diupdate di cloud:`, updatedFields);
      } catch (err) {
        console.error('[Firestore] Gagal update siswa di Firestore:', err);
      }
    }
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    addLog(`Data pemilih diperbarui.`, 'INFO');
  };

  const addBulkStudents = async (bulkList) => {
    const formatted = bulkList.map((s, idx) => ({
      ...s,
      id: s.id || `std-bulk-${Date.now()}-${idx}`,
      hasVoted: false,
      votedAt: null
    }));

    if (isFirebaseConfigured && db) {
      try {
        const chunkSize = 400;
        for (let i = 0; i < formatted.length; i += chunkSize) {
          const chunk = formatted.slice(i, i + chunkSize);
          const batch = writeBatch(db);
          chunk.forEach((student) => {
            const docRef = doc(db, 'students', student.id);
            batch.set(docRef, student, { merge: true });
          });
          await batch.commit();
        }
        console.log(`[Firestore] ${formatted.length} siswa DPT berhasil disimpan massal ke cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal menyimpan batch siswa ke Firestore:', err);
      }
    }

    setStudents(prev => [...formatted, ...prev]);
    addLog(`Berhasil mengimpor ${formatted.length} siswa DPT.`, 'SUCCESS');
  };

  const deleteStudent = async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'students', id));
        console.log(`[Firestore] Siswa ${id} dihapus dari cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal hapus siswa di Firestore:', err);
      }
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    addLog(`Data siswa DPT dihapus.`, 'WARNING');
  };

  const deleteBulkStudents = async (studentIds) => {
    if (!studentIds || studentIds.length === 0) return;

    if (isFirebaseConfigured && db) {
      try {
        const chunkSize = 400;
        for (let i = 0; i < studentIds.length; i += chunkSize) {
          const chunk = studentIds.slice(i, i + chunkSize);
          const batch = writeBatch(db);
          chunk.forEach((id) => {
            batch.delete(doc(db, 'students', id));
          });
          await batch.commit();
        }
        console.log(`[Firestore] ${studentIds.length} siswa berhasil dihapus secara massal dari cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal hapus massal siswa di Firestore:', err);
      }
    }

    const idSet = new Set(studentIds);
    setStudents(prev => prev.filter(s => !idSet.has(s.id)));
    addLog(`${studentIds.length} siswa DPT terpilih telah dihapus massal.`, 'WARNING');
  };

  const deleteAllStudents = async () => {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'students'));
        const docIds = snap.docs.map(d => d.id);
        const chunkSize = 400;
        for (let i = 0; i < docIds.length; i += chunkSize) {
          const chunk = docIds.slice(i, i + chunkSize);
          const batch = writeBatch(db);
          chunk.forEach((id) => {
            batch.delete(doc(db, 'students', id));
          });
          await batch.commit();
        }
        console.log(`[Firestore] Seluruh ${docIds.length} siswa DPT berhasil dikosongkan dari cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal kosongkan siswa di Firestore:', err);
      }
    }

    setStudents([]);
    localStorage.setItem('pilketos_students_v2', JSON.stringify([]));
    addLog('Seluruh data DPT siswa telah dikosongkan oleh Admin.', 'DANGER');
  };

  const resetStudentVote = async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', id), {
          hasVoted: false,
          votedAt: null
        }, { merge: true });
        console.log(`[Firestore] Status suara siswa ${id} di-reset di cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal reset vote siswa di Firestore:', err);
      }
    }
    setStudents(prev => prev.map(s => s.id === id ? { ...s, hasVoted: false, votedAt: null } : s));
    addLog(`Hak pilih siswa di-reset oleh Admin.`, 'WARNING');
  };

  // Pengaturan Pemilu
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'main'), merged, { merge: true });
        console.log(`[Firestore] Pengaturan pemilu berhasil disimpan ke cloud:`, merged);
      } catch (err) {
        console.error('[Firestore] Gagal simpan settings ke Firestore:', err);
      }
    }
    setSettings(merged);
    addLog(`Pengaturan pemilihan diperbarui (Status: ${merged.status}).`, 'INFO');
  };

  // Reset Semua Suara (Darurat/Simulasi Baru)
  const resetAllVotes = async () => {
    if (isFirebaseConfigured && db) {
      try {
        // Reset candidates
        const candBatch = writeBatch(db);
        candidates.forEach((c) => {
          candBatch.update(doc(db, 'candidates', c.id), { voteCount: 0 });
        });
        await candBatch.commit();

        // Reset students yang sudah memilih
        const votedStudents = students.filter(s => s.hasVoted);
        const chunkSize = 400;
        for (let i = 0; i < votedStudents.length; i += chunkSize) {
          const chunk = votedStudents.slice(i, i + chunkSize);
          const batch = writeBatch(db);
          chunk.forEach((s) => {
            batch.update(doc(db, 'students', s.id), {
              hasVoted: false,
              votedAt: null
            });
          });
          await batch.commit();
        }
        console.log('[Firestore] Seluruh perolehan suara berhasil di-reset ke 0 di cloud.');
      } catch (err) {
        console.error('[Firestore] Gagal reset suara di Firestore:', err);
      }
    }

    setCandidates(prev => prev.map(c => ({ ...c, voteCount: 0 })));
    setStudents(prev => prev.map(s => ({ ...s, hasVoted: false, votedAt: null })));
    addLog('Semua perolehan suara dan status pemilih telah di-reset ke angka 0.', 'DANGER');
  };

  // Inisialisasi / Upload Data Awal ke Firestore jika baru dibuat
  const seedInitialDataToFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      return { success: false, message: 'Firebase belum terhubung' };
    }
    try {
      // 1. Upload settings
      await setDoc(doc(db, 'settings', 'main'), settings, { merge: true });

      // 2. Upload candidates
      const candBatch = writeBatch(db);
      candidates.forEach((c) => {
        candBatch.set(doc(db, 'candidates', c.id), c, { merge: true });
      });
      await candBatch.commit();

      // 3. Upload users
      const userBatch = writeBatch(db);
      users.forEach((u) => {
        userBatch.set(doc(db, 'users', u.id), u, { merge: true });
      });
      await userBatch.commit();

      // 4. Upload students
      const chunkSize = 400;
      for (let i = 0; i < students.length; i += chunkSize) {
        const chunk = students.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        chunk.forEach((s) => {
          batch.set(doc(db, 'students', s.id), s, { merge: true });
        });
        await batch.commit();
      }

      addLog('Data bawaan (Paslon, Pengaturan, Akun, DPT) berhasil diunggah ke Firestore Cloud.', 'SUCCESS');
      return { success: true };
    } catch (err) {
      console.error('Gagal unggah data ke Firestore:', err);
      return { success: false, error: err.message };
    }
  };

  // Manajemen Hak Akses / Users
  const addUser = async (userData) => {
    const id = userData.id || 'user-' + Date.now();
    const newUser = { ...userData, id };
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', id), newUser, { merge: true });
        console.log(`[Firestore] User ${id} berhasil ditambah di cloud:`, newUser);
      } catch (err) {
        console.error('[Firestore] Gagal tambah user di Firestore:', err);
      }
    }
    setUsers(prev => [...prev, newUser]);
    addLog(`Akun baru (${userData.username} - ${userData.role}) ditambahkan.`, 'INFO');
  };

  const updateUser = async (id, updatedFields) => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', id), updatedFields, { merge: true });
        console.log(`[Firestore] User ${id} berhasil diupdate di cloud:`, updatedFields);
      } catch (err) {
        console.error('[Firestore] Gagal update user di Firestore:', err);
      }
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
    addLog(`Data akun staf diperbarui.`, 'INFO');
  };

  const deleteUser = async (id) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'users', id));
        console.log(`[Firestore] User ${id} berhasil dihapus di cloud.`);
      } catch (err) {
        console.error('[Firestore] Gagal hapus user di Firestore:', err);
      }
    }
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
        updateStudent,
        addBulkStudents,
        deleteStudent,
        deleteBulkStudents,
        deleteAllStudents,
        resetStudentVote,
        updateSettings,
        resetAllVotes,
        addUser,
        updateUser,
        deleteUser,
        addLog,
        seedInitialDataToFirestore
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(ElectionContext);
}

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
  increment, 
  setDoc, 
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  runTransaction 
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
      if (saved) return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
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
      localStorage.removeItem('pilketos_users');
      const saved = localStorage.getItem('pilketos_users_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(u => ({
            password: u.username === 'admin' ? 'osis2026' : '123456',
            ...u
          }));
        }
      }
      return INITIAL_USERS;
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
    localStorage.setItem('pilketos_users_v3', JSON.stringify(users));
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
        setSettings({ ...INITIAL_SETTINGS, ...docSnap.data() });
      }
    }, (err) => console.warn('Firestore settings listener:', err));

    // 3. Listen to Students
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudents(loaded);
        localStorage.setItem('pilketos_students_v2', JSON.stringify(loaded));
      }
    }, (err) => console.warn('Firestore students listener:', err.message || err));

    // 4. Listen to Users (Staff/Operators)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(loaded);
        localStorage.setItem('pilketos_users_v3', JSON.stringify(loaded));
      } else if (snapshot.empty && isFirebaseConfigured && db) {
        // Jika di Firestore masih kosong, unggah admin utama
        const defaultAdmin = INITIAL_USERS[0];
        setDoc(doc(db, 'users', defaultAdmin.id), defaultAdmin, { merge: true });
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

  // Sinkronisasi antrean suara offline saat online
  useEffect(() => {
    const syncOfflineVotes = async () => {
      if (!isFirebaseConfigured || !db) return;
      try {
        const queueRaw = localStorage.getItem('pilketos_offline_votes');
        if (!queueRaw) return;
        const queue = JSON.parse(queueRaw);
        if (!Array.isArray(queue) || queue.length === 0) return;

        console.log(`[Sync] Menemukan ${queue.length} suara offline, mencoba sinkronisasi ke cloud...`);
        const remaining = [];
        for (const item of queue) {
          try {
            const studentRef = doc(db, 'students', item.studentId);
            const candRef = doc(db, 'candidates', item.candidateId);

            await updateDoc(studentRef, {
              hasVoted: true,
              votedAt: serverTimestamp()
            }).catch(async () => {
              await setDoc(studentRef, { hasVoted: true, votedAt: serverTimestamp() }, { merge: true });
            });

            await updateDoc(candRef, {
              voteCount: increment(1)
            }).catch(async () => {
              await setDoc(candRef, { id: item.candidateId, voteCount: increment(1) }, { merge: true });
            });
          } catch (syncErr) {
            remaining.push(item);
          }
        }

        if (remaining.length === 0) {
          localStorage.removeItem('pilketos_offline_votes');
          console.log('[Sync] Seluruh suara offline berhasil disinkronkan ke cloud.');
        } else {
          localStorage.setItem('pilketos_offline_votes', JSON.stringify(remaining));
        }
      } catch (err) {
        console.warn('Sync offline votes error:', err);
      }
    };

    syncOfflineVotes();
    window.addEventListener('online', syncOfflineVotes);
    const interval = setInterval(syncOfflineVotes, 30000);
    return () => {
      window.removeEventListener('online', syncOfflineVotes);
      clearInterval(interval);
    };
  }, []);

  // PENCATATAN SUARA (VOTING TRANSACTION)
  // Menjaga Asas Kerahasiaan Suara (Secret Ballot) & Asas Jujur Adil (Anti Double-Vote)
  const submitVote = async (studentId, candidateId) => {
    const timestamp = new Date().toISOString();

    // 1. Verifikasi integritas pemilih di state lokal terlebih dahulu
    const localStudent = students.find(s => s.id === studentId || s.nisn === studentId);
    if (localStudent && localStudent.hasVoted) {
      throw new Error(`Hak suara atas nama ${localStudent.name} sudah pernah digunakan.`);
    }

    const targetStudentId = localStudent ? localStudent.id : studentId;

    // 2. Pencatatan ke Cloud Firestore (Multi-tier: Atomic Transaction -> Direct Write Fallback -> Offline Queue)
    if (isFirebaseConfigured && db) {
      let cloudSucceeded = false;

      // Percobaan 1: Menggunakan Atomic Transaction (Ideal jika kuota baca Firestore tersedia)
      try {
        await runTransaction(db, async (transaction) => {
          const studentRef = doc(db, 'students', targetStudentId);
          const studentSnap = await transaction.get(studentRef);

          if (studentSnap.exists() && studentSnap.data().hasVoted) {
            throw new Error('Hak suara atas pemilih ini sudah pernah digunakan.');
          }

          const candRef = doc(db, 'candidates', candidateId);
          const candSnap = await transaction.get(candRef);
          if (!candSnap.exists()) {
            throw new Error('Pasangan calon tidak ditemukan.');
          }

          transaction.update(studentRef, {
            hasVoted: true,
            votedAt: serverTimestamp()
          });

          transaction.update(candRef, {
            voteCount: increment(1)
          });
        });
        cloudSucceeded = true;
        console.log('[Firestore] Suara berhasil dicatat via Atomic Transaction.');
      } catch (txErr) {
        // Jika error bahwa hak suara memang sudah pernah dicoblos, hentikan proses
        if (txErr.message && txErr.message.includes('sudah pernah digunakan')) {
          throw txErr;
        }

        console.warn('runTransaction dialihkan ke fallback direct write (kuota baca harian habis/offline):', txErr.message);

        // Percobaan 2: Fallback Direct Write (tetap berhasil meski kuota baca Firestore habis / RESOURCE_EXHAUSTED)
        try {
          const studentRef = doc(db, 'students', targetStudentId);
          const candRef = doc(db, 'candidates', candidateId);

          // Update data pemilih
          try {
            await updateDoc(studentRef, {
              hasVoted: true,
              votedAt: serverTimestamp()
            });
          } catch (updateStudentErr) {
            const studentPayload = localStudent || { id: targetStudentId };
            await setDoc(studentRef, {
              ...studentPayload,
              hasVoted: true,
              votedAt: serverTimestamp()
            }, { merge: true });
          }

          // Update perolehan suara paslon secara atomic
          try {
            await updateDoc(candRef, {
              voteCount: increment(1)
            });
          } catch (updateCandErr) {
            await setDoc(candRef, {
              id: candidateId,
              voteCount: increment(1)
            }, { merge: true });
          }

          cloudSucceeded = true;
          console.log('[Firestore] Suara berhasil dicatat via Fallback Direct Write.');
        } catch (directErr) {
          console.error('[Firestore] Direct write cloud juga gagal (koneksi offline):', directErr);
          // Percobaan 3: Simpan ke antrean offline lokal agar suara pemilih TIDAK HILANG
          try {
            const offlineQueue = JSON.parse(localStorage.getItem('pilketos_offline_votes') || '[]');
            offlineQueue.push({ studentId: targetStudentId, candidateId, timestamp });
            localStorage.setItem('pilketos_offline_votes', JSON.stringify(offlineQueue));
            console.warn('[Offline Mode] Suara berhasil diamankan di antrean offline lokal.');
          } catch (queueErr) {
            console.error('Gagal mencatat antrean offline:', queueErr);
          }
        }
      }
    }

    // 3. SELALU perbarui State Lokal & LocalStorage
    // Menjamin UI bilik suara segera menampilkan struk, quick count & DPT terupdate instan
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === targetStudentId || s.id === studentId || (localStudent && s.nisn === localStudent.nisn)) {
          return { ...s, hasVoted: true, votedAt: timestamp };
        }
        return s;
      });
      localStorage.setItem('pilketos_students_v2', JSON.stringify(updated));
      return updated;
    });

    setCandidates(prev => {
      const updated = prev.map(c => {
        if (c.id === candidateId) {
          return { ...c, voteCount: (c.voteCount || 0) + 1 };
        }
        return c;
      });
      localStorage.setItem('pilketos_candidates_v2', JSON.stringify(updated));
      return updated;
    });

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

  // Manajemen Siswa & Pemilih (DPT)
  const addStudent = async (studentData) => {
    const id = studentData.id || 'std-' + Date.now();
    const fullData = { 
      ...studentData, 
      id, 
      voterType: studentData.voterType || 'SISWA',
      hasVoted: false, 
      votedAt: null 
    };

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
      voterType: s.voterType || 'SISWA',
      hasVoted: s.hasVoted || false,
      votedAt: s.votedAt || null
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
    addLog('Seluruh data DPT pemilih (Siswa, Guru, Tendik) telah dikosongkan oleh Admin.', 'DANGER');
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
    setUsers(prev => {
      const updated = prev.map(u => (u.id === id || u.username === id) ? { ...u, ...updatedFields } : u);
      localStorage.setItem('pilketos_users_v3', JSON.stringify(updated));
      return updated;
    });
    addLog(`Data akun staf (${updatedFields.name || id}) diperbarui.`, 'INFO');
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
    setUsers(prev => {
      const updated = prev.filter(u => u.id !== id && u.username !== id);
      localStorage.setItem('pilketos_users_v3', JSON.stringify(updated));
      return updated;
    });
    addLog(`Akun staf dihapus permanen.`, 'WARNING');
  };

  // Statistik Real-time
  const totalDpt = students.length;
  const totalVotedStudents = students.filter(s => s.hasVoted).length;
  const totalVotes = candidates.reduce((acc, c) => acc + (c.voteCount || 0), 0);
  const isTallyValid = totalVotes === totalVotedStudents;
  const participationPercentage = totalDpt > 0 ? ((totalVotes / totalDpt) * 100).toFixed(1) : 0;
  const totalUnvoted = Math.max(0, totalDpt - totalVotes);

  // Breakdown per kategori pemilih (Siswa, Guru, Tenaga Kependidikan)
  const totalSiswa = students.filter(s => (s.voterType || 'SISWA') === 'SISWA').length;
  const totalGuru = students.filter(s => s.voterType === 'GURU').length;
  const totalTendik = students.filter(s => s.voterType === 'TENDIK').length;
  const dptBreakdown = {
    siswa: totalSiswa,
    guru: totalGuru,
    tendik: totalTendik
  };

  // Breakdown pemilih yang sudah menggunakan hak suara
  const votedBreakdown = {
    siswa: students.filter(s => s.hasVoted && (s.voterType || 'SISWA') === 'SISWA').length,
    guru: students.filter(s => s.hasVoted && s.voterType === 'GURU').length,
    tendik: students.filter(s => s.hasVoted && s.voterType === 'TENDIK').length
  };

  // Breakdown pemilih yang belum menggunakan hak suara
  const unvotedBreakdown = {
    siswa: students.filter(s => !s.hasVoted && (s.voterType || 'SISWA') === 'SISWA').length,
    guru: students.filter(s => !s.hasVoted && s.voterType === 'GURU').length,
    tendik: students.filter(s => !s.hasVoted && s.voterType === 'TENDIK').length
  };

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
        totalVotedStudents,
        isTallyValid,
        participationPercentage,
        totalUnvoted,
        totalSiswa,
        totalGuru,
        totalTendik,
        dptBreakdown,
        votedBreakdown,
        unvotedBreakdown,
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

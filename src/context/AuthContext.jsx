import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Siswa yang sedang login di bilik suara
  const [currentVoter, setCurrentVoter] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pilketos_voter');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User staf/admin yang sedang login di dashboard admin
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pilketos_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Siswa menggunakan NISN & Token
  const loginVoter = (student) => {
    setCurrentVoter(student);
    sessionStorage.setItem('pilketos_voter', JSON.stringify(student));
  };

  const logoutVoter = () => {
    setCurrentVoter(null);
    sessionStorage.removeItem('pilketos_voter');
  };

  // Login Staf / Admin
  const loginAdmin = (user) => {
    setAdminUser(user);
    sessionStorage.setItem('pilketos_admin_user', JSON.stringify(user));
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    sessionStorage.removeItem('pilketos_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentVoter,
        loginVoter,
        logoutVoter,
        adminUser,
        loginAdmin,
        logoutAdmin,
        isAuthenticatedAdmin: Boolean(adminUser),
        userRole: adminUser ? adminUser.role : null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

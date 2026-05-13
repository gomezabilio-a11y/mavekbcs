import React, { createContext, useContext, useState, useCallback } from "react";

export type AdminRole = "master" | "staff";

export interface AdminSessionUser {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
}

interface AdminContextValue {
  adminToken: string | null;
  adminUser: AdminSessionUser | null;
  setAdminSession: (token: string, user: AdminSessionUser) => void;
  clearAdminSession: () => void;
  isAdminAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextValue>({
  adminToken: null,
  adminUser: null,
  setAdminSession: () => {},
  clearAdminSession: () => {},
  isAdminAuthenticated: false,
});

const ADMIN_TOKEN_KEY = "mavek_admin_token";
const ADMIN_USER_KEY = "mavek_admin_user";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY)
  );
  const [adminUser, setAdminUser] = useState<AdminSessionUser | null>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const setAdminSession = useCallback((token: string, user: AdminSessionUser) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    setAdminToken(token);
    setAdminUser(user);
  }, []);

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdminToken(null);
    setAdminUser(null);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminToken,
        adminUser,
        setAdminSession,
        clearAdminSession,
        isAdminAuthenticated: !!adminToken && !!adminUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminSession() {
  return useContext(AdminContext);
}

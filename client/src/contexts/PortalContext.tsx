import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { PortalLang } from "@/lib/portalI18n";

interface PortalSessionUser {
  id: number;
  username: string;
  companyName: string;
  language: PortalLang;
  timezone: string;
}

interface PortalContextValue {
  portalToken: string | null;
  portalUser: PortalSessionUser | null;
  setSession: (token: string, user: PortalSessionUser) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
}

const PortalContext = createContext<PortalContextValue>({
  portalToken: null,
  portalUser: null,
  setSession: () => {},
  clearSession: () => {},
  isAuthenticated: false,
});

const STORAGE_KEY = "mavek_portal_token";
const USER_KEY = "mavek_portal_user";

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [portalToken, setPortalToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  );
  const [portalUser, setPortalUser] = useState<PortalSessionUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const setSession = useCallback((token: string, user: PortalSessionUser) => {
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setPortalToken(token);
    setPortalUser(user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    setPortalToken(null);
    setPortalUser(null);
  }, []);

  return (
    <PortalContext.Provider
      value={{
        portalToken,
        portalUser,
        setSession,
        clearSession,
        isAuthenticated: !!portalToken && !!portalUser,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortalSession() {
  return useContext(PortalContext);
}

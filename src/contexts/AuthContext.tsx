import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { RewardsRole } from '../types/RewardsRole';

interface AuthContextType {
  isAuthenticated: boolean;
  role: RewardsRole | null;
  token: string | null;
  login: (token: string, role: RewardsRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [role, setRole] = useState<RewardsRole | null>(() => {
    const savedRole = localStorage.getItem(ROLE_KEY);
    if (!savedRole) return null;
    try {
      return JSON.parse(savedRole) as RewardsRole;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;

  const login = (newToken: string, userRole: RewardsRole) => {
    setToken(newToken);
    setRole(userRole);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(ROLE_KEY, JSON.stringify(userRole));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  };

  useEffect(() => {
    function syncAuth(event: StorageEvent) {
      if (event.key === TOKEN_KEY) {
        setToken(event.newValue);
      }
      if (event.key === ROLE_KEY) {
        if (!event.newValue) {
          setRole(null);
          return;
        }
        try {
          const parsedRole = JSON.parse(event.newValue) as RewardsRole;
          setRole(parsedRole);
        } catch {
          setRole(null);
        }
      }
    }
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

import { createContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import type { RewardsRole } from '../types/RewardsRole';

interface User {
  name: string;
  email: string;
  role: RewardsRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial segura
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedToken || !storedUser) {
        clearAuth();
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.name || !parsedUser.email || !parsedUser.role) throw new Error();

        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        clearAuth();
      }
    };

    initializeAuth();
    setLoading(false);
  }, []);

  // Sincroniza entre pestañas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY || event.key === USER_KEY) {
        const newToken = localStorage.getItem(TOKEN_KEY);
        const newUserRaw = localStorage.getItem(USER_KEY);

        if (!newToken || !newUserRaw) {
          clearAuth();
          return;
        }

        try {
          const parsedUser = JSON.parse(newUserRaw);
          if (!parsedUser.name || !parsedUser.email || !parsedUser.role) throw new Error();

          setToken(newToken);
          setUser(parsedUser);
        } catch {
          clearAuth();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

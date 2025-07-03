import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
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

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

let broadcast: BroadcastChannel | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa canal
  if (!broadcast) {
    broadcast = new BroadcastChannel('auth_channel');
  }

  // Inicializa desde localStorage
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

  // Reacción a mensajes del canal
  useEffect(() => {
    const handleBroadcast = (event: MessageEvent) => {
      const { type, token: newToken, user: newUser } = event.data;

      if (type === 'login') {
        setToken(newToken);
        setUser(newUser);
      } else if (type === 'logout') {
        clearAuth();
      }
    };

    broadcast?.addEventListener('message', handleBroadcast);
    return () => broadcast?.removeEventListener('message', handleBroadcast);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    broadcast?.postMessage({ type: 'login', token: newToken, user: newUser });
  };

  const logout = () => {
    clearAuth();
    broadcast?.postMessage({ type: 'logout' });
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

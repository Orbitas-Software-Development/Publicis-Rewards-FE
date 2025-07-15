import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { RewardsRole } from '../types/RewardsRole';

interface User {
  id: number,
  employeeNumber: string,
  name: string;
  email: string;
  roles: RewardsRole[];
  activeRole: RewardsRole;
  profilePicture: string | null;
  isManager: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
  updateUserProfilePictureInAuth: (newPath: string) => void;
  updateUserRoles: (roles: RewardsRole[]) => void; 
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

let broadcast: BroadcastChannel | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  if (!broadcast) {
    broadcast = new BroadcastChannel('auth_channel');
  }

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedToken || !storedUser) {
        clearAuth();
        return;
      }

      try {
        const parsedUser: User = JSON.parse(storedUser);
        if (
          !parsedUser.name ||
          !parsedUser.email ||
          !Array.isArray(parsedUser.roles)
        ) {
          throw new Error('Invalid user');
        }

        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        clearAuth();
      }
    };

    initializeAuth();
    setLoading(false);
  }, []);

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

  const login = (newToken: string, newUser: Omit<User, 'activeRole'>) => {
  if (!newUser.roles || newUser.roles.length === 0) {
    throw new Error('El usuario no tiene roles asignados.');
  }

  const activeRole = newUser.roles[0];

  const userWithActiveRole: User = {
    ...newUser,
    activeRole,
  };

  setToken(newToken);
  setUser(userWithActiveRole);
  localStorage.setItem(TOKEN_KEY, newToken);
  localStorage.setItem(USER_KEY, JSON.stringify(userWithActiveRole));
  broadcast?.postMessage({
    type: 'login',
    token: newToken,
    user: userWithActiveRole,
  });
};

  const logout = () => {
    clearAuth();
    broadcast?.postMessage({ type: 'logout' });
  };

  const updateUserProfilePictureInAuth = (newPath: string) => {
    setUser(prev => {
      if (!prev) return prev;

      const updatedUser = { ...prev, profilePicture: newPath };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      broadcast?.postMessage({ type: 'login', token, user: updatedUser });

      return updatedUser;
    });
  };

    const updateUserRoles = (newRoles: RewardsRole[]) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser: User = {
        ...prev,
        roles: newRoles,
        activeRole: newRoles.find(r => r.name === prev.activeRole.name) ?? newRoles[0],
      };

      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      broadcast?.postMessage({ type: 'login', token, user: updatedUser });

      return updatedUser;
    });
  };



  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading, updateUserProfilePictureInAuth,updateUserRoles }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useAuth } from '../hooks/useAuth';

// Importa tus tipos
import type { AdminDashboardDto } from '../types/dashboard/AdminDashboardDto';
import type { ManagerDashboardDto } from '../types/dashboard/ManagerDashboardDto';
import type { CollaboratorDashboardDto } from '../types/dashboard/CollaboratorDashboardDto';


import {
  fetchAdminDashboard,
  fetchManagerDashboard,
  fetchCollaboratorDashboard,
} from '../services/dashboardService';

type DashboardData =
  | AdminDashboardDto
  | ManagerDashboardDto
  | CollaboratorDashboardDto
  | null;

interface DashboardContextType {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (user.activeRole.id === 1) {
        const dashboardData = await fetchAdminDashboard();
        setData(dashboardData);
      }
      else if (user.activeRole.id === 2) {
        const dashboardData = await fetchManagerDashboard(user.id);
        setData(dashboardData);
      }
      else if (user.activeRole.id === 3) {
        const dashboardData = await fetchCollaboratorDashboard(user.id);
        setData(dashboardData);
      } else {
        setData(null);
      }

      
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar el dashboard'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      refresh: fetchData,
    }),
    [data, loading, error, fetchData]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export { DashboardContext };

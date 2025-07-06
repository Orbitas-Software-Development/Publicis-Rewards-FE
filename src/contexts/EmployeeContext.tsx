// context/EmployeeContext.tsx
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { EmployeeDto } from '../types/Employee';
import {
  fetchAllEmployees,
  fetchTeamTree,
} from '../services/employeeService';
import { useAuth } from '../hooks/useAuth';

interface EmployeeContextType {
  employees: EmployeeDto[];
  team: EmployeeDto[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  loadTeamTree: () => void;
}

const EmployeeContext = createContext<EmployeeContextType>({} as EmployeeContextType);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [team, setTeam] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user || user.activeRole?.id !== 1) return;

    try {
      setLoading(true);
      const data = await fetchAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar empleados');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadTeamTree = useCallback(async () => {
    if (!user || user.activeRole?.id !== 2 || !user.employeeNumber) return;
    try {
      setLoading(true);
      const data = await fetchTeamTree(user.employeeNumber);
      setTeam(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar equipo');
    }finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.activeRole?.id === 1) {
      fetchData();
    }

    if (user?.activeRole?.id === 2 && user.employeeNumber) {
      loadTeamTree();
    }
  }, [user, fetchData, loadTeamTree]);

  const value = useMemo(
    () => ({
      employees,
      team,
      loading,
      error,
      refresh: fetchData,
      loadTeamTree,
    }),
    [employees, team, loading, error, fetchData, loadTeamTree]
  );

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export { EmployeeContext };

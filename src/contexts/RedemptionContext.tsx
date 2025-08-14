import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import type { RedemptionsHistoryDto } from '../types/RedemptionsHistoryDto';
import type {
  UserRedemptionHistoryDto,
} from '../types/UserRedemptionHistoryDto';
import {
  fetchAllRedemptionHistory,
  fetchUserRedemptionHistory,
  updateRedemptionStatus,
} from '../services/redemptionService';
import { useAuth } from '../hooks/useAuth';


interface RedemptionContextType {
  history: (RedemptionsHistoryDto | UserRedemptionHistoryDto)[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  updateStatus: (dto: { id: number; status: string, changedByUserId: number }) => Promise<string>;
}

const RedemptionContext = createContext<RedemptionContextType>({} as RedemptionContextType);

export function RedemptionProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<
    (RedemptionsHistoryDto | UserRedemptionHistoryDto)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (user.activeRole.id === 1) {
        const data = await fetchAllRedemptionHistory();
        setHistory(data);
      } else if (user.activeRole.id === 3) {
        const data = await fetchUserRedemptionHistory(user.id);
        setHistory(data);
      } else {
        setHistory([]);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar historial de canjes');
    } finally {
      setLoading(false);
    }
  }, [user]);

    const updateStatus = useCallback(
      async (dto: { id: number; status: string; changedByUserId: number }): Promise<string> => {
        try {
          const { data: updatedItem, message } = await updateRedemptionStatus(dto);
          
          setHistory(prev =>
            prev.map(item =>
              item.id === dto.id 
                ? { 
                    ...item, 
                    status: updatedItem.status, 
                    changedBy: updatedItem.changedBy,
                    changedAt: updatedItem.changedAt
                  }
                : item
            )
          );
          
          return message;
        } catch (err) {
          // Manejo de errores adecuado
          throw err instanceof Error ? err : new Error('Error al actualizar el estado');
        }
      },
      []
    );


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo(
    () => ({
      history,
      loading,
      error,
      refresh: fetchData,
      updateStatus,
    }),
    [history, loading, error, fetchData, updateStatus,]
  );

  return (
    <RedemptionContext.Provider value={value}>
      {children}
    </RedemptionContext.Provider>
  );
}

export { RedemptionContext };

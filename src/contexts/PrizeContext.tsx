import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import type { RewardsPrize } from '../types/RewardsPrize';
import {
  fetchAllPrizes,
  fetchPrizeById,
  createPrize,
  updatePrize,
  deletePrize,
  canRedeemPrize,
  redeemPrize,
} from '../services/prizeService';

interface PrizeContextType {
  prizes: RewardsPrize[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  create: (dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }) => Promise<string>;
  update: (id: number, dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Promise<RewardsPrize>;
  canRedeem: (id: number, userPoints: number) => Promise<boolean>;
  redeem: (id: number) => Promise<void>;
}


const PrizeContext = createContext<PrizeContextType>({} as PrizeContextType);

export function PrizeProvider({ children }: { children: ReactNode }) {
  const [prizes, setPrizes] = useState<RewardsPrize[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllPrizes();
      setPrizes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar premios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(
    async (dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }): Promise<string> => {
      const { data: created, message } = await createPrize(dto);
      setPrizes(prev => [...prev, created]);
      return message;
    },
    []
  );

  const update = useCallback(
    async (
      id: number,
      dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }
    ): Promise<void> => {
      const { path } = await updatePrize(id, dto);

      setPrizes(prev =>
        prev.map(prize =>
          prize.id === id
            ? {
                ...prize,
                ...dto,
                imageUrl: path ?? prize.imageUrl
              }
            : prize
        )
      );
    },
    []
  );



  const remove = useCallback(
    async (id: number): Promise<void> => {
      await deletePrize(id);
      setPrizes(prev => prev.filter(prize => prize.id !== id));
    },
    []
  );

  const getById = useCallback(async (id: number): Promise<RewardsPrize> => {
    return await fetchPrizeById(id);
  }, []);

  const canRedeem = useCallback(async (id: number, userPoints: number): Promise<boolean> => {
    return await canRedeemPrize(id, userPoints);
  }, []);

  const redeem = useCallback(async (id: number): Promise<void> => {
    await redeemPrize(id);
    await fetchData();
  }, [fetchData]);

  const value = useMemo(
    () => ({
      prizes,
      loading,
      error,
      refresh: fetchData,
      create,
      update,
      remove,
      getById,
      canRedeem,
      redeem,
    }),
    [prizes, loading, error, fetchData, create, update, remove, getById, canRedeem, redeem]
  );

  return (
    <PrizeContext.Provider value={value}>
      {children}
    </PrizeContext.Provider>
  );
}

export { PrizeContext };

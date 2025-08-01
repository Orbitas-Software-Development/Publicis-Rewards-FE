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
  redeemPrize,
  changePrizeStatus,
} from '../services/prizeService';
import type { RedeemPrizeDto } from '../types/ReddeemPrizeDto';

interface PrizeContextType {
  prizes: RewardsPrize[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  create: (dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }) => Promise<string>;
  update: (id: number, dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }) => Promise<void>;
  changeStatus: (dto: { id: number; isActive: boolean }) => Promise<string>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Promise<RewardsPrize>;
  redeem: (dto: RedeemPrizeDto) => Promise<string>;
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

  const changeStatus = useCallback(
      async (dto: { id: number; isActive: boolean }): Promise<string> => {
        const message = await changePrizeStatus(dto);
        setPrizes(prev =>
          prev.map(prize => (prize.id === dto.id ? { ...prize, isActive: dto.isActive } : prize))
        );
        return message;
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


  const redeem = useCallback(async (dto: RedeemPrizeDto): Promise<string> => {
    const message = await redeemPrize(dto);

   setPrizes(prev =>
    prev.map(prize =>
      prize.id === dto.prizeId
        ? {
            ...prize,
            stock: Math.max(prize.stock - 1, 0),
            isActive: Math.max(prize.stock - 1, 0) > 0 
          }
        : prize
    )
  );
    return message;
  }, []);


  const value = useMemo(
    () => ({
      prizes,
      loading,
      error,
      refresh: fetchData,
      create,
      update,
      changeStatus,
      remove,
      getById,
      redeem,
    }),
    [prizes, loading, error, fetchData, create, update, changeStatus, remove, getById, redeem]
  );

  return (
    <PrizeContext.Provider value={value}>
      {children}
    </PrizeContext.Provider>
  );
}

export { PrizeContext };

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import type { RewardsBadgeCategory } from '../types/RewardsBadgeCategory';
import {
  fetchAllBadgeCategories,
  fetchBadgeCategoryById,
  createBadgeCategory,
  updateBadgeCategory,
  deleteBadgeCategory,
  changeBadgeCategoryStatus,
} from '../services/badgeCategoryService';
import { useAuth } from '../hooks/useAuth';

interface BadgeCategoryContextType {
  categories: RewardsBadgeCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createCategory: (dto: Omit<RewardsBadgeCategory, 'id' | 'createdAt'>) => Promise<string>;
  updateCategory: (id: number, dto: Omit<RewardsBadgeCategory, 'id' | 'createdAt'>) => Promise<string>;
  changeCategoryStatus: (dto: { id: number; isActive: boolean }) => Promise<string>;
  deleteCategory: (id: number) => Promise<void>;
  getCategoryById: (id: number) => Promise<RewardsBadgeCategory>;
}

const BadgeCategoryContext = createContext<BadgeCategoryContextType>({} as BadgeCategoryContextType);

export function BadgeCategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<RewardsBadgeCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user || user.activeRole?.id === 3) return;
    try {
      setLoading(true);
      const data = await fetchAllBadgeCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.activeRole?.id !== 3) {
      fetchData();
    }
  }, [user, fetchData]);

  const createCategory = useCallback(
  async (dto: Omit<RewardsBadgeCategory, 'id' | 'createdAt'>): Promise<string> => {
    const { data: created, message } = await createBadgeCategory(dto);
    setCategories(prev => [...prev, created]);
    return message;
  },
  []
);

  const updateCategory = useCallback(
    async (id: number, dto: Omit<RewardsBadgeCategory, 'id' | 'createdAt'>): Promise<string> => {
     const message =  await updateBadgeCategory(id, dto);
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? { ...cat, ...dto } : cat))
      );
       return message;
    },
    []
  );

  const changeCategoryStatus = useCallback(
    async (dto: { id: number; isActive: boolean }): Promise<string> => {
      const message = await changeBadgeCategoryStatus(dto);
      setCategories(prev =>
        prev.map(cat => (cat.id === dto.id ? { ...cat, isActive: dto.isActive } : cat))
      );
      return message;
    },
    []
  );


  const deleteCategory = useCallback(
    async (id: number): Promise<void> => {
      await deleteBadgeCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    },
    []
  );

  const getCategoryById = useCallback(async (id: number): Promise<RewardsBadgeCategory> => {
    return await fetchBadgeCategoryById(id);
  }, []);

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      refresh: fetchData,
      createCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      changeCategoryStatus,
    }),
    [
      categories,
      loading,
      error,
      fetchData,
      createCategory,
      updateCategory,
      deleteCategory,
      getCategoryById,
      changeCategoryStatus,
    ]
  );

  return (
    <BadgeCategoryContext.Provider value={value}>
      {children}
    </BadgeCategoryContext.Provider>
  );
}

export { BadgeCategoryContext };

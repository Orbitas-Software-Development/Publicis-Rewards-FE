import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import type { RewardsBadgeAssignment} from '../types/RewardsBadgeAssignment';
import {
  fetchBadgeAssignmentById,
  deleteManagerBadgeAssignment,
  deleteCollaboratorBadgeAssignment,
  assignPointsToManagers,
  assignPointsToCollaborators,
  fetchAllManagerBadgeAssignments,
  fetchAllCollaboratorBadgeAssignments,
} from '../services/badgeAssignmentService';
import type { CreateManagerGrantRequestDto } from '../types/CreateManagerGrantRequestDto';
import type { CreateCollaboratorAssignmentRequestDto } from '../types/CreateCollaboratorsAssignmentRequestDto';
import { useAuth } from '../hooks/useAuth';

interface BadgeAssignmentContextType {
  managerAssignments: RewardsBadgeAssignment[];
  collaboratorAssignments: RewardsBadgeAssignment[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  assignToManagers: (dto: CreateManagerGrantRequestDto) => Promise<string>;
  assignToCollaborators: (dto: CreateCollaboratorAssignmentRequestDto) => Promise<string>;
  deleteManagerAssignment: (id: number) => Promise<string>;
  deleteCollaboratorAssignment: (id: number) => Promise<string>;
  getAssignmentById: (id: number) => Promise<RewardsBadgeAssignment>;
}

const BadgeAssignmentContext = createContext<BadgeAssignmentContextType>({} as BadgeAssignmentContextType);

export function BadgeAssignmentProvider({ children }: { children: ReactNode }) {
  const [managerAssignments, setManagerAssignments] = useState<RewardsBadgeAssignment[]>([]);
  const [collaboratorAssignments, setCollaboratorAssignments] = useState<RewardsBadgeAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

   const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user?.activeRole?.id) return;

    setLoading(true);
    setError(null);

    try {
      if (user.activeRole.id === 1) {
        // Admin: obtiene ambos
        const [managers, collaborators] = await Promise.all([
          fetchAllManagerBadgeAssignments(),
          fetchAllCollaboratorBadgeAssignments()
        ]);
        setManagerAssignments(managers);
        setCollaboratorAssignments(collaborators);
      } else if (user.activeRole.id === 2) {
        const collaborators = await fetchAllCollaboratorBadgeAssignments();
        setCollaboratorAssignments(collaborators);
        setManagerAssignments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  }, [user?.activeRole?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const assignToManagers = useCallback(
    async (dto: CreateManagerGrantRequestDto): Promise<string> => {
      const {data: created, message } = await assignPointsToManagers(dto);
      setManagerAssignments(prev => [...prev, ...created]);
      return message;
    },
    []
  );

  const assignToCollaborators = useCallback(
    async (dto: CreateCollaboratorAssignmentRequestDto): Promise<string> => {
      const { data: created, message } = await assignPointsToCollaborators(dto);
      setCollaboratorAssignments(prev => [...prev, ...created]);
      return message;
    },
    []
  );

  const deleteManagerAssignment = useCallback(
    async (id: number): Promise<string> => {
      const { message } =  await deleteManagerBadgeAssignment(id);
      setManagerAssignments(prev => prev.filter(a => a.id !== id));
      return message;
    },
    []
  );

  const deleteCollaboratorAssignment = useCallback(
    async (id: number): Promise<string> => {
      const { message } =  await deleteCollaboratorBadgeAssignment(id);
      setCollaboratorAssignments(prev => prev.filter(a => a.id !== id));
      return message;
    },
    []
  );

  const getAssignmentById = useCallback(async (id: number): Promise<RewardsBadgeAssignment> => {
    return await fetchBadgeAssignmentById(id);
  }, []);

  const value = useMemo(
    () => ({
      managerAssignments,
      collaboratorAssignments,
      loading,
      error,
      refresh: fetchData,
      assignToManagers,
      assignToCollaborators,
      deleteManagerAssignment,
      deleteCollaboratorAssignment,
      getAssignmentById,
    }),
    [
      managerAssignments,
      collaboratorAssignments,
      loading,
      error,
      fetchData,
       assignToManagers,
      assignToCollaborators,
      deleteManagerAssignment,
      deleteCollaboratorAssignment,
      getAssignmentById,
    ]
  );

  return (
    <BadgeAssignmentContext.Provider value={value}>
      {children}
    </BadgeAssignmentContext.Provider>
  );
}

export { BadgeAssignmentContext };

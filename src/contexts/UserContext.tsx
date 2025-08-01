import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { RewardsUser } from '../types/RewardsUser';
import {
  fetchAllUsers,
  assignRoles,
  deleteUser,
  toggleUserStatus,
  updateUserProfilePicture,
  fetchUserProfile,
  inviteUser,
  createUserByAdmin,
  fetchManagerAvailablePoints,
  fetchCollaboratorAvailablePoints,
} from '../services/userService';
import type { RewardsRole } from '../types/RewardsRole';
import { useAuth } from '../hooks/useAuth';
import type { UserProfile } from '../types/UserProfile';
import type { CreateUserByAdminDto } from '../types/CreateUserByAdmin';

interface UserContextType {
  users: RewardsUser[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  assignUserRoles: (userId: number, roles: RewardsRole[]) => Promise<string>;
  toggleUserAccount: (userId: number, enabled: boolean) => Promise<string>;
  updateProfilePicture: (userId: number, file: File) => Promise<{ message: string; path: string }>;
  deleteUserAccount: (userId: number) => Promise<string>;
  getUserProfile: (userId: number) => Promise<UserProfile>; 
  inviteUserFn: (employeeNumber: string) => Promise<string>;
  createUserByAdminFn: (dto: CreateUserByAdminDto) => Promise<string>;
  getManagerAvailablePoints: (userId: number) => Promise<number | null>;
  getCollaboratorAvailablePoints: (userId: number) => Promise<number | null>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RewardsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser, updateUserProfilePictureInAuth } = useAuth();


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateUserLocally = (updatedUser: Partial<RewardsUser> & { id: number }) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };


  const assignUserRoles = useCallback(
    async (userId: number, roles: RewardsRole[]) => {
      const msg = await assignRoles(userId, roles);
      updateUserLocally({ id: userId, roles });
      return msg;
    },
    []
  );

   const toggleUserAccount = useCallback(
    async (userId: number, enabled: boolean) => {
      const msg = await toggleUserStatus(userId, enabled);
      updateUserLocally({ id: userId, status: enabled ? 'Activo' : 'Inactivo' });
      return msg;
    },
    []
  );

  const updateProfilePicture = useCallback(
    async (userId: number, file: File) => {
      const { message, path } = await updateUserProfilePicture(userId, file);
      updateUserLocally({ id: userId, profilePicture: path });

      if (authUser?.id === userId) {
        updateUserProfilePictureInAuth(path);
      }

      return { message, path };
    },
    [authUser, updateUserProfilePictureInAuth]
);

  const deleteUserAccount = useCallback(
    async (userId: number) => {
      const msg = await deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      return msg;
    },
    []
  );

  const getUserProfile = useCallback(
    async (userId: number): Promise<UserProfile> => {
      return await fetchUserProfile(userId);
    },
    []
);

  const inviteUserFn = useCallback(
    async (employeeNumber: string): Promise<string> => {
      const msg = await inviteUser(employeeNumber);
      return msg;
    },
    []
);

  const createUserByAdminFn = useCallback(
    async (dto: CreateUserByAdminDto): Promise<string> => {
      const { data: newUser, message } = await createUserByAdmin(dto);
      setUsers(prev => [...prev, newUser]); 
      return message;
    },
    []
  );

  const getManagerAvailablePoints = useCallback(
    async (userId: number): Promise<number | null> => {
        const points = await fetchManagerAvailablePoints(userId);
        return points;   
    },
    []
  );

  const getCollaboratorAvailablePoints = useCallback(
    async (userId: number): Promise<number | null> => {
        const points = await fetchCollaboratorAvailablePoints(userId);
        return points;   
    },
    []
  );



  const value = useMemo(
    () => ({
      users,
      loading,
      error,
      refresh: fetchData,
      assignUserRoles,
      toggleUserAccount,
      updateProfilePicture, 
      deleteUserAccount,
      getUserProfile, 
      inviteUserFn,
      createUserByAdminFn,
      getManagerAvailablePoints,
      getCollaboratorAvailablePoints,
    }),
    [
      users,
      loading,
      error,
      fetchData,
      assignUserRoles,
      toggleUserAccount,
      updateProfilePicture, 
      deleteUserAccount,
      getUserProfile,
      inviteUserFn,
      createUserByAdminFn, 
      getManagerAvailablePoints,
      getCollaboratorAvailablePoints,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContext };

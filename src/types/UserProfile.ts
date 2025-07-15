// src/types/UserProfile.ts
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  status: string;
  employeeNumber: string;
  createdDate: string;
  roles: string[];
  lastLoginDate: string | null;
  hireDate: string;
  department: string;
  position: string;
  supervisorName: string;
  pointsAssigned: number;
  pointsRedeemed: number;
  pointsAvailable: number;
  totalRewardsRedeemed: number;
  profilePictureUrl: string;
}

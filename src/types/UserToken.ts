import type { RewardsUser } from "./RewardsUser";

export interface UserToken {
  token: string;
  refreshToken: string;
  expiration: string; 
  userId: number;
  employeeNumber: string;
  user: RewardsUser;
  createdDate: string; 
  ipAddress: string;
  browser: string;
  isActive: boolean;
}
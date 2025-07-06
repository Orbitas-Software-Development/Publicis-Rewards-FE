import type { RewardsRole } from "./RewardsRole";

export interface RewardsUser {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  hireDate: string;
  status: string;
  createdAt: string;

  roles: RewardsRole[];
}
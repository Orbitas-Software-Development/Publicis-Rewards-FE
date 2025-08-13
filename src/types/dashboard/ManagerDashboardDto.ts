import type { MonthlyRedeemedPrizes } from "./AdminDashboardDto";

export interface ManagerDashboardDto {
  // Contadores simples
  peopleUnderManagerCount: number;
  totalPointsAssignedByManager: number;
  totalRedeemedPrizesByTeam: number;
  pointsAvailableToAssign: number;

  // Contadores exclusivos para supervisor (opcionales)
  totalPointsEarnedByTeam?: number;
  currentPointsBalanceTeam?: number;

  // Gráficos
  pointsDistributionByCategory: CategoryPointsDistribution[];
  pointsAssignedByArea: AreaPointsAssignment[];
  peopleByArea: PeopleByArea[];
  monthlyRedeemedPrizesByTeam:  MonthlyRedeemedPrizes[];
}

export interface CategoryPointsDistribution {
  category: string;
  points: number;
  percentage: number;
}

export interface AreaPointsAssignment {
  area: string;
  pointsAssigned: number;
}

export interface PeopleByArea
{
  area: string;
  peopleCount: number;

}

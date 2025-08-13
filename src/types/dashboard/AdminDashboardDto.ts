export interface AdminDashboardDto {
  // Contadores simples
  activeCollaboratorsCount: number;
  assignedPoints: number;
  redeemedPrizesCount: number;
  availablePrizesCount: number;

  // Listas para gráficos
  redeemedPrizesByMonth: MonthlyRedeemedPrizes[];
  pointsAvailableByRange: PointsRangePercentage[];
  topRedeemedPrizes: PrizeRedemptionSummary[];
  pointsAssignedVsRedeemedSummary: PointsAssignedVsRedeemedSummary;
}

export interface MonthlyRedeemedPrizes {
  monthNumber: number;
  month: string; 
  count: number;

}

export interface PointsRangePercentage {
  range: string; 
  percentage: number;
}

export interface PrizeRedemptionSummary {
  prizeCode: string;
  prizeDescription: string;
  redemptionCount: number;

}

export interface PointsAssignedVsRedeemedSummary {
  totalAssignedPoints: number;
  totalRedeemedPoints: number;
}

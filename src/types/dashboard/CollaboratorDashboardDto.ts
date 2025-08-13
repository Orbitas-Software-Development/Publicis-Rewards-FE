export interface CollaboratorDashboardDto {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  currentPointsBalance: number;
  totalRedemptionsCount: number;
  pointsByReason: PointsByReasonDto[];
  redeemedPointsByYear: PointsByYearDto[];
}

export interface PointsByReasonDto {
  reason: string;
  points: number;
  percentage: number;
}

export interface PointsByYearDto {
  year: number;
  points: number;
  redemptionsCount: number;
}



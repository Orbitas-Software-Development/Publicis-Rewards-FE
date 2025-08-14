export interface RedemptionsHistoryDto {
  id: number,
  employeeNumber: string;
  userName: string;
  prizeName: string;
  prizeImageUrl: string;
  pointsUsed: number;
  redeemedAt: string;
  status: string;
  changedBy: string | null
  changedAt: string | null
}

export interface RedemptionUpdateDto {
  id: number;
  status: string;
}
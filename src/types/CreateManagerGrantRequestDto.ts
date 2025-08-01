export interface CreateManagerGrantRequestDto {
  fromUserId: number;
  toUserIds: number[]; 
  year: number;
  pointsGranted: number;
}

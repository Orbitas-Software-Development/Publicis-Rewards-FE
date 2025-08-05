export interface CreateManagerGrantRequestDto {
  fromUserId: number;
  toUserIds: number[]; 
  pointsGranted: number;
}

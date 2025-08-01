export interface CreateBadgeAssignmentDto {
  userId: number;
  categoryId: number;
  assignedBy: number;
  points: number;
  notes?: string;
}

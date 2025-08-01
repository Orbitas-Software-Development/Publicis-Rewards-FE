export interface CollaboratorAssignmentDto {
  userId: number;
  categoryId: number;  
  points: number;
}

export interface CreateCollaboratorAssignmentRequestDto {
  assignments: CollaboratorAssignmentDto[];
  assignedBy: number;
  notes?: string;
}

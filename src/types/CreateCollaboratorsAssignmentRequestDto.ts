export interface CollaboratorAssignmentDto {
  userId: number;
  categoryId: number;  
  points: number;
  comment: string;
}

export interface CreateCollaboratorAssignmentRequestDto {
  assignments: CollaboratorAssignmentDto[];
  assignedBy: number;
  comment: string;
}

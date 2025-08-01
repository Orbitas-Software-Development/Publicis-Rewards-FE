export interface EmployeeDto {
  employeeNumber: string;
  fullName: string;
  email: string;
  hireDate: string; 
  active: string;
  availablePoints: number;
  team: EmployeeDto[];
}

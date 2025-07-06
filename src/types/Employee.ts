export interface EmployeeDto {
  employeeNumber: string;
  fullName: string;
  email: string;
  hireDate: string; 
  active: string;
  team: EmployeeDto[];
}

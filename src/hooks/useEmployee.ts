import { useContext } from 'react';
import { EmployeeContext } from '../contexts/EmployeeContext';

export const useEmployees = () => useContext(EmployeeContext);

import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { EmployeeDto } from '../types/Employee';

interface ErrorResponse {
  message?: string;
}

export async function fetchAllEmployees(): Promise<EmployeeDto[]> {
  try {
    const response = await axios.get(`${API_URL}/Employee`);
    return response.data;
  } catch (error) {
    handleEmployeeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function fetchTeamTree(employeeNumber: string): Promise<EmployeeDto[]> {
  try {
    const response = await axios.get(`${API_URL}/Employee/team/tree/${employeeNumber}`);
    return response.data;
  } catch (error) {
    handleEmployeeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

const handleEmployeeError = (error: AxiosError): never => {
  if (error.response?.data) {
    const data = error.response.data;

    if (typeof data === 'string') {
      throw new Error(data);
    }

    if (typeof data === 'object' && 'message' in data) {
      throw new Error((data as { message: string }).message);
    }
  }

  if (error.request) {
    throw new Error('No se recibió respuesta del servidor.');
  }

  throw new Error(error.message || 'Ocurrió un error inesperado.');
};

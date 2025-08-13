import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { CollaboratorDashboardDto } from '../types/dashboard/CollaboratorDashboardDto';
import type { AdminDashboardDto } from '../types/dashboard/AdminDashboardDto';
import type { ManagerDashboardDto } from '../types/dashboard/ManagerDashboardDto';

interface ErrorResponse {
  message?: string;
}

// ─── Obtener dashboard de Admin ────────────────────────────
export async function fetchAdminDashboard(): Promise<AdminDashboardDto> {
  try {
    const response = await axios.get<AdminDashboardDto>(`${API_URL}/Dashboard/admin`);
    return response.data;
  } catch (error) {
    handleDashboardError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// ─── Obtener dashboard de Manager ──────────────────────────
export async function fetchManagerDashboard(userId: number): Promise<ManagerDashboardDto> {
  try {
    const response = await axios.get<ManagerDashboardDto>(`${API_URL}/Dashboard/manager/${userId}`);
    return response.data;
  } catch (error) {
    handleDashboardError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// ─── Obtener dashboard de Colaborador ──────────────────────
export async function fetchCollaboratorDashboard(userId: number): Promise<CollaboratorDashboardDto> {
  try {
    const response = await axios.get<CollaboratorDashboardDto>(`${API_URL}/Dashboard/collaborator/${userId}`);
    return response.data;
  } catch (error) {
    handleDashboardError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// ─── Manejo de errores ─────────────────────────────────────
const handleDashboardError = (error: AxiosError): never => {
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

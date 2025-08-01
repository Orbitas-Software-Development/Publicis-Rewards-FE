import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { RewardsBadgeAssignment} from '../types/RewardsBadgeAssignment';
import type { CreateBadgeAssignmentDto} from '../types/CreateBadgeAssignment';
import type { CreateCollaboratorAssignmentRequestDto } from '../types/CreateCollaboratorsAssignmentRequestDto';
import type { CreateManagerGrantRequestDto } from '../types/CreateManagerGrantRequestDto';

interface ErrorResponse {
  message?: string;
}

export async function fetchAllManagerBadgeAssignments(): Promise<RewardsBadgeAssignment[]> {
  try {
    const response = await axios.get<RewardsBadgeAssignment[]>(`${API_URL}/BadgeAssignments/managers`);
    return response.data;
  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function fetchAllCollaboratorBadgeAssignments(): Promise<RewardsBadgeAssignment[]> {
  try {
    const response = await axios.get<RewardsBadgeAssignment[]>(`${API_URL}/BadgeAssignments/collaborators`);
    return response.data;
  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}


// Obtener una asignación por ID
export async function fetchBadgeAssignmentById(id: number): Promise<RewardsBadgeAssignment> {
  try {
    const response = await axios.get<RewardsBadgeAssignment>(`${API_URL}/BadgeAssignments/${id}`);
    return response.data;
  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Crear una nueva asignación
export async function createBadgeAssignment(dto: CreateBadgeAssignmentDto): Promise<{ data: RewardsBadgeAssignment; message: string }> {
  try {
    const response = await axios.post(`${API_URL}/BadgeAssignments`, dto);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function assignPointsToManagers(dto: CreateManagerGrantRequestDto): Promise<{data: RewardsBadgeAssignment[]; message: string }> {
  try {
    const response = await axios.post(`${API_URL}/BadgeAssignments/assign-to-managers`, dto);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Asignar puntos a colaboradores
export async function assignPointsToCollaborators(dto: CreateCollaboratorAssignmentRequestDto): Promise<{data: RewardsBadgeAssignment[]; message: string }> {
  try {
    const response = await axios.post(`${API_URL}/BadgeAssignments/assign-to-collaborators`, dto);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}


// Eliminar una asignación hecha a un manager
export async function deleteManagerBadgeAssignment(id: number): Promise<{ message: string }> {
  try {
    const response = await axios.delete(`${API_URL}/BadgeAssignments/manager/${id}`);
    return { message: response.data.message };

  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Eliminar una asignación hecha a un colaborador
export async function deleteCollaboratorBadgeAssignment(id: number): Promise<{ message: string }> {
  try {
    const response = await axios.delete(`${API_URL}/BadgeAssignments/collaborator/${id}`);
    return { message: response.data.message };

  } catch (error) {
    handleBadgeAssignmentError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Manejo de errores
const handleBadgeAssignmentError = (error: AxiosError): never => {
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

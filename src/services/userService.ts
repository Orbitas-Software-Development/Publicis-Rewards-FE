import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { RewardsUser } from '../types/RewardsUser';
import type { RewardsRole } from '../types/RewardsRole';
import type { UserProfile } from '../types/UserProfile';
import type { CreateUserByAdminDto } from '../types/CreateUserByAdmin';

interface ErrorResponse {
  message?: string;
}

export async function fetchAllUsers(): Promise<RewardsUser[]> {
  try {
    const response = await axios.get(`${API_URL}/User`);
    return response.data;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function fetchUserProfile(userId: number): Promise<UserProfile> {
  try {
    const response = await axios.get(`${API_URL}/User/${userId}/profile`);
    return response.data;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function assignRoles(userId: number, roles: RewardsRole[]): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/User/${userId}/roles`, roles);
    return response.data.message;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function toggleUserStatus(userId: number, enabled: boolean): Promise<string> {
  try {
    const url = `${API_URL}/User/${userId}/status?enabled=${enabled}`;
    const response = await axios.put(url);
    return response.data.message;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}
export async function updateUserProfilePicture(userId: number, file: File): Promise<{ message: string; path: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.put(`${API_URL}/User/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      message: response.data.message,
      path: response.data.path,
    };
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function inviteUser(employeeNumber: string): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/User/invite`, {
      employeeNumber,
    });
    return response.data.message;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}


export async function createUserByAdmin(dto: CreateUserByAdminDto): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/User/create-by-admin`, dto);
    return response.data.message;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function deleteUser(userId: number): Promise<string> {
  try {
    const response = await axios.delete(`${API_URL}/User/${userId}`);
    return response.data.message;
  } catch (error) {
    handleUserError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

const handleUserError = (error: AxiosError): never => {
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

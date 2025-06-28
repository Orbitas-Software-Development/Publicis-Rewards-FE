import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { ResetPasswordDto, UserAuthDto } from '../types/UserAuth';
import type { UserToken } from '../types/UserToken';

interface ErrorResponse {
  message?: string;
}

export async function loginUser(dto: UserAuthDto): Promise<{ message: string; userToken: UserToken }> {
  try {
    const response = await axios.post(`${API_URL}/Auth/login`, dto);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function registerUser(dto: UserAuthDto): Promise<{ message: string }> {
  try {
    const response = await axios.post(`${API_URL}/Auth/register`, dto);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function sendPasswordResetLink(email: string): Promise<{ message: string }> {
  try {
    const response = await axios.post(`${API_URL}/Auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}



export async function resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
  try {
    const response = await axios.post(`${API_URL}/Auth/reset-password`, dto);
    return response.data;
  } catch (error) {
    handleAuthError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

const handleAuthError = (error: AxiosError): never => {
  if (error.response?.data) {
    const data = error.response.data;

    // Si el backend devuelve texto plano (string)
    if (typeof data === 'string') {
      throw new Error(data);
    }

    // Si devuelve JSON con "message"
    if (typeof data === 'object' && 'message' in data) {
      throw new Error((data as { message: string }).message);
    }
  }

  if (error.request) {
    throw new Error('No se recibió respuesta del servidor.');
  }

  throw new Error(error.message || 'Ocurrió un error inesperado.');
};

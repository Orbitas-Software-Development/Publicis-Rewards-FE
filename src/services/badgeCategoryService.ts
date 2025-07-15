import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { RewardsBadgeCategory} from '../types/RewardsBadgeCategory';

interface ErrorResponse {
  message?: string;
}

// Obtener todas las categorías
export async function fetchAllBadgeCategories(): Promise<RewardsBadgeCategory[]> {
  try {
    const response = await axios.get<RewardsBadgeCategory[]>(`${API_URL}/BadgeCategories`);
    return response.data;
  } catch (error) {
    handleBadgeCategoryError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Obtener una categoría por ID
export async function fetchBadgeCategoryById(id: number): Promise<RewardsBadgeCategory> {
  try {
    const response = await axios.get<RewardsBadgeCategory>(`${API_URL}/BadgeCategories/${id}`);
    return response.data;
  } catch (error) {
    handleBadgeCategoryError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Crear una nueva categoría
export async function createBadgeCategory(dto: Omit<RewardsBadgeCategory, 'id' | 'createdAt'>): Promise<{ data: RewardsBadgeCategory; message: string }> {
  try {
    const response = await axios.post(`${API_URL}/BadgeCategories`, dto);
    return {
      data: response.data.data,     
      message: response.data.message 
    };
  } catch (error) {
    handleBadgeCategoryError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}


// Actualizar una categoría
export async function updateBadgeCategory(id: number, dto: Omit<RewardsBadgeCategory, 'id' | 'createdAt'>): Promise<void> {
  try {
    await axios.put(`${API_URL}/BadgeCategories/${id}`, dto);
  } catch (error) {
    handleBadgeCategoryError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Eliminar una categoría
export async function deleteBadgeCategory(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/BadgeCategories/${id}`);
  } catch (error) {
    handleBadgeCategoryError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Manejo de errores
const handleBadgeCategoryError = (error: AxiosError): never => {
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

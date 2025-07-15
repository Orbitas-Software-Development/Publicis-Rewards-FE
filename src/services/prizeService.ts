import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { RewardsPrize } from '../types/RewardsPrize';

interface ErrorResponse {
  message?: string;
}

type CreatePrizeDto = Omit<RewardsPrize, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'> & {
  imageFile?: File | null;
};

// Obtener todos los premios
export async function fetchAllPrizes(): Promise<RewardsPrize[]> {
  try {
    const response = await axios.get<RewardsPrize[]>(`${API_URL}/Prize`);
    return response.data;
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

// Obtener premio por ID
export async function fetchPrizeById(id: number): Promise<RewardsPrize> {
  try {
    const response = await axios.get<RewardsPrize>(`${API_URL}/Prize/${id}`);
    return response.data;
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function createPrize(
  dto: CreatePrizeDto
): Promise<{ data: RewardsPrize; message: string }> {
  try {
    const formData = new FormData();

    formData.append('code', dto.code);
    formData.append('description', dto.description);
    formData.append('cost', dto.cost.toString());
    formData.append('stock', dto.stock.toString());
    formData.append('isActive', dto.isActive.toString());

    if (dto.imageFile) {
      formData.append('imageFile', dto.imageFile);
    }

    const response = await axios.post(`${API_URL}/Prize`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}


export async function updatePrize(
  id: number,
  dto: Omit<RewardsPrize, 'createdAt' | 'updatedAt'> & { imageFile?: File | null }
): Promise<{ message: string; path: string | null }> {
  try {
    const formData = new FormData();
    formData.append('Code', dto.code);
    formData.append('Description', dto.description);
    formData.append('Cost', dto.cost.toString());
    formData.append('Stock', dto.stock.toString());
    formData.append('IsActive', dto.isActive.toString());

    if (dto.imageFile) {
      formData.append('ImageFile', dto.imageFile);
    }

     const response = await axios.put(`${API_URL}/Prize/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      message: response.data.message,
      path: response.data.path,
    };
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}


// Eliminar premio
export async function deletePrize(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/Prize/${id}`);
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function canRedeemPrize(prizeId: number, userPoints: number): Promise<boolean> {
  try {
    const response = await axios.get<boolean>(`${API_URL}/Prize/${prizeId}/canredeem/${userPoints}`);
    return response.data;
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

export async function redeemPrize(prizeId: number): Promise<void> {
  try {
    await axios.post(`${API_URL}/Prize/${prizeId}/redeem`);
  } catch (error) {
    handlePrizeError(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

const handlePrizeError = (error: AxiosError): never => {
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

import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/ApiLinks';
import type { UserRedemptionHistoryDto } from '../types/UserRedemptionHistoryDto';
import type { RedemptionsHistoryDto, RedemptionUpdateDto } from '../types/RedemptionsHistoryDto';


export async function fetchAllRedemptionHistory(): Promise<RedemptionsHistoryDto[]> {
  try {
    const response = await axios.get<RedemptionsHistoryDto[]>(`${API_URL}/Redemption/history/all`);
    return response.data;
  } catch (error) {
    handleRedemptionError(error as AxiosError);
    throw error;
  }
}

export async function fetchUserRedemptionHistory(userId: number): Promise<UserRedemptionHistoryDto[]> {
  try {
    const response = await axios.get<UserRedemptionHistoryDto[]>(`${API_URL}/Redemption/history/${userId}`);
    return response.data;
  } catch (error) {
    handleRedemptionError(error as AxiosError);
    throw error;
  }
}

export async function updateRedemptionStatus(dto: RedemptionUpdateDto): Promise<{data: RedemptionsHistoryDto; message: string }> {
  try {
    const response = await axios.put(`${API_URL}/Redemption/update-status`, dto);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    handleRedemptionError(error as AxiosError);
    throw error;
  }
}

const handleRedemptionError = (error: AxiosError): never => {
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

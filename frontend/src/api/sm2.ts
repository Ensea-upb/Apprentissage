import apiClient from './client';
import { SM2Card } from '../types';

export interface SM2ReviewResponse {
  card: SM2Card;
  newInterval: number;
  newEasinessFactor: number;
}

export const sm2Api = {
  getDueCards: async (): Promise<{ cards: SM2Card[]; count: number }> => {
    const response = await apiClient.get<{ cards: SM2Card[]; count: number }>('/sm2/due-today');
    return response.data;
  },

  getDueTodayCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/sm2/due-today/count');
    return response.data.count;
  },

  getCard: async (conceptId: string): Promise<SM2Card> => {
    const response = await apiClient.get<SM2Card>(`/sm2/${conceptId}`);
    return response.data;
  },

  reviewCard: async (conceptId: string, quality: number): Promise<SM2ReviewResponse> => {
    const response = await apiClient.post<SM2ReviewResponse>(`/sm2/${conceptId}/review`, {
      quality,
    });
    return response.data;
  },

  getAllCards: async (): Promise<SM2Card[]> => {
    const response = await apiClient.get<SM2Card[]>('/sm2');
    return response.data;
  },
};

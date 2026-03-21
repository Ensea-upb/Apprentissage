import apiClient from './client';
import { ConceptProgress, UserStats } from '../types';

export const progressApi = {
  getUserProgress: async (): Promise<Record<string, ConceptProgress>> => {
    const response = await apiClient.get<Record<string, ConceptProgress>>('/progress');
    return response.data;
  },

  getConceptProgress: async (conceptId: string): Promise<ConceptProgress> => {
    const response = await apiClient.get<ConceptProgress>(`/progress/${conceptId}`);
    return response.data;
  },

  getAvailableConcepts: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/progress/available');
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/progress/stats');
    return response.data;
  },
};

import apiClient from './client';
import { Concept, ConceptProgress, UserStats } from '../types';

export const progressApi = {
  getUserProgress: async (): Promise<ConceptProgress[]> => {
    const response = await apiClient.get<ConceptProgress[]>('/progress');
    return response.data;
  },

  getConceptProgress: async (conceptId: string): Promise<ConceptProgress> => {
    const response = await apiClient.get<ConceptProgress>(`/progress/${conceptId}`);
    return response.data;
  },

  getAvailableConcepts: async (): Promise<Concept[]> => {
    const response = await apiClient.get<Concept[]>('/progress/available');
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/progress/stats');
    return response.data;
  },

  completePhase: async (conceptId: string, phase: number): Promise<{
    success: boolean;
    xpEarned: number;
    coinsEarned: number;
    conceptValidated: boolean;
  }> => {
    const response = await apiClient.post(`/progress/${conceptId}/phase/${phase}/complete`);
    return response.data;
  },
};

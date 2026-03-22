import apiClient from './client';
import { Badge } from '../types';

export const badgesApi = {
  /** All badges with earned status for the current user */
  getAll: async (): Promise<{ badges: Badge[]; earnedCount: number; totalCount: number }> => {
    const response = await apiClient.get('/badges');
    return response.data;
  },

  /** Only the badges the user has earned */
  getEarned: async (): Promise<{ badges: Badge[] }> => {
    const response = await apiClient.get('/badges/earned');
    return response.data;
  },
};

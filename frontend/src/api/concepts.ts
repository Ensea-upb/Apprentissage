import apiClient from './client';
import { Concept, Block } from '../types';

export const conceptsApi = {
  getAll: async (): Promise<Concept[]> => {
    const response = await apiClient.get<Concept[]>('/concepts');
    return response.data;
  },

  getById: async (conceptId: string): Promise<Concept> => {
    const response = await apiClient.get<Concept>(`/concepts/${conceptId}`);
    return response.data;
  },

  getBlocks: async (): Promise<Block[]> => {
    const response = await apiClient.get<Block[]>('/concepts/blocks');
    return response.data;
  },

  getByBlock: async (blockId: number): Promise<Concept[]> => {
    const response = await apiClient.get<Concept[]>(`/concepts/block/${blockId}`);
    return response.data;
  },

  getByModule: async (moduleId: string): Promise<Concept[]> => {
    const response = await apiClient.get<Concept[]>(`/concepts/module/${moduleId}`);
    return response.data;
  },
};

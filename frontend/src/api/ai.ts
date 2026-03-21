import apiClient from './client';
import { Question, DailyInsight } from '../types';

export interface GenerateQuestionsRequest {
  conceptId: string;
  phase: number;
  count?: number;
  difficulty?: number;
  previousErrors?: string[];
}

export interface GenerateQuestionsResponse {
  questions: Question[];
}

export interface ExplainConceptRequest {
  conceptId: string;
  errorType?: string;
  userAnswer?: string;
}

export const aiApi = {
  generateQuestions: async (
    request: GenerateQuestionsRequest
  ): Promise<GenerateQuestionsResponse> => {
    const response = await apiClient.post<GenerateQuestionsResponse>(
      '/ai/generate-questions',
      request
    );
    return response.data;
  },

  explainConcept: async (request: ExplainConceptRequest): Promise<string> => {
    const response = await apiClient.post<{ explanation: string }>(
      '/ai/explain',
      request
    );
    return response.data.explanation;
  },

  getDailyInsight: async (): Promise<DailyInsight> => {
    const response = await apiClient.get<DailyInsight>('/ai/insight');
    return response.data;
  },

  getHint: async (questionId: string): Promise<string> => {
    const response = await apiClient.get<{ hint: string }>(`/ai/hint/${questionId}`);
    return response.data.hint;
  },
};

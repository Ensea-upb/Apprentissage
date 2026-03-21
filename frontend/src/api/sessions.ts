import apiClient from './client';
import { Session, SessionResult, Answer } from '../types';

export interface StartSessionResponse {
  session: Session;
}

export interface SubmitAnswerResponse {
  session: {
    id: string;
    questionsAsked: number;
    correctAnswers: number;
    livesRemaining: number;
    xpEarned: number;
  };
  xpGained: number;
  livesRemaining: number;
}

export const sessionsApi = {
  start: async (conceptId: string, phase: number): Promise<StartSessionResponse> => {
    const response = await apiClient.post<StartSessionResponse>('/sessions/start', {
      conceptId,
      phase,
    });
    return response.data;
  },

  submitAnswer: async (sessionId: string, answer: Answer): Promise<SubmitAnswerResponse> => {
    const response = await apiClient.post<SubmitAnswerResponse>(
      `/sessions/${sessionId}/answer`,
      answer
    );
    return response.data;
  },

  end: async (sessionId: string): Promise<SessionResult> => {
    const response = await apiClient.post<SessionResult>(`/sessions/${sessionId}/complete`);
    return response.data;
  },

  getSession: async (sessionId: string): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${sessionId}`);
    return response.data;
  },

  getUserSessions: async (): Promise<Session[]> => {
    const response = await apiClient.get<Session[]>('/sessions');
    return response.data;
  },
};

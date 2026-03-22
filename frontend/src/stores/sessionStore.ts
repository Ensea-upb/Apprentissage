import { create } from 'zustand';
import { sessionsApi } from '../api/sessions';
import { aiApi } from '../api/ai';
import { progressApi } from '../api/progress';
import { Session, Question, Answer, SessionResult, ErrorType } from '../types';

interface SessionState {
  currentSession: Session | null;
  currentQuestion: Question | null;
  questions: Question[];
  questionIndex: number;
  lives: number;
  streak: number;
  score: number;
  sessionXP: number;
  answers: Answer[];
  isLoading: boolean;
  error: string | null;
  conceptLabel: string;
  phaseDescription: string;
  isSessionComplete: boolean;
  startSession: (conceptId: string, phase: number) => Promise<void>;
  submitAnswer: (answer: string, isCorrect: boolean, errorType?: ErrorType) => Promise<void>;
  nextQuestion: () => void;
  endSession: () => Promise<SessionResult>;
  resetSession: () => void;
}

const INITIAL_LIVES = 3;
const XP_PER_CORRECT = 10;
const XP_STREAK_BONUS = 5;

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  currentQuestion: null,
  questions: [],
  questionIndex: 0,
  lives: INITIAL_LIVES,
  streak: 0,
  score: 0,
  sessionXP: 0,
  answers: [],
  isLoading: false,
  error: null,
  conceptLabel: '',
  phaseDescription: '',
  isSessionComplete: false,

  startSession: async (conceptId: string, phase: number) => {
    set({ isLoading: true, error: null, isSessionComplete: false });
    try {
      // Start a session on the backend
      const { session } = await sessionsApi.start(conceptId, phase);

      // Generate questions from AI
      const { questions } = await aiApi.generateQuestions({ conceptId, phase, count: 7 });

      set({
        currentSession: session,
        questions,
        questionIndex: 0,
        currentQuestion: questions[0] || null,
        lives: INITIAL_LIVES,
        streak: 0,
        score: 0,
        sessionXP: 0,
        answers: [],
        isLoading: false,
        conceptLabel: '',    // enriched by the caller (page component) from concept data
        phaseDescription: '',
        isSessionComplete: false,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erreur lors du démarrage de la session.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  submitAnswer: async (answer: string, isCorrect: boolean, errorType?: ErrorType) => {
    const { currentQuestion, currentSession, answers, streak, sessionXP, lives } = get();
    if (!currentQuestion || !currentSession) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      errorType,
    };

    const newStreak = isCorrect ? streak + 1 : 0;
    const streakBonus = isCorrect && newStreak >= 3 ? XP_STREAK_BONUS : 0;
    const xpGained = isCorrect ? XP_PER_CORRECT + streakBonus : 0;
    const newLives = isCorrect ? lives : Math.max(lives - 1, 0);

    set({
      answers: [...answers, newAnswer],
      streak: newStreak,
      sessionXP: sessionXP + xpGained,
      lives: newLives,
    });

    // Post answer to backend (non-blocking)
    try {
      await sessionsApi.submitAnswer(currentSession.id, newAnswer);
    } catch {
      // Non-critical — continue session even if backend call fails
    }
  },

  nextQuestion: () => {
    const { questions, questionIndex } = get();
    const nextIndex = questionIndex + 1;
    if (nextIndex >= questions.length) {
      set({ isSessionComplete: true, currentQuestion: null });
    } else {
      set({
        questionIndex: nextIndex,
        currentQuestion: questions[nextIndex],
      });
    }
  },

  endSession: async (): Promise<SessionResult> => {
    const { currentSession, answers, sessionXP } = get();
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const result = await sessionsApi.end(currentSession.id);
      set({ currentSession: null, isSessionComplete: true });

      // Mark phase as complete if accuracy >= 60%
      if (result.accuracy >= 60) {
        try {
          await progressApi.completePhase(currentSession.conceptId, currentSession.phase);
        } catch {
          // Non-critical — progress will sync on next load
        }
      }

      return result;
    } catch {
      // Compute result locally if backend fails
      const correctCount = answers.filter((a) => a.isCorrect).length;
      const errorBreakdown: Record<ErrorType, number> = {
        conceptual: 0,
        mathematical: 0,
        application: 0,
        reading: 0,
      };
      answers.forEach((a) => {
        if (!a.isCorrect && a.errorType) {
          errorBreakdown[a.errorType]++;
        }
      });

      return {
        sessionId: currentSession.id,
        conceptId: currentSession.conceptId,
        phase: currentSession.phase,
        questionsAsked: answers.length,
        correctAnswers: correctCount,
        accuracy: answers.length > 0 ? (correctCount / answers.length) * 100 : 0,
        xpEarned: sessionXP,
        errorBreakdown,
        phaseCompleted: false,
      };
    }
  },

  resetSession: () => {
    set({
      currentSession: null,
      currentQuestion: null,
      questions: [],
      questionIndex: 0,
      lives: INITIAL_LIVES,
      streak: 0,
      score: 0,
      sessionXP: 0,
      answers: [],
      isLoading: false,
      error: null,
      conceptLabel: '',
      phaseDescription: '',
      isSessionComplete: false,
    });
  },
}));

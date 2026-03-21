import { create } from 'zustand';
import { progressApi } from '../api/progress';
import { sm2Api } from '../api/sm2';
import { ConceptProgress, SM2Card } from '../types';

interface ProgressState {
  conceptProgress: Record<string, ConceptProgress>;
  availableConcepts: string[];
  sm2Cards: SM2Card[];
  dueTodayCount: number;
  isLoading: boolean;
  error: string | null;
  loadProgress: () => Promise<void>;
  loadDueToday: () => Promise<void>;
  loadSM2Cards: () => Promise<void>;
  getConceptStatus: (conceptId: string) => 'locked' | 'available' | 'in_progress' | 'mastered' | 'decaying';
  refreshProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  conceptProgress: {},
  availableConcepts: [],
  sm2Cards: [],
  dueTodayCount: 0,
  isLoading: false,
  error: null,

  loadProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const [progress, available] = await Promise.all([
        progressApi.getUserProgress(),
        progressApi.getAvailableConcepts(),
      ]);
      set({ conceptProgress: progress, availableConcepts: available, isLoading: false });
    } catch (err: unknown) {
      set({
        isLoading: false,
        error: 'Erreur lors du chargement de la progression.',
      });
    }
  },

  loadDueToday: async () => {
    try {
      const count = await sm2Api.getDueTodayCount();
      set({ dueTodayCount: count });
    } catch {
      // Non-critical error
    }
  },

  loadSM2Cards: async () => {
    try {
      const cards = await sm2Api.getDueCards();
      set({ sm2Cards: cards, dueTodayCount: cards.length });
    } catch {
      // Non-critical error
    }
  },

  getConceptStatus: (conceptId: string) => {
    const { conceptProgress, availableConcepts, sm2Cards } = get();
    const progress = conceptProgress[conceptId];

    if (progress?.isValidated) {
      // Check if decaying
      const sm2Card = sm2Cards.find((c) => c.conceptId === conceptId);
      if (sm2Card && sm2Card.decayLevel >= 0.75) {
        return 'decaying';
      }
      return 'mastered';
    }

    if (progress && (
      progress.phase1Done ||
      progress.phase2Done ||
      progress.phase3Done ||
      progress.phase4Done ||
      progress.phase5Done ||
      progress.phase6Done
    )) {
      return 'in_progress';
    }

    if (availableConcepts.includes(conceptId)) {
      return 'available';
    }

    return 'locked';
  },

  refreshProgress: async () => {
    await Promise.all([
      get().loadProgress(),
      get().loadSM2Cards(),
    ]);
  },
}));

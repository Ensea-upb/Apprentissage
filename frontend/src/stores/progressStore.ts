import { create } from 'zustand';
import { progressApi } from '../api/progress';
import { sm2Api } from '../api/sm2';
import { Concept, ConceptProgress, SM2Card } from '../types';

interface ProgressState {
  // conceptProgress keyed by conceptId for O(1) lookup
  conceptProgress: Record<string, ConceptProgress>;
  availableConcepts: Concept[];
  availableConceptIds: Set<string>;
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
  availableConceptIds: new Set(),
  sm2Cards: [],
  dueTodayCount: 0,
  isLoading: false,
  error: null,

  loadProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      // Both calls are independent — run in parallel
      const [progressArray, availableArray] = await Promise.all([
        progressApi.getUserProgress(),     // ConceptProgress[]
        progressApi.getAvailableConcepts(), // Concept[]
      ]);

      // Convert array to Record for O(1) access
      const conceptProgress: Record<string, ConceptProgress> = {};
      for (const p of progressArray) {
        conceptProgress[p.conceptId] = p;
      }

      set({
        conceptProgress,
        availableConcepts: availableArray,
        availableConceptIds: new Set(availableArray.map((c) => c.id)),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, error: 'Erreur lors du chargement de la progression.' });
    }
  },

  loadDueToday: async () => {
    try {
      const count = await sm2Api.getDueTodayCount();
      set({ dueTodayCount: count });
    } catch {
      // Non-critical
    }
  },

  loadSM2Cards: async () => {
    try {
      const { cards, count } = await sm2Api.getDueCards();
      set({ sm2Cards: cards, dueTodayCount: count });
    } catch {
      // Non-critical
    }
  },

  getConceptStatus: (conceptId: string) => {
    const { conceptProgress, availableConceptIds, sm2Cards } = get();
    const progress = conceptProgress[conceptId];

    if (progress?.isValidated) {
      const sm2Card = sm2Cards.find((c) => c.conceptId === conceptId);
      if (sm2Card && sm2Card.decayLevel >= 0.75) return 'decaying';
      return 'mastered';
    }

    if (progress && (
      progress.phase1Done || progress.phase2Done || progress.phase3Done ||
      progress.phase4Done || progress.phase5Done || progress.phase6Done
    )) {
      return 'in_progress';
    }

    if (availableConceptIds.has(conceptId)) return 'available';

    return 'locked';
  },

  refreshProgress: async () => {
    await Promise.all([
      get().loadProgress(),
      get().loadSM2Cards(),
    ]);
  },
}));

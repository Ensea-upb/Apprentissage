/**
 * sm2.service.ts — Algorithme SuperMemo 2 (Wozniak 1987)
 *
 * Implémentation exacte de l'algorithme SM-2.
 * Les champs correspondent au schéma Prisma v3 (n, EF, interval).
 */

export interface SM2Card {
  conceptId: string;
  userId: string;
  n: number;          // nombre de répétitions réussies consécutives
  EF: number;         // easiness factor, min 1.3, début 2.5
  interval: number;   // intervalle en jours
  nextReviewDate: Date;
  qualityHistory: number[];
}

/**
 * SM-2 Algorithm (Wozniak 1987)
 *
 * quality q ∈ {0,1,2,3,4,5}
 *   0 = blackout total
 *   5 = réponse parfaite sans hésitation
 *   3 = réponse correcte avec hésitation significative (seuil de réussite)
 */
export function sm2Update(card: SM2Card, quality: number): SM2Card {
  // Validation stricte
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
    throw new Error(`quality must be an integer in [0,5], got ${quality}`);
  }

  let { n, EF, interval } = card;

  if (quality < 3) {
    // Échec : reset mais l'EF est quand même mis à jour (pénalité)
    n = 0;
    interval = 1;
  } else {
    // Succès
    if (n === 0)      interval = 1;
    else if (n === 1) interval = 6;
    else              interval = Math.round(interval * EF);
    n += 1;
  }

  // Mise à jour EF — formule exacte SM-2
  // EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
  const newEF = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  EF = Math.max(1.3, newEF);  // floor à 1.3

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...card,
    n,
    EF,
    interval,
    nextReviewDate,
    qualityHistory: [...card.qualityHistory, quality],
  };
}

/**
 * Courbe d'Ebbinghaus : rétention R = exp(-t/S)
 * S = stabilité = interval (jours)
 * t = temps écoulé depuis la dernière révision (jours)
 *
 * Retourne decayLevel ∈ [0,1] : 0=frais, 1=oublié
 */
export function computeDecay(lastReviewDate: Date, interval: number): number {
  const now = Date.now();
  const t = (now - lastReviewDate.getTime()) / (1000 * 86400); // jours
  const S = Math.max(1, interval);
  const retention = Math.exp(-t / S);
  return Math.min(1, 1 - retention);
}

/**
 * Map accuracy percentage (0-1) to SM-2 quality score (0-5).
 * accuracy ∈ [0, 1] → quality ∈ {0, 1, 2, 3, 4, 5}
 */
export function accuracyToQuality(accuracy: number): number {
  const clamped = Math.min(1, Math.max(0, accuracy));
  if (clamped >= 0.9) return 5;
  if (clamped >= 0.75) return 4;
  if (clamped >= 0.6) return 3;
  if (clamped >= 0.4) return 2;
  if (clamped >= 0.2) return 1;
  return 0;
}

/**
 * Map errorType to SM-2 quality score.
 * Used for automatic quality assignment based on error taxonomy.
 */
export function errorTypeToQuality(
  errorType: 'conceptual' | 'mathematical' | 'application' | 'reading' | 'none',
): number {
  const map: Record<string, number> = {
    conceptual: 1,
    mathematical: 2,
    application: 3,
    reading: 4,
    none: 5,
  };
  return map[errorType] ?? 3;
}

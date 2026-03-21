export interface SM2Card {
  conceptId: string;
  userId: string;
  repetitionNumber: number;
  easinessFactor: number;
  interval: number;
  nextReviewDate: Date;
  qualityHistory: number[];
}

/**
 * SM-2 Algorithm (SuperMemo 2, Wozniak 1987)
 * quality q ∈ {0,1,2,3,4,5}
 * 0-2: failure → reset
 * 3-5: success
 */
export function sm2Update(card: SM2Card, quality: number): SM2Card {
  let { repetitionNumber: n, easinessFactor: EF, interval: I } = card;

  if (quality < 3) {
    n = 0;
    I = 1;
  } else {
    if (n === 0) I = 1;
    else if (n === 1) I = 6;
    else I = Math.round(I * EF);
    n += 1;
  }

  // EF update formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  EF = Math.max(1.3, EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + I);

  return {
    ...card,
    repetitionNumber: n,
    easinessFactor: EF,
    interval: I,
    nextReviewDate,
    qualityHistory: [...card.qualityHistory, quality],
  };
}

/**
 * Map accuracy percentage to SM-2 quality score
 * accuracy 0-1 → quality 0-5
 */
export function accuracyToQuality(accuracy: number): number {
  if (accuracy >= 0.9) return 5;
  if (accuracy >= 0.75) return 4;
  if (accuracy >= 0.6) return 3;
  if (accuracy >= 0.4) return 2;
  if (accuracy >= 0.2) return 1;
  return 0;
}

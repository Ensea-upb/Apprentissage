/**
 * Ebbinghaus Forgetting Curve: R = e^(-t/S)
 * R: retention (0-1)
 * t: time elapsed in days
 * S: stability factor (= SM-2 interval in days)
 */
export function computeDecay(lastReviewDate: Date, interval: number): number {
  const now = new Date();
  const daysSinceLastReview = (now.getTime() - lastReviewDate.getTime()) / 86400000;
  const stability = Math.max(interval, 1);
  const retention = Math.exp(-daysSinceLastReview / stability);
  return Math.min(1, Math.max(0, 1 - retention));
}

export function getDecayStatus(decayLevel: number): 'fresh' | 'light' | 'moderate' | 'heavy' | 'critical' {
  if (decayLevel < 0.25) return 'fresh';
  if (decayLevel < 0.50) return 'light';
  if (decayLevel < 0.75) return 'moderate';
  if (decayLevel < 0.90) return 'heavy';
  return 'critical';
}

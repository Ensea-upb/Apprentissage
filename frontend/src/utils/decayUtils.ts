export function getDecayColor(decayLevel: number): string {
  if (decayLevel < 0.25) return '#10B981'; // emerald - fresh
  if (decayLevel < 0.50) return '#84CC16'; // lime - good
  if (decayLevel < 0.75) return '#F59E0B'; // amber - warning
  if (decayLevel < 0.90) return '#F97316'; // orange - danger
  return '#F43F5E'; // rose - critical
}

export function getDecayLabel(decayLevel: number): string {
  if (decayLevel < 0.25) return 'Frais';
  if (decayLevel < 0.50) return 'Bon';
  if (decayLevel < 0.75) return 'À réviser';
  if (decayLevel < 0.90) return 'En danger';
  return 'Critique';
}

export function getDecayIcon(decayLevel: number): string {
  if (decayLevel < 0.25) return '🟢';
  if (decayLevel < 0.50) return '🟡';
  if (decayLevel < 0.75) return '🟠';
  if (decayLevel < 0.90) return '🔴';
  return '💀';
}

export function shouldReview(decayLevel: number): boolean {
  return decayLevel >= 0.75;
}

export function getDecayPercentage(decayLevel: number): number {
  return Math.round(decayLevel * 100);
}

export function getRetentionPercentage(decayLevel: number): number {
  return Math.round((1 - decayLevel) * 100);
}

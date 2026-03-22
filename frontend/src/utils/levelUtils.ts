export function getLevelTitle(xp: number): string {
  if (xp <= 500) return 'Data Curieux';
  if (xp <= 2000) return 'Data Apprenti';
  if (xp <= 10000) return 'Data Analyst Junior';
  if (xp <= 30000) return 'Data Scientist';
  if (xp <= 80000) return 'ML Engineer';
  if (xp <= 200000) return 'Senior ML Researcher';
  return 'AI Architect';
}

const XP_THRESHOLDS = [
  0,       // Level 1
  500,     // Level 2
  2000,    // Level 3
  10000,   // Level 4
  30000,   // Level 5
  80000,   // Level 6
  200000,  // Level 7
];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level === 2) return 500;
  if (level === 3) return 2000;
  if (level === 4) return 10000;
  if (level === 5) return 30000;
  if (level === 6) return 80000;
  if (level === 7) return 200000;
  // For higher levels, exponential growth
  return Math.floor(200000 * Math.pow(1.5, level - 7));
}

export function getXPForNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  return getXPForLevel(currentLevel + 1);
}

export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);

  if (nextLevelXP === currentLevelXP) return 100;

  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function getXPRemainingForNextLevel(xp: number): number {
  const nextLevelXP = getXPForNextLevel(xp);
  return Math.max(nextLevelXP - xp, 0);
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

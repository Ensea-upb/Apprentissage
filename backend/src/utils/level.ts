/**
 * Same XP thresholds as frontend/src/utils/levelUtils.ts
 * Keep both in sync if changed.
 */
const XP_THRESHOLDS = [0, 500, 2000, 10000, 30000, 80000, 200000];

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

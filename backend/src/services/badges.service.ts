import { PrismaClient } from '@prisma/client';
import { CONCEPTS } from '../data/concepts';

/** Badge definitions mirroring the seeded DB rows */
export const BADGE_DEFINITIONS = [
  // Learning
  { id: 'first_session',  name: 'Premier pas',       description: 'Première session complétée',   icon: '🎯', category: 'learning', xpReward: 10  },
  { id: 'session_10',     name: 'Étudiant assidu',   description: '10 sessions complétées',        icon: '📚', category: 'learning', xpReward: 50  },
  { id: 'session_50',     name: 'Marathonien',        description: '50 sessions complétées',        icon: '🏅', category: 'learning', xpReward: 200 },
  // Mastery
  { id: 'concept_1',      name: 'Premier concept',   description: 'Premier concept maîtrisé',      icon: '⭐', category: 'mastery',  xpReward: 50  },
  { id: 'concept_5',      name: 'Data Apprenti',     description: '5 concepts maîtrisés',          icon: '📊', category: 'mastery',  xpReward: 100 },
  { id: 'concept_10',     name: 'Data Scientist',    description: '10 concepts maîtrisés',         icon: '🧠', category: 'mastery',  xpReward: 300 },
  { id: 'concept_25',     name: 'Data Expert',       description: '25 concepts maîtrisés',         icon: '🔬', category: 'mastery',  xpReward: 1000},
  // Streak
  { id: 'streak_3',       name: 'Curieux',           description: '3 jours de suite',              icon: '🔥', category: 'streak',   xpReward: 30  },
  { id: 'streak_7',       name: 'Persévérant',       description: '7 jours de suite',              icon: '💪', category: 'streak',   xpReward: 100 },
  { id: 'streak_30',      name: 'Légende',           description: '30 jours de suite',             icon: '👑', category: 'streak',   xpReward: 500 },
  // Performance
  { id: 'perfect_phase',  name: 'Perfectionniste',   description: '100% dans une phase',           icon: '💎', category: 'speed',    xpReward: 50  },
  { id: 'accuracy_80',    name: 'Précis',            description: 'Phase complétée à 80%+',        icon: '🎯', category: 'speed',    xpReward: 25  },
  // Special
  { id: 'ml_pioneer',     name: 'ML Pioneer',        description: 'Premier concept du bloc ML',    icon: '🤖', category: 'special',  xpReward: 100 },
  { id: 'block_complete', name: 'Bloc Maîtrisé',     description: 'Tous les concepts d\'un bloc',  icon: '🏆', category: 'special',  xpReward: 500 },
];

export type BadgeId = (typeof BADGE_DEFINITIONS)[number]['id'];

/**
 * Check which badges the user should now earn and award them.
 * Returns the list of newly earned badges (name + icon) for frontend display.
 */
export async function checkAndAwardBadges(
  userId: string,
  prisma: PrismaClient,
  context?: {
    sessionAccuracy?: number;   // 0-100
    sessionCompleted?: boolean;
    conceptValidated?: boolean;
  },
): Promise<Array<{ id: string; name: string; icon: string }>> {
  // Load user's current earned badges + user stats
  const [earnedRows, user, sessions, validatedConcepts] = await Promise.all([
    prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { streak: true, xp: true } }),
    prisma.learningSession.count({ where: { userId, completedAt: { not: null } } }),
    prisma.conceptProgress.count({ where: { userId, isValidated: true } }),
  ]);

  const earned = new Set(earnedRows.map((r) => r.badgeId));
  const toAward: BadgeId[] = [];

  const streak = user?.streak ?? 0;

  // — Learning badges —
  if (!earned.has('first_session') && sessions >= 1) toAward.push('first_session');
  if (!earned.has('session_10')    && sessions >= 10) toAward.push('session_10');
  if (!earned.has('session_50')    && sessions >= 50) toAward.push('session_50');

  // — Mastery badges —
  if (!earned.has('concept_1')  && validatedConcepts >= 1)  toAward.push('concept_1');
  if (!earned.has('concept_5')  && validatedConcepts >= 5)  toAward.push('concept_5');
  if (!earned.has('concept_10') && validatedConcepts >= 10) toAward.push('concept_10');
  if (!earned.has('concept_25') && validatedConcepts >= 25) toAward.push('concept_25');

  // — Streak badges —
  if (!earned.has('streak_3')  && streak >= 3)  toAward.push('streak_3');
  if (!earned.has('streak_7')  && streak >= 7)  toAward.push('streak_7');
  if (!earned.has('streak_30') && streak >= 30) toAward.push('streak_30');

  // — Performance badges (context-based) —
  if (context?.sessionAccuracy !== undefined) {
    if (!earned.has('perfect_phase') && context.sessionAccuracy === 100) toAward.push('perfect_phase');
    if (!earned.has('accuracy_80')   && context.sessionAccuracy >= 80)   toAward.push('accuracy_80');
  }

  // — Special: ML Pioneer (concept from blockId=3 validated) —
  if (!earned.has('ml_pioneer') && validatedConcepts > 0) {
    const mlBlock = CONCEPTS.filter((c) => c.blockId === 3).map((c) => c.id);
    if (mlBlock.length > 0) {
      const mlProgress = await prisma.conceptProgress.count({
        where: { userId, conceptId: { in: mlBlock }, isValidated: true },
      });
      if (mlProgress >= 1) toAward.push('ml_pioneer');
    }
  }

  // — Special: Block Complete (all concepts in any block validated) —
  if (!earned.has('block_complete') && validatedConcepts > 0) {
    const blockIds = [...new Set(CONCEPTS.map((c) => c.blockId))];
    for (const blockId of blockIds) {
      const blockConceptIds = CONCEPTS.filter((c) => c.blockId === blockId).map((c) => c.id);
      if (blockConceptIds.length === 0) continue;
      const completedInBlock = await prisma.conceptProgress.count({
        where: { userId, conceptId: { in: blockConceptIds }, isValidated: true },
      });
      if (completedInBlock >= blockConceptIds.length) {
        toAward.push('block_complete');
        break;
      }
    }
  }

  if (toAward.length === 0) return [];

  // Award all new badges in one go
  const now = new Date();
  await prisma.userBadge.createMany({
    data: toAward.map((badgeId) => ({ userId, badgeId, earnedAt: now })),
    skipDuplicates: true,
  });

  // Return badge definitions for the newly awarded badges
  return toAward.map((id) => {
    const def = BADGE_DEFINITIONS.find((b) => b.id === id)!;
    return { id, name: def.name, icon: def.icon };
  });
}

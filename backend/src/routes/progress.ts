import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { CONCEPTS } from '../data/concepts';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// XP rewards from gamification table
const XP_REWARDS = {
  phaseComplete: 50,
  conceptValidated: 200,
  moduleValidated: 500,
  blockValidated: 2000,
};
const COIN_REWARDS = {
  phaseComplete: 20,
  conceptValidated: 100,
  moduleValidated: 200,
  blockValidated: 500,
};

// GET /api/progress/stats — summary for dashboard/profile
router.get('/stats', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const [progress, sessions] = await Promise.all([
      prisma.conceptProgress.findMany({ where: { userId } }),
      prisma.learningSession.findMany({
        where: { userId, completedAt: { not: null } },
        orderBy: { completedAt: 'desc' },
      }),
    ]);

    const validated = progress.filter((p) => p.isValidated).length;
    const totalXp = progress.reduce((sum, p) => sum + p.xpEarned, 0);
    const totalSessions = sessions.length;
    const totalCorrect = sessions.reduce((s, sess) => s + sess.correctAnswers, 0);
    const totalAsked = sessions.reduce((s, sess) => s + sess.questionsAsked, 0);

    // Aggregate error types across all sessions
    const errorBreakdown: Record<string, number> = {};
    for (const sess of sessions) {
      const errors = sess.errorTypes as Record<string, number>;
      for (const [k, v] of Object.entries(errors)) {
        errorBreakdown[k] = (errorBreakdown[k] || 0) + v;
      }
    }

    // Recent activity (last 10 completed sessions)
    const recentActivity = sessions.slice(0, 10).map((sess) => {
      const concept = CONCEPTS.find((c) => c.id === sess.conceptId);
      return {
        date: (sess.completedAt ?? sess.startedAt).toISOString(),
        conceptId: sess.conceptId,
        conceptLabel: concept?.label ?? sess.conceptId,
        phase: sess.phase,
        xpEarned: sess.xpEarned,
        accuracy: sess.questionsAsked > 0
          ? (sess.correctAnswers / sess.questionsAsked) * 100
          : 0,
      };
    });

    // Per-block skill levels (0-100) for radar chart
    const SKILL_BLOCKS: Array<{ subject: string; blockIds: number[] }> = [
      { subject: 'Maths',        blockIds: [0] },
      { subject: 'Données',      blockIds: [1, 2] },
      { subject: 'ML',           blockIds: [3] },
      { subject: 'Deep Learning',blockIds: [4, 5] },
      { subject: 'NLP / LLM',   blockIds: [6, 8] },
      { subject: 'MLOps / BDD',  blockIds: [7, 9, 10] },
    ];

    const validatedIds = new Set(progress.filter((p) => p.isValidated).map((p) => p.conceptId));

    const skills = SKILL_BLOCKS.map(({ subject, blockIds }) => {
      const blockConcepts = CONCEPTS.filter((c) => blockIds.includes(c.blockId));
      const total = blockConcepts.length;
      if (total === 0) return { subject, value: 0 };
      const mastered = blockConcepts.filter((c) => validatedIds.has(c.id)).length;
      return { subject, value: Math.round((mastered / total) * 100) };
    });

    res.json({
      conceptsMastered: validated,
      totalConcepts: progress.length,
      totalXP: totalXp,
      averageAccuracy: totalAsked > 0 ? (totalCorrect / totalAsked) * 100 : 0,
      totalSessions,
      errorBreakdown,
      recentActivity,
      skills,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress/available — concepts whose prerequisites are all validated
// MUST be before /:conceptId to avoid route shadowing
router.get('/available', async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.conceptProgress.findMany({
      where: { userId: req.userId },
    });
    const masteredIds = new Set(progress.filter((p) => p.isValidated).map((p) => p.conceptId));

    const available = CONCEPTS.filter((concept) => {
      if (masteredIds.has(concept.id)) return false;
      return concept.prerequisites.every((prereqId) => masteredIds.has(prereqId));
    });

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress — all user progress entries
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.conceptProgress.findMany({
      where: { userId: req.userId },
    });
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress/:conceptId — single concept progress
// MUST be after all specific GET routes (stats, available)
router.get('/:conceptId', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const conceptId = req.params.conceptId as string;
  try {
    const progress = await prisma.conceptProgress.findUnique({
      where: { userId_conceptId: { userId, conceptId } },
    });
    if (!progress) {
      res.status(404).json({ error: 'No progress found for this concept' });
      return;
    }
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/progress/:conceptId/phase/:phase/complete
router.post('/:conceptId/phase/:phase/complete', async (req: AuthRequest, res: Response) => {
  const conceptId = req.params.conceptId as string;
  const phase = req.params.phase as string;
  const phaseNum = parseInt(phase);
  const userId = req.userId!;

  if (isNaN(phaseNum) || phaseNum < 1 || phaseNum > 6) {
    res.status(400).json({ error: 'Invalid phase (1-6)' });
    return;
  }

  const concept = CONCEPTS.find((c) => c.id === conceptId);
  if (!concept) {
    res.status(404).json({ error: 'Concept not found' });
    return;
  }

  type PhaseField = 'phase1Done' | 'phase2Done' | 'phase3Done' | 'phase4Done' | 'phase5Done' | 'phase6Done';
  const phaseField = `phase${phaseNum}Done` as PhaseField;

  try {
    // Use a transaction to prevent double-XP race conditions
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.conceptProgress.findUnique({
        where: { userId_conceptId: { userId, conceptId } },
      });

      // Idempotency: phase already completed → return current state without granting XP again
      if (existing && existing[phaseField] === true) {
        return { alreadyDone: true, existing };
      }

      // Compute phase states after this update
      const afterUpdate = {
        phase1Done: existing?.phase1Done ?? false,
        phase2Done: existing?.phase2Done ?? false,
        phase3Done: existing?.phase3Done ?? false,
        phase4Done: existing?.phase4Done ?? false,
        phase5Done: existing?.phase5Done ?? false,
        phase6Done: existing?.phase6Done ?? false,
        [phaseField]: true,
      };

      const allMandatoryDone =
        afterUpdate.phase1Done && afterUpdate.phase2Done &&
        afterUpdate.phase3Done && afterUpdate.phase4Done && afterUpdate.phase5Done;

      let xpEarned = XP_REWARDS.phaseComplete;
      let coinsEarned = COIN_REWARDS.phaseComplete;
      const updateData: Record<string, boolean | Date> = { [phaseField]: true };

      if (allMandatoryDone && !existing?.isValidated) {
        updateData.isValidated = true;
        updateData.completedAt = new Date();
        xpEarned += XP_REWARDS.conceptValidated;
        coinsEarned += COIN_REWARDS.conceptValidated;
      }

      const progress = await tx.conceptProgress.upsert({
        where: { userId_conceptId: { userId, conceptId } },
        update: { ...updateData, xpEarned: { increment: xpEarned } },
        create: { userId, conceptId, xpEarned, ...updateData },
      });

      await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: xpEarned }, dataCoins: { increment: coinsEarned } },
      });

      // When concept is newly validated, create or reset its SM-2 review card
      if (updateData.isValidated) {
        await tx.sM2Card.upsert({
          where: { userId_conceptId: { userId, conceptId } },
          update: { nextReviewDate: new Date() },
          create: { userId, conceptId },
        });
      }

      return { alreadyDone: false, progress, xpEarned, coinsEarned, conceptValidated: !!updateData.isValidated };
    });

    if (result.alreadyDone) {
      res.status(200).json({ success: true, message: 'Phase already completed', xpEarned: 0, coinsEarned: 0, conceptValidated: false });
      return;
    }

    const { xpEarned, coinsEarned, conceptValidated } = result as { xpEarned: number; coinsEarned: number; conceptValidated: boolean };
    res.json({ success: true, xpEarned, coinsEarned, conceptValidated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

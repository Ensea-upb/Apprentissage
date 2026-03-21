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

// GET /api/progress
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

// GET /api/progress/available - concepts whose prerequisites are all validated
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

// POST /api/progress/:conceptId/phase/:phase/complete
router.post('/:conceptId/phase/:phase/complete', async (req: AuthRequest, res: Response) => {
  const { conceptId, phase } = req.params;
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

  try {
    const phaseField = `phase${phaseNum}Done` as keyof {
      phase1Done: boolean; phase2Done: boolean; phase3Done: boolean;
      phase4Done: boolean; phase5Done: boolean; phase6Done: boolean;
    };

    const existing = await prisma.conceptProgress.findUnique({
      where: { userId_conceptId: { userId, conceptId } },
    });

    const updateData: Record<string, boolean | string | number | Date> = { [phaseField]: true };

    // Check if all mandatory phases (1-5) are done → validate concept
    const afterUpdate = {
      phase1Done: existing?.phase1Done || false,
      phase2Done: existing?.phase2Done || false,
      phase3Done: existing?.phase3Done || false,
      phase4Done: existing?.phase4Done || false,
      phase5Done: existing?.phase5Done || false,
      phase6Done: existing?.phase6Done || false,
      [phaseField]: true,
    };

    const allMandatoryDone = afterUpdate.phase1Done && afterUpdate.phase2Done &&
      afterUpdate.phase3Done && afterUpdate.phase4Done && afterUpdate.phase5Done;

    let xpEarned = XP_REWARDS.phaseComplete;
    let coinsEarned = COIN_REWARDS.phaseComplete;

    if (allMandatoryDone && !existing?.isValidated) {
      updateData.isValidated = true;
      updateData.completedAt = new Date();
      xpEarned += XP_REWARDS.conceptValidated;
      coinsEarned += COIN_REWARDS.conceptValidated;
    }

    await prisma.conceptProgress.upsert({
      where: { userId_conceptId: { userId, conceptId } },
      update: { ...updateData, xpEarned: { increment: xpEarned } },
      create: {
        userId,
        conceptId,
        xpEarned,
        ...updateData,
      },
    });

    // Award XP and DataCoins to user
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned }, dataCoins: { increment: coinsEarned } },
    });

    res.json({ success: true, xpEarned, coinsEarned, conceptValidated: !!updateData.isValidated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

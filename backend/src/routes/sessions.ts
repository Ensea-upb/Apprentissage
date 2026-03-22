import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// GET /api/sessions — user's recent sessions
router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const sessions = await prisma.learningSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sessions/:id — single session
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.userId!;
  try {
    const session = await prisma.learningSession.findFirst({ where: { id, userId } });
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sessions/start
router.post('/start', async (req: AuthRequest, res: Response) => {
  const { conceptId, phase } = req.body as { conceptId: string; phase: number };
  const userId = req.userId!;

  if (!conceptId || !phase) {
    res.status(400).json({ error: 'conceptId and phase required' });
    return;
  }

  try {
    const session = await prisma.learningSession.create({
      data: { userId, conceptId, phase, livesRemaining: 3 },
    });
    res.status(201).json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sessions/:id/answer
router.post('/:id/answer', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { isCorrect, errorType } = req.body as { isCorrect: boolean; errorType?: string };
  const userId = req.userId!;

  try {
    const session = await prisma.learningSession.findFirst({
      where: { id, userId },
    });
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const errorTypes = (session.errorTypes as Record<string, number>) || {};
    if (!isCorrect && errorType) {
      errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
    }

    const xpGain = isCorrect ? 10 : 0;
    const coinGain = isCorrect ? 5 : 0;

    const updated = await prisma.learningSession.update({
      where: { id },
      data: {
        questionsAsked: { increment: 1 },
        correctAnswers: isCorrect ? { increment: 1 } : undefined,
        livesRemaining: !isCorrect ? Math.max(0, session.livesRemaining - 1) : undefined,
        errorTypes,
        xpEarned: { increment: xpGain },
      },
    });

    if (xpGain > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpGain }, dataCoins: { increment: coinGain } },
      });
    }

    res.json({
      session: updated,
      xpGained: xpGain,
      livesRemaining: updated.livesRemaining,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sessions/:id/complete
router.post('/:id/complete', async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.userId!;

  try {
    const session = await prisma.learningSession.findFirst({ where: { id, userId } });
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const completed = await prisma.learningSession.update({
      where: { id },
      data: { completedAt: new Date() },
    });

    const accuracy = completed.questionsAsked > 0
      ? (completed.correctAnswers / completed.questionsAsked) * 100
      : 0;

    res.json({
      sessionId: completed.id,
      conceptId: completed.conceptId,
      phase: completed.phase,
      questionsAsked: completed.questionsAsked,
      correctAnswers: completed.correctAnswers,
      accuracy,
      xpEarned: completed.xpEarned,
      errorBreakdown: completed.errorTypes,
      phaseCompleted: accuracy >= 60,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

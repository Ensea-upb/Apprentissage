import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sm2Update, accuracyToQuality } from '../services/sm2.service';
import { computeDecay } from '../services/decay.service';

const router = Router();
const prisma = new PrismaClient();
router.use(authenticateToken);

// GET /api/sm2 — all SM-2 cards for the user
router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const cards = await prisma.sM2Card.findMany({ where: { userId }, orderBy: { nextReviewDate: 'asc' } });
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sm2/due-today/count — number of cards due (lightweight)
router.get('/due-today/count', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const now = new Date();
  try {
    const count = await prisma.sM2Card.count({ where: { userId, nextReviewDate: { lte: now } } });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sm2/due-today
router.get('/due-today', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const now = new Date();

  try {
    const cards = await prisma.sM2Card.findMany({
      where: { userId, nextReviewDate: { lte: now } },
      orderBy: { nextReviewDate: 'asc' },
    });

    // Fetch concept metadata from DB
    const conceptIds = cards.map((c) => c.conceptId);
    const concepts = await prisma.concept.findMany({ where: { id: { in: conceptIds } } });
    const conceptMap = new Map(concepts.map((c): [string, typeof c] => [c.id, c]));

    // Update decay levels and enrich with concept metadata
    const updated = cards.map((card) => {
      const concept = conceptMap.get(card.conceptId);
      return {
        ...card,
        decayLevel: computeDecay(card.lastReviewDate, card.interval),
        conceptLabel: concept?.name,
        blockName: concept ? `Block ${concept.block}` : undefined,
      };
    });

    res.json({ cards: updated, count: updated.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sm2/:conceptId — single card (must be after all named routes)
router.get('/:conceptId', async (req: AuthRequest, res: Response) => {
  const conceptId = req.params.conceptId as string;
  const userId = req.userId!;
  try {
    const card = await prisma.sM2Card.findUnique({ where: { userId_conceptId: { userId, conceptId } } });
    if (!card) {
      res.status(404).json({ error: 'SM-2 card not found' });
      return;
    }
    res.json({ ...card, decayLevel: computeDecay(card.lastReviewDate, card.interval) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sm2/:conceptId/review
router.post('/:conceptId/review', async (req: AuthRequest, res: Response) => {
  const conceptId = req.params.conceptId as string;
  const { quality } = req.body as { quality: number };
  const userId = req.userId!;

  if (quality === undefined || quality < 0 || quality > 5) {
    res.status(400).json({ error: 'quality must be 0-5' });
    return;
  }

  try {
    let card = await prisma.sM2Card.findUnique({
      where: { userId_conceptId: { userId, conceptId } },
    });

    if (!card) {
      card = await prisma.sM2Card.create({
        data: { userId, conceptId },
      });
    }

    const sm2Input = {
      conceptId: card.conceptId,
      userId: card.userId,
      n: card.n,
      EF: card.EF,
      interval: card.interval,
      nextReviewDate: card.nextReviewDate,
      qualityHistory: card.qualityHistory,
    };

    const updated = sm2Update(sm2Input, quality);
    const newDecayLevel = computeDecay(new Date(), updated.interval);

    const saved = await prisma.sM2Card.update({
      where: { userId_conceptId: { userId, conceptId } },
      data: {
        n: updated.n,
        EF: updated.EF,
        interval: updated.interval,
        nextReviewDate: updated.nextReviewDate,
        lastReviewDate: new Date(),
        qualityHistory: updated.qualityHistory,
        decayLevel: newDecayLevel,
      },
    });

    res.json({
      card: saved,
      newInterval: saved.interval,
      newEasinessFactor: saved.EF,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sm2/:conceptId/init - create or reset SM2 card for a concept
router.post('/:conceptId/init', async (req: AuthRequest, res: Response) => {
  const conceptId = req.params.conceptId as string;
  const userId = req.userId!;

  try {
    const card = await prisma.sM2Card.upsert({
      where: { userId_conceptId: { userId, conceptId } },
      update: {},
      create: { userId, conceptId },
    });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

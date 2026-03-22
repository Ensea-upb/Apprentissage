import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { BADGE_DEFINITIONS } from '../services/badges.service';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

// GET /api/badges — all badges with earned status for the current user
router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const [allBadges, earnedRows] = await Promise.all([
      prisma.badge.findMany({ orderBy: [{ category: 'asc' }, { id: 'asc' }] }),
      prisma.userBadge.findMany({ where: { userId } }),
    ]);

    const earnedMap = new Map(earnedRows.map((r): [string, Date] => [r.badgeId, r.earnedAt]));

    const badges = allBadges.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      icon: b.icon,
      category: b.category,
      xpReward: b.xpReward,
      earned: earnedMap.has(b.id),
      earnedAt: earnedMap.get(b.id)?.toISOString() ?? null,
    }));

    res.json({ badges, earnedCount: earnedMap.size, totalCount: allBadges.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/badges/earned — only the user's earned badges
router.get('/earned', async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const earned = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    const badges = earned.map((r) => ({
      id: r.badge.id,
      name: r.badge.name,
      description: r.badge.description,
      icon: r.badge.icon,
      category: r.badge.category,
      xpReward: r.badge.xpReward,
      earned: true,
      earnedAt: r.earnedAt.toISOString(),
    }));

    res.json({ badges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

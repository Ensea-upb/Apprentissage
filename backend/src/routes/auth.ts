import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET!; // validated at startup in index.ts
const JWT_EXPIRES = '7d';

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({ min: 3, max: 20 }).trim(),
    body('password').isLength({ min: 8 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, username, password } = req.body as { email: string; username: string; password: string };

    try {
      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });
      if (existing) {
        res.status(409).json({ error: 'Email or username already in use' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, username, passwordHash },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          level: user.level,
          xp: user.xp,
          dataCoins: user.dataCoins,
          streak: user.streak,
          eloRating: user.eloRating,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Update last active and streak — compare UTC dates to avoid timezone issues
      const todayUTC = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
      const yesterdayDate = new Date();
      yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
      const yesterdayUTC = yesterdayDate.toISOString().slice(0, 10);
      const lastActiveUTC = user.lastActiveAt.toISOString().slice(0, 10);

      let newStreak = user.streak;
      if (lastActiveUTC === yesterdayUTC) {
        newStreak += 1;
      } else if (lastActiveUTC !== todayUTC) {
        newStreak = 1; // Streak broken
      }
      // If lastActiveUTC === todayUTC → already logged in today, keep streak unchanged

      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date(), streak: newStreak },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          level: user.level,
          xp: user.xp,
          dataCoins: user.dataCoins,
          streak: newStreak,
          eloRating: user.eloRating,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      level: user.level,
      xp: user.xp,
      dataCoins: user.dataCoins,
      streak: user.streak,
      eloRating: user.eloRating,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout (stateless JWT: client drops the token; server acknowledges)
router.post('/logout', authenticateToken, (_req: AuthRequest, res: Response) => {
  res.json({ success: true });
});

export default router;

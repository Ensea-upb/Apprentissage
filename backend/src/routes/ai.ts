/**
 * ai.ts — Routes IA v3
 *
 * L'IA joue des rôles délimités — elle n'est plus utilisée pour générer des questions.
 * Les questions sont servies depuis la base statique (table Question).
 *
 * Endpoints v3 :
 *   GET  /api/ai/questions/:conceptId/:phase — questions statiques depuis la DB
 *   POST /api/ai/evaluate-open              — évaluation rubric pour questions ouvertes
 *   POST /api/ai/variant                    — variante après 3 échecs
 *   POST /api/ai/socrates                   — dialogue socratique
 *   POST /api/ai/documentation              — docs ciblées après 3 erreurs
 *   POST /api/ai/evaluate-answer            — évaluation simple (rétro-compat)
 *   GET  /api/ai/insight, /daily-insight    — insight quotidien
 */

import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import {
  evaluateOpenAnswer,
  generateVariant,
  socratesNext,
  generateDocumentation,
  evaluateAnswer,
  getDailyInsight,
  userApiKeyContext,
  SocratesMessage,
} from '../services/ai.service';

const router = Router();
const prisma = new PrismaClient();
router.use(authenticateToken);

// If the client sends X-User-Api-Key, run the rest of the chain inside the
// AsyncLocalStorage context so callClaude picks it up automatically.
router.use((req: AuthRequest, res: Response, next: NextFunction) => {
  const key = req.headers['x-user-api-key'];
  if (typeof key === 'string' && key.startsWith('sk-ant-')) {
    userApiKeyContext.run(key, next);
  } else {
    next();
  }
});

// ─── GET /api/ai/questions/:conceptId/:phase ──────────────────────────────────
// Serve static questions from DB (v3 — replaces AI generation)

router.get('/questions/:conceptId/:phase', async (req: AuthRequest, res: Response) => {
  const conceptId = req.params.conceptId as string;
  const phase = parseInt(req.params.phase as string, 10);

  if (!conceptId || isNaN(phase) || phase < 1 || phase > 6) {
    res.status(400).json({ error: 'conceptId and phase (1-6) required' });
    return;
  }

  try {
    const questions = await prisma.question.findMany({
      where: { conceptId, phase },
      orderBy: { difficulty: 'asc' },
    });

    if (questions.length === 0) {
      res.status(404).json({
        error: 'No questions found for this concept/phase',
        hint: 'Run npm run db:seed in the backend to seed static questions',
      });
      return;
    }

    // Return the content of each question (the full static structure)
    res.json({
      questions: questions.map((q) => ({
        ...(q.content as object),
        _meta: { isStatic: q.isStatic, variantOf: q.variantOf },
      })),
      total: questions.length,
    });
  } catch (err) {
    console.error('Questions fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// ─── POST /api/ai/evaluate-open ───────────────────────────────────────────────
// Évaluation rubric pour les questions ouvertes (Phase 6, résumés)

router.post('/evaluate-open', async (req: AuthRequest, res: Response) => {
  const { conceptId, questionId, userAnswer, expectedKeyPoints, rubricWeight } = req.body as {
    conceptId: string;
    questionId: string;
    userAnswer: string;
    expectedKeyPoints: string[];
    rubricWeight: number[];
  };

  if (!conceptId || !questionId || !userAnswer || !Array.isArray(expectedKeyPoints)) {
    res.status(400).json({ error: 'conceptId, questionId, userAnswer, expectedKeyPoints required' });
    return;
  }

  try {
    const result = await evaluateOpenAnswer({
      conceptId,
      questionId,
      userAnswer,
      expectedKeyPoints,
      rubricWeight: rubricWeight ?? expectedKeyPoints.map(() => 1),
    });
    res.json(result);
  } catch (err) {
    console.error('Open answer evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// ─── POST /api/ai/variant ─────────────────────────────────────────────────────
// Génère une variante après 3 échecs consécutifs sur la même question

router.post('/variant', async (req: AuthRequest, res: Response) => {
  const { originalQuestion, conceptId, failureReason, attemptCount } = req.body as {
    originalQuestion: Record<string, unknown>;
    conceptId: string;
    failureReason: 'conceptual' | 'mathematical' | 'application' | 'reading';
    attemptCount: number;
  };

  if (!originalQuestion || !conceptId || !failureReason) {
    res.status(400).json({ error: 'originalQuestion, conceptId, failureReason required' });
    return;
  }

  if (!['conceptual', 'mathematical', 'application', 'reading'].includes(failureReason)) {
    res.status(400).json({ error: 'failureReason must be one of: conceptual|mathematical|application|reading' });
    return;
  }

  try {
    const variant = await generateVariant({
      originalQuestion,
      conceptId,
      failureReason,
      attemptCount: attemptCount ?? 3,
    });
    res.json({ variant });
  } catch (err) {
    console.error('Variant generation error:', err);
    res.status(500).json({ error: 'Failed to generate variant' });
  }
});

// ─── POST /api/ai/socrates ────────────────────────────────────────────────────
// Dialogue socratique — question plus profonde

router.post('/socrates', async (req: AuthRequest, res: Response) => {
  const { conceptId, conceptName, conversationHistory, currentDepth } = req.body as {
    conceptId: string;
    conceptName: string;
    conversationHistory: SocratesMessage[];
    currentDepth: number;
  };

  if (!conceptId || !conceptName) {
    res.status(400).json({ error: 'conceptId and conceptName required' });
    return;
  }

  try {
    const response = await socratesNext({
      conceptId,
      conceptName,
      conversationHistory: conversationHistory ?? [],
      currentDepth: currentDepth ?? 0,
    });
    res.json(response);
  } catch (err) {
    console.error('Socrates error:', err);
    res.status(500).json({ error: 'Failed to generate socratic question' });
  }
});

// ─── POST /api/ai/documentation ──────────────────────────────────────────────
// Documentation ciblée après 3 erreurs consécutives

router.post('/documentation', async (req: AuthRequest, res: Response) => {
  const { conceptId, conceptName, questionContext, errorType } = req.body as {
    conceptId: string;
    conceptName: string;
    questionContext: string;
    errorType: 'conceptual' | 'mathematical' | 'application' | 'reading';
  };

  if (!conceptId || !conceptName || !errorType) {
    res.status(400).json({ error: 'conceptId, conceptName, errorType required' });
    return;
  }

  try {
    const docs = await generateDocumentation({
      conceptId,
      conceptName,
      questionContext: questionContext ?? '',
      errorType,
    });
    res.json(docs);
  } catch (err) {
    console.error('Documentation generation error:', err);
    res.status(500).json({ error: 'Failed to generate documentation' });
  }
});

// ─── POST /api/ai/evaluate-answer — rétrocompatiblité ────────────────────────

router.post('/evaluate-answer', async (req: AuthRequest, res: Response) => {
  const { question, userAnswer, conceptId } = req.body as {
    question: string;
    userAnswer: string;
    conceptId: string;
  };

  if (!question || !userAnswer || !conceptId) {
    res.status(400).json({ error: 'question, userAnswer, and conceptId required' });
    return;
  }

  try {
    // Try to get concept name from DB
    const concept = await prisma.concept.findUnique({ where: { id: conceptId } });
    const conceptLabel = concept?.name ?? conceptId;
    const result = await evaluateAnswer(question, userAnswer, conceptId, conceptLabel);
    res.json(result);
  } catch (err) {
    console.error('AI evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// ─── GET /api/ai/insight + /daily-insight ────────────────────────────────────

const STATIC_INSIGHT = {
  id: 'static-insight-001',
  title: 'La règle des 80/20 en Data Science',
  content: '80% du temps d\'un projet Data Science est consacré à la collecte, nettoyage et préparation des données. Seulement 20% est dédié à la modélisation.',
  category: 'best_practice',
};

router.get('/insight', async (req: AuthRequest, res: Response) => {
  const recentConcepts = ((req.query.concepts as string) || '').split(',').filter(Boolean);
  try {
    const insight = await getDailyInsight(recentConcepts);
    res.json(insight);
  } catch (err) {
    console.error('AI insight error:', err);
    res.json(STATIC_INSIGHT);
  }
});

router.get('/daily-insight', async (req: AuthRequest, res: Response) => {
  const recentConcepts = ((req.query.concepts as string) || '').split(',').filter(Boolean);
  try {
    const insight = await getDailyInsight(recentConcepts);
    res.json(insight);
  } catch (err) {
    console.error('AI insight error:', err);
    res.json(STATIC_INSIGHT);
  }
});

export default router;

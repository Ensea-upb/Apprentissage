import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateQuestions, evaluateAnswer, getDailyInsight } from '../services/ai.service';
import { CONCEPTS } from '../data/concepts';

const router = Router();
router.use(authenticateToken);

// POST /api/ai/generate-questions
router.post('/generate-questions', async (req: AuthRequest, res: Response) => {
  const { conceptId, phase, count } = req.body as {
    conceptId: string;
    phase: number;
    count?: number;
  };

  if (!conceptId || !phase) {
    res.status(400).json({ error: 'conceptId and phase required' });
    return;
  }

  const concept = CONCEPTS.find((c) => c.id === conceptId);
  if (!concept) {
    res.status(404).json({ error: 'Concept not found' });
    return;
  }

  const questionCount = count || (phase === 1 ? 10 : phase === 2 ? 10 : 8);

  try {
    const result = await generateQuestions(
      concept.id,
      concept.label,
      concept.moduleName,
      concept.blockName,
      phase,
      questionCount,
    );
    res.json(result);
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// POST /api/ai/evaluate-answer
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

  const concept = CONCEPTS.find((c) => c.id === conceptId);
  const conceptLabel = concept?.label || conceptId;

  try {
    const result = await evaluateAnswer(question, userAnswer, conceptId, conceptLabel);
    res.json(result);
  } catch (err) {
    console.error('AI evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// POST /api/ai/explain — explain a concept or why an answer was wrong
router.post('/explain', async (req: AuthRequest, res: Response) => {
  const { conceptId, errorType, userAnswer } = req.body as {
    conceptId: string;
    errorType?: string;
    userAnswer?: string;
  };

  if (!conceptId) {
    res.status(400).json({ error: 'conceptId required' });
    return;
  }

  const concept = CONCEPTS.find((c) => c.id === conceptId);
  if (!concept) {
    res.status(404).json({ error: 'Concept not found' });
    return;
  }

  // Sanitize inputs before building prompt
  const safeConceptLabel = concept.label.replace(/[`"\\]/g, '');
  const safeModuleName = concept.moduleName.replace(/[`"\\]/g, '');
  const safeUserAnswer = userAnswer ? userAnswer.slice(0, 500).replace(/[`"\\]/g, '') : '';
  const safeErrorType = errorType ? errorType.slice(0, 100).replace(/[`"\\]/g, '') : '';

  try {
    const result = await evaluateAnswer(
      `Explain the concept "${safeConceptLabel}" from module "${safeModuleName}"${safeErrorType ? `, focusing on the error type: ${safeErrorType}` : ''}${safeUserAnswer ? `. Student answer: ${safeUserAnswer}` : ''}`,
      safeUserAnswer || '(no answer provided)',
      conceptId,
      safeConceptLabel,
    );
    res.json({ explanation: result.feedback });
  } catch (err) {
    console.error('AI explain error:', err);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// GET /api/ai/insight — daily data science insight
router.get('/insight', async (req: AuthRequest, res: Response) => {
  const recentConcepts = (req.query.concepts as string || '').split(',').filter(Boolean);
  try {
    const insight = await getDailyInsight(recentConcepts);
    res.json(insight);
  } catch (err) {
    console.error('AI insight error:', err);
    res.status(500).json({ error: 'Failed to generate insight' });
  }
});

// GET /api/ai/daily-insight — alias for /insight (frontend compatibility)
router.get('/daily-insight', async (req: AuthRequest, res: Response) => {
  const recentConcepts = (req.query.concepts as string || '').split(',').filter(Boolean);
  try {
    const insight = await getDailyInsight(recentConcepts);
    res.json(insight);
  } catch (err) {
    console.error('AI insight error:', err);
    res.status(500).json({ error: 'Failed to generate insight' });
  }
});

export default router;

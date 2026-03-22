import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateQuestions, evaluateAnswer, getDailyInsight } from '../services/ai.service';
import { CONCEPTS } from '../data/concepts';

function buildFallbackQuestions(conceptLabel: string, count: number) {
  const base = [
    {
      id: 'fq-1',
      type: 'mcq' as const,
      question: `Quelle est la définition la plus précise de "${conceptLabel}" ?`,
      options: [
        `${conceptLabel} est une technique fondamentale en Data Science.`,
        `${conceptLabel} est uniquement utilisé en statistiques descriptives.`,
        `${conceptLabel} ne s'applique qu'aux données non structurées.`,
        `${conceptLabel} est un algorithme de tri.`,
      ],
      correctAnswer: `${conceptLabel} est une technique fondamentale en Data Science.`,
      explanation: `${conceptLabel} joue un rôle central dans l'analyse et la modélisation des données.`,
      difficulty: 1,
    },
    {
      id: 'fq-2',
      type: 'truefalse' as const,
      question: `${conceptLabel} peut être utilisé dans des pipelines de Machine Learning.`,
      options: ['Vrai', 'Faux'],
      correctAnswer: 'Vrai',
      explanation: `La plupart des concepts fondamentaux comme ${conceptLabel} s'intègrent dans des pipelines ML.`,
      difficulty: 1,
    },
    {
      id: 'fq-3',
      type: 'mcq' as const,
      question: `Dans quel contexte applique-t-on typiquement ${conceptLabel} ?`,
      options: [
        'Lors de la phase d\'exploration et de préparation des données.',
        'Uniquement lors de la mise en production.',
        'Seulement pour les images.',
        'Exclusivement pour les séries temporelles.',
      ],
      correctAnswer: 'Lors de la phase d\'exploration et de préparation des données.',
      explanation: `${conceptLabel} intervient principalement dans les premières phases du cycle de vie d'un projet Data Science.`,
      difficulty: 2,
    },
    {
      id: 'fq-4',
      type: 'mcq' as const,
      question: `Quel avantage principal offre la maîtrise de ${conceptLabel} ?`,
      options: [
        'Améliorer la qualité et la pertinence des modèles.',
        'Éliminer le besoin de données.',
        'Remplacer tous les autres algorithmes.',
        'Aucun avantage mesurable.',
      ],
      correctAnswer: 'Améliorer la qualité et la pertinence des modèles.',
      explanation: `Comprendre ${conceptLabel} permet de construire des modèles plus robustes et interprétables.`,
      difficulty: 2,
    },
    {
      id: 'fq-5',
      type: 'truefalse' as const,
      question: `${conceptLabel} nécessite une bonne compréhension des mathématiques sous-jacentes pour être utilisé efficacement.`,
      options: ['Vrai', 'Faux'],
      correctAnswer: 'Vrai',
      explanation: `Comme la plupart des concepts en Data Science, ${conceptLabel} repose sur des fondations mathématiques solides.`,
      difficulty: 2,
    },
    {
      id: 'fq-6',
      type: 'mcq' as const,
      question: `Quelle est une erreur courante lors de l'application de ${conceptLabel} ?`,
      options: [
        'Ignorer les hypothèses de base du concept.',
        'Utiliser trop de données.',
        'Documenter le code.',
        'Tester le modèle.',
      ],
      correctAnswer: 'Ignorer les hypothèses de base du concept.',
      explanation: `Ne pas respecter les hypothèses de ${conceptLabel} conduit à des résultats erronés ou trompeurs.`,
      difficulty: 3,
    },
    {
      id: 'fq-7',
      type: 'mcq' as const,
      question: `Comment évaluer si ${conceptLabel} a été correctement appliqué ?`,
      options: [
        'En mesurant les métriques adaptées au problème.',
        'En comptant le nombre de lignes de code.',
        'En regardant uniquement la vitesse d\'exécution.',
        'En vérifiant la taille du fichier de données.',
      ],
      correctAnswer: 'En mesurant les métriques adaptées au problème.',
      explanation: `L'évaluation de ${conceptLabel} passe par des métriques appropriées (précision, rappel, AUC, etc.) selon le contexte.`,
      difficulty: 3,
    },
  ];
  return base.slice(0, Math.min(count, base.length));
}

const STATIC_INSIGHT = {
  id: 'static-insight-001',
  title: 'La règle des 80/20 en Data Science',
  content: '80% du temps d\'un projet Data Science est consacré à la collecte, nettoyage et préparation des données. Seulement 20% est dédié à la modélisation. Maîtriser l\'exploration et la préparation des données est donc la compétence la plus précieuse.',
  category: 'best_practice',
  mathFormula: 'P(succès) ∝ qualité des données',
};

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
    // Normalize AI snake_case fields → camelCase expected by frontend
    const normalized = result.questions.map((q, i) => ({
      id: q.id ?? `q_${i + 1}`,
      type: q.type,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty ?? 2,
      commonMistake: q.common_mistake,
    }));
    res.json({ questions: normalized });
  } catch (err) {
    console.error('AI generation error:', err);
    const fallback = buildFallbackQuestions(concept.label, questionCount);
    res.json({ questions: fallback });
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
    res.json(STATIC_INSIGHT);
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
    res.json(STATIC_INSIGHT);
  }
});

export default router;

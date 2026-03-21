import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // validated at startup in index.ts
});

export interface Question {
  id: string;
  type: 'mcq' | 'truefalse' | 'matching' | 'ordering' | 'completion' | 'analogy';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: number;
  common_mistake?: string;
}

export interface GenerateQuestionsResult {
  questions: Question[];
}

const PHASE_NAMES: Record<number, string> = {
  1: 'INTUITION',
  2: 'MATHÉMATIQUES',
  3: 'APPLICATION PRATIQUE',
  4: 'COMPÉTITION / BENCHMARK',
  5: 'CODE',
  6: 'RECHERCHE ACADÉMIQUE',
};

/** Sanitize user-supplied strings before interpolating into prompts to prevent injection. */
function sanitize(input: string, maxLen = 200): string {
  return input.slice(0, maxLen).replace(/[`\\]/g, '');
}

/** Extract the first valid JSON object from an AI response string. */
function extractJSON(text: string): string {
  // Find the first '{' and the matching last '}'
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No valid JSON object found in AI response');
  }
  return text.slice(start, end + 1);
}

function buildPhase1Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un expert pédagogue en Data Science. Génère exactement ${count} questions d'intuition pour le concept atomique suivant : "${label}" (ID: ${id}).
Contexte : Ce concept fait partie du module "${mod}", bloc "${blk}".

Contraintes STRICTES :
- Aucune formule mathématique dans cette phase
- Partir d'analogies du quotidien accessibles à un lycéen
- Progressif : du très simple au légèrement complexe
- Utiliser les formats : QCM (4 options), Vrai/Faux+justification, Matching, Ordonnancement, Complétion de phrase, Analogie (X:Y::Z:?)
- Chaque question doit tester une seule idée précise
- Les distracteurs dans les QCM doivent être plausibles (erreurs courantes réelles)

Réponds UNIQUEMENT en JSON valide, sans markdown, sans commentaires :
{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": 1,
      "common_mistake": "..."
    }
  ]
}`;
}

function buildPhase2Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un expert en mathématiques et Data Science. Génère exactement ${count} questions mathématiques rigoureuses pour le concept atomique : "${label}" (ID: ${id}).
Contexte : Module "${mod}", Bloc "${blk}".

Contraintes :
- Couvre : définition formelle, hypothèses, démonstrations clés, propriétés, cas limites
- Formats : calcul guidé (étapes intermédiaires), preuve à compléter, interprétation de formule, QCM mathématique
- Utilise la notation mathématique standard (LaTeX inline)
- Progressif : définition → application → cas limites → erreurs courantes

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": 2,
      "common_mistake": "..."
    }
  ]
}`;
}

function buildPhase3Prompt(conceptId: string, conceptLabel: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  return `Tu es un expert Data Scientist. Pour le concept "${label}" (ID: ${id}), génère ${count} questions d'application pratique basées sur un scénario business réel.

Crée un mini-dataset synthétique cohérent et des questions qui testent l'application du concept dans un contexte réel.

Réponds UNIQUEMENT en JSON valide :
{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": 3,
      "common_mistake": "..."
    }
  ]
}`;
}

function buildPhase4Prompt(conceptId: string, conceptLabel: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  return `Tu es un expert en compétitions Kaggle et benchmarks ML. Pour le concept "${label}" (ID: ${id}), génère ${count} questions orientées performance et optimisation.

Contexte : un participant à une compétition Kaggle doit choisir les meilleurs hyperparamètres, stratégies d'ensemble, et éviter le surapprentissage. Les questions portent sur :
- Choix de métrique selon la distribution des classes
- Stratégies de validation croisée sur données temporelles ou déséquilibrées
- Trade-offs vitesse/performance
- Diagnostic d'erreur de généralisation

Réponds UNIQUEMENT en JSON valide :
{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": 4,
      "common_mistake": "..."
    }
  ]
}`;
}

function buildPhase5Prompt(conceptId: string, conceptLabel: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  return `Tu es un expert développeur Python en Data Science. Pour le concept "${label}" (ID: ${id}), génère ${count} questions de code Python.

Types : complétion de code (fill-in-the-blank), débogage (trouver le bug), implémentation from scratch, interprétation d'output.
Utilise des extraits de code réalistes avec scikit-learn, numpy, pandas ou PyTorch selon le contexte.

Réponds UNIQUEMENT en JSON valide :
{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": 3,
      "common_mistake": "..."
    }
  ]
}`;
}

function buildPhase6Prompt(conceptId: string, conceptLabel: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  return `Tu es un chercheur senior en Data Science et Machine Learning. Pour le concept "${label}" (ID: ${id}), génère ${count} questions de niveau recherche académique.

Les questions portent sur :
- Analyse critique des hypothèses et limites des articles fondateurs
- Comparaison entre approches concurrentes dans la littérature
- Identification des contributions originales des papiers clés
- Questions "pourquoi" sur les choix algorithmiques
- Perspectives d'extension ou de critique

Réponds UNIQUEMENT en JSON valide :
{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "...",
      "difficulty": 5,
      "common_mistake": "..."
    }
  ]
}`;
}

export async function generateQuestions(
  conceptId: string,
  conceptLabel: string,
  moduleName: string,
  blockName: string,
  phase: number,
  count: number,
): Promise<GenerateQuestionsResult> {
  let prompt: string;

  switch (phase) {
    case 1: prompt = buildPhase1Prompt(conceptId, conceptLabel, moduleName, blockName, count); break;
    case 2: prompt = buildPhase2Prompt(conceptId, conceptLabel, moduleName, blockName, count); break;
    case 3: prompt = buildPhase3Prompt(conceptId, conceptLabel, count); break;
    case 4: prompt = buildPhase4Prompt(conceptId, conceptLabel, count); break;
    case 5: prompt = buildPhase5Prompt(conceptId, conceptLabel, count); break;
    case 6: prompt = buildPhase6Prompt(conceptId, conceptLabel, count); break;
    default: throw new Error(`Unknown phase: ${phase}. Valid phases are 1-6.`);
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  const jsonStr = extractJSON(responseText);
  const parsed = JSON.parse(jsonStr) as GenerateQuestionsResult;

  if (!Array.isArray(parsed.questions)) {
    throw new Error('AI response missing "questions" array');
  }

  return parsed;
}

export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  conceptId: string,
  conceptLabel: string,
): Promise<{ isCorrect: boolean; feedback: string; errorType: string | null }> {
  const safeQuestion = sanitize(question, 500);
  const safeAnswer = sanitize(userAnswer, 500);
  const safeLabel = sanitize(conceptLabel);
  const safeId = sanitize(conceptId);

  const prompt = `Tu es un expert pédagogue en Data Science. Évalue cette réponse libre pour le concept "${safeLabel}" (ID: ${safeId}).

Question posée : ${safeQuestion}
Réponse de l'utilisateur : ${safeAnswer}

Évalue si la réponse est correcte ou partiellement correcte. Classe l'erreur si elle existe :
- conceptual: l'utilisateur a mal compris la définition fondamentale
- mathematical: erreur de calcul ou de formalisation
- application: concept compris mais mal appliqué
- reading: l'énoncé a été mal lu

Réponds en JSON :
{
  "isCorrect": true,
  "feedback": "explication pédagogique...",
  "errorType": null
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    const jsonStr = extractJSON(responseText);
    return JSON.parse(jsonStr) as { isCorrect: boolean; feedback: string; errorType: string | null };
  } catch {
    return { isCorrect: false, feedback: 'Impossible d\'évaluer la réponse automatiquement.', errorType: null };
  }
}

export async function getDailyInsight(recentConcepts: string[]): Promise<{ insight: string; explanation: string }> {
  // Sanitize each concept name
  const safeConcepts = recentConcepts.map((c) => sanitize(c, 100));
  const conceptsContext = safeConcepts.length > 0
    ? `L'utilisateur étudie actuellement ces concepts : ${safeConcepts.join(', ')}.`
    : '';

  const prompt = `Tu es un expert en Data Science. ${conceptsContext}

Génère un fait surprenant ou contre-intuitif de la Data Science. Ce fait doit être réel, vérifiable et pédagogiquement intéressant.

Réponds en JSON :
{
  "insight": "Le fait court (1-2 phrases)",
  "explanation": "L'explication détaillée (3-5 phrases)"
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    const jsonStr = extractJSON(responseText);
    return JSON.parse(jsonStr) as { insight: string; explanation: string };
  } catch {
    return {
      insight: 'Un Random Forest peut parfois être battu par un seul arbre de décision bien taillé.',
      explanation: 'Bien que le Random Forest soit une méthode ensembliste puissante, sa force vient de la diversité des arbres. Dans certains cas avec très peu de features discriminantes, un arbre unique optimisé peut surpasser l\'ensemble.',
    };
  }
}

export { PHASE_NAMES };

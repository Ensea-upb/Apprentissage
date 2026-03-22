import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

export interface DailyInsight {
  id: string;
  title: string;
  content: string;
  category: string;
  source?: string;
  mathFormula?: string;
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

/** Sanitize user-supplied strings before interpolating into prompts. */
function sanitize(input: string, maxLen = 200): string {
  return input.slice(0, maxLen).replace(/[`\\]/g, '');
}

/** Extract the first valid JSON object from an AI response string. */
function extractJSON(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No valid JSON object found in AI response');
  }
  return text.slice(start, end + 1);
}

// ─── Ollama local inference ────────────────────────────────────────────────

async function callOllama(prompt: string, maxTokens = 4096): Promise<string> {
  const host = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434';
  const model = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

  const resp = await fetch(`${host}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.15, num_predict: maxTokens },
    }),
    signal: AbortSignal.timeout(180_000), // 3 min for local inference
  });

  if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);
  const data = await resp.json() as { response: string };
  return data.response;
}

/** Try Anthropic first, fall back to local Ollama. */
async function generate(prompt: string, maxTokens = 4096): Promise<string> {
  // Check if Anthropic key looks valid (not a placeholder)
  const key = process.env.ANTHROPIC_API_KEY || '';
  const hasValidKey = key.startsWith('sk-ant-');

  if (hasValidKey) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });
      return message.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');
    } catch (err) {
      console.warn('[AI] Anthropic failed, falling back to Ollama:', (err as Error).message);
    }
  } else {
    console.info('[AI] No valid Anthropic key detected, using Ollama');
  }

  return callOllama(prompt, maxTokens);
}

// ─── Phase prompts ─────────────────────────────────────────────────────────

const JSON_SCHEMA = `{
  "questions": [
    {
      "id": "q_001",
      "type": "mcq",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correct_answer": "A",
      "explanation": "Explication rigoureuse avec références si pertinent.",
      "difficulty": 1,
      "common_mistake": "Erreur typique et pourquoi elle est fausse."
    }
  ]
}`;

/**
 * Generates a difficulty distribution spec for a given count.
 * Distributes questions across [minD..maxD] with a gentle ramp-up.
 */
function diffSpec(count: number, minD: number, maxD: number): string {
  const range = maxD - minD + 1;
  // Assign weights: more questions at lower difficulties
  const weights: number[] = [];
  for (let d = minD; d <= maxD; d++) {
    // Weight decreases as difficulty increases: first level gets 2x the last
    weights.push(maxD - d + 2);
  }
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const counts: number[] = weights.map((w) => Math.max(1, Math.round((w / totalWeight) * count)));

  // Adjust to hit exact count
  let diff = count - counts.reduce((a, b) => a + b, 0);
  for (let i = 0; diff > 0; i = (i + 1) % range, diff--) counts[i]++;
  for (let i = range - 1; diff < 0; i = (i - 1 + range) % range, diff++) {
    if (counts[i] > 1) counts[i]--;
  }

  return counts.map((n, i) => `  - ${n} question${n > 1 ? 's' : ''} difficulty=${minD + i}`).join('\n');
}

function buildPhase1Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un expert pédagogue en Data Science de niveau Polytechnique/Stanford. Génère exactement ${count} questions d'intuition pointues pour le concept atomique : "${label}" (ID: ${id}).
Contexte : Module "${mod}", Bloc "${blk}".

OBJECTIF : Tester la compréhension profonde de l'intuition, PAS la mémorisation de définitions.

DISTRIBUTION DE DIFFICULTÉ OBLIGATOIRE (difficulty 1=facile → 5=expert) :
${diffSpec(count, 1, 3)}
Les questions DOIVENT respecter exactement cette distribution. Commencer simple (analogie/intuition pure) et finir par des contre-exemples ou pièges conceptuels.

CONTRAINTES STRICTES :
- Aucune formule mathématique (phase intuition)
- Utilise des analogies concrètes du quotidien ou des contre-exemples
- Les questions difficulty=1 posent l'intuition fondamentale
- Les questions difficulty=2 testent la compréhension des implications
- Les questions difficulty=3 sont des "pièges" (idées reçues courantes sur ce concept)
- Les 4 options QCM doivent toutes être plausibles — évite les distracteurs évidents
- INTERDIT : questions du type "Qu'est-ce que X ?" ou "Quelle est la définition de X ?"
- INTERDIT : options absurdes ou hors sujet
- Formats autorisés : mcq, truefalse, completion, analogy

Réponds UNIQUEMENT en JSON valide, sans markdown, sans commentaires :
${JSON_SCHEMA}`;
}

function buildPhase2Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un expert en mathématiques appliquées et Data Science de niveau M2/PhD. Génère exactement ${count} questions mathématiques rigoureuses pour : "${label}" (ID: ${id}).
Contexte : Module "${mod}", Bloc "${blk}".

OBJECTIF : Tester la maîtrise mathématique réelle, pas juste les formules.

DISTRIBUTION DE DIFFICULTÉ OBLIGATOIRE :
${diffSpec(count, 2, 4)}
Les questions difficulty=2 : définition formelle et notation standard.
Les questions difficulty=3 : hypothèses, conditions, cas limites.
Les questions difficulty=4 : calcul guidé, preuve partielle, ou erreur classique subtile.

CONTRAINTES STRICTES :
- Utilise la notation mathématique standard (LaTeX inline avec $...$)
- Les QCM doivent utiliser des valeurs numériques précises dans les options (ex: λ=0.01, n=∞)
- Les distracteurs doivent être des erreurs de calcul courantes (ex: confondre variance et écart-type)
- INTERDIT : questions génériques sans formules précises
- INTERDIT : options comme "Aucune des réponses" ou "Toutes les réponses"
- Formats autorisés : mcq, completion (formule à compléter), truefalse (sur un théorème précis)

Réponds UNIQUEMENT en JSON valide, sans markdown :
${JSON_SCHEMA}`;
}

function buildPhase3Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un Data Scientist senior en entreprise (ex-Google/Netflix). Pour le concept "${label}" (ID: ${id}) du module "${mod}", génère ${count} questions d'application pratique basées sur un scénario business réel et cohérent.

OBJECTIF : Tester le jugement pratique et la capacité à choisir la bonne approche.

DISTRIBUTION DE DIFFICULTÉ OBLIGATOIRE :
${diffSpec(count, 2, 4)}
Les questions difficulty=2 : choix de base dans un contexte simple.
Les questions difficulty=3 : arbitrages complexes, paramètres non-évidents.
Les questions difficulty=4 : erreurs silencieuses en production (data leakage, wrong metric, biais).

CONTRAINTES STRICTES :
- Crée un mini-scénario business cohérent (dataset e-commerce, médical, finance, etc.) avec données synthétiques précises
- Les questions doivent porter sur des choix de conception (pourquoi ce paramètre ? quand utiliser X vs Y ?)
- Les explications doivent citer des chiffres ou des règles pratiques ("dans 80% des cas...", "au-delà de N=10000...")
- Toutes les options doivent être réalistes — pas d'options absurdes
- INTERDIT : questions purement théoriques sans contexte applicatif

Réponds UNIQUEMENT en JSON valide, sans markdown :
${JSON_SCHEMA}`;
}

function buildPhase4Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un Kaggle Grandmaster et expert en benchmarking ML. Pour "${label}" (ID: ${id}) du module "${mod}", génère ${count} questions orientées performance et optimisation.

OBJECTIF : Tester la capacité à optimiser et diagnostiquer en conditions réelles.

DISTRIBUTION DE DIFFICULTÉ OBLIGATOIRE :
${diffSpec(count, 3, 5)}
Les questions difficulty=3 : lecture de métriques et diagnostic basique.
Les questions difficulty=4 : optimisation multi-critères, choix de pipeline.
Les questions difficulty=5 : pièges avancés (leakage caché, distribution shift, metric gaming).

CONTRAINTES STRICTES :
- Questions spécifiques avec des métriques chiffrées (ex: AUC passe de 0.82 à 0.79, que faire ?)
- Inclure des questions de diagnostic ("score train=0.98, val=0.71 — cause et remède ?")
- Les options doivent toutes être des solutions valides mais avec efficacités différentes
- Utiliser des noms d'algorithmes précis (XGBoost, LightGBM, optuna, etc.)
- INTERDIT : questions sans contexte de performance chiffré

Réponds UNIQUEMENT en JSON valide, sans markdown :
${JSON_SCHEMA}`;
}

function buildPhase5Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un expert développeur Python ML/Data Science (ex-contributions scikit-learn, PyTorch). Pour "${label}" (ID: ${id}) du module "${mod}", génère ${count} questions de code Python rigoureuses.

OBJECTIF : Tester la maîtrise réelle du code, pas juste la syntaxe.

DISTRIBUTION DE DIFFICULTÉ OBLIGATOIRE :
${diffSpec(count, 2, 5)}
Les questions difficulty=2 : complétion de code simple, syntaxe API.
Les questions difficulty=3 : output-prediction, fit vs fit_transform, ordre d'opérations.
Les questions difficulty=4 : bug-finding subtil (wrong axis, data leakage dans pipeline).
Les questions difficulty=5 : refactoring, edge-case silencieux (NaN, dtype, shapes).

CONTRAINTES STRICTES :
- Types : fill-in-the-blank, bug-finding, output-prediction, refactoring
- Chaque extrait de code doit être réaliste et fonctionnel (imports inclus si nécessaires)
- Utilise scikit-learn, numpy, pandas, PyTorch selon le contexte
- Les bugs doivent être subtils (ex: wrong axis, off-by-one, data leakage dans un pipeline)
- Code formaté avec indentation correcte dans le champ "question"
- INTERDIT : questions sur la syntaxe de base Python sans lien avec le concept ML

Réponds UNIQUEMENT en JSON valide, sans markdown :
${JSON_SCHEMA}`;
}

function buildPhase6Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un chercheur senior en ML/Data Science (publications NeurIPS/ICML). Pour "${label}" (ID: ${id}) du module "${mod}", génère ${count} questions de niveau recherche académique.

OBJECTIF : Tester la pensée critique et la connaissance de la littérature.

DISTRIBUTION DE DIFFICULTÉ OBLIGATOIRE :
${diffSpec(count, 3, 5)}
Les questions difficulty=3 : papiers fondateurs, contributions clés, contexte historique.
Les questions difficulty=4 : analyse critique d'hypothèses, comparaison d'approches.
Les questions difficulty=5 : limites ouvertes, directions de recherche, reproductibilité.

CONTRAINTES STRICTES :
- Questions basées sur des papiers fondateurs réels avec citations (auteurs, année, venue)
- Couvrir : analyse critique des hypothèses, comparaison d'approches concurrentes
- Inclure des questions "Pourquoi les auteurs de [papier X] ont-ils choisi Y plutôt que Z ?"
- Les explications doivent citer les papiers (ex: "Comme montré dans Vaswani et al. 2017...")
- Au moins 1 question sur l'état de l'art actuel et les directions de recherche ouvertes
- INTERDIT : questions sans références à la littérature réelle
- INTERDIT : questions de niveau vulgarisation

Réponds UNIQUEMENT en JSON valide, sans markdown :
${JSON_SCHEMA}`;
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
    case 3: prompt = buildPhase3Prompt(conceptId, conceptLabel, moduleName, blockName, count); break;
    case 4: prompt = buildPhase4Prompt(conceptId, conceptLabel, moduleName, blockName, count); break;
    case 5: prompt = buildPhase5Prompt(conceptId, conceptLabel, moduleName, blockName, count); break;
    case 6: prompt = buildPhase6Prompt(conceptId, conceptLabel, moduleName, blockName, count); break;
    default: throw new Error(`Unknown phase: ${phase}. Valid phases are 1-6.`);
  }

  const responseText = await generate(prompt, 4096);
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

  const prompt = `Tu es un expert pédagogue en Data Science. Évalue cette réponse pour le concept "${safeLabel}" (ID: ${safeId}).

Question : ${safeQuestion}
Réponse de l'utilisateur : ${safeAnswer}

Classe l'erreur si elle existe parmi :
- conceptual: mauvaise compréhension de la définition ou du principe fondamental
- mathematical: erreur de calcul, notation ou formalisation
- application: concept compris mais mal appliqué au contexte donné
- reading: l'énoncé a été mal lu ou mal interprété

Réponds en JSON :
{
  "isCorrect": true,
  "feedback": "Explication pédagogique précise avec la correction si nécessaire.",
  "errorType": null
}`;

  try {
    const responseText = await generate(prompt, 512);
    const jsonStr = extractJSON(responseText);
    return JSON.parse(jsonStr) as { isCorrect: boolean; feedback: string; errorType: string | null };
  } catch {
    return { isCorrect: false, feedback: 'Impossible d\'évaluer la réponse automatiquement.', errorType: null };
  }
}

export async function getDailyInsight(recentConcepts: string[]): Promise<DailyInsight> {
  const safeConcepts = recentConcepts.map((c) => sanitize(c, 100));
  const conceptsContext = safeConcepts.length > 0
    ? `L'utilisateur étudie : ${safeConcepts.join(', ')}.`
    : '';

  const prompt = `Tu es un expert en Data Science. ${conceptsContext}

Génère un fait surprenant, contre-intuitif ou peu connu de la Data Science/ML. Ce fait doit être réel, vérifiable, et pédagogiquement impactant.

Réponds en JSON :
{
  "id": "insight-unique-id",
  "title": "Titre accrocheur court (max 10 mots)",
  "content": "Description complète et engageante (3-5 phrases). Explique pourquoi c'est surprenant et ce qu'on peut en apprendre.",
  "category": "statistiques|ml|deep_learning|nlp|mlops|mathématiques|données",
  "source": "Référence optionnelle (papier ou auteur)",
  "mathFormula": "Formule LaTeX optionnelle si pertinent"
}`;

  try {
    const responseText = await generate(prompt, 512);
    const jsonStr = extractJSON(responseText);
    return JSON.parse(jsonStr) as DailyInsight;
  } catch {
    return {
      id: 'static-insight-fallback',
      title: 'Le paradoxe de la dimensionnalité',
      content: 'En haute dimension (≥20 features), la distance euclidienne perd son sens : tous les points deviennent équidistants. C\'est pourquoi des algorithmes comme K-NN échouent silencieusement sur des données high-dimensional sans réduction préalable. Ce phénomène, formalisé par Bellman en 1957, explique pourquoi PCA ou UMAP sont critiques avant tout clustering.',
      category: 'ml',
      mathFormula: '\\lim_{d\\to\\infty} \\frac{d_{max} - d_{min}}{d_{min}} \\to 0',
    };
  }
}

export { PHASE_NAMES };

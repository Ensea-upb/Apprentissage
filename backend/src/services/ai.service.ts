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

function buildPhase1Prompt(conceptId: string, conceptLabel: string, moduleName: string, blockName: string, count: number): string {
  const id = sanitize(conceptId);
  const label = sanitize(conceptLabel);
  const mod = sanitize(moduleName);
  const blk = sanitize(blockName);
  return `Tu es un expert pédagogue en Data Science de niveau Polytechnique/Stanford. Génère exactement ${count} questions d'intuition pointues pour le concept atomique : "${label}" (ID: ${id}).
Contexte : Module "${mod}", Bloc "${blk}".

OBJECTIF : Tester la compréhension profonde de l'intuition, PAS la mémorisation de définitions.

CONTRAINTES STRICTES :
- Aucune formule mathématique (phase intuition)
- Utilise des analogies concrètes du quotidien ou des contre-exemples
- Chaque question doit avoir UN SEUL concept testé précis
- Les 4 options QCM doivent toutes être plausibles — évite les distracteurs évidents
- Au moins 2 questions doivent être "pièges" (idées reçues courantes sur ce concept)
- Les questions Vrai/Faux doivent porter sur des affirmations non triviales
- Progressif : du conceptuel au contre-intuitif
- INTERDIT : questions du type "Qu'est-ce que X ?" ou "Quelle est la définition de X ?"
- INTERDIT : options absurdes ou hors sujet
- Formats autorisés : mcq, truefalse, completion, analogy, ordering

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

CONTRAINTES STRICTES :
- Utilise la notation mathématique standard (LaTeX inline avec $...$ ou $$...$$)
- Chaque question doit porter sur UN résultat précis : définition formelle, hypothèse nécessaire, cas limite, preuve, calcul
- Les QCM doivent utiliser des valeurs numériques précises dans les options (ex: λ=0.01, n=∞, p=0.5)
- Au moins 2 questions doivent porter sur les HYPOTHÈSES ou LIMITES du concept (quand ça ne marche pas)
- Au moins 1 question de calcul guidé avec étapes intermédiaires
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

CONTRAINTES STRICTES :
- Crée un mini-scénario business cohérent (dataset e-commerce, médical, finance, etc.) avec données synthétiques précises
- Les questions doivent porter sur des choix de conception (pourquoi ce paramètre ? quand utiliser X vs Y ?)
- Inclure au moins 1 question sur les erreurs classiques en production (data leakage, wrong metric, etc.)
- Toutes les options doivent être réalistes — pas d'options absurdes
- Les explications doivent citer des chiffres ou des règles pratiques ("dans 80% des cas...", "au-delà de N=10000...")
- Au moins 1 question sur l'interprétation du résultat pour un stakeholder non technique
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

CONTRAINTES STRICTES :
- Questions spécifiques avec des métriques chiffrées (ex: AUC passe de 0.82 à 0.79, que faire ?)
- Couvrir : choix de métrique selon la distribution, validation croisée, diagnostic overfitting/underfitting, trade-offs computationnels
- Inclure des questions de diagnostic ("Le score train=0.98, val=0.71 — quelle est la cause la plus probable et le meilleur remède ?")
- Les options doivent toutes être des solutions valides mais avec efficacités différentes
- Au moins 1 question sur un piège classique de compétition (data leakage, label encoding vs target encoding, etc.)
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

CONTRAINTES STRICTES :
- Types : fill-in-the-blank (complétion), bug-finding (trouver l'erreur), output-prediction (quel est le résultat ?), refactoring (meilleure version)
- Chaque extrait de code doit être réaliste et fonctionnel (imports inclus si nécessaires)
- Utilise scikit-learn, numpy, pandas, PyTorch, ou SQLAlchemy selon le contexte du concept
- Les bugs doivent être subtils (ex: wrong axis, off-by-one, data leakage dans un pipeline)
- Les options de complétion doivent inclure des alternatives presque correctes (ex: fit() vs fit_transform())
- Au moins 1 question sur le comportement edge-case (tableau vide, NaN, dtype incompatible)
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

CONTRAINTES STRICTES :
- Questions basées sur des papiers fondateurs réels avec citations (auteurs, année, venue)
- Couvrir : analyse critique des hypothèses, comparaison d'approches concurrentes dans la littérature, contributions originales vs améliorations ultérieures
- Inclure des questions "Pourquoi les auteurs de [papier X] ont-ils choisi Y plutôt que Z ?"
- Au moins 1 question sur les limites connues et les papiers qui les ont adressées
- Au moins 1 question sur l'état de l'art actuel et les directions de recherche ouvertes
- Les explications doivent citer les papiers (ex: "Comme montré dans Vaswani et al. 2017...")
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

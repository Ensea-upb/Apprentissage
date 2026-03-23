/**
 * ai.service.ts — DataQuest v3
 *
 * L'IA joue 4 rôles DÉLIMITÉS. Elle ne génère PLUS les questions.
 *   1. Évaluer les réponses texte libre (résumés, explications, questions ouvertes)
 *   2. Générer une VARIANTE d'une question après 3 échecs consécutifs
 *   3. Dialogue Socratique — questions de plus en plus profondes sur demande
 *   4. Générer la page de documentation après 3 erreurs
 */

import Anthropic from '@anthropic-ai/sdk';
import { AsyncLocalStorage } from 'async_hooks';

// Per-request user-provided Anthropic API key injected via X-User-Api-Key header.
// AsyncLocalStorage isolates the value per async call chain without touching globals.
export const userApiKeyContext = new AsyncLocalStorage<string>();

// Lazy-initialized global client (used when no per-request key is provided)
let _anthropicClient: Anthropic | null = null;
function getAnthropicClient(keyOverride?: string): Anthropic {
  if (keyOverride) return new Anthropic({ apiKey: keyOverride });
  if (!_anthropicClient) {
    _anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropicClient;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EvaluationResult {
  pointsScored: boolean[];
  totalScore: number;
  maxScore: number;
  feedback: string;
  missingConcepts: string[];
  errorType: 'conceptual' | 'mathematical' | 'application' | 'reading' | 'none';
}

export interface SocratesMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SocratesResponse {
  question: string;
  newDepth: number;
}

export interface Documentation {
  definition: string;
  intuition: string;
  example: string;
  commonError: string;
  resources: string[];
}

export interface DailyInsight {
  id: string;
  title: string;
  content: string;
  category: string;
  source?: string;
  mathFormula?: string;
}

// ─── Sanitization ─────────────────────────────────────────────────────────────

function sanitize(input: string, maxLen = 300): string {
  return input.slice(0, maxLen).replace(/[`\\]/g, '');
}

function extractJSON(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No valid JSON object found in AI response');
  }
  return text.slice(start, end + 1);
}

// ─── Transport (Anthropic → Ollama fallback) ──────────────────────────────────

async function callOllama(
  prompt: string,
  system?: string,
  maxTokens = 2048,
  requireJson = true,
): Promise<string> {
  const host = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434';
  const model = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

  const fullPrompt = system ? `${system}\n\n${prompt}` : prompt;

  const body: Record<string, unknown> = {
    model,
    prompt: fullPrompt,
    stream: false,
    options: { temperature: 0.1, num_predict: maxTokens },
  };
  // Only force JSON format when the caller expects a JSON response.
  // Socratic dialogue expects plain text; forcing format:'json' makes Ollama
  // wrap the answer in a JSON object, which the caller never parses.
  if (requireJson) body.format = 'json';

  const resp = await fetch(`${host}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // 90s — must stay under nginx's proxy_read_timeout for /api/ai/ (120s)
    signal: AbortSignal.timeout(90_000),
  });

  if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);
  const data = (await resp.json()) as { response: string };
  return data.response;
}

async function callClaude(
  userPrompt: string,
  opts: {
    system?: string;
    messages?: SocratesMessage[];
    max_tokens?: number;
    jsonResponse?: boolean;
  } = {},
): Promise<string> {
  // Per-request key (from X-User-Api-Key header) takes priority over the env var
  const perRequestKey = userApiKeyContext.getStore();
  const envKey = process.env.ANTHROPIC_API_KEY ?? '';
  const activeKey = perRequestKey ?? envKey;
  const hasValidKey = activeKey.startsWith('sk-ant-');

  if (hasValidKey) {
    try {
      const messages: Anthropic.MessageParam[] = opts.messages
        ? opts.messages.map((m) => ({ role: m.role, content: m.content }))
        : [{ role: 'user', content: userPrompt }];

      const message = await getAnthropicClient(perRequestKey).messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: opts.max_tokens ?? 1024,
        system: opts.system,
        messages,
      });

      return message.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');
    } catch (err) {
      console.warn('[AI] Anthropic failed, falling back to Ollama:', (err as Error).message);
    }
  } else {
    console.info('[AI] No valid Anthropic key — using Ollama');
  }

  return callOllama(userPrompt, opts.system, opts.max_tokens, opts.jsonResponse ?? true);
}

// ─────────────────────────────────────────────────────────────────────────────
// RÔLE 1 : Évaluation des réponses texte libre
// ─────────────────────────────────────────────────────────────────────────────

export async function evaluateOpenAnswer(params: {
  conceptId: string;
  questionId: string;
  userAnswer: string;
  expectedKeyPoints: string[];
  rubricWeight: number[];
}): Promise<EvaluationResult> {
  const safeAnswer = sanitize(params.userAnswer, 800);
  const safeId = sanitize(params.conceptId);

  const prompt = `Tu évalues la réponse d'un apprenant en Data Science.

CONCEPT : ${safeId}
RÉPONSE DE L'APPRENANT : "${safeAnswer}"

POINTS ATTENDUS (avec leur poids) :
${params.expectedKeyPoints.map((p, i) => `${i + 1}. [poids ${params.rubricWeight[i] ?? 1}] ${sanitize(p, 200)}`).join('\n')}

Évalue STRICTEMENT et OBJECTIVEMENT. Un point est accordé seulement s'il est explicitement mentionné avec une précision suffisante. Ne sois pas indulgent.

Réponds en JSON strict :
{
  "pointsScored": [true/false pour chaque point attendu],
  "totalScore": <somme des poids des points obtenus>,
  "maxScore": <somme totale des poids>,
  "feedback": "<feedback précis de 2-3 phrases>",
  "missingConcepts": ["<concept manqué 1>", "..."],
  "errorType": "conceptual|mathematical|application|reading|none"
}`;

  try {
    const text = await callClaude(prompt, { max_tokens: 800 });
    const result = JSON.parse(extractJSON(text)) as EvaluationResult;
    // Validate shape
    if (!Array.isArray(result.pointsScored)) throw new Error('Invalid shape');
    return result;
  } catch (err) {
    console.warn('[AI] evaluateOpenAnswer failed:', (err as Error).message);
    return {
      pointsScored: params.expectedKeyPoints.map(() => false),
      totalScore: 0,
      maxScore: params.rubricWeight.reduce((a, b) => a + b, 0),
      feedback: 'L\'évaluation automatique a échoué. Veuillez réessayer.',
      missingConcepts: [],
      errorType: 'none',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RÔLE 2 : Génération d'une variante (après 3 échecs consécutifs)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateVariant(params: {
  originalQuestion: Record<string, unknown>;
  conceptId: string;
  failureReason: 'conceptual' | 'mathematical' | 'application' | 'reading';
  attemptCount: number;
}): Promise<Record<string, unknown>> {
  const safeId = sanitize(params.conceptId);
  const originalJson = JSON.stringify(params.originalQuestion).slice(0, 800);

  const prompt = `Tu génères une VARIANTE d'une question pour un apprenant en difficulté.

CONCEPT : ${safeId}
QUESTION ORIGINALE : ${originalJson}
TYPE D'ERREUR DE L'APPRENANT : ${params.failureReason}
TENTATIVES : ${params.attemptCount}

Génère une question équivalente qui :
- Teste le même concept atomique
- Utilise un contexte ou une formulation DIFFÉRENTE (pas paraphrase)
- Cible spécifiquement l'erreur de type "${params.failureReason}"
- A le même format que l'originale (type: ${params.originalQuestion.type as string})
- Est PLUS guidée si attemptCount >= 3

Réponds en JSON strict avec la même structure que la question originale.
Ne change pas le type, ne simplifie pas le concept, ne réduis pas la difficulté de plus d'un niveau.`;

  try {
    const text = await callClaude(prompt, { max_tokens: 1200 });
    const variant = JSON.parse(extractJSON(text)) as Record<string, unknown>;
    return {
      ...variant,
      id: `variant_${params.originalQuestion.id as string}_${Date.now()}`,
      isStatic: false,
      variantOf: params.originalQuestion.id as string,
    };
  } catch (err) {
    console.warn('[AI] generateVariant failed:', (err as Error).message);
    // Return a simplified version of the original with a hint
    return {
      ...params.originalQuestion,
      id: `variant_${params.originalQuestion.id as string}_${Date.now()}`,
      isStatic: false,
      variantOf: params.originalQuestion.id as string,
      hint: `Concentre-toi sur l'aspect ${params.failureReason} de ce concept.`,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RÔLE 3 : Dialogue Socratique (sur demande)
// ─────────────────────────────────────────────────────────────────────────────

export async function socratesNext(params: {
  conceptId: string;
  conceptName: string;
  conversationHistory: SocratesMessage[];
  currentDepth: number; // 0=surface → 5=expert
}): Promise<SocratesResponse> {
  const safeId = sanitize(params.conceptId);
  const safeName = sanitize(params.conceptName);

  const system = `Tu es un expert en Data Science qui pratique la maïeutique socratique. \
Tu NE DONNES PAS les réponses. Tu poses des questions de plus en plus profondes. \
Niveau actuel de profondeur : ${params.currentDepth}/5. \
Tu parles toujours à la 2e personne, tu utilises des contre-exemples et des cas limites. \
Sois bref : ta question doit tenir en 1-3 phrases maximum.`;

  const userPrompt = `Concept enseigné : ${safeName} (${safeId})
Pose la prochaine question socratique en fonction de l'historique. \
La question doit être un cran plus profonde que la précédente. \
Réponds UNIQUEMENT avec la question (pas de JSON, pas de préambule).`;

  try {
    const question = await callClaude(userPrompt, {
      system,
      messages: params.conversationHistory,
      max_tokens: 400,
      jsonResponse: false, // plain text — Ollama must NOT wrap this in a JSON object
    });
    return {
      question: question.trim(),
      newDepth: Math.min(5, params.currentDepth + 1),
    };
  } catch (err) {
    console.warn('[AI] socratesNext failed:', (err as Error).message);
    const fallbacks = [
      `Que se passerait-il si cette propriété n'était pas vraie pour ${safeName} ?`,
      `Peux-tu donner un contre-exemple qui met en défaut une utilisation naïve de ${safeName} ?`,
      `Quelles sont les hypothèses implicites dans ton raisonnement sur ${safeName} ?`,
    ];
    return {
      question: fallbacks[Math.min(params.currentDepth, fallbacks.length - 1)],
      newDepth: Math.min(5, params.currentDepth + 1),
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RÔLE 4 : Documentation ciblée après 3 erreurs
// ─────────────────────────────────────────────────────────────────────────────

export async function generateDocumentation(params: {
  conceptId: string;
  conceptName: string;
  questionContext: string;
  errorType: 'conceptual' | 'mathematical' | 'application' | 'reading';
}): Promise<Documentation> {
  const safeId = sanitize(params.conceptId);
  const safeName = sanitize(params.conceptName);
  const safeCtx = sanitize(params.questionContext, 400);

  const prompt = `Tu génères une page de documentation pédagogique CIBLÉE pour un apprenant qui vient de faire 3 erreurs de type "${params.errorType}" sur le concept "${safeName}" (${safeId}).

CONTEXTE DE LA QUESTION : ${safeCtx}

Génère une documentation structurée qui adresse SPÉCIFIQUEMENT l'erreur de type "${params.errorType}".

Structure obligatoire — réponds en JSON :
{
  "definition": "<Définition formelle et précise en 2-3 phrases>",
  "intuition": "<Intuition en 2-3 phrases simples, analogie concrète>",
  "example": "<Exemple numérique concret avec calcul étape par étape>",
  "commonError": "<Description précise de l'erreur de type ${params.errorType} sur ce concept et pourquoi elle est fausse>",
  "resources": ["<Référence 1 : auteur, année, titre>", "<Référence 2 optionnelle>"]
}`;

  try {
    const text = await callClaude(prompt, { max_tokens: 1000 });
    return JSON.parse(extractJSON(text)) as Documentation;
  } catch (err) {
    console.warn('[AI] generateDocumentation failed:', (err as Error).message);
    return {
      definition: `${safeName} est un concept fondamental en Data Science qui mérite une étude approfondie.`,
      intuition: 'Revenez aux fondamentaux et assurez-vous de comprendre les prérequis de ce concept.',
      example: 'Consultez les questions de la phase 1 pour revoir les intuitions de base.',
      commonError: `L'erreur de type "${params.errorType}" sur ce concept est souvent liée à une confusion avec les prérequis.`,
      resources: ['Consultez les ressources de votre cours.'],
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRE : Évaluation de réponse simple (MCQ, etc.) — rétro-compatibilité
// ─────────────────────────────────────────────────────────────────────────────

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

  const prompt = `Tu es un expert pédagogue en Data Science. Évalue cette réponse pour le concept "${safeLabel}" (${safeId}).

Question : ${safeQuestion}
Réponse de l'utilisateur : ${safeAnswer}

Classe l'erreur parmi : conceptual|mathematical|application|reading

Réponds en JSON :
{
  "isCorrect": true,
  "feedback": "Explication pédagogique précise.",
  "errorType": null
}`;

  try {
    const text = await callClaude(prompt, { max_tokens: 512 });
    return JSON.parse(extractJSON(text)) as { isCorrect: boolean; feedback: string; errorType: string | null };
  } catch {
    return { isCorrect: false, feedback: 'Impossible d\'évaluer la réponse automatiquement.', errorType: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRE : Daily Insight (inchangé)
// ─────────────────────────────────────────────────────────────────────────────

export async function getDailyInsight(recentConcepts: string[]): Promise<DailyInsight> {
  const safeConcepts = recentConcepts.slice(0, 5).map((c) => sanitize(c, 100));
  const context = safeConcepts.length > 0
    ? `L'utilisateur étudie : ${safeConcepts.join(', ')}.`
    : '';

  const prompt = `Tu es un expert en Data Science. ${context}

Génère un fait surprenant, contre-intuitif ou peu connu de la Data Science/ML. Ce fait doit être réel, vérifiable, et pédagogiquement impactant.

Réponds en JSON :
{
  "id": "insight-unique-id",
  "title": "Titre accrocheur court (max 10 mots)",
  "content": "Description complète et engageante (3-5 phrases). Explique pourquoi c'est surprenant.",
  "category": "statistiques|ml|deep_learning|nlp|mlops|mathématiques|données",
  "source": "Référence optionnelle",
  "mathFormula": "Formule LaTeX optionnelle"
}`;

  try {
    const text = await callClaude(prompt, { max_tokens: 512 });
    return JSON.parse(extractJSON(text)) as DailyInsight;
  } catch {
    return {
      id: 'static-insight-fallback',
      title: 'Le paradoxe de la dimensionnalité',
      content: 'En haute dimension (≥20 features), la distance euclidienne perd son sens : tous les points deviennent équidistants. C\'est pourquoi des algorithmes comme K-NN échouent silencieusement sur des données high-dimensional sans réduction préalable.',
      category: 'ml',
      mathFormula: '\\lim_{d\\to\\infty} \\frac{d_{max} - d_{min}}{d_{min}} \\to 0',
    };
  }
}

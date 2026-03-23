import apiClient from './client';
import { Question, DailyInsight } from '../types';

export interface GenerateQuestionsRequest {
  conceptId: string;
  phase: number;
  count?: number;
  difficulty?: number;
  previousErrors?: string[];
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  total?: number;
}

export interface ExplainConceptRequest {
  conceptId: string;
  errorType?: string;
  userAnswer?: string;
}

// Raw question shape returned by the backend (content stored as-is from seed)
type RawQuestion = Record<string, unknown>;

/**
 * Normalize raw question content (seed format) to the frontend Question interface.
 * Each question type stores its answer differently — this function unifies them under
 * `question` (text) and `correctAnswer` (string) so the rest of the UI never hits
 * "cannot read properties of undefined".
 */
function normalizeQuestion(raw: RawQuestion): Question {
  const type = (raw.type as string) || 'mcq';
  const difficulty = (raw.difficulty as number) ?? 2;
  const explanation = (raw.explanation as string) ?? '';
  const id = (raw.id as string) ?? String(Math.random());

  let questionText = '';
  let correctAnswer = '';
  let options: string[] | undefined;

  switch (type) {
    case 'mcq': {
      questionText = (raw.question as string) ?? '';
      const opts = (raw.options as string[]) ?? [];
      const idx = (raw.correctIndex as number) ?? 0;
      correctAnswer = opts[idx] ?? '';
      options = opts;
      break;
    }
    case 'truefalse': {
      questionText = (raw.statement as string) ?? (raw.question as string) ?? '';
      correctAnswer = (raw.isTrue as boolean) ? 'true' : 'false';
      break;
    }
    case 'analogy': {
      questionText = (raw.template as string) ?? (raw.question as string) ?? '';
      correctAnswer = (raw.correctAnswer as string) ?? '';
      const alts = (raw.alternatives as string[]) ?? [];
      options = alts.includes(correctAnswer) ? alts : [correctAnswer, ...alts];
      break;
    }
    case 'ordering': {
      questionText = (raw.instruction as string) ?? (raw.question as string) ?? '';
      const steps = (raw.steps as string[]) ?? [];
      const order = (raw.correctOrder as number[]) ?? [];
      correctAnswer = order.map((i) => steps[i] ?? '').join(' → ');
      options = steps;
      break;
    }
    case 'formula_completion': {
      questionText = (raw.latex_question as string) ?? (raw.question as string) ?? '';
      const latexArr = (raw.correctLatex as string[]) ?? [];
      correctAnswer = latexArr[0] ?? '';
      break;
    }
    case 'proof_gap':
    case 'numerical':
    case 'analysis':
    case 'reasoning':
    case 'open': {
      questionText = (raw.question as string) ?? (raw.instruction as string) ?? '';
      const keyPoints = (raw.expectedKeyPoints as string[]) ?? [];
      correctAnswer = keyPoints[0] ?? '';
      break;
    }
    case 'implementation':
    case 'debugging': {
      questionText = (raw.title as string) ?? (raw.question as string) ?? '';
      correctAnswer = (raw.solution as string) ?? '';
      break;
    }
    case 'completion': {
      questionText = (raw.title as string) ?? (raw.question as string) ?? '';
      const highlights = (raw.solutionHighlights as string[]) ?? [];
      correctAnswer = highlights[0] ?? '';
      break;
    }
    default: {
      questionText = (raw.question as string) ?? (raw.statement as string) ?? '';
      correctAnswer = (raw.correctAnswer as string) ?? '';
      options = raw.options as string[] | undefined;
    }
  }

  return {
    id,
    type: type as Question['type'],
    question: questionText,
    correctAnswer,
    options,
    difficulty,
    explanation,
    commonMistake: raw.commonMistake as string | undefined,
    mathFormula: (raw.latexQuestion ?? raw.latex_question) as string | undefined,
  };
}

export const aiApi = {
  generateQuestions: async (
    request: GenerateQuestionsRequest
  ): Promise<GenerateQuestionsResponse> => {
    const response = await apiClient.get<{ questions: RawQuestion[]; total?: number }>(
      `/ai/questions/${request.conceptId}/${request.phase}`
    );
    const normalized = response.data.questions.map(normalizeQuestion);
    return { questions: normalized, total: response.data.total };
  },

  explainConcept: async (request: ExplainConceptRequest): Promise<string> => {
    const response = await apiClient.post<{ explanation: string }>(
      '/ai/explain',
      request
    );
    return response.data.explanation;
  },

  getDailyInsight: async (): Promise<DailyInsight> => {
    const response = await apiClient.get<DailyInsight>('/ai/insight');
    return response.data;
  },

};

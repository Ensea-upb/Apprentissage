// packages/content/types.ts
// TypeScript types for the static question content package

// ─── Base question types ─────────────────────────────────────────────────────

export interface MCQQuestion {
  id: string;
  type: 'mcq';
  difficulty: number; // 1-5
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  commonMistake?: string;
  sourceNote?: string;
  latexQuestion?: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'truefalse';
  difficulty: number;
  statement: string;
  isTrue: boolean;
  justificationRequired: boolean;
  explanation: string;
  sourceNote?: string;
}

export interface OrderingQuestion {
  id: string;
  type: 'ordering';
  difficulty: number;
  instruction: string;
  steps: string[];
  correctOrder: number[];
  explanation: string;
}

export interface AnalogyQuestion {
  id: string;
  type: 'analogy';
  difficulty: number;
  template: string;
  correctAnswer: string;
  alternatives: string[];
  explanation: string;
}

export interface FormulaCompletionQuestion {
  id: string;
  type: 'formula_completion';
  difficulty: number;
  latex_question: string;
  correctLatex: string[];
  explanation: string;
  sourceNote?: string;
}

export interface ProofGapQuestion {
  id: string;
  type: 'proof_gap';
  difficulty: number;
  instruction: string;
  steps: Array<{ step: number; statement: string; correctFill: string }>;
  conclusion: string;
  sourceNote?: string;
}

export interface NumericalQuestion {
  id: string;
  type: 'numerical';
  difficulty: number;
  latexQuestion: string;
  solution: Record<string, string>;
  tolerance: number;
  explanation: string;
}

export interface AnalysisQuestion {
  id: string;
  type: 'analysis';
  difficulty?: number;
  question: string;
  expectedKeyPoints: string[];
  scoringCriteria: string;
}

export interface ReasoningQuestion {
  id: string;
  type: 'reasoning';
  difficulty?: number;
  question: string;
  expectedKeyPoints: string[];
}

export interface OpenQuestion {
  id: string;
  type: 'open';
  difficulty: number;
  question: string;
  expectedKeyPoints: string[];
  evaluationMode: string;
  rubricWeight: number[];
}

export interface ImplementationQuestion {
  id: string;
  type: 'implementation';
  difficulty: number;
  title: string;
  starter: string;
  solution: string;
  testCases: Array<{
    input: Record<string, string>;
    expectedShape_output?: number[];
    expectedShape_weights?: number[];
    checkSumToOne?: string;
  }>;
}

export interface DebuggingQuestion {
  id: string;
  type: 'debugging';
  difficulty: number;
  title: string;
  buggyCode: string;
  bugs: Array<{ line: string; problem: string; explanation: string }>;
}

export interface CompletionQuestion {
  id: string;
  type: 'completion';
  difficulty: number;
  title: string;
  starter: string;
  solutionHighlights: string[];
}

export type AnyQuestion =
  | MCQQuestion
  | TrueFalseQuestion
  | OrderingQuestion
  | AnalogyQuestion
  | FormulaCompletionQuestion
  | ProofGapQuestion
  | NumericalQuestion
  | AnalysisQuestion
  | ReasoningQuestion
  | OpenQuestion
  | ImplementationQuestion
  | DebuggingQuestion
  | CompletionQuestion;

// ─── Phase containers ────────────────────────────────────────────────────────

export interface Phase1 {
  targetCount: number;
  questions: AnyQuestion[];
}

export interface Phase2 {
  targetCount: number;
  questions: AnyQuestion[];
}

export interface Phase3 {
  scenario: {
    title: string;
    context: string;
    syntheticData: string;
  };
  questions: AnyQuestion[];
}

export interface Phase4 {
  competition: {
    name: string;
    kaggleUrl: string;
    year: number;
    task: string;
    topStrategies: Array<{ rank: number; approach: string; keyInsight: string }>;
  };
  questions: AnyQuestion[];
}

export interface Phase5 {
  questions: AnyQuestion[];
}

export interface Phase6 {
  paper: {
    title: string;
    authors: string[];
    year: number;
    venue: string;
    arxiv: string;
    keyContributions: string[];
  };
  questions: AnyQuestion[];
}

// ─── Top-level question set ──────────────────────────────────────────────────

export interface ConceptQuestionSet {
  conceptId: string;
  conceptName: string;
  module: string;
  block: number;
  paper?: string;
  phase1: Phase1;
  phase2: Phase2;
  phase3?: Phase3;
  phase4?: Phase4;
  phase5?: Phase5;
  phase6?: Phase6;
}

// ─── Concept metadata (DAG node) ─────────────────────────────────────────────

export interface ConceptMeta {
  id: string;
  name: string;
  shortName: string;
  block: number;
  module: string;
  prerequisites: string[];
  unlocks: string[];
  estimatedMinutes: number;
  questionFile: string;
  paper: string | null;
  kaggle: string | null;
  tags: string[];
}

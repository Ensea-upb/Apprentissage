export interface User {
  id: string;
  email: string;
  username: string;
  level: number;
  xp: number;
  dataCoins: number;
  streak: number;
  eloRating: number;
  createdAt?: string;
  lastActiveAt?: string;
}

export interface Concept {
  id: string;
  blockId: number;
  moduleId: string;
  blockName: string;
  moduleName: string;
  label: string;
  paperRef?: string;
  prerequisites: string[];
}

export interface ConceptProgress {
  conceptId: string;
  phase1Done: boolean;
  phase2Done: boolean;
  phase3Done: boolean;
  phase4Done: boolean;
  phase5Done: boolean;
  phase6Done: boolean;
  isValidated: boolean;
  xpEarned: number;
  accuracy?: number;
  lastStudied?: string;
}

export type ConceptStatus = 'locked' | 'available' | 'in_progress' | 'mastered' | 'decaying';

export interface Question {
  id: string;
  type: 'mcq' | 'truefalse' | 'matching' | 'ordering' | 'completion' | 'analogy';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  commonMistake?: string;
  mathFormula?: string;
}

export interface SM2Card {
  conceptId: string;
  repetitionNumber: number;
  easinessFactor: number;
  interval: number;
  nextReviewDate: string;
  decayLevel: number;
  conceptLabel?: string;
  blockName?: string;
}

export type ErrorType = 'conceptual' | 'mathematical' | 'application' | 'reading';

export interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  errorType?: ErrorType;
  timeSpent?: number;
}

export interface Session {
  id: string;
  userId: string;
  conceptId: string;
  phase: number;
  startedAt: string;
  endedAt?: string;
  questionsAsked: number;
  correctAnswers: number;
  xpEarned: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface SessionResult {
  sessionId: string;
  conceptId: string;
  phase: number;
  questionsAsked: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  errorBreakdown: Record<ErrorType, number>;
  phaseCompleted: boolean;
  newXPTotal?: number;
  levelUp?: boolean;
  newLevel?: number;
  newStreak?: number;
  newElo?: number;
  eloChange?: number;
  newBadges?: Array<{ id: string; name: string; icon: string }>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'mastery' | 'speed' | 'special' | 'block' | 'performance';
  xpReward?: number;
  earned?: boolean;
  earnedAt?: string | null;
}

export interface Block {
  id: number;
  name: string;
  description: string;
  modules: Module[];
  color: string;
  icon: string;
}

export interface Module {
  id: string;
  blockId: number;
  name: string;
  concepts: Concept[];
}

export interface DailyInsight {
  id: string;
  title: string;
  content: string;
  category: string;
  source?: string;
  mathFormula?: string;
}

export interface SkillLevel {
  subject: string;
  value: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  conceptsMastered: number;
  conceptsInProgress: number;
  totalSessions: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  dataCoins: number;
  errorBreakdown: Record<ErrorType, number>;
  recentActivity: ActivityItem[];
  skills?: SkillLevel[];
}

export interface ActivityItem {
  date: string;
  conceptId: string;
  conceptLabel: string;
  phase: number;
  xpEarned: number;
  accuracy: number;
}

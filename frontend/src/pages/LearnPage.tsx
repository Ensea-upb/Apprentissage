import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, X, Trophy, RefreshCw, Zap, AlertTriangle,
  CheckCircle, BarChart2,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import QuestionCard from '../components/learning/QuestionCard';
import LivesDisplay from '../components/learning/LivesDisplay';
import XPAnimation from '../components/learning/XPAnimation';
import StreakDisplay from '../components/learning/StreakDisplay';
import PhaseProgressBar from '../components/learning/PhaseProgressBar';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSessionStore } from '../stores/sessionStore';
import { useProgressStore } from '../stores/progressStore';
import { useAuthStore } from '../stores/authStore';
import { conceptsApi } from '../api/concepts';
import { Concept, ConceptProgress, ErrorType, SessionResult } from '../types';

const PHASE_LABELS = [
  'Intuition',
  'Mathématiques',
  'Pratique',
  'Quiz rapide',
  'Cas réel',
  'Maîtrise finale',
];

function getPhaseDescription(phase: number): string {
  const descs = [
    'Comprendre l\'idée fondamentale et l\'intuition derrière le concept.',
    'Explorer les formules mathématiques et les preuves.',
    'Appliquer le concept à des exemples concrets.',
    'Tester votre compréhension avec des questions variées.',
    'Résoudre un problème réel de Data Science.',
    'Validation finale — prouvez que vous maîtrisez le concept.',
  ];
  return descs[phase - 1] || '';
}

// Session completion modal
function SessionResultModal({
  result,
  conceptLabel,
  phase,
  onContinue,
  onExit,
}: {
  result: SessionResult;
  conceptLabel: string;
  phase: number;
  onContinue: () => void;
  onExit: () => void;
}) {
  const isExcellent = result.accuracy >= 80;
  const isPerfect = result.accuracy === 100;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass-elevated w-full max-w-md p-6 rounded-2xl shadow-2xl shadow-black/60"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Icon */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isPerfect
                ? 'bg-amber-900/30 border-2 border-amber-400'
                : isExcellent
                ? 'bg-emerald-900/30 border-2 border-emerald-500'
                : 'bg-violet-900/30 border-2 border-violet-500'
            }`}
          >
            {isPerfect ? (
              <Trophy size={36} className="text-amber-400" />
            ) : isExcellent ? (
              <CheckCircle size={36} className="text-emerald-400" />
            ) : (
              <Zap size={36} className="text-violet-400" />
            )}
          </motion.div>
          <h2 className="text-2xl font-bold text-white">
            {isPerfect ? 'Parfait !' : isExcellent ? 'Excellent !' : 'Bien joué !'}
          </h2>
          <p className="text-slate-400 mt-1 text-sm">
            Phase {phase} — {PHASE_LABELS[phase - 1]} terminée
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: 'Précision',
              value: `${Math.round(result.accuracy)}%`,
              color: result.accuracy >= 80 ? '#10B981' : result.accuracy >= 60 ? '#F59E0B' : '#F43F5E',
            },
            {
              label: 'XP gagné',
              value: `+${result.xpEarned}`,
              color: '#7C3AED',
            },
            {
              label: 'Réponses',
              value: `${result.correctAnswers}/${result.questionsAsked}`,
              color: '#06B6D4',
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card p-3 text-center">
              <p className="font-bold text-lg" style={{ color }}>{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Error breakdown */}
        {Object.values(result.errorBreakdown).some((v) => v > 0) && (
          <div className="glass-card p-3 mb-5">
            <p className="text-slate-400 text-xs mb-2 flex items-center gap-1.5">
              <BarChart2 size={12} />
              Erreurs par type
            </p>
            <div className="space-y-1.5">
              {(Object.entries(result.errorBreakdown) as [ErrorType, number][])
                .filter(([, count]) => count > 0)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs capitalize">{type}</span>
                    <span className="text-rose-400 text-xs font-medium">{count} erreur{count > 1 ? 's' : ''}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Level up banner */}
        {result.levelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-900/30 border border-amber-600/40 rounded-xl p-3 mb-4 text-center"
          >
            <p className="text-amber-400 font-bold text-sm">
              🎉 Niveau {result.newLevel} atteint !
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onExit}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Tableau de bord
          </button>
          {phase < 6 && (
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Phase {phase + 1}
              <Zap size={16} />
            </motion.button>
          )}
          {phase === 6 && (
            <motion.button
              onClick={onExit}
              whileHover={{ scale: 1.02 }}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Trophy size={16} />
              Maîtrisé !
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LearnPage() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const navigate = useNavigate();

  const { checkAuth } = useAuthStore();
  const { refreshProgress, conceptProgress } = useProgressStore();
  const {
    currentSession, currentQuestion, questions, questionIndex,
    lives, streak, sessionXP, answers, isLoading, error,
    conceptLabel, isSessionComplete,
    startSession, submitAnswer, nextQuestion, endSession, resetSession,
  } = useSessionStore();

  const [concept, setConcept] = useState<Concept | null>(null);
  const [conceptProgressData, setConceptProgressData] = useState<ConceptProgress | null>(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [phaseStarted, setPhaseStarted] = useState(false);
  const isEndingSession = useRef(false);

  useEffect(() => {
    if (conceptId) {
      loadConcept();
    }
    return () => {
      resetSession();
    };
  }, [conceptId]);

  // Update phase state from progress
  useEffect(() => {
    if (conceptId && conceptProgress[conceptId]) {
      const p = conceptProgress[conceptId];
      const done: number[] = [];
      if (p.phase1Done) done.push(1);
      if (p.phase2Done) done.push(2);
      if (p.phase3Done) done.push(3);
      if (p.phase4Done) done.push(4);
      if (p.phase5Done) done.push(5);
      if (p.phase6Done) done.push(6);
      setCompletedPhases(done);
      setConceptProgressData(p);

      // Start from first incomplete phase
      const nextPhase = done.length < 6 ? done.length + 1 : 6;
      setCurrentPhase(nextPhase);
    }
  }, [conceptId, conceptProgress]);

  // Watch for session completion (all questions answered)
  useEffect(() => {
    if (isSessionComplete && currentSession && !isEndingSession.current) {
      handleSessionEnd();
    }
  }, [isSessionComplete]);

  const loadConcept = async () => {
    try {
      const c = await conceptsApi.getById(conceptId!);
      setConcept(c);
    } catch (err) {
      console.error('Failed to load concept', err);
    }
  };

  const handleStartPhase = async (phase: number) => {
    setCurrentPhase(phase);
    setIsAnswered(false);
    setSelectedAnswer(undefined);
    setIsCorrect(undefined);
    setPhaseStarted(true);
    setSessionResult(null);
    setShowResultModal(false);
    await startSession(conceptId!, phase);
  };

  const handleAnswer = useCallback(
    async (answer: string, correct: boolean) => {
      if (isAnswered) return;

      setSelectedAnswer(answer);
      setIsAnswered(true);
      setIsCorrect(correct);

      if (correct) {
        const xp = 10 + (streak >= 2 ? 5 : 0);
        setXpAmount(xp);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 1500);
      }

      await submitAnswer(answer, correct, correct ? undefined : 'conceptual');
    },
    [isAnswered, streak, submitAnswer]
  );

  const handleNext = () => {
    // If no lives left, end the session after the user has seen the explanation
    if (lives === 0) {
      handleSessionEnd();
      return;
    }
    setIsAnswered(false);
    setSelectedAnswer(undefined);
    setIsCorrect(undefined);
    nextQuestion();
  };

  const handleSessionEnd = async () => {
    if (isEndingSession.current) return;
    isEndingSession.current = true;
    try {
      const result = await endSession();
      setSessionResult(result);
      setShowResultModal(true);
      setPhaseStarted(false);
      // Refresh user data and progress after session (XP/coins may have changed)
      await Promise.all([checkAuth(), refreshProgress()]);
    } catch (err) {
      console.error('Failed to end session', err);
    } finally {
      isEndingSession.current = false;
    }
  };

  const handleContinueNextPhase = () => {
    setShowResultModal(false);
    setSessionResult(null);
    const next = currentPhase + 1;
    if (next <= 6) {
      setCurrentPhase(next);
      handleStartPhase(next);
    }
  };

  const handlePhaseClick = (phase: number) => {
    if (completedPhases.includes(phase) || phase === currentPhase) {
      setCurrentPhase(phase);
      if (!phaseStarted) {
        handleStartPhase(phase);
      }
    }
  };

  const progressPercent = questions.length > 0
    ? (questionIndex / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col pt-16">
        {/* Session header bar */}
        <div
          className="sticky top-16 z-40 border-b border-white/5"
          style={{ backgroundColor: 'rgba(14, 14, 44, 0.98)', backdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Back button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>

              {/* Concept info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm truncate">
                    {concept?.label || conceptLabel || 'Chargement...'}
                  </span>
                  {concept && (
                    <span className="text-slate-600 text-xs hidden sm:inline">
                      {concept.blockName}
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                {phaseStarted && questions.length > 0 && (
                  <div className="mt-1.5">
                    <ProgressBar
                      value={questionIndex}
                      max={questions.length}
                      color="#7C3AED"
                      height={3}
                      animated={false}
                    />
                  </div>
                )}
              </div>

              {/* Lives, Streak, XP */}
              <div className="flex items-center gap-3">
                {phaseStarted && (
                  <>
                    <StreakDisplay streak={streak} showLabel={false} />
                    <LivesDisplay lives={lives} />
                    <div className="flex items-center gap-1 text-violet-400 text-sm font-bold">
                      <Zap size={13} className="fill-violet-400" />
                      {sessionXP}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-rose-900/30 border border-rose-700/40 rounded-xl p-4 mb-6"
            >
              <AlertTriangle size={18} className="text-rose-400 flex-shrink-0" />
              <div>
                <p className="text-rose-300 text-sm font-medium">Erreur</p>
                <p className="text-rose-400/70 text-xs mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => handleStartPhase(currentPhase)}
                className="ml-auto flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-sm transition-colors"
              >
                <RefreshCw size={14} />
                Réessayer
              </button>
            </motion.div>
          )}

          {/* Phase selector (when no active session) */}
          {!phaseStarted && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {concept?.label || 'Chargement...'}
                </h1>
                <p className="text-slate-400 text-sm">
                  Sélectionnez une phase pour commencer votre session d'apprentissage
                </p>
              </div>

              {/* Phase cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PHASE_LABELS.map((label, i) => {
                  const phaseNum = i + 1;
                  const isDone = completedPhases.includes(phaseNum);
                  const isCurrentOrNext = phaseNum === currentPhase;
                  const isLocked = phaseNum > currentPhase && !isDone;

                  return (
                    <motion.button
                      key={phaseNum}
                      onClick={() => !isLocked && handleStartPhase(phaseNum)}
                      disabled={isLocked}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                      className={`
                        p-4 rounded-xl border text-left transition-all duration-200
                        ${isDone
                          ? 'bg-emerald-900/15 border-emerald-700/30 cursor-pointer hover:border-emerald-600/50'
                          : isCurrentOrNext
                          ? 'bg-violet-900/20 border-violet-600/40 cursor-pointer glow-violet'
                          : 'bg-bg-elevated/30 border-white/5 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`
                          w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold
                          ${isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrentOrNext
                            ? 'bg-violet-600 text-white'
                            : 'bg-white/5 text-slate-600'
                          }
                        `}>
                          {isDone ? <CheckCircle size={16} /> : phaseNum}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${isDone ? 'text-emerald-300' : isCurrentOrNext ? 'text-white' : 'text-slate-500'}`}>
                            Phase {phaseNum}
                          </p>
                          <p className={`text-xs ${isDone ? 'text-emerald-500' : isCurrentOrNext ? 'text-violet-400' : 'text-slate-600'}`}>
                            {label}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {getPhaseDescription(phaseNum)}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Phase progress bar */}
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="flex-1">
                  <PhaseProgressBar
                    currentPhase={currentPhase}
                    completedPhases={completedPhases}
                    onPhaseClick={handlePhaseClick}
                  />
                </div>
                <div className="text-slate-500 text-xs whitespace-nowrap">
                  {completedPhases.length}/6 phases
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading state - generating questions */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner size="lg" label="L'IA génère vos questions..." />
              <p className="text-slate-500 text-xs mt-4 text-center max-w-xs">
                Questions personnalisées pour la phase {currentPhase}: {PHASE_LABELS[currentPhase - 1]}
              </p>
            </div>
          )}

          {/* Active session - questions */}
          {phaseStarted && !isLoading && currentQuestion && !isSessionComplete && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`question-${questionIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 relative"
              >
                {/* Phase & progress info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">
                      Phase {currentPhase}: {PHASE_LABELS[currentPhase - 1]}
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs">
                    {questionIndex + 1} / {questions.length}
                  </span>
                </div>

                {/* XP Animation overlay */}
                <div className="relative">
                  <XPAnimation
                    amount={xpAmount}
                    visible={showXP}
                    streakBonus={streak >= 3}
                  />
                </div>

                {/* Question card */}
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  isAnswered={isAnswered}
                  selectedAnswer={selectedAnswer}
                  isCorrect={isCorrect}
                  showExplanation={true}
                  onNext={isAnswered ? handleNext : undefined}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Session complete - waiting for result modal */}
          {isSessionComplete && !showResultModal && (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="md" label="Calcul des résultats..." />
            </div>
          )}
        </div>
      </div>

      {/* Result modal */}
      <AnimatePresence>
        {showResultModal && sessionResult && (
          <SessionResultModal
            result={sessionResult}
            conceptLabel={concept?.label || conceptLabel}
            phase={currentPhase}
            onContinue={handleContinueNextPhase}
            onExit={() => navigate('/dashboard')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

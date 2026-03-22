import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, AlertCircle, Lightbulb } from 'lucide-react';
import { Question } from '../../types';

// Safe KaTeX rendering without direct import issues
function MathText({ text }: { text: string }) {
  // Detect if text contains math notation
  const hasMath = text.includes('$') || text.includes('\\') || text.includes('^') || text.includes('_');

  if (!hasMath) {
    return <span>{text}</span>;
  }

  // Simple inline rendering: split on $...$ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          return (
            <code key={i} className="font-mono text-cyan-300 bg-cyan-900/20 px-1 rounded text-sm">
              {formula}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  isAnswered: boolean;
  selectedAnswer?: string;
  isCorrect?: boolean;
  showExplanation?: boolean;
  onNext?: () => void;
}

export default function QuestionCard({
  question,
  onAnswer,
  isAnswered,
  selectedAnswer,
  isCorrect,
  showExplanation = true,
  onNext,
}: QuestionCardProps) {
  const [inputValue, setInputValue] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMCQSelect = (option: string) => {
    if (isAnswered) return;
    const correct = option === question.correctAnswer;
    if (!correct) setShakeKey((k) => k + 1);
    onAnswer(option, correct);
  };

  const handleTrueFalse = (value: boolean) => {
    if (isAnswered) return;
    const answer = value ? 'true' : 'false';
    // Accept both 'true'/'false' and French 'Vrai'/'Faux' as correct answer formats
    const ca = question.correctAnswer.toLowerCase();
    const correctIsTrue = ca === 'true' || ca === 'vrai';
    const correct = value === correctIsTrue;
    if (!correct) setShakeKey((k) => k + 1);
    onAnswer(answer, correct);
  };

  const handleCompletionSubmit = () => {
    if (isAnswered || !inputValue.trim()) return;
    const trimmed = inputValue.trim().toLowerCase();
    const correct = trimmed === question.correctAnswer.toLowerCase() ||
      question.correctAnswer.toLowerCase().includes(trimmed);
    if (!correct) setShakeKey((k) => k + 1);
    onAnswer(inputValue.trim(), correct);
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return 'bg-bg-elevated border border-white/10 text-slate-200 hover:border-violet-500/60 hover:bg-violet-900/10 cursor-pointer';
    }
    if (option === question.correctAnswer) {
      return 'bg-emerald-900/30 border-2 border-emerald-500 text-emerald-200';
    }
    if (option === selectedAnswer && !isCorrect) {
      return 'bg-rose-900/30 border-2 border-rose-500 text-rose-200';
    }
    return 'bg-bg-elevated/50 border border-white/5 text-slate-500';
  };

  return (
    <div className="w-full space-y-6">
      {/* Question Text */}
      <motion.div
        key={`q-${question.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-violet-400 text-xs font-bold">Q</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {question.type === 'mcq' ? 'Choix multiple' :
                 question.type === 'truefalse' ? 'Vrai / Faux' :
                 question.type === 'completion' ? 'Complétion' :
                 question.type === 'analogy' ? 'Analogie' :
                 question.type === 'matching' ? 'Association' : 'Question'}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      i < question.difficulty ? 'bg-amber-400' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-white text-base leading-relaxed">
              <MathText text={question.question} />
            </p>
            {question.mathFormula && (
              <div className="mt-3 p-3 bg-bg-primary rounded-lg border border-white/5">
                <code className="font-mono text-cyan-300 text-sm">{question.mathFormula}</code>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Answer Area */}
      <motion.div
        key={shakeKey}
        animate={shakeKey > 0 && isAnswered && !isCorrect
          ? { x: [0, -8, 8, -8, 8, 0] }
          : {}}
        transition={{ duration: 0.4 }}
      >
        {/* MCQ Options */}
        {question.type === 'mcq' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option, i) => (
              <motion.button
                key={option}
                onClick={() => handleMCQSelect(option)}
                disabled={isAnswered}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={!isAnswered ? { y: -2, scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                className={`
                  answer-option relative p-4 rounded-xl text-left transition-all duration-200
                  ${getOptionStyle(option)}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    flex-shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center
                    ${!isAnswered ? 'border-white/20 text-slate-500' :
                      option === question.correctAnswer ? 'border-emerald-500 bg-emerald-500 text-white' :
                      option === selectedAnswer && !isCorrect ? 'border-rose-500 bg-rose-500 text-white' :
                      'border-white/10 text-slate-600'
                    }
                  `}>
                    {isAnswered && option === question.correctAnswer ? (
                      <Check size={12} strokeWidth={3} />
                    ) : isAnswered && option === selectedAnswer && !isCorrect ? (
                      <X size={12} strokeWidth={3} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="text-sm leading-relaxed">
                    <MathText text={option} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* True/False */}
        {question.type === 'truefalse' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: true, label: 'Vrai', icon: Check, color: 'emerald' },
              { value: false, label: 'Faux', icon: X, color: 'rose' },
            ].map(({ value, label, icon: Icon, color }) => {
              const answer = value ? 'true' : 'false';
              const isSelected = selectedAnswer === answer;
              const ca = question.correctAnswer.toLowerCase();
              const correctAnswer = value === (ca === 'true' || ca === 'vrai');

              let style = `bg-bg-elevated border border-white/10 text-slate-200 hover:border-${color}-500/60 hover:bg-${color}-900/10 cursor-pointer`;
              if (isAnswered) {
                if (correctAnswer) {
                  style = 'bg-emerald-900/30 border-2 border-emerald-500 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-900/30 border-2 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-bg-elevated/50 border border-white/5 text-slate-500';
                }
              }

              return (
                <motion.button
                  key={label}
                  onClick={() => handleTrueFalse(value)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.02, y: -3 } : {}}
                  whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  className={`
                    p-6 rounded-xl flex flex-col items-center gap-3 transition-all duration-200
                    ${style}
                  `}
                >
                  <Icon size={28} className={
                    isAnswered && correctAnswer ? 'text-emerald-400' :
                    isAnswered && isSelected && !isCorrect ? 'text-rose-400' :
                    value ? 'text-emerald-500' : 'text-rose-500'
                  } />
                  <span className="font-semibold text-lg">{label}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Completion / Text Input */}
        {(question.type === 'completion' || question.type === 'analogy') && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCompletionSubmit()}
                disabled={isAnswered}
                placeholder="Votre réponse..."
                className={`
                  flex-1 input-field text-base
                  ${isAnswered
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-900/20 text-emerald-200'
                      : 'border-rose-500 bg-rose-900/20 text-rose-200'
                    : ''
                  }
                `}
              />
              <motion.button
                onClick={handleCompletionSubmit}
                disabled={isAnswered || !inputValue.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-4 py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
            {isAnswered && !isCorrect && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-400"
              >
                Réponse correcte:{' '}
                <span className="text-emerald-400 font-semibold">{question.correctAnswer}</span>
              </motion.p>
            )}
          </div>
        )}
      </motion.div>

      {/* Feedback & Explanation */}
      <AnimatePresence>
        {isAnswered && showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`
              rounded-xl p-4 border space-y-3
              ${isCorrect
                ? 'bg-emerald-900/20 border-emerald-700/40'
                : 'bg-rose-900/20 border-rose-700/40'
              }
            `}>
              {/* Status */}
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {isCorrect ? (
                    <Check size={14} strokeWidth={3} className="text-white" />
                  ) : (
                    <X size={14} strokeWidth={3} className="text-white" />
                  )}
                </div>
                <span className={`font-semibold text-sm ${
                  isCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isCorrect ? 'Correct !' : 'Incorrect'}
                </span>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="flex items-start gap-2">
                  <Lightbulb size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <MathText text={question.explanation} />
                  </p>
                </div>
              )}

              {/* Common mistake */}
              {!isCorrect && question.commonMistake && (
                <div className="flex items-start gap-2">
                  <AlertCircle size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="text-orange-400 font-medium">Erreur fréquente: </span>
                    <MathText text={question.commonMistake} />
                  </p>
                </div>
              )}
            </div>

            {/* Next button */}
            {onNext && (
              <motion.button
                onClick={onNext}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 w-full btn-primary flex items-center justify-center gap-2"
              >
                Question suivante
                <ChevronRight size={18} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

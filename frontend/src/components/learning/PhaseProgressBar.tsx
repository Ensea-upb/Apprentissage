import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PHASES = [
  { num: 1, label: 'Intuition' },
  { num: 2, label: 'Maths' },
  { num: 3, label: 'Pratique' },
  { num: 4, label: 'Quiz' },
  { num: 5, label: 'Cas réel' },
  { num: 6, label: 'Maîtrise' },
];

interface PhaseProgressBarProps {
  currentPhase: number;
  completedPhases: number[];
  onPhaseClick?: (phase: number) => void;
  compact?: boolean;
}

export default function PhaseProgressBar({
  currentPhase,
  completedPhases,
  onPhaseClick,
  compact = false,
}: PhaseProgressBarProps) {
  return (
    <div className={`flex items-center gap-1 ${compact ? 'scale-90' : ''}`}>
      {PHASES.map((phase, index) => {
        const isCompleted = completedPhases.includes(phase.num);
        const isCurrent = currentPhase === phase.num;
        const isAccessible = isCompleted || isCurrent;

        return (
          <div key={phase.num} className="flex items-center">
            <motion.button
              onClick={() => isAccessible && onPhaseClick?.(phase.num)}
              disabled={!isAccessible || !onPhaseClick}
              className={`
                relative group flex flex-col items-center
                ${onPhaseClick && isAccessible ? 'cursor-pointer' : 'cursor-default'}
              `}
              whileHover={isAccessible && onPhaseClick ? { scale: 1.05 } : {}}
              title={`Phase ${phase.num}: ${phase.label}`}
            >
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-violet-600 text-white ring-2 ring-violet-400 ring-offset-2 ring-offset-bg-primary'
                    : 'bg-white/5 text-slate-600 border border-white/10'
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  phase.num
                )}
              </div>
              {!compact && (
                <span className={`text-xs mt-1 transition-colors duration-200 ${
                  isCurrent ? 'text-violet-400' : isCompleted ? 'text-emerald-500' : 'text-slate-600'
                }`}>
                  {phase.label}
                </span>
              )}
            </motion.button>

            {/* Connector line */}
            {index < PHASES.length - 1 && (
              <div className={`h-0.5 mx-1 transition-all duration-300 ${
                compact ? 'w-3' : 'w-6'
              } ${
                completedPhases.includes(phase.num) ? 'bg-emerald-500' : 'bg-white/10'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
